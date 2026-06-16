import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TriageRequest, TriageResponse } from '../models/chatbot.models';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private http = inject(HttpClient);
  private baseUrl = '/api/chatbot';

  procesarSintomas(sintomas: string): Observable<TriageResponse> {
    const payload: TriageRequest = { sintomas };
    return this.http.post<TriageResponse>(`${this.baseUrl}/triage`, payload);
  }
}