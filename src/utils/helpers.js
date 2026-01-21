/**
 * Utilitaires pour la plateforme e-commerce décentralisée
 */

// Formater une adresse Ethereum
export const formatAddress = (address, chars = 6) => {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

// Convertir Wei en ETH
export const weiToEth = (wei, decimals = 4) => {
  if (!wei) return '0';
  return parseFloat(wei / 1e18).toFixed(decimals);
};

// Convertir ETH en Wei
export const ethToWei = (eth) => {
  return Math.floor(eth * 1e18);
};

// Formater la date
export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Valider une adresse Ethereum
export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Obtenir le statut commande
export const getOrderStatusLabel = (status) => {
  const statuses = {
    0: 'En attente',
    1: 'Confirmée',
    2: 'Expédiée',
    3: 'Livrée',
    4: 'Annulée',
  };
  return statuses[status] || 'Inconnu';
};

// Obtenir la couleur du statut
export const getOrderStatusColor = (status) => {
  const colors = {
    0: '#FFA500', // Orange
    1: '#4CAF50', // Vert
    2: '#2196F3', // Bleu
    3: '#8BC34A', // Vert clair
    4: '#F44336', // Rouge
  };
  return colors[status] || '#999';
};

// Obtenir la couleur de note
export const getRatingColor = (rating) => {
  if (rating >= 4.5) return '#10b981'; // Excellent
  if (rating >= 3.5) return '#3b82f6'; // Bon
  if (rating >= 2.5) return '#f59e0b'; // Acceptable
  return '#ef4444'; // Mauvais
};

// Obtenir l'emoji de note
export const getRatingEmoji = (rating) => {
  const stars = Math.round(rating);
  return '⭐'.repeat(Math.min(5, Math.max(1, stars)));
};

// Formater le prix
export const formatPrice = (price, currency = 'ETH') => {
  return `${parseFloat(price).toFixed(4)} ${currency}`;
};

// Valider le prix
export const isValidPrice = (price) => {
  const num = parseFloat(price);
  return !isNaN(num) && num > 0 && num <= 1000;
};

// Valider la quantité
export const isValidQuantity = (quantity) => {
  const num = parseInt(quantity);
  return !isNaN(num) && num > 0 && num <= 10000;
};

// Obtenir les initiales d'un nom
export const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Copier dans le presse-papiers
export const copyToClipboard = (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  // Fallback pour les vieux navigateurs
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch (error) {
    document.body.removeChild(textArea);
    return false;
  }
};

// Calculer le total du panier
export const calculateCartTotal = (cart, products, web3) => {
  return cart.reduce((total, item) => {
    const product = products[item.productId];
    if (product) {
      const price = web3.utils.toBN(product.price);
      return total.add(price.mul(web3.utils.toBN(item.quantity)));
    }
    return total;
  }, web3.utils.toBN(0));
};

// Attendre (Promise)
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default {
  formatAddress,
  weiToEth,
  ethToWei,
  formatDate,
  isValidAddress,
  getOrderStatusLabel,
  getOrderStatusColor,
  getRatingColor,
  getRatingEmoji,
  formatPrice,
  isValidPrice,
  isValidQuantity,
  getInitials,
  copyToClipboard,
  calculateCartTotal,
  sleep,
};
