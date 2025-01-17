import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { InfoIcon } from "lucide-react";
import { motion } from "framer-motion";
import GradientText from "./ui/gradientText";

export default function Info() {
  return (
    <>
      <motion.div
        className="z-100 absolute right-0 top-0 m-4 md:m-8"
        whileHover={{ scale: 1.3 }}
      >
        <Dialog>
          <DialogTrigger asChild>
            <InfoIcon size={25} />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>About This App</DialogHeader>
            <DialogDescription>
              This app is designed to help users solve mathematical problems and
              equations with ease. Whether you’re working on simple
              calculations, solving algebraic equations, or analyzing graphical
              problems, the app provides clear and structured solutions in a
              readable format.
            </DialogDescription>
            <DialogFooter>
              <a href="https://soucathomas.tech">
                <motion.h1 whileHover={{ scale: 1.1 }} className="flex gap-1">
                  Made by
                  <span>
                    <GradientText>Thomas</GradientText>
                  </span>
                </motion.h1>
              </a>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </>
  );
}
