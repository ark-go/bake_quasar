/**
 * Массив разрешенных путей, без регистрации
 * @param {*} path
 * @returns
 */
export function isAllowPath(path) {
  return allowPath.includes(path);
}
export const allowPath = [
  "/",
  "/unLogin",
  "/isLogin",
  "/accessCheck",
  "/login",
  "/registration",
];
