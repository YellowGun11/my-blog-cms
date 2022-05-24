const CITY_CODE = {
  11: '北京',
  12: '天津',
  13: '河北',
  14: '山西',
  15: '内蒙古',
  21: '辽宁',
  22: '吉林',
  23: '黑龙江 ',
  31: '上海',
  32: '江苏',
  33: '浙江',
  34: '安徽',
  35: '福建',
  36: '江西',
  37: '山东',
  41: '河南',
  42: '湖北 ',
  43: '湖南',
  44: '广东',
  45: '广西',
  46: '海南',
  50: '重庆',
  51: '四川',
  52: '贵州',
  53: '云南',
  54: '西藏 ',
  61: '陕西',
  62: '甘肃',
  63: '青海',
  64: '宁夏',
  65: '新疆',
  71: '台湾',
  81: '香港',
  82: '澳门',
  91: '国外 ',
};
// 校验code是否在中国省区域编码里面
function isInCityCode(code) {
  return !!CITY_CODE[code];
}

module.exports = {
  /**
   * 必填项
   */
  REQUIRED: {
    required: true,
    message: '此项必填!',
  },
  /**
   * 校验空格
   */
  BLANK_SPACE: {
    pattern: new RegExp('^\\S+$', 'i'),
    message: '请不要输入空格!',
  },
  /**
   * 校验特殊字符
   */
  SPECIAL_CHART: {
    pattern: new RegExp('^[a-zA-Z0-9_\\-\u4e00-\u9fa5@\\s+]+$', 'i'),
    message: '不能包含特殊字符!',
  },
  /**
   * 不能包含中文字符
   */
  NOT_INCLUDE_CHINESE: {
    validator: (rule, value, callback) => {
      if (value && value !== '') {
        const reg = new RegExp('[\u4e00-\u9fa5]+', 'g');
        if (reg.test(value)) {
          callback('不支持中文输入!');
          return;
        }
        callback();
      }
      callback();
    },
  },
  /**
   * 只能包含数字和字母
   */
  ONLY_LETTER_NUMBER: {
    pattern: /^[A-Za-z0-9]+$/,
    message: '只能包含数字和字母！',
  },
  /**
   * 只能包含数字
   */
  ONLY_NUMBER: {
    pattern: /^[0-9]+$/,
    message: '只能输入大于0的整数！',
  },
  /**
   * 校验最大数字
   * @param { number } number：需要校验的最大数值
   */
  numberMax: (number) => {
    return {
      validator: (rule, value, callback) => {
        if (value && typeof value === 'number' && value > number) {
          callback(`数字不能大于 ${number} !`);
          return;
        }
        callback();
      },
    };
  },
  /**
   * 校验最小数字
   * @param { number } number：需要校验的最小数值
   */
  numberMin: (number) => {
    return {
      validator: (rule, value, callback) => {
        if (value && typeof value === 'number' && value < number) {
          callback(`数字不能小于 ${number} !`);
          return;
        }
        callback();
      },
    };
  },
  /**
   * 字符串最大长度
   */
  stringMax: (length) => ({
    validator: (rule, value, callback) => {
      if (value && typeof value === 'string' && value.length > length) {
        callback(`最大字符长度为 ${length} !`);
        return;
      }
      callback();
    },
  }),
  /**
   * 字符串最小长度
   */
  stringMin: (length) => ({
    validator: (rule, value, callback) => {
      if (value && typeof value === 'string' && value.length < length) {
        callback(`最小字符长度为 ${length} !`);
        return;
      }
      callback();
    },
  }),
  /**
   * 校验手机号码
   */
  TEL_PHONE: {
    pattern: /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/,
    message: '请输入有效的电话号码！',
  },
  /**
   * 同时验证手机号和座机号 wwj
   */
  TEL_HOME_PHONE: {
    // ([0-9]{3,4}-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^([0-9]{3,4})[0-9]{3,8}))|(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}
    pattern:
      /((^[0-9]{3,4}-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^([0-9]{3,4})[0-9]{3,8}$))|^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/,
    message: '请输入有效的电话或座机号码！',
  },
  /**
   * 校验邮箱
   */
  EMAIL: {
    type: 'email',
    message: '请输入有效的邮箱!',
  },
  /**
   * 校验身份证号码
   */
  ID_CARD: {
    // eslint-disable-next-line consistent-return
    validator: (rule, value, callback) => {
      if (!value || value === '') {
        return callback();
      }
      const mes = '请输入有效的身份证';
      // 二代身份证格式校验
      if (!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)) {
        return callback(`${mes}，并且不能包含空格! `);
      }
      // 省份区域码
      if (!isInCityCode(value.substr(0, 2))) {
        return callback(`${mes}! `);
      }
      // 18位身份证需要验证最后一位校验位
      if (value.length === 18) {
        const codeArr = value.split('');
        // ∑(ai×Wi)(mod 11)
        // 加权因子
        const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        // 校验位
        const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        const sum = codeArr.reduce((total, item, index) => {
          if (index < 17) {
            return total + item * factor[index];
          }
          return total;
        }, 0);
        const last = parity[sum % 11];
        if (`${last}` !== codeArr[17]) {
          return callback(`${mes}! `);
        }
      }
      callback();
    },
  },
  /**
   * 校验全国车牌号
   */
  CAR_NUMBER_PLATE: {
    pattern:
      /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/,
    message: '请输入有效的车牌号!',
  },
};
