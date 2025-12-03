import React from "react";
import { useCursor } from "../../contexts/CursorContext";
import "../../styles/cursor.css";

const getCursorIcon = (type: string) => {
  switch (type) {
    case "pointer":
      return "/cursors/pointer.svg";
    case "text":
      return "/cursors/text.svg";
    case "wait":
      return "/cursors/wait.svg";
    case "help":
      return "/cursors/help.svg";
    case "not-allowed":
      return "/cursors/not-allowed.svg";
    case "crosshair":
      return "/cursors/crosshair.svg";
    case "zoom-in":
      return "/cursors/zoom-in.svg";
    case "zoom-out":
      return "/cursors/zoom-out.svg";
    case "grab":
      return "/cursors/openhand.svg";
    case "grabbing":
      return "/cursors/dnd-move.svg";
    case "col-resize":
      return "/cursors/col-resize.svg";
    case "row-resize":
      return "/cursors/row-resize.svg";
    case "n-resize":
      return "/cursors/top_side.svg";
    case "e-resize":
      return "/cursors/right_side.svg";
    case "s-resize":
      return "/cursors/bottom_side.svg";
    case "w-resize":
      return "/cursors/left_side.svg";
    case "ne-resize":
      return "/cursors/top_right_corner.svg";
    case "nw-resize":
      return "/cursors/top_left_corner.svg";
    case "se-resize":
      return "/cursors/bottom_right_corner.svg";
    case "sw-resize":
      return "/cursors/bottom_left_corner.svg";
    case "ew-resize":
      return "/cursors/size_hor.svg";
    case "ns-resize":
      return "/cursors/size_ver.svg";
    case "nesw-resize":
      return "/cursors/size_bdiag.svg";
    case "nwse-resize":
      return "/cursors/size_fdiag.svg";
    case "alias":
      return "/cursors/alias.svg";
    case "all-scroll":
      return "/cursors/all-scroll.svg";
    case "cell":
      return "/cursors/cell.svg";
    case "context-menu":
      return "/cursors/context-menu.svg";
    case "copy":
      return "/cursors/copy.svg";
    case "no-drop":
      return "/cursors/no-drop.svg";
    case "progress":
      return "/cursors/progress.svg";
    case "vertical-text":
      return "/cursors/vertical-text.svg";
    case "none":
      return null;
    default:
      return "/cursors/default.svg";
  }
};

// Offset mapping for cursors where the hotspot is not top-left (0,0)
// Adjust these values based on the actual SVG hotspots
const getCursorOffset = (type: string) => {
  switch (type) {
    case "text":
      return { x: -12, y: -12 }; // Center for text? or standard I-beam
    case "crosshair":
      return { x: -12, y: -12 }; // Center
    case "wait":
      return { x: 0, y: 0 };
    case "help":
      return { x: 0, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};

export const CustomCursor: React.FC = () => {
  const { position, cursorType, isVisible } = useCursor();

  if (!isVisible || cursorType === "none") return null;

  const iconSrc = getCursorIcon(cursorType);
  if (!iconSrc) return null;

  const offset = getCursorOffset(cursorType);

  return (
    <div
      className="custom-cursor"
      style={{
        transform: `translate3d(${position.x + offset.x}px, ${
          position.y + offset.y
        }px, 0)`,
      }}
    >
      <img src={iconSrc} alt="cursor" />
    </div>
  );
};
