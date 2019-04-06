import React, { useState, useEffect, useRef } from "react";

import useInterval from "./useInterval";
import Webcam from "./Camera";
import Show from "./Show";

const SCALE = 1;

const CameraComponent = () => {
  const [videoRef, setVideoRef] = useState();
  const [isCapturing, setIsCapturing] = useState(false);
  const [data, setData] = useState([]);

  useInterval(
    () => {
      setData([...data, capture()]);
    },
    isCapturing ? 1000 : null
  );

  const capture = () => {
    if (videoRef) {
      const video = videoRef.current.video;
      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth * SCALE;
      canvas.height = video.videoHeight * SCALE;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);

      const data = canvas.toDataURL();
      console.log(data);
      return data;
    }
  };

  const capture5sec = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
    }, 5000);
  };

  return (
    <>
      <Webcam onRef={setVideoRef} />

      <button onClick={capture}>capture</button>
      <button onClick={capture5sec}>capture5sec</button>
      <br />
      <br />
      <Show data={data} />
    </>
  );
};

export default CameraComponent;
