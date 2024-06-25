// learn more: https://github.com/testing-library/jest-dom
// eslint-disable-next-line import/no-extraneous-dependencies
import "@testing-library/jest-dom";

// @ts-expect-error - Mock for Terminal tests
HTMLCanvasElement.prototype.getContext = vi.fn();

// Mock the i18n provider
