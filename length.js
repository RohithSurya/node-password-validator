const constants = require("./const");

const COUNT_LIMIT = 2;

const removeConsecutive = (password) => {
  if (password.length <= 2) return password;
  let newPassword = "";
  let count = 1;
  let prev = password[0];
  for (let i = 1; i < password.length; i++) {
    curr = password[i];
    if (prev == curr) {
      count++;
    } else {
      if (count > 2) {
        newPassword += prev.repeat(COUNT_LIMIT);
      } else {
        newPassword = newPassword + prev.repeat(count);
      }
      count = 1;
    }
    prev = curr;
  }

  if (count > 2) {
    newPassword += prev.repeat(COUNT_LIMIT);
  } else {
    newPassword = newPassword + prev.repeat(count);
  }
  return newPassword;
};

const removeConsecutiveSequence = (password, seq) => {
  passChars = password.split("");
  seqChars = seq.split("");

  count = 0;
  for (let i = 0; i < passChars.length; i++) {
    for (let j = 0; j < seqChars.length; j++) {
      if (i >= passChars.length) {
        break;
      }
      p = passChars[i];
      s = seqChars[j];
      if (p != s) {
        count = 0;
        continue;
      }
      count++;
      if (count > COUNT_LIMIT) {
        passChars.splice(i, 1);
      } else {
        i++;
      }
    }
  }
  return passChars.join("");
};

const getLength = (password) => {
  password = removeConsecutive(password);
  password = password.toLowerCase();
  password = removeConsecutiveSequence(password, constants.lowercase);
  password = removeConsecutiveSequence(
    password,
    constants.lowercase.split("").reverse().join("")
  );
  password = removeConsecutiveSequence(password, constants.sequenceKeyboard0);
  password = removeConsecutiveSequence(
    password,
    constants.sequenceKeyboard0.split("").reverse("").join("")
  );
  password = removeConsecutiveSequence(password, constants.sequenceKeyboard1);
  return password.length;
};

module.exports = getLength;
