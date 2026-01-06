"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

const CartContext = createContext();

export function CartProvider({ children }) {
 const [cart, setCart] = useState(() => {
  if (typeof window === "undefined") return [];
  try {
   const savedCart = localStorage.getItem("cart");
   return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
   return [];
  }
 });

 const [favorites, setFavorites] = useState(() => {
  if (typeof window === "undefined") return [];
  try {
   const savedFavorites = localStorage.getItem("favorites");
   return savedFavorites ? JSON.parse(savedFavorites) : [];
  } catch (error) {
   return [];
  }
 });

 // Sepet verilerini veritabanından yükle ve senkronize et
 useEffect(() => {
  if (typeof window === "undefined") return;

  let isFetching = false;
  let lastFetchTime = 0;
  const FETCH_COOLDOWN = 5000;

  const syncCartWithDB = async () => {
   const now = Date.now();
   if (isFetching || (now - lastFetchTime < FETCH_COOLDOWN)) {
    return;
   }

   isFetching = true;
   lastFetchTime = now;

   try {
    // LocalStorage'dan sepet verilerini al
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const localCartIds = localCart
     .map(item => {
      const id = item._id || item.id;
      return id ? String(id) : null;
     })
     .filter(Boolean);

    // Veritabanından sepet ID'lerini al
    let dbCartIds = [];
    try {
     const res = await axiosInstance.get("/api/user/cart");
     const data = res.data;

     if (data.success && data.cart && data.cart.length > 0) {
      dbCartIds = data.cart.map(id => String(id)).filter(Boolean);
     }
    } catch (error) {
     // Giriş yapılmamışsa veya hata varsa sadece localStorage'daki verileri veritabanına kaydet
     if (localCartIds.length > 0) {
      try {
       await axiosInstance.put("/api/user/cart", { productIds: localCartIds });
      } catch (putError) {
       // Hata varsa sessizce devam et
      }
     }
     isFetching = false;
     return;
    }

    // Veritabanı ve localStorage'ı birleştir
    const allCartIds = [...new Set([...dbCartIds, ...localCartIds])];

    // Veritabanına senkronize et (tüm ürün ID'lerini gönder)
    if (allCartIds.length > 0 && allCartIds.length !== dbCartIds.length) {
     try {
      await axiosInstance.put("/api/user/cart", { productIds: allCartIds });
     } catch (error) {
      // Hata varsa sessizce devam et
     }
    }
   } catch (error) {
   } finally {
    isFetching = false;
   }
  };

  // Sayfa yüklendiğinde hemen senkronize et
  syncCartWithDB();

  const handleCartStorageChange = (e) => {
   if (e.key === 'cart' || e.key === null) {
    syncCartWithDB();
   }
  };

  const handleCartUpdate = () => {
   syncCartWithDB();
  };

  window.addEventListener("storage", handleCartStorageChange);
  window.addEventListener("cartUpdated", handleCartUpdate);

  return () => {
   window.removeEventListener("storage", handleCartStorageChange);
   window.removeEventListener("cartUpdated", handleCartUpdate);
  };
 }, []);

 useEffect(() => {
  if (typeof window === "undefined") return;

  let isFetching = false;
  let lastFetchTime = 0;
  const FETCH_COOLDOWN = 5000;

  const fetchFavoritesFromDB = async () => {
   const now = Date.now();
   if (isFetching || (now - lastFetchTime < FETCH_COOLDOWN)) {
    return;
   }

   isFetching = true;
   lastFetchTime = now;

   try {
    const productsRes = await axiosInstance.get("/api/products?limit=1000");
    const productsData = productsRes.data;

    const allProducts = productsData.data || productsData.products || [];

    if (!productsData.success || allProducts.length === 0) {
     const localFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
     if (localFavorites.length > 0) {
      setFavorites([]);
      localStorage.removeItem("favorites");
     }
     return;
    }
    const allProductIds = new Set(allProducts.map(p => String(p._id)));

    let dbFavoriteIds = [];
    try {
     const res = await axiosInstance.get("/api/user/favorites");
     const data = res.data;

     if (data.success && data.favorites && data.favorites.length > 0) {
      dbFavoriteIds = data.favorites.map(fav => String(fav._id || fav)).filter(Boolean);
     }
    } catch (error) {
    }

    const localFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const localIds = localFavorites
     .map(fav => {
      const id = fav._id || fav.id;
      return id ? String(id) : null;
     })
     .filter(Boolean);

    const allFavoriteIds = [...new Set([...dbFavoriteIds, ...localIds])];

    const validFavoriteIds = allFavoriteIds.filter(id => allProductIds.has(id));

    const favoriteProducts = allProducts.filter(product =>
     validFavoriteIds.includes(String(product._id))
    );

    setFavorites(prevFavorites => {
     const prevIds = new Set(prevFavorites.map(f => String(f._id || f.id)));
     const newIds = new Set(favoriteProducts.map(f => String(f._id)));

     if (prevIds.size === newIds.size &&
      [...prevIds].every(id => newIds.has(id))) {
      return prevFavorites;
     }

     return favoriteProducts;
    });
   } catch (error) {
   } finally {
    isFetching = false;
   }
  };

  fetchFavoritesFromDB();

  const handleStorageChange = (e) => {
   if (e.key === 'favorites' || e.key === null) {
    fetchFavoritesFromDB();
   }
  };

  const handleFavoritesUpdate = () => {
   fetchFavoritesFromDB();
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener("favoritesUpdated", handleFavoritesUpdate);

  return () => {
   window.removeEventListener("storage", handleStorageChange);
   window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
  };
 }, []);

 const updateCartPrices = async () => {
  if (cart.length === 0) return;

  try {
   const productsRes = await axiosInstance.get("/api/products?limit=1000");
   const productsData = productsRes.data;

   if (!productsData.success) return;

   const allProducts = productsData.data || productsData.products || [];
   if (allProducts.length === 0) return;

   setCart((prevCart) => {
    const updatedCart = prevCart.map((cartItem) => {
     const productId = String(cartItem._id || cartItem.id);
     const currentProduct = allProducts.find((p) => String(p._id) === productId);

     if (currentProduct) {
      return {
       ...cartItem,
       ...currentProduct,
       selectedColor: cartItem.selectedColor,
       quantity: cartItem.quantity,
       addedAt: cartItem.addedAt,
       // Kampanya fiyatını ve bilgilerini koru
       campaignPrice: cartItem.campaignPrice,
       campaignId: cartItem.campaignId,
       campaignTitle: cartItem.campaignTitle,
      };
     }
     return cartItem;
    });

    const hasChanges = prevCart.some((oldItem, index) => {
     const newItem = updatedCart[index];
     if (!newItem) return true;
     
     // Kampanya fiyatı olan ürünlerin fiyatlarını güncelleme
     if (oldItem.campaignPrice) {
      return oldItem.stock !== newItem.stock;
     }
     
     const oldPrice = oldItem.discountPrice && oldItem.discountPrice < oldItem.price
      ? oldItem.discountPrice
      : oldItem.price;
     const newPrice = newItem.discountPrice && newItem.discountPrice < newItem.price
      ? newItem.discountPrice
      : newItem.price;
     return oldPrice !== newPrice || oldItem.stock !== newItem.stock;
    });

    return hasChanges ? updatedCart : prevCart;
   });
  } catch (error) {
  }
 };

 useEffect(() => {
  if (typeof window === "undefined" || cart.length === 0) return;

  const timeoutId = setTimeout(() => {
   updateCartPrices();
  }, 1000);

  const handleVisibilityChange = () => {
   if (!document.hidden) {
    updateCartPrices();
   }
  };

  const handleFocus = () => {
   updateCartPrices();
  };

  const handleCartUpdate = () => {
   updateCartPrices();
  };

  window.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("focus", handleFocus);
  window.addEventListener("cartUpdated", handleCartUpdate);

  return () => {
   clearTimeout(timeoutId);
   window.removeEventListener("visibilitychange", handleVisibilityChange);
   window.removeEventListener("focus", handleFocus);
   window.removeEventListener("cartUpdated", handleCartUpdate);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [cart.length]);

 useEffect(() => {
  if (typeof window === "undefined") return;
  if (cart.length > 0) {
   localStorage.setItem("cart", JSON.stringify(cart));
  } else {
   localStorage.removeItem("cart");
  }
 }, [cart]);

 useEffect(() => {
  if (typeof window === "undefined") return;
  if (favorites.length > 0) {
   localStorage.setItem("favorites", JSON.stringify(favorites));
  } else {
   localStorage.removeItem("favorites");
  }
 }, [favorites]);

 const addToCart = async (product, selectedSize = null, selectedColor = null, quantity = 1) => {
  if (product.stock === 0 || product.stock < quantity) {
   return;
  }

  if (quantity > 10) {
   return;
  }

  // Yeni sepeti hesapla
  let newCart;
  setCart((prevCart) => {
   const existingItemIndex = prevCart.findIndex(
    (item) =>
     item._id === product._id &&
     item.selectedColor === selectedColor
   );

   if (existingItemIndex > -1) {
    const updatedCart = [...prevCart];
    const newQuantity = updatedCart[existingItemIndex].quantity + quantity;
    const maxQuantity = Math.min(product.stock, 10);
    if (newQuantity > maxQuantity) {
     updatedCart[existingItemIndex].quantity = maxQuantity;
    } else {
     updatedCart[existingItemIndex].quantity = newQuantity;
    }
    newCart = updatedCart;
    return updatedCart;
   } else {
    newCart = [
     ...prevCart,
     {
      ...product,
      selectedColor,
      quantity: Math.min(quantity, 10),
      addedAt: Date.now(),
     },
    ];
    return newCart;
   }
  });

  // Veritabanına kaydet (giriş yapılmışsa)
  if (newCart) {
   try {
    const productIds = newCart.map(item => String(item._id || item.id)).filter(Boolean);
    await axiosInstance.put("/api/user/cart", { productIds });
   } catch (error) {
    if (process.env.NODE_ENV === 'development') {
     console.log('Sepet veritabanına kaydedilemedi:', error);
    }
   }
  }
 };

 const removeFromCart = async (productId, selectedSize = null, selectedColor = null) => {
  let newCart;
  setCart((prevCart) => {
   newCart = prevCart.filter(
    (item) =>
     !(
      item._id === productId &&
      item.selectedColor === selectedColor
     )
   );
   return newCart;
  });

  // Veritabanından sil (giriş yapılmışsa)
  // Eğer aynı ürünün başka varyantı sepetde kaldıysa silme
  try {
   const remainingItems = newCart.filter(
    (item) => item._id === productId && item.selectedColor !== selectedColor
   );
   if (remainingItems.length === 0) {
    // Aynı ürünün başka varyantı yoksa veritabanından sil
    await axiosInstance.delete(`/api/user/cart?productId=${productId}`);
   }
   // Sepeti tamamen güncelle
   const productIds = newCart.map(item => String(item._id || item.id)).filter(Boolean);
   await axiosInstance.put("/api/user/cart", { productIds });
  } catch (error) {
   // Giriş yapılmamışsa veya hata varsa sessizce devam et
  }
 };

 const updateQuantity = (productId, selectedSize, selectedColor, newQuantity) => {
  if (newQuantity <= 0) {
   removeFromCart(productId, selectedSize, selectedColor);
   return;
  }

  if (newQuantity > 10) {
   newQuantity = 10;
  }

  setCart((prevCart) =>
   prevCart.map((item) => {
    if (
     item._id === productId &&
     item.selectedColor === selectedColor
    ) {
     const maxQuantity = Math.min(item.stock || 10, 10);
     return { ...item, quantity: Math.min(newQuantity, maxQuantity) };
    }
    return item;
   })
  );
 };

 const clearCart = async () => {
  setCart([]);
  localStorage.removeItem("cart");

  // Veritabanından temizle (giriş yapılmışsa)
  try {
   await axiosInstance.put("/api/user/cart", { productIds: [] });
  } catch (error) {
   // Giriş yapılmamışsa veya hata varsa sessizce devam et
  }
 };

 const getCartTotal = () => {
  return cart.reduce((total, item) => {
   // Kampanya fiyatı varsa onu kullan
   let price = item.campaignPrice;
   if (!price) {
    price = (item.discountPrice && item.discountPrice < item.price) ? item.discountPrice : item.price;
   }
   return total + price * item.quantity;
  }, 0);
 };

 const getCartItemCount = () => {
  return cart.reduce((total, item) => total + item.quantity, 0);
 };

 const getFavoriteCount = () => {
  return favorites.length;
 };

 const addToFavorites = async (product) => {
  if (!product || !product._id) return;
  const productIdStr = String(product._id);
  let previousFavorites = favorites;

  setFavorites((prev) => {
   previousFavorites = prev;
   if (prev.some((item) => String(item._id || item.id) === productIdStr)) {
    return prev;
   }
   return [...prev, product];
  });

  const updatedFavorites = previousFavorites.some((item) => String(item._id || item.id) === productIdStr)
   ? previousFavorites
   : [...previousFavorites, product];

  if (typeof window !== "undefined") {
   localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
   window.dispatchEvent(new Event("favoritesUpdated"));
  }

  try {
   const res = await axiosInstance.post("/api/user/favorites", {
    productId: product._id,
   });
   const data = res.data;
   if (!data.success) {
    setFavorites(previousFavorites);
    if (typeof window !== "undefined") {
     localStorage.setItem("favorites", JSON.stringify(previousFavorites));
     window.dispatchEvent(new Event("favoritesUpdated"));
    }
   }
  } catch (error) {
   setFavorites(previousFavorites);
   if (typeof window !== "undefined") {
    localStorage.setItem("favorites", JSON.stringify(previousFavorites));
    window.dispatchEvent(new Event("favoritesUpdated"));
   }
  }
 };

 const removeFromFavorites = async (productId) => {
  if (!productId) return;
  const productIdStr = String(productId);
  let previousFavorites = favorites;

  setFavorites((prev) => {
   previousFavorites = prev;
   return prev.filter((item) => String(item._id || item.id) !== productIdStr);
  });

  const updatedFavorites = previousFavorites.filter((item) => String(item._id || item.id) !== productIdStr);

  if (typeof window !== "undefined") {
   localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
   window.dispatchEvent(new Event("favoritesUpdated"));
  }

  try {
   const res = await axiosInstance.delete(`/api/user/favorites?productId=${productId}`);
   const data = res.data;
   if (!data.success) {
    setFavorites(previousFavorites);
    if (typeof window !== "undefined") {
     localStorage.setItem("favorites", JSON.stringify(previousFavorites));
     window.dispatchEvent(new Event("favoritesUpdated"));
    }
   } else {
    if (typeof window !== "undefined") {
     window.dispatchEvent(new Event("favoritesUpdated"));
    }
   }
  } catch (error) {
   setFavorites(previousFavorites);
   if (typeof window !== "undefined") {
    localStorage.setItem("favorites", JSON.stringify(previousFavorites));
    window.dispatchEvent(new Event("favoritesUpdated"));
   }
  }
 };

 const isFavorite = (productId) => {
  if (!productId) return false;
  const productIdStr = String(productId);
  return favorites.some((item) => String(item._id || item.id) === productIdStr);
 };

 useEffect(() => {
  if (typeof window === "undefined" || cart.length === 0) return;

  const updateCartPrices = async () => {
   try {
    const productsRes = await axiosInstance.get("/api/products?limit=1000");
    const productsData = productsRes.data;

    if (!productsData.success) return;

    const allProducts = productsData.data || productsData.products || [];
    if (allProducts.length === 0) return;

    setCart((prevCart) => {
     const updatedCart = prevCart.map((cartItem) => {
      const productId = String(cartItem._id || cartItem.id);
      const currentProduct = allProducts.find((p) => String(p._id) === productId);

      if (currentProduct) {
       return {
        ...cartItem,
        ...currentProduct,
        selectedColor: cartItem.selectedColor,
        quantity: cartItem.quantity,
        addedAt: cartItem.addedAt,
       };
      }
      return cartItem;
     });

     const hasChanges = prevCart.some((oldItem, index) => {
      const newItem = updatedCart[index];
      if (!newItem) return true;
      const oldPrice = oldItem.discountPrice && oldItem.discountPrice < oldItem.price
       ? oldItem.discountPrice
       : oldItem.price;
      const newPrice = newItem.discountPrice && newItem.discountPrice < newItem.price
       ? newItem.discountPrice
       : newItem.price;
      return oldPrice !== newPrice || oldItem.stock !== newItem.stock;
     });

     return hasChanges ? updatedCart : prevCart;
    });
   } catch (error) {
   }
  };

  const timeoutId = setTimeout(() => {
   updateCartPrices();
  }, 1000);

  const handleVisibilityChange = () => {
   if (!document.hidden) {
    updateCartPrices();
   }
  };

  const handleFocus = () => {
   updateCartPrices();
  };

  const handleCartUpdate = () => {
   updateCartPrices();
  };

  window.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("focus", handleFocus);
  window.addEventListener("cartUpdated", handleCartUpdate);

  return () => {
   clearTimeout(timeoutId);
   window.removeEventListener("visibilitychange", handleVisibilityChange);
   window.removeEventListener("focus", handleFocus);
   window.removeEventListener("cartUpdated", handleCartUpdate);
  };
 }, [cart.length]);


 const value = {
  cart,
  favorites,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCartTotal,
  getCartItemCount,
  getFavoriteCount,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  updateCartPrices,
 };

 return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
 const context = useContext(CartContext);
 if (!context) {
  throw new Error("useCart must be used within a CartProvider");
 }
 return context;
}