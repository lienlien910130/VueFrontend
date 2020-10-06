/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
// 驗證填寫資料的格式-測試環境下 驗證是否為admin or editor
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function isPhone(rule, value, callback) {
  if (!value) {
    return callback(new Error('輸入不可以為空'));
  }
  var pattern = /^1[34578]\d{9}$/
  if(pattern.test(value)){
    return callback()
  }
  return callback(new Error('輸入的手機號錯誤'))
}

export function isInteger(rule, value, callback) {
  if (!value) {
    return callback(new Error('輸入不可以為空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('請輸入正整數'));
    } else {
      const re = /^[0-9]*[1-9][0-9]*$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        callback(new Error('請輸入正整數'));
      } else {
        callback();
      }
    }
  }, 1000);
}

export function isDecimal(rule, value, callback) {
  if (!value) {
    return callback(new Error('輸入不可以為空'));
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('請輸入數字'));
    } else {
      if (value < 0 || value > 1) {
        callback(new Error('請輸入[0,1]之間的數字'));
      } else {
        callback();
      }
    }
  }, 1000);
}