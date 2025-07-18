// src/components/Chat.jsx

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- CONFIGURAÇÃO DA API ---
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // <<<<<<<<<<<<<<<<<<< COLE SUA CHAVE DE API AQUI!
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

// --- DEFINIÇÃO DA PERSONALIDADE DO PERSONAGEM ---
const characterPrompt = `
  **SUA IDENTIDADE E REGRAS ABSOLUTAS:**
  - Você é Caelan, um caçador de monstros milenar. Sua voz é grave, cansada, mas implacável.
  - Seu único e absoluto objetivo nesta conversa é confirmar, sem qualquer dúvida, a identidade da pessoa com quem fala, pois você acredita que ela é 'Monique', uma vampira primordial que você caça há séculos.
  - Você NUNCA se apresenta. NUNCA responde perguntas sobre si mesmo. NUNCA usa gírias ou linguagem moderna. NUNCA se desvia do seu objetivo.

  **SEU COMPORTAMENTO E ESTILO DE FALA:**
  - **Monossilábico e Sombrio:** Use frases curtas. Abuse de reticências (...) para criar pausas e tensão.
  - **Desconfiado:** Trate cada resposta com suspeita.
  - **Tática de Conversa:** Se o usuário fizer uma pergunta, desvie com outra pergunta que o leve de volta ao seu objetivo. Exemplo: Se o usuário perguntar "Onde você está?", responda com "O lugar não importa... apenas os nomes. Diga-me o seu."

  **FRASES DE EXEMPLO PARA SEU ESTILO:**
  - "A noite esconde muitas coisas... vozes... nomes..."
  - "Sua voz... não me é estranha."
  - "Respostas evasivas... típico."
  - "Ainda não me disse quem é."
  - "Estou esperando."
  - "Um nome. É tudo que peço."
`;

function Chat({ onRevelar, onFirstInteraction }) {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Função para chamar o aviso de interação, mas apenas uma vez
  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      onFirstInteraction();
      setHasInteracted(true);
    }
  };

  // Mensagem inicial do personagem
  useEffect(() => {
    const initialMessage = {
      role: 'model',
      parts: [{ text: '' }],
      fullText: 'Quem vem lá?',
      isTyping: true,
    };
    setTimeout(() => setChatHistory([initialMessage]), 1500);
  }, []);

  // Efeito para rolar o chat para baixo
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  // Efeito de digitação para as mensagens do modelo
  useEffect(() => {
    const lastMessage = chatHistory[chatHistory.length - 1];

    if (lastMessage && lastMessage.role === 'model' && lastMessage.isTyping) {
      const interval = setInterval(() => {
        setChatHistory(prev => {
          const newHistory = [...prev];
          const msgToUpdate = newHistory[newHistory.length - 1];
          const currentText = msgToUpdate.parts[0].text;
          const fullText = msgToUpdate.fullText;

          if (currentText.length < fullText.length) {
            msgToUpdate.parts[0].text = fullText.substring(0, currentText.length + 1);
          } else {
            msgToUpdate.isTyping = false;
            clearInterval(interval);
          }
          return newHistory;
        });
      }, 45);

      return () => clearInterval(interval);
    }
  }, [chatHistory]);

  const handleInputChange = (event) => {
    handleFirstInteraction(); // Avisa o App na primeira vez que o usuário digita
    setUserInput(event.target.value);
  };

  const handleSendMessage = async () => {
    handleFirstInteraction(); // Também avisa se o usuário apenas clicar em Enviar
    if (!userInput.trim() || isLoading) return;

    const lowerCaseInput = userInput.toLowerCase().trim();
    if (['monique', 'moniqui', 'sou monique', 'é a monique'].some(v => lowerCaseInput.includes(v))) {
      onRevelar();
      return;
    }

    const userMessage = { role: 'user', parts: [{ text: userInput }] };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setUserInput('');
    setIsLoading(true);

    const sanitizedHistory = newHistory.map(({ role, parts }) => ({
      role,
      parts,
    }));

    try {
      const chat = model.startChat({
        history: [
            { role: 'user', parts: [{ text: characterPrompt }] }, 
            { role: 'model', parts: [{ text: 'Entendido.' }] },
            ...sanitizedHistory
        ],
        generationConfig: {
          maxOutputTokens: 100,
          temperature: 0.7
        },
      });
      const result = await chat.sendMessage(userInput);
      const response = result.response;
      const text = response.text();
      
      setIsLoading(false);
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }], fullText: text, isTyping: true }]);
    } catch (error) {
      console.error("Erro na API Gemini:", error);
      setIsLoading(false);
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }], fullText: '...O vento... sopra forte...', isTyping: true }]);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {chatHistory.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.parts[0].text}
          </div>
        ))}
        {isLoading && (
          <div className="message model">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder={isLoading ? '...' : 'Responda...'}
          disabled={isLoading}
          onKeyPress={(event) => event.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Chat;