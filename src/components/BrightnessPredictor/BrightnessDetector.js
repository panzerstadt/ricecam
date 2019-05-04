import { useState, useEffect } from "react";
import useInterval from "../customHooks/useInterval";

import { isBright } from "./helpers";

const BrightnessDetector = ({ videoRef, isDetecting, delay, onDetect }) => {
  // local ML brightness detection
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
      canvas.width = 12;
      canvas.height = 9;
      // TODO: check if canvas is drawing entire image, or is it cut off

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

export default BrightnessDetector;
