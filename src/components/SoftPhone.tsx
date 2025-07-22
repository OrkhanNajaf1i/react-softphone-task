import React, { useState, useEffect, useRef } from "react";
import type { CallState, MediaStreamState } from "../types/phone";
import { formatDuration } from "../utils/formatTime";

const Softphone = ({ ref }: { ref?: React.RefObject<HTMLDivElement> }) => {
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    isMuted: false,
    duration: 0,
    status: "idle",
  });

  const [mediaState, setMediaState] = useState<MediaStreamState>({
    stream: null,
    audioTrack: null,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCall = async () => {
    try {
      setCallState((prev: CallState) => ({ ...prev, status: "connecting" }));
      console.log("Zəng başlanır, mikrofondan icazə istənir...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      console.log("MediaStream əldə edildi:", stream);

      const audioTrack = stream.getAudioTracks()[0];

      setMediaState({
        stream: stream,
        audioTrack: audioTrack,
      });

      if (audioRef.current) {
        audioRef.current.srcObject = stream;
        await audioRef.current.play();
      }

      setCallState((prev: CallState) => ({
        ...prev,
        isActive: true,
        status: "active",
        duration: 0,
        isMuted: false,
      }));

      console.log("Zəng başladı, audio stream aktiv");
    } catch (error) {
      console.error("Mikrofondan icazə alınmadı:", error);
      setCallState((prev: CallState) => ({ ...prev, status: "idle" }));
      alert("Mikrofon icazəsi tələb olunur!");
    }
  };

  const toggleMute = () => {
    if (mediaState.audioTrack) {
      const newMutedState = !callState.isMuted;
      mediaState.audioTrack.enabled = !newMutedState;

      setCallState((prev: CallState) => ({
        ...prev,
        isMuted: newMutedState,
      }));

      console.log(
        `Audio ${newMutedState ? "səssizə alındı" : "səsliyə alındı"}`
      );
    }
  };

  const endCall = () => {
    if (mediaState.stream) {
      mediaState.stream.getTracks().forEach((track) => {
        track.stop();
        console.log("Audio track dayandırıldı");
      });
    }

    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setMediaState({
      stream: null,
      audioTrack: null,
    });

    setCallState({
      isActive: false,
      isMuted: false,
      duration: 0,
      status: "ended",
    });

    setTimeout(() => {
      setCallState((prev: CallState) => ({ ...prev, status: "idle" }));
    }, 2000);
  };

  useEffect(() => {
    if (callState.isActive && callState.status === "active") {
      timerRef.current = setInterval(() => {
        setCallState((prev: CallState) => ({
          ...prev,
          duration: prev.duration + 1,
        }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callState.isActive, callState.status]);

  useEffect(() => {
    return () => {
      if (mediaState.stream) {
        mediaState.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className="max-w-fit mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg border"
    >
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Softphone UI
      </h1>

      <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="mb-2">
          <span className="text-lg font-semibold">Zəngin Statusu: </span>
          <span
            className={`capitalize font-medium ${
              callState.status === "active"
                ? "text-green-600"
                : callState.status === "connecting"
                ? "text-yellow-600"
                : callState.status === "ended"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {callState.status === "active"
              ? "Davam edən"
              : callState.status === "connecting"
              ? "Bağlanır"
              : callState.status === "ended"
              ? "Sonlandı"
              : "Gözləyir"}
          </span>
        </div>

        <div className="mb-4">
          <span className="text-lg font-semibold">Müddət: </span>
          <span className="text-xl font-mono font-bold">
            {formatDuration(callState.duration)}
          </span>
        </div>

        {callState.isMuted && callState.isActive && (
          <div className="text-yellow-600 font-medium animate-pulse">
            Səssizə alınıb
          </div>
        )}
      </div>

      <audio ref={audioRef} className="hidden" muted={true} />

      <div className="flex w-full max-w-fit mx-auto flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
        <button
          onClick={startCall}
          disabled={callState.isActive || callState.status === "connecting"}
          className="h-12 px-6 font-semibold rounded-lg bg-green-500 text-white transition-all duration-200 
               hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
        >
          <span className="inline-block w-full text-center">
            {callState.status === "connecting" ? "Bağlanır..." : "Zəngi Başlat"}
          </span>
        </button>

        <button
          onClick={toggleMute}
          disabled={!callState.isActive}
          className="h-12 px-6 font-semibold rounded-lg bg-yellow-500 text-white transition-all duration-200 
               hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
        >
          <span className="inline-block w-full text-center">
            {callState.isMuted ? "Səsliyə Al" : "Səssizə Al"}
          </span>
        </button>

        <button
          onClick={endCall}
          disabled={!callState.isActive}
          className="h-12 px-6 font-semibold rounded-lg bg-red-500 text-white transition-all duration-200 
               hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
        >
          <span className="inline-block w-full text-center">
            Zəngi Sonlandır
          </span>
        </button>
      </div>

      <div className="mt-6 p-3 bg-gray-100 rounded text-sm text-gray-700">
        <strong>Debug melumatları:</strong>
        <br />
        Stream Active: {mediaState.stream ? "Yes" : "No"}
        <br />
        Audio Track: {mediaState.audioTrack ? "Available" : "None"}
        <br />
        Call Status: {callState.status}
      </div>
    </div>
  );
};

export default Softphone;
