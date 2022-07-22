import { isAllowPath } from "./allowPath.js";
export async function accessCheck(req, res, next) {
  // проверяем список разрешенных путей, для всех
  if (isAllowPath(req.body?.path)) {
    return res.json({
      result: "unregistered",
    });
  }
  // нет запроса, юэера, ролей, роли должны быть массивом,
  // это и не пользователь, запрет
  if (
    !req.body?.path ||
    !req?.session?.user?.status ||
    !req.session.user?.roles ||
    !Array.isArray(req.session.user.roles)
  ) {
    return res.json({
      error: "NoAccess",
      isAllowPath: isAllowPath,
    });
  }
  // Если зарегистрировались но не прошли подтверждение?
  if (req?.session?.user?.status == "WaitManualConfirm") {
    return res.json({
      error: "WaitManualConfirm",
      isAllowPath: isAllowPath,
    });
  }

  // хотя бы один совпадет то труе

  let itog = true; // разрешаем , а потом проверяем

  process.stdout.write(
    new Date().toLocaleString("ru") + " Проверка разрешений: " + req.body.path
  );
  switch (req.body.path) {
    case "/xls":
      itog = checkRole(req, ["MODERATOR"]);
      break;
    case "/photo":
    case "/specstore":
    case "/tables/users":
    case "/tables":
      itog = checkRole(req, ["MODERATOR"]);
      break;
      // case "/tables":
      //   itog = checkRole(req, ["MODERATOR"]);
      break;
    // case "/bakery":
    //   itog = checkRole(req, ["USER_BAK"]);
    //   break;
    case "/bakeryttk":
      itog = checkRole(req, ["USER_TTK"]);
      break;
    default:
      itog = checkRole(req, ["USER"]);
      break;
  }
  console.log(" ", itog, req.session.user.email);
  if (itog) {
    return res.json({
      result: "YesAcess",
    });
  }
  console.log("Запрет перехода на :", req.body?.path);

  return res.json({
    error: "NoAccess",
    isAllowPath: isAllowPath,
  });
}
//====
function checkRole(req, arr) {
  return req.session.user.roles.some((el) => {
    return arr.includes(el);
  });
}
