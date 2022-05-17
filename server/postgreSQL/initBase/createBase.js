import fs from "fs";
import path from "path";
import { pool } from "../initPostgreSQL.js";
import { rootDir } from "../../dirModule.cjs";
//console.log(rootDir);
getAllFiles();

for (const val of [
  // "trademark/brand",
  // "trademark/trademark",
  // "trademark/region",
  // "trademark/city",
  // "trademark/branch",
  // "trademark/territory",
  //"contragent/kagentinfo",
  //"contragent/kagent_tm", // trademark + kagent
  //"122-store",
  //"123-specstore",    // recept store users
  //"124-specdoc", //  stores
  //"125-specdocvalue", // specdoc
  //  "169-1-vidnomencl",
  //  "169-2-groupraw",
  //  "169-3-vidraw",
  //  "169-4-unit",
  //"170-nomencl",
  //"172-recept",
  //"173-recept-ingredient",
  //"contragent/trigger_kagent_vidreg",
  //"contragent/trigger_vidreg_default",
  //"bakery/bakery", // trademark, territory, branch, city, kagent

  //"product/productinfo", // там Тип продукции и Вид продукции
  "product/productassortment",
  //"product/productsall",
  //"product/products",
  //"exception/errormess",
  //"product/productingred",
  //"product/f_no_delete_ingredient",
  //.."product/f_proportion_massbrutto",
  //"product/ingredient_check_finish_only",

  //"product/ingredient_update",
  //"product/ingredient_recalc",
  //"product/ingredient_tree_to_top",
  //"product/test",
  // PRICE

  //"price/docpricevid",
  //"price/docprice",
  //"price/docbakery",
  //"price/docpricelist",
]) {
  await executeSql(val);
}

// await executeSql("170-nomencl");

function getAllFiles() {
  let files = [];
  fs.readdirSync(path.join(rootDir, "postgreSQL", "initBase", "SQL")).forEach(
    (file) => {
      files.push(file);
    }
  );
  files.sort();
  console.log(files);
  return files;
}
// и файла берем SQL и его запускаем
async function executeSql(sql) {
  let pathSql = path.join(
    rootDir,
    "postgreSQL",
    "initBase",
    "SQL",
    sql + ".sql"
  );
  let sqlContent;
  try {
    sqlContent = fs.readFileSync(pathSql, "utf8");
  } catch (err) {
    console.log(err.toString());

    return;
  }
  try {
    const a = await pool.query(sqlContent);
    console.log("файл готов: ", sql);
  } catch (err) {
    console.error("Error! (" + sql + ")", err.toString());
    //   console.log(err);
  }
}

// function compareNum(a, b) {
// //   a = a.substring(0, 2);
// //   b = b.substring(0, 2);

//   if (a > b) return 1;
//   if (a == b) return 0;
//   if (a < b) return -1;
// }
