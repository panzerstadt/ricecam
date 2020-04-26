// https://ml5js.org/docs/image-classification-example
// https://codelabs.developers.google.com/?cat=TensorFlow
// https://console.firebase.google.com/u/3/project/operation-verde-ricecam/database

import React, { useState, useEffect } from "react";
// timestamps
import dayjs from "dayjs";
import "dayjs/locale/ja";

import useInterval from "../customHooks/useInterval";
import Camera from "../Camera";
import VideoRecorder from "../MediaRecorder";
import BrightnessDetector from "../BrightnessPredictor";
import {
  pushImageDataToStorage,
  pushVideoDataToStorage,
  reportAppStatetoDB,
  listenToDBAppState,
  grabListOfVideoPaths,
  logging,
  activityMonitor,
} from "../Database";

import { download, convertToArray, convertToObject } from "../atoms";

dayjs.locale("ja");
const SCALE = 1;
const RGB_SCALE = 0.02;
const DETECT_SCALE = 0.02;
const STREAM_SCALE = 1;
const MONITOR_SCALE = 0.1;

const PhotoRecorder = ({ videoRef, captureDelay, isCapturing, onRecord }) => {
  useInterval(
    () => {
      capture();
    },
    isCapturing ? captureDelay : null
  );

  const [data, setData] = useState([]);
  const [rgb, setRGB] = useState([]);
  const capture = () => {
    let out = {
      b64: "",
      rgbArray: [],
    };
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
      out.b64 = [...data, b64];

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
      out.rgbArray = [...rgb, flat];
      // download(JSON.stringify({ data: flat }), "temp.json", "application/json");

      onRecord && onRecord(out);

      return data;
    }
  };

  return <p>capturing: {isCapturing}</p>;
};

const PhotoStream = ({ videoRef, streamDelay, isStreaming }) => {
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
      // setData([...data, b64]);

      // blob it to send to db
      // blobbing takes a long time therefore there is a callback
      canvas.toBlob((b) => {
        console.log(b);
        pushImageDataToStorage(b);
      });
    }
  };

  return <p> DEBUG: photo streaming: {`${isStreaming}`}</p>;
};

const isWithinTimeRange = (start, end) => {
  console.log(start, end);
  if (!start || !end) return false;
  const timestamp = dayjs();
  const sH = start.slice(0, 2);
  const sM = start.slice(2);
  const startTimestamp = dayjs().hour(sH).minute(sM);

  const eH = end.slice(0, 2);
  const eM = end.slice(2);
  const endTimestamp = dayjs().hour(eH).minute(eM);

  const chk1 = timestamp.isAfter(startTimestamp);
  const chk2 = timestamp.isBefore(endTimestamp);
  const res = chk1 && chk2;

  return res;
};

const Timer = ({ start, end, onDetect }) => {
  if (!start || !end) return "null timer";
  const timestamp = dayjs();
  const sH = start.slice(0, 2);
  const sM = start.slice(2);
  const startTimestamp = dayjs().hour(sH).minute(sM);

  const eH = end.slice(0, 2);
  const eM = end.slice(2);
  const endTimestamp = dayjs().hour(eH).minute(eM);

  const chk1 = timestamp.isAfter(startTimestamp);
  const chk2 = timestamp.isBefore(endTimestamp);
  const res = chk1 && chk2;

  res && onDetect && onDetect(res);

  return (
    <div>
      <h3>timer: </h3>
      <p>now: {timestamp.format("HH:mm")}</p>
      <p>start: {startTimestamp.format("HH:mm")}</p>
      <p>end: {endTimestamp.format("HH:mm")}</p>
      <p>recording allowed? : {`${res}`}</p>
    </div>
  );
};

