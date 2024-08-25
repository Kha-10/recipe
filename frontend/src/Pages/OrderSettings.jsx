import { useState } from "react";

function OrderSettings() {
  const [inputType, setInputType] = useState("number");
  const [inputValue, setInputValue] = useState("");

  const formatNumber = (value) => {
    if (!value) return value;
    return parseInt(value).toLocaleString();
  };

  const unformatNumber = (value) => {
    if (!value) return value;
    return value.split(',').join('');
  };

  const handleFocus = () => {
    setInputType("number");
    if(inputValue) {
        setInputValue(unformatNumber(inputValue))
    }
  };

  const handleBlur = () => {
    setInputType("text");
    setInputValue(formatNumber(inputValue));
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="max-w-screen-lg mx-auto z-50">
      <label htmlFor="switchInput">Switch Input Type:</label>
      <input
        id="switchInput"
        type={inputType}
        value={inputValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </div>
  );
}

export default OrderSettings;