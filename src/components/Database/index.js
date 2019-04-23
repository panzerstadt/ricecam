import firebase from "./lib/firebase";

// timestamps
import dayjs from "dayjs";
import "dayjs/locale/ja";
dayjs.locale("ja");

export default firebase;

const PushToFirebase = (databaseRef = "test", data, callback) => {
  firebase
    .database()
    .ref(databaseRef)
    .push(data)
    .then(v => callback(v));
};

const PushToFirestore = (databaseRef = "test", data, callback) => {
  const db = firebase.firestore();
  db.collection(databaseRef);
};

const sortTimestampArray = (data, latest = false) => {
  if (latest) return data.sort((prev, next) => dayjs(next) - dayjs(prev));
  // latest first
  else return data.sort((prev, next) => dayjs(prev) - dayjs(next)); // earliest first
};

export const pushImageDataToDB = imgBlob => {
  // push should only append imageData
  // (or url, depending on whether or not we use storage)
  // to the db
  const imgCollection = "imageData";
  const timestamp = dayjs().format("YYYY-MM-DDTHH:mm:ss:SSS");

  const ref = firebase
    .storage()
    .ref(`images/${timestamp}.png`)
    .put(imgBlob);

  console.log(ref);
};

export const pushVideoDataToDB = vidBlob => {
  const vidFolder = "videos";
  const timestamp = dayjs().format("YYYY-MM-DDTHH:mm:ss:SSS");

  const ref = firebase
    .storage()
    .ref(`${vidFolder}/${timestamp}.mp4`)
    .put(vidBlob);

  console.log(ref);
};

const deleteImageDataFromDBRecords = () => {
  // delete by timestamp based on prediction
  const imgCollection = "imageData";
};

const createVideoFromDBRecords = () => {
  // pull in data from DB and construct video
  const imgCollection = "imageData";
  const predCollection = "";
};

const getPredictionsFromDB = () => {
  // predictions should return together with the references UID from imageData
  // as well as timestamp
  const collectionName = "predictions";
};
