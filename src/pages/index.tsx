import { useAtomValue } from "jotai";
import { ImageInput } from "../components/image-input";
import { imageFileAtom } from "../atoms";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Home = () => {
  const navigate = useNavigate();

  const imageFile = useAtomValue(imageFileAtom);

  useEffect(() => {
    if (imageFile) navigate("/edit");
  });

  return (
    <main className="w-dvw h-dvh flex justify-center items-center">
      <ImageInput />
    </main>
  );
};
