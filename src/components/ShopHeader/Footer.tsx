import React from 'react';

interface FooterProps {
  onAddCoins: () => void;
  onRemoveCoins: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAddCoins, onRemoveCoins }) => {
  return (
    <footer className="text-center mt-10 py-5 px-4 bg-gray-800/80 text-beige font-cinzel text-lg">
      <p>Mischief Managed!</p>
      <div className="mt-4 opacity-70">
        <button 
          onClick={onAddCoins}
          className="bg-blue-900 text-beige border border-gold py-1 px-3 mx-2 rounded hover:bg-blue-800 text-sm"
        >
          Add 50 Galleons (Test)
        </button>
        <button 
          onClick={onRemoveCoins}
          className="bg-blue-900 text-beige border border-gold py-1 px-3 mx-2 rounded hover:bg-blue-800 text-sm"
        >
          Remove 50 Galleons (Test)
        </button>
      </div>
    </footer>
  );
};
