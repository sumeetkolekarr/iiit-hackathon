import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
    message: string;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onClose }) => {
    const overlayRef = useRef < HTMLDivElement > (null);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50"
            ref={overlayRef}
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="bg-beige text-gray-800 p-8 border-4 border-maroon rounded-lg shadow-2xl text-center max-w-md w-full"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                <p className="text-xl mb-6 leading-relaxed">{message}</p>
                <motion.button
                    className="bg-gold text-gray-800 font-cinzel text-lg font-bold py-2 px-5 rounded"
                    whileHover={{ scale: 1.03, backgroundColor: "#e6bf4a" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                >
                    Accio Close!
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default Modal;