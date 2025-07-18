// src/components/SequenciaRevelacao.jsx

import React, { useEffect, useState, useRef } from 'react';

// MUDANÇA: Corrigido o nome do arquivo para corresponder à sua pasta!
const memorias = [
  { img: '/images/memoria1.webp', audio: '/audio/narracao1.wav' }, // Estava .jpg, agora é .webp
  { img: '/images/memoria2.jpg', audio: '/audio/narracao3.wav' },
  { img: '/images/memoria3.jpg', audio: '/audio/narracao2.wav' },
];

function SequenciaRevelacao({ onFimDaAnimacao }) {
  const [memoriaAtual, setMemoriaAtual] = useState({ index: -1, style: {} });
  const [mostrarFlash, setMostrarFlash] = useState(false);
  const [mostrarTextoClimax, setMostrarTextoClimax] = useState(false);
  const narracaoAudioRef = useRef(null);

  // MUDANÇA CRÍTICA: A lógica de posicionamento agora é à prova de falhas.
  const gerarEstiloAleatorio = (index) => {
    // Define a "área segura" central da tela para o centro da imagem.
    // Ex: min/max 30%/70% para o eixo Y.
    const top = 30 + Math.random() * 40;
    // Ex: min/max 45%/55% para o eixo X (mais centralizado para evitar cortes laterais).
    const left = 45 + Math.random() * 10;
    const rotation = -10 + Math.random() * 20; // Rotação mais sutil

    return {
      top: `${top}%`,
      left: `${left}%`,
      // A chave: posiciona o elemento pelo seu centro, não pelo canto superior esquerdo.
      transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`,
      animation: 'aparecer-e-sumir-memoria 3.5s ease-in-out forwards',
      backgroundImage: `url(${memorias[index].img})`,
    };
  };

  useEffect(() => {
    const timerMemoria1 = setTimeout(() => {
      setMemoriaAtual({ index: 0, style: gerarEstiloAleatorio(0) });
    }, 4000);

    const timerMemoria2 = setTimeout(() => {
      setMemoriaAtual({ index: 1, style: gerarEstiloAleatorio(1) });
    }, 9000);

    const timerMemoria3 = setTimeout(() => {
      setMemoriaAtual({ index: 2, style: gerarEstiloAleatorio(2) });
    }, 13000);

    const timerClimax = setTimeout(() => {
      setMostrarFlash(true);
      setMemoriaAtual({ index: -1, style: {} });
      setMostrarTextoClimax(true);

      const somTransformacao = new Audio('/audio/transformacao.mp3');
      somTransformacao.play();
    }, 16000);

    const timerFim = setTimeout(() => {
      onFimDaAnimacao();
    }, 16800);

    return () => {
      clearTimeout(timerMemoria1);
      clearTimeout(timerMemoria2);
      clearTimeout(timerMemoria3);
      clearTimeout(timerClimax);
      clearTimeout(timerFim);
    };
  }, [onFimDaAnimacao]);

  useEffect(() => {
    if (memoriaAtual.index >= 0 && memorias[memoriaAtual.index].audio) {
      const audio = narracaoAudioRef.current;
      audio.src = memorias[memoriaAtual.index].audio;
      audio.play().catch(e => console.error("Erro ao tocar narração:", e));
    }
  }, [memoriaAtual.index]);

  return (
    <div className="animacao-container">
      <audio ref={narracaoAudioRef} playsInline />
      
      {mostrarFlash && <div className="flash-background-layer"></div>}
      
      {memoriaAtual.index >= 0 && (
        <div
          className="quadro-memoria"
          style={memoriaAtual.style}
          key={memoriaAtual.index}
        ></div>
      )}
      
      {mostrarFlash && <div className="flash-branco"></div>}

      {mostrarTextoClimax && <h1 className="texto-climax">MONIQUE</h1>}
    </div>
  );
}

export default SequenciaRevelacao;