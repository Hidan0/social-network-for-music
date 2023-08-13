import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const instance = axios.create({
  baseURL: API_URL,
});

export const convertMsToTime = (ms: number): string => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  let timeString = "";

  if (hours > 0) {
    timeString += (hours < 10 ? "0" + hours : hours) + ":";
  }

  timeString += (minutes < 10 ? "0" + minutes : minutes) + ":";
  timeString += seconds < 10 ? "0" + seconds : seconds;

  return timeString;
};
