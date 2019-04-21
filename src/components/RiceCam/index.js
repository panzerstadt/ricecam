// https://ml5js.org/docs/image-classification-example
// https://codelabs.developers.google.com/?cat=TensorFlow
// https://console.firebase.google.com/u/3/project/operation-verde-ricecam/database

import React, { useState, useEffect, useRef } from "react";

import useInterval from "../customHooks/useInterval";
import Camera, { Gallery } from "../Camera";
import { pushImageDataToDB } from "../Database";

import { download, convertToArray } from "../atoms";
import { isBright } from "../BrightnessPredictor";

const SCALE = 1;
const RGB_SCALE = 0.02;
const DETECT_SCALE = 0.02;
const STREAM_SCALE = 1;

const BrightnessDetector = ({ videoRef, isDetecting, delay, onDetect }) => {
  // local ML
  const [detectionDelay, setDetectionDelay] = useState(500);

  useEffect(() => {
    if (delay && typeof delay === "number") setDetectionDelay(delay);
  }, [delay]);

  useInterval(
    () => {
      detect();
    },
    isDetecting ? detectionDelay : null
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
      if (onDetect) {
        onDetect({ bright: bright });
      }
    }
  };
  return null;
};

const CameraComponent = () => {
  const [videoRef, setVideoRef] = useState();
  const [isDay, setIsDay] = useState(true);

  // local ML states
  const [isDetecting, setIsDetecting] = useState(false);
  const DELAY = 1000;

  // local capture
  const [delay, setDelay] = useState(1000);
  const [isCapturing, setIsCapturing] = useState(false);
  useInterval(
    () => {
      capture();
    },
    isCapturing ? delay : null
  );

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

  // db streaming
  const [streamDelay, setStreamDelay] = useState(100);
  const [isStreaming, setIsStreaming] = useState(false);
  useInterval(
    () => {
      stream();
    },
    isStreaming ? streamDelay : null
  );
  const stream = () => {
    if (videoRef) {
      let context;
      const video = videoRef.current.video;
      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth * STREAM_SCALE;
      canvas.height = video.videoHeight * STREAM_SCALE;
      context = canvas.getContext("2d");

      // full res
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // preview
      // base64 setstate
      const b64 = canvas.toDataURL();
      setData([...data, b64]);

      // blob it to send to db
      // blobbing takes a long time therefore there is a callback
      canvas.toBlob(b => {
        console.log(b);
        pushImageDataToDB(b);
      });
    }
  };

  // --------
  // TESTING
  // --------

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
    pushImageDataToDB();
  };

  const streamToDB = () => {
    // toggle
    if (!isStreaming) {
      console.log("capturing!");
      setStreamDelay(1);
      setIsStreaming(true);
    } else {
      console.log("stopping!");
      setIsStreaming(false);
      setStreamDelay(1000);
    }
  };

  const handleToggleDetect = () => {
    setIsDetecting(!isDetecting);
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
      <button onClick={streamToDB}>toggle stream to database</button>
      <button onClick={handleToggleDetect}>toggle detection</button>
      <br />
      <br />
      <Gallery data={data} />
      <BrightnessDetector
        videoRef={videoRef}
        isDetecting={isDetecting}
        delay={DELAY}
        onDetect={v => setIsDay(v.bright)}
      />
    </div>
  );
};

export default CameraComponent;
