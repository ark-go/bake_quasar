function nestedSetToJson(arr, parentObj) {
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
    nestedSetToJson(newArr, c);
  });
  let outArray = [];
  outArray.push(parentObj);
  return outArray;
}

function nestedSetToJson2(devices) {
  const series = Array.from(new Set(devices.map((item) => item.root)));
  return series.map((item, idx, arr) => {
    const series = item ? { root: item } : null;

    return {
      ...series,
      children: devices.filter((device) => device.root === item),
      // items: toGroups2(devices.filter((device) => device.root === item)),
    };
  });
}

export { nestedSetToJson2 };

const data = [
  {
    root: "1",
    id: "1",
    level: "1",
    lft: "1",
    rgt: "16",
    title: "Root",
    photo: "0",
  },
  {
    root: "1",
    id: "2",
    level: "2",
    lft: "2",
    rgt: "9",
    title: "A",
    photo: "0",
  },
  {
    root: "1",
    id: "3",
    level: "3",
    lft: "3",
    rgt: "6",
    title: "C",
    photo: "0",
  },
  {
    root: "1",
    id: "4",
    level: "3",
    lft: "7",
    rgt: "8",
    title: "D",
    photo: "0",
  },
  {
    root: "1",
    id: "5",
    level: "4",
    lft: "4",
    rgt: "5",
    title: "E",
    photo: "0",
  },
  {
    root: "1",
    id: "6",
    level: "3",
    lft: "11",
    rgt: "12",
    title: "F",
    photo: "0",
  },
  {
    root: "1",
    id: "7",
    level: "2",
    lft: "10",
    rgt: "13",
    title: "B",
    photo: "0",
  },
  {
    root: "1",
    id: "8",
    level: "2",
    lft: "14",
    rgt: "15",
    title: "G",
    photo: "0",
  },
  //
  {
    root: "2",
    id: "1",
    level: "1",
    lft: "1",
    rgt: "16",
    title: "Root",
    photo: "0",
  },
  {
    root: "2",
    id: "2",
    level: "2",
    lft: "2",
    rgt: "9",
    title: "A",
    photo: "0",
  },
  {
    root: "2",
    id: "3",
    level: "3",
    lft: "3",
    rgt: "6",
    title: "C",
    photo: "0",
  },
  {
    root: "2",
    id: "4",
    level: "3",
    lft: "7",
    rgt: "8",
    title: "D",
    photo: "0",
  },
  {
    root: "2",
    id: "5",
    level: "4",
    lft: "4",
    rgt: "5",
    title: "E",
    photo: "0",
  },
  {
    root: "2",
    id: "6",
    level: "3",
    lft: "11",
    rgt: "12",
    title: "F",
    photo: "0",
  },
  {
    root: "2",
    id: "7",
    level: "2",
    lft: "10",
    rgt: "13",
    title: "B",
    photo: "0",
  },
  {
    root: "2",
    id: "8",
    level: "2",
    lft: "14",
    rgt: "15",
    title: "G",
    photo: "0",
  },
];
console.log(JSON.stringify(nestedSetToJson2(data), null, 2));
