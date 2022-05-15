import { createPDF2 } from "./createPDF2.js";
import { products } from "../../postgreSQL/command/products/products.js";
export async function product(req, res) {
  req.body.cmd = "pdfAll";
  req.body.tabname = "products";
  let otv = await products(req, res);
  if (otv.error) {
    console.log("Почему тут?");
    return res.status(404).send(otv.error);
  }
  console.log("PDF products.js YES", otv.result);
  return createPDF2(res, otv.result, "products");
}
