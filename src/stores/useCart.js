import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      // Add item to cart
      addItem: (product, quantity = 1, customization = null) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (item) => 
            item.id === product._id && 
            JSON.stringify(item.customization) === JSON.stringify(customization)
        );

        if (existingItemIndex > -1) {
          // Update existing item quantity
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          // Add new item
          const newItem = {
            id: product._id,
            name: product.productName,
            description: product.description,
            price: product.offerPrice,
            originalPrice: product.productMRP,
            image: product.images && product.images.length > 0 ? product.images[0].url : null,
            quantity: quantity,
            customization: customization,
            category: product.productCategory,
            productType: product.productType,
            offerPercentage: product.offerPercentage
          };
          set({ items: [...items, newItem] });
        }

        // Update totals
        get().updateTotals();
      },

      // Remove item from cart
      removeItem: (itemId, customization = null) => {
        const items = get().items.filter(
          (item) => 
            !(item.id === itemId && 
              JSON.stringify(item.customization) === JSON.stringify(customization))
        );
        set({ items });
        get().updateTotals();
      },

      // Update item quantity
      updateQuantity: (itemId, quantity, customization = null) => {
        if (quantity <= 0) {
          get().removeItem(itemId, customization);
          return;
        }

        const items = get().items.map((item) =>
          item.id === itemId && 
          JSON.stringify(item.customization) === JSON.stringify(customization)
            ? { ...item, quantity }
            : item
        );
        set({ items });
        get().updateTotals();
      },

      // Clear entire cart
      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },

      // Update totals
      updateTotals: () => {
        const items = get().items;
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        set({ totalItems, totalPrice: Math.round(totalPrice * 100) / 100 }); // Round to 2 decimal places
      },

      // Get cart summary for WhatsApp
      getCartSummary: () => {
        const items = get().items;
        const { totalItems, totalPrice } = get();
        const safeTotal = totalPrice || 0;
        
        return {
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: parseFloat(item.price) || 0,
            total: Math.round((parseFloat(item.price) || 0) * item.quantity * 100) / 100,
            customization: item.customization
          })),
          totalItems: totalItems || 0,
          totalPrice: safeTotal,
          deliveryCharge: safeTotal > 500 ? 0 : 50, // Free delivery above ₹500
          finalTotal: Math.round((safeTotal + (safeTotal > 500 ? 0 : 50)) * 100) / 100
        };
      }
    }),
    {
      name: "efta-cart-storage",
      partialize: (state) => ({ 
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice 
      }),
    }
  )
);
