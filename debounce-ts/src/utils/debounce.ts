/* eslint-disable */

/**
 * @description 디바운스 함수 구현하기
 *
 * @param {Function} func - 디바운스가 적용 될 함수
 * @param {number} wait - 대기 시간 설정 (ms 단위로 500은 0.5초를 나타냄) (기본 값 : 500)
 * @param {boolean} immediate - true일 때, wait 시간 동안 대기하지 않고 func를 즉시 실행 (기본 값 : false)
 * @returns {Function} - 디바운스가 적용된 함수 리턴
 *
 * @example
 * const debouncedConsole = debounce(() => console.log('데브디'), 500); => 이벤트가 끝난 후 0.5초 뒤에 콘솔 실행
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
