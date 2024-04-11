import { useEffect, useRef } from "react";
import { Canvas } from "../components/canvas";
import { useAtom } from "jotai";
import { imageFileAtom } from "../atoms";
import { VALID_IMAGE_TYPES, useCanvas } from "../hooks/use-canvas";
import { useNavigate } from "react-router-dom";

export const Edit = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useAtom(imageFileAtom);

  const { drawImage, generateDownloadCanvasByImageType } = useCanvas({
    canvasRef,
  });

  useEffect(() => {
    if (!imageFile) return navigate("/");

    drawImage(imageFile);
  }, [imageFile, navigate, drawImage]);

  const handleClear = () => setImageFile(null);

  return (
    <main className="w-dvw h-dvh flex flex-col  items-center">
      <aside className="flex justify-between p-4 w-full mx-auto">
        <button className="btn btn-square btn-error" onClick={handleClear}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
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
            <button
              className="btn btn-square btn-outline btn-primary"
              onClick={() => {}}
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          </li>
        </ul>
      </aside>
      <Canvas ref={canvasRef} />

      <footer className="flex justify-center p-4">
        <div className="join">
          <label className="input input-bordered flex items-center gap-2 join-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h6.879a1.5 1.5 0 0 1 1.06.44l4.122 4.12A1.5 1.5 0 0 1 17 7.622V16.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5v-13Z" />
            </svg>

            <input
              type="text"
              className="grow"
              placeholder="Filename"
              value={imageFile?.name || ""}
            />
          </label>
          <div className="dropdown dropdown-top dropdown-end ">
            <button
              tabIndex={0}
              role="button"
              className="btn btn-primary join-item"
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
              Download{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-24"
            >
              {VALID_IMAGE_TYPES.map((imageType) => (
                <li key={imageType}>
                  <button
                    onClick={generateDownloadCanvasByImageType(imageType)}
                  >
                    .{imageType}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
};
