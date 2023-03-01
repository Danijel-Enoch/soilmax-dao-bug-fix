import { Link } from "react-router-dom";
import { AddressZero } from "@ethersproject/constants";
import { GlobalAuth } from "../context/GlobalContext";

export default function Membership() {
  const {
    memberList,
    proposals,
    setIsVoting,
    setHasVoted,
    isVoting,
    hasVoted,
    token,
    address,
    vote,
  } = GlobalAuth();

  return (
    <section className="membership-page heroSection">
      {/* <Image className={styles.bg} src={heroBg} alt="hero background" /> */}

      <div className="heroContainer">
        {/* <div className={`${HomeStyles.leftCol} ${styles.leftCol}`}> */}
        <h1 className="heroTitle">🍪DAO Member Page</h1>

        <p className="text">Congratulations on becoming a member!</p>

        <div className="grid">
          {/* member list */}
          <section>
            <form>
              <p className="text">Member list</p>
              <div className="addressTokenGroup div">
                <input
                  className="address"
                  type="text"
                  name=""
                  id="address"
                  placeholder="Address"
                />
                <input
                  className="tokenAmt"
                  type="number"
                  name=""
                  id="token-amount"
                  placeholder="Token Amount"
                />
              </div>
              <Link to="/createContract" className="createContractBtn">
                Create personal proposals
              </Link>
            </form>
          </section>
          {/* Active proposals */}
          <section>
            <p className="text">Active Proposals</p>
            <form
              className="div proposals"
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await token.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await token.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await vote.get(proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return vote.vote(proposalId, _vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await vote.get(proposalId);

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {" "}
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <label
                          className="radioBtns"
                          htmlFor={proposal.proposalId + "-" + type}
                        >
                          <input
                            type="radio"
                            name={proposal.proposalId}
                            value={type}
                            id={proposal.proposalId + "-" + type}
                            //default the "abstain" vote to checked
                            defaultChecked={type === 2}
                          />
                          <div className="circle"></div>
                          {label}
                        </label>
                        {/* <label className="radioBtns">
                          <input type="radio" name="radio" />
                          <div className="circle"></div>
                          For
                        </label>
                        <label className="radioBtns">
                          <input type="radio" name="radio" />
                          <div className="circle"></div>
                          Abstain
                        </label> */}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </form>

            {/* <button className="heroBtn">
              <a className="heroButtonLink" href="/">
                Submit votes
              </a>
            </button> */}
            <button
              disabled={isVoting || hasVoted}
              className="heroBtn"
              type="submit"
            >
              {isVoting
                ? "Voting..."
                : hasVoted
                ? "You Already Voted"
                : "Submit Votes"}
            </button>
            {!hasVoted && (
              <p className="subtext">
                This will trigger multiple transactions that you’ll need to
                sign!
              </p>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
