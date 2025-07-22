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
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
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

      console.log(`Audio ${newMutedState ? "sessiz edildi" : "sesli..."}`);
    }
  };

  const endCall = () => {
    if (mediaState.stream) {
      mediaState.stream.getTracks().forEach((track) => {
        track.stop();
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
      className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg border"
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

      <div className="flex justify-center gap-3 flex-wrap">
        <button
          onClick={startCall}
          disabled={callState.isActive || callState.status === "connecting"}
          className="px-4 py-1 rounded-lg font-medium transition-colors duration-200 
                   bg-green-500 hover:bg-green-600 text-white
                   disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {callState.status === "connecting" ? "Bağlanır..." : "Zəngi Başlat"}
        </button>
        <button
          onClick={toggleMute}
          disabled={!callState.isActive}
          className="px-4 py-2 rounded-lg font-medium transition-colors duration-200
                   bg-yellow-500 hover:bg-yellow-600 text-white
                   disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {callState.isMuted ? "Səsliyə Al" : "Səssizə Al"}
        </button>
        <button
          onClick={endCall}
          disabled={!callState.isActive}
          className="px-4 py-2 rounded-lg font-medium transition-colors duration-200
                   bg-red-500 hover:bg-red-600 text-white
                   disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Zəngi sonlandır
        </button>
      </div>
    </div>
  );
};

export default Softphone;
