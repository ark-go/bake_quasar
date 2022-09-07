// https://github.com/apostrophecms/sanitize-html#readme
import sanitizeHTML from "sanitize-html";

export function sanitizeDef(html) {
  return sanitizeHTML(html, {
    allowedAttributes: {
      div: ["style"],
      span: ["style"],
    },
  });
}
// добавление к уже существующих по умолчанию
// const  clean  =  sanitizeHtml ( грязный ,  {
//   allowTags : sanitizeHtml.defaults.allowTags.concat ( [ ' img ' ] ) } ) ; _ _ _ _

/*
 allowedAttributes: {
          'p': ["style"],
        },
*/
