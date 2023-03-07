import { Link } from "react-router-dom";
import { AddressZero } from "@ethersproject/constants";
import { GlobalAuth } from "../context/GlobalContext";
import { useContract, useSDK } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import emoji from "../components/assets/Emoji.svg";
import successMark from "../components/assets/success-icon.svg";

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
    shortenAddress,
  } = GlobalAuth();

  const [selectedProposal, setSelectedProposal] = useState("active");
  const [proposalDescription, setProposalDescription] = useState("");
  // const { contract } = useContract(
  //   "0x25c1bf6772142E523Eb1bcC54204E10DafA62839",
  //   "vote"
  // );

  const tokenContract = useContract(
    "0x40e7d561527C93830a590cd3d58BF0FdE78a6F2b",
    "token"
  );

  const sdk = useSDK();
  const { contract } = useContract(contractAddress, "vote");

  useEffect(() => {
    const contractAddress = sdk.deployer
      .deployVote({
        name: "My Vote",
        primary_sale_recipient: "0xA1E8EBeFFfADF8b8A0b1E19ae0fDFD6195F84B90",
        voting_token_address: "0x40e7d561527C93830a590cd3d58BF0FdE78a6F2b",
      })
      .then((res) => res)
      .catch((err) => console.log(err.message));
  });

  const proposalTitles = [
    {
      id: "active",
      title: "Active Proposals",
    },
    {
      id: "new",
      title: "New Proposals",
    },
  ];

  const submitVotes = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    //before we do async things, we want to disable the button to prevent double clicks
    setIsVoting(true);

    // lets get the votes from the form for the values
    const votes = proposals?.map((proposal) => {
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
              console.log(proposal.proposalId);

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
  };

  const submitNewProposal = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("submit proposal button clicked");

    const executions = [
      {
        // The contract you want to make a call to
        toAddress: "0x25c1bf6772142E523Eb1bcC54204E10DafA62839",
        // The amount of the native currency to send in this transaction
        nativeTokenValue: 0,
        // Transaction data that will be executed when the proposal is executed
        // This is an example transfer transaction with a token contract (which you would need to setup in code)
        transactionData: tokenContract.contract.encoder.encode("transfer", [
          "0xA1E8EBeFFfADF8b8A0b1E19ae0fDFD6195F84B90",
          0,
        ]),
      },
    ];

    const proposal = await contract
      .propose(proposalDescription, executions)
      .then((res) => console.log(res))
      .catch((err) => console.log(err.message));
  };

  return (
    <section className="membership-page heroSection">
      {/* <Image className={styles.bg} src={heroBg} alt="hero background" /> */}

      <div className="heroContainer">
        {/* <div className={`${HomeStyles.leftCol} ${styles.leftCol}`}> */}
        <h1 className="heroTitle">
          <img src={emoji} alt="emoji" /> DAO Member Page
        </h1>

        <p className="text" style={{ color: "#9CA3AF" }}>
          Congratulations on becoming a member!
        </p>

        <div className="grid">
          <section>
            <form>
              <p className="text">Member list</p>
              <div className="addressTokenGroup form">
                {memberList.length === 0 && <p>Nothing to show</p>}
                {memberList?.map((member) => (
                  <div key={member.address}>
                    <span className="address">
                      {shortenAddress(member.address)}
                    </span>
                    <span className="tokenAmt">{member.tokenAmount}</span>
                  </div>
                ))}
              </div>
            </form>
          </section>
          {/* Active proposals */}
          <section>
            <div className="title">
              {proposalTitles?.map((item) => (
                <button
                  key={item.id}
                  className={`text ${
                    item.id === selectedProposal ? `activeBtn` : ``
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedProposal(item.id)}
                >
                  {item.title}
                </button>
              ))}
            </div>
            {proposals.length === 0 &&
              selectedProposal === "active" &&
              !hasVoted && <p className="subtext">No Active proposals</p>}
            {proposals.length > 0 && selectedProposal === "active" && (
              <form className=" proposals" onSubmit={submitVotes}>
                <>
                  {proposals?.map((proposal) => (
                    <div key={proposal.proposalId} className="card">
                      <h5>{proposal.description}</h5>

                      <div
                        className={`radioBtnContainer ${
                          hasVoted && `justifyCenter`
                        }`}
                      >
                        {hasVoted ? (
                          <div
                            className="voteStatus"
                            style={{ color: "#A2A8FC", textAlign: "center" }}
                          >
                            You have voted
                          </div>
                        ) : (
                          proposal.votes.map(({ type, label }) => (
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
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </>

                <button
                  disabled={isVoting || hasVoted}
                  className="submit btn"
                  type="submit"
                  style={{ fontSize: "18px", fontWeight: "500", width: "100%" }}
                >
                  {isVoting ? "Voting..." : "Submit Votes"}
                </button>
              </form>
            )}

            {/* NEW PROPOSALS */}
            {selectedProposal === "new" && (
              <form className=" proposals" onSubmit={submitNewProposal}>
                <div className="newProposals">
                  <h5 className="text">Proposal</h5>
                  <label
                    htmlFor="title"
                    style={{
                      display: "flex",
                      marginTop: "16px",
                      gap: "10px",
                      alignItems: "flex-start",
                      flexDirection: "column",
                    }}
                  >
                    Title
                    <input type="text" placeholder="" />
                  </label>
                  <label htmlFor="">
                    <input
                      id="proposalDescription"
                      className=""
                      type="text"
                      onChange={(e) => {
                        setProposalDescription(e.target.value);
                        console.log(proposalDescription);
                      }}
                      // placeholder="Description of proposal"
                    />
                  </label>
                  <button
                    disabled={proposalDescription === ""}
                    className="submit btn"
                    type="submit"
                    style={{
                      fontSize: "18px",
                      fontWeight: "500",
                      width: "100%",
                      marginTop: "32.09px",
                    }}
                  >
                    {isVoting ? "Submitting..." : "Submit Proposal"}
                  </button>
                </div>
                {/* <div className="form" style={{paddingBlock: "95px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "26px"}}>
                    <img src={successMark} alt="success icon" width="72px" />
                    <h5 className="text" style={{textAlign: "center"}}>Proposal Successfully Submitted</h5>
                    <a href="/" style={{color: "#A2A8FC", marginTop: "8px"}}>Submit new proposal</a>
                </div> */}
              </form>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
