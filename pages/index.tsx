import { useEffect, useRef, useState } from "react";
import CanvasElement from "./(components)/CanvasElement";
import Toolbar from "./(components)/Toolbar";
import { Swatch } from "./(utils)/Swatch";
import { ToastContainer } from "react-toastify";

export default function Home() {
    // const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentSwatch, setCurrentSwatch] = useState<Swatch>(Swatch.White);
    const [currentSize, setCurrentSize] = useState(5);
    const [loading, setLoading] = useState(false);
    const [latex, setLatex] = useState("");

    useEffect(() => {
        console.log(latex);
    }, [latex]);

    return (
        <>
            <ToastContainer />
            <CanvasElement
                canvasRef={canvasRef}
                currentSwatch={currentSwatch}
                currentSize={currentSize}
                latex={latex}
            />
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center">
                    <div className="p-4 bg-zinc-900 text-white rounded-lg">
                        <h1 className="text-2xl">Processing Image...</h1>
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
