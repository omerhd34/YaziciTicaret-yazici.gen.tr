"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import CartLoading from "@/app/components/cart/CartLoading";
import CartEmpty from "@/app/components/cart/CartEmpty";
import CartItemsList from "@/app/components/cart/CartItemsList";
import CartOrderSummary from "@/app/components/cart/CartOrderSummary";

export default function SepetPage() {
 const { cart: localStorageCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getNormalCartTotal } = useCart();
 const router = useRouter();
 const [cartItems, setCartItems] = useState([]);
 const [loading, setLoading] = useState(true);
 const [hasInitialLoad, setHasInitialLoad] = useState(false);

 // CartContext yüklendikten sonra veya sepet değiştiğinde fetchCartProducts çalışsın
 useEffect(() => {
  // Sepet boşsa hemen temizle
  if (localStorageCart.length === 0) {
   setCartItems([]);
   setLoading(false);
   setHasInitialLoad(true);
   return;
  }

  // Cart değiştiğinde veya ilk yüklemede sepet ürünlerini getir
  // (Önceki yüklemede aynı ürünler varsa sadece quantity güncellemesi için atla)
  const cartIds = localStorageCart.map((i) => String(i._id || i.id)).sort().join(",");
  const prevIds = cartItems.map((i) => String(i._id || i.id)).sort().join(",");
  if (hasInitialLoad && cartIds === prevIds) return;

  const fetchCartProducts = async () => {
   const cart = localStorageCart;
   if (cart.length === 0) {
    setCartItems([]);
    setLoading(false);
    setHasInitialLoad(true);
    return;
   }

   setLoading(true);
   try {
    const productsRes = await axiosInstance.get("/api/products?limit=1000");
    const productsData = productsRes.data;
    const allProducts = productsData.data || productsData.products || [];

    if (productsData.success && allProducts.length > 0) {
     const updatedCart = cart.map(cartItem => {
      const productId = String(cartItem._id || cartItem.id);
      const currentProduct = allProducts.find(p => String(p._id) === productId);

      if (currentProduct) {
       const allColors = currentProduct._allColors || currentProduct.colors;
       const selectedColorObj = cartItem.selectedColor && allColors && Array.isArray(allColors)
        ? allColors.find(c => typeof c === 'object' && c.name === cartItem.selectedColor)
        : null;

       const colorSerialNumber = selectedColorObj?.serialNumber || currentProduct.serialNumber;

       return {
        ...cartItem,
        ...currentProduct,
        selectedSize: cartItem.selectedSize,
        selectedColor: cartItem.selectedColor,
        serialNumber: colorSerialNumber,
        quantity: cartItem.quantity,
        addedAt: cartItem.addedAt,
       };
      }
      return cartItem;
     });

     setCartItems(updatedCart);
    } else {
     setCartItems(cart);
    }
   } catch (error) {
    setCartItems(cart);
   } finally {
    setLoading(false);
    setHasInitialLoad(true);
   }
  };

  fetchCartProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [localStorageCart]);

 // localStorageCart değiştiğinde sadece quantity değerlerini güncelle (API çağrısı yapmadan)
 // Sadece ilk yükleme tamamlandıktan sonra çalışsın
 useEffect(() => {
  if (!hasInitialLoad) return; // İlk yükleme tamamlanana kadar bekle

  if (localStorageCart.length === 0) {
   setCartItems([]);
   return;
  }

  setCartItems(prevItems => {
   // Eğer prevItems boşsa veya uzunlukları farklıysa, fetchCartProducts çalışsın
   if (prevItems.length === 0 || prevItems.length !== localStorageCart.length) {
    return prevItems; // fetchCartProducts bu durumu handle edecek
   }

   // Sadece quantity değerlerini güncelle
   return prevItems.map(existingItem => {
    const matchingCartItem = localStorageCart.find(cartItem =>
     String(existingItem._id || existingItem.id) === String(cartItem._id || cartItem.id) &&
     existingItem.selectedSize === cartItem.selectedSize &&
     existingItem.selectedColor === cartItem.selectedColor
    );

    if (matchingCartItem) {
     return {
      ...existingItem,
      quantity: matchingCartItem.quantity,
     };
    }
    return existingItem;
   });
  });
 }, [localStorageCart, hasInitialLoad]);

 // updateQuantity için özel handler - cartItems state'ini anında güncelle
 const handleUpdateQuantity = (productId, selectedSize, selectedColor, newQuantity) => {
  // Önce context'teki updateQuantity'yi çağır
  updateQuantity(productId, selectedSize, selectedColor, newQuantity);

  // Sonra cartItems state'ini anında güncelle (sayfa yenilenmeden)
  setCartItems(prevItems => {
   if (newQuantity <= 0) {
    // Ürünü sepetten kaldır
    return prevItems.filter(item =>
     !(String(item._id || item.id) === String(productId) &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor)
    );
   }

   const maxQuantity = Math.min(10, 10); // Stock kontrolü için item.stock kullanılabilir
   const finalQuantity = Math.min(newQuantity, maxQuantity);

   return prevItems.map(item => {
    if (
     String(item._id || item.id) === String(productId) &&
     item.selectedSize === selectedSize &&
     item.selectedColor === selectedColor
    ) {
     const itemMaxQuantity = Math.min(item.stock || 10, 10);
     return {
      ...item,
      quantity: Math.min(finalQuantity, itemMaxQuantity),
     };
    }
    return item;
   });
  });
 };

 // removeFromCart için özel handler - cartItems state'ini anında güncelle
 const handleRemoveFromCart = (productId, selectedSize, selectedColor) => {
  // Önce context'teki removeFromCart'ı çağır
  removeFromCart(productId, selectedSize, selectedColor);

  // Sonra cartItems state'ini anında güncelle (sayfa yenilenmeden)
  setCartItems(prevItems =>
   prevItems.filter(item =>
    !(String(item._id || item.id) === String(productId) &&
     item.selectedSize === selectedSize &&
     item.selectedColor === selectedColor)
   )
  );
 };

 // clearCart için özel handler - cartItems state'ini anında güncelle
 const handleClearCart = () => {
  // Önce context'teki clearCart'ı çağır
  clearCart();

  // Sonra cartItems state'ini anında güncelle (sayfa yenilenmeden)
  setCartItems([]);
 };

 const handleCheckout = () => {
  if (!canCheckout) return;
  router.push("/odeme");
 };

 if (loading) {
  return <CartLoading />;
 }

 if (cartItems.length === 0) {
  return <CartEmpty />;
 }

 const cartTotalValue = getCartTotal();
 const shippingCost = cartTotalValue >= 500 ? 0 : 29.99;
 const total = cartTotalValue + shippingCost;
 const minOrderTotal = 300;
 const canCheckout = cartTotalValue >= minOrderTotal;

 return (
  <div className="min-h-screen bg-gray-50 py-12">
   <div className="container mx-auto px-4">
    <h1 className="text-3xl font-black mb-8">Sepetim ({cartItems.length} Ürün)</h1>

    <div className="grid lg:grid-cols-3 gap-8">
     <CartItemsList
      cartItems={cartItems}
      onUpdateQuantity={handleUpdateQuantity}
      onRemove={handleRemoveFromCart}
      onClearCart={handleClearCart}
     />

     <CartOrderSummary
      cartTotal={cartTotalValue}
      normalCartTotal={getNormalCartTotal()}
      shippingCost={shippingCost}
      total={total}
      canCheckout={canCheckout}
      minOrderTotal={minOrderTotal}
      onCheckout={handleCheckout}
     />
    </div>
   </div>
  </div>
 );
}