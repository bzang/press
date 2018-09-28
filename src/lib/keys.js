const codes = {
  13: 'Enter',
  38: 'ArrowUp',
  40: 'ArrowDown',
  9: 'Tab'
};

/**
 * Returns the string id for the pressed key. Throws by default if the key code
 * is not known, but that behavior can be suppressed with `ignore = true`
 * @param {KeyboardEvent} event
 * @param {boolean} ignore
 * @returns {string}
 */
export function keyName(event, ignore) {
  // Prefer the standard event.code...
  if (event.code) {
    return event.code;
  }

  // But fallback to constant lookups if necessary
  const code = codes[event.keyCode];
  if (!ignore && !code) {
    throw new Error(`${event.keyCode} is not a pre-defined key code`);
  }

  return code;
}
