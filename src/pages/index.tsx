import { ImageInput } from "../components/image-input";

export const Home = () => {
  return (
    <main className="w-dvw h-dvh flex flex-col items-center justify-evenly">
      <div className="flex flex-col gap-16 text-center">
        <h1 className="text-4xl font-bold">Image Editor</h1>
        <img
          src="color-palette.svg"
          alt="An person playing with color palette"
        />
      </div>
      <ImageInput />
    </main>
  );
};
