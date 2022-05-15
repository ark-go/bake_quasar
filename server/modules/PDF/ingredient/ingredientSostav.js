import { ingredientSostavQuery } from "./ingredientSostavQuery.js";
export async function ingredientSostav(req, res) {
  console.log("PDF ingredientSostav", req.body);

  return await ingredientSostavQuery(req, res);

  // return res.status(404).send("бля");
}


