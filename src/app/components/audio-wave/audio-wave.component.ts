import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-audio-wave',
  templateUrl: './audio-wave.component.html',
  styleUrls: ['./audio-wave.component.css'],
})
export class AudioWaveComponent implements AfterViewInit {
  @ViewChild('audioCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private canvasCtx!: CanvasRenderingContext2D | null;
  private analyser!: AnalyserNode;
  private dataArray!: Uint8Array;
  private bufferLength!: number;

  private audioContext!: AudioContext;
  private mediaStream!: MediaStream;

  ngAfterViewInit(): void {
    this.startAudioVisualization();
  }

  private async startAudioVisualization(): Promise<void> {
    try {
      // Solicitar acceso al micrófono
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Configurar el contexto de audio
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Configurar el analizador
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      source.connect(this.analyser);

      // Inicializar el dibujo
      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
      this.canvasCtx = this.canvasRef.nativeElement.getContext('2d');
      this.draw();
    } catch (error) {
      console.error('Error al iniciar la visualización de audio:', error);
    }
  }

  private draw(): void {
    if (!this.canvasCtx || !this.analyser) return;

    // Limpia el canvas
    const canvas = this.canvasRef.nativeElement;
    this.canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Obtén los datos del analizador
    this.analyser.getByteTimeDomainData(this.dataArray);

    // Configurar el dibujo de las ondas
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.strokeStyle = '#007bff';
    this.canvasCtx.beginPath();

    const sliceWidth = canvas.width / this.bufferLength;
    let x = 0;

    for (let i = 0; i < this.bufferLength; i++) {
      const v = this.dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) this.canvasCtx.moveTo(x, y);
      else this.canvasCtx.lineTo(x, y);

      x += sliceWidth;
    }

    this.canvasCtx.lineTo(canvas.width, canvas.height / 2);
    this.canvasCtx.stroke();

    // Solicitar el próximo frame
    requestAnimationFrame(() => this.draw());
  }

  // Finaliza el audio y libera recursos
  stopVisualization(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.mediaStream.getTracks().forEach((track) => track.stop());
      console.log('Visualización de audio detenida.');
    }
  }
}
