import { useAtom } from "jotai";
import { imageFileAtom } from "../atoms";
import { ChangeEvent } from "react";

export const ImageInput = () => {
  const [, setImageFile] = useAtom(imageFileAtom);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const isImageType = file.type.startsWith("image/");
    if (!isImageType) return;

    setImageFile(file);
  };

  return (
    <input
      data-testid="image-input"
      type="file"
      accept="image/*"
      onChange={handleChange}
    />
  );
};
