import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { exponentialBackoff } from '../../../src/providers/exponential-backoff.js';

describe('exponentialBackoff', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test('returns null right after the last failed attempt', async () => {
        const start = Date.now();
        const calls: number[] = [];
        let settled = false;
        const result = exponentialBackoff(100, 3, 2, async () => {
            calls.push(Date.now() - start);
            return null;
        }).then((value) => {
            settled = true;
            return value;
        });

        // attempts at 0, 100 and 300 ms; nothing is left to wait for after the third
        await vi.advanceTimersByTimeAsync(300);

        expect(calls).toEqual([0, 100, 300]);
        expect(settled).toBe(true);
        await expect(result).resolves.toBeNull();
    });

    test('returns the first truthy result without waiting further', async () => {
        let attempt = 0;
        const result = exponentialBackoff(100, 5, 2, async () => {
            attempt += 1;
            return attempt === 2 ? 'ok' : null;
        });

        await vi.advanceTimersByTimeAsync(100);

        await expect(result).resolves.toBe('ok');
        expect(attempt).toBe(2);
    });
});
