import React from "react";
import { PropsWithChildren } from "react";
import { TOOLTIPS } from "../constants/tooltip";
import { TooltipTypes } from "../types/common";

type PropModel =
  | { toolTipKey: TooltipTypes; type?: "key" }
  | { message: string; type: "message" };
interface Props {
  className?: string;
}

const ToolTipContainer: React.FC<PropsWithChildren<Props & PropModel>> = (
  props
) => {
  let tooltipStr: string = "";
  switch (props.type) {
    case "message":
      tooltipStr = props.message;
      break;
    default:
      const currentTooltip = TOOLTIPS[props.toolTipKey as keyof typeof TOOLTIPS];
      tooltipStr = currentTooltip;
      break;
  }

  return (
    <span
      className={`d-inline-block ${props.className || ""}`}
      tabIndex={0}
      data-bs-toggle="tooltip"
      title={tooltipStr}
    >
      {props.children}
    </span>
  );
};

export default ToolTipContainer;
