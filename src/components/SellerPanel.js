import React, { useState } from 'react';
import '../styles/SellerPanel.css';

function SellerPanel({ contract, account, web3, sellerProducts, products }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!contract) return;

    if (!form.name || !form.description || !form.price || !form.stock) {
      setMessage('❌ Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage('⏳ Ajout du produit...');

      const priceWei = web3.utils.toWei(form.price, 'ether');

      await contract.methods
        .addProduct(form.name, form.description, priceWei, form.stock, form.imageUrl || 'https://via.placeholder.com/200')
        .send({ from: account });

      setMessage('✅ Produit ajouté avec succès !');
      setForm({ name: '', description: '', price: '', stock: '', imageUrl: '' });
    } catch (error) {
      setMessage(`❌ Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="seller-panel">
      <h2>🏪 Espace Vendeur</h2>

      <div className="seller-content">
        <div className="seller-form-section">
          <h3>➕ Ajouter un nouveau produit</h3>

          {message && <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}

          <form onSubmit={handleAddProduct} className="seller-form">
            <div className="form-group">
              <label>Nom du produit *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: iPhone 14 Pro"
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Décrivez votre produit..."
                rows="3"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Prix (ETH) *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.5"
                  step="0.01"
                  min="0.001"
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="10"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>URL de l'image</label>
              <input
                type="text"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? '⏳ Ajout...' : '✓ Ajouter le produit'}
            </button>
          </form>
        </div>

        <div className="seller-products-section">
          <h3>📊 Vos produits ({sellerProducts.length})</h3>

          {sellerProducts.length === 0 ? (
            <div className="empty-state">
              <p>Vous n'avez pas encore créé de produits</p>
            </div>
          ) : (
            <div className="seller-products-list">
              {sellerProducts.map((productId) => {
                const product = products[productId];
                if (!product) return null;

                const priceEth = web3.utils.fromWei(product.price, 'ether');

                return (
                  <div key={productId} className="seller-product-item">
                    <div className="seller-product-info">
                      <h4>{product.name}</h4>
                      <p>{product.description}</p>
                      <div className="seller-product-meta">
                        <span className="price">{parseFloat(priceEth).toFixed(4)} ETH</span>
                        <span className="stock">Stock: {product.stock}</span>
                        <span className="sales">Ventes: {product.totalSales}</span>
                        <span className="rating">⭐ {product.rating || 0}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerPanel;
