'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
  ShoppingCart,
  Star,
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  X,
  Minus,
  Plus,
  Trash2,
} from 'lucide-react';

// ======================================================
// BuyNix Storefront Products
// ======================================================

const MOCK_PRODUCTS = [
  {
    _id: '1',
    name: 'Modern Ceramic Minimalist Vase',
    category: 'Home Decor',
    price: 1499,
    compareAtPrice: 1999,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&q=80&w=600',
      },
    ],
    vendor: {
      storeName: 'Artisan Living',
    },
    ratings: 4.8,
  },

  {
    _id: '2',
    name: 'Smart Electric Air Fryer 4.5L',
    category: 'Kitchen Appliances',
    price: 5899,
    compareAtPrice: 6999,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600',
      },
    ],
    vendor: {
      storeName: 'HomeChef BD',
    },
    ratings: 4.9,
  },

  {
    _id: '3',
    name: 'Nordic Wooden Wall Clock',
    category: 'Home Decor',
    price: 899,
    compareAtPrice: 1200,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=600',
      },
    ],
    vendor: {
      storeName: 'DecorCraft',
    },
    ratings: 4.6,
  },

  {
    _id: '4',
    name: 'Stainless Steel Blender & Grinder',
    category: 'Kitchen Appliances',
    price: 3499,
    compareAtPrice: 4200,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1570222094114-d074f7eec4e4?auto=format&fit=crop&q=80&w=600',
      },
    ],
    vendor: {
      storeName: 'KitchenPro',
    },
    ratings: 4.7,
  },
];

