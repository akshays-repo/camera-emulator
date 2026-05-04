import { create } from 'zustand';

export interface Photo {
  id: string;
  dataUrl: string;
  sceneId: string;
  iso: number;
  shutter: number;
  aperture: number;
  timestamp: number;
}

export interface CameraState {
  aperture: number;
  shutter: number;
  iso: number;
  sceneId: string;
  photos: Photo[];
  setAperture: (v: number) => void;
  setShutter: (v: number) => void;
  setISO: (v: number) => void;
  setSceneId: (id: string) => void;
  addPhoto: (photo: Photo) => void;
  removePhoto: (id: string) => void;
}

export const APERTURE_VALUES = [1.8, 2.8, 4, 5.6, 8, 11, 16];
export const SHUTTER_VALUES = [1/1000, 1/500, 1/250, 1/125, 1/60, 1/30, 1/15, 1/8, 1/4, 1/2, 1];
export const SHUTTER_LABELS = ['1/1000','1/500','1/250','1/125','1/60','1/30','1/15','1/8','1/4','1/2','1"'];
export const ISO_VALUES = [100, 200, 400, 800, 1600, 3200, 6400];

export const useCameraStore = create<CameraState>((set) => ({
  aperture: 5.6,
  shutter: 1 / 125,
  iso: 400,
  sceneId: 'helicopter',
  photos: [],
  setAperture: (v) => set({ aperture: v }),
  setShutter:  (v) => set({ shutter: v }),
  setISO:      (v) => set({ iso: v }),
  setSceneId:  (id) => set({ sceneId: id }),
  addPhoto:    (photo) => set((s) => ({ photos: [photo, ...s.photos] })),
  removePhoto: (id)   => set((s) => ({ photos: s.photos.filter(p => p.id !== id) })),
}));
