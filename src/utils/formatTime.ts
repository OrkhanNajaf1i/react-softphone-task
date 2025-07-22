export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${remainingSecs
    .toString()
    .padStart(2, "0")}`;
};
