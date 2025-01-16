import { useEffect, useRef, RefObject } from "react";
import katex from "katex";
import Draggable from "react-draggable";

export default function Latex(props: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  latex: string;
}) {
  const { canvasRef, latex } = props;
  const nodeRef = useRef<HTMLDivElement>(null);

  // draw latex
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }, [latex, canvasRef]);
  return (
    <Draggable nodeRef={nodeRef as RefObject<HTMLElement>}>
      <div
        ref={nodeRef}
        className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform cursor-move text-4xl font-bold"
      >
        {latex && (
          <div
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(latex, {
                throwOnError: false,
                output: "mathml",
              }),
            }}
          />
        )}
      </div>
    </Draggable>
  );
}
