import { useAtom } from "jotai";
import { imageFileAtom } from "../atoms";
import { ChangeEvent } from "react";

export const ImageInput = () => {
  const [imageFile, setImageFile] = useAtom(imageFileAtom);

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const file = target.files?.[0];

    if (!file) return;

    const isImageType = file.type.startsWith("image/");
    if (!isImageType) {
      target.value = "";
      target.files = null;
      return;
    }

    setImageFile(file);
  };

  if (imageFile) return null;

  return (
    <input
      className="file-input file-input-bordered file-input-primary w-full max-w-xs"
      data-testid="image-input"
      type="file"
      accept="image/*"
      onChange={handleChange}
    />
  );
};
