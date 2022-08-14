/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const newArr = [...arr];
  const directions = {
    asc: 1,
    desc: -1
  };

  const direct = directions[param];

  return newArr.sort((a, b) => direct * a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper' }));
}
