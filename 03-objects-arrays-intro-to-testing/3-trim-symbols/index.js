/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {

  if (size === 0) { return ''; }
  
  const newStr = string.slice(0, size);
  const arr = [...string.slice(size)];

  return arr.reduce((accumStr, val) => {
    if (!accumStr.endsWith(val.repeat(size))) {
      return accumStr + val;
    }
    return accumStr;
  }, newStr);
}
