import { Link } from "react-router-dom";

export default function NavButton({ value, link, setCheckboxState, setMenuState }) {

  return (
    <Link
      to={link}
      onClick={() => {
        setMenuState((prevState) => !prevState);
        setCheckboxState((prevState) => !prevState);
      }}
      className="navBtn"
    >
      {value}
    </Link>
  );
}
