'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

const ChatbotOptions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! 👋 How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [showOptions, setShowOptions] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const options = [
    { id: 'search', label: '🔍 Search Products', action: 'search' },
    { id: 'track', label: '📦 Track Order', action: 'track' },
    { id: 'help', label: '❓ Get Help', action: 'help' },
    { id: 'callback', label: '📞 Request Callback', action: 'callback' },
  ];

  const handleOptionClick = (option: typeof options[0]) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: option.label,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setShowOptions(false);

    setTimeout(() => {
      let botResponse = '';
      switch (option.action) {
        case 'search':
          botResponse = 'Great! 🛍️ You can search for products by category, brand, or price range.';
          break;
        case 'track':
          botResponse = 'To track your order, please log in with your email address. 📋';
          break;
        case 'help':
          botResponse = 'We are here to help! 💪 Shipping takes 3-5 business days.';
          break;
        case 'callback':
          botResponse = 'Perfect! 📞 Our team will call you within 24 hours.';
          break;
        default:
          botResponse = 'How else can I help you?';
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      setTimeout(() => {
        setShowOptions(true);
      }, 500);
    }, 800);
  };

  const handleSearchClick = () => {
    setIsOpen(false);
    router.push('/');
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full shadow-lg hover:shadow-2xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-white text-xl">{isOpen ? '✕' : '💬'}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 z-40 w-96 max-h-[600px] bg-gradient-to-br from-[#0e0e1a] to-[#1a1a2e] rounded-2xl shadow-2xl border border-purple-500/20 flex flex-col overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
              <h3 className="font-bold text-lg">AirCart Assistant</h3>
              <p className="text-sm opacity-90">
                {user ? `Hello, ${user.name}! 👋` : 'How can we help?'}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none'
                          : 'bg-[#1a1a2e] text-gray-200 border border-purple-500/30 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!showOptions && messages[messages.length - 1]?.type === 'user' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ delay: i * 0.15, duration: 0.6, repeat: Infinity }}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {showOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-purple-500/20 p-3 space-y-2 bg-[#07070f]/50"
              >
                <div className="grid grid-cols-1 gap-2">
                  {options.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => handleOptionClick(option)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-left px-3 py-2 rounded-lg bg-[#1a1a2e] hover:bg-[#252540] border border-purple-500/20 hover:border-purple-500/50 text-gray-200 hover:text-white transition-colors text-sm font-medium"
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  onClick={handleSearchClick}
                  whileHover={{ x: 4 }}
                  className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium hover:shadow-lg transition-shadow"
                >
                  🛒 Browse All Products
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotOptions;
