// Jest setup: polyfill TextEncoder/TextDecoder for jsdom
const util = require('util');
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = util.TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = util.TextDecoder;
}

// Minimal IntersectionObserver polyfill for jsdom tests
if (typeof global.IntersectionObserver === 'undefined') {
  class IntersectionObserverMock {
    constructor(callback) { this._callback = callback; }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  global.IntersectionObserver = IntersectionObserverMock;
}

// Provide fetch for jsdom tests when the environment does not include it.
if (typeof global.fetch === 'undefined' || typeof globalThis.fetch === 'undefined' ||
    (typeof global.window !== 'undefined' && typeof global.window.fetch === 'undefined')) {
  let fetchImpl = undefined;

  if (typeof globalThis.fetch !== 'undefined') {
    fetchImpl = globalThis.fetch;
  } else {
    try {
      const fetchModule = require('node-fetch');
      fetchImpl = fetchModule;
      if (fetchModule.Headers) global.Headers = fetchModule.Headers;
      if (fetchModule.Request) global.Request = fetchModule.Request;
      if (fetchModule.Response) global.Response = fetchModule.Response;
    } catch (error) {
      console.warn('Fetch is not available in the Jest jsdom environment:', error.message);
    }
  }

  if (fetchImpl) {
    global.fetch = fetchImpl;
    globalThis.fetch = fetchImpl;
    if (typeof global.window !== 'undefined') {
      global.window.fetch = fetchImpl;
      if (typeof global.window.Headers === 'undefined' && global.Headers) {
        global.window.Headers = global.Headers;
      }
      if (typeof global.window.Request === 'undefined' && global.Request) {
        global.window.Request = global.Request;
      }
      if (typeof global.window.Response === 'undefined' && global.Response) {
        global.window.Response = global.Response;
      }
    }
  }
}
