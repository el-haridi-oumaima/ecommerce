# 🐛 GUIDE DE TROUBLESHOOTING

## ❌ Problèmes courants et solutions

---

### 1️⃣ "Réseau incorrect (Network ID: X)"

**Cause:** MetaMask n'est pas connecté à Ganache

**Solutions:**

```bash
# Vérifier Ganache est lancé
ganache-cli --port 8545 --networkId 5777

# Vérifier le port 8545 est libre
netstat -an | grep 8545

# Redémarrer Ganache
```

**MetaMask:**

1. Ajouter réseau personnalisé
2. Nom: "Ganache Local"
3. RPC: http://localhost:8545
4. Chain ID: 5777
5. Symbole: ETH
6. Sauvegarder et sélectionner

---

### 2️⃣ "Contrat non déployé"

**Cause:** Les smart contracts n'ont pas été déployés

**Solutions:**

```bash
# Compiler
truffle compile

# Déployer
truffle migrate --reset

# Vérifier la compilation
truffle compile --verbose
```

**Vérifications:**

- Ganache est lancé ?
- Dossier `build/` existe ?
- `build/contracts/EcommerceStore.json` existe ?

---

### 3️⃣ "MetaMask non détecté"

**Cause:** Extension MetaMask n'est pas installée ou pas accessible

**Solutions:**

1. Installer l'extension Chrome/Firefox
2. Créer un compte MetaMask
3. Rafraîchir la page du navigateur (F5)
4. Vérifier la console (F12) pour les erreurs

---

### 4️⃣ Transaction échouée

**Erreur:** "Gas out of gas" ou "Revert"

**Solutions:**

```javascript
// Augmenter le gas dans App.js
gas: 5000000,
gasPrice: web3.utils.toWei('20', 'gwei'),
```

**Vérifications:**

- Compte a des ETH suffisants
- Prix du produit > 0
- Stock suffisant
- Pas de boucles infinies

---

### 5️⃣ Panier vide après rafraîchissement

**Cause:** Pas de persistance localStorage

**Solution:** Ajouter localStorage dans App.js

```javascript
// Sauvegarder le panier
useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);

// Charger le panier
useEffect(() => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) setCart(JSON.parse(savedCart));
}, []);
```

---

### 6️⃣ Page blanche / App ne charge pas

**Solutions:**

1. Ouvrir la console (F12)
2. Vérifier les erreurs
3. Vérifier que React est lancé: `npm start`
4. Vérifier port 3000 est libre

```bash
# Redémarrer React
npm start

# Ou sur un port différent
PORT=3001 npm start
```

---

### 7️⃣ "Cannot read properties of null"

**Cause:** Web3 ou contrat pas initialisé

**Vérifications:**

```javascript
if (!web3) return setStatus("❌ Web3 non chargé");
if (!contract) return setStatus("❌ Contrat non chargé");
if (!accounts.length) return setStatus("❌ Connectez MetaMask");
```

---

### 8️⃣ Images produit ne s'affichent pas

**Solution:** Vérifier les URLs des images

```javascript
// Dans ProductCard.js
onError={(e) => {
  e.target.src = 'https://via.placeholder.com/200?text=No+Image';
}}
```

**URLs de test:**

- https://via.placeholder.com/200
- https://picsum.photos/200
- https://dummyimage.com/200

---

### 9️⃣ "Address is a required argument"

**Cause:** Pas de compte sélectionné dans MetaMask

**Solutions:**

1. Importer un compte Ganache dans MetaMask
2. Vérifier qu'un compte est sélectionné
3. Vérifier qu'il a un solde d'ETH

---

### 🔟 "Insufficient funds"

**Cause:** Le compte n'a pas assez d'ETH

**Solutions:**

```bash
# Vérifier le solde dans Ganache
# Les comptes Ganache reçoivent 100 ETH par défaut

# Importer nouveau compte Ganache si solde zéro
# Les clés privées s'affichent au démarrage de ganache-cli
```

---

## 🔍 DÉBOGUER AVEC LES LOGS

### Console Navigateur (F12)

