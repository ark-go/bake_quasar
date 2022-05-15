import crypto from "crypto";
/**
 * генерирует случайную строку символов, т.е. salt
 * @function
 * @param {number} length - длина случайной строки.
 */
var genRandomString = function (length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // преобразовать в шестнадцатеричный формат
    .slice(0, length); // вернуть требуемое количество символов
};

/**
 * пароль хэша с sha512.
 * @function
 * @param {string} password - Список обязательных полей.
 * @param {string} salt - данные для проверки.
 */
var sha512 = function (password, salt) {
  var hash = crypto.createHmac("sha512", salt); //алгоритм хеширования sha512
  hash.update(password);
  var value = hash.digest("hex");
  return {
    salt: salt,
    passwordHash: value,
  };
};

export function saltHashPassword(userpassword) {
  var salt = genRandomString(16); // дает нам соль длиной 16
  var passwordData = sha512(userpassword, salt);
  console.log("UserPassword = " + userpassword);
  console.log("Passwordhash = ", passwordData); //.passwordHash);
  // console.log("nSalt = " + passwordData.salt);
  return JSON.stringify(passwordData);
}

export function comparePassword(userpassword, hash) {
  try {
    hash = JSON.parse(hash);
  } catch (e) {
    return false;
  }
  var passwordData = sha512(userpassword, hash.salt);
  return passwordData.passwordHash === hash.passwordHash;
}
