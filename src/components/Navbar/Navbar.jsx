// import { NavLink } from "react-router-dom";
// import { Link } from "react-router-dom";
// import { NavHashLink } from "react-router-hash-link";
import NavButton from "./NavButton";
import navLogo from "../assets/nav-logo.svg";
import HamburgerIcon from "./HamburgerIcon";
import  { Link, NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [menuState, setMenuState] = useState(false);
  const [checkboxState, setCheckboxState] = useState(false);

  return (
    <header className="header" id="launchpad-header">
      <Link to="/">
        <img className="navLogo" src={navLogo} alt="logo" />
      </Link>

      <nav className="navbar">
        {/* MENU */}
        <ul className={`menu ${menuState ? `active` : ``}`}>
          <li
            className="menuItem"
            onClick={() => {
              setMenuState((prevState) => !prevState);
              setCheckboxState((prevState) => !prevState);
            }}
          >
            <NavLink to="/#about-us" className="navLink" smooth="true">
              About us
            </NavLink>
          </li>
          <li
            className="menuItem"
            onClick={() => {
              setMenuState((prevState) => !prevState);
              setCheckboxState((prevState) => !prevState);
            }}
          >
            <NavLink to="/#tokenomics" className="navLink" smooth="true">
              Tokenomics
            </NavLink>
          </li>
          <li
            className="menuItem"
            onClick={() => {
              setMenuState((prevState) => !prevState);
              setCheckboxState((prevState) => !prevState);
            }}
          >
            <Link to="/#roadmap" className="navLink" smooth="true">
              Roadmap
            </Link>
          </li>
          <li
            className="menuItem"
            onClick={() => {
              setMenuState((prevState) => !prevState);
              setCheckboxState((prevState) => !prevState);
            }}
          >
            <Link to="/launchpad" className="navLink" smooth="true">
              Launchpad
            </Link>
          </li>
          {/* <li
            className="menuItem"
            onClick={() => {
              setMenuState((prevState) => !prevState);
              setCheckboxState((prevState) => !prevState);
            }}
          >
            <NavLink to="/launchpad/staking" className="navLink" smooth="true">
              Staking
            </NavLink>
          </li> */}
          <li
            className="menuItem"
            onClick={() => {
              setMenuState((prevState) => !prevState);
              setCheckboxState((prevState) => !prevState);
            }}
          >
            <Link to="/#how-to-buy" className="navLink" smooth="true">
              How to buy
            </Link>
          </li>
          <li
            className="menuItem"
            onClick={() => {
              setMenuState((prevState) => !prevState);
              setCheckboxState((prevState) => !prevState);
            }}
          >
            <Link to="/#contact" className="navLink" smooth="true">
              Contact us
            </Link>
          </li>

          <div className="" id="mobileBtn">
            <NavButton
              link="/launchpad"
              value="SLM LaunchPad"
              setMenuState={setMenuState}
              setCheckboxState={setCheckboxState}
            />
          </div>
        </ul>
      </nav>
      <div className="" id="desktopBtn">
        <NavButton
          link="/launchpad"
          value="SLM LaunchPad"
          setMenuState={setMenuState}
          setCheckboxState={setCheckboxState}
        />
      </div>

      {/* MENU ICON */}
      <HamburgerIcon setMenuState={setMenuState}
          setCheckboxState={setCheckboxState} menuState={menuState} />
    </header>
  );
}
