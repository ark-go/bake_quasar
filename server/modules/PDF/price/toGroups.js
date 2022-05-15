// export function toGroups(devices) {
//   const series = Array.from(new Set(devices.map((item) => item.bakery_name)));
//   return series.map((item, idx, arr) => {
//     const series = item ? { bakery_name: item } : null;

//     return {
//       ...series,
//       items: devices.filter((device) => device.bakery_name === item),
//     };
//   });
// }

export function toGroups(devices) {
  const series = Array.from(new Set(devices.map((item) => item.bakery_name)));
  return series.map((item, idx, arr) => {
    const series = item ? { bakery_name: item } : null;

    return {
      ...series,
      items: toGroups2(devices.filter((device) => device.bakery_name === item)),
    };
  });
}

export function toGroups2(devices) {
  const series = Array.from(new Set(devices.map((item) => item.product_name)));
  return series.map((item, idx, arr) => {
    const series = item ? { product_name: item } : null;

    return {
      ...series,
      items: devices.filter((device) => device.product_name === item),
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