// ======================================================
// Home Component
// ======================================================

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [selectedCategory, setSelectedCategory] =
    useState('All');

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [cartItems, setCartItems] = useState<any[]>([]);

  const [notification, setNotification] =
    useState('');

  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: '', phone: '', email: '', city: '', area: '', address: '',
    paymentMethod: 'Cash on Delivery',
  });

  // ======================================================
  // ADD TO CART
  // ======================================================

  const handleAddToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item._id === product._id
      );

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0].url,
          quantity: 1,
        },
      ];
    });

    // Cart count
    setCartCount((prev) => prev + 1);

    // Green popup
    setNotification(
      `Successfully added "${product.name}" to cart!`
    );

    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  // ======================================================
  // INCREASE QUANTITY
  // ======================================================

  const increaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );

    setCartCount((prev) => prev + 1);
  };

  // ======================================================
  // DECREASE QUANTITY
  // ======================================================

  const decreaseQuantity = (id: string) => {
    const item = cartItems.find(
      (cartItem) => cartItem._id === id
    );

    if (!item) return;

    if (item.quantity === 1) {
      removeFromCart(id);
      return;
    }

    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem._id === id
          ? {
              ...cartItem,
              quantity: cartItem.quantity - 1,
            }
          : cartItem
      )
    );

    setCartCount((prev) =>
      Math.max(prev - 1, 0)
    );
  };

  // ======================================================
  // REMOVE FROM CART
  // ======================================================

  const removeFromCart = (id: string) => {
    const item = cartItems.find(
      (cartItem) => cartItem._id === id
    );

    if (!item) return;

    setCartItems((prev) =>
      prev.filter(
        (cartItem) => cartItem._id !== id
      )
    );

    setCartCount((prev) =>
      Math.max(prev - item.quantity, 0)
    );
  };

  // ======================================================
  // CLEAR CART
  // ======================================================

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
  };

  // ======================================================
  // ======================================================
  // CHECKOUT
  // ======================================================

  const openCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCartOpen(false);
    setOrderPlaced(false);
    setShowCheckout(true);
  };

  const placeOrder = () => {
    if (!checkoutData.name.trim() || !checkoutData.phone.trim() || !checkoutData.city.trim() || !checkoutData.area.trim() || !checkoutData.address.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    setOrderPlaced(true);
  };

  const finishOrder = () => {
    setShowCheckout(false);
    setOrderPlaced(false);
    clearCart();
    setCheckoutData({ name: '', phone: '', email: '', city: '', area: '', address: '', paymentMethod: 'Cash on Delivery' });
  };

  // FILTER PRODUCTS
  // ======================================================

  const filteredProducts =
    selectedCategory === 'All'
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter(
          (product) =>
            product.category === selectedCategory
        );

  // ======================================================
  // TOTAL PRICE
  // ======================================================

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* ==================================================
          GREEN SUCCESS POPUP
      ================================================== */}

      {notification && (
        <div className="fixed bottom-6 right-6 z-[10000]">
          <div className="flex items-center gap-3 bg-green-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl w-[330px] max-w-[calc(100vw-32px)]">

            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <ShoppingCart size={18} />
            </div>

            <div className="min-w-0">
              <p className="font-bold text-sm">
                Added to Cart
              </p>

              <p className="text-xs text-green-100 truncate">
                {notification}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ==================================================
          HERO SECTION
      ================================================== */}

      <section className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white py-10 px-4 sm:px-8">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="max-w-xl space-y-3">

            <span className="bg-indigo-500/30 text-indigo-300 text-[11px] font-semibold px-3 py-1 rounded-full border border-indigo-400/30 uppercase tracking-wider">
              Multi-Vendor Marketplace
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Elevate Your Home & Kitchen with{' '}
              <span className="text-indigo-400">
                BuyNix
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base">
              Discover unique home decor pieces and
              advanced kitchen appliances directly from
              verified local vendors.
            </p>

            <div className="pt-1 flex items-center gap-3">

              <Link
                href="#products"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-full shadow-lg transition-all flex items-center gap-2 text-sm"
              >
                Shop Now
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/vendor/register"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-full backdrop-blur-sm transition-all border border-white/20 text-sm"
              >
                Register as Vendor
              </Link>

            </div>

          </div>

          <div className="w-full md:w-5/12 flex justify-center">

            <img
              src="https://images.unsplash.com/photo-1556911225-e15b29be8c8f?auto=format&fit=crop&q=80&w=600"
              alt="BuyNix Showcase"
              className="rounded-2xl shadow-xl object-cover h-56 sm:h-72 w-full max-w-md border-4 border-white/10"
            />

          </div>

        </div>

      </section>

      {/* ==================================================
          FEATURES
      ================================================== */}

      <section className="bg-white border-b border-gray-100 py-6 px-4">

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Fast Delivery */}

          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">

            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Truck size={24} />
            </div>

            <div>
              <h3 className="font-bold text-gray-900">
                Fast Delivery
              </h3>

              <p className="text-xs text-gray-500">
                Reliable delivery across the country
              </p>
            </div>

          </div>

          {/* Verified Vendors */}

          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">

            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h3 className="font-bold text-gray-900">
                Verified Vendors
              </h3>

              <p className="text-xs text-gray-500">
                Trusted NID & Trade License verified stores
              </p>
            </div>

          </div>

          {/* Support */}

          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">

            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Headphones size={24} />
            </div>

            <div>
              <h3 className="font-bold text-gray-900">
                24/7 Support
              </h3>

              <p className="text-xs text-gray-500">
                Dedicated customer care service
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          PRODUCTS SECTION
      ================================================== */}

      <section
        id="products"
        className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex-1 w-full"
      >

        {/* Header */}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">

          <div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Explore Marketplace Products
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Browse items from Home Decor & Kitchen
              Appliances categories
            </p>

          </div>

          {/* Category Tabs */}

          <div className="flex items-center gap-2 bg-gray-200/70 p-1.5 rounded-xl text-sm font-medium">

            <button
              onClick={() =>
                setSelectedCategory('All')
              }
              className={`px-4 py-1.5 rounded-lg transition-all ${
                selectedCategory === 'All'
                  ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All
            </button>

            <button
              onClick={() =>
                setSelectedCategory('Home Decor')
              }
              className={`px-4 py-1.5 rounded-lg transition-all ${
                selectedCategory === 'Home Decor'
                  ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home Decor
            </button>

            <button
              onClick={() =>
                setSelectedCategory(
                  'Kitchen Appliances'
                )
              }
              className={`px-4 py-1.5 rounded-lg transition-all ${
                selectedCategory ===
                'Kitchen Appliances'
                  ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Kitchen Appliances
            </button>

          </div>

        </div>

        {/* ==================================================
            PRODUCT GRID
        ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {filteredProducts.map((product) => (

            <div
              key={product._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
            >

              {/* Image */}

              <div className="relative h-52 bg-gray-100 overflow-hidden group">

                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-indigo-600 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {product.category}
                </span>

              </div>

              {/* Product Details */}

              <div className="p-4 flex flex-col flex-1">

                <span className="text-xs text-gray-500 font-medium mb-1">
                  Store: {product.vendor.storeName}
                </span>

                <h3 className="font-bold text-gray-900 text-base line-clamp-1 mb-1">
                  {product.name}
                </h3>

                {/* Rating */}

                <div className="flex items-center gap-1 text-amber-500 text-xs mb-3 font-semibold">

                  <Star
                    size={14}
                    fill="currentColor"
                  />

                  <span>
                    {product.ratings}
                  </span>

                </div>

                {/* Price */}

                <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">

                  <div>

                    <span className="text-lg font-extrabold text-indigo-600">
                      ৳{product.price}
                    </span>

                    {product.compareAtPrice >
                      product.price && (
                      <span className="text-xs text-gray-400 line-through ml-2">
                        ৳{product.compareAtPrice}
                      </span>
                    )}

                  </div>

                  {/* Add To Cart */}

                  <button
                    onClick={() =>
                      handleAddToCart(product)
                    }
                    className="p-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl transition-colors shadow-sm"
                    title="Add to Cart"
                  >
                    <ShoppingCart size={18} />
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* ==================================================
          CART DRAWER
      ================================================== */}

      {isCartOpen && (

        <div className="fixed inset-0 z-[9998]">

          {/* Overlay */}

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() =>
              setIsCartOpen(false)
            }
          />

          {/* Drawer */}

          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">

            {/* Cart Header */}

            <div className="flex items-center justify-between px-5 py-4 border-b">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Shopping Cart
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  {cartCount} item
                  {cartCount !== 1 ? 's' : ''}
                </p>

              </div>

              <button
                onClick={() =>
                  setIsCartOpen(false)
                }
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <X size={19} />
              </button>

            </div>

            {/* Cart Body */}

            <div className="flex-1 overflow-y-auto p-5">

              {cartItems.length === 0 ? (

                <div className="h-full flex flex-col items-center justify-center text-center">

                  <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                    <ShoppingCart size={28} />
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg">
                    Your cart is empty
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Add products to your cart to see them here.
                  </p>

                  <button
                    onClick={() =>
                      setIsCartOpen(false)
                    }
                    className="mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold"
                  >
                    Continue Shopping
                  </button>

                </div>

              ) : (

                <div className="space-y-4">

                  {cartItems.map((item) => (

                    <div
                      key={item._id}
                      className="flex gap-3 p-3 border border-gray-100 rounded-xl"
                    >

                      {/* Image */}

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                      />

                      {/* Details */}

                      <div className="flex-1 min-w-0">

                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                          {item.name}
                        </h3>

                        <p className="text-indigo-600 font-bold mt-1">
                          ৳{item.price}
                        </p>

                        {/* Quantity */}

                        <div className="flex items-center gap-2 mt-2">

                          <button
                            onClick={() =>
                              decreaseQuantity(item._id)
                            }
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-7 text-center text-sm font-bold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              increaseQuantity(item._id)
                            }
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Plus size={14} />
                          </button>

                        </div>

                      </div>

                      {/* Remove */}

                      <button
                        onClick={() =>
                          removeFromCart(item._id)
                        }
                        className="text-gray-400 hover:text-red-500 self-start"
                        title="Remove"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* Cart Footer */}

            {cartItems.length > 0 && (

              <div className="border-t bg-gray-50 p-5">

                <div className="flex items-center justify-between mb-4">

                  <span className="text-gray-600 font-medium">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold text-indigo-600">
                    ৳{cartTotal}
                  </span>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    onClick={clearCart}
                    className="py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 font-semibold text-gray-700"
                  >
                    Clear Cart
                  </button>

                  <button
                    onClick={openCheckout}
                    className="py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                  >
                    Checkout
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      )}
      {/* ==================================================
          CHECKOUT MODAL
      ================================================== */}

      {showCheckout && (
        <div className="fixed inset-0 z-[20000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl my-6 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div><h2 className="text-2xl font-bold text-gray-900">Checkout</h2><p className="text-sm text-gray-500 mt-1">Complete your delivery and payment details</p></div>
              <button onClick={() => setShowCheckout(false)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"><X size={20} /></button>
            </div>

            {orderPlaced ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-5"><span className="text-4xl font-bold">✓</span></div>
                <h2 className="text-3xl font-extrabold text-gray-900">Order placed successfully!</h2>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">Thank you, {checkoutData.name}. Your order has been received. We will contact you at {checkoutData.phone}.</p>
                <div className="mt-7 inline-block bg-gray-50 rounded-2xl px-6 py-4 text-left"><p className="text-sm text-gray-500">Order Total</p><p className="text-2xl font-extrabold text-indigo-600">৳{cartTotal}</p><p className="text-sm text-gray-500 mt-1">Payment: {checkoutData.paymentMethod}</p></div>
                <div><button onClick={finishOrder} className="mt-7 px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold">Continue Shopping</button></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="border border-gray-100 rounded-2xl p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input value={checkoutData.name} onChange={(e) => setCheckoutData({ ...checkoutData, name: e.target.value })} placeholder="Enter your full name" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label><input type="tel" value={checkoutData.phone} onChange={(e) => setCheckoutData({ ...checkoutData, phone: e.target.value })} placeholder="01XXXXXXXXX" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                      <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={checkoutData.email} onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })} placeholder="example@email.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                    </div>
                  </div>
                  <div className="border border-gray-100 rounded-2xl p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">City / District *</label><input value={checkoutData.city} onChange={(e) => setCheckoutData({ ...checkoutData, city: e.target.value })} placeholder="District" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-1">Area / Upazila *</label><input value={checkoutData.area} onChange={(e) => setCheckoutData({ ...checkoutData, area: e.target.value })} placeholder="Upazila / Area" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                      <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label><textarea rows={4} value={checkoutData.address} onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })} placeholder="House, Road, Village, Market, Landmark..." className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 resize-none" /></div>
                    </div>
                  </div>
                  <div className="border border-gray-100 rounded-2xl p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
                    <div className="space-y-3">
                      {['Cash on Delivery', 'bKash', 'Nagad'].map((method) => (
                        <label key={method} className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition ${checkoutData.paymentMethod === method ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <input type="radio" name="paymentMethod" value={method} checked={checkoutData.paymentMethod === method} onChange={(e) => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })} />
                          <div><p className="font-semibold text-gray-900">{method}</p><p className="text-sm text-gray-500">{method === 'Cash on Delivery' ? 'Pay when your order arrives' : `${method} payment`}</p></div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <div className="border border-gray-100 rounded-2xl p-5 lg:sticky lg:top-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-4 max-h-72 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item._id} className="flex gap-3">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
                          <div className="flex-1 min-w-0"><p className="font-medium text-sm text-gray-900 line-clamp-2">{item.name}</p><p className="text-sm text-gray-500">Qty: {item.quantity}</p></div>
                          <p className="font-semibold text-sm whitespace-nowrap">৳{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 mt-5 pt-5 space-y-3">
                      <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>৳{cartTotal}</span></div>
                      <div className="flex justify-between text-gray-600"><span>Delivery</span><span>Free</span></div>
                      <div className="border-t border-gray-100 pt-3 flex justify-between"><span className="font-bold text-gray-900">Total</span><span className="text-xl font-bold text-indigo-600">৳{cartTotal}</span></div>
                    </div>
                    <button onClick={placeOrder} className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition">Place Order · ৳{cartTotal}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
