export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-900 text-white py-20">
        <div className="container-wide text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Welcome to AirCart</h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8">
            E-Commerce, Elevated. Shop premium products with confidence.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/products" className="btn btn-primary bg-white text-primary-600 hover:bg-primary-50">
              Browse Products
            </a>
            <a href="#features" className="btn btn-secondary border-2 border-white text-white hover:bg-white hover:text-primary-600">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container-wide">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose AirCart?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="text-2xl font-bold mb-3">Easy Shopping</h3>
              <p className="text-neutral-600">
                Browse thousands of products with advanced filters and search. Simple checkout process.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-3">Secure Payments</h3>
              <p className="text-neutral-600">
                Your transactions are protected with industry-standard security and PayPal integration.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-neutral-600">
                Track your orders in real-time. Fast shipping with transparent status updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="py-20 bg-accent-50">
        <div className="container-wide">
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Special Launch Offer</h2>
            <p className="text-xl mb-8">Coming Soon - Phase 2 Features</p>
            <p className="text-lg">
              Sign up to be notified when we launch advanced features like wishlists, reviews, and more!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="container-wide text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Shop?</h2>
          <p className="text-xl text-neutral-300 mb-8">
            Start exploring our curated collection of premium products.
          </p>
          <a href="/products" className="btn btn-primary bg-accent-500 hover:bg-accent-600">
            Explore Products
          </a>
        </div>
      </section>
    </div>
  );
}
