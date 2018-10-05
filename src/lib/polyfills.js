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
