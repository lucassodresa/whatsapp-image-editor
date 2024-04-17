import { atom } from "jotai";

export type ImageFile = { name: string; source: File };

export const imageFileSourceAtom = atom<File | null>(null);
export const imageFileNameAtom = atom("");

export const isDrawingAtom = atom(false);
export const lineColorAtom = atom("#84CC16");
export const lineSizeAtom = atom(10);
