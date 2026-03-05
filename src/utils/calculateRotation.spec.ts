import { describe, it, expect } from 'vitest';
import { calculateRotation } from './calculateRotation';

describe('calculateRotation', () => {
    it('should calculate correct rotation string', () => {
        const rect = {
            left: 100,
            top: 100,
            width: 200,
            height: 200,
            bottom: 300,
            right: 300,
            x: 100,
            y: 100,
            toJSON: () => { }
        } as DOMRect;

        // Center is at mouseX 200, mouseY 200. rotation should be 0, 0
        expect(calculateRotation(200, 200, rect)).toBe('rotateX(0deg) rotateY(0deg)');

        // Mouse top-left inside bounds
        expect(calculateRotation(100, 100, rect)).toBe('rotateX(3deg) rotateY(-3deg)');

        // Mouse bottom-right inside bounds
        expect(calculateRotation(300, 300, rect)).toBe('rotateX(-3deg) rotateY(3deg)');

        // Output should be capped at -5 / 5
        expect(calculateRotation(0, 0, rect)).toBe('rotateX(5deg) rotateY(-5deg)');
        expect(calculateRotation(400, 400, rect)).toBe('rotateX(-5deg) rotateY(5deg)');
    });
});
