
export default function HamburgerIcon({
  setMenuState,
  setCheckboxState,
  checkboxState,
}) {
  return (
    <div className="hamburger">
      <input
        className="input"
        type="checkbox"
        checked={checkboxState ? `checked` : ``}
        onChange={() => {
          setMenuState((prevState) => !prevState);
          setCheckboxState((prevState) => !prevState);
        }}
      />
      <span
        className={`${checkboxState ? `checked checkedSpan1` : ``} span span1`}
      ></span>
      <span
        className={`${checkboxState ? `checked checkedSpan2` : ``} span span2`}
      ></span>
      <span
        className={`${checkboxState ? `checked checkedSpan3` : ``} span span3`}
      ></span>
    </div>
  );
}
