/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number | undefined} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {

  const newStr = string.slice(0, size);
  const elseStr = string.slice(size).split('');

  return elseStr.reduce((acc, val) => {
    if (!acc.endsWith(val.repeat(size))) {
      return acc + val;
    }
    return acc;
  }, newStr);
}
