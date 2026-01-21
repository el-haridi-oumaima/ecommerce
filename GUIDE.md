# 🛍️ Plateforme E-commerce Décentralisée - DApp Blockchain

Une **plateforme e-commerce complète et moderne** basée sur la blockchain Ethereum avec smart contracts, paiements décentralisés et interface utilisateur professionnelle.

## 📋 Caractéristiques

✅ **Authentification décentralisée** via MetaMask  
✅ **Gestion des produits** (Ajout, édition, suppression)  
✅ **Panier d'achat** persistant  
✅ **Paiements en ETH** sécurisés via smart contracts  
✅ **Suivi des commandes** en temps réel  
✅ **Système d'avis et de notations** pour les produits  
✅ **Espace vendeur** pour gérer les ventes  
✅ **Tableau de bord** avec statistiques  
✅ **Design responsive** et moderne  
✅ **Interface intuitive** et conviviale

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│          React Frontend (DApp)              │
├─────────────────────────────────────────────┤
│  Header | Navigation | Cart | Dashboard    │
├─────────────────────────────────────────────┤
│         Web3.js + MetaMask Integration      │
├─────────────────────────────────────────────┤
│        Smart Contract (EcommerceStore)      │
├─────────────────────────────────────────────┤
│    Ethereum Blockchain (Ganache Local)      │
└─────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

- **Frontend**: React 19, CSS3 moderne
- **Blockchain**: Solidity 0.8.19, Web3.js 4.x
- **Build**: Truffle, Ganache
- **Wallet**: MetaMask
- **Network**: Ganache Local (Network ID: 5777)

## 📦 Installation

### 1️⃣ Prérequis

- **Node.js** 14+ et **npm**
- **MetaMask** extension (Chrome, Firefox, etc.)
- **Ganache CLI** ou **Ganache GUI**
- **Truffle** CLI

### 2️⃣ Installation

```bash
# Installer Ganache CLI
npm install -g ganache-cli

# Installer Truffle
npm install -g truffle

# Cloner le projet
git clone <repo-url>
cd ecommerce

# Installer les dépendances
npm install
```

### 3️⃣ Configuration Ganache

```bash
# Démarrer Ganache sur le port 8545
ganache-cli --port 8545 --networkId 5777

# Ou utiliser Ganache GUI
# Paramètres: Port 8545, Network ID 5777
```

### 4️⃣ Déployer les Smart Contracts

```bash
# Compiler les contrats
truffle compile

# Déployer sur Ganache
truffle migrate --reset

# Exemple de sortie:
# Deploying 'EcommerceStore'
# contract address: 0x1234...
```

### 5️⃣ Configurer MetaMask

1. Ouvrir MetaMask
2. Ajouter un réseau personnalisé:
   - **Nom**: Ganache Local
   - **RPC URL**: http://localhost:8545
   - **Chain ID**: 5777
   - **Currency**: ETH
3. Importer un compte Ganache (clé privée)
4. ✅ Connecté !

### 6️⃣ Lancer l'application

```bash
# Terminal 1: Démarrer Ganache
ganache-cli --port 8545 --networkId 5777

# Terminal 2: Déployer les contrats
truffle migrate --reset

# Terminal 3: Démarrer l'app React
npm start

# L'app s'ouvre sur http://localhost:3000
```

## 🚀 Utilisation

### 1️⃣ Connecter votre wallet

1. Cliquez sur "🔗 Connecter MetaMask"
2. Approuvez la connexion dans MetaMask
3. Confirmez le réseau Ganache Local

### 2️⃣ S'enregistrer

1. Cliquez sur votre adresse (coin haut droit)
2. Sélectionnez "📝 S'enregistrer"
3. Entrez votre nom et rôle (Client/Vendeur)
4. Confirmez

### 3️⃣ Accéder aux produits

- **Boutique** 🏪: Voir tous les produits disponibles
- **Panier** 🛒: Gérer vos articles
- **Commandes** 📦: Suivre vos achats et ventes

### 4️⃣ Acheter un produit

1. Sélectionnez la quantité
2. Cliquez "🛒 Panier" ou "✓ Acheter"
3. Confirmez la transaction MetaMask
4. Attendez la confirmation blockchain

### 5️⃣ Vendre des produits (Vendeur)

1. Allez dans "🏪 Mon magasin"
2. Remplissez le formulaire:
   - Nom, Description, Prix (ETH), Stock, Image URL
