/**
 * Comprehensive Assertion Library for E2E Test Suite
 * Asson Clothing Brand E-Commerce Platform
 */

export class AssertionError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
  }
}

/**
 * Asserts that a condition is truthy.
 */
export function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new AssertionError(message, condition, true);
  }
}

/**
 * Asserts strict equality (===) between actual and expected.
 */
export function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    const msg = message || `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`;
    throw new AssertionError(msg, actual, expected);
  }
}

/**
 * Helper to canonicalize objects for deep comparison.
 */
function canonicalize(val) {
  if (val === null || typeof val !== 'object') {
    return val;
  }
  if (Array.isArray(val)) {
    return val.map(canonicalize);
  }
  const sorted = {};
  for (const key of Object.keys(val).sort()) {
    sorted[key] = canonicalize(val[key]);
  }
  return sorted;
}

/**
 * Asserts deep structural equality between two objects or arrays.
 */
export function assertDeepEqual(actual, expected, message) {
  const actualStr = JSON.stringify(canonicalize(actual));
  const expectedStr = JSON.stringify(canonicalize(expected));
  if (actualStr !== expectedStr) {
    const msg = message || `Deep equality assertion failed.\nExpected: ${expectedStr}\nActual:   ${actualStr}`;
    throw new AssertionError(msg, actual, expected);
  }
}

/**
 * Asserts that actual matches the given RegExp.
 */
export function assertMatch(actual, regex, message) {
  const str = String(actual);
  if (!regex.test(str)) {
    const preview = str.length > 200 ? str.slice(0, 200) + '...' : str;
    const msg = message || `Expected string to match ${regex}, but got:\n${preview}`;
    throw new AssertionError(msg, actual, regex);
  }
}

/**
 * Asserts that calling fn() throws an error matching the expected pattern.
 */
export function assertThrows(fn, expectedErrorRegexOrMsg, message) {
  let threw = false;
  let caughtError = null;
  try {
    fn();
  } catch (err) {
    threw = true;
    caughtError = err;
  }
  if (!threw) {
    throw new AssertionError(message || 'Expected function to throw an error, but it returned successfully', false, true);
  }
  if (expectedErrorRegexOrMsg) {
    const errText = caughtError?.message || String(caughtError);
    if (expectedErrorRegexOrMsg instanceof RegExp) {
      if (!expectedErrorRegexOrMsg.test(errText)) {
        throw new AssertionError(
          message || `Expected thrown error to match ${expectedErrorRegexOrMsg}, but got: "${errText}"`,
          errText,
          expectedErrorRegexOrMsg
        );
      }
    } else if (typeof expectedErrorRegexOrMsg === 'string') {
      if (!errText.includes(expectedErrorRegexOrMsg)) {
        throw new AssertionError(
          message || `Expected thrown error to include "${expectedErrorRegexOrMsg}", but got: "${errText}"`,
          errText,
          expectedErrorRegexOrMsg
        );
      }
    }
  }
}

/**
 * Asserts actual >= expected.
 */
export function assertGreaterOrEqual(actual, expected, message) {
  if (actual < expected) {
    const msg = message || `Expected ${actual} >= ${expected}`;
    throw new AssertionError(msg, actual, expected);
  }
}

/**
 * Asserts actual <= expected.
 */
export function assertLessOrEqual(actual, expected, message) {
  if (actual > expected) {
    const msg = message || `Expected ${actual} <= ${expected}`;
    throw new AssertionError(msg, actual, expected);
  }
}

/**
 * Asserts that an array includes an item (or satisfies a predicate).
 */
export function assertArrayIncludes(actualArray, itemOrPredicate, message) {
  if (!Array.isArray(actualArray)) {
    throw new AssertionError(`Expected array, got ${typeof actualArray}`, actualArray, 'Array');
  }
  let found = false;
  if (typeof itemOrPredicate === 'function') {
    found = actualArray.some(itemOrPredicate);
  } else {
    found = actualArray.includes(itemOrPredicate);
  }
  if (!found) {
    const msg = message || `Expected array to include item: ${JSON.stringify(itemOrPredicate)}`;
    throw new AssertionError(msg, actualArray, itemOrPredicate);
  }
}

export default {
  assert,
  assertEqual,
  assertDeepEqual,
  assertMatch,
  assertThrows,
  assertGreaterOrEqual,
  assertLessOrEqual,
  assertArrayIncludes,
  AssertionError,
};
