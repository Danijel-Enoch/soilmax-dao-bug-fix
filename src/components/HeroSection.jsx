import { ConnectWallet } from "@thirdweb-dev/react";

export default function HeroSection() {
  return (
    <section className="heroSection">
        {/* <Image className={styles.bg} src={heroBg} alt="hero background" /> */}

        <div className="heroContainer">
          {/* <div className={`${HomeStyles.leftCol} ${styles.leftCol}`}> */}
          <h1 className="heroTitle">Welcome to SoliMax DAO</h1>
          <p className="text">
            Subtext giving brief info on what SoliMax DAO is all about. Subtext
            giving brief info on what SoliMax DAO is all about. Subtext giving
            brief info on what SoliMax DAO is all about. Yeah yeah yeahhhhhh
          </p>
          {/* HERO BTN */}
          <button className="heroBtn">
            <a
              className="heroButtonLink"
              href="/"
            >
              <ConnectWallet />
            </a>
          </button>
        </div>

        {/* </div> */}
      </section>
  )
}
