import { Trash2, Check, Palette, Brush, Eraser } from "lucide-react";
import { RefObject, useState } from "react";
import { Swatch } from "../utils/Swatch";
import axios from "axios";
import { useToast } from "@/hooks/useToast";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { darkenColor } from "@/utils/colorUtils";
import { BrushType } from "@/utils/BrushTypes";

const SCALE = 1.2;

export default function Toolbar(props: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  currentSwatch: Swatch;
  setCurrentSwatch: (swatch: Swatch) => void;
  currentSize: number;
  setCurrentSize: (size: number) => void;
  setLoading: (loading: boolean) => void;
  setLatex: (latex: string) => void;
  brush: BrushType;
  setBrush: (brush: BrushType) => void;
}) {
  const {
    canvasRef,
    currentSwatch,
    setCurrentSwatch,
    currentSize,
    setCurrentSize,
    setLoading,
    setLatex,
    brush,
    setBrush,
  } = props;

  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState(0);
  const [open, setOpen] = useState(false);
  const [openBrushPC, setOpenBrushPC] = useState(false);

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
        variant: "default",
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
        variant: "default",
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

  const toggleBrush = () => {
    if (brush === BrushType.Pencil) {
      setBrush(BrushType.Eraser);
    } else {
      setBrush(BrushType.Pencil);
    }
  };

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 m-6 mx-auto flex h-16 w-80 max-w-2xl items-center justify-center gap-3 rounded-full bg-zinc-900 md:w-5/6 md:gap-6"
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
            } aspect-square h-6 cursor-pointer rounded-lg`}
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
            <div>
              <Palette color={currentSwatch} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-[240px]">
            <DropdownMenuLabel>Choose a color</DropdownMenuLabel>
            <DropdownMenuGroup>
              <div className="overflox-hidden grid grid-cols-4 gap-2">
                {Object.values(Swatch).map((swatch) => (
                  <DropdownMenuItem key={swatch}>
                    <button
                      className={`${
                        currentSwatch === swatch ? "border-2" : ""
                      } aspect-square h-10 cursor-pointer rounded-lg`}
                      style={{ backgroundColor: swatch }}
                      key={swatch}
                      onClick={() => setCurrentSwatch(swatch)}
                    ></button>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                <h1>
                  Choose the brush Size <span>{currentSize}px</span>
                </h1>
              </DropdownMenuLabel>

              <DropdownMenuItem>
                <input
                  type="range"
                  min={1}
                  max={40}
                  value={currentSize}
                  onChange={(event) =>
                    setCurrentSize(Number(event.target.value))
                  }
                  className="color-zinc-200 w-full accent-white"
                />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      <motion.div
        className="hidden aspect-square h-8 cursor-pointer items-center justify-center rounded-lg md:flex md:h-10"
        onClick={() => {
          setSelectedId(0);
        }}
        whileHover={{ scale: SCALE }}
      >
        {brush === BrushType.Pencil ? (
          <DropdownMenu open={openBrushPC} onOpenChange={setOpenBrushPC}>
            <DropdownMenuTrigger asChild>
              <div onClick={() => setBrush(BrushType.Pencil)}>
                <Brush
                  color={
                    brush === BrushType.Pencil
                      ? darkenColor(currentSwatch, 0.4)
                      : currentSwatch
                  }
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[240px]">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <h1>
                    Choose the brush Size <span>{currentSize}px</span>
                  </h1>
                </DropdownMenuLabel>

                <DropdownMenuItem>
                  <input
                    type="range"
                    min={1}
                    max={40}
                    value={currentSize}
                    onChange={(event) =>
                      setCurrentSize(Number(event.target.value))
                    }
                    className="color-zinc-200 w-full accent-white"
                  />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Brush color={"white"} onClick={toggleBrush} />
        )}
      </motion.div>

      <motion.div
        className={`#{selectedId === 0 ? 'border-2' : ''} flex aspect-square h-10 w-10 cursor-pointer items-center justify-center rounded-lg md:hidden`}
        onClick={() => {
          setSelectedId(0);
        }}
        whileHover={{ scale: SCALE }}
      >
        <Brush
          color={
            brush === BrushType.Pencil
              ? darkenColor(currentSwatch, 0.4)
              : currentSwatch
          }
        />
      </motion.div>
      <motion.div
        className="flex aspect-square h-10 w-10 cursor-pointer items-center justify-center rounded-lg"
        onClick={() => {
          setSelectedId(1);

          toggleBrush();
        }}
        whileHover={{ scale: SCALE }}
      >
        <Eraser color={brush === BrushType.Eraser ? "#8a8a8a" : "white"} />
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
