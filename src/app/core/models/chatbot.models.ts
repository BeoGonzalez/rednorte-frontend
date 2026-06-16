export interface TriageRequest {
  sintomas: string;
}

export interface TriageResponse {
  resultado: string;
  total_tokens: number;
}

// Interfaz para la UI del Chat
export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}