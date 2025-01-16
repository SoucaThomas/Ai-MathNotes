import { useRef, useState } from "react";
import CanvasElement from "@/components/CanvasElement";
import Toolbar from "@/components/Toolbar";
import { Swatch } from "./(utils)/Swatch";
import { Toaster } from "@/components/ui/toaster";
import { Spinner } from "@/components/ui/spinner";
import Latex from "@/components/Latex";

export default function Home() {
    // const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentSwatch, setCurrentSwatch] = useState<Swatch>(Swatch.White);
    const [currentSize, setCurrentSize] = useState<number>(5);
    const [loading, setLoading] = useState<boolean>(false);
    const [latex, setLatex] = useState<string>("");

    return (
        <>
            <Toaster />
            <CanvasElement
                canvasRef={canvasRef}
                currentSwatch={currentSwatch}
                currentSize={currentSize}
            />
            <Latex canvasRef={canvasRef} latex={latex} />
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-20 z-[100]">
                    <div className="absolute inset-0 flex justify-center items-center">
                        <Spinner size={"large"} />
                    </div>
                </div>
            )}
            <Toolbar
                canvasRef={canvasRef}
                currentSwatch={currentSwatch}
                setCurrentSwatch={setCurrentSwatch}
                currentSize={currentSize}
                setCurrentSize={setCurrentSize}
                setLoading={setLoading}
                setLatex={setLatex}
            />
        </>
    );
}
