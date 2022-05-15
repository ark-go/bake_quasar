//https://github.com/speakeasyjs/speakeasy
import speakeasy from "speakeasy";
import { getQRCodeUrl } from "./qrcode.js";
import moment from "moment-timezone";

// let secret = speakeasy.generateSecret();
// let secretCode = secret.base32;
// console.log("secretCode", secretCode);
// let QRCodeUrl = await getQRCodeUrl(secretCode);
// console.log("QRCodeUrl", QRCodeUrl);

// проверка кода введенного пользователем (userToken)
export function FA2verify(req, base32secret, userToken) {
  console.log("time", req.session.timezone);
  var verified = speakeasy.totp.verify({
    secret: base32secret,
    encoding: "base32",
    token: userToken,
    //  time: getDateTZ(req),
  });
  return verified; // false/true
}
export function getToken2FA(req, base32secret) {
  return speakeasy.totp({
    secret: base32secret,
    encoding: "base32",
    //  time: getDateTZ(req),
    // time: 1453667708, // specified in seconds
  });
}
export async function FA2qrcode() {
  //
  // если не задан - генерируем новый ключ, для нового пользователя или сброса клиента
  let secret = speakeasy.generateSecret();
  // secretCode = secret.otpauth_url; // для регистрации
  let secretCode = speakeasy.otpauthURL({
    secret: secret.ascii,
    label: process.env.FA2_NAME, //"Kan Server",
    algorithm: "sha1", // sha512
  });
  let base32secret = secret.base32; // в базу
  let QRCodeUrl = await getQRCodeUrl(secretCode);
  return {
    base32secret,
    QRCodeUrl,
  };
}

function getDateTZ(req) {
  let mom = moment.tz(Date.now(), req.session.timezone); //"Asia/Yekaterinburg");
  console.log("moment", mom, Math.round(mom.valueOf() / 1000));
  return Math.round(mom.valueOf() / 1000);
}
