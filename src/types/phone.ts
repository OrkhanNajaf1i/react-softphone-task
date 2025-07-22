export interface CallState {
  isActive: boolean;
  isMuted: boolean;
  duration: number;
  status: "idle" | "connecting" | "active" | "ended";
}

export interface MediaStreamState {
  stream: MediaStream | null;
  audioTrack: MediaStreamTrack | null;
}

export interface SoftphoneProps {
  ref?: React.RefObject<HTMLDivElement>;
}
