import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video',
  imports: [],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent {
  @ViewChild('video', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('audioCanvas', { static: true }) audioCanvas!: ElementRef<HTMLCanvasElement>;

  private audioContext!: AudioContext;
  private analyser!: AnalyserNode;
  private bufferLength!: number;
  private dataArray!: Uint8Array;

  ngAfterViewInit(): void {
    this.startVideoAndAudio();
  }

  private async startVideoAndAudio(): Promise<void> {
    try {
      // Solicitar acceso al micrófono y cámara
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      // Asignar solo el video al elemento de video
      this.videoElement.nativeElement.srcObject = stream;
  
      // Procesar el audio sin reproducirlo
      this.setupAudioProcessing(stream);
  
      // Dibujar las ondas de audio
      this.drawAudioWaveform();
    } catch (error) {
      console.error('Error al acceder a la cámara o micrófono:', error);
    }
  }

  private setupAudioProcessing(stream: MediaStream) {
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(stream);

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;

    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    source.connect(this.analyser);
  }

  private drawAudioWaveform(): void {
    const canvas = this.audioCanvas.nativeElement;
    const canvasCtx = canvas.getContext('2d');

    if (!canvasCtx) {
      console.error('No se pudo obtener el contexto 2D del canvas.');
      return;
    }

    const draw = () => {
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      this.analyser.getByteTimeDomainData(this.dataArray);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#00FF00';
      canvasCtx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / this.bufferLength;
      let x = 0;

      for (let i = 0; i < this.bufferLength; i++) {
        const v = this.dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();

      requestAnimationFrame(draw);
    };

    draw();
  }
  
}
