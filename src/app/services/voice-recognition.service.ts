import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VoiceRecognitionService {
  private recognition: any; // Instancia de SpeechRecognition
  private isListening: boolean = false; // Estado del reconocimiento
  private lang: string = 'en-US'; // Idioma predeterminado

  // Observable para compartir el texto capturado acumulado
  private transcriptSource = new BehaviorSubject<string>('');
  private recognitionEnded = new Subject<void>(); // Evento de detención
  private recognitionError = new Subject<string>(); // Evento de error

  public transcript$ = this.transcriptSource.asObservable();
  public recognitionEnded$ = this.recognitionEnded.asObservable();
  public recognitionError$ = this.recognitionError.asObservable();

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false; // Cambiar a falso para manejar pausas manualmente
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const currentText = this.transcriptSource.value; // Obtén el texto acumulado
        this.transcriptSource.next(`${currentText} ${transcript}`.trim()); // Acumula el nuevo texto
        console.log('Texto capturado acumulado:', this.transcriptSource.value);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error);
        this.recognitionError.next(event.error); // Emitir error al componente
      };

      this.recognition.onend = () => {
        console.log('Reconocimiento de voz detenido.');
        this.recognitionEnded.next(); // Emitir evento de detención
        if (this.isListening) {
          this.addPeriodToTranscript(); // Agregar punto antes de reanudar
          this.restartRecognition(); // Reanuda automáticamente si está escuchando
        }
      };
    } else {
      console.error('Speech Recognition API no es compatible con este navegador.');
    }
  }

  startRecognition(language: string = 'en-US'): void {
    if (!this.recognition) {
      console.error('SpeechRecognition no está inicializado.');
      return;
    }

    if (this.isListening) {
      console.log('El reconocimiento ya está activo.');
      return;
    }

    this.lang = language;
    this.recognition.lang = this.lang;
    this.recognition.start();
    this.isListening = true;
    console.log(`Reconocimiento de voz iniciado en idioma: ${this.lang}`);
  }

  stopRecognition(): void {
    if (!this.isListening) {
      console.log('El reconocimiento ya está detenido.');
      return;
    }

    this.recognition.stop();
    this.isListening = false;
    console.log('Reconocimiento de voz detenido.');
  }

  clearTranscript(): void {
    this.transcriptSource.next(''); // Limpia el texto acumulado
    console.log('Texto acumulado limpiado.');
  }

  private restartRecognition(): void {
    if (!this.recognition) {
      console.error('No se puede reiniciar, SpeechRecognition no está inicializado.');
      return;
    }
    console.log('Reanudando reconocimiento de voz...');
    this.recognition.start();
  }

  private addPeriodToTranscript(): void {
    const currentText = this.transcriptSource.value.trim();
    if (currentText && !currentText.endsWith('.')) {
      this.transcriptSource.next(`${currentText}.`); // Agrega un punto al final
      console.log('Punto agregado al final del texto acumulado:', this.transcriptSource.value);
    }
  }
}
