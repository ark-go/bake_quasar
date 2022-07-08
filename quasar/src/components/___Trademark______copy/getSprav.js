import { dataLoad } from "src/utils/ark.js";

export async function getSprav(sprav, mess) {
  let dat = {
    tableNameLoad: sprav,
  };
  let messD =
    "Читаем " + mess ? mess : props.tableInfo.label + " (" + mess + ")";
  let res = await dataLoad("/api/spravLoad", dat, messD);
  if (res.result) {
    return res.result;
  } else {
    return [];
  }
}
