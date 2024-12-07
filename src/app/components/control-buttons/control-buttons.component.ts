import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-control-buttons',
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.css'],
})
export class ControlButtonsComponent {
  @Input() status: string = '';
  @Output() play = new EventEmitter<void>();
  @Output() stop = new EventEmitter<void>();
  @Output() clean = new EventEmitter<void>();

  onPlay(): void {
    this.play.emit();
  }

  onStop(): void {
    this.stop.emit();
  }

  onClean(): void {
    this.clean.emit();
  }
}
