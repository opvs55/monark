// src/components/Personagem.jsx

function Personagem({ imagem, className }) {
  return (
    <div className={`personagem-container ${className || ''}`}>
      <img src={imagem} alt="Personagem" className="personagem-sprite" />
    </div>
  );
}

export default Personagem;