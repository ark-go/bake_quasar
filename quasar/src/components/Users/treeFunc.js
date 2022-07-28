import { ref } from "vue";
export function useTreeFunc() {
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
