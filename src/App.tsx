import { useEffect, useRef } from "react";
import { ImageInput } from "./components/image-input/image-input";
import { Canvas } from "./components/canvas";
import { useCanvas } from "./hooks/use-canvas";
import { useAtomValue } from "jotai";
import { imageFileAtom } from "./atoms";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { drawImage } = useCanvas({ canvasRef });

  const imageFile = useAtomValue(imageFileAtom);

  useEffect(() => {
    drawImage(imageFile);
  }, [imageFile, drawImage]);

  return (
    <main className="w-dvw h-dvh flex justify-center items-center">
      <ImageInput />
      <Canvas ref={canvasRef} />
    </main>
  );
}

export default App;
