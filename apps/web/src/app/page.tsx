'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AnimatedContainer, { StaggerContainer, StaggerItem, Float, Pulse } from '@/components/AnimatedContainer';
import { useCart } from '@/store/cart';
import { useProductStore, type Product } from '@/store/useProductStore';

const categories = [
  { id: 1, icon: '📱', name: 'Mobiles' },
  { id: 2, icon: '💻', name: 'Laptops' },
  { id: 3, icon: '🎧', name: 'Audio' },
  { id: 4, icon: '👟', name: 'Fashion' },
  { id: 5, icon: '🏠', name: 'Home' },
  { id: 6, icon: '🎮', name: 'Gaming' },
  { id: 7, icon: '📷', name: 'Cameras' },
  { id: 8, icon: '⌚', name: 'Watches' },
];

export default function HomePage() {
  const router = useRouter();
  const addToCart = useCart((state) => state.addItem);
  const { products } = useProductStore();
  const [displayProducts, setDisplayProducts] = useState(products.slice(0, 4));
  const [stats, setStats] = useState({ count: 0, rating: 4.9, customers: 0 });
  const [countdown, setCountdown] = useState({ hours: 8, minutes: 24, seconds: 17 });
  const [activeCategory, setActiveCategory] = useState(0);

  // Load products from store
  useEffect(() => {
    setDisplayProducts(products.slice(0, 4));
  }, [products]);

  // Animate stats on mount
  useEffect(() => {
    const animateStats = () => {
      setStats((prev) => ({
        ...prev,
        count: Math.min(prev.count + 50, 50),
        customers: Math.min(prev.customers + 0.2, 2),
      }));
    };

    const interval = setTimeout(animateStats, 50);
    return () => clearTimeout(interval);
  }, [stats.count]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product.id, product.name, product.price, product.image, 1);
    // Redirect to checkout cart page
    router.push('/checkout/cart');
  };

  const formatNumber = (num: number) => String(Math.floor(num)).padStart(2, '0');

  return (
    <div className="overflow-hidden">
      {/* PROMO STRIP */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-[length:200%_auto] animate-pulse text-white text-center py-3 text-sm font-medium"
      >
        🚀 Free shipping on orders above ₹999 | ✦ Use code AIRCART20 for 20% off | ⚡ Flash Sale live now
      </motion.div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-between px-4 sm:px-8 pt-16 overflow-hidden">
        {/* Background blobs */}
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/10 blur-3xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          style={{ pointerEvents: 'none' }}
        />
        <motion.div
          className="absolute left-0 bottom-0 w-72 h-72 rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent blur-3xl"
          animate={{ scale: [1, 1.08, 1], rotate: [0, -8, 0] }}
          transition={{ duration: 11, repeat: Infinity, repeatType: 'reverse' }}
          style={{ pointerEvents: 'none' }}
        />

        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10 max-w-7xl mx-auto w-full">
          {/* Content */}
          <div>
            <AnimatedContainer variant="slideRight" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 mb-6 w-fit">
                <Pulse>
                  <span className="w-2 h-2 bg-blue-400 rounded-full" />
                </Pulse>
                <span className="text-sm font-semibold text-blue-300">New Collection 2025</span>
              </div>
            </AnimatedContainer>

            <AnimatedContainer variant="slideRight" delay={0.2}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                <div>Shop Smarter,</div>
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Fly Higher.</div>
              </h1>
            </AnimatedContainer>

            <AnimatedContainer variant="fadeUp" delay={0.3}>
              <p className="text-lg text-slate-300 mb-8 max-w-md leading-relaxed">
                Discover thousands of curated products delivered straight to your door — with unbeatable prices.
              </p>
            </AnimatedContainer>

            <AnimatedContainer variant="fadeUp" delay={0.4}>
              <div className="flex gap-4 mb-12 flex-wrap">
                <Link
                  href="/products"
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all hover:shadow-lg hover:shadow-blue-500/30"
                >
                  Shop Now →
                </Link>
                <Link
                  href="/products?featured=true"
                  className="px-8 py-3 border border-slate-500 text-white rounded-xl font-semibold hover:border-cyan-400 hover:bg-cyan-500/10 transition-all"
                >
                  View Deals
                </Link>
              </div>
            </AnimatedContainer>

            {/* Stats */}
            <AnimatedContainer variant="fadeUp" delay={0.5}>
              <div className="flex gap-6 flex-wrap">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-6 py-3 backdrop-blur">
                  <div className="text-2xl font-bold text-white">{stats.count}K+</div>
                  <div className="text-xs text-slate-400 mt-1">Products</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-6 py-3 backdrop-blur">
                  <div className="text-2xl font-bold text-white">{stats.rating}★</div>
                  <div className="text-xs text-slate-400 mt-1">Rating</div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-6 py-3 backdrop-blur">
                  <div className="text-2xl font-bold text-white">{stats.customers}M+</div>
                  <div className="text-xs text-slate-400 mt-1">Customers</div>
                </div>
              </div>
            </AnimatedContainer>
          </div>


        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-4 sm:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <AnimatedContainer variant="fadeUp">
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white mb-2">Browse by Category</h2>
              <p className="text-slate-400">Find exactly what you're looking for</p>
            </div>
          </AnimatedContainer>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat, idx) => (
              <StaggerItem key={cat.id}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -4 }}
                  onClick={() => setActiveCategory(idx)}
                  className={`p-4 rounded-xl border transition-all text-center h-full ${
                    activeCategory === idx
                      ? 'bg-blue-500/20 border-blue-500 bg-opacity-10'
                      : 'bg-slate-800 border-slate-700 hover:border-blue-500/50 hover:bg-slate-700'
                  }`}
                >
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <div className="text-xs font-medium text-slate-200">{cat.name}</div>
                </motion.button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="px-4 sm:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <AnimatedContainer variant="fadeUp">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Featured Products</h2>
                <p className="text-slate-400">Curated picks just for you</p>
              </div>
              <Link href="/products" className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm">
                View All →
              </Link>
            </div>
          </AnimatedContainer>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.length === 0 ? (
              // Placeholder products if none loaded
              [...Array(4)].map((_, i) => (
                <StaggerItem key={i}>
                  <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-500 transition-all cursor-pointer group">
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 h-48 flex items-center justify-center">
                      <div className="text-5xl animate-pulse">📦</div>
                    </div>
                    <div className="p-4">
                      <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-slate-700 rounded w-1/2" />
                    </div>
                  </div>
                </StaggerItem>
              ))
            ) : (
              displayProducts.map((product, idx) => (
                <StaggerItem key={product.id}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-cyan-500 transition-all cursor-pointer group"
                  >
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 h-48 flex items-center justify-center relative">
                      <span className="text-5xl">📦</span>
                      {product.originalPrice && (
                        <div className="absolute top-4 left-4 bg-cyan-500 text-white px-2 py-1 rounded text-xs font-bold">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                      <p className="text-xs text-slate-400 mb-3">{product.description}</p>
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-bold text-cyan-400">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))
            )}
          </StaggerContainer>
        </div>
      </section>

      {/* PROMO BANNER */}
      <AnimatedContainer className="mx-4 sm:mx-8 my-20">
        <section className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">⚡ Flash Sale — Up to 60% Off</h2>
            <p className="text-slate-400">Limited time offer. Grab the best deals before they're gone.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {[
                { label: 'HRS', value: countdown.hours },
                { label: 'MIN', value: countdown.minutes },
                { label: 'SEC', value: countdown.seconds },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-center min-w-[60px]">
                    <motion.div key={`${item.value}-${idx}`} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                      <div className="text-2xl font-bold text-cyan-400">{formatNumber(item.value)}</div>
                      <div className="text-xs text-slate-400 mt-1">{item.label}</div>
                    </motion.div>
                  </div>
                  {idx < 2 && <div className="text-2xl font-bold text-cyan-400 mx-1">:</div>}
                </div>
              ))}
            </div>
            <Link
              href="/products?featured=true"
              className="px-6 py-2 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-all whitespace-nowrap"
            >
              Grab Deals →
            </Link>
          </div>
        </section>
      </AnimatedContainer>

      {/* TRUST BADGES */}
      <section className="px-4 sm:px-8 py-16 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-8">
          {[
            { icon: '🚚', title: 'Free Delivery', subtitle: 'On orders above ₹999' },
            { icon: '🔄', title: 'Easy Returns', subtitle: '30-day return policy' },
            { icon: '🔒', title: 'Secure Payment', subtitle: '256-bit SSL encryption' },
            { icon: '🎁', title: 'Gift Wrapping', subtitle: 'Available on all items' },
            { icon: '💬', title: '24/7 Support', subtitle: 'Chat, call, or email' },
          ].map((item, idx) => (
            <AnimatedContainer key={idx} variant="fadeUp" delay={idx * 0.1}>
              <div className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="font-semibold text-white text-sm md:text-base">{item.title}</p>
                <p className="text-xs text-slate-400">{item.subtitle}</p>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </section>
    </div>
  );
}

