import { describe, it, expect, vi, afterEach } from 'vitest';
import { getDurationString } from './getDurationString';

describe('getDurationString', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return correct duration in years and months', () => {
        expect(getDurationString('Jan 2020', 'Jan 2022')).toBe('2 years');
        expect(getDurationString('Jan 2020', 'Feb 2022')).toBe('2 years and 1 month');
        expect(getDurationString('Jan 2020', 'Mar 2022')).toBe('2 years and 2 months');
        expect(getDurationString('Aug 2019', 'Sept 2021')).toBe('2 years and 1 month');
    });

    it('should handle just months correctly', () => {
        expect(getDurationString('Jan 2022', 'May 2022')).toBe('4 months');
        expect(getDurationString('Jan 2022', 'Feb 2022')).toBe('1 month');
    });

    it('should handle Present correctly', () => {
        // Mock the current date to a fixed point in time
        const mockDate = new Date(2022, 0, 1).valueOf(); // Jan 2022
        const spy = vi.spyOn(Date, 'now').mockImplementation(() => mockDate);

        expect(getDurationString('Jan 2021', 'Present')).toBe('1 year');
        expect(getDurationString('Nov 2021', 'Present')).toBe('2 months');

        spy.mockRestore();
    });

    it('should fallback securely on partial overlaps', () => {
        // E.g. less than a month
        expect(getDurationString('Jan 2022', 'Jan 2022')).toBe('Less than a month');
    });
});
