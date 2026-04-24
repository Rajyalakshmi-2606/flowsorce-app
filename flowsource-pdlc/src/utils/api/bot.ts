import { BotDesignLayout } from "../../types/bots";
import { fetchIntercept } from "./common";

export async function getDesignModel(): Promise<BotDesignLayout> {
  const pathArray = ["", "json", "design-model.json"];
  if (typeof window === "undefined")
    pathArray[0] = process.env.NEXTAUTH_URL || "";
  const url = pathArray.join("/");
  const data = await fetchIntercept(url);

  return data;
}
