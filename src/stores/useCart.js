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
          // Calculate the correct final price based on offer type
          let finalPrice = product.productMRP;
          
          // Use pre-calculated price if available (from ProductDetails)
          if (product.calculatedFinalPrice && !isNaN(product.calculatedFinalPrice)) {
            finalPrice = product.calculatedFinalPrice;
          } else if (product.offerType === 'percentage' && product.offerPercentage) {
            finalPrice = product.productMRP - (product.productMRP * product.offerPercentage / 100);
          } else if (product.offerType === 'price' && product.offerPrice) {
            finalPrice = product.offerPrice;
          }

          // Ensure finalPrice is a valid number
          if (isNaN(finalPrice) || finalPrice <= 0) {
            finalPrice = product.productMRP || 0;
          }

          // Add new item
          const newItem = {
            id: product._id,
            productId: product.productId, // Custom admin-created product ID
            name: product.productName,
            description: product.description,
            price: finalPrice, // Use calculated final price
            originalPrice: product.productMRP,
            image: product.images && product.images.length > 0 ? product.images[0].url : null,
            quantity: quantity,
            customization: customization,
            category: product.productCategory,
            productType: product.productType,
            offerPercentage: product.offerPercentage || 0
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
        // Ensure quantity is a valid number between 1-100
        const validQuantity = Math.max(1, Math.min(100, parseInt(quantity) || 1));
        
        if (validQuantity <= 0) {
          get().removeItem(itemId, customization);
          return;
        }

        const items = get().items.map((item) =>
          item.id === itemId && 
          JSON.stringify(item.customization) === JSON.stringify(customization)
            ? { ...item, quantity: validQuantity }
            : item
        );
        set({ items });
        get().updateTotals();
      },

      // Clear entire cart
      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },
      
      // Force recalculation of totals (useful after updates)
      recalculateTotals: () => {
        get().updateTotals();
      },

      // Clean up any invalid cart items (useful for fixing existing carts)
      cleanUpCart: () => {
        const items = get().items.map(item => {
          let cleanPrice = parseFloat(item.price);
          // Only fix actually invalid prices (NaN or negative), preserve zero and positive prices
          if (isNaN(cleanPrice) || cleanPrice < 0) {
            // Try to recalculate price from item data
            if (item.originalPrice && parseFloat(item.originalPrice) > 0) {
              cleanPrice = parseFloat(item.originalPrice);
              console.log(`🔧 Fixed invalid price for ${item.name}: NaN/negative → ₹${cleanPrice}`);
            } else {
              cleanPrice = 0;
              console.log(`⚠️ Could not fix price for ${item.name}, setting to 0`);
            }
          }
          
          return {
            ...item,
            price: cleanPrice,
            originalPrice: parseFloat(item.originalPrice) || cleanPrice
          };
        }).filter(item => item.price >= 0); // Remove items with invalid prices that couldn't be fixed
        
        set({ items });
        get().updateTotals();
      },

      // Calculate item total with consistent rounding
      calculateItemTotal: (price, quantity) => {
        return Math.round((parseFloat(price) || 0) * quantity * 100) / 100;
      },

      // Calculate delivery charge
      calculateDeliveryCharge: (subtotal) => {
        return subtotal > 500 ? 0 : 50;
      },

      // Calculate final total with delivery
      calculateFinalTotal: (subtotal, deliveryCharge) => {
        return Math.round((subtotal + deliveryCharge) * 100) / 100;
      },

      // Update totals
      updateTotals: () => {
        const items = get().items;
        const { calculateItemTotal } = get();
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        // Calculate total by summing individual item totals for consistency
        const totalPrice = items.reduce((sum, item) => {
          const itemTotal = calculateItemTotal(item.price, item.quantity);
          return sum + itemTotal;
        }, 0);
        set({ totalItems, totalPrice: Math.round(totalPrice * 100) / 100 }); // Round to 2 decimal places
      },

      // Get cart summary for WhatsApp
      getCartSummary: () => {
        const items = get().items;
        const { totalItems, totalPrice, calculateItemTotal, calculateDeliveryCharge, calculateFinalTotal } = get();
        const safeTotal = totalPrice || 0;
        const deliveryCharge = calculateDeliveryCharge(safeTotal);
        const finalTotal = calculateFinalTotal(safeTotal, deliveryCharge);
        
        return {
          items: items.map(item => ({
            id: item.id,
            productId: item.productId, // Include custom product ID
            name: item.name,
            description: item.description || '',
            price: parseFloat(item.price) || 0,
            originalPrice: parseFloat(item.originalPrice) || 0,
            quantity: item.quantity,
            total: calculateItemTotal(item.price, item.quantity),
            image: item.image || '',
            customization: item.customization,
            offerPercentage: item.offerPercentage || 0
          })),
          totalItems: totalItems || 0,
          totalPrice: safeTotal,
          deliveryCharge: deliveryCharge,
          finalTotal: finalTotal
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
