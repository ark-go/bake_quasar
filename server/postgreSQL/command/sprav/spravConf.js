export function isCheckTableName(tabName) {
  const tspravTablesName = [
    "kagentvid",
    "kagentgroup",
    "kagentvidreg",
    "brand",
    // "trademark",
    "region",
    // "city",
    "branch", // филиал
    "territory",
  ];

  return tspravTablesName.includes(tabName);
}
