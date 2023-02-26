import Navbar from "../components/Navbar/Navbar";
import heroBg from "../components/assets/hero-bg.svg";

export default function CreateContract() {
  return (
    <div className="createContract">
      <Navbar />

      <section className="heroSection">
        {/* <Image className="bg" src={heroBg} alt="hero background" /> */}

        <div className="heroContainer">
          {/* <div className={`${HomeStyles.leftCol} ${styles.leftCol}`}> */}
          <h1 className="heroTitle">🍪 Create my own contract</h1>

          <div className="container">
            <label htmlFor="">Contract</label>
            <input type="text" placeholder="Name of Contract" />
            <button className="heroBtn">
              <a className="heroButtonLink" href="/">
                Submit Contract
              </a>
            </button>
          </div>
        </div>

        {/* </div> */}
      </section>
    </div>
  );
}
