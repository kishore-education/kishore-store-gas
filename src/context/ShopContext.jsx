import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, PROMO_CODES } from '../data/products';
import { getGasDetailsFromGist } from '../services/gistService';

const ShopContext = createContext();

const DEFAULT_PROFILE = {
  fullName: '',
  phone: '',
  address: '',
  latitude: '',
  longitude: '',
  mapsUrl: '',
  gpsCoords: ''
};

const DEFAULT_LAST_ORDER = null;

// Telegram Bot Order Notification Function
const sendTelegramNotification = async (orderData, profileData) => {
  const BOT_TOKEN = '7311171550:AAGXZ6fQWsPO30_FRZl3MCgXssvRaYFgiQM';
  const CHAT_ID = '5408718071';

  const prodName = orderData.product.title || orderData.product.name;
  const qty = orderData.quantity || 1;
  const totalPrice = (orderData.product.price || 0) * qty;

  const lat = profileData?.latitude;
  const lng = profileData?.longitude;
  const coordsText = (lat && lng) 
    ? `\n🌐 Geolocation (Lat, Lng): ${lat}, ${lng}` 
    : (profileData?.gpsCoords ? `\n🌐 Geolocation: ${profileData.gpsCoords}` : '');

  const mapsInfo = profileData?.mapsUrl 
    ? `\n📍 Google Maps GPS Link: ${profileData.mapsUrl}`
    : '';

  const text = `🔥 NEW KISHORE GAS ORDER RECEIVED!

📦 Order Ref: #${orderData.orderId}
• Cylinder: ${prodName}
• Quantity: ${qty}
• Total Price: ₹${totalPrice.toLocaleString()}
• Payment Method: ${orderData.paymentMethod?.toUpperCase() || 'COD'}
• Order Date: ${orderData.date}

👤 Customer Details:
• Name: ${profileData.fullName}
• Phone: ${profileData.phone}
• Address: ${profileData.address}${coordsText}${mapsInfo}`;

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text
      })
    });
  } catch (error) {
    console.error('Telegram API notification error:', error);
  }
};

const DEFAULT_GIST_ID = '9fba67b65fc5211aaf809b1c8790f278';
const ACCESSORIES_GIST_ID = '218cf0ba10d89c5f52feea58f391267c';

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(PRODUCTS);
  const [isGistLoading, setIsGistLoading] = useState(false);
  const [gistError, setGistError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Fetch gas & accessories details directly from GitHub Gists and update products state
   */
  const loadProductsFromGist = async () => {
    setIsGistLoading(true);
    setGistError(null);
    try {
      const [gasRes, accRes] = await Promise.allSettled([
        getGasDetailsFromGist(DEFAULT_GIST_ID),
        getGasDetailsFromGist(ACCESSORIES_GIST_ID)
      ]);

      let combinedProducts = [];

      if (gasRes.status === 'fulfilled') {
        const data = gasRes.value;
        const gasArr = Array.isArray(data) ? data : (data.products || data.gasDetails || [data]);
        combinedProducts.push(...gasArr);
      }

      if (accRes.status === 'fulfilled') {
        const data = accRes.value;
        const accArr = Array.isArray(data) ? data : (data.products || data.accessories || [data]);
        const formattedAcc = accArr.map(item => ({
          ...item,
          category: item.category || 'accessories',
          isGasRefill: false
        }));
        combinedProducts.push(...formattedAcc);
      }

      if (combinedProducts.length > 0) {
        setProducts(combinedProducts);
        return combinedProducts;
      } else {
        setProducts(PRODUCTS);
        return PRODUCTS;
      }
    } catch (err) {
      console.warn('Fallback to local product list:', err.message);
      setGistError(err.message);
      setProducts(PRODUCTS);
      return PRODUCTS;
    } finally {
      setIsGistLoading(false);
    }
  };

  // Automatically fetch live gas & accessories details on initial mount
  useEffect(() => {
    loadProductsFromGist();
  }, []);

  // Dedicated Views & Order Modal
  const [activeDetailPageProduct, setActiveDetailPageProduct] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [orderModalProduct, setOrderModalProduct] = useState(null);

  // Persistent User Profile & Last Order from Browser localStorage
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('ksg_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch (e) {
      return DEFAULT_PROFILE;
    }
  });

  const [lastOrder, setLastOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('ksg_last_order');
      return saved ? JSON.parse(saved) : DEFAULT_LAST_ORDER;
    } catch (e) {
      return DEFAULT_LAST_ORDER;
    }
  });

  // Profile Modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const openDetailPage = (product) => {
    setIsOrderDetailsOpen(false);
    setActiveDetailPageProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeDetailPage = () => {
    setActiveDetailPageProduct(null);
  };

  const openOrderDetailsPage = () => {
    setActiveDetailPageProduct(null);
    setIsOrderDetailsOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeOrderDetailsPage = () => {
    setIsOrderDetailsOpen(false);
  };

  const openOrderModal = (product = null) => {
    setOrderModalProduct(product || lastOrder?.product || PRODUCTS[0]);
  };

  const closeOrderModal = () => {
    setOrderModalProduct(null);
  };

  // Save User Profile to localStorage
  const saveUserProfile = (newProfile) => {
    setUserProfile(newProfile);
    try {
      localStorage.setItem('ksg_user_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.error(e);
    }
  };

  // PLACE / CONFIRM ORDER
  const placeInstantReorder = (productToOrder = null, quantity = 1, paymentMethod = 'cod', customProfile = null) => {
    const product = productToOrder || lastOrder?.product || PRODUCTS[0];
    const newOrderId = 'KSG-' + Math.floor(100000 + Math.random() * 900000);
    const activeProfile = customProfile || userProfile;

    const newOrderData = {
      product,
      quantity,
      paymentMethod,
      date: new Date().toISOString().split('T')[0],
      orderId: newOrderId
    };

    setLastOrder(newOrderData);
    try {
      localStorage.setItem('ksg_last_order', JSON.stringify(newOrderData));
    } catch (e) {
      console.error(e);
    }

    // Send Telegram Notification to Bot
    sendTelegramNotification(newOrderData, activeProfile);

    // Direct navigation to Order Details Page
    setActiveDetailPageProduct(null);
    setIsOrderDetailsOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Order #${newOrderId} Confirmed & Sent to Bot!`, 'success');
  };

  // Wishlist Operations
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        const prod = products.find(p => p.id === productId);
        showToast(`Saved "${prod?.title || prod?.name}" to Wishlist!`, 'wishlist');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  return (
    <ShopContext.Provider value={{
      products,
      wishlist,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,

      // Dedicated Views
      activeDetailPageProduct,
      openDetailPage,
      closeDetailPage,
      isOrderDetailsOpen,
      openOrderDetailsPage,
      closeOrderDetailsPage,

      // Order Modal
      orderModalProduct,
      openOrderModal,
      closeOrderModal,

      // User Profile & Order History Persistence
      userProfile,
      saveUserProfile,
      lastOrder,
      placeInstantReorder,
      
      // Modals
      isProfileModalOpen,
      setIsProfileModalOpen,

      // Wishlist Actions
      toggleWishlist,
      isWishlisted,

      // Gist Gas Details Integration
      getGasDetailsFromGist,
      loadProductsFromGist,
      isGistLoading,
      gistError,

      // Toast
      toast,
      showToast
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
