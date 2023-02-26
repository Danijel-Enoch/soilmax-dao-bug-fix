import { Web3Button } from "@thirdweb-dev/react";
import heroBg from "../components/assets/hero-bg.svg";

export default function DAOMinting({ editionDropAddress }) {
  return (
    <section className="mint-nft heroSection">
      <img className="bg" src={heroBg} alt="hero background" />

      <div className="heroContainer">
        {/* <div className={`${HomeStyles.leftCol} ${styles.leftCol}`}> */}
        <h1 className="heroTitle">
          Mint your free 🍪 DAO <br />
          Membership NFT
        </h1>

        {/* HERO BTN */}
        <button className="heroBtn">
          <Web3Button
            contractAddress={editionDropAddress}
            action={(contract) => {
              contract.erc1155.claim(0, 1);
            }}
            onSuccess={() => {
              console.log(`🌊 Successfully Minted!`);
            }}
            onError={(error) => {
              console.error("Failed to mint NFT", error);
            }}
          >
            Mint your NFT (FREE)
          </Web3Button>
        </button>
      </div>

      {/* </div> */}
    </section>
  );
}
