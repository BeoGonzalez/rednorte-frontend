import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../core/services/chatbot.service';
import { ChatMessage } from '../../core/models/chatbot.models';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  private chatbotService = inject(ChatbotService);
  
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages: ChatMessage[] = [
    {
      text: 'Hola, soy el Asistente de Triaje de RedNorte. ¿Cuáles son tus síntomas hoy?',
      sender: 'bot',
      timestamp: new Date()
    }
  ];
  
  userInput: string = '';
  isTyping: boolean = false;

  sendMessage() {
    if (!this.userInput.trim()) return;

    // 1. Agregar mensaje del usuario
    const userText = this.userInput;
    this.messages.push({
      text: userText,
      sender: 'user',
      timestamp: new Date()
    });
    
    this.userInput = '';
    this.isTyping = true;
    this.scrollToBottom();

    // 2. Llamar al servicio (Backend)
    this.chatbotService.procesarSintomas(userText).subscribe({
      next: (response) => {
        this.isTyping = false;
        this.messages.push({
          text: response.resultado,
          sender: 'bot',
          timestamp: new Date()
        });
        this.scrollToBottom();
      },
      error: (err) => {
        this.isTyping = false;
        this.messages.push({
          text: 'Lo siento, estoy experimentando dificultades técnicas. Por favor, intenta de nuevo más tarde.',
          sender: 'bot',
          timestamp: new Date()
        });
        console.error('Error en el triaje AI', err);
        this.scrollToBottom();
      }
    });
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}