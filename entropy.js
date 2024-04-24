const constants = require("./const");

const getLength = require("./length");

const getEntropy = (password) => {
  const base = getBase(password);
  const length = getLength(password);
  return Math.log2(Math.pow(base, length));
};

const getBase = (password) => {
  let isLowercase = false;
  let isUppercase = false;
  let isDigits = false;
  let isReplacements = false;
  let isSeparators = false;
  let isSpecials = false;

  let baseCount = 0;

  for (let i = 0; i < password.length; i++) {
    let c = password[i];
    if (constants.lowercase.includes(c)) {
      isLowercase = true;
    } else if (constants.uppercase.includes(c)) {
      isUppercase = true;
    } else if (constants.digits.includes(c)) {
      isDigits = true;
    } else if (constants.replacements.includes(c)) {
      isReplacements = true;
    } else if (constants.separators.includes(c)) {
      isSeparators = true;
    } else if (constants.specials.includes(c)) {
      isSpecials = true;
    } else {
      baseCount++;
    }
  }

  if (isLowercase) {
    baseCount += constants.lowercase.length;
  }

  if (isUppercase) {
    baseCount += constants.uppercase.length;
  }

  if (isDigits) {
    baseCount += constants.digits.length;
  }
  if (isReplacements) {
    baseCount += constants.replacements.length;
  }

  if (isSeparators) {
    baseCount += constants.separators.length;
  }

  if (isSpecials) {
    baseCount += constants.specials.length;
  }

  return baseCount;
};

module.exports = getEntropy;
