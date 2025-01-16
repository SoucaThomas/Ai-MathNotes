import { useEffect, RefObject } from "react";
import katex from "katex";

export default function Latex(props: {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    latex: string;
}) {
    const { canvasRef, latex } = props;

    // draw latex
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        katex.render(latex, canvas, {
            throwOnError: false,
            displayMode: true,
        });
    }, [latex, canvasRef]);
    return (
        <>
            {latex && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: katex.renderToString(latex, {
                                throwOnError: false,
                                output: "mathml",
                            }),
                        }}
                    />
                </div>
            )}
        </>
    );
}
