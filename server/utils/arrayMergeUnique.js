/**
 * Объединяет удаляет повторяющиеся элементы из массива
 * @param {О} array
 * @returns.
 * sample: arrayUnique(array1.concat(array2));
 */
function arrayUnique(array) {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }

  return a;
}

export { arrayUnique };

// var array1 = ["Vijendra","Singh"];
// var array2 = ["Singh", "Shakya"];
//     // Merges both arrays and gets unique items
// var array3 = arrayUnique(array1.concat(array2));
// // Log to console
// console.log(array3)
