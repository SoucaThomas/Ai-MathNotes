"use client";

import { useEffect, useRef, RefObject } from "react";
import Draggable from "react-draggable";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import ShinyLatex from "@/components/ShinyLatex";

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
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ShinyLatex latex={latex} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </Draggable>
  );
}
