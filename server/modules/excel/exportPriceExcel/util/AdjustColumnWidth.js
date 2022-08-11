export function AdjustColumnWidth(worksheet) {
  worksheet.columns.forEach((column) => {
    const lengths = column.values.map((v) => {
      //  console.log("P>", v);
      if (v instanceof Date) {
        // дата почемуто в объекте Date?а там она в межнародном формате
        return "99.99.9999".length;
      }
      return v.toString().length;
    });
    const maxLength = Math.max(...lengths.filter((v) => typeof v === "number"));
    column.width = maxLength + 3; // добавляем чтото для кнопки от фильтра в заголовке
  });
}
