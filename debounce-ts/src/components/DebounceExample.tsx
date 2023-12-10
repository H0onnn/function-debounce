import { useState } from "react";
import debounce from "../utils/debounce";

const debouncedInputValue = debounce((debouncedValue: string) => {
  console.log("디바운싱 input", debouncedValue);
});

const debouncedButtonClick = debounce(
  () => {
    console.log("디바운싱 button");
  },
  1000,
  true
); // immediate true 적용

const DebounceExample = () => {
  const [inputValue, setInputValue] = useState<string>("");

  // eslint-disable-next-line
  const [buttonClickCount, setButtonClickCount] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    debouncedInputValue.debounced(e.target.value);
  };

  const handleButtonClick = () => {
    setButtonClickCount((prevCount) => prevCount + 1);
    console.log("디바운싱 button");

    debouncedButtonClick.debounced();
  };

  const handleCancelDebouncedButton = () => {
    debouncedButtonClick.cancel();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: "10px",
        padding: "20px",
        borderTop: "1px solid #000",
        borderBottom: "1px solid #000",
      }}
    >
      <p>디바운싱 예제 1</p>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="콘솔 창을 확인해보세요."
      />
      <button onClick={handleButtonClick}>클릭</button>
      <button onClick={handleCancelDebouncedButton}>취소</button>
    </div>
  );
};

export default DebounceExample;
