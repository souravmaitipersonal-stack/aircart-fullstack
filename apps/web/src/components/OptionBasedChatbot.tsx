/**
 * Option-Based Chatbot Component
 * Users select from predefined options instead of typing
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageOption {
  id: string;
  text: string;
  nextOptions?: MessageOption[];
  action?: () => void;
}

const chatflowOptions: MessageOption = {
  id: 'root',
  text: 'How can I help you today?',
  nextOptions: [
    {
      id: 'products',
      text: '🛍️ Browse Products',
      nextOptions: [
        {
          id: 'categories',
          text: '📂 View Categories',
          nextOptions: [
            { id: 'mobiles', text: '📱 Mobile Phones' },
            { id: 'laptops', text: '💻 Laptops' },
            { id: 'audio', text: '🎧 Audio Devices' },
            { id: 'gaming', text: '🎮 Gaming' },
          ],
        },
        {
          id: 'search',
          text: '🔍 Search by Name',
        },
        {
          id: 'featured',
          text: '⭐ Featured Products',
        },
      ],
    },
    {
      id: 'orders',
      text: '📦 Track Orders',
      nextOptions: [
        {
          id: 'recent',
          text: '⏱️ Recent Orders',
        },
        {
          id: 'history',
          text: '📜 Order History',
        },
      ],
    },
    {
      id: 'support',
      text: '❓ Get Help',
      nextOptions: [
        {
          id: 'returns',
          text: '↩️ Returns & Refunds',
        },
        {
          id: 'shipping',
          text: '🚚 Shipping Info',
        },
        {
          id: 'payment',
          text: '💳 Payment Issues',
        },
        {
          id: 'contact',
          text: '📞 Contact Support',
        },
      ],
    },
  ],
};

export default function OptionBasedChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ type: 'bot' | 'user'; text: string }>
  >([
    { type: 'bot', text: 'Welcome to AirCart! How can I help you?' },
  ]);
  const [currentOptions, setCurrentOptions] = useState<MessageOption[]>(
    chatflowOptions.nextOptions || []
  );
  const [conversationStack, setConversationStack] = useState<MessageOption[]>([
    chatflowOptions,
  ]);

  const handleOptionClick = (option: MessageOption) => {
    // Add user message
    setMessages((prev) => [...prev, { type: 'user', text: option.text }]);

    // Add bot response after delay
   setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: getBotResponse(option.id),
        },
      ]);

      // Update options for next level
      if (option.nextOptions && option.nextOptions.length > 0) {
        setCurrentOptions(option.nextOptions);
        setConversationStack((prev) => [...prev, option]);
      } else {
        // Leaf node - show back button
        setCurrentOptions([
          {
            id: 'back',
            text: '↩️ Back',
          },
        ]);
      }
    }, 500);
  };

  const handleBack = () => {
    if (conversationStack.length > 1) {
      const newStack = conversationStack.slice(0, -1);
      const previousNode = newStack[newStack.length - 1];

      setMessages((prev) => [
        ...prev,
        { type: 'user', text: '↩️ Back' },
        {
          type: 'bot',
          text: previousNode.text,
        },
      ]);

      setConversationStack(newStack);
      setCurrentOptions(previousNode.nextOptions || []);
    }
  };

  const getBotResponse = (optionId: string): string => {
    const responses: Record<string, string> = {
      categories: 'Select a category to explore products.',
      mobiles: '📱 Showing mobile phones. Great choices available!',
      laptops: '💻 Premium laptops for work and gaming.',
      audio: '🎧 High-quality audio devices.',
      gaming: '🎮 Latest gaming consoles and accessories.',
      search: '🔍 Enter a product name to search.',
      featured: '⭐ Check out our most popular products!',
      recent: '📦 You have 0 recent orders.',
      history: '📜 Your order history is empty. Start shopping!',
      returns: '↩️ Returns accepted within 30 days of purchase.',
      shipping: '🚚 Free shipping on orders above ₹500. Delivery in 3-5 days.',
      payment: '💳 We accept all major credit cards, debit cards, and PayPal.',
      contact: '📞 Contact us at support@aircart.com or call 1-800-555-0100',
      products: '🛍️ Browse our collection below...',
      orders: '📦 Manage your orders...',
      support: '❓ We are here to help...',
    };

    return responses[optionId] || 'How else can I assist you?';
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-2xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? '✕' : '💬'}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 z-40 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 text-white">
              <h3 className="font-bold text-lg">AirCart Assistant</h3>
              <p className="text-sm text-cyan-100">Online • Always ready to help</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 bg-slate-900/50">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.type === 'bot'
                        ? 'bg-slate-700 text-slate-100'
                        : 'bg-cyan-600 text-white'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Options */}
            <div className="p-4 bg-slate-800 border-t border-slate-700 space-y-2 max-h-40 overflow-y-auto">
              {currentOptions.length > 0 ? (
                currentOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() =>
                      option.id === 'back' ? handleBack() : handleOptionClick(option)
                    }
                    whileHover={{ x: 4 }}
                    className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    {option.text}
                  </motion.button>
                ))
              ) : (
                <p className="text-slate-400 text-sm italic">Loading options...</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
