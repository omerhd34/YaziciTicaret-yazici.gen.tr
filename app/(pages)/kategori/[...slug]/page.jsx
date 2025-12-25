"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { MENU_ITEMS } from "@/app/utils/menuItems";
import { useCart } from "@/context/CartContext";
import { useComparison } from "@/context/ComparisonContext";
import CategoryHeader from "@/app/components/category/CategoryHeader";
import CategoryToolbar from "@/app/components/category/CategoryToolbar";
import CategoryProducts from "@/app/components/category/CategoryProducts";
import CategoryFiltersSidebar from "@/app/components/category/CategoryFiltersSidebar";
import CategoryFiltersModal from "@/app/components/category/CategoryFiltersModal";
import ProductBreadcrumb from "@/app/components/product/ProductBreadcrumb";
import ProductImageGallery from "@/app/components/product/ProductImageGallery";
import ProductRating from "@/app/components/product/ProductRating";
import ProductPrice from "@/app/components/product/ProductPrice";
import ProductStockStatus from "@/app/components/product/ProductStockStatus";
import ProductColorSelector from "@/app/components/product/ProductColorSelector";
import ProductQuantitySelector from "@/app/components/product/ProductQuantitySelector";
import ProductActions from "@/app/components/product/ProductActions";
import ProductFeatures from "@/app/components/product/ProductFeatures";
import ProductAllFeatures from "@/app/components/product/ProductAllFeatures";
import ProductImportantFeatures from "@/app/components/product/ProductImportantFeatures";
import ProductLoading from "@/app/components/product/ProductLoading";
import ProductNotFound from "@/app/components/product/ProductNotFound";
import Toast from "@/app/components/ui/Toast";

