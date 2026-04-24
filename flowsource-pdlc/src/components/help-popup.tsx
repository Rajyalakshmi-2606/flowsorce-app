"use client";
import React, { useState, useEffect, useRef } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { IoIosHelpCircleOutline } from "react-icons/io";

type HelpPopoverProps = {
  content: string;
  className: string;
  placementValue?: "left" | "right" | undefined;
};

const HelpPopover: React.FC<HelpPopoverProps> = ({
  content,
  className,
  placementValue,
}) => {
  const [placement, setPlacement] = useState<"left" | "right">("left");
  const triggerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const calculatePlacement = () => {
      if (!triggerRef.current) return;
      if (placementValue) {
        setPlacement(placementValue);
        return;
      }
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceLeft = rect.left;
      const spaceRight = window.innerWidth - rect.right;
      const tempValue = spaceRight < spaceLeft ? "left" : "right";
      setPlacement(tempValue);
    };
    calculatePlacement();
  }, [triggerRef, placementValue]);

  const popover = (
    <Popover id="popover-basic" className="help-popover">
      <Popover.Header as="h3">Help</Popover.Header>
      <Popover.Body className="text-justify">{content}</Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      rootClose
      trigger="click"
      placement={placement}
      overlay={popover}
    >
      <span style={{cursor: "pointer"}} className={className} ref={triggerRef}>
        <IoIosHelpCircleOutline />
      </span>
    </OverlayTrigger>
  );
};

export default HelpPopover;
