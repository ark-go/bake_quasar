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
    p1: salt,
    p2: value,
  };
};
/**
 * создание хеша
 * @param {*} userpassword - Пароль
 * @param {*} id  ID - пользователя
 * @returns
 */
function getHashPassword(userpassword, id) {
  var salt = genRandomString(16); // дает нам соль длиной 16
  var passwordData = sha512(userpassword + id, salt);
  //  console.log("UserPassword = " + userpassword);
  //  console.log("Passwordhash = ", passwordData); //.passwordHash);
  // console.log("nSalt = " + passwordData.salt);
  return JSON.stringify(passwordData);
}

/**
 * проверить пароль с хешем
 * @param {*} userpassword  - Пароль
 * @param {*} hash  - хэш из база
 * @param {*} id  - ID пользователя
 * @returns
 */
function compareHashPassword(userpassword, hash, id) {
  try {
    hash = JSON.parse(hash);
  } catch (e) {
    return false;
  }
  if (!hash?.p1 || !hash?.p2) {
    return false;
  }

  var passwordData = sha512(userpassword + id, hash.p1);
  return passwordData.p2 === hash.p2;
}

export { getHashPassword, compareHashPassword };
// let r = getHashPassword("MYPASSWORD", 2);
// console.log("test", r);
// console.log("test=", compareHashPassword("MYPASSWORD", r, 2));
// console.log("test",getHashPassword("MYPASSWORD"));
