import React from 'react';
import '../styles/Header.css';

function Header({ accounts, currentUser, onConnect, onDisconnect, onRegister, activeTab, setActiveTab, userRole }) {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);
  const [registerForm, setRegisterForm] = React.useState({ name: '', role: 'Client' });
  const [registering, setRegistering] = React.useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    try {
      await onRegister(registerForm.name, registerForm.role);
      setShowRegisterModal(false);
      setRegisterForm({ name: '', role: 'Client' });
    } finally {
      setRegistering(false);
    }
  };

  const displayAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <h1>🛍️ DApp E-commerce</h1>
          <p className="tagline">Plateforme décentralisée & sécurisée</p>
        </div>

        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            🏪 Boutique
          </button>
          <button
            className={`nav-tab ${activeTab === 'cart' ? 'active' : ''}`}
            onClick={() => setActiveTab('cart')}
          >
            🛒 Panier
          </button>
          <button
            className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Commandes
          </button>
          {userRole === 'Seller' && (
            <button
              className={`nav-tab ${activeTab === 'seller' ? 'active' : ''}`}
              onClick={() => setActiveTab('seller')}
            >
              🏪 Mon magasin
            </button>
          )}
          <button
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Tableau de bord
          </button>
        </nav>

        <div className="wallet-section">
          {!accounts || accounts.length === 0 ? (
            <button className="btn btn-primary" onClick={onConnect}>
              🔗 Connecter MetaMask
            </button>
          ) : (
            <div className="user-menu-container">
              <button
                className="user-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                title={currentUser}
              >
                👤 {displayAddress(currentUser)}
              </button>

              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <div className="user-menu-item">
                    <strong>Compte:</strong>
                    <code>{currentUser}</code>
                  </div>
                  <hr />
                  <button
                    className="user-menu-item"
                    onClick={() => {
                      setShowRegisterModal(true);
                      setShowUserMenu(false);
                    }}
                  >
                    📝 S'enregistrer
                  </button>
                  <button
                    className="user-menu-item"
                    onClick={() => {
                      onDisconnect();
                      setShowUserMenu(false);
                    }}
                  >
                    🚪 Déconnecter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showRegisterModal && (
        <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>📝 S'enregistrer</h3>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Nom:</label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  placeholder="Votre nom"
                  required
                />
              </div>

              <div className="form-group">
                <label>Rôle:</label>
                <select
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                >
                  <option value="Client">Client</option>
                  <option value="Seller">Vendeur</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRegisterModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={registering}>
                  {registering ? '⏳ Enregistrement...' : '✓ S\'enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
