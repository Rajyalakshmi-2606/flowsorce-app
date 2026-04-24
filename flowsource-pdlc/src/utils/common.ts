
import { LogLevelTypes } from "../types/common";
import {
  DEFAULT_LOG_LEVEL,
  LOG_LEVELS,
  SESSION_LOG_LEVEL_KEY,
} from "../constants/common";

export const logData = (level: LogLevelTypes, msg: string | object) => {
  try {
    let sessionLogLevel = process.env.LOG_LEVEL;
    if (!sessionLogLevel) {
      const sessionData = sessionStorage.getItem(SESSION_LOG_LEVEL_KEY);
      if (!sessionData) {
        console.warn("No log level data is added in env file.");
      }
      sessionLogLevel = sessionData || DEFAULT_LOG_LEVEL;
    }

    if (!(sessionLogLevel in LOG_LEVELS)) {
      console.warn("Incorrect log level is assigned");
      return;
    }

    const sessionLogLevelKey = sessionLogLevel as keyof typeof LOG_LEVELS;
    const levelKey = level as keyof typeof LOG_LEVELS;
    if (LOG_LEVELS[sessionLogLevelKey] < LOG_LEVELS[levelKey]) {
      return;
    }

    // Ensure msg is a string, if it's an object, stringify it
    let logMessage = msg;
    if (typeof msg === "object" && msg !== null) {
      logMessage = JSON.stringify(msg, null, 2); // Optional indentation for readability
    }

    let url = "/api/logger";
    if (typeof window === "undefined") {
      url = process.env.NEXTAUTH_URL + url;
    }

    // Send the final log message (stringified if it's an object)
    fetch(url, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ level, msg: logMessage }),
    });
  } catch (error) {
    console.warn(`Unable to log data \n\tLEVEL: ${String(level)}`);
  }
};

export const getRemainingTimeInSeconds = (data: number) => {
  const nowTimeStamp = Math.floor(Date.now() / 1000);
  return data - nowTimeStamp;
};

export const getSearchParamsStr = (searchParams?: {
  [key: string]: string;
}) => {
  if (!searchParams) return "";
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) =>
    params.set(key, value)
  );
  return "/?" + params.toString();
};
