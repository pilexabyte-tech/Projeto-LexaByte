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
