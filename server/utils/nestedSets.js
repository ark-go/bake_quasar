const data = [
  { id: "1", level: "1", lft: "1", rgt: "16", title: "Root", photo: "0" },
  { id: "2", level: "2", lft: "2", rgt: "9", title: "A", photo: "0" },
  { id: "3", level: "3", lft: "3", rgt: "6", title: "C", photo: "0" },
  { id: "4", level: "3", lft: "7", rgt: "8", title: "D", photo: "0" },
  { id: "5", level: "4", lft: "4", rgt: "5", title: "E", photo: "0" },
  { id: "6", level: "3", lft: "11", rgt: "12", title: "F", photo: "0" },
  { id: "7", level: "2", lft: "10", rgt: "13", title: "B", photo: "0" },
  { id: "8", level: "2", lft: "14", rgt: "15", title: "G", photo: "0" },
];

function makeTree(arr, parentObj) {
  // parsing and sorting of innerdata
  let newArr = arr
    .map((c) => {
      for (var key in c) {
        c[key] = +c[key] || c[key];
      }
      return c;
    })
    .sort((a, b) => +a.lft - +b.lft);
  // initial value of parentObj and children value
  parentObj = parentObj || newArr[0];
  parentObj.children = [];
  // convert Nested Set to Tree structure
  for (let i = 0; i < newArr.length; i++) {
    const levState =
      newArr[i].level > parentObj.level &&
      newArr[i].level < parentObj.level + 2;
    const leftState = newArr[i].lft > parentObj.lft;
    const rightState = newArr[i].rgt < parentObj.rgt;
    if (levState && leftState && rightState) {
      parentObj.children.push(newArr[i]);
    }
  }
  // recursive make Tree for each child
  parentObj.children.forEach((c) => {
    c.children = [];
    makeTree(newArr, c);
  });
  let outArray = [];
  outArray.push(parentObj);
  return outArray;
}

export function nestedSets(data) {
  const grouped = data.reduce(function (r, a, i) {
    if (!i || r[r.length - 1][0].root !== a.root) {
      return r.concat([[a]]);
    }
    r[r.length - 1].push(a);
    return r;
  }, []);
  //console.log(grouped);

  let arrAll = [];
  grouped.forEach((val) => {
    console.log("На дерево", "val");
    arrAll.push(makeTree(val)[0]);
  });
  console.log("arrAll", arrAll);
  return arrAll;
}

//console.log(JSON.stringify(makeTree(data), null, 2));
