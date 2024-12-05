import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { VoiceRecognitionService } from '../../services/voice-recognition.service';
import { TranslationPayload, TranslationResponse, TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-translation-box',
  imports: [MatCard, MatCardModule],
  templateUrl: './translation-box.component.html',
  styleUrl: './translation-box.component.css'
})
export class TranslationBoxComponent implements OnInit {
  originalText: string = '';
  translatedText: string = '';

  sourceLanguage: string = 'es'; // Idioma de origen
  targetLanguage: string = 'en'; // Idioma de destino

  constructor(
    private voiceRecognitionService: VoiceRecognitionService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    // Suscribirse al texto acumulado
    this.voiceRecognitionService.transcript$.subscribe((text) => {
      this.originalText = text;
    });

    // Suscribirse al evento de detención
    this.voiceRecognitionService.recognitionEnded$.subscribe(() => {
      this.sendForTranslation();
    });
  }

  sendForTranslation(): void {
    if (this.originalText.trim()) {
      this.translationService
        .translate({
          text: this.originalText,
          source_language: this.sourceLanguage,
          target_language: this.targetLanguage,
        })
        .subscribe({
          next: (translation: TranslationResponse) => {
            console.log('Texto traducido:', translation);
            
            this.translatedText = translation.translated_text;
          },
          error: (err) => {
            console.error('Error al traducir:', err);
          },
        });
    }
  }
}
