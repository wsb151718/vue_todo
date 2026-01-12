// Ensure process.env exists for @testing-library warnings in browser tests.
if (typeof globalThis.process === 'undefined') {
  globalThis.process = { env: { NODE_ENV: 'test' } }
} else if (!globalThis.process.env) {
  globalThis.process.env = { NODE_ENV: 'test' }
} else if (!('NODE_ENV' in globalThis.process.env)) {
  globalThis.process.env.NODE_ENV = 'test'
}
