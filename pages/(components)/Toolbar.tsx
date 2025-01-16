import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneIcon from "@mui/icons-material/Done";
import { RefObject } from "react";
import { Swatch } from "../(utils)/Swatch";
import { toast } from "react-toastify";
import axios from "axios";

export default function Toolbar(props: {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    currentSwatch: Swatch;
    setCurrentSwatch: (swatch: Swatch) => void;
    currentSize: number;
    setCurrentSize: (size: number) => void;
    setLoading: (loading: boolean) => void;
    setLatex: (latex: string) => void;
}) {
    const {
        canvasRef,
        currentSwatch,
        setCurrentSwatch,
        currentSize,
        setCurrentSize,
        setLoading,
        setLatex,
    } = props;

    const handleSubmint = async () => {
        setLoading(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const imageData = canvas.toDataURL("image/jpeg").split(";base64,")[1];
        const response = await axios
            .post("/api/upload", {
                imageData: imageData,
            })
            .then((res) => res.data);

        console.log(response);
        if (response.error) {
            toast.error(response.message);
            setLoading(false);
            return;
        }

        setLatex(response[0].expr);
        setLoading(false);
    };
    return (
        <div className="bg-zinc-900 absolute mx-auto inset-x-0 bottom-0 h-16 m-6 max-w-4xl flex justify-center items-center rounded-full gap-6">
            <div
                className="cursor-pointer h-10 w-10 rounded-lg bg-red-500/90 flex justify-center items-center"
                onClick={() =>
                    canvasRef.current
                        ?.getContext("2d")
                        ?.clearRect(0, 0, window.innerWidth, window.innerHeight)
                }
            >
                <DeleteOutlineIcon />
            </div>
            <div className="flex gap-4">
                {Object.values(Swatch).map((swatch) => (
                    <div
                        className={`${
                            currentSwatch === swatch ? "border-2" : ""
                        } h-6 w-6 rounded-lg`}
                        style={{ backgroundColor: swatch }}
                        key={swatch}
                        onClick={() => setCurrentSwatch(swatch)}
                    ></div>
                ))}
            </div>

            <input
                type="range"
                min={1}
                max={60}
                value={currentSize}
                onChange={(event) => setCurrentSize(Number(event.target.value))}
                className="color-zinc-200"
            />

            <div>
                <div
                    className="cursor-pointer h-10 w-10 rounded-lg bg-green-500/90 flex justify-center items-center "
                    onClick={handleSubmint}
                >
                    <DoneIcon />
                </div>
            </div>
        </div>
    );
}
