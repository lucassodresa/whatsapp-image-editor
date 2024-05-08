const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export const drawImage = async ({
  imageFile,
  canvas,
}: {
  imageFile: File;
  canvas: HTMLCanvasElement;
}) => {
  if (!imageFile) {
    console.error("Image file does not exists");
    return;
  }

  if (!canvas) {
    console.error("Canvas does not exists");
    return;
  }

  const context = canvas?.getContext?.("2d");
  if (!context) {
    console.error("Canvas context does not exists");
    return;
  }

  const image = new Image();
  image.src = await toBase64(imageFile);
  canvas.width = image.width;
  canvas.height = image.height;
  context.drawImage(image, 0, 0, image.width, image.height);
};
