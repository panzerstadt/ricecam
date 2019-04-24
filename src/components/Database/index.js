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

export const logging = (message, callback) => {
  const timestamp = dayjs().format("YYYY-MM-DDTHH:mm:ss:SSS");
  const daystamp = dayjs().format("YYYY-MM-DD");

  firebase
    .firestore()
    .collection("logs")
    .doc(daystamp)
    .collection("logs")
    .doc(timestamp)
    .set({ message: message }, { merge: true })
    .then(v => {
      callback && callback(v);
    })
    .catch(e => console.log("LOGGING ERROR: ", e));
};

export const activityMonitor = async callback => {
  function convertToObject(input, showFunction) {
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
  }

  const timestamp = dayjs().format("YYYY-MM-DDTHH:mm:ss:SSS");
  const daystamp = dayjs().format("YYYY-MM-DD");

  // browser tab storage
  let browserStorage;
  if ("storage" in navigator && "estimate" in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    browserStorage = {
      usage: estimate.usage,
      quota: estimate.quota,
      percent: `${((estimate.usage * 100) / estimate.quota).toFixed(0)} used`
    };
  } else {
    browserStorage = "browser does not have storage API";
  }
  // js heap size
  //   This API returns three pieces of data:
  // jsHeapSizeLimit - The amount of memory (in bytes) that the JavaScript heap is limited to.
  // totalJSHeapSize - The amount of memory (in bytes) that the JavaScript heap has allocated including free space.
  // usedJSHeapSize - The amount of memory (in bytes) currently being used.
  const mem = window.performance.memory || {};
  // RAM
  const ram =
    `${navigator.deviceMemory} GB` ||
    "browser does not have deviceMemory API (ram)";
  // network speed
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection ||
    navigator.msConnection;
  const connectionSpeed = connection
    ? connection.effectiveType
    : "browser does not have connection API";
  // battery
  let battery;
  if ("getBattery" in navigator) {
    battery = await navigator.getBattery();
  }
  const batteryLevel = battery
    ? battery.level
    : "browser does not have battery API";
  // general performance
  // .toJSON() is unreliable, returns custom objects
  const performance = convertToObject(window.performance, false);

  const output = {
    storage: browserStorage,
    ram: ram,
    network: connectionSpeed,
    battery: batteryLevel,
    performance: performance,
    browserMemory: {
      ...convertToObject(mem, false),
      usage: `${(mem.totalJSHeapSize / mem.jsHeapSizeLimit) * 100} percent`,
      comment:
        "units in bytes. percent is percent of allocated browser memory (multiple tabs included)"
    }
  };

  firebase
    .firestore()
    .collection("logs")
    .doc(daystamp)
    .collection("browser performance logs")
    .doc(timestamp)
    .set({ status: output }, { merge: true })
    .then(v => {
      callback && callback(v);
    })
    .catch(e => console.log("LOGGING ERROR: ", e));
};

export const pushImageDataToStorage = imgBlob => {
  const imgFolder = "images";
  const timestamp = dayjs().format("YYYY-MM-DDTHH:mm:ss:SSS");
  const daystamp = dayjs().format("YYYY-MM-DD");

  firebase
    .storage()
    .ref(`${imgFolder}/${timestamp}.png`)
    .put(imgBlob)
    .then(res => {
      console.log(res);
      console.log(res.ref.location.path);
      const path = res.ref.location.path;
      firebase
        .firestore()
        .collection("imageURL")
        .doc(daystamp)
        .collection("urls")
        .doc()
        .set({ url: path });
    })
    .catch(e => {
      const err = `pushImageDataToStorage: ERROR ${e}`;
      logging(err, () => console.log(err));
    });
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
        .set({ url: path })
        .then(v => {
          const l = `pushVideoDataToStorage: COMPLETE video:${vidFolder}/${timestamp}.mp4, ref: ${path}, callback: ${v}`;
          logging(l, () => console.log(l));
        });
    })
    .catch(e => {
      const err = `pushVideoDataToStorage: ERROR ${e}`;
      logging(err, () => console.log(err));
    });
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
        // console.log(url);

        return await firebase
          .storage()
          .ref(url)
          .getDownloadURL()
          .then(src => {
            // and here are your downloadable urls
            // console.log("downloadable url: ", src);
            output.push(src);
          });
      });

      //console.log("returning output! ", output);
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
