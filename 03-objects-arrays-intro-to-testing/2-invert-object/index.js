/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {

  if (typeof obj !== 'object') { return undefined; }
  const newObj = [];
  for (let key of Object.keys(obj)) {
    newObj.push([obj[key], key]);
  }
  return Object.fromEntries(newObj);
}
