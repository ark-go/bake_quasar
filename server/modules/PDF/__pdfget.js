import { products } from "../../postgreSQL/command/products/products.js";
import { createPDF } from "./createPDF.js";
import { ingredientSostav } from "./ingredient/ingredientSostav.js";
export async function pdfget(req, res) {
  console.log("PWA PDF ЗАПРОС", req.session?.user?.currentPdf);
  if (!req.session?.user?.currentPdf) {
    return res.status(404).send("1) Sorry, we cannot find that!");
  }
  //let currentPdf = req.session?.user?.currentPdf;
  //console.log("pdf", req.query.key, req.session.user.currentPdf);
  if (req.query.key != req.session.user.currentPdf.key) {
    return res
      .status(404)
      .send(
        "2) Sorry, we cannot find that! " +
          req.session?.user?.email +
          " | " +
          req.query?.key
      );
  }
  console.log("Запрос PDF", req.session.user.currentPdf?.pdf?.tabname);
  // совпал ключ
  if (req.query.tabname != req.session.user.currentPdf?.pdf?.tabname) {
    // не совпала запрошенная таблица
    return res.status(404).send("46781) Sorry, we cannot find that!");
  }

  let tabs = req.query.tabname.split(",");
  console.log("tabs", tabs);
  switch (req.query.tabname) {
    case "ingredientSostav":
      return await ingredientSostav(req, res);
    default:
      break;
  }

  req.body.cmd = "pdfAll";
  req.body.tabname = req.query.tabname;
  let otv = await products(req, res);
  if (otv.error) {
    return res.status(404).send(otv.error);
  }
  otv = otv.result;
  console.log(otv);
  let tables = {
    otv: otv,
    tabname: req.query.tabname,
    pageOrient: "landscape",
  };
  //try {
  return createPDF(res, otv, req.query.tabname);
}
