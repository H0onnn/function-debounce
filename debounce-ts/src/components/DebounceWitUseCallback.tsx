import { useState, useCallback } from "react";
import debounce from "../utils/debounce";

const DebounceWithUseCallback = () => {
  const [inputValue, setInputValue] = useState<string>("");

  // eslint-disable-next-line
  const [buttonClickCount, setButtonClickCount] = useState<number>(0);

  const debouncedInputValue = useCallback(() => {
    const { debounced, cancel } = debounce((debouncedValue: string) => {
      console.log("디바운싱 input", debouncedValue);
    });

    return { debounced, cancel };
  }, []);

  const debouncedButtonClick = useCallback(() => {
    const { debounced, cancel } = debounce(
      () => {
        setButtonClickCount((prevCount) => prevCount + 1);
        console.log("디바운싱 button");
      },
      1000,
      true
    );

    return { debounced, cancel };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedInputValue().debounced(e.target.value);
  };

  const handleButtonClick = () => {
    debouncedButtonClick().debounced();
  };

  const handleCancelDebouncedButton = () => {
    debouncedButtonClick().cancel();
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
        borderBottom: "1px solid #000",
      }}
    >
      <p>디바운싱 예제 2 : useCallback 사용</p>
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

export default DebounceWithUseCallback;
