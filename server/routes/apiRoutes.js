import express from "express";
import { login } from "../modules/login.js";
//import { isLogin } from "../modules/isLogin.js";
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
import { createPDF } from "../modules/pdfark/createPDF.js";
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
import { products } from "../postgreSQL/command/products/products.js";
import { docprice } from "../postgreSQL/command/docprice/docprice.js";
import { pdfmain } from "../modules/PDF/pdfmain.js";
import { pdfMainLoad } from "../modules/PDF/pdfMainLoad.js";
import { pdfget } from "../modules/PDF/pdfget.js";
import { pdfmodal } from "../modules/PDF/pdfmodal.js";
import { accessCheck } from "../modules/access/accessCheck.js";
const router = express.Router();

export async function apiRoutes() {
  router.post("/login", async (req, res) => {
    console.log("/login");
    await login(req, res);
  });
  // проверка на сессию и наличию там User
  router.use(function (req, res, next) {
    // тут session уже из базы если были нужные куки
    console.log(
      "Обращение к API, user.id: ",
      req?.session?.user?.id,
      ":",
      req?.session?.user?.email,
      "Active:",
      req?.session?.user?.active,
      new Date().toLocaleString("ru")
    );
    if (!req?.session?.user?.active) {
      res.status(200).json({
        error: "noautorizate", //! поменять на нет доступа
      });
    } else {
      next();
    }
  });
  // -------------------------------------------------------
  router.post("/isLogin", async (req, res) => {
    console.log("/isLogin");
    res.json({
      username: req.session.user.username || req.session.user.email,
      email: req.session.user.email,
      roles: req.session.user.roles,
    });
  });
  router.post("/pdfmain", async (req, res) => {
    console.log("/pdfmain");
    res.json(await pdfmain(req));
  });
  router.post("/pdfMainLoad", async (req, res) => {
    console.log("/pdfMainLoad");
    res.json(await pdfMainLoad(req, res));
  });
  router.get("/pdfget", async (req, res) => {
    console.log("/pdfget");
    await pdfget(req, res);
  });
  router.post("/pdfmodal", async (req, res) => {
    console.log("/pdfmodal");
    await pdfmodal(req, res);
  });
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
  router.get("/pdf", async (req, res) => {
    console.log("/createPDF");
    await createPDF(req, res);
  });
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
  router.post("/products", async (req, res) => {
    console.log("/products", req.body?.cmd);
    res.json(await products(req, res));
  });

  router.get("/start", (req, res) => {
    // res.send("Privet world: " + JSON.stringify(req.session?.user));
    console.log("start");
    res.json(req.session?.user);
  });

  return router;
}
