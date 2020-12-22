
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

export function isEmail(value,callback){
  if (!value) {
    return callback(new Error('輸入不可以為空'));
  }
  var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
  if((pattern.test(value))){
    return callback()
  }
  return callback(new Error('輸入的Email格式錯誤'))
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

export function isFloat(rule, value, callback) {
  let numberReg = /^\d+$|^\d+[.]?\d+$/
  if (!numberReg.test(value)) {
    callback(new Error('請輸入正確格式'))
  } else if (value == '') {
    callback(new Error('請輸入內容'))
  } else {
    callback()
  }
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