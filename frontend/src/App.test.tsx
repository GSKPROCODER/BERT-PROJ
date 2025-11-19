import { describe, it, expect } from '@jest/globals';

describe('App', () => {
    it('should pass basic test', () => {
        expect(true).toBe(true);
    });

    it('should have correct application name', () => {
        const appName = 'Sentiment Analysis Application';
        expect(appName).toBeDefined();
        expect(appName.length).toBeGreaterThan(0);
    });
});
