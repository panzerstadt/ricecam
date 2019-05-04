import React, { useState, useEffect, useRef } from "react";
import { logging } from "../Database";

const VideoRecorder = ({
  videoRef,
  triggerRecording,
  duration,
  onComplete,
  showPreview
}) => {
  const OPTIONS = {
    tag: "video",
    type: "video/webm",
    ext: ".mp4",
    gUM: { video: true, audio: true }
  };
  const [videoOut, setVideoOut] = useState("");

  const [recordDuration, setRecordDuration] = useState(5000);
  useEffect(() => {
    if (duration && typeof duration === "number") setRecordDuration(duration);
  }, [duration]);

  const [isRecording, setIsRecording] = useState(false);
  const [videoRecordings, setVideoRecordings] = useState([]);
  const [videoChunk, setVideoChunk] = useState([]);
  const ulRef = useRef();
  useEffect(() => {
    if (triggerRecording === true && isRecording === false) {
      logging("VideoRecorder: START starting one recording");
      record({ duration: recordDuration });
    }
  }, [triggerRecording, isRecording]);

  useEffect(() => {
    // if there is a recording
    if (videoChunk.length > 0) {
      console.log("making link!", videoChunk);
      showPreview && makeLink();
    }
  }, [videoChunk]);

  const makeLink = () => {
    let blob = new Blob(videoChunk, { type: OPTIONS.type });

    let url = URL.createObjectURL(blob);

    const out = (
      <li key={url}>
        <video height={200} controls src={url} />
        <br />
        <a href={url} download={`video${OPTIONS.ext}`}>{`download ${`video${
          OPTIONS.ext
        }`}`}</a>
      </li>
    );
    setVideoOut([...videoOut, out]);
  };

  const record = ({ duration = 2000 }) => {
    if (videoRef) {
      const stream = videoRef.current.stream;
      if (!stream.active) {
        console.log("media stream is not active.", stream);
      }

      // setup recorder
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = e => {
        // when the recording is complete and there is data
        setVideoChunk([e.data]);
        if (onComplete) onComplete(e.data);
      };
      recorder.onstart = e => {
        setVideoChunk([]);
        setTimeout(() => {
          recorder.stop();
        }, recordDuration);
      };

      // run recorder
      recorder.start();
    }
  };

  return (
    <ul
      style={{
        display: "flex",
        listStyleType: "none",
        width: "100%",
        overflowX: "scroll"
      }}
    >
      {videoOut}
    </ul>
  );
};

export default VideoRecorder;
