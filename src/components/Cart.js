import React from 'react';
import '../styles/Cart.css';

function Cart({ cart, products, web3, onCheckout, onRemove, onClear }) {
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const product = products[item.productId];
      if (product) {
        const price = web3.utils.toBN(product.price);
        return total.add(price.mul(web3.utils.toBN(item.quantity)));
      }
      return total;
    }, web3.utils.toBN(0));
  };

  const total = calculateTotal();
  const totalEth = web3.utils.fromWei(total.toString(), 'ether');

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <h3>Votre panier est vide</h3>
        <p>Ajoutez des produits pour commencer vos achats</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>🛒 Votre Panier</h2>

      <div className="cart-items">
        {cart.map((item) => {
          const product = products[item.productId];
          if (!product) return null;

          const itemPrice = web3.utils.fromWei(product.price, 'ether');
          const itemTotal = parseFloat(itemPrice) * item.quantity;

          return (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-info">
                <h4>{product.name}</h4>
                <p>{product.description}</p>
              </div>

              <div className="cart-item-details">
                <p>
                  <strong>{parseFloat(itemPrice).toFixed(4)} ETH</strong> x {item.quantity} = <strong>{itemTotal.toFixed(4)} ETH</strong>
                </p>
              </div>

              <button
                className="btn-remove"
                onClick={() => onRemove(item.productId)}
                title="Supprimer du panier"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Nombre d'articles:</span>
          <strong>{cart.length}</strong>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <strong>{parseFloat(totalEth).toFixed(4)} ETH</strong>
        </div>
      </div>

      <div className="cart-actions">
        <button className="btn btn-secondary" onClick={onClear}>
          Vider le panier
        </button>
        <button className="btn btn-primary" onClick={() => onCheckout(total)}>
          Procéder au paiement →
        </button>
      </div>
    </div>
  );
}

export default Cart;
