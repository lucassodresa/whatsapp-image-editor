import { useEffect, useRef } from "react";
import { Canvas } from "../components/canvas";
import { useAtom } from "jotai";
import { imageFileAtom } from "../atoms";
import { useCanvas } from "../hooks/use-canvas";
import { useNavigate } from "react-router-dom";

export const Edit = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useAtom(imageFileAtom);

  const { drawImage, generateDownloadCanvasByImageType, drawLineWithMouse } =
    useCanvas({
      canvasRef,
    });

  useEffect(() => {
    if (!imageFile) navigate("/");
  }, [imageFile, navigate]);

  const handleClear = () => setImageFile(null);

  imageFile && canvasRef.current && drawImage(imageFile);
  canvasRef.current && drawLineWithMouse();

  return (
    <main className="w-dvw h-dvh">
      <aside className="flex justify-between p-4 w-full mx-auto">
        <button className="btn btn-square" onClick={handleClear}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
        <ul>
          <li>
            <button className="btn btn-square" onClick={() => {}}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          </li>
        </ul>

        <a
          className="btn btn-square"
          onClick={generateDownloadCanvasByImageType("png")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </a>
      </aside>
      <Canvas ref={canvasRef} />
    </main>
  );
};
