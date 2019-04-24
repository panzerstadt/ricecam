//https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file

export const download = (
  content,
  fileName = "json.txt",
  contentType = "text/plain"
) => {
  let a = document.createElement("a");
  let file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
};

export const convertToObject = (input, showFunction) => {
  // recursively
  // https://stackoverflow.com/questions/37733272/convert-dom-object-to-javascript-object
  let obj = {};
  for (var p in input) {
    switch (typeof input[p]) {
      case "function":
        if (showFunction) obj[p] = `function: ${input[p]}`;
        break;
      case "object":
        obj[p] = convertToObject(input[p], showFunction);
        break;
      case "number":
        obj[p] = input[p];
        break;
      default:
        obj[p] = input[p];
    }
  }
  return obj;
};

export const convertToArray = domOBJ => {
  let arr = [];
  for (var p in domOBJ) {
    arr.push(domOBJ[p]);
  }
  return arr;
};
