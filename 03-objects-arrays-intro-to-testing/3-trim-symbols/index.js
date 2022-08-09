/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {

  if (size === 0) { return ''; }
  let result = [];
  let count = size;
  const arr = string.split('');

  const ok = {
    [arr[0]]: true
  };

  arr.forEach((el, i) => {
    if (ok.el && count < i) {
      result.push(el);
    }
    if (count === i) {
      count += count;
      ok.el = false;
    } else {
      result.push(el);
    }
  });
  return result.join('');
}
