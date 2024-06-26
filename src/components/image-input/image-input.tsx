import { useSetAtom } from "jotai";
import { imageFileNameAtom, imageFileSourceAtom } from "../../atoms";
import { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

export const ImageInput = () => {
  const setImageFileSource = useSetAtom(imageFileSourceAtom);
  const setImageFileName = useSetAtom(imageFileNameAtom);
  const navigate = useNavigate();

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const resetInputFile = () => (target.files = null);

    const file = target.files?.[0];
    const isFile = file instanceof File;
    if (!isFile) {
      resetInputFile();
      return;
    }

    const isImageType = file.type.startsWith("image/");
    if (!isImageType) {
      resetInputFile();
      return;
    }

    const filenameWithoutExtension = file.name
      .split(".")
      .slice(0, -1)
      .join(".");

    setImageFileName(filenameWithoutExtension);
    setImageFileSource(file);
    navigate("/edit");
  };

  return (
    <input
      role="button"
      className="file-input file-input-bordered file-input-primary w-full max-w-xs"
      type="file"
      accept="image/*"
      onChange={handleChange}
    />
  );
};
