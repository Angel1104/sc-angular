import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./language-selector.component.css'],
})
export class LanguageSelectorComponent {
  languages = [
    { name: 'Español', code: 'es-ES' },
    { name: 'Inglés', code: 'en-US' },
    { name: 'Italiano', code: 'it-IT' },
    { name: 'Chino', code: 'zh-CN' },
  ];

  @Input() inputLanguage: string = 'es-ES';
  @Input() outputLanguage: string = 'en';
  @Output() inputLanguageChanged = new EventEmitter<string>();
  @Output() outputLanguageChanged = new EventEmitter<string>();

  onInputLanguageChange(event: Event): void {
    const lang = (event.target as HTMLSelectElement).value;
    this.inputLanguageChanged.emit(lang);
  }

  onOutputLanguageChange(event: Event): void {
    const lang = (event.target as HTMLSelectElement).value;
    this.outputLanguageChanged.emit(lang);
  }
}
