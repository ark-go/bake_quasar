import { ref } from "vue";
import { dataLoad } from "src/utils/ark.js";
export function useTreeFunc() {
  //   async function loadTable(command = { cmd: "load" }) {
  //     console.log("хотим таблицу ", nameTable);
  //     let mess = "Загрузка пекарен";
  //     // let res = await dataLoad("/api/bakery", { cmd: "load" }, mess);
  //     let url = "/api/" + nameTable;
  //     let res = await dataLoad(url, command, mess);
  //     if (res.result) {
  //       return res.result;
  //     } else {
  //       return [];
  //     }
  //   }
  //   return { loadTable };

  function getParents(refTree, key) {
    let keyId = key;
    let pathArr = [];
    let pathName = [];
    let result = {};
    while (keyId) {
      let node = refTree.getNodeByKey(keyId);
      pathName.unshift(node.name);
      pathArr.unshift(node);
      keyId = pathArr[0]?.parent;
      // console.log(">>>", pathName.join("|"), pathArr[0]);
    }
    //console.log(pathArr);
    result.pathArr = pathArr;
    result.pathNameArr = pathName;
    result.pathNameStr = pathName.join(" | ");
    return result;
  }
  return { getParents };
}
