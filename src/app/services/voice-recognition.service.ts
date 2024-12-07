import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  private recognition: any; // Instancia de SpeechRecognition
  private isListening: boolean = false; // Estado de escucha
  private accumulatedText: string = ''; // Texto acumulado

  private inputLanguage: string = 'es-ES'; // Idioma de entrada
  private outputLanguage: string = 'en'; // Idioma de salida

  private transcriptSource = new BehaviorSubject<string>(''); // Texto original acumulado
  public transcript$ = this.transcriptSource.asObservable();

  private translatedTextSource = new BehaviorSubject<string>(''); // Texto traducido acumulado
  public translatedText$ = this.translatedTextSource.asObservable();

  private statusSource = new BehaviorSubject<string>('Detenido 🛑'); // Estado actual
  public status$ = this.statusSource.asObservable();

  constructor(private translationService: TranslationService) {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false; // Reinicio manual después de pausa
      this.recognition.interimResults = false; // Solo resultados finales

      // Captura resultados de reconocimiento
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim(); // Texto reconocido
        this.accumulatedText += ` ${transcript}`; // Acumula el texto
        this.transcriptSource.next(this.accumulatedText.trim()); // Emite el texto acumulado
        console.log('Texto capturado:', transcript);

        // Envía el texto a traducir
        this.translateText(this.accumulatedText.trim());
      };

      // Maneja el fin del reconocimiento
      this.recognition.onend = () => {
        if (this.isListening) {
          this.recognition.start(); // Reinicia automáticamente
          this.statusSource.next('Escuchando... 🎙️');
        } else {
          this.statusSource.next('Detenido 🛑');
        }
      };

      // Maneja errores
      this.recognition.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error);
        this.statusSource.next(`Error: ${event.error}`);
      };
    } else {
      console.error('Speech Recognition API no es compatible con este navegador.');
      this.statusSource.next('No compatible.');
    }
  }

  // Inicia el reconocimiento
  startRecognition(): void {
    if (!this.recognition || this.isListening) return;

    this.recognition.lang = this.inputLanguage; // Configura el idioma de entrada
    this.recognition.start(); // Inicia el reconocimiento
    this.isListening = true;
    this.statusSource.next('Escuchando... 🎙️');
    console.log('Reconocimiento iniciado en idioma:', this.inputLanguage);
  }

  // Detiene el reconocimiento
  stopRecognition(): void {
    if (!this.recognition || !this.isListening) return;

    this.recognition.stop(); // Detiene el reconocimiento
    this.isListening = false;
    this.statusSource.next('Detenido 🛑');
    console.log('Reconocimiento detenido 🛑');
  }

  // Limpia el texto acumulado
  clearText(): void {
    this.accumulatedText = ''; // Limpia el texto acumulado
    this.transcriptSource.next(''); // Emite el texto vacío
    this.translatedTextSource.next(''); // Limpia el texto traducido
    this.statusSource.next('Texto limpio. 🧼');
    console.log('Texto acumulado limpiado.');
  }

  // Configura los idiomas
  setInputLanguage(language: string): void {
    this.inputLanguage = language;
  }

  setOutputLanguage(language: string): void {
    this.outputLanguage = language;
  }

  // Traduce el texto acumulado
  private translateText(text: string): void {
    const payload = {
      text: text,
      source_language: this.inputLanguage.split('-')[0], // Obtiene el código del idioma de entrada
      target_language: this.outputLanguage, // Idioma de salida configurado
    };

    this.translationService.translate(payload).subscribe({
      next: (response) => {
        this.translatedTextSource.next(response.translated_text);
        console.log('Texto traducido:', response.translated_text);
      },
      error: (err) => {
        console.error('Error al traducir:', err);
        this.statusSource.next('Error al traducir.');
      },
    });
  }
}
