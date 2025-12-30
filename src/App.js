import React, { useEffect, useState } from 'react';
import './App.css';
import getWeb3 from './utils/web3';
import contractArtifact from './contracts/EcommerceStore.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = await getWeb3();
        const accs = await web3Instance.eth.getAccounts();
        const detectedNetworkId = await web3Instance.eth.net.getId();
        setNetworkId(detectedNetworkId);
        const networks = contractArtifact.networks || {};
        let net = networks[detectedNetworkId] || networks[String(detectedNetworkId)];

        // If the exact network id isn't found in the artifact, try a fallback to the first available network
        if (!net || !net.address) {
          const available = Object.keys(networks || {});
          if (available.length > 0) {
            const fallbackId = available[0];
            net = networks[fallbackId];
            setStatus(
              `Réseau MetaMask (${detectedNetworkId}) ne correspond pas à l'artifact. Utilisation de l'adresse déployée sur le réseau ${fallbackId} (${net.address}). Assurez-vous que MetaMask pointe sur Ganache (RPC http://127.0.0.1:7545, network id 5777).`
            );
          } else {
            setStatus(`Aucune adresse de contrat trouvée dans l'artifact. Vérifiez le déploiement.`);
            setWeb3(web3Instance);
            setAccounts(accs);
            return;
          }
        }

        const instance = new web3Instance.eth.Contract(contractArtifact.abi, net.address);
        setWeb3(web3Instance);
        setAccounts(accs);
        setContract(instance);
        setContractAddress(net.address);

        const prods = await instance.methods.getAllProducts().call();
        setProducts(prods);
        // initialise quantités
        const q = {};
        prods.forEach((p) => (q[p.id] = 1));
        setQuantities(q);
      } catch (err) {
        setStatus(err.message || String(err));
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return setStatus('MetaMask non détecté');
    try {
      const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccounts(accs);
      setStatus('Connecté : ' + accs[0]);
    } catch (err) {
      setStatus(err.message || String(err));
    }
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities({ ...quantities, [productId]: Number(value) });
  };

  const buy = async (product) => {
    if (!contract) return setStatus('Contrat non chargé');
    if (!accounts || accounts.length === 0) return setStatus('Connectez MetaMask');
    const qty = quantities[product.id] || 1;
    try {
      setStatus('Envoi de la transaction...');
      // use BN to compute total in wei to avoid BigInt ESLint issues
      const priceBN = web3.utils.toBN(product.price.toString());
      const totalBN = priceBN.mul(web3.utils.toBN(qty));
      await contract.methods.createOrder(product.id, qty).send({ from: accounts[0], value: totalBN.toString() });
      setStatus('Achat effectué avec succès');
      // refresh products and orders if needed
      const prods = await contract.methods.getAllProducts().call();
      setProducts(prods);
    } catch (err) {
      setStatus(err.message || String(err));
    }
  };

  const renderProduct = (p) => {
    const priceEth = web3 ? web3.utils.fromWei(p.price.toString(), 'ether') : p.price;
    return (
      <div key={p.id} className="product-card">
        <img src={p.imageUrl || '/placeholder.png'} alt={p.name} className="product-image" />
        <h3>{p.name}</h3>
        <p>{p.description}</p>
        <p><strong>Prix:</strong> {priceEth} ETH</p>
        <p><strong>Stock:</strong> {p.stock}</p>
        <div className="purchase-row">
          <input
            type="number"
            min="1"
            max={p.stock}
            value={quantities[p.id] || 1}
            onChange={(e) => handleQuantityChange(p.id, e.target.value)}
          />
          <button onClick={() => buy(p)}>Acheter</button>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Plateforme E-commerce décentralisée</h1>
        <div className="wallet">
          {accounts && accounts.length > 0 ? (
            <span>Compte: {accounts[0]}</span>
          ) : (
            <button onClick={connectWallet}>Connecter MetaMask</button>
          )}
        </div>
      </header>

      <main>
        {status && <div className="status">{status}</div>}

        <section className="products">
          {products && products.length > 0 ? (
            products.map((p) => renderProduct(p))
          ) : (
            <p>Aucun produit trouvé.</p>
          )}
        </section>
      </main>

      <footer>
        <p>Développé avec smart contracts Ethereum local (Ganache)</p>
      </footer>
    </div>
  );
}

export default App;
