import DebounceExample from "./components/DebounceExample";
import DebounceWithUseCallback from "./components/DebounceWitUseCallback";
import DebounceWithRef from "./components/DebounceWithRef";
import DebounceWithHooks from "./components/DebounceWithHooks";

function App() {
  return (
    <div className="App">
      <h1
        style={{
          fontSize: "20px",
          textAlign: "center",
          margin: "18px 0",
        }}
      >
        디바운스 함수 구현하기
      </h1>
      <DebounceExample />
      <DebounceWithUseCallback />
      <DebounceWithRef />
      <DebounceWithHooks />
    </div>
  );
}

export default App;
