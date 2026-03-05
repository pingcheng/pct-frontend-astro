import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { throttle } from './throttle';

describe('throttle', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should call the function immediately on the first call', () => {
        const fn = vi.fn();
        const throttledFn = throttle(fn, 100);
        throttledFn();
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should not call the function again before the limit has passed', () => {
        const fn = vi.fn();
        const throttledFn = throttle(fn, 100);
        throttledFn();
        throttledFn();
        expect(fn).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(50);
        throttledFn();
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should call the function again after the limit has passed', () => {
        const fn = vi.fn();
        const throttledFn = throttle(fn, 100);
        throttledFn();

        vi.advanceTimersByTime(100);
        throttledFn();
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments to the original function', () => {
        const fn = vi.fn();
        const throttledFn = throttle(fn, 100);
        throttledFn('arg1', 42);
        expect(fn).toHaveBeenCalledWith('arg1', 42);
    });
});
