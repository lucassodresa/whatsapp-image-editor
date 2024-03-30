interface Props {
  setFileReader: (source: FileReader) => void;
}

export const InputFile = ({ setFileReader }: Props) => {
  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    if (!target?.files?.length) return;

    reader.readAsDataURL(target.files[0]);
    setFileReader(reader);
  };

  return <input type="file" onChange={handleChange} />;
};
