import React, { useState } from "react";
import useDebounce from "../hooks/useDebounce";

const DebounceWithHooks = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [buttonClickCount, setButtonClickCount] = useState<number>(0);

  // Input 입력 이벤트 값에 대한 디바운싱 처리
  const { debounced: debouncedInputHandler } = useDebounce((value: string) => {
    console.log("디바운싱 input", value);
  });

  // Button 클릭 이벤트에 대한 디바운싱 처리
  const {
    debounced: debouncedButtonHandler,
    cancel: cancelDebouncedButtonHandler,
  } = useDebounce(
    () => {
      setButtonClickCount((prevCount) => prevCount + 1);
      console.log("디바운싱 button", buttonClickCount + 1);
    },
    1000, // wait = 1000ms
    true // immediate = true 적용
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedInputHandler(e.target.value);
  };

  const handleButtonClick = () => {
    debouncedButtonHandler();
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
      }}
    >
      <p>디바운싱 예제 4 : useDebounce 훅 사용</p>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="콘솔 창을 확인해보세요."
      />
      <button onClick={handleButtonClick}>클릭</button>
      <button onClick={cancelDebouncedButtonHandler}>취소</button>
    </div>
  );
};

export default DebounceWithHooks;
