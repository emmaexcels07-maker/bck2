"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "./store/cart.store";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  // Guard against server/client hydration mismatches when reading stored cart state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalPrice = items.reduce(
    (acc, item) => acc + (item.product.price || 0) * item.quantity,
    0
  );

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  const handleQuantityChange = (productId: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQty);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight">Your Shopping Cart</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isMounted ? `${items.length} unique ${items.length === 1 ? 'item' : 'items'}` : 'Loading...'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {!isMounted || items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                    Your cart is empty
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-xl transition-colors"
                  >
                    Start Browsing
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const imageSrc = item.product.images?.[0] || "/placeholder.png";

                  return (
                    <div
                      key={item.product._id}
                      className="flex gap-4 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                        <Image
                          src={imageSrc}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm line-clamp-1">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.product._id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1 -mr-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                          ${(item.product.price || 0).toFixed(2)}
                        </p>

                        {/* Custom Quantity Controls */}
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.product._id, item.quantity, -1)
                              }
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-l-lg transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.product._id, item.quantity, 1)
                              }
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-r-lg transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-xs text-slate-400">
                            Subtotal: ${((item.product.price || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Actions */}
            {isMounted && items.length > 0 && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Taxes & Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>Total Amount</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Checkout Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}