import { useAtomValue } from "jotai";
import { imageFileAtom } from "../../atoms";

export const Canvas = () => {
  const imageFile = useAtomValue(imageFileAtom);

  if (!imageFile) return null;

  return <canvas data-testid="canvas"></canvas>;
};
