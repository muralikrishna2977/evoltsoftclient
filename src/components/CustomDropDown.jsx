import { useState, useRef, useEffect } from "react";
import "./styles/CustomDropDown.css";
import downArrow from "../assets/downArrow.svg"; 

function CustomDropDown({ name, value, options, setOption, setSelectedOption }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  function handleSelectedOption(option) {
    if (setSelectedOption) {
      setSelectedOption(prev => ({
        ...prev,
        [name]: option,
      }));
    } else {
      setOption(option);
    }
    setOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="customDropDown" ref={dropdownRef}>
      <div className="dropDownButton" onClick={() => setOpen(prev => !prev)}>
        <p>{value==="addCard"?"None":value}</p>
        <img src={downArrow} height="10" width="10" alt="Toggle Dropdown" />
      </div>

      {open && (
        <div className="dropDownOptions">
          {options.map((option, index) => (
            <p
              className="dropDownOption"
              onClick={() => handleSelectedOption(option)}
              key={index}
            >
              {option}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomDropDown;
