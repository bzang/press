const checkContainsAnyText = require('./checkContainsAnyText');

module.exports = (elementType, element, negate) => {
  let newnegate = true;

  if (typeof negate === 'function') {
    newnegate = false;
  } else if (negate === ' not') {
    newnegate = false;
  }

  checkContainsAnyText(elementType, element, newnegate);
};
