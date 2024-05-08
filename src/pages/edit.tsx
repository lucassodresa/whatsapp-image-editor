import { useCallback, useEffect, useRef } from "react";
import { Canvas } from "../components/canvas";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { imageFileSourceAtom } from "@/atoms";
import { PAGES } from "@/routes";
import { useCanvas } from "@/hooks/use-canvas";
// import { useAtom, useAtomValue } from "jotai";
// import {
//   imageFileNameAtom,
//   isDrawingAtom,
//   lineColorAtom,
//   lineSizeAtom,
// } from "../atoms";
// import { VALID_IMAGE_TYPES, useCanvas } from "../hooks/use-canvas";
// import { imageFileNameAtom } from "../atoms";
// import { useAtom } from "jotai";
// import clsx from "clsx";

// const COLOR_OPTIONS = [
//   { bgColorName: "bg-neutral-700", bgColorHex: "#434343" },
//   { bgColorName: "bg-zinc-400", bgColorHex: "#9da0a9" },
//   { bgColorName: "bg-white", bgColorHex: "#ffffff" },
//   { bgColorName: "bg-sky-400", bgColorHex: "#38bdf8" },
//   { bgColorName: "bg-lime-500", bgColorHex: "#84cc16" },
//   { bgColorName: "bg-purple-400", bgColorHex: "#c084fc" },
//   { bgColorName: "bg-orange-400", bgColorHex: "#f49226" },
//   { bgColorName: "bg-red-500", bgColorHex: "#ff4a4a" },
// ];

// const SIZE_OPTIONS = [
//   {
//     size: 5,
//     className: "w-5 h-5",
//   },
//   {
//     size: 10,
//     className: "w-6 h-6",
//   },
//   {
//     size: 15,
//     className: "w-7 h-7",
//   },
//   {
//     size: 20,
//     className: "w-8 h-8",
//   },
// ];

// const DrawOptions = ({
//   canvasRef,
// }: {
//   canvasRef: RefObject<HTMLCanvasElement>;
// }) => {
//   const [lineColor, setLineColor] = useAtom(lineColorAtom);
//   const [lineSize, setLineSize] = useAtom(lineSizeAtom);
//   const [imageFileName, setImageFileName] = useAtom(imageFileNameAtom);
//   const isDrawing = useAtomValue(isDrawingAtom);

//   const { generateDownloadCanvasByImageType } = useCanvas({
//     canvasRef,
//   });

//   return (
//     <footer className="flex justify-center p-4">
//       {isDrawing ? (
//         <div className="flex items-center gap-10">
//           <div className="flex items-center justify-center bg-slate-200 p-2 rounded">
//             {COLOR_OPTIONS.map(({ bgColorName, bgColorHex }) => {
//               const isActive = lineColor === bgColorHex;

//               return (
//                 <button
//                   key={bgColorName}
//                   className={clsx(
//                     "w-7 h-7 flex items-center justify-center group"
//                   )}
//                   disabled={isActive}
//                   onClick={() => setLineColor(bgColorHex)}
//                 >
//                   <span
//                     className={clsx(
//                       "w-5 h-5 rounded-full",
//                       bgColorName,
//                       isActive ? "w-6 h-6" : "group-hover:w-6 group-hover:h-6"
//                     )}
//                   ></span>
//                 </button>
//               );
//             })}
//           </div>

//           <div className="flex items-center justify-center gap-2">
//             {SIZE_OPTIONS.map(({ size, className }) => {
//               const isActive = size === lineSize;

//               return (
//                 <button
//                   key={size}
//                   className={clsx(
//                     className,
//                     "flex items-center justify-center bg-slate-200 rounded-full",
//                     isActive && "bg-slate-600",
//                     !isActive && "hover:bg-slate-400"
//                   )}
//                   disabled={isActive}
//                   onClick={() => setLineSize(size)}
//                 ></button>
//               );
//             })}
//           </div>
//         </div>
//       ) : (
//         <div className="join">
//           {/* download image button */}
//           <label className="input input-bordered flex items-center gap-2 join-item">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//               className="w-5 h-5"
//             >
//               <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h6.879a1.5 1.5 0 0 1 1.06.44l4.122 4.12A1.5 1.5 0 0 1 17 7.622V16.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5v-13Z" />
//             </svg>

//             <input
//               type="text"
//               className="grow"
//               placeholder="Filename"
//               value={imageFileName}
//               onChange={({ target }) => setImageFileName(target.value)}
//             />
//           </label>
//           <div className="dropdown dropdown-top dropdown-end">
//             <button
//               tabIndex={0}
//               role="button"
//               className="btn btn-primary join-item"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="w-6 h-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
//                 />
//               </svg>
//               Download{" "}
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//                 className="w-5 h-5"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>

//             <ul
//               tabIndex={0}
//               className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-24"
//             >
//               {VALID_IMAGE_TYPES.map((imageType) => (
//                 <li key={imageType}>
//                   <button
//                     onClick={generateDownloadCanvasByImageType(imageType)}
//                   >
//                     .{imageType}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </footer>
//   );
// };

export const Edit = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageFileSource = useAtomValue(imageFileSourceAtom);
  // const [isDrawing, setIsDrawing] = useAtom(isDrawingAtom);

  useCanvas({
    canvasRef,
  });

  const navigate = useNavigate();

  const redirectToHome = useCallback(
    () => navigate(PAGES.HOME.path),
    [navigate]
  );

  useEffect(() => {
    if (!imageFileSource) redirectToHome();
  }, [redirectToHome, imageFileSource]);

  return (
    <main className="w-dvw h-dvh flex flex-col  items-center">
      <aside className="flex justify-between p-4 w-full mx-auto">
        <button
          className="btn btn-square btn-error"
          aria-label="Clear image uploaded"
          onClick={redirectToHome}
        >
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
        {/* <ul>
          <li>
            <button
              className={clsx(
                "btn btn-square btn-outline btn-primary",
                isDrawing && "btn-active"
              )}
              onClick={() => setIsDrawing((prevIsDrawing) => !prevIsDrawing)}
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
        </ul> */}
      </aside>
      <Canvas ref={canvasRef} />

      {/*

      <div className="join">
        <label className="input input-bordered flex items-center gap-2 join-item">
          <svg
            xmlns="http:www.w3.org/2000/svg"
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
            value={imageFileName}
            onChange={({ target }) => setImageFileName(target.value)}
          />
        </label>
        <div className="dropdown dropdown-top dropdown-end">
          <button
            tabIndex={0}
            role="button"
            className="btn btn-primary join-item"
          >
            <svg
              xmlns="http:www.w3.org/2000/svg"
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
              xmlns="http:www.w3.org/2000/svg"
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
                <button onClick={generateDownloadCanvasByImageType(imageType)}>
                  .{imageType}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    */}
    </main>
  );
};
