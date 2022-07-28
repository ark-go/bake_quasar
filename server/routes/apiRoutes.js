import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { isAllowPath } from "../modules/access/allowPath.js";
import { login } from "../modules/reguser/login.js";
import { reguser } from "../modules/reguser/reguser.js";
import { usersLoad } from "../postgreSQL/command/usersLoad.js";
import { bakehousesLoad } from "../postgreSQL/command/bakehousesLoad.js";
import multer from "multer";
const upload = multer({ dest: "" });
import { addUserPre } from "../modules/addUserPre.js";
import { updateUserPre } from "../modules/updateUserPre.js";
import { bakehousesPreAdd } from "../modules/bakehousesPreAdd.js";
import { bakehousesPreUpdate } from "../modules/bakehousesPreUpdate.js";
import { nomenclLoad } from "../postgreSQL/command/nomenclLoad.js";
import { nomenclAdd } from "../postgreSQL/command/nomenclAdd.js";
import { nomenclUpdate } from "../postgreSQL/command/nomenclUpdate.js";
import { nomenclDelete } from "../postgreSQL/command/nomenclDelete.js";
import { partnersLoad } from "../postgreSQL/command/partnersLoad.js";
import { partnersPreAdd } from "../modules/partnersPreAdd.js";
import { partnersPreUpdate } from "../modules/partnersPreUpdate.js";
import { selectPartners } from "../postgreSQL/command/forSelectPartner/selectPartners.js";
import { groupNomenclName } from "../postgreSQL/command/groupNomenclName.js";
import { groupUserForSelect } from "../postgreSQL/command/forSelect/groupUserForSelect.js";
import { catalogsLoad } from "../postgreSQL/command/catalogsLoad.js";
import { catalogLoad } from "../postgreSQL/command/catalogLoad.js";
import { catalogAdd } from "../postgreSQL/command/catalogAdd.js";
import { catalogUpdate } from "../postgreSQL/command/catalogUpdate.js";
import { catalogDelete } from "../postgreSQL/command/catalogDelete.js";
import { nomenclLoadSpr } from "../postgreSQL/command/nomenclLoadSpr.js";
import { convertCSV } from "../modules/convertCSV.js";
import { xlsUpload } from "../modules/xlsUpload.js";
import { receptAdd } from "../postgreSQL/command/receptAdd.js";
import { nomenclReceptsLoad } from "../postgreSQL/command/nomenclReceptsLoad.js";
import { ingredientsLoad } from "../postgreSQL/command/ingredientsLoad.js";
import { receptsNomenclLoad } from "../postgreSQL/command/receptsNomenclLoad.js";
import { ingredientsAdd } from "../postgreSQL/command/ingredientsAdd.js";
import { ingredientDel } from "../postgreSQL/command/ingredientDel.js";
//import { createPDF } from "../modules/pdfark/createPDF.js";
import { storeLoad } from "../postgreSQL/command/storeLoad.js";
import { specstoreLoad } from "../postgreSQL/command/specstoreLoad.js";
import { specdocLoad } from "../postgreSQL/command/specdocLoad.js";
import { specdocvalueLoad } from "../postgreSQL/command/specdocvalueLoad.js";
import { spravLoad } from "../postgreSQL/command/sprav/spravLoad.js";
import { spravUpdate } from "../postgreSQL/command/sprav/spravUpdate.js";
import { spravAdd } from "../postgreSQL/command/sprav/spravAdd.js";
import { spravDelete } from "../postgreSQL/command/sprav/spravDelete.js";
import { kagentLoad } from "../postgreSQL/command/kagent/kagentLoad.js";
import { kagentAdd } from "../postgreSQL/command/kagent/kagentAdd.js";
import { kagentUpdate } from "../postgreSQL/command/kagent/kagentUpdate.js";
import { kagentDelete } from "../postgreSQL/command/kagent/kagentDelete.js";
import { kagentListLoad } from "../postgreSQL/command/kagent/kagentListLoad.js";
import { kagentListAdd } from "../postgreSQL/command/kagent/kagentListAdd.js";
import { kagentListDelete } from "../postgreSQL/command/kagent/kagentListDelete.js";
import { trademark } from "../postgreSQL/command/trademark/trademark.js";
import { kagent_tm } from "../postgreSQL/command/kagent_tm/kagent_tm.js";
import { city } from "../postgreSQL/command/city/city.js";
import { bakery } from "../postgreSQL/command/bakery/bakery.js";
//import { bakeryManager } from "../postgreSQL/command/bakeryManager/bakeryManager.js";
import { regionTerritory } from "../postgreSQL/command/regionTerritory/regionTerritory.js";
import { bakeryBaker } from "../postgreSQL/command/bakeryBaker/bakeryBaker.js";
import { territoryBakery } from "../postgreSQL/command/territoryBakery/territoryBakery.js";
import { regionManager } from "../postgreSQL/command/regionManager/regionManager.js";
import { territoryManager } from "../postgreSQL/command/territoryManager/territoryManager.js";
import { usersRegionManager } from "../postgreSQL/command/usersRegionManager/usersRegionManager.js";
import { usersTerritoryManager } from "../postgreSQL/command/usersTerritoryManager/usersTerritoryManager.js";
import { usersBakeryManager } from "../postgreSQL/command/usersBakeryManager/usersBakeryManager.js";
import { tabUsers } from "../postgreSQL/command/tabUsers/tabUsers.js";
import { tabBakery } from "../postgreSQL/command/tabBakery/tabBakery.js";
import { tabTerritory } from "../postgreSQL/command/tabTerritory/tabTerritory.js";
import { tabRegion } from "../postgreSQL/command/tabRegion/tabRegion.js";
import { tabHelpPanels } from "../postgreSQL/command/tabHelpPanels/tabHelpPanels.js";
import { tabKagent } from "../postgreSQL/command/tabKagent/tabKagent.js";
import { kagentBakery } from "../postgreSQL/command/kagentBakery/kagentBakery.js";
import { tabTrademark } from "../postgreSQL/command/tabTrademark/tabTrademark.js";
import { trademarkBakery } from "../postgreSQL/command/trademarkBakery/trademarkBakery.js";

