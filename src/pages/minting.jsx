import { Web3Button } from "@thirdweb-dev/react";
import heroBg from "../components/assets/hero-bg.png";
import { GlobalAuth } from "../context/GlobalContext";
import emoji from "../components/assets/Emoji.svg";

export default function NFTMinting() {
  const { editionDropAddress } = GlobalAuth();

  return (
    <section className="mint-nft heroSection">
      <img className="bg" src={heroBg} alt="hero background" />

      <div className="heroContainer">
        <h1 className="heroTitle">
          Mint your free DAO <img src={emoji} alt="emoji" /> <br />
          Membership NFT
        </h1>

        {/* HERO BTN */}
        <Web3Button
          className="connectWallet"
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
      </div>
    </section>
  );
}
