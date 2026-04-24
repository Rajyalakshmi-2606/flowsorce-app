import { logData } from "../common";

// This method is used to resolve the error in Checkmarx vulnerability fix
const getResCode = (status: number): string => {
  switch (status) {
    case 400:
      return "400 - Bad request";
    case 401:
      return "401 - Unauthorized";
    case 403:
      return "403 - Forbidden";
    case 404:
      return "404 - Not found";
    case 500:
      return "500 - Internal server error";
    case 503:
      return "503 - Service Unavailable";
    default:
      return "Unable to identifiy";
  }
};

export const fetchIntercept = async (
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) => {
  try {
    const result = await fetch(input, init);
    if (result.ok) {
      const data = await result.json();
      return data;
    }
    if (!result.ok) {
      let errorLog = `API: ${input}\n\tHTTP Response Code: ${getResCode(
        result.status
      )}`;
      logData("error", errorLog);
      return null;
    }
    throw new Error(`Failed to fetch data for API: ${input}`);
  } catch (error: any) {
    if (error instanceof SyntaxError) {
      // Unexpected token < in JSON
      logData(
        "error",
        `Failed to fetch data for API: ${input}\nThere was a SyntaxError\n"${error.stack}`
      );
    } else {
      logData(
        "error",
        `Failed to fetch data for API: ${input}\n${error.stack}`
      );
    }
    return null;
  }
};
