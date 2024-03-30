import { useEffect, useState } from "react";
import { InputFile } from "./components/input-file";
import "./index.css";

function App() {
  const [fileReader, setFileReader] = useState<FileReader | null>(null);

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    if (!fileReader || !ctx) return;

    const image = new Image();

    fileReader.onload = () => {
      image.onload = () => {
        const originalWidthToHeightRatio = image.width / image.height;
        const width = image.height * originalWidthToHeightRatio;
        const height = image.width / originalWidthToHeightRatio;

        canvas.width = Math.floor(width);
        canvas.height = Math.floor(height);

        ctx.drawImage(image, 0, 0, Math.floor(width), Math.floor(height));
      };
      image.src = fileReader.result as string;

      ctx.beginPath(); // Start a new path
      ctx.moveTo(300, 200); // Move the pen to (30, 50)
      ctx.lineTo(500, 500); // Draw a line to (150, 100)
      ctx.stroke(); // Render the path
    };
  }, [fileReader]);

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // draw line rounded Line based on mouse position on canvas
    const drawLine = (x: number, y: number) => {
      // draw an rounded line
      ctx.lineCap = "round";
      ctx.lineTo(x, y);
      ctx.stroke();

      // define line stroke width and color
      ctx.lineWidth = 20;
      ctx.strokeStyle = "blue";
    };

    canvas.addEventListener("mousedown", (e) => {
      const x = e.offsetX;
      const y = e.offsetY;

      ctx.beginPath();
      ctx.moveTo(x, y);

      canvas.addEventListener("mousemove", (e) => {
        drawLine(e.offsetX, e.offsetY);
      });

      canvas.addEventListener("mouseup", () => {
        canvas.removeEventListener("mousemove", (e) => {
          drawLine(e.offsetX, e.offsetY);
        });
      });
    });
  }, []);

  return (
    <main>
      <InputFile setFileReader={setFileReader} />
      <div className="canvas__container">
        <canvas id="canvas" width="500" height="500"></canvas>
      </div>
    </main>
  );
}

export default App;
