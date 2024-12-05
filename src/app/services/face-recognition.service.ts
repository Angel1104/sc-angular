import { Injectable } from '@angular/core';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

@Injectable({
  providedIn: 'root'
})
export class FaceRecognitionService {
  private faceLandmarker: FaceLandmarker | null = null;

  constructor() {}

  async initializeFaceLandmarker(runningMode: 'IMAGE' | 'VIDEO'): Promise<void> {
    if (!this.faceLandmarker) {
      const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm');
      this.faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: runningMode,
        numFaces: 1,
      });
    }
  }

  async detectFaces(input: HTMLImageElement | HTMLVideoElement): Promise<any | null> {
    const runningMode = input instanceof HTMLImageElement ? 'IMAGE' : 'VIDEO';
    await this.initializeFaceLandmarker(runningMode);

    if (!this.faceLandmarker) {
      console.error('FaceLandmarker failed to initialize.');
      return null;
    }

    // Procesar según el tipo de entrada
    return input instanceof HTMLImageElement
      ? this.faceLandmarker.detect(input)
      : this.faceLandmarker.detectForVideo(input, performance.now());
  }
}
