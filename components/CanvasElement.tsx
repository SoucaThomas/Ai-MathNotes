import { useEffect, RefObject } from "react";
import { Swatch } from "../pages/(utils)/Swatch";

export default function CanvasElement(props: {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    currentSwatch: Swatch;
    currentSize: number;
}) {
    const { canvasRef, currentSwatch, currentSize } = props;

    // Setup canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        document.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        return () => {
            document.removeEventListener("resize", () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        };
    }, [canvasRef]);

    // handle drawing
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
                ctx.lineTo(x, y);
                ctx.strokeStyle = currentSwatch;
                ctx.lineWidth = currentSize;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
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

        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mouseleave", onMouseLeave);
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mouseup", onMouseUp);

        return () => {
            canvas.removeEventListener("mousemove", onMouseMove);
            canvas.removeEventListener("mouseleave", onMouseLeave);
            canvas.removeEventListener("mousedown", onMouseDown);
            canvas.removeEventListener("mouseup", onMouseUp);
        };
    }, [canvasRef, currentSwatch, currentSize]);

    return (
        <>
            <canvas ref={canvasRef} style={{ cursor: "crosshair" }} />
        </>
    );
}
