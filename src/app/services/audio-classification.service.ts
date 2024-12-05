import { Injectable } from '@angular/core';
import { AudioClassifier, FilesetResolver } from '@mediapipe/tasks-audio';

@Injectable({
  providedIn: 'root'
})
export class AudioClassificationService {
  private audioClassifier: AudioClassifier | null = null;

  constructor() {}

  async initializeAudioClassifier(): Promise<void> {
    if (!this.audioClassifier) {
      const audio = await FilesetResolver.forAudioTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@0.10.0/wasm');
      this.audioClassifier = await AudioClassifier.createFromOptions(audio, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/audio_classifier/audio_classifier.tflite',
        }
        // runningMode: 'AUDIO_CLIPS',
      });
    }
  }

  async classifyAudio(input: Float32Array): Promise<any | null> {
    await this.initializeAudioClassifier();

    if (!this.audioClassifier) {
      console.error('AudioClassifier failed to initialize.');
      return null;
    }

    return this.audioClassifier.classify(input);
  }
}