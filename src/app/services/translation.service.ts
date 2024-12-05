import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TranslationPayload {
  text: string;
  source_language: string;
  target_language: string;
}

export interface TranslationResponse {
  translated_text: string; // La respuesta debe incluir esta propiedad
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private apiUrl = 'https://shark-app-8nc6c.ondigitalocean.app/translate';

  constructor(private http: HttpClient) {}

  translate(payload: TranslationPayload): Observable<TranslationResponse> {
    return this.http.post<TranslationResponse>(this.apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
