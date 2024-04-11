import { useAtom } from "jotai";
import { imageFileAtom } from "../../atoms";
import { ChangeEvent } from "react";
import clsx from "clsx";

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

    const filenameWithoutExtension = file.name
      .split(".")
      .slice(0, -1)
      .join(".");

    setImageFile({
      name: filenameWithoutExtension,
      source: file,
    });
  };

  return (
    <input
      className={clsx(
        "file-input file-input-bordered file-input-primary w-full max-w-xs",
        imageFile && "hidden"
      )}
      data-testid="image-input"
      type="file"
      accept="image/*"
      onChange={handleChange}
    />
  );
};