const VideoList = () => {
  // list videos from db
  const [vlist, setVlist] = useState([]);

  useEffect(() => {
    grabListOfVideoPaths().then((v) => {
      setVlist(v);
    });
  }, []);

  const names = vlist.map((v) =>
    decodeURIComponent(v.split("/videos%2F")[1].split("?alt")[0])
  );

  return (
    <>
      <h3>current list of videos today ({vlist.length}): </h3>
      <ul
        style={{
          whiteSpace: "nowrap",
          fontSize: "0.5rem",
          listStyleType: "none",
          height: 300,
          overflow: "scroll",
        }}
      >
        {vlist.map((v, i) => {
          return (
            <li key={i} style={{ margin: "5px 0" }}>
              <a href={v}>{names[i]}</a>
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
  const handleLog = (message) => {
    setLogs((prev) => [...prev.slice(-4), message]);
    console.log("LOGGER message: ", message);
    logging(message, (v) => console.log("LOGGER: completed. ", v));
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
  const [videoDuration, setVideoDuration] = useState(5000);
  const [timer, setTimer] = useState({ start: null, end: null });
  const [isRecordingContinuously, setIsRecordingContinuously] = useState(false);
  const [cameraName, setCameraName] = useState("");
  const EVERY_N_MINS = 5;
  const [recordIntervalMin, setRecordIntervalMin] = useState(EVERY_N_MINS);
  useInterval(
    () => {
      const t = dayjs().format("YYYY-MM-DDTHH:mm:ss:SSS");

      if (!isRecording && isWithinTimeRange(timer.start, timer.end)) {
        handleLog(`recording video at ${t}`);
        console.log(
          "within timer?? ",
          isWithinTimeRange(timer.start, timer.end)
        );
        setIsRecording(true);
      } else {
        handleLog("recording still underway, not setting recording to true");
      }
    },
    isRecordingContinuously ? recordIntervalMin * 60000 : null
  );

  // listen to DB commands (remote)
  const [dbCommands, setDBCommands] = useState({});
  useEffect(() => {
    if (videoRef) {
      console.log("listening to DB!");
      listenToDBAppState(setDBCommands);
    }
  }, [videoRef]);
  // set commands according to db
  const handleSetVideoDuration = (amount) => {
    handleLog(
      `setting recording duration to ${dbCommands.videoDurationSec} secs`
    );
    setVideoDuration(amount);
  };
  const handleSetVideoRecordFrequency = (mins) => {
    handleLog(
      `setting recording interval to ${dbCommands.videoRecordFreqMin} mins`
    );
    setRecordIntervalMin(mins);
  };
  const handleSetTimer = (time) => {
    handleLog(`setting timers to ${JSON.stringify(time)}`);
    if (time.start && time.end) {
      setLocalStateMonitor((p) => ({
        ...p,
        isTimerSet: true,
      }));
      setTimer(time);
    }
  };
  const handleRecordOnce = (run) => {
    handleLog(`recording video once`);
    setLocalStateMonitor((p) => ({
      ...p,
      isRecording: true,
    }));
    setIsRecording(true);
  };
  const handleRecordContinuous = (run) => {
    if (run) {
      handleLog(
        `setting continuous recording to ${dbCommands.setContinuousRecording}`
      );
      setLocalStateMonitor((p) => ({
        ...p,
        isContinuouslyRecording: true,
        isRecording: true,
      }));
      setIsRecording(true);
      setIsRecordingContinuously(true);
    } else {
      handleLog(
        `setting continuous recording to ${dbCommands.setContinuousRecording}`
      );
      setLocalStateMonitor((p) => ({
        ...p,
        isContinuouslyRecording: false,
        isRecording: false,
      }));
      setIsRecording(false);
      setIsRecordingContinuously(false);
    }
  };
  useEffect(() => {
    if (dbCommands) {
      handleLog(`commands received: ${JSON.stringify(dbCommands)}`);
      if (
        timer.start !== dbCommands.timerStart ||
        timer.end !== dbCommands.timerEnd
      ) {
        handleSetTimer({
          start: dbCommands.timerStart,
          end: dbCommands.timerEnd,
        });
      }
      if (isRecordingContinuously !== dbCommands.setContinuousRecording) {
        handleRecordContinuous(dbCommands.setContinuousRecording);
      }
      if (videoDuration !== dbCommands.videoDurationSec) {
        handleSetVideoDuration(dbCommands.videoDurationSec);
      }
      if (recordIntervalMin !== dbCommands.videoRecordFreqMin) {
        handleSetVideoRecordFrequency(dbCommands.videoRecordFreqMin);
      }
    }
  }, [dbCommands]);

  // push local state to DB
  const [localStateMonitor, setLocalStateMonitor] = useState({
    isContinuouslyRecording: null,
    isRecording: null,
    isTimerSet: null,
    nextRecordingTime: null,
  });
  useEffect(() => {
    reportAppStatetoDB(localStateMonitor);
  }, [localStateMonitor]);

  // --------
  // TESTING
  // --------
  // db streaming for images
  const [streamDelay, setStreamDelay] = useState(100);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamToDB = () => {
    // toggle

    if (!isStreaming) {
      handleLog("streaming images to database!");
      // setStreamDelay(100);
      setIsStreaming(true);
    } else {
      handleLog("image streaming stopped!");
      setIsStreaming(false);
      // setStreamDelay(1000);
    }
  };
  const handleStreamToDB = (run) => {
    if (run) {
      handleLog("DEBUG: streaming images to database!");
      // setStreamDelay(100);
      setIsStreaming(true);
    } else {
      handleLog("DEBUG: stopping image stream!");
      setIsStreaming(false);
    }
  };
  useEffect(() => {
    if (dbCommands) {
      if (isStreaming !== dbCommands.debugStreamImages) {
        handleStreamToDB(dbCommands.debugStreamImages);
      }
    }
  }, [dbCommands]);

  // const handleRecord1Hour = () => {
  //   const OneHourInMS = 3600000;
  //   setIsRecording(true);
  //   setIsRecordingContinuously(true);
  //   setTimeout(() => {
  //     setIsRecordingContinuously(false);
  //   }, OneHourInMS);
  // };

  const handleToggleDetect = () => {
    setIsDetecting(!isDetecting);
  };

  const handleVideoComplete = (vidBlob) => {
    console.log(cameraName, vidBlob);
    pushVideoDataToStorage(vidBlob, cameraName);
    setLocalStateMonitor((p) => ({ ...p, isRecording: false }));
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

  const [isShowingDebug, toggleIsShowingDebug] = useState(false);

  return (
    <div style={{ backgroundColor: isDay ? "white" : "#282c34" }}>
      <Camera onRef={setVideoRef} />

      <br />
      {!cameraName ? (
        <h3>please select a camera</h3>
      ) : (
        <p>
          select <strong style={{ color: "gray" }}>'record 5 sec'</strong> to
          test that the camera is recording properly.
          <br />
          if it does, your new video should show up on the 'current list of
          videos today' section.
          <br />
          When you are ready, press the{" "}
          <strong>'record 5 sec indefinitely'</strong> button.
        </p>
      )}

      <code>recording options: </code>
      <br />
      <button
        style={{
          color: isRecording ? "red" : "black",
          padding: "5px 10px",
          fontWeight: "bold",
        }}
        onClick={handleRecordOnce}
      >
        record 5 sec
      </button>
      {/* <button onClick={handleRecord1Hour}>
        record 5 sec videos for 1 hour
      </button> */}
      <button
        onClick={handleRecordContinuous}
        style={{
          color: isRecordingContinuously ? "red" : "black",
          padding: "5px 10px",
          fontWeight: "bold",
        }}
      >
        record 5 sec indefinitely
      </button>
      <select
        onChange={(e) => {
          console.log(e.target.value + " selected");
          setCameraName(e.target.value);
        }}
        style={{
          padding: "5px 10px",
          fontWeight: "bold",
          color: cameraName ? "black" : "red",
        }}
      >
        <option style={{ color: "red" }} value="">
          PLEASE SELECT CAMERA
        </option>
        <option value="CAM 01">CAM 01</option>
        <option value="CAM 02">CAM 02</option>
      </select>
      <br />
      <VideoList />
      <br />

      <button
        onClick={() => toggleIsShowingDebug((p) => !p)}
        style={{ padding: "5px 10px", marginBottom: 30 }}
      >
        Toggle Show Debug
      </button>

      {isShowingDebug ? (
        <div>
          <code>debug buttons: </code>
          <br />
          {/* <button onClick={captureOne}>capture</button>
          <button onClick={capture5sec}>capture5sec</button>
          <button onClick={capture5secvideo}>capture5sec video</button>
          <button onClick={downloadAsJson}>download data as json</button>
          <button onClick={sendToDB}>push to database</button> */}
          <button
            style={{ color: isStreaming ? "red" : "orange" }}
            onClick={streamToDB}
          >
            DEBUG: toggle stream to database
          </button>
          <button onClick={handleToggleDetect}>
            toggle brightness detection
          </button>
          <br />
          <br />
          <code>debug logging: </code>
          <br />
          <ul>
            {logs.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>

          <br />
          {/* {showPreviews && <Gallery data={data} />} */}
          <VideoRecorder
            videoRef={videoRef}
            triggerRecording={isRecording}
            duration={videoDuration}
            showPreview={showPreviews}
            onComplete={handleVideoComplete}
          />
          {/* possible usage: user (twitter) controlled photo session
      <PhotoRecorder
        videoRef={videoRef}
        showPreview={showPreviews}
        captureDelay={captureDelay}
        isCapturing={isCapturing}
      /> */}

          <PhotoStream
            videoRef={videoRef}
            showPreview={showPreviews}
            streamDelay={streamDelay}
            isStreaming={isStreaming}
          />
          <br />
          <h3>local state:</h3>
          {JSON.stringify(localStateMonitor, null, 2)}

          <h3>db state</h3>
          {JSON.stringify(dbCommands, null, 2)}
        </div>
      ) : null}

      <BrightnessDetector
        videoRef={videoRef}
        isDetecting={isDetecting}
        delay={DELAY}
        onDetect={(v) => setIsDay(v.bright)}
      />
    </div>
  );
};

export default CameraComponent;
