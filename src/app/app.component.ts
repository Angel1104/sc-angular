import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ControlPanelComponent } from "./components/control-panel/control-panel.component";
import { VideoComponent } from "./components/video/video.component";
import { TranslationBoxComponent } from "./components/translation-box/translation-box.component";
import { FormsModule } from '@angular/forms';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [ControlPanelComponent, VideoComponent, TranslationBoxComponent, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sc-angular';
}
