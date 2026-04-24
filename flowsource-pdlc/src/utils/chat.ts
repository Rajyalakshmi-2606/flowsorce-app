import { FileImage } from "../types/chat";

export function formatDate(noTime = false, date?: string) {
  let d = date ? new Date(date) : new Date(),
    month = "" + (d.getUTCMonth() + 1),
    day = "" + d.getUTCDate(),
    year = d.getUTCFullYear(),
    hours = d.getUTCHours().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }),
    minutes = d.getUTCMinutes().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }),
    seconds = d.getUTCSeconds().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  const formattedDate = [year, month, day].join("-");
  if (noTime) return formattedDate;

  const formattedTime = [hours, minutes, seconds].join(":");
  return formattedDate + " " + formattedTime;
}

export const convertUrlsToFiles = async (
  fileImages: FileImage[]
): Promise<File[]> => {
  const filePromises = fileImages.map(
    async (fileImage: FileImage): Promise<File | undefined> => {
      try {
        const url = `${fileImage.fileUrl}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}`);
        }
        const blob = await response.blob();
        const file = new File([blob], `${fileImage.fileName}`, {
          type: blob.type,
        });
        return file;
      } catch (error) {
        console.error("Error converting URL to File:", error);
        return;
      }
    }
  );

  // Use Promise.all and filter out any undefined values
  const files = await Promise.all(filePromises);
  return files.filter((file): file is File => file !== undefined); // Type guard to filter out undefined
};
