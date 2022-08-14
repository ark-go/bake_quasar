import sanitizeHTML from "sanitize-html";

export function sanitizeDef(html) {
  return sanitizeHTML(html);
}
// добавление к уже существующих по умолчанию
// const  clean  =  sanitizeHtml ( грязный ,  {
//   allowTags : sanitizeHtml.defaults.allowTags.concat ( [ ' img ' ] ) } ) ; _ _ _ _
