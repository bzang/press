/**
 * Perform a key press. Ideally, this would be implemented with the actions api,
 * but that doesn't exist yet, so we have to hack this nightmare into place.
 * @param {string} key - The key to press
 * @param {string} selector - The active element. We shouldn't need this, but
 * selenium
 */
module.exports = (key, selector) => {
  const keyCode = keyCodes[key.toUpperCase()];
  if (!keyCode) {
    throw new Error(
      `"${key}" doesn't map to a known key code, but you can add its unicode value to this file.`
    );
  }

  browser.addValue(selector, keyCode);
};

const keyCodes = {
  ADD: '\ue025',
  ALT: '\ue00a',
  ARROW_DOWN: '\ue015',
  ARROW_LEFT: '\ue012',
  ARROW_RIGHT: '\ue014',
  ARROW_UP: '\ue013',
  BACKSPACE: '\ue003',
  BACK_SPACE: '\ue003',
  CANCEL: '\ue001',
  CLEAR: '\ue005',
  COMMAND: '\ue03d',
  CONTROL: '\ue009',
  DECIMAL: '\ue028',
  DELETE: '\ue017',
  DIVIDE: '\ue029',
  DOWN: '\ue015',
  END: '\ue010',
  ENTER: '\ue007',
  EQUALS: '\ue019',
  ESCAPE: '\ue00c',
  F1: '\ue031',
  F10: '\ue03a',
  F11: '\ue03b',
  F12: '\ue03c',
  F2: '\ue032',
  F3: '\ue033',
  F4: '\ue034',
  F5: '\ue035',
  F6: '\ue036',
  F7: '\ue037',
  F8: '\ue038',
  F9: '\ue039',
  HELP: '\ue002',
  HOME: '\ue011',
  INSERT: '\ue016',
  LEFT: '\ue012',
  LEFT_ALT: '\ue00a',
  LEFT_CONTROL: '\ue009',
  LEFT_SHIFT: '\ue008',
  META: '\ue03d',
  MULTIPLY: '\ue024',
  NULL: '\ue000',
  NUMPAD0: '\ue01a',
  NUMPAD1: '\ue01b',
  NUMPAD2: '\ue01c',
  NUMPAD3: '\ue01d',
  NUMPAD4: '\ue01e',
  NUMPAD5: '\ue01f',
  NUMPAD6: '\ue020',
  NUMPAD7: '\ue021',
  NUMPAD8: '\ue022',
  NUMPAD9: '\ue023',
  PAGE_DOWN: '\ue00f',
  PAGE_UP: '\ue00e',
  PAUSE: '\ue00b',
  RETURN: '\ue006',
  RIGHT: '\ue014',
  SEMICOLON: '\ue018',
  SEPARATOR: '\ue026',
  SHIFT: '\ue008',
  SPACE: '\ue00d',
  SUBTRACT: '\ue027',
  TAB: '\ue004',
  UP: '\ue013'
};
