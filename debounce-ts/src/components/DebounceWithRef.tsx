import { useRef, useEffect, useState } from "react";
import debounce from "../utils/debounce";

const DebounceWithRef = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");
  const [buttonClickCount, setButtonClickCount] = useState<number>(0);

  // Input 입력 이벤트 값에 대한 디바운싱 처리
  const debouncedInputHandler = useRef(
    debounce((value: string) => {
      setDebouncedValue(value);
    })
  ).current;

  // Button 클릭 이벤트에 대한 디바운싱 처리
  const debouncedButtonHandler = useRef(
    debounce(
      () => {
        setButtonClickCount((prevCount) => prevCount + 1);
      },
      1000,
      true
    ) // wait = 1000ms, immediate = true 적용
  ).current;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedInputHandler.debounced(e.target.value);
  };

  const handleButtonClick = () => {
    debouncedButtonHandler.debounced();
  };

  useEffect(() => {
    // ex) 디바운스 처리된 값에 따른 검색 api 호출
    debouncedValue && console.log("디바운싱 input", debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    buttonClickCount && console.log("디바운싱 button", buttonClickCount);
  }, [buttonClickCount]);

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
        borderBottom: "1px solid #000",
      }}
    >
      <p>디바운싱 예제 3 : useRef 사용</p>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="콘솔 창을 확인해보세요."
      />
      <button onClick={handleButtonClick}>클릭</button>
      <button onClick={() => debouncedButtonHandler.cancel()}>취소</button>
    </div>
  );
};

export default DebounceWithRef;
