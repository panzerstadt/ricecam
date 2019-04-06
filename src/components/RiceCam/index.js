import React, { useState, useEffect, useRef } from "react";

import useInterval from "../customHooks/useInterval";
import Camera, { Gallery } from "../Camera";
import { PushToFirebase } from "../Database";

import { isBright, download, convertToArray } from "../atoms";

const SCALE = 1;
const RGB_SCALE = 0.02;

const CameraComponent = () => {
  const [videoRef, setVideoRef] = useState();
  const [isDay, setIsDay] = useState(true);

  const [detectionDelay, setDetectionDelay] = useState(500);
  const [isDetecting, setIsDetecting] = useState(false);
  useInterval(
    () => {
      detect();
    },
    isDetecting ? detectionDelay : null
  );

  const [delay, setDelay] = useState(1000);
  const [isCapturing, setIsCapturing] = useState(false);
  useInterval(
    () => {
      capture();
    },
    isCapturing ? delay : null
  );

  const detect = async () => {
    if (videoRef) {
      let context;
      const video = videoRef.current.video;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth * RGB_SCALE;
      canvas.height = video.videoHeight * RGB_SCALE;

      context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // check brightness
      const bright = await isBright(canvas);
      bright ? setIsDay(true) : setIsDay(false);
    }
  };

  const [data, setData] = useState([]);
  const [rgb, setRGB] = useState([]);
  const capture = () => {
    if (videoRef) {
      let context;
      const video = videoRef.current.video;
      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth * SCALE;
      canvas.height = video.videoHeight * SCALE;
      context = canvas.getContext("2d");

      // full res
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // base64 setstate
      const b64 = canvas.toDataURL();
      setData([...data, b64]);

      context.clearRect(0, 0, canvas.width, canvas.height);

      canvas.width = video.videoWidth * RGB_SCALE;
      canvas.height = video.videoHeight * RGB_SCALE;

      context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // rgb array (flat)
      const clrs = context.getImageData(0, 0, canvas.width, canvas.height);
      console.log(clrs);
      const flat = convertToArray(clrs.data);

      setRGB([...rgb, flat]);
      // download(JSON.stringify({ data: flat }), "temp.json", "application/json");

      return data;
    }
  };

  const captureOne = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
    }, 1100);
  };

  const capture5sec = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
    }, 5000);
  };

  const capture5secvideo = () => {
    setDelay(1);
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setDelay(1000);
    }, 5000);
  };

  const downloadAsJson = () => {
    download(JSON.stringify({ data: rgb }), "temp.json", "application/json");
    setData([]);
    setRGB([]);
  };

  const sendToDB = () => {
    // push to firebase
  };

  return (
    <div style={{ backgroundColor: isDay ? "white" : "#282c34" }}>
      <Camera onRef={setVideoRef} />

      <br />
      <code>debug buttons: </code>
      <button onClick={captureOne}>capture</button>
      <button onClick={capture5sec}>capture5sec</button>
      <button onClick={capture5secvideo}>capture5sec video</button>
      <button onClick={downloadAsJson}>download data as json</button>
      <button onClick={sendToDB}>push to database</button>
      <button onClick={() => setIsDetecting(!isDetecting)}>
        toggle detection
      </button>
      <br />
      <br />
      <Gallery data={data} />
    </div>
  );
};

export default CameraComponent;
