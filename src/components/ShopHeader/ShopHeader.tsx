// components/ShopHeader.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ShopHeaderProps {
  playerCoins: number;
}

const ShopHeader: React.FC<ShopHeaderProps> = ({ playerCoins }) => {
  return (
    <motion.header 
      className="bg-gray-800/85 text-beige border-b-3 border-gold py-4 px-5 mb-8 flex flex-col md:flex-row items-center md:justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center">
        <img src="image.png" alt="HP Logo" className="h-12 mr-4 rounded-full" />
        <h1 className="font-cinzel text-4xl md:text-5xl text-gold text-center md:text-left drop-shadow-lg">
          Flourish & Blotts Emporium
        </h1>
      </div>
      <motion.div 
        className="bg-black/30 px-4 py-2 rounded-md text-xl mt-2 md:mt-0"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <span>Your Balance: </span>
        <span className="font-bold text-2xl text-gold">{playerCoins}</span> 🪙 <span className="italic text-sm ml-1">Galleons</span>
      </motion.div>
    </motion.header>
  );
};

// components/ShopItem.tsx

// components/Footer.tsx

// components/Modal.tsx

export default ShopHeader;