import React, { useState, useEffect, useRef } from "react";
import { logging } from "../Database";

export const ENCODING_TYPES = [
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/mp4",
  "video/H264",
  "video/quicktime",
];

const VideoRecorder = ({
  videoRef,
  triggerRecording,
  duration,
  onComplete,
  showPreview,
}) => {
  let mimeTypeOptions;
  if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
    mimeTypeOptions = { mimeType: "video/webm; codecs=vp9", ext: ".webm" };
  } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
    mimeTypeOptions = { mimeType: "video/webm; codecs=vp8", ext: ".webm" };
  } else if (MediaRecorder.isTypeSupported("video/mp4")) {
    mimeTypeOptions = { mimeType: "video/mp4", ext: ".mp4" };
  } else if (MediaRecorder.isTypeSupported("video/H264")) {
    mimeTypeOptions = { mimeType: "video/H264", ext: ".mp4" };
  } else if (MediaRecorder.isTypeSupported("video/quicktime")) {
    mimeTypeOptions = { mimeType: "video/quicktime", ext: ".mov" };
  }
  const OPTIONS = {
    ...mimeTypeOptions,
    tag: "video",
    gUM: { video: true, audio: true },
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
    console.log("making blob of type", OPTIONS.mimeType);
    let blob = new Blob(videoChunk, { type: OPTIONS.mimeType });

    let url = URL.createObjectURL(blob);

    const out = (
      <li key={url}>
        <video height={200} controls src={url} />
        <br />
        <a
          href={url}
          download={`video${OPTIONS.ext}`}
        >{`download ${`video${OPTIONS.ext}`}`}</a>
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
      let recorder;
      try {
        recorder = new MediaRecorder(stream, {
          mimeType: OPTIONS.mimeType,
        });
      } catch {
        recorder = new MediaRecorder(stream);
      }
      recorder.ondataavailable = (e) => {
        // when the recording is complete and there is data
        setVideoChunk([e.data]);
        if (onComplete) onComplete(e.data, OPTIONS.ext);
      };
      recorder.onstart = (e) => {
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
        overflowX: "scroll",
      }}
    >
      {videoOut}
    </ul>
  );
};

export default VideoRecorder;
