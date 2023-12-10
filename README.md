# 디바운스 함수 구현

### 목표
연속적인 이벤트의 효율적인 처리를 위한 `debounce` 함수를 구현하고, 함수가 적용된 간단한 예제 코드를 작성합니다.

> 디바운스 유틸 함수는 [debounce.ts](https://github.com/H0onnn/function-debounce/tree/main/debounce-ts/src/utils) 에서, 커스텀 훅은 [useDebounce.ts](https://github.com/H0onnn/function-debounce/tree/main/debounce-ts/src/hooks)에서 확인할 수 있습니다.
>
> `TypeScript` 를 사용해 개발하였으며, `react` 환경에서의 간단한 예제를 포함합니다.
<br />

## 프로젝트 실행 가이드

- 실행을 위해 다음 Node version이 필요합니다.
  [Node.js 18.17.0](https://nodejs.org/ca/blog/release/v18.17.0/)

- 실행 방법 (2가지 중 택 1)
  > 1. ZIP 파일 다운로드 및 압축 풀기 후 코드 에디터로 실행
  > 2. 아래 커멘드를 이용한 실행

```bash
$ git clone https://github.com/H0onnn/related-keyword.git
$ cd debounce-ts
$ npm install
$ npm run start
```

<br />

#### [Assignment 1] debounce 함수 구현

- 마지막 이벤트만을 처리하는 디바운스 함수를 구현합니다.
- 디바운스 함수는 func, wait, immediate 세 개의 인자를 받습니다.
- immediate 옵션을 통해 첫 번째 func 호출을 즉시 실행할 수 있습니다.
- 디바운스 적용을 취소하는 cancel 메소드를 지원합니다.

<details>
  <summary>deounce 함수 코드 보기</summary>

  ```ts
  // debounce.ts
/**
 * @description 디바운스 함수 구현하기
 *
 * @param {Function} func - 디바운스가 적용 될 함수
 * @param {number} wait - 대기 시간 설정 (ms 단위로 500은 0.5초를 나타냄) (기본 값 : 500)
 * @param {boolean} immediate - true일 때, wait 시간 동안 대기하지 않고 func를 즉시 실행 (기본 값 : false)
 * @returns {Function} - 디바운스가 적용된 함수 리턴
 *
 * @example
 * const debouncedConsole = debounce(() => console.log('console !'), 500); => 이벤트가 끝난 후 0.5초 뒤에 콘솔 실행
 */

interface DebounceFunctionReturnTypes<T extends (...args: any[]) => any> {
  debounced: (...args: Parameters<T>) => Promise<ReturnType<T>>;
  cancel: () => void;
}

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number = 500,
  immediate: boolean = false
): DebounceFunctionReturnTypes<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  let setPromiseResolve: (value: ReturnType<T> | null) => void;

  const debounced = (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise<ReturnType<T>>((res) => {
      const runImmediately = immediate && timeoutId === null;

      if (runImmediately) {
        res(func(...args));
      }

      const delay = () => {
        timeoutId = null;

        if (immediate === false) {
          res(func(...args));
        }
      };

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      setPromiseResolve = res as (value: ReturnType<T> | null) => void;

      timeoutId = setTimeout(delay, wait);
    });
  };

  const cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;

      if (setPromiseResolve) {
        setPromiseResolve(null);
      }
    }
  };

  return { debounced, cancel };
};

export default debounce;
  ```
</details>

#### [Assignment 2] debounce 함수 적용 예시

**1. react 컴포넌트 내에서의 input, button 이벤트 처리**

- 작성된 디바운스 함수를 적용해 input의 입력 이벤트와 button의 클릭 이벤트를 처리하는 간단한 예제를 작성했습니다.
- 디바운스 함수가 반복적으로 재생성되는 것을 방지하기 위해 컴포넌트 외부에 함수를 선언하고, 컴포넌트 내부에서 디바운스가 적용될 값을 전달하는 방식을 사용했습니다.

<details>
  <summary>코드 보기</summary>

```tsx
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
    <div>
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
```
</details>

**2. `useCallback` 을 이용한 예제 2번**

- 위 1번 예제의 경우 함수를 컴포넌트 외부에서 선언하기 때문에 컴포넌트 내부의 `state` 혹은 `props` 에 직접적으로 접근하기 어렵다는 단점이 있었습니다.
- 이를 위해 함수를 컴포넌트 내부로 이동하고, `useCallback` 훅을 사용하여 메모제이션 함으로써 함수의 재생성을 방지하는 2번 예제를 작성해보았습니다.

<details>
  <summara>코드 보기</summara>

  ```tsx
  import { useState, useCallback } from "react";
import debounce from "../utils/debounce";

const DebounceWithUseCallback = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [buttonClickCount, setButtonClickCount] = useState<number>(0);

  const debouncedInputValue = useCallback(
    debounce((debouncedValue: string) => {
      console.log("디바운싱 input", debouncedValue);
    }).debounced,
    []
  );

  // 버튼 클릭에 대한 디바운싱 함수
  const debouncedButton = useCallback(
    debounce(
      () => {
        setButtonClickCount((prevCount) => prevCount + 1);
        console.log("디바운싱 button");
      },
      1000,
      true
    ).debounced,
    []
  );

  // 버튼 클릭 디바운싱 취소 함수
  const cancelButtonDebounce = useCallback(
    debounce(
      () => {
        console.log("디바운싱 button cancel");
      },
      1000,
      true
    ).cancel,
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    debouncedButton();
  };

  const handleCancelDebouncedButton = () => {
    cancelButtonDebounce();
  };

  return (
    // return ...
  );
};

export default DebounceWithUseCallback;
```
</details>

**3. `useRef` 를 이용한 예제 3번**

- 2번 예제에서 사용한 `useCallback` 훅의 경우 메모리에 함수를 메모제이션 하기 때문에 불필요한 메모리 사용이 발생할 수 있다는 단점을 가지며, 의존성 배열을 관리해주어야 한다는 불편함이 있었습니다.
- 이에 메모리를 사용하지 않고, 참조 값을 저장하여 사용하는 `useRef` 를 이용한 3번 예제를 작성해보았습니다. 

<details>
  <summary>코드 보기</summary>

  ```ts
  import { useRef, useEffect, useState } from "react";
import debounce from "../utils/debounce";

const DebounceWithRef = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");
  const [buttonClickCount, setButtonClickCount] = useState<number>(0);

  // Input 디바운싱 처리를 위한 ref
  const debouncedInputRef = useRef(
    debounce((value: string) => {
      setDebouncedValue(value);
    })
  );

  // Button 디바운싱 처리를 위한 ref
  const debouncedButtonRef = useRef(
    debounce(
      () => {
        setButtonClickCount((prevCount) => prevCount + 1);
      },
      1000, // wait = 1000ms
      true // immediate = true
    )
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedInputRef.current.debounced(e.target.value);
  };

  const handleButtonClick = () => {
    debouncedButtonRef.current.debounced();
  };

  const handleCancelDebouncedButton = () => {
    debouncedButtonRef.current.cancel();
  };

  useEffect(() => {
    // ex) 디바운스 처리된 값에 따른 검색 api 호출
    debouncedValue && console.log("디바운싱 input", debouncedValue);
  }, [debouncedValue]);

  useEffect(() => {
    buttonClickCount && console.log("디바운싱 button", buttonClickCount);
  }, [buttonClickCount]);

  return (
   // return ...
  );
};

export default DebounceWithRef;
  ```
</details>

**4. 커스텀 훅을 이용한 예제 4번**

- 위에서 작성한 디바운스 유틸 함수를 react의 커스텀 훅으로 재구성해 보았습니다.
- `useEffect` 의 클린업 함수를 이용해 컴포넌트 언마운트시 `clearTimeout` 함수로 기존의 timer를 초기화 합니다.

<details>
  <summary>커스텀 훅 코드 보기</summary>

  ```ts
// useDebounce.ts
import { useState, useEffect } from "react";

interface UseDebounceReturnTypes<T extends (...args: any[]) => any> {
  debounced: (...args: Parameters<T>) => Promise<ReturnType<T>>;
  cancel: () => void;
}

const useDebounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number = 500,
  immediate: boolean = false
): UseDebounceReturnTypes<T> => {
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [promiseResolve, setPromiseResolve] = useState<
    ((value: ReturnType<T> | null) => void) | null
  >(null);

  const debounced = (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise<ReturnType<T>>((res) => {
      const runImmediately = immediate && timeoutId === null;

      if (runImmediately) {
        res(func(...args));
      }

      const delay = () => {
        if (immediate === false) {
          res(func(...args));
        }

        setTimeoutId(null);
      };

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      setPromiseResolve(res as (value: ReturnType<T> | null) => void);

      setTimeoutId(setTimeout(delay, wait));
    });
  };

  const cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);

      if (promiseResolve) {
        setPromiseResolve(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return { debounced, cancel };
};

export default useDebounce;
```
</details>

<details>
  <summary>적용 예시</summary>

```tsx
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

  const handleCancelDebouncedButton = () => {
    cancelDebouncedButtonHandler();
  };

  return (
   // return ...
  );
};

export default DebounceWithHooks;
```
</details>
