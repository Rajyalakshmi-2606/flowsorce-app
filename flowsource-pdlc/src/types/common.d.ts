import { IconType } from "react-icons";
import { allowedTooltips } from "@/constants/tooltip";
import { LOG_LEVELS } from "@/constants/common";

export type LogLevelTypes = keyof typeof LOG_LEVELS;

export type TooltipTypes = typeof allowedTooltips;
