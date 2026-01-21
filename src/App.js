import React, { useEffect, useState } from 'react';
import './App.css';
import getWeb3 from './utils/web3';
import contractArtifact from './contracts/EcommerceStore.json';

// Composants
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Orders from './components/Orders';
import SellerPanel from './components/SellerPanel';
import Dashboard from './components/Dashboard';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [products, setProducts] = useState({});
  const [allOrderIds, setAllOrderIds] = useState([]);
  const [orders, setOrders] = useState({});
  const [cart, setCart] = useState([]);
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('shop');
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('Client');
  const [sellerProducts, setSellerProducts] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialisation Web3 et contrat
  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('🔄 Initialisation Web3...');
        const web3Instance = await getWeb3();
        console.log('✅ Web3 connecté');
        
        const accs = await web3Instance.eth.getAccounts();
        console.log('✅ Comptes:', accs);
        
        const networkId = await web3Instance.eth.net.getId();
        console.log('✅ Network ID:', networkId);

        if (networkId !== 5777) {
          const errMsg = `❌ Réseau incorrect (${networkId}). Veuillez connecter MetaMask à Ganache.`;
          console.error(errMsg);
          setStatus(errMsg);
          return;
        }

        const networkData = contractArtifact.networks[networkId];
        console.log('✅ Network Data:', networkData);
        
        if (!networkData) {
          const errMsg = '❌ Contrat non déployé. Exécutez: truffle migrate --reset';
          console.error(errMsg);
          setStatus(errMsg);
          return;
        }

        console.log('🔄 Création instance contrat à:', networkData.address);
        const instance = new web3Instance.eth.Contract(contractArtifact.abi, networkData.address);
        
        setWeb3(web3Instance);
        setAccounts(accs);
        setContract(instance);
        setCurrentUser(accs[0]);
        setIsInitialized(true);
        
        console.log('🔄 Chargement des données...');
        await loadData(instance, accs[0], web3Instance);
        console.log('✅ Données chargées');
      } catch (err) {
        console.error('❌ Erreur complète:', err);
        setStatus('❌ Erreur: ' + (err.message || JSON.stringify(err)));
      }
    };

    initialize();
  }, []);

  // Charger les données
  const loadData = async (contractInstance, userAccount, web3Instance) => {
    try {
      // Charger les produits
      const allProducts = await contractInstance.methods.getAllProducts().call();
      const productsMap = {};
      allProducts.forEach((p) => {
        productsMap[p.id] = p;
      });
      setProducts(productsMap);

      // Charger les commandes
      const allOrders = await contractInstance.methods.getAllOrders().call();
      const ordersMap = {};
      const userOrderIds = [];
      allOrders.forEach((order) => {
        ordersMap[order.id] = order;
        if (order.buyer.toLowerCase() === userAccount.toLowerCase() || order.seller.toLowerCase() === userAccount.toLowerCase()) {
          userOrderIds.push(order);
        }
      });
      setOrders(ordersMap);
      setAllOrderIds(userOrderIds);

      // Charger le panier
      const userCart = await contractInstance.methods.getCart(userAccount).call();
      setCart(userCart || []);

      // Charger les infos utilisateur
      const user = await contractInstance.methods.getUser(userAccount).call();
      if (user.isRegistered) {
        setUserRole(user.role === '0' ? 'Client' : user.role === '1' ? 'Seller' : 'Admin');
      }

      // Charger les produits du vendeur
      if (user.role === '1' || user.role === 1) {
        const sellerProds = await contractInstance.methods.getSellerProducts(userAccount).call();
        setSellerProducts(sellerProds.map(id => parseInt(id)));
      }

      setStatus('✅ Plateforme chargée');
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  // Connecter wallet
  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      setStatus('❌ MetaMask non détecté');
      return;
    }
    try {
      const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccounts(accs);
      setCurrentUser(accs[0]);
      setStatus('✅ Wallet connecté');
    } catch (err) {
      setStatus('❌ ' + (err.message || err));
    }
  };

  // Déconnecter
  const handleDisconnect = () => {
    setAccounts([]);
    setCurrentUser(null);
    setStatus('🔌 Wallet déconnecté');
  };

  // S'enregistrer
  const handleRegister = async (name, role) => {
    if (!contract) return setStatus('❌ Contrat non chargé');

    try {
      setStatus('⏳ Enregistrement...');
      const roleValue = role === 'Seller' ? 1 : 0;
      await contract.methods.registerUser(name, roleValue).send({ from: currentUser });
      setStatus('✅ Enregistrement réussi !');
      setUserRole(role);

      // Recharger les données
      if (contract) {
        await loadData(contract, currentUser, web3);
      }
    } catch (err) {
      setStatus('❌ Erreur: ' + (err.message || err));
    }
  };

  // Ajouter au panier
  const handleAddToCart = async (product, quantity) => {
    if (!contract) return setStatus('❌ Contrat non chargé');

    try {
      setStatus('⏳ Ajout au panier...');
      await contract.methods.addToCart(product.id, quantity).send({ from: currentUser });
      setStatus('✅ Produit ajouté au panier');

      // Recharger panier
      const userCart = await contract.methods.getCart(currentUser).call();
      setCart(userCart || []);
    } catch (err) {
      setStatus('❌ ' + (err.message || err));
    }
  };

  // Retirer du panier
  const handleRemoveFromCart = async (productId) => {
    if (!contract) return;

    try {
      await contract.methods.removeFromCart(productId).send({ from: currentUser });
      const userCart = await contract.methods.getCart(currentUser).call();
      setCart(userCart || []);
    } catch (err) {
      setStatus('❌ ' + (err.message || err));
    }
  };

  // Vider le panier
  const handleClearCart = async () => {
    if (!contract) return;

    try {
      await contract.methods.clearCart().send({ from: currentUser });
      setCart([]);
    } catch (err) {
      setStatus('❌ ' + (err.message || err));
    }
  };

  // Passer commande
  const handleCheckout = async (total) => {
    if (!contract || cart.length === 0) return;

    try {
      setStatus('⏳ Traitement du paiement...');

      for (const item of cart) {
        const product = products[item.productId];
        const itemTotal = web3.utils.toBN(product.price).mul(web3.utils.toBN(item.quantity));

        await contract.methods.createOrder(item.productId, item.quantity).send({
          from: currentUser,
          value: itemTotal.toString(),
        });
      }

      setStatus('✅ Commande passée avec succès !');
      setCart([]);

      // Recharger les données
      await loadData(contract, currentUser, web3);
    } catch (err) {
      setStatus('❌ ' + (err.message || err));
    }
  };

  // Acheter directement
  const handleBuyNow = async (product, quantity) => {
    if (!contract) return setStatus('❌ Contrat non chargé');

    try {
      setStatus('⏳ Traitement du paiement...');
      const priceBN = web3.utils.toBN(product.price);
      const totalBN = priceBN.mul(web3.utils.toBN(quantity));

      await contract.methods.createOrder(product.id, quantity).send({
        from: currentUser,
        value: totalBN.toString(),
      });

      setStatus('✅ Achat effectué !');
      await loadData(contract, currentUser, web3);
    } catch (err) {
      setStatus('❌ ' + (err.message || err));
    }
  };

  // Mettre à jour le statut de commande
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (!contract) return;

    try {
      await contract.methods.updateOrderStatus(orderId, newStatus).send({ from: currentUser });
      setStatus('✅ Statut mis à jour');
      await loadData(contract, currentUser, web3);
    } catch (err) {
      setStatus('❌ ' + (err.message || err));
    }
  };

  // Annuler une commande
  const handleCancelOrder = async (orderId) => {
    if (!contract) return;

    try {
      setStatus('⏳ Annulation de la commande...');
      await contract.methods.cancelOrder(orderId).send({ from: currentUser });
      setStatus('✅ Commande annulée');
      await loadData(contract, currentUser, web3);
    } catch (err) {
      setStatus('❌ ' + (err.message || err));
    }
  };

  // Ajouter un avis
  const handleAddReview = async (orderId, rating, comment) => {
    if (!contract) return;

    try {
      const order = orders[orderId];
      setStatus('⏳ Publication de l\'avis...');
      await contract.methods.addReview(order.productId, rating, comment).send({ from: currentUser });
      setStatus('✅ Avis publié');
      await loadData(contract, currentUser, web3);
    } catch (err) {
      setStatus('❌ ' + (err.message || err));
    }
  };

  if (!isInitialized) {
    return <div className="loading">⏳ Chargement de la plateforme...</div>;
  }

  return (
    <div className="App">
      <Header
        accounts={accounts}
        currentUser={currentUser}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnect}
        onRegister={handleRegister}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
      />

      <main className="main-content">
        {status && <div className={`status-message ${status.includes('✅') ? 'success' : 'error'}`}>{status}</div>}

        {!currentUser ? (
          <div className="not-connected">
            <h2>Veuillez connecter votre wallet</h2>
            <button className="btn btn-primary btn-large" onClick={handleConnectWallet}>
              🔗 Connecter MetaMask
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'shop' && (
              <section className="products-section">
                <h2>🛍️ Boutique</h2>
                <div className="products-grid">
                  {Object.values(products)
                    .filter(p => p.isActive)
                    .map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        web3={web3}
                      />
                    ))}
                </div>
              </section>
            )}

            {activeTab === 'cart' && (
              <section className="cart-section">
                <Cart
                  cart={cart}
                  products={products}
                  web3={web3}
                  onCheckout={handleCheckout}
                  onRemove={handleRemoveFromCart}
                  onClear={handleClearCart}
                />
              </section>
            )}

            {activeTab === 'orders' && (
              <section className="orders-section">
                <Orders
                  orders={allOrderIds}
                  products={products}
                  web3={web3}
                  onUpdateStatus={handleUpdateOrderStatus}
                  onCancel={handleCancelOrder}
                  onReview={handleAddReview}
                  currentUser={currentUser}
                  userRole={userRole}
                />
              </section>
            )}

            {activeTab === 'seller' && userRole === 'Seller' && (
              <section className="seller-section">
                <SellerPanel
                  contract={contract}
                  account={currentUser}
                  web3={web3}
                  sellerProducts={sellerProducts}
                  products={products}
                />
              </section>
            )}

            {activeTab === 'dashboard' && (
              <section className="dashboard-section">
                <Dashboard
                  contract={contract}
                  account={currentUser}
                  web3={web3}
                  currentUser={currentUser}
                />
              </section>
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <p>🔗 Plateforme E-commerce Décentralisée | Blockchain Ethereum | Ganache Local</p>
      </footer>
    </div>
  );
}

export default App;
