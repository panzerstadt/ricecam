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

export const convertToObject = domOBJ => {
  let obj = {};
  for (var p in domOBJ) {
    obj[p] = domOBJ[p];
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