import { products } from "../postgreSQL/command/products/products.js";
import { docprice } from "../postgreSQL/command/docprice/docprice.js";
import { departments } from "../postgreSQL/command/departments/departments.js";
import { userroletree } from "../postgreSQL/command/userroletree/userroletree.js";
//import { pdfmain } from "../modules/PDF/pdfmain.js";
//import { pdfMainLoad } from "../modules/PDF/pdfMainLoad.js";
import { pdf } from "../modules/PDF/pdf.js";
//import { pdfget } from "../modules/PDF/pdfget.js";
//import { pdfmodal } from "../modules/PDF/pdfmodal.js";
import { accessCheck } from "../modules/access/accessCheck.js";
const router = express.Router();

export async function apiRoutes() {
  router.post("/login", async (req, res) => {
    console.log("/login", req.session.user);
    //это моя функция, там происходит регенерация сессии
    //! надо разбираться, потому что без этого 20-07-22
    //! замена статуса срабатывает на второй вход, с этим быстрее :)
    // req.session.destroy(async (err) => {
    //   if (err) {
    //     //debug(err);
    //     console.log("Login pre-destroy error:", err); // ошибка, но тоже отдать ответ надо
    //     await login(req, res);
    //   } else {
    //     await login(req, res); // <-- Отдадим ответ, точно после удаления сессии
    //   }
    // });

    req.session.login();

    await login(req, res);
  });
  router.post("/reguser", async (req, res) => {
    console.log("/reguser");
    res.append("x-info-site", "registration");
    res.json(await reguser(req, res));
  });
  // проверка на сессию и наличию там User
  router.use(function (req, res, next) {
    // тут session уже из базы если были нужные куки
    // console.log(
    //   "Обращение к API:",
    //   req.url,
    //   req?.session?.user?.id,
    //   ":",
    //   req?.session?.user?.email,
    //   "Статус:",
    //   req?.session?.user?.status,
    //   new Date().toLocaleString("ru")
    // );
    // if (req?.session?.user?.status != "Registered") {
    //   res.status(200).json({
    //     error: "noautorizate", //! TODO: поменять на нет доступа
    //   });
    // } else
    if (req?.session?.user?.status == "WaitManualConfirm") {
      res.status(200).json({
        error: "WaitManualConfirm", //! поменять на нет доступа
      });
    } else {
      // console.log("Проверка: ", req.url);
      process.stdout.write(
        new Date().toLocaleString("ru") + " Проверка доступа: " + req?.url
      );
      if (isAllowPath(req.url)) {
        console.log(" : разрешено всем..", req?.session?.user?.email);
        return next();
      }
      if (req?.session?.user?.status != "Registered") {
        console.log(" отказано not Registered:", req?.session?.user?.email);
        return res.status(200).json({
          error: "NoAccess", //! поменять на нет доступа
        });
        //return;
        ///next();
      } else {
        console.log(
          " : registered",
          req?.session?.user?.email,
          req?.session?.user?.fio
        );
        return next();
      }
    }
  });
  // -----------------------------------------------------
  router.post("/unLogin", async (req, res) => {
    console.log("/unLogin", process.env.COOKIE_NAME);
    res.clearCookie(process.env.COOKIE_NAME);
    //req.session.destroy();
    //res.json({ result: true });
    req.session.destroy((err) => {
      if (err) {
        //debug(err);
        console.log("unLogin error:", err); // ошибка, но тоже отдать ответ надо
        res.json({ result: true });
      } else res.json({ result: true }); // <-- Отдадим ответ, точно после удаления сессии
    });
  });
  // -------------------------------------------------------
  router.post("/isLogin", async (req, res) => {
    // проверяем наличие в памяти user-a
    if (req.session?.user) {
      console.log(
        "/isLogin",
        req.session?.user?.email,
        req.session?.user?.roles
      );
    } else {
      console.log("/isLogin", "Не знакомый");
    }
    res.json({
      username: req.session.user?.username || req.session.user?.email,
      email: req.session.user?.email,
      roles: req.session.user?.roles,
    });
  });

  router.post("/pdf", async (req, res) => {
    console.log("/pdf");
    await pdf(req, res);
  });

  // router.post("/pdfmain", async (req, res) => {
  //   console.log("/pdfmain");
  //   res.json(await pdfmain(req));
  // });
  // router.post("/pdfMainLoad", async (req, res) => {
  //   console.log("/pdfMainLoad");
  //   res.json(await pdfMainLoad(req, res));
  // });
  // router.get("/pdfget", async (req, res) => {
  //   console.log("/pdfget");
  //   await pdfget(req, res);
  // });
  // router.post("/pdfmodal", async (req, res) => {
  //   console.log("/pdfmodal");
  //   await pdfmodal(req, res);
  // });
  // ----------------------------------------------------------
  router.post("/accessCheck", async (req, res) => {
    console.log("/accessCheck");
    await accessCheck(req, res);
  });

  router.post("/usersLoad", async (req, res) => {
    console.log("/usersLoad");
    res.json(await usersLoad());
  });
  router.post("/addUser", async (req, res) => {
    console.log("/addUser");
    res.json(await addUserPre(req, res));
  });
  router.post("/updateUser", async (req, res) => {
    console.log("/updateUser");
    res.json(await updateUserPre(req, res));
  });
  router.post("/bakehousesLoad", async (req, res) => {
    console.log("/bakehousesLoad");
    res.json(await bakehousesLoad(req, res));
  });
  router.post("/addBakehouses", async (req, res) => {
    console.log("/addBakehouses");
    res.json(await bakehousesPreAdd(req, res));
  });
  router.post("/updateBakehouses", async (req, res) => {
    console.log("/updateBakehouses");
    res.json(await bakehousesPreUpdate(req, res));
  });
  router.post("/nomenclLoad", async (req, res) => {
    console.log("/nomenclLoad");
    res.json(await nomenclLoad(req, res));
  });
  router.post("/nomenclAdd", async (req, res) => {
    console.log("/nomenclAdd");
    res.json(await nomenclAdd(req, res));
  });
  router.post("/nomenclUpdate", async (req, res) => {
    console.log("/nomenclUpdate");
    res.json(await nomenclUpdate(req, res));
  });
  router.post("/nomenclDelete", async (req, res) => {
    console.log("/nomenclDelete");
    res.json(await nomenclDelete(req, res));
  });
  router.post("/partnersLoad", async (req, res) => {
    console.log("/partnersLoad");
    res.json(await partnersLoad(req, res));
  });
  router.post("/addPartners", async (req, res) => {
    console.log("/addPartners");
    res.json(await partnersPreAdd(req, res));
  });
  router.post("/updatePartners", async (req, res) => {
    console.log("/updatePartners");
    res.json(await partnersPreUpdate(req, res));
  });

  router.post("/convertCSV", async (req, res) => {
    console.log("/convertCSV");
    res.json(await convertCSV(req, res));
  });

  router.post("/groupNomenclName", async (req, res) => {
    console.log("/groupNomenclName");
    res.json(await groupNomenclName(req, res));
  });

  router.post("/selectPartners", async (req, res) => {
    console.log("/selectPartners");
    res.json(await selectPartners());
  });

  router.post("/groupUserForSelect", async (req, res) => {
    console.log("/groupUserForSelect");
    res.json(await groupUserForSelect());
  });

  router.post("/catalogsLoad", async (req, res) => {
    console.log("/catalogsLoad");
    res.json(await catalogsLoad());
  });
  router.post("/catalogLoad", async (req, res) => {
    console.log("/catalogLoad");
    res.json(await catalogLoad(req, res));
  });
  router.post("/catalogAdd", async (req, res) => {
    console.log("/catalogAdd");
    res.json(await catalogAdd(req, res));
  });
  router.post("/catalogUpdate", async (req, res) => {
    console.log("/catalogUpdate");
    res.json(await catalogUpdate(req, res));
  });
  router.post("/catalogDelete", async (req, res) => {
    console.log("/catalogDelete");
    res.json(await catalogDelete(req, res));
  });
  // загрузка справочников для сборки номеннклатуры
  router.post("/nomenclLoadSpr", async (req, res) => {
    console.log("/nomenclLoadSpr");
    res.json(await nomenclLoadSpr(req, res));
  });
  router.post("/xlsupload", upload.single("filexls"), async (req, res) => {
    console.log("/xlsUpload");
    res.status(200).json(await xlsUpload(req, res));
  });
  router.post("/receptAdd", async (req, res) => {
    console.log("/receptAdd");
    res.json(await receptAdd(req, res));
  });
  router.post("/nomenclReceptsLoad", async (req, res) => {
    console.log("/nomenclReceptsLoad");
    res.json(await nomenclReceptsLoad(req, res));
  });
  router.post("/ingredientsLoad", async (req, res) => {
    console.log("/ingredientsLoad");
    res.json(await ingredientsLoad(req, res));
  });
  router.post("/receptsNomenclLoad", async (req, res) => {
    console.log("/receptsNomenclLoad");
    res.json(await receptsNomenclLoad(req, res));
  });
  router.post("/ingredientsAdd", async (req, res) => {
    console.log("/ingredientsAdd");
    res.json(await ingredientsAdd(req, res));
  });
  router.post("/ingredientDel", async (req, res) => {
    console.log("/ingredientDel");
    res.json(await ingredientDel(req, res));
  });
  // router.get("/pdf", async (req, res) => {
  //   console.log("/createPDF");
  //   await createPDF(req, res);
  // });
  router.post("/storeLoad", async (req, res) => {
    console.log("/storeLoad");
    res.json(await storeLoad(req, res));
  });
  router.post("/specstoreLoad", async (req, res) => {
    console.log("/specstoreLoad");
    res.json(await specstoreLoad(req, res));
  });
  router.post("/specdocLoad", async (req, res) => {
    console.log("/specdocLoad");
    res.json(await specdocLoad(req, res));
  });
  router.post("/specdocvalueLoad", async (req, res) => {
    console.log("/specdocvalueLoad");
    res.json(await specdocvalueLoad(req, res));
  });
  router.post("/spravLoad", async (req, res) => {
    console.log("/spravLoad");
    res.json(await spravLoad(req, res));
  });
  router.post("/spravUpdate", async (req, res) => {
    console.log("/spravUpdate");
    res.json(await spravUpdate(req, res));
  });
  router.post("/spravAdd", async (req, res) => {
    console.log("/spravAdd");
    res.json(await spravAdd(req, res));
  });
  router.post("/spravDelete", async (req, res) => {
    console.log("/spravDelete");
    res.json(await spravDelete(req, res));
  });
  router.post("/kagentLoad", async (req, res) => {
    console.log("/kagentLoad");
    res.json(await kagentLoad(req, res));
  });
  router.post("/kagentAdd", async (req, res) => {
    console.log("/kagentAdd");
    res.json(await kagentAdd(req, res));
  });
  router.post("/kagentUpdate", async (req, res) => {
    console.log("/kagentUpdate");
    res.json(await kagentUpdate(req, res));
  });
  router.post("/kagentDelete", async (req, res) => {
    console.log("/kagentDelete");
    res.json(await kagentDelete(req, res));
  });
  router.post("/kagentListLoad", async (req, res) => {
    console.log("/kagentListLoad");
    res.json(await kagentListLoad(req, res));
  });
  router.post("/kagentListAdd", async (req, res) => {
    console.log("/kagentListAdd");
    res.json(await kagentListAdd(req, res));
  });
  router.post("/kagentListDelete", async (req, res) => {
    console.log("/kagentListDelete");
    res.json(await kagentListDelete(req, res));
  });

  router.post("/trademark", async (req, res) => {
    console.log("/trademark", req.body?.cmd);
    res.json(await trademark(req, res));
  });
  router.post("/kagent_tm", async (req, res) => {
    console.log("/kagent_tm", req.body?.cmd);
    res.json(await kagent_tm(req, res));
  });
  router.post("/docprice", async (req, res) => {
    console.log("/docprice", req.body?.cmd);
    res.json(await docprice(req, res));
  });
  router.post("/city", async (req, res) => {
    console.log("/city", req.body?.cmd);
    res.json(await city(req, res));
  });
  router.post("/bakery", async (req, res) => {
    console.log("/bakery", req.body?.cmd);
    res.json(await bakery(req, res));
  });
  // router.post("/bakeryManager", async (req, res) => {
  //   console.log("/bakeryManager", req.body?.cmd);
  //   res.json(await bakeryManager(req, res));
  // });
  router.post("/regionManager", async (req, res) => {
    console.log("/regionManager", req.body?.cmd);
    res.json(await regionManager(req, res));
  });
  router.post("/regionTerritory", async (req, res) => {
    console.log("/regionTerritory", req.body?.cmd);
    res.json(await regionTerritory(req, res));
  });
  router.post("/territoryBakery", async (req, res) => {
    console.log("/territoryBakery", req.body?.cmd);
    res.json(await territoryBakery(req, res));
  });
  router.post("/territoryManager", async (req, res) => {
    console.log("/territoryManager", req.body?.cmd);
    res.json(await territoryManager(req, res));
  });
  router.post("/bakeryBaker", async (req, res) => {
    console.log("/bakeryBaker", req.body?.cmd);
    res.json(await bakeryBaker(req, res));
  });

  router.post("/usersRegionManager", async (req, res) => {
    console.log("/usersRegionManager", req.body?.cmd);
    res.json(await usersRegionManager(req, res));
  });
  router.post("/usersBakeryManager", async (req, res) => {
    console.log("/usersBakeryManager", req.body?.cmd);
    res.json(await usersBakeryManager(req, res));
  });
  router.post("/usersTerritoryManager", async (req, res) => {
    console.log("/usersTerritoryManager", req.body?.cmd);
    res.json(await usersTerritoryManager(req, res));
  });

  router.post("/tabUsers", async (req, res) => {
    console.log("/tabUsers", req.body?.cmd);
    res.json(await tabUsers(req, res));
  });
  router.post("/tabBakery", async (req, res) => {
    console.log("/tabBakery", req.body?.cmd);
    res.json(await tabBakery(req, res));
  });
  router.post("/tabTerritory", async (req, res) => {
    console.log("/tabTerritory", req.body?.cmd);
    res.json(await tabTerritory(req, res));
  });
  router.post("/tabKagent", async (req, res) => {
    console.log("/tabKagent", req.body?.cmd);
    res.json(await tabKagent(req, res));
  });
  router.post("/kagentBakery", async (req, res) => {
    console.log("/kagentBakery", req.body?.cmd);
    res.json(await kagentBakery(req, res));
  });
  router.post("/tabTrademark", async (req, res) => {
    console.log("/tabTrademark", req.body?.cmd);
    res.json(await tabTrademark(req, res));
  });
  router.post("/trademarkBakery", async (req, res) => {
    console.log("/trademarkBakery", req.body?.cmd);
    res.json(await trademarkBakery(req, res));
  });

  router.post("/tabRegion", async (req, res) => {
    console.log("/tabRegion", req.body?.cmd);
    res.json(await tabRegion(req, res));
  });
  router.post("/tabHelpPanels", async (req, res) => {
    console.log("/tabHelpPanels", req.body?.cmd);
    res.json(await tabHelpPanels(req, res));
  });

  router.post("/products", async (req, res) => {
    console.log("/products", req.body?.cmd);
    res.json(await products(req, res));
  });

  router.post("/departments", async (req, res) => {
    console.log("/departments", req.body?.cmd);
    res.json(await departments(req, res));
  });
  router.post("/userroletree", async (req, res) => {
    console.log("/userroletree", req.body?.cmd);
    res.json(await userroletree(req, res));
  });
  router.get("/start", (req, res) => {
    // res.send("Privet world: " + JSON.stringify(req.session?.user));
    console.log("start");
    res.json(req.session?.user);
  });

  return router;
}
