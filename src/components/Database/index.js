import firebase from "./lib/firebase";

export default firebase;

export const PushToFirebase = (databaseRef = "recording", data, callback) => {
  firebase
    .database()
    .ref(databaseRef)
    .push(data)
    .then(v => callback(v));
};
