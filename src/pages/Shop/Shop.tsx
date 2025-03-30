// App.tsx - Main Component
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Modal from '../../components/ShopHeader/Modal';
import Footer from '../../components/Footer/Footer';
import ShopHeader from '../../components/ShopHeader/ShopHeader';
import ShopItem from '../../components/ShopHeader/ShopItem';

// Define types
export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const Shop: React.FC = () => {
  const [playerCoins, setPlayerCoins] = useState<number>(200);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');

  const shopItems: Item[] = [
    {
      id: 'cf-card-common',
      name: 'Common Chocolate Frog Card',
      description: 'A collectible card featuring a famous witch or wizard. Might be Dumbledore!',
      price: 50,
      image: 'c1.jpeg'
    },
    {
      id: 'bb-sticker',
      name: 'Bertie Bott\'s Sticker',
      description: 'A colourful sticker showcasing the infamous Every-Flavour Beans.',
      price: 25,
      image: 'c2.jpeg'
    },
    {
      id: 'cf-card-rare',
      name: 'Rare Chocolate Frog Card',
      description: 'A holographic card featuring a *very* famous wizard. Highly sought after!',
      price: 150,
      image: 'c3.jpeg'
    },
    {
      id: 'snitch-sticker',
      name: 'Golden Snitch Sticker',
      description: 'A shiny sticker depicting the most important ball in Quidditch.',
      price: 90,
      image: 'c4.jpeg'
    },
    {
      id: 'map-page',
      name: 'Marauder\'s Map Page',
      description: '"I solemnly swear that I am up to no good." A replica page.',
      price: 300,
      image: 'stick1.png'
    },
    {
      id: 'hogwarts-crest',
      name: 'Hogwarts Crest Sticker',
      description: 'Show your school pride with this detailed Hogwarts crest sticker.',
      price: 210,
      image: 'stick2.png'
    }
  ];

  const handleBuyItem = (item: Item) => {
    if (playerCoins >= item.price) {
      setPlayerCoins(prev => prev - item.price);
      setModalMessage(`Mischief managed! You purchased "${item.name}" for ${item.price} Galleons. Your new balance is ${playerCoins - item.price} Galleons.`);
      setShowModal(true);
    } else {
      setModalMessage("Merlin's beard! You don't have enough Galleons for that!");
      setShowModal(true);
    }
  };

  const addCoins = () => {
    setPlayerCoins(prev => prev + 50);
  };

  const removeCoins = () => {
    setPlayerCoins(prev => Math.max(0, prev - 50));
  };

  // Close modal handler
  const closeModal = () => {
    setShowModal(false);
  };

  // Effect for escape key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [showModal]);

  return (
    <div className="min-h-screen bg-gray-800 bg-[url('/images/parchment-bg.jpg')] bg-cover bg-fixed font-medieval text-gray-800">
      <ShopHeader playerCoins={playerCoins} />
      
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-5 pb-10 max-w-6xl mx-auto">
        {shopItems.map(item => (
          <ShopItem
            key={item.id}
            item={item}
            canAfford={playerCoins >= item.price}
            onBuyItem={handleBuyItem}
          />
        ))}
      </main>
      
      <Footer onAddCoins={addCoins} onRemoveCoins={removeCoins} />
      
      <AnimatePresence>
        {showModal && (
          <Modal message={modalMessage} onClose={closeModal} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;