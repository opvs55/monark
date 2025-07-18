// src/App.jsx

import React, { useState, useEffect, useRef } from 'react';
import Personagem from './components/Personagem.jsx';
import Chat from './components/Chat.jsx';
import SequenciaRevelacao from './components/SequenciaRevelacao.jsx';
import EfeitosDeLuz from './components/EfeitosDeLuz.jsx';

function App() {
  const [fase, setFase] = useState('chat');
  const [userHasInteracted, setUserHasInteracted] = useState(false); // NOVO: Estado para controlar a interação
  
  const audioChatMusicaRef = useRef(null);
  const audioTemaMusicaRef = useRef(null);

  useEffect(() => {
    const musicaChat = audioChatMusicaRef.current;
    const musicaTema = audioTemaMusicaRef.current;

    // MUDANÇA: A música do chat só toca DEPOIS da primeira interação.
    if (fase === 'chat' && userHasInteracted && musicaChat && musicaChat.paused) {
      musicaChat.volume = 0.3;
      musicaChat.play().catch(e => console.error("Erro ao tocar música de chat:", e));
    }
    
    if (fase === 'revelacao') {
      if (musicaChat) {
        let fadeOut = setInterval(() => {
          if (musicaChat.volume > 0.01) {
            musicaChat.volume -= 0.05;
          } else {
            musicaChat.pause();
            clearInterval(fadeOut);
          }
        }, 100);
      }
      if (musicaTema) {
        musicaTema.volume = 0.3;
        musicaTema.play().catch(e => console.error("Erro ao tocar música tema:", e));
      }
    }
    
    if (fase === 'final') {
      if (musicaTema) musicaTema.volume = 0.5;
      document.body.classList.add('fundo-revelacao');
      return () => {
        document.body.classList.remove('fundo-revelacao');
      };
    }
  }, [fase, userHasInteracted]); // MUDANÇA: O 'userHasInteracted' agora é uma dependência

  const handleRevelar = () => {
    setFase('revelacao');
  };
  
  const handleFimDaAnimacao = () => {
    setFase('final');
  };

  const renderFase = () => {
    switch (fase) {
      case 'revelacao':
        return (
          <>
            <Personagem 
              imagem="/images/personagem_normal.png" 
              className="personagem-pre-transformacao" 
            />
            <SequenciaRevelacao onFimDaAnimacao={handleFimDaAnimacao} />
          </>
        );

      case 'final':
        return (
          <>
            <EfeitosDeLuz />
            <Personagem 
              imagem="/images/personagem_transformado.png" 
              className="personagem-final"
            />
            <h2 className="texto-final">ARCANJO CHEGOU CARALHO</h2>
          </>
        );

      default: // 'chat'
        return (
          <>
            <Personagem imagem="/images/personagem_normal.png" />
            {/* NOVO: Passamos uma função para ser chamada na primeira interação */}
            <Chat 
              onRevelar={handleRevelar} 
              onFirstInteraction={() => setUserHasInteracted(true)} 
            />
          </>
        );
    }
  }

  return (
    <div>
      <audio ref={audioChatMusicaRef} src="/audio/musica_chat.mp3" loop playsInline />
      <audio ref={audioTemaMusicaRef} src="/audio/musica_tema.mp3" loop playsInline />
      {renderFase()}
    </div>
  );
}

export default App;