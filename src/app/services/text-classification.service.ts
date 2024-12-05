import { Injectable } from '@angular/core';
import { TextClassifier, FilesetResolver } from '@mediapipe/tasks-text';

@Injectable({
  providedIn: 'root'
})
export class TextClassificationServiceService {
  private textClassifier: TextClassifier | null = null;

  constructor() {}

  async initializeTextClassifier(): Promise<void> {
    if (!this.textClassifier) {
      const text = await FilesetResolver.forTextTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-text@0.10.0/wasm');
      this.textClassifier = await TextClassifier.createFromOptions(text, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/text_classifier/text_classifier.tflite',
        },
        maxResults: 3,
      });
    }
  }

  async classifyText(input: string): Promise<any | null> {
    await this.initializeTextClassifier();

    if (!this.textClassifier) {
      console.error('TextClassifier failed to initialize.');
      return null;
    }

    return this.textClassifier.classify(input);
  }
}