3. Cliquez "✓ Ajouter le produit"
4. Confirmez dans MetaMask

### 6️⃣ Suivre les commandes

1. Allez dans "📦 Commandes"
2. Voir statut (Attente → Confirmée → Expédiée → Livrée)
3. Laisser un avis après livraison
4. Les vendeurs peuvent mettre à jour le statut

## 📊 Smart Contract - Fonctions principales

```solidity
// Enregistrement utilisateur
registerUser(string name, UserRole role)

// Gestion produits
addProduct(string name, description, uint price, uint stock, string imageUrl)
updateProduct(uint productId, ...)
toggleProductStatus(uint productId)

// Gestion commandes
createOrder(uint productId, uint quantity) payable
updateOrderStatus(uint orderId, OrderStatus status)
cancelOrder(uint orderId)

// Gestion panier
addToCart(uint productId, uint quantity)
removeFromCart(uint productId)
clearCart()
getCart(address user)

// Avis et notations
addReview(uint productId, uint rating, string comment)
getProductReviews(uint productId)

// Statistiques
getTotalProducts() returns (uint)
getTotalOrders() returns (uint)
getCartTotal(address user) returns (uint)
```

## 💰 Flux d'argent

```
Client paie → Smart Contract → Vendeur reçoit paiement
(direct, pas d'intermédiaire, frais de gas seulement)
```

## 🔐 Sécurité

- ✅ Vérification des rôles (Client/Vendeur/Admin)
- ✅ Validation des prix et quantités
- ✅ Protection contre le reentrancy (transfer, pas call)
- ✅ Événements blockchain pour l'audit
- ✅ Gestion des stocks (décrémentation automatique)
- ✅ Remboursement du surplus de paiement

## 📱 Responsive Design

- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

## 🐛 Troubleshooting

### "❌ Réseau incorrect"

- Vérifiez que Ganache tourne sur le port 8545
- Vérifiez le Network ID (doit être 5777)
- Déconnectez/reconnectez MetaMask

### "❌ Contrat non déployé"

```bash
truffle migrate --reset
```

### "❌ MetaMask non détecté"

- Installez l'extension MetaMask
- Rafraîchissez la page

### Transaction échouée

- Vérifiez le solde ETH du compte
- Vérifiez le gas suffisant
- Regardez les logs Ganache pour les erreurs

## 📚 Fichiers importants

```
ecommerce/
├── contracts/
│   └── EcommerceStore.sol          # Smart contract principal
├── migrations/
│   └── 2_deploy_contracts.js       # Déploiement
├── src/
│   ├── App.js                      # App principale
│   ├── App.css                     # Styles globaux
│   ├── components/
│   │   ├── Header.js               # Navigation
│   │   ├── ProductCard.js          # Carte produit
│   │   ├── Cart.js                 # Panier
│   │   ├── Orders.js               # Commandes
│   │   ├── Dashboard.js            # Tableau de bord
│   │   └── SellerPanel.js          # Espace vendeur
│   ├── styles/                     # CSS modernes
│   │   ├── Header.css
│   │   ├── ProductCard.css
│   │   ├── Cart.css
│   │   ├── Orders.css
│   │   ├── SellerPanel.css
│   │   └── Dashboard.css
│   └── utils/
│       ├── web3.js                 # Connexion Web3
│       └── helpers.js              # Utilitaires
├── public/
│   └── index.html
├── package.json
├── truffle-config.js
└── README.md
```

## 🧪 Tests

```bash
# Tester les contrats
truffle test

# Compiler
truffle compile

# Vérifier la syntaxe
solc --version
```

## 📈 Améliorations futures

- [ ] Système de notation avancé (5 étoiles)
- [ ] Historique complet des transactions
- [ ] Multicurrencies
- [ ] Système de coupons et codes promo
- [ ] Authentification 2FA
- [ ] Paiement par d'autres cryptos
- [ ] Intégration IPFS pour images
- [ ] Dashboard Admin avancé
- [ ] Tests unitaires complets
- [ ] Documentation API

## 📝 License

MIT

## 👨‍💻 Auteur

Projet de fin d'étude - Formation Blockchain & Solidity

## 📞 Support

Pour toute question ou problème, veuillez:

1. Consulter le troubleshooting ci-dessus
2. Vérifier les logs Ganache et navigateur (F12)
3. Lire la documentation Truffle/Web3.js

---

**Bonne utilisation ! 🚀**
