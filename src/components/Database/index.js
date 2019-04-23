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

export const pushImageDataToStorage = imgBlob => {
  // push should only append imageData
  // (or url, depending on whether or not we use storage)
  // to the db
  const timestamp = dayjs().format("YYYY-MM-DDTHH:mm:ss:SSS");

  const ref = firebase
    .storage()
    .ref(`images/${timestamp}.png`)
    .put(imgBlob);

  console.log(ref);
};

export const pushVideoDataToStorage = vidBlob => {
  const vidFolder = "videos";
  const timestamp = dayjs().format("YYYY-MM-DDTHH:mm:ss:SSS");
  const daystamp = dayjs().format("YYYY-MM-DD");

  firebase
    .storage()
    .ref(`${vidFolder}/${timestamp}.mp4`)
    .put(vidBlob)
    .then(res => {
      console.log(res);
      console.log(res.ref.location.path);
      const path = res.ref.location.path;
      const dbRef = firebase
        .firestore()
        .collection("videoURL")
        .doc(daystamp)
        .collection("urls")
        .doc()
        .set({ url: path });
    })
    .catch(e => console.log("error! ", e));
};

export const grabListOfVideoPaths = async day => {
  const daystamp = day
    ? dayjs(day).format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD");

  console.log("grabbing videos from: ", daystamp);

  return await firebase
    .firestore()
    .collection("videoURL")
    .doc(daystamp)
    .collection("urls")
    .get()
    .then(async querySnapshot => {
      let output = [];
      await querySnapshot.forEach(async doc => {
        // here are your DB video filepaths
        const url = doc.data().url;

        console.log(url);

        return await firebase
          .storage()
          .ref(url)
          .getDownloadURL()
          .then(src => {
            // and here are your downloadable urls
            console.log("downloadable url: ", src);
            output.push(src);
          });
      });

      console.log("returning output! ", output);
      return output;
    });
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
