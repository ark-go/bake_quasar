export function AdjustColumnWidth(worksheet) {
  worksheet.columns.forEach((column) => {
    const lengths = column.values.map((v) => {
      let RR = v.toString();

      if (v instanceof Date) {
        // дата почемуто в объекте Date?а там она в межнародном формате
        RR = "99.99.9999";
      }

      if (RR.trim() == "" || typeof v === "object") {
        RR = "99999.00";
      }
      if (typeof v === "string") {
        return (RR + "XXX").length; // добавляем чтото для кнопки от фильтра в заголовке
      }
      //  console.log("V: ", v);
      return RR.length;
    });
    const maxLength = Math.max(...lengths.filter((v) => typeof v === "number"));
    // если не задано width
    // console.log("column", column.values);
    column.width = maxLength;
  });
}
