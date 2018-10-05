/**
 * @param {Node} childNode
 * @param {(Node|string)[]} args
 */
export function after(childNode, ...args) {
  // @ts-ignore
  if (typeof childNode.after === 'function') {
    // @ts-ignore
    childNode.after(...args);
    return;
  }

  const parent = childNode.parentNode || childNode.parentElement;

  if (!parent) {
    throw new Error(
      '[HierarchyRequestError] childNode does not have a parentNode'
    );
  }

  const docFrag = document.createDocumentFragment();
  args.forEach((arg) => {
    docFrag.appendChild(
      arg instanceof Node ? arg : document.createTextNode(arg)
    );
  });

  parent.insertBefore(docFrag, childNode.nextSibling);
}

/**
 * @param {Element} el
 * @param {string} selectors
 * @returns {Element|Node|null}
 */
export function closest(el, selectors) {
  if (typeof el.closest === 'function') {
    return el.closest(selectors);
  }

  const matches =
    Element.prototype.matches ||
    // @ts-ignore - removed from typescript's checker
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;

  /** @type {HTMLElement|Node|null} */
  let elUnderTest = el;
  if (document.documentElement && !document.documentElement.contains(el)) {
    return null;
  }

  do {
    if (matches.call(elUnderTest, selectors)) {
      return elUnderTest;
    }
    elUnderTest = elUnderTest.parentElement || elUnderTest.parentNode;
  } while (elUnderTest !== null && elUnderTest.nodeType === 1);

  return null;
}

/**
 * @param {HTMLElement} el
 * @returns {string[]}
 */
export function getAttributeNames(el) {
  // @ts-ignore
  if (typeof el.getAttributeNames === 'function') {
    // @ts-ignore
    return el.getAttributeNames();
  }

  const {attributes} = el;
  const {length} = attributes;
  const result = new Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = attributes[i].name;
  }
  return result;
}

/**
 * @param {string} haystack
 * @param {string} needle
 * @returns {boolean}
 */
export function startsWith(haystack, needle) {
  if (typeof haystack.startsWith === 'function') {
    return haystack.startsWith(needle);
  }

  return haystack.indexOf(needle) === 0;
}
