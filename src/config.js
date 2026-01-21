/**
 * Configuration pour la plateforme e-commerce décentralisée
 * Stocke les constantes et configurations importantes
 */

// Configuration réseau
export const NETWORK_CONFIG = {
  GANACHE: {
    id: 5777,
    name: 'Ganache Local',
    rpcUrl: 'http://localhost:8545',
    chainId: 5777,
  },
};

// Configuration de l'application
export const APP_CONFIG = {
  // Adresse du contrat (sera mise à jour après déploiement)
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS || '',
  
  // Frais et limites
  MIN_PRICE: 0.001, // ETH
  MAX_PRICE: 1000,  // ETH
  MAX_QUANTITY: 10000,
  GAS_LIMIT: 300000,
  
  // Timeouts
  TRANSACTION_TIMEOUT: 60000, // 60s
  BLOCK_CONFIRMATION: 1,
};

// Messages et notifications
export const MESSAGES = {
  // Succès
  SUCCESS: {
    WALLET_CONNECTED: '✅ Wallet connecté avec succès',
    USER_REGISTERED: '✅ Enregistrement réussi',
    PRODUCT_ADDED: '✅ Produit ajouté',
    PRODUCT_UPDATED: '✅ Produit mis à jour',
    ITEM_ADDED_TO_CART: '✅ Produit ajouté au panier',
    ITEM_REMOVED_FROM_CART: '✅ Produit supprimé du panier',
    CHECKOUT_SUCCESS: '✅ Commande passée',
    ORDER_STATUS_UPDATED: '✅ Statut de commande mis à jour',
    REVIEW_POSTED: '✅ Avis publié',
  },
  
  // Erreurs
  ERROR: {
    METAMASK_NOT_DETECTED: '❌ MetaMask non détecté',
    WALLET_NOT_CONNECTED: '❌ Veuillez connecter votre wallet',
    INVALID_NETWORK: '❌ Veuillez configurer Ganache Local',
    CONTRACT_NOT_DEPLOYED: '❌ Le contrat n\'est pas déployé',
    INSUFFICIENT_BALANCE: '❌ Solde insuffisant',
    INVALID_INPUT: '❌ Données invalides',
    TRANSACTION_FAILED: '❌ Erreur lors de la transaction',
  },
  
  // Informations
  INFO: {
    LOADING: '⏳ Chargement...',
    PROCESSING_TRANSACTION: '⏳ Transaction en cours...',
    UPDATING: '⏳ Mise à jour...',
  },
};

// Rôles utilisateur
export const USER_ROLES = {
  CLIENT: 'Client',
  SELLER: 'Seller',
  ADMIN: 'Admin',
};

// Statuts de commande
export const ORDER_STATUS = {
  PENDING: 0,
  CONFIRMED: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  CANCELLED: 4,
};

export const ORDER_STATUS_LABELS = {
  0: 'En attente',
  1: 'Confirmée',
  2: 'Expédiée',
  3: 'Livrée',
  4: 'Annulée',
};

// Couleurs des statuts
export const ORDER_STATUS_COLORS = {
  0: '#FFA500',
  1: '#4CAF50',
  2: '#2196F3',
  3: '#8BC34A',
  4: '#F44336',
};

// Emojis
export const EMOJIS = {
  SHOP: '🏪',
  CART: '🛒',
  ORDERS: '📦',
  DASHBOARD: '📊',
  WALLET: '👤',
  SETTINGS: '⚙️',
  SELLER: '🏪',
  PRODUCTS: '📦',
  ADD: '➕',
  SUCCESS: '✅',
  ERROR: '❌',
  WARNING: '⚠️',
  INFO: 'ℹ️',
  LOADING: '⏳',
  BLOCKCHAIN: '🔗',
  ETH: 'Ξ',
  STARS: '⭐',
};

// Liens et URLs
export const LINKS = {
  ETHERSCAN: 'https://etherscan.io',
  METAMASK: 'https://metamask.io',
  TRUFFLE: 'https://www.trufflesuite.com',
  SOLIDITY: 'https://docs.soliditylang.org',
  WEB3_JS: 'https://web3js.readthedocs.io',
};

export default {
  NETWORK_CONFIG,
  APP_CONFIG,
  MESSAGES,
  USER_ROLES,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  EMOJIS,
  LINKS,
};
