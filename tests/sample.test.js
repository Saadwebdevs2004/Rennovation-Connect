// tests/sample.test.js
const test = require('node:test');
const assert = require('node:assert');

test('🧪 Sample Unit Test - Basic Math Verification', () => {
  assert.strictEqual(1 + 1, 2, 'Basic mathematics should hold true.');
});

test('🧪 Sample System Test - Environment Port Validation', () => {
  const PORT = process.env.PORT || '3001';
  assert.ok(PORT, 'A default fallback or explicit API PORT must be defined.');
  assert.strictEqual(typeof PORT, 'string', 'PORT must resolve as a string value.');
});
