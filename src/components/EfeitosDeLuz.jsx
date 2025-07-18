// src/components/EfeitosDeLuz.jsx

import React from 'react';

// Quantidade de flashes de luz que você quer na tela
const NUMERO_DE_LUZES = 7;

// Gera um array de objetos de estilo, cada um com posições e delays aleatórios
const luzes = Array.from({ length: NUMERO_DE_LUZES }).map(() => ({
  top: `${10 + Math.random() * 80}%`, // Posição Y aleatória
  left: `${10 + Math.random() * 80}%`, // Posição X aleatória
  animationDelay: `${Math.random() * 5}s`, // Atraso aleatório para não piscarem juntas
  animationDuration: `${3 + Math.random() * 4}s`, // Duração aleatória do pulso
}));

function EfeitosDeLuz() {
  return (
    <div className="container-luzes-celestiais">
      {luzes.map((style, index) => (
        <div key={index} className="luz-celestial" style={style}></div>
      ))}
    </div>
  );
}

export default EfeitosDeLuz;