export default function KategoriPage() {
 const params = useParams();
 const router = useRouter();
 const slug = useMemo(() => {
  if (!params?.slug) return [];
  return Array.isArray(params.slug) ? params.slug : [params.slug];
 }, [params?.slug]);

 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [showFilters, setShowFilters] = useState(false);

 const [filters, setFilters] = useState({
  minPrice: "",
  maxPrice: "",
  brands: [],
  categories: [],
  sortBy: "-createdAt",
 });

 const [availableBrands, setAvailableBrands] = useState([]);
 const [availableCategories, setAvailableCategories] = useState([]);
 const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

 // Ürün detay sayfası için state'ler
 const [product, setProduct] = useState(null);
 const [selectedImage, setSelectedImage] = useState(0);
 const [selectedColor, setSelectedColor] = useState(null);
 const [selectedColorObj, setSelectedColorObj] = useState(null);
 const [quantity, setQuantity] = useState(1);
 const [addedToCart, setAddedToCart] = useState(false);
 const [canRate, setCanRate] = useState(false);
 const [userRating, setUserRating] = useState(0);
 const [hoverRating, setHoverRating] = useState(0);
 const [ratingSubmitted, setRatingSubmitted] = useState(false);
 const [checkingRating, setCheckingRating] = useState(true);
 const [ratingMessage, setRatingMessage] = useState("");
 const [toast, setToast] = useState({ show: false, message: "", type: "success" });

 const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useCart();
 const { addToComparison, removeFromComparison, isInComparison } = useComparison();

 const slugString = useMemo(() => slug.join('/'), [slug]);

 // Ürün detay sayfası kontrolü: 
 // - 3 parça: category/subcategory/serialNumber
 // - 2 parça: category/serialNumber (alt kategori yoksa)
 const isProductDetailPage = useMemo(() => {
  if (slug.length === 3) {
   // category/subcategory/serialNumber formatı
   return true;
  } else if (slug.length === 2) {
   // category/serialNumber formatı (alt kategori yoksa)
   // Son parçanın seri numarası olup olmadığını kontrol et (büyük harfler ve sayılar içeriyorsa)
   const lastPart = slug[1];
   const serialNumberPattern = /^[A-Z0-9]+$/;
   return serialNumberPattern.test(lastPart);
  }
  return false;
 }, [slug]);

 const fetchProducts = useCallback(async () => {
  setLoading(true);
  try {
   let category = "";
   let subCategory = "";
   let categorySlug = "";
   let mainMenuItem = null;

   if (slug.length > 0) {
    categorySlug = decodeURIComponent(slug[0]);

    mainMenuItem = MENU_ITEMS.find(item => {
     const itemPath = item.path.replace('/kategori/', '');
     return itemPath === categorySlug || itemPath === categorySlug.replace(/-/g, '-');
    });

    if (mainMenuItem) {
     category = mainMenuItem.name;
    } else {
     for (const menuItem of MENU_ITEMS) {
      if (menuItem.subCategories) {
       const subCat = menuItem.subCategories.find(sub => {
        const subPath = sub.path.replace('/kategori/', '');
        return subPath === categorySlug;
       });
       if (subCat) {
        category = subCat.name;
        mainMenuItem = menuItem;
        break;
       }
      }
     }

     if (!category) {
      const categoryMap = {
       yeni: "YENİ GELENLER",
       yeniler: "YENİLER",
       indirim: "İndirimler"
      };
      category = categoryMap[categorySlug] || categorySlug;
     }
    }

    if (slug.length > 1) {
     const subCategorySlug = decodeURIComponent(slug[1]);
     if (!mainMenuItem) {
      mainMenuItem = MENU_ITEMS.find(item => {
       const itemPath = item.path.replace('/kategori/', '');
       return itemPath === categorySlug || itemPath.startsWith(categorySlug + '/');
      });
     }

     if (mainMenuItem && mainMenuItem.subCategories) {
      const subCat = mainMenuItem.subCategories.find(
       sub => {
        const subPath = sub.path.replace(`/kategori/${categorySlug}/`, '').replace(/-/g, '');
        return subPath === subCategorySlug.replace(/-/g, '');
       }
      );
      if (subCat) {
       subCategory = subCat.name;
      } else {
       subCategory = subCategorySlug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      }
     } else {
      subCategory = subCategorySlug
       .replace(/-/g, ' ')
       .replace(/\b\w/g, l => l.toUpperCase());
     }
    }
   }

   let url = "/api/products?limit=1000";

   if (categorySlug === "yeni" || categorySlug === "yeniler") {
    url += `&isNew=true`;
   } else if (categorySlug === "indirim") {
    url += `&category=${encodeURIComponent(category)}`;
   } else {
    if (category) url += `&category=${encodeURIComponent(category)}`;
   }

   if (subCategory) url += `&subCategory=${encodeURIComponent(subCategory)}`;
   if (filters.sortBy) url += `&sort=${filters.sortBy}`;

   const res = await fetch(url);
   const data = await res.json();

   if (data.success) {
    let filteredProducts = data.data;

    if (categorySlug === "indirim") {
     filteredProducts = filteredProducts.filter(p =>
      p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price
     );
    }

    if (filters.minPrice) {
     filteredProducts = filteredProducts.filter(
      (p) => {
       const finalPrice = (p.discountPrice && p.discountPrice < p.price) ? p.discountPrice : p.price;
       return finalPrice >= parseFloat(filters.minPrice);
      }
     );
    }
    if (filters.maxPrice) {
     filteredProducts = filteredProducts.filter(
      (p) => {
       const finalPrice = (p.discountPrice && p.discountPrice < p.price) ? p.discountPrice : p.price;
       return finalPrice <= parseFloat(filters.maxPrice);
      }
     );
    }


    // Brand filter
    if (filters.brands.length > 0) {
     filteredProducts = filteredProducts.filter((p) =>
      filters.brands.includes(p.brand)
     );
    }

    // Category filter (only for "yeniler" and "indirim" pages)
    if (categorySlug === "yeni" || categorySlug === "yeniler" || categorySlug === "indirim") {
     if (filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter((p) =>
       filters.categories.includes(p.category)
      );
     }
    }

    setProducts(filteredProducts);

    // Extract unique brands
    const brands = [...new Set(data.data.map((p) => p.brand).filter(Boolean))];
    setAvailableBrands(brands);

    // Extract unique categories (only for "yeniler" and "indirim" pages)
    if (categorySlug === "yeni" || categorySlug === "yeniler" || categorySlug === "indirim") {
     const categories = [...new Set(data.data.map((p) => p.category).filter(Boolean))];
     setAvailableCategories(categories);
    } else {
     setAvailableCategories([]);
    }

    // Calculate price range
    if (data.data.length > 0) {
     const prices = data.data.map((p) => {
      // Sadece gerçek indirim varsa discountPrice kullan
      return (p.discountPrice && p.discountPrice < p.price) ? p.discountPrice : p.price;
     });
     setPriceRange({
      min: Math.min(...prices),
      max: Math.max(...prices),
     });
    }
   }
  } catch (error) {
  } finally {
   setLoading(false);
  }
 }, [slug, filters.sortBy, filters.brands, filters.categories, filters.minPrice, filters.maxPrice]);

 // Ürün detay sayfası için fetch
 const fetchProductBySerialNumber = useCallback(async (serialNumber) => {
  setLoading(true);
  try {
   const res = await fetch("/api/products?limit=1000");
   const data = await res.json();

   if (data.success) {
    // Renk seviyesinde seri numarasına göre ürün bul
    const foundProduct = data.data.find((p) => {
     if (!p.colors || !Array.isArray(p.colors)) return false;
     return p.colors.some(c => {
      if (typeof c === 'object' && c.serialNumber) {
       return c.serialNumber === serialNumber;
      }
      return false;
     });
    });

    if (foundProduct) {
     // Seri numarasına sahip rengi bul
     const colorWithSerial = foundProduct.colors.find(c => {
      if (typeof c === 'object' && c.serialNumber) {
       return c.serialNumber === serialNumber;
      }
      return false;
     });

     setProduct(foundProduct);
     if (colorWithSerial) {
      setSelectedColor(colorWithSerial.name);
      setSelectedColorObj(colorWithSerial);
      setSelectedImage(0);
     } else if (foundProduct.colors && foundProduct.colors.length > 0) {
      const firstColor = typeof foundProduct.colors[0] === 'object' ? foundProduct.colors[0] : { name: foundProduct.colors[0] };
      setSelectedColor(firstColor.name);
      setSelectedColorObj(firstColor);
      setSelectedImage(0);
     }
     checkCanRate(foundProduct._id);
    }
   }
  } catch (error) {
  } finally {
   setLoading(false);
  }
 }, []);

 const checkCanRate = async (productId) => {
  try {
   setCheckingRating(true);
   const res = await fetch(`/api/products/${productId}/rating`, {
    credentials: "include",
   });
   const data = await res.json();
   if (data.success) {
    setCanRate(data.canRate);
    setRatingMessage(data.message || "");
    if (data.userRating) {
     setUserRating(Number(data.userRating) || 0);
    }
   }
  } catch (error) {
   setCanRate(false);
   setRatingMessage("");
  } finally {
   setCheckingRating(false);
  }
 };

 const handleSubmitRating = async (rating) => {
  if (!product || !canRate) return;

  try {
   const res = await fetch(`/api/products/${product._id}/rating`, {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ rating }),
   });

   const data = await res.json();

   if (data.success) {
    setRatingSubmitted(true);
    setCanRate(false);
    setProduct({
     ...product,
     rating: data.data.rating,
     reviewCount: data.data.reviewCount,
    });
    setToast({ show: true, message: "Puanınız başarıyla kaydedildi!", type: "success" });
   } else {
    setToast({ show: true, message: data.message || "Puan verilemedi", type: "error" });
   }
  } catch (error) {
   setToast({ show: true, message: "Bir hata oluştu. Lütfen tekrar deneyin.", type: "error" });
  }
 };

 const handleAddToCart = () => {
  if (!product) return;

  // Renk bazlı bilgileri hesapla
  const currentColorObj = selectedColorObj || (product.colors && product.colors.length > 0
   ? (typeof product.colors[0] === 'object' ? product.colors[0] : null)
   : null);

  const colorPrice = currentColorObj?.price || product.price;
  const colorDiscountPrice = currentColorObj?.discountPrice !== undefined ? currentColorObj.discountPrice : product.discountPrice;
  const colorImages = currentColorObj?.images && currentColorObj.images.length > 0 ? currentColorObj.images : product.images;
  const colorSerialNumber = currentColorObj?.serialNumber || product.serialNumber;
  const colorStock = currentColorObj?.stock !== undefined ? currentColorObj.stock : product.stock;

  const stockToCheck = colorStock;
  if (stockToCheck === 0) {
   setToast({ show: true, message: "Bu ürün stokta bulunmamaktadır.", type: "error" });
   return;
  }

  if (quantity > 10) {
   setToast({ show: true, message: "Bir üründen en fazla 10 adet alabilirsiniz.", type: "error" });
   setQuantity(10);
   return;
  }

  const productToAdd = {
   ...product,
   price: colorPrice,
   discountPrice: colorDiscountPrice,
   serialNumber: colorSerialNumber,
   images: colorImages,
   stock: stockToCheck,
  };

  addToCart(productToAdd, null, selectedColor, quantity);
  setAddedToCart(true);
  setTimeout(() => setAddedToCart(false), 2000);
 };

 const handleFavoriteToggle = () => {
  if (!product) return;

  if (isFavorite(product._id)) {
   removeFromFavorites(product._id);
  } else {
   addToFavorites(product);
  }
 };

 const handleComparisonToggle = () => {
  if (!product || !product._id) return;

  const productId = String(product._id);
  const isCurrentlyInComparison = isInComparison(productId);

  if (isCurrentlyInComparison) {
   removeFromComparison(productId);
  } else {
   addToComparison(product);
  }
 };

 // Sayfa yüklendiğinde veya slug değiştiğinde scroll'u en üste al
 useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'instant' });
 }, [slug]);

 useEffect(() => {
  if (isProductDetailPage) {
   // Seri numarası son parçada (2 veya 3 parça olabilir)
   const serialNumber = decodeURIComponent(slug[slug.length - 1]);
   fetchProductBySerialNumber(serialNumber);
  } else {
   fetchProducts();
  }
 }, [isProductDetailPage, slug, fetchProducts, fetchProductBySerialNumber]);


 const handleBrandToggle = (brand) => {
  setFilters((prev) => ({
   ...prev,
   brands: prev.brands.includes(brand)
    ? prev.brands.filter((b) => b !== brand)
    : [...prev.brands, brand],
  }));
 };

 const handleCategoryToggle = (category) => {
  setFilters((prev) => ({
   ...prev,
   categories: prev.categories.includes(category)
    ? prev.categories.filter((c) => c !== category)
    : [...prev.categories, category],
  }));
 };

 const clearFilters = () => {
  setFilters({
   minPrice: "",
   maxPrice: "",
   brands: [],
   categories: [],
   sortBy: "-createdAt",
  });

  // Eğer alt kategori seçiliyse, ana kategoriye yönlendir
  if (slug.length > 1) {
   const categorySlug = decodeURIComponent(slug[0]);
   router.push(`/kategori/${categorySlug}`);
  }
 };

 const categoryNames = {
  yeni: "Yeniler",
  indirim: "İndirimler",
  kampanyalar: "Kampanyalar",
 };

 const getCategoryName = () => {
  if (slug.length === 0) return "Tüm Ürünler";

  const decodedSlug = decodeURIComponent(slug[0]);
  let mainCat = "";
  let subCat = "";

  // Önce MENU_ITEMS'de ana kategoriyi ara
  let mainMenuItem = MENU_ITEMS.find(item => {
   const itemPath = item.path.replace('/kategori/', '');
   return itemPath === decodedSlug;
  });

  if (mainMenuItem) {
   mainCat = mainMenuItem.name;
  } else {
   // Ana kategoride bulunamadıysa, alt kategorilerde ara (eski URL formatı için)
   for (const menuItem of MENU_ITEMS) {
    if (menuItem.subCategories) {
     const subCatItem = menuItem.subCategories.find(sub => {
      const subPath = sub.path.replace('/kategori/', '');
      // Yeni format: /kategori/beyaz-esya/buzdolabi
      // Eski format: /kategori/buzdolabi
      return subPath === decodedSlug || subPath.endsWith('/' + decodedSlug);
     });
     if (subCatItem) {
      subCat = subCatItem.name;
      mainCat = menuItem.name;
      mainMenuItem = menuItem;
      break;
     }
    }
   }

   // Hala bulunamadıysa fallback kullan
   if (!mainCat) {
    mainCat = categoryNames[decodedSlug] || decodedSlug;
   }
  }

  // Alt kategori varsa (yeni format: /kategori/beyaz-esya/buzdolabi)
  if (slug.length > 1) {
   const decodedSubSlug = decodeURIComponent(slug[1]);

   // Ana kategoriyi bul (eğer bulunamadıysa)
   if (!mainMenuItem) {
    mainMenuItem = MENU_ITEMS.find(item => {
     const itemPath = item.path.replace('/kategori/', '');
     return itemPath === decodedSlug;
    });
   }

   if (mainMenuItem && mainMenuItem.subCategories) {
    const subCatItem = mainMenuItem.subCategories.find(sub => {
     const subPath = sub.path.replace(`/kategori/${decodedSlug}/`, '').replace(/-/g, '');
     return subPath === decodedSubSlug.replace(/-/g, '');
    });
    if (subCatItem) {
     subCat = subCatItem.name;
    } else {
     subCat = decodedSubSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
   } else {
    subCat = decodedSubSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
   }

   return subCat || mainCat;
  }

  // Sadece ana kategori veya alt kategori (eski format)
  return subCat || mainCat;
 };

 // Ürün detay sayfası için renk bazlı bilgiler (sadece ürün detay sayfasında hesapla)
 let currentColorObj = null;
 let colorPrice = 0;
 let colorDiscountPrice = null;
 let colorImages = [];
 let colorSerialNumber = "";
 let colorStock = 0;
 let hasDiscount = false;
 let displayPrice = 0;
 let discountPercentage = 0;

 if (isProductDetailPage && product) {
  currentColorObj = selectedColorObj || (product.colors && product.colors.length > 0
   ? (typeof product.colors[0] === 'object' ? product.colors[0] : null)
   : null);

  colorPrice = currentColorObj?.price || (product.price || 0);
  colorDiscountPrice = currentColorObj?.discountPrice !== undefined ? currentColorObj.discountPrice : (product.discountPrice || null);
  colorImages = currentColorObj?.images && currentColorObj.images.length > 0 ? currentColorObj.images : (product.images || []);
  colorSerialNumber = currentColorObj?.serialNumber || product.serialNumber || "";
  colorStock = currentColorObj?.stock !== undefined ? currentColorObj.stock : (product.stock || 0);

  hasDiscount = colorDiscountPrice && colorDiscountPrice < colorPrice;
  displayPrice = hasDiscount ? colorDiscountPrice : colorPrice;
  discountPercentage = hasDiscount
   ? Math.round(((colorPrice - colorDiscountPrice) / colorPrice) * 100)
   : 0;
 }

 const handleColorSelect = (colorName) => {
  setSelectedColor(colorName);
  const color = product?.colors?.find(c => {
   if (typeof c === 'object') {
    return c.name === colorName;
   }
   return c === colorName;
  });
  if (color && typeof color === 'object') {
   setSelectedColorObj(color);
   setSelectedImage(0);

   // URL'yi güncelle - yeni renk varyantının serialNumber'ı ile
   const newSerialNumber = color.serialNumber;
   if (newSerialNumber) {
    if (slug.length === 3) {
     // Mevcut URL: /kategori/category/subcategory/oldSerialNumber
     // Yeni URL: /kategori/category/subcategory/newSerialNumber
     const newUrl = `/kategori/${slug[0]}/${slug[1]}/${newSerialNumber}`;
     router.push(newUrl);
    } else if (slug.length === 2) {
     // Mevcut URL: /kategori/category/oldSerialNumber
     // Yeni URL: /kategori/category/newSerialNumber
     const newUrl = `/kategori/${slug[0]}/${newSerialNumber}`;
     router.push(newUrl);
    }
   }
  } else {
   setSelectedColorObj(null);
  }
 };

 // Kategori listesi sayfası için ürün sayısı hesaplama
 // Her ürünü tek bir ürün olarak say (renk varyantları ayrı sayılmaz)
 const expandedProductsCount = useMemo(() => {
  return products.length;
 }, [products]);

 // Ürün detay sayfası göster
 if (isProductDetailPage) {
  if (loading) {
   return <ProductLoading />;
  }

  if (!product) {
   return <ProductNotFound />;
  }

  return (
   <div className="min-h-screen bg-gray-50 py-12">
    <Toast toast={toast} setToast={setToast} />

    <div className="container mx-auto px-4">
     <ProductBreadcrumb product={product} />

     <div className="grid lg:grid-cols-2 gap-12">
      <ProductImageGallery
       images={colorImages}
       selectedImage={selectedImage}
       onImageSelect={setSelectedImage}
       isNew={product.isNew}
       discountPercentage={discountPercentage}
       productName={product.name}
      />

      <div>
       {product.brand && (
        <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
         {product.brand}
         {colorSerialNumber && (
          <span className="ml-2 font-mono text-gray-600 normal-case">- {colorSerialNumber}</span>
         )}
        </p>
       )}
       {!product.brand && colorSerialNumber && (
        <p className="text-sm text-gray-500 mb-2">
         <span className="font-mono text-gray-600">Seri No: {colorSerialNumber}</span>
        </p>
       )}

       <h1 className="text-3xl font-black text-gray-900 mb-4">{product.name}</h1>

       <ProductRating
        product={product}
        checkingRating={checkingRating}
        canRate={canRate}
        ratingSubmitted={ratingSubmitted}
        hoverRating={hoverRating}
        userRating={userRating}
        onHoverRating={setHoverRating}
        onRatingSubmit={handleSubmitRating}
       />

       <ProductPrice
        displayPrice={displayPrice}
        hasDiscount={hasDiscount}
        originalPrice={colorPrice}
       />

       <p className="text-gray-600 mb-6 leading-relaxed max-w-2xl wrap-break-word">
        {product.description}
       </p>

       <ProductStockStatus stock={colorStock} />

       <ProductColorSelector
        colors={product.colors}
        selectedColor={selectedColor}
        onColorSelect={handleColorSelect}
       />

       <ProductQuantitySelector
        quantity={quantity}
        stock={colorStock}
        onQuantityChange={setQuantity}
       />

       <ProductActions
        productId={product._id}
        stock={colorStock}
        addedToCart={addedToCart}
        isFavorite={isFavorite(product._id)}
        isInComparison={isInComparison(product._id)}
        onAddToCart={handleAddToCart}
        onFavoriteToggle={handleFavoriteToggle}
        onComparisonToggle={handleComparisonToggle}
       />

       <ProductFeatures />
      </div>
     </div>

     {/* Önemli Özellikler Bölümü */}
     <ProductImportantFeatures product={product} selectedColor={selectedColor} />

     {/* Tüm Özellikler Bölümü */}
     <div className="mt-12">
      <ProductAllFeatures product={product} selectedColor={selectedColor} />
     </div>
    </div>
   </div>
  );
 }

 // Kampanyalar sayfası için özel görünüm
 const isCampaignsPage = slug.length > 0 && decodeURIComponent(slug[0]) === "kampanyalar";

 if (isCampaignsPage) {
  return (
   <div className="min-h-screen bg-gray-50">
    <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white py-12">
     <div className="container mx-auto px-4">
      <h1 className="text-4xl font-black mb-2">Kampanyalar</h1>
     </div>
    </div>
    <div className="container mx-auto px-4 py-8">
     <div className="flex justify-center items-center">
      <div className="w-full max-w-2xl">
       <Image
        src="/yilbasi_cekilisi.png"
        alt="Yılbaşı Çekilişi"
        width={600}
        height={400}
        className="w-full h-auto rounded-lg shadow-lg"
        priority
       />
      </div>
     </div>
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-gray-50">
   <CategoryHeader categoryName={getCategoryName()} productCount={expandedProductsCount} />
   <div className="container mx-auto px-4 py-8">
    <div className="flex gap-6">
     <CategoryFiltersSidebar
      slug={slug}
      filters={filters}
      availableBrands={availableBrands}
      availableCategories={availableCategories}
      onClearFilters={clearFilters}
      onMinPriceChange={(value) => setFilters({ ...filters, minPrice: value })}
      onMaxPriceChange={(value) => setFilters({ ...filters, maxPrice: value })}
      onBrandToggle={handleBrandToggle}
      onCategoryToggle={handleCategoryToggle}
     />

     <div className="flex-1">
      <CategoryToolbar
       sortBy={filters.sortBy}
       onSortChange={(value) => setFilters({ ...filters, sortBy: value })}
       onFiltersClick={() => setShowFilters(true)}
      />

      <CategoryProducts
       loading={loading}
       products={products}
       sortBy={filters.sortBy}
       onClearFilters={clearFilters}
      />
     </div>
    </div>
   </div>

   <CategoryFiltersModal
    show={showFilters}
    slug={slug}
    filters={filters}
    availableBrands={availableBrands}
    availableCategories={availableCategories}
    onClose={() => setShowFilters(false)}
    onClearFilters={clearFilters}
    onMinPriceChange={(value) => setFilters({ ...filters, minPrice: value })}
    onMaxPriceChange={(value) => setFilters({ ...filters, maxPrice: value })}
    onBrandToggle={handleBrandToggle}
    onCategoryToggle={handleCategoryToggle}
   />
  </div>
 );
}
