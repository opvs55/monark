// src/components/AnimacaoFinal.jsx

import React, { useEffect, useRef } from 'react';

function AnimacaoFinal() {
  const audioTransformacaoRef = useRef(null);
  const audioMusicaTemaRef = useRef(null);

  useEffect(() => {
    console.log("Componente de Animação Montado. Tentando tocar áudios...");

    const tocarAudio = async () => {
      try {
        console.log("Tentando tocar som de transformação...");
        await audioTransformacaoRef.current.play();
        console.log("Som de transformação INICIADO.");
      } catch (err) {
        console.error("Erro ao tocar som de transformação:", err);
      }

      const timerMusica = setTimeout(async () => {
        try {
          console.log("Tentando tocar música tema...");
          audioMusicaTemaRef.current.volume = 0.4;
          await audioMusicaTemaRef.current.play();
          console.log("Música tema INICIADA.");
        } catch (err) {
          console.error("Erro ao tocar música tema:", err);
        }
      }, 1000);

      return () => clearTimeout(timerMusica);
    };

    tocarAudio();

  }, []);

  return (
    <div className="animacao-container">
      {/* Adicionamos 'playsInline' que ajuda em dispositivos móveis */}
      <audio ref={audioTransformacaoRef} src="/transformacao.mp3" playsInline />
      <audio ref={audioMusicaTemaRef} src="/musica_tema.mp3" loop playsInline />

      <div className="clarão-celestial"></div>
      <h1 className="texto-revelacao">MONIQUE</h1>
    </div>
  );
}

export default AnimacaoFinal;