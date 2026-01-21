import React from 'react';
import '../styles/Dashboard.css';

function Dashboard({ contract, account, web3, currentUser }) {
  const [stats, setStats] = React.useState({
    totalProducts: 0,
    totalOrders: 0,
    totalVolume: '0',
    userPurchases: '0',
    userEarnings: '0',
  });

  React.useEffect(() => {
    const loadStats = async () => {
      if (!contract) return;

      try {
        const totalProducts = await contract.methods.getTotalProducts().call();
        const totalOrders = await contract.methods.getTotalOrders().call();
        const totalVolume = await contract.methods.totalTransactionVolume().call();
        const user = await contract.methods.getUser(account).call();

        setStats({
          totalProducts,
          totalOrders,
          totalVolume: web3.utils.fromWei(totalVolume, 'ether'),
          userPurchases: web3.utils.fromWei(user.totalPurchases, 'ether'),
          userEarnings: web3.utils.fromWei(user.totalEarnings, 'ether'),
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadStats();
  }, [contract, account, web3]);

  return (
    <div className="dashboard">
      <h2>📊 Tableau de Bord</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Produits totaux</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Commandes totales</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Volume d'échange</h3>
            <p className="stat-value">{parseFloat(stats.totalVolume).toFixed(4)} ETH</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Mes achats</h3>
            <p className="stat-value">{parseFloat(stats.userPurchases).toFixed(4)} ETH</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3>Mes revenus</h3>
            <p className="stat-value">{parseFloat(stats.userEarnings).toFixed(4)} ETH</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <h3>Mon compte</h3>
            <p className="stat-value">{account.slice(0, 6)}...{account.slice(-4)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-info">
        <h3>ℹ️ À propos</h3>
        <p>
          Bienvenue sur la plateforme e-commerce décentralisée. Tous les paiements sont sécurisés par la blockchain Ethereum.
          Consultez votre panier, passez des commandes et suivez l'historique de vos transactions.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
