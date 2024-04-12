import { atom } from "jotai";

export type ImageFile = { name: string; source: File };

export const imageFileAtom = atom<ImageFile | null>(null);

export const drawOptionsAtom = atom({
  isDrawing: false,
  lineColor: "#84CC16",
});
