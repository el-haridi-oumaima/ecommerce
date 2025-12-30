import React, { useEffect, useState } from 'react';
import './App.css';
import getWeb3 from './utils/web3';
import contractArtifact from './contracts/EcommerceStore.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        // 1️⃣ Init web3
        const web3Instance = await getWeb3();
        const accs = await web3Instance.eth.getAccounts();
        const networkId = await web3Instance.eth.net.getId();

        console.log('Network ID:', networkId);

        // 2️⃣ Vérification réseau Ganache
        if (networkId !== 5777) {
          setStatus(
            `❌ Réseau incorrect (${networkId}). 
Veuillez connecter MetaMask à Ganache (Network ID: 5777).`
          );
          return;
        }

        // 3️⃣ Vérification contrat déployé
        const networkData = contractArtifact.networks[networkId];
        if (!networkData || !networkData.address) {
          setStatus(
            `❌ Contrat EcommerceStore non déployé sur Ganache.
Veuillez exécuter : truffle migrate --reset`
          );
          return;
        }

        console.log('Contract address:', networkData.address);

        // 4️⃣ Création instance du contrat
        const instance = new web3Instance.eth.Contract(
          contractArtifact.abi,
          networkData.address
        );

        setWeb3(web3Instance);
        setAccounts(accs);
        setContract(instance);

        // 5️⃣ Test de lecture
        const total = await instance.methods.getTotalProducts().call();
        console.log('Total products:', total);

        // 6️⃣ Chargement produits
        const prods = await instance.methods.getAllProducts().call();
        setProducts(prods);

        const q = {};
        prods.forEach((p) => (q[p.id] = 1));
        setQuantities(q);

        setStatus('✅ Connecté à Ganache');
      } catch (err) {
        console.error(err);
        setStatus('❌ Erreur : ' + (err.message || err));
      }
    };

    init();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus('❌ MetaMask non détecté');
      return;
    }
    try {
      const accs = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccounts(accs);
      setStatus('✅ Wallet connecté');
    } catch (err) {
      setStatus(err.message || String(err));
    }
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities({ ...quantities, [productId]: Number(value) });
  };

  const buy = async (product) => {
    if (!contract) return setStatus('❌ Contrat non chargé');
    if (!accounts.length) return setStatus('❌ Connectez MetaMask');

    try {
      const qty = quantities[product.id] || 1;
      const priceBN = web3.utils.toBN(product.price);
      const totalBN = priceBN.mul(web3.utils.toBN(qty));

      setStatus('⏳ Transaction en cours...');

      await contract.methods.createOrder(product.id, qty).send({
        from: accounts[0],
        value: totalBN.toString(),
      });

      setStatus('✅ Achat effectué');

      // Refresh produits
      const prods = await contract.methods.getAllProducts().call();
      setProducts(prods);
    } catch (err) {
      setStatus('❌ ' + (err.message || err));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Plateforme E-commerce décentralisée</h1>
        <div className="wallet">
          {accounts.length ? (
            <span>Compte: {accounts[0]}</span>
          ) : (
            <button onClick={connectWallet}>Connecter MetaMask</button>
          )}
        </div>
      </header>

      <main>
        {status && <div className="status">{status}</div>}

        <section className="products">
          {products.length ? (
            products.map((p) => (
              <div key={p.id} className="product-card">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="product-image"
                />
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <p>
                  <strong>Prix :</strong>{' '}
                  {web3.utils.fromWei(p.price, 'ether')} ETH
                </p>
                <p>
                  <strong>Stock :</strong> {p.stock}
                </p>

                <input
                  type="number"
                  min="1"
                  max={p.stock}
                  value={quantities[p.id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(p.id, e.target.value)
                  }
                />

                <button onClick={() => buy(p)}>Acheter</button>
              </div>
            ))
          ) : (
            <p>Aucun produit trouvé.</p>
          )}
        </section>
      </main>

      <footer>
        <p>Ecommerce décentralisé – Ganache Local</p>
      </footer>
    </div>
  );
}

export default App;
