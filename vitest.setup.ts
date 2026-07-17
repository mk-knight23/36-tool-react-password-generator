import "@testing-library/jest-dom/vitest";

// jsdom in this config does not provide localStorage. Supply a minimal in-memory
// implementation so modules that persist tiny preferences (settings, AI quota)
// can be exercised in tests.
if (typeof window !== "undefined" && !window.localStorage) {
  const store = new Map<string, string>();
  const localStorageStub: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => void store.delete(key),
    setItem: (key: string, value: string) => void store.set(key, String(value)),
  };
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: localStorageStub,
  });
}

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
