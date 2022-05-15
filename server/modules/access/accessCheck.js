export async function accessCheck(req, res, next) {
  // console.log(req.body, req.session.user?.roles);
  if (
    !req.body?.path ||
    !req?.session?.user?.active ||
    !req.session.user?.roles ||
    !Array.isArray(req.session.user.roles)
  ) {
    return res.json({
      error: "NoAccess",
    });
  }
  // хотя бы один совпадет то труе

  let itog = true;
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
    default:
      break;
  }

  if (itog) {
    return res.json({
      result: "YesAcess",
    });
  }
  console.log("Запрет перехода на :", req.body?.path);

  return res.json({
    error: "NoAccess",
  });
}
//====
function checkRole(req, arr) {
  return req.session.user.roles.some((el) => {
    return arr.includes(el);
  });
}
