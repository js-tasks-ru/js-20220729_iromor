/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const arr = path.split('.');
  return function goInside(obj) {
    let result = '';
    arr.forEach((element) => {
      if (typeof result === 'object') {
        result = result[element];
      } else {
        result = obj[element];
      }
    });
    return result;
  };
}
