import { Trash2 } from "lucide-react";
import { Check } from "lucide-react";
import { RefObject } from "react";
import { Swatch } from "../utils/Swatch";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const SCALE = 1.2;

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

  const { toast } = useToast();

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

    if (response.error) {
      // toast.error(response.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: response.message,
      });
      setLoading(false);
      return;
    }

    if (response[0].assign == true || response[0].result) {
      setLatex(response[0].result.toString());
    } else
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "Unable to solve the given input. Please check the format or content of the problem.",
      });
    setLoading(false);
  };

  const clearCanvas = () => {
    canvasRef.current
      ?.getContext("2d")
      ?.clearRect(0, 0, window.innerWidth, window.innerHeight);

    setLatex("");
  };

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 m-6 mx-auto flex h-16 max-w-2xl items-center justify-center gap-6 rounded-full bg-zinc-900"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-red-500/90"
        onClick={clearCanvas}
        whileHover={{ scale: SCALE }}
      >
        <Trash2 />
      </motion.div>
      <div className="flex gap-4">
        {Object.values(Swatch).map((swatch) => (
          <motion.div
            className={`${
              currentSwatch === swatch ? "border-2" : ""
            } h-6 w-6 rounded-lg`}
            style={{ backgroundColor: swatch }}
            key={swatch}
            onClick={() => setCurrentSwatch(swatch)}
            whileHover={{ scale: SCALE }}
          ></motion.div>
        ))}
      </div>

      <input
        type="range"
        min={1}
        max={40}
        value={currentSize}
        onChange={(event) => setCurrentSize(Number(event.target.value))}
        className="color-zinc-200 accent-white"
      />

      <motion.div
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-green-500/90"
        onClick={handleSubmint}
        whileHover={{ scale: SCALE }}
      >
        <Check />
      </motion.div>
    </motion.div>
  );
}
