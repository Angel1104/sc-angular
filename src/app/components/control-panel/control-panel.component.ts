import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { VoiceRecognitionService } from '../../services/voice-recognition.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-control-panel',
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatButton, MatCard, MatCardModule],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.css'
})
export class ControlPanelComponent {
  inputLanguage: string = 'es-ES';
  outputLanguage: string = 'en-EN';

  constructor(
    private voiceRecognitionService: VoiceRecognitionService,
    private translationService: TranslationService
  ) {}

  startRecognition(): void {
    this.voiceRecognitionService.startRecognition(this.inputLanguage);
  }

  stopRecognition(): void {
    this.voiceRecognitionService.stopRecognition();
  }

  clearTranscript(): void {
    this.voiceRecognitionService.clearTranscript();
  }
  
  startMediaPipe(): void {
    console.log('MediaPipe iniciado'); // Lógica por implementar
  }
  
  stopMediaPipe(): void {
    console.log('MediaPipe detenido'); // Lógica por implementar
  }
  
}