```javascript
// Ajouter des logs dans App.js
console.log("Web3:", web3);
console.log("Accounts:", accounts);
console.log("Contract:", contract);
console.log("Products:", products);
console.log("Cart:", cart);

// Vérifier Web3
console.log("Web3 version:", web3.version);
console.log("Network ID:", await web3.eth.net.getId());
```

### Logs Ganache

```bash
# Démarrer Ganache avec logs verbose
ganache-cli --port 8545 --networkId 5777 --verbose

# Observez les transactions :
# [eth_getAccounts]
# [eth_call]
# [eth_sendTransaction]
```

### Logs Truffle

```bash
# Compiler avec verbose
truffle compile --verbose

# Déployer avec debug
truffle migrate --reset --verbose
```

---

## 📊 OUTILS DE DEBUG

### 1. MetaMask DevTools

- Chrome: Inspect → Console
- Vérifier `window.ethereum`
- Tester `eth_accounts`, `eth_sendTransaction`

### 2. Web3.js

```javascript
// Tester Web3 dans la console
web3.eth.getAccounts().then(console.log);
web3.eth.getBalance("0x...").then(console.log);
```

### 3. Ganache CLI

```bash
# Voir les transactions
ganache-cli --port 8545 --verbose

# Exporter l'état
ganache-cli --deterministic
```

### 4. Ethers.js (Alternative)

```javascript
// Importer ethers au lieu de web3
import { ethers } from "ethers";
```

---

## 🔐 PROBLÈMES DE SÉCURITÉ

### "Transaction cancelled by user"

- L'utilisateur a refusé dans MetaMask
- Solution: Cliquer sur "Confirmer"

### "Only registered users..."

- L'utilisateur n'est pas enregistré
- Solution: Enregistrer d'abord

### "Only sellers..."

- L'utilisateur n'est pas vendeur
- Solution: S'enregistrer comme Vendeur

---

## ⚡ OPTIMISATIONS

### Réduire le gas

```javascript
// Avant
await contract.methods.func().send({ from: account, gas: 3000000 });

// Après
await contract.methods.func().send({ from: account, gas: 100000 });
```

### Cachier les appels

```javascript
// Éviter les appels répétés
const [cachedData, setCachedData] = useState(null);
const [lastFetch, setLastFetch] = useState(0);

if (Date.now() - lastFetch > 5000) {
  // Refetch après 5s
}
```

---

## 🆘 SUPPORT AVANCÉ

### Réinitialiser complètement

```bash
# 1. Arrêter tous les services
# Ctrl+C dans tous les terminaux

# 2. Nettoyer les fichiers
rm -rf node_modules
rm -rf build
npm cache clean --force

# 3. Réinstaller
npm install
truffle compile

# 4. Redémarrer Ganache
ganache-cli --port 8545 --networkId 5777 --deterministic

# 5. Redéployer
truffle migrate --reset

# 6. Relancer React
npm start
```

### Changer le port Ganache

```bash
# Si 8545 est occupé
ganache-cli --port 8546 --networkId 5777

# Mettre à jour MetaMask: http://localhost:8546
```

---

## 📞 CONTACTS ET RESSOURCES

- **Truffle Docs**: https://www.trufflesuite.com/docs
- **Web3.js**: https://web3js.readthedocs.io
- **Solidity**: https://docs.soliditylang.org
- **MetaMask**: https://metamask.io/
- **Ganache**: https://www.trufflesuite.com/ganache

---

## ✅ CHECKLIST DE DEBUG

- [ ] Ganache lancé sur port 8545
- [ ] Network ID 5777 dans MetaMask
- [ ] Compte Ganache importé dans MetaMask
- [ ] Account a des ETH (100 par défaut)
- [ ] Smart Contract compilé
- [ ] Smart Contract déployé
- [ ] React app lancée sur port 3000
- [ ] Pas d'erreurs en console (F12)
- [ ] Contrat ABI disponible
- [ ] Web3.js initialisé

---

**Besoin de plus d'aide? Vérifiez les logs! 🔍**
