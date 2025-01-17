import { useEffect, RefObject } from "react";
import { Swatch } from "../utils/Swatch";
import { BrushType } from "@/utils/BrushTypes";

export default function CanvasElement(props: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  currentSwatch: Swatch;
  currentSize: number;
  brush: BrushType;
}) {
  const { canvasRef, currentSwatch, currentSize, brush } = props;
  const ongoingTouches: { identifier: number; pageX: number; pageY: number }[] =
    [];
  const eraserWidth = 30;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let painting = false;

    const startPainting = () => {
      painting = true;
    };

    const stopPainting = () => {
      painting = false;
      ctx.beginPath();
    };

    const onMouseMove = (event: MouseEvent) => {
      const x = event.offsetX;
      const y = event.offsetY;

      if (!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        if (brush === BrushType.Pencil) {
          ctx.globalCompositeOperation = "source-over";
          ctx.strokeStyle = currentSwatch;
          ctx.lineWidth = currentSize;
        } else {
          ctx.globalCompositeOperation = "destination-out";
          ctx.lineWidth = eraserWidth;
        }
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    };

    const onMouseDown = () => {
      startPainting();
    };

    const onMouseUp = () => {
      stopPainting();
    };

    const onMouseLeave = () => {
      stopPainting();
    };

    const handleStart = (evt: TouchEvent) => {
      evt.preventDefault();
      const touches = evt.changedTouches;

      for (let i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));
        ctx.beginPath();
        if (brush === BrushType.Pencil) {
          ctx.globalCompositeOperation = "source-over";
          ctx.strokeStyle = currentSwatch;
          ctx.lineWidth = currentSize;
        } else {
          ctx.globalCompositeOperation = "destination-out";
          ctx.lineWidth = eraserWidth;
        }
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.fill();
      }
    };

    const handleMove = (evt: TouchEvent) => {
      evt.preventDefault();
      const touches = evt.changedTouches;

      for (let i = 0; i < touches.length; i++) {
        const idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
          ctx.beginPath();
          ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
          ctx.lineTo(touches[i].pageX, touches[i].pageY);
          if (brush === BrushType.Pencil) {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = currentSwatch;
            ctx.lineWidth = currentSize;
          } else {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = eraserWidth;
          }
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();

          ongoingTouches.splice(idx, 1, copyTouch(touches[i]));
        }
      }
    };

    const handleEnd = (evt: TouchEvent) => {
      evt.preventDefault();
      const touches = evt.changedTouches;

      for (let i = 0; i < touches.length; i++) {
        const idx = ongoingTouchIndexById(touches[i].identifier);

        if (idx >= 0) {
          if (brush === BrushType.Pencil) {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = currentSwatch;
            ctx.lineWidth = currentSize;
          } else {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = eraserWidth;
          }
          ctx.beginPath();
          ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
          ctx.lineTo(touches[i].pageX, touches[i].pageY);
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ongoingTouches.splice(idx, 1);
        }
      }
    };

    const handleCancel = (evt: TouchEvent) => {
      evt.preventDefault();
      const touches = evt.changedTouches;

      for (let i = 0; i < touches.length; i++) {
        const idx = ongoingTouchIndexById(touches[i].identifier);
        ongoingTouches.splice(idx, 1);
      }
    };

    const copyTouch = ({ identifier, pageX, pageY }: Touch) => {
      return { identifier, pageX, pageY };
    };

    const ongoingTouchIndexById = (idToFind: number) => {
      for (let i = 0; i < ongoingTouches.length; i++) {
        const id = ongoingTouches[i].identifier;
        if (id === idToFind) {
          return i;
        }
      }
      return -1;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", handleStart);
    canvas.addEventListener("touchend", handleEnd);
    canvas.addEventListener("touchcancel", handleCancel);
    canvas.addEventListener("touchmove", handleMove);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", handleStart);
      canvas.removeEventListener("touchend", handleEnd);
      canvas.removeEventListener("touchcancel", handleCancel);
      canvas.removeEventListener("touchmove", handleMove);
    };
  }, [canvasRef, currentSwatch, currentSize, ongoingTouches]);

  return (
    <canvas
      ref={canvasRef}
      style={{ cursor: "crosshair" }}
      className="bg-[--var-background]"
    />
  );
}
