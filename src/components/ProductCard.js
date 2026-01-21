import React from 'react';
import '../styles/ProductCard.css';

function ProductCard({ product, onAddToCart, onBuyNow, web3 }) {
  const [quantity, setQuantity] = React.useState(1);

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= product.stock) {
      onAddToCart(product, quantity);
      setQuantity(1);
    }
  };

  const handleBuyNow = () => {
    if (quantity > 0 && quantity <= product.stock) {
      onBuyNow(product, quantity);
    }
  };

  const priceInEth = web3 ? web3.utils.fromWei(product.price, 'ether') : 0;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200?text=No+Image';
          }}
        />
        {product.stock === 0 && <div className="out-of-stock">Rupture de stock</div>}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>

        <div className="product-rating">
          <span className="stars">⭐ {product.rating || 0} ({product.totalReviews || 0})</span>
        </div>

        <div className="product-meta">
          <p className="product-price">
            <strong>{parseFloat(priceInEth).toFixed(4)} ETH</strong>
          </p>
          <p className="product-stock">
            Stock: <strong>{product.stock}</strong>
          </p>
        </div>

        <div className="product-actions">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock))}
            className="quantity-input"
            disabled={product.stock === 0}
          />
          <button
            className="btn btn-cart"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            title="Ajouter au panier"
          >
            🛒 Panier
          </button>
          <button
            className="btn btn-buy"
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            title="Acheter maintenant"
          >
            ✓ Acheter
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
