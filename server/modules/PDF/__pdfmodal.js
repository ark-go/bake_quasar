// сюда приходими из pdfDialog.vue
import { product } from "./product.js";

//import { ingredientSostav } from "./ingredient/ingredientSostav.js";
export async function pdfmodal(req, res) {
  console.log("PWA PDF ЗАПРОС", req.session?.user.email, req.body.action);
  switch (req.body.action) {
    case "products":
      return await product(req, res);
      break;

    default:
      return res.status(404).send("Что-то не так");
      break;
  }
}
