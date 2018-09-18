/**
 * Used in `instanceof` checks to help TSC accept an instance is the expected
 * type. THIS SHOULD NEVER BE USED WHEN THE CHECK MIGHT FAIL.
 */
export class TypeNarrowingError extends Error {
  /**
   * @param {string} [message]
   */
  constructor(message) {
    let msg =
      'The TypeNarrowingError should never be used where it can actually be thrown. It is only to be used to help TypeScript understand what it cannot infer.';
    if (message) {
      msg += ` Original Error: ${message}`;
    }
    super(msg);
  }
}
