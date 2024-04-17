import { useAtom, useSetAtom } from "jotai";
import { imageFileNameAtom, imageFileSourceAtom } from "../../atoms";
import { ChangeEvent } from "react";
import clsx from "clsx";

export const ImageInput = () => {
  const [imageFileSource, setImageFileSource] = useAtom(imageFileSourceAtom);
  const setImageFileName = useSetAtom(imageFileNameAtom);

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

    setImageFileName(filenameWithoutExtension);
    setImageFileSource(file);
  };

  return (
    <input
      className={clsx(
        "file-input file-input-bordered file-input-primary w-full max-w-xs",
        imageFileSource && "hidden"
      )}
      data-testid="image-input"
      type="file"
      accept="image/*"
      onChange={handleChange}
    />
  );
};
