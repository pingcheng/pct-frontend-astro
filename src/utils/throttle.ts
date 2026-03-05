/**
 * Throttle function to limit the rate of function calls
 * @param func The function to throttle
 * @param limit The time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  return (function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}