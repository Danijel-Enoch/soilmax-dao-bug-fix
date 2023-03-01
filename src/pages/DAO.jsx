import { ConnectWallet } from "@thirdweb-dev/react";
import heroBg from "../components/assets/hero-bg.png";

export default function DAO() {
  return (
    <section className="dao heroSection">
      <img className="bg" src={heroBg} alt="hero background" />

      <div className="heroContainer">
        <h1 className="heroTitle">Welcome to SoliMax DAO</h1>
        <p className="text">
          Subtext giving brief info on what SoliMax DAO is all about. Subtext
          giving brief info on what SoliMax DAO is all about. Subtext giving
          brief info on what SoliMax DAO is all about. Yeah yeah yeahhhhhh
        </p>
        {/* HERO BTN */}
        <ConnectWallet
          className="connectWallet"
        />
      </div>
    </section>
  );
}
