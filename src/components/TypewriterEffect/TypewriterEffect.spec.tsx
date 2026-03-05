import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { TypewriterEffect } from './TypewriterEffect';

describe('TypewriterEffect', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should slowly type out text', () => {
        const { container } = render(<TypewriterEffect text="Hello" speed={10} delay={0} />);

        expect(container.textContent).toBe('|');

        // Loop through each character to allow React renders to schedule the next timeout
        const text = "Hello";
        let expected = "";
        for (let i = 0; i < text.length; i++) {
            act(() => {
                vi.advanceTimersByTime(10);
            });
            expected += text[i];
            expect(container.textContent).toBe(expected + '|');
        }
    });

    it('should respect delay prop', () => {
        const { container } = render(<TypewriterEffect text="Hi" speed={10} delay={100} />);

        act(() => {
            vi.advanceTimersByTime(50);
        });
        expect(container.textContent).toBe('|'); // Still empty

        act(() => {
            vi.advanceTimersByTime(50); // Reaches 100ms
        });
        // Initial delay triggers the first character
        expect(container.textContent).toBe('H|');

        act(() => {
            vi.advanceTimersByTime(10); // Reaches next char
        });
        expect(container.textContent).toBe('Hi|');
    });

    it('should fire onComplete when finished', () => {
        const onCompleteMock = vi.fn();
        render(<TypewriterEffect text="A" speed={10} delay={0} onComplete={onCompleteMock} />);

        act(() => {
            vi.advanceTimersByTime(10);
        });

        expect(onCompleteMock).toHaveBeenCalledTimes(1);
    });

    it('should hide cursor when cursor prop is false', () => {
        const { container } = render(<TypewriterEffect text="A" speed={10} cursor={false} className="no-cursor-test" />);
        const spanElement = container.querySelector('.no-cursor-test');
        // Initial render without cursor should be exactly empty text
        expect(spanElement?.textContent).toBe('');
    });
});
