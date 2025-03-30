import React from "react";
import { motion } from "framer-motion";
import { Item } from "../../Types";

interface ShopItemProps {
  item: Item;
  canAfford: boolean;
  onBuyItem: (item: Item) => void;
}

const ShopItem: React.FC<ShopItemProps> = ({ item, canAfford, onBuyItem }) => {
  return (
    <motion.div
      className={`bg-beige border-2 border-maroon rounded-lg p-4 flex flex-col justify-between shadow-lg 
        ${!canAfford ? "opacity-60 pointer-events-none" : ""}`}
      whileHover={
        canAfford ? { y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.5)" } : {}
      }
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col items-center">
        <img
          src={item.image}
          alt={item.name}
          className="w-4/5 h-40 object-contain mx-auto mb-4"
        />
        <h2 className="font-cinzel text-xl text-maroon min-h-10 mb-2">
          {item.name}
        </h2>
        <p className="text-base mb-4 flex-grow">{item.description}</p>
      </div>
      <div>
        <div className="font-bold text-lg mb-4">
          Price: <span className="text-maroon">{item.price}</span>{" "}
          <span className="italic text-sm">Galleons</span>
        </div>
        <motion.button
          className={`w-full py-2 px-4 font-cinzel font-bold rounded-md ${
            canAfford
              ? "bg-gold text-gray-800 cursor-pointer"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          whileHover={canAfford ? { scale: 1.03 } : {}}
          whileTap={canAfford ? { scale: 0.98 } : {}}
          onClick={() => onBuyItem(item)}
          disabled={!canAfford}
        >
          {canAfford ? "Buy Now" : "Not Enough Galleons"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ShopItem;
