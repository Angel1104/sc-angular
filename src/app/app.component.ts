import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageSelectorComponent } from "./components/language-selector/language-selector.component";
import { AudioWaveComponent } from "./components/audio-wave/audio-wave.component";
import { TextBoxComponent } from "./components/text-box/text-box.component";
import { ControlButtonsComponent } from "./components/control-buttons/control-buttons.component";
import { VoiceRecognitionService } from './services/voice-recognition.service';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  imports: [ FormsModule, LanguageSelectorComponent, AudioWaveComponent, TextBoxComponent, ControlButtonsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  originalText: string = '';
  translatedText: string = '';
  status: string = 'Detenido'; // Estado inicial
  inputLanguage: string = 'es-ES';
  outputLanguage: string = 'en';

  constructor(
    private voiceService: VoiceRecognitionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Escuchar cambios en el texto original
    this.voiceService.transcript$.subscribe((text) => {
      this.originalText = text;
      this.cdr.detectChanges(); 
    });

    // Escuchar cambios en el texto traducido
    this.voiceService.translatedText$.subscribe((text) => {
      this.translatedText = text;
      this.cdr.detectChanges();
    });

    // Escuchar el estado del servicio
    this.voiceService.status$.subscribe((status) => {
      this.status = status;
    });
  }

  startRecognition(): void {
    this.voiceService.setInputLanguage(this.inputLanguage);
    this.voiceService.setOutputLanguage(this.outputLanguage);
    this.voiceService.startRecognition();
  }

  stopRecognition(): void {
    this.voiceService.stopRecognition();
  }

  clearText(): void {
    this.voiceService.clearText();
    this.originalText = '';
    this.translatedText = '';
  }

  onInputLanguageChange(lang: string): void {
    this.inputLanguage = lang;
    this.voiceService.setInputLanguage(lang);
  }

  onOutputLanguageChange(lang: string): void {
    this.outputLanguage = lang;
    this.voiceService.setOutputLanguage(lang);
  }
}
