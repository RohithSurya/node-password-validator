const constants = require("./const");
const getEntropy = require("./entropy");

exports.passwordValidator = (password, minEntropy) => {
  const entropy = getEntropy(password);
  const res = {};
  if (entropy >= minEntropy) {
    res.strong = true;
  } else {
    res.strong = false;
    const messages = [];
    let isLowercase = false;
    let isUppercase = false;
    let isDigits = false;
    let isReplacements = false;
    let isSeparators = false;
    let isSpecials = false;
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
      }
    }
    if (!isSpecials || !isReplacements || !isSeparators) {
      messages.push("including more special characters");
    }
    if (!isDigits) {
      messages.push("including more digits");
    }

    if (!isLowercase) {
      messages.push("using lowercase alphabets");
    }
    if (!isUppercase) {
      messages.push("using uppercase alphabets");
    }

    if (messages.length > 0) {
      res.error = `insecure password try ${messages.join(
        " "
      )} or using a longer password`;
    } else {
      res.error = "insecure password, try using a longer password";
    }
  }
  return res;
};
