// https://ml5js.org/docs/image-classification-example
// https://codelabs.developers.google.com/?cat=TensorFlow
// https://console.firebase.google.com/u/3/project/operation-verde-ricecam/database

import React, { useState, useEffect, useRef } from "react";
// timestamps
import dayjs from "dayjs";
import "dayjs/locale/ja";

import useInterval from "../customHooks/useInterval";
import Camera, { Gallery } from "../Camera";
import VideoRecorder from "../MediaRecorder";
import {
  pushImageDataToStorage,
  pushVideoDataToStorage,
  grabListOfVideoPaths,
  logging,
  activityMonitor
} from "../Database";

import { download, convertToArray, convertToObject } from "../atoms";
import { isBright } from "../BrightnessPredictor";

dayjs.locale("ja");
const SCALE = 1;
const RGB_SCALE = 0.02;
const DETECT_SCALE = 0.02;
const STREAM_SCALE = 1;
const MONITOR_SCALE = 0.1;

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

const PhotoRecorder = () => {};

const Timer = ({ start, end, onDetect }) => {
  const [isActive, setIsActive] = useState(false);

  const timestamp = dayjs().format("YYYY-MM-DDTHH:mm:ss:SSS");
  const startTimestamp = dayjs(start);
  const endTimestamp = dayjs(end);

  console.log(timestamp, startTimestamp, endTimestamp);
};

const VideoList = () => {
  // list videos from db
  const [vlist, setVlist] = useState([]);

  useEffect(() => {
    grabListOfVideoPaths().then(v => {
      console.log("paths");
      console.log(v);
      setVlist(v);
    });
  }, []);

  return (
    <>
      <h3>current list of videos today ({vlist.length}): </h3>
      <ul
        style={{
          whiteSpace: "nowrap",
          fontSize: "0.5rem",
          listStyleType: "none",
          height: 300,
          overflow: "scroll"
        }}
      >
        {vlist.map((v, i) => {
          return (
            <li key={i} style={{ margin: "5px 0" }}>
              <a href={v}>{v}</a>
            </li>
          );
        })}
      </ul>
    </>
  );
};

const CameraComponent = ({ showPreviews = false }) => {
  const [videoRef, setVideoRef] = useState();
  const [logs, setLogs] = useState([]);
  const [isDay, setIsDay] = useState(true);
  // log messages
  const handleLog = message => {
    setLogs([...logs.slice(-4), message]);
    logging(message, v => console.log("LOGGER: completed. ", v));
  };
  // log browser status
  const ACTIVITY_MONITOR_INTERVAL = 60000;
  useInterval(() => {
    console.log("logging browser performance");
    activityMonitor();
  }, ACTIVITY_MONITOR_INTERVAL);

  // local ML brightness detector
  const [isDetecting, setIsDetecting] = useState(false);
  const DELAY = 1000;
  // video recorder
  const [isRecording, setIsRecording] = useState(false);
  const DURATION = 5000;

  // timer for multiple video records
  const [isRecordingContinuously, setIsRecordingContinuously] = useState(false);
  const EVERY_N_MINS = 5;
  const RECORDING_INTERVALS = EVERY_N_MINS * 60000;
  useInterval(
    () => {
      const t = dayjs().format("YYYY-MM-DDTHH:mm:ss:SSS");

      if (!isRecording) {
        handleLog(`recording video at ${t}`);
        setIsRecording(true);
      } else {
        handleLog("recording still underway, not setting recording to true");
      }
    },
    isRecordingContinuously ? RECORDING_INTERVALS : null
  );

  // local capture
  const [captureDelay, setCaptureDelay] = useState(1000);
  const [isCapturing, setIsCapturing] = useState(false);
  useInterval(
    () => {
      capture();
    },
    isCapturing ? captureDelay : null
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
      // canvas.width = 12;
      // canvas.height = 9;

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

  // db streaming for images
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
        pushImageDataToStorage(b);
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
    setCaptureDelay(1);
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      setCaptureDelay(1000);
    }, 5000);
  };

  const downloadAsJson = () => {
    download(JSON.stringify({ data: rgb }), "temp.json", "application/json");
    setData([]);
    setRGB([]);
  };

  const sendToDB = () => {
    // push to firebase
    pushImageDataToStorage();
  };

  const streamToDB = () => {
    // toggle
    handleLog("streaming images to database!");
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

  const handleRecord1Hour = () => {
    const OneHourInMS = 3600000;
    setIsRecording(true);
    setIsRecordingContinuously(true);
    setTimeout(() => {
      setIsRecordingContinuously(false);
    }, OneHourInMS);
  };

  const handleRecordContinuous = () => {
    handleLog("recording forever!");
    setIsRecording(true);
    setIsRecordingContinuously(true);
  };

  const handleToggleDetect = () => {
    setIsDetecting(!isDetecting);
  };

  const handleVideoComplete = vidBlob => {
    console.log(vidBlob);
    pushVideoDataToStorage(vidBlob);
    setIsRecording(false);
  };

  useEffect(() => {
    if (videoRef) {
      const video = videoRef.current.video;
      video.height = video.videoHeight * MONITOR_SCALE;
      video.width = video.videoWidth * MONITOR_SCALE;
      console.log(videoRef.current.video);
    }
  }, [videoRef]);

  return (
    <div style={{ backgroundColor: isDay ? "white" : "#282c34" }}>
      <Camera onRef={setVideoRef} />

      <br />
      <code>debug buttons: </code>
      {/* <button onClick={captureOne}>capture</button>
      <button onClick={capture5sec}>capture5sec</button>
      <button onClick={capture5secvideo}>capture5sec video</button>
      <button onClick={downloadAsJson}>download data as json</button>
      <button onClick={sendToDB}>push to database</button> */}
      <button
        onClick={async () => {
          const l = await grabListOfVideoPaths();
          console.log(l);
          console.log(typeof l);
        }}
      >
        list videos recorded today
      </button>
      <button onClick={streamToDB}>toggle stream to database</button>
      <button onClick={handleToggleDetect}>toggle brightness detection</button>
      <button
        style={{ color: isRecording ? "red" : "black" }}
        onClick={() => setIsRecording(!isRecording)}
      >
        record 5 sec
      </button>
      <button onClick={handleRecord1Hour}>
        record 5 sec videos for 1 hour
      </button>
      <button onClick={handleRecordContinuous}>
        record 5 sec indefinitely
      </button>
      <br />
      <ul>
        {logs.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>

      <br />
      {showPreviews && <Gallery data={data} />}
      <VideoRecorder
        videoRef={videoRef}
        triggerRecording={isRecording}
        duration={DURATION}
        previewVideo={showPreviews}
        onComplete={handleVideoComplete}
      />
      <VideoList />
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
