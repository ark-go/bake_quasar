export function toGroups(devices) {
  const series = Array.from(new Set(devices.map((item) => item.main_product)));
  return series.map((item, idx, arr) => {
    const series = item ? { main_product: item } : null;

    return {
      ...series,
      items: devices.filter((device) => device.main_product === item),
    };
  });
}

// export function toGroupsArr(devices) {
//   const series = Array.from(new Set(devices.map((item) => item[0])));
//   return series.map((item) => {
//     const series = item ? item[0] : null;

//     return {
//       ...series,
//       items: devices.filter((device) => device.series === item),
//     };
//   });
// }
