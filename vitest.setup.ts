import "@testing-library/jest-dom/vitest";

// jsdom does not implement matchMedia; provide a minimal stub so components that
// read prefers-color-scheme / prefers-reduced-motion do not crash under test.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
