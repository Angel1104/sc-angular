import { Injectable } from '@angular/core';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';

@Injectable({
  providedIn: 'root'
})
export class GestureRecognitionService {
  private gestureRecognizer: GestureRecognizer | null = null;

  constructor() {}

  async initializeGestureRecognizer(): Promise<void> {
    if (!this.gestureRecognizer) {
      const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm');
      this.gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task',
          delegate: 'GPU',
        },
        runningMode: 'IMAGE',
        numHands: 2,
      });
    }
  }

  async recognizeGestures(input: HTMLImageElement | HTMLVideoElement): Promise<any | null> {
    await this.initializeGestureRecognizer();

    if (!this.gestureRecognizer) {
      console.error('GestureRecognizer failed to initialize.');
      return null;
    }

    const results = input instanceof HTMLImageElement
      ? this.gestureRecognizer.recognize(input)
      : this.gestureRecognizer.recognizeForVideo(input, performance.now());
    return results;
  }
}
