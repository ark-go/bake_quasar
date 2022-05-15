import randomstring from "randomstring";
export async function pdfmain(req, res) {
  if (!req.body?.pdfOpts) {
    return {
      error: "Не правильный запрос 1",
    };
  }

  if (req.session?.user) {
    let randStr = randomstring.generate();
    req.session.user.currentPdf = {
      pdf: req.body?.pdfOpts,
      key: randStr,
    };
    return {
      result: randStr,
    };
  }
  return {
    error: "Не правильный запрос 2",
  };
}

/**
 * randomstring.generate();
// >> "XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT"

randomstring.generate(7);
// >> "xqm5wXX"

randomstring.generate({
  length: 12,
  charset: 'alphabetic'
});
// >> "AqoTIzKurxJi"

randomstring.generate({
  charset: 'abc'
});
// >> "accbaabbbbcccbccccaacacbbcbbcbbc"

randomstring.generate({
  charset: 'abc'
}, cb);
 */
