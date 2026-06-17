import { useState, useRef } from "react";

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        resolve(blob);
      };

      recorder.stop();

      recorder.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
    });
  };

  // ⭐ ADD THIS (CANCEL FEATURE)
  const cancelRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder) return;

    chunksRef.current = [];

    recorder.stream.getTracks().forEach((t) => t.stop());
    recorder.stop();

    setIsRecording(false);
  };

  return {
    startRecording,
    stopRecording,
    cancelRecording, // ⭐ IMPORTANT
    isRecording,
  };
};