import { Trash2, Check, Palette, Brush, Eraser } from "lucide-react";
import { RefObject, useEffect, useState } from "react";
import { Swatch } from "../utils/Swatch";
import axios from "axios";
import { useToast } from "@/hooks/useToast";
import { motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [selectedId, setSelectedId] = useState(-1);
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    console.log(selectedId);
  }, [selectedId]);

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 m-6 mx-auto flex h-16 w-2/3 items-center justify-center gap-3 rounded-full bg-zinc-900 md:gap-6"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex aspect-square h-8 cursor-pointer items-center justify-center rounded-lg bg-red-500/90 md:h-10"
        onClick={clearCanvas}
        whileHover={{ scale: SCALE }}
      >
        <Trash2 />
      </motion.div>

      <div className="hidden gap-4 md:flex">
        {Object.values(Swatch).map((swatch) => (
          <motion.div
            className={`${
              currentSwatch === swatch ? "border-2" : ""
            } h-4 w-4 cursor-pointer rounded-lg`}
            style={{ backgroundColor: swatch }}
            key={swatch}
            onClick={() => setCurrentSwatch(swatch)}
            whileHover={{ scale: SCALE }}
          ></motion.div>
        ))}
      </div>

      <motion.div
        className="flex aspect-square h-8 cursor-pointer items-center justify-center rounded-lg md:hidden md:h-10"
        onClick={() => {
          setSelectedId(0);
        }}
        whileHover={{ scale: SCALE }}
      >
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <div onClick={() => setSelectedId(0)}>
              <Palette />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-[2rem]">
            <DropdownMenuLabel>Colors</DropdownMenuLabel>
            <DropdownMenuGroup>
              {Object.values(Swatch).map((swatch) => (
                <DropdownMenuItem key={swatch}>
                  <button
                    className={`${
                      currentSwatch === swatch ? "border-2" : ""
                    } h-5 w-10 cursor-pointer rounded-lg`}
                    style={{ backgroundColor: swatch }}
                    key={swatch}
                    onClick={() => setCurrentSwatch(swatch)}
                  ></button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      <motion.div
        className="flex aspect-square h-10 w-10 cursor-pointer items-center justify-center rounded-lg md:hidden"
        onClick={() => {
          setSelectedId(1);
        }}
        whileHover={{ scale: SCALE }}
      >
        <Brush />
      </motion.div>
      <input
        type="range"
        min={1}
        max={40}
        value={currentSize}
        onChange={(event) => setCurrentSize(Number(event.target.value))}
        className="color-zinc-200 hidden accent-white md:block"
      />

      <motion.div
        className="flex aspect-square h-10 w-10 cursor-pointer items-center justify-center rounded-lg"
        onClick={() => {
          setSelectedId(2);
        }}
        whileHover={{ scale: SCALE }}
      >
        <Eraser />
      </motion.div>

      <motion.div
        className="flex aspect-square h-8 cursor-pointer items-center justify-center rounded-lg bg-green-500/90 md:h-10"
        onClick={handleSubmint}
        whileHover={{ scale: SCALE }}
      >
        <Check />
      </motion.div>
    </motion.div>
  );
}
