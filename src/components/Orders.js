import React, { useState } from 'react';
import '../styles/Orders.css';

function Orders({ orders, products, web3, onUpdateStatus, onCancel, onReview, currentUser, userRole }) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [reviewData, setReviewData] = useState({});

  const getOrderStatus = (status) => {
    const statuses = {
      0: { label: 'En attente', color: '#FFA500' },
      1: { label: 'Confirmée', color: '#4CAF50' },
      2: { label: 'Expédiée', color: '#2196F3' },
      3: { label: 'Livrée', color: '#8BC34A' },
      4: { label: 'Annulée', color: '#F44336' },
    };
    return statuses[status] || { label: 'Inconnu', color: '#999' };
  };

  const handleStatusChange = (orderId, newStatus) => {
    onUpdateStatus(orderId, newStatus);
  };

  const handleReviewSubmit = (orderId) => {
    const review = reviewData[orderId];
    if (review && review.rating && review.comment) {
      onReview(orderId, review.rating, review.comment);
      setReviewData({ ...reviewData, [orderId]: {} });
    }
  };

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <div className="empty-icon">📦</div>
        <h3>Aucune commande</h3>
        <p>Vous n'avez pas encore passé de commande</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>📦 Historique des Commandes</h2>

      <div className="orders-list">
        {orders.map((order) => {
          const product = products[order.productId];
          const status = getOrderStatus(order.status);
          const priceEth = web3.utils.fromWei(order.totalPrice, 'ether');
          const isBuyer = currentUser.toLowerCase() === order.buyer.toLowerCase();
          const isSeller = currentUser.toLowerCase() === order.seller.toLowerCase();

          return (
            <div key={order.id} className="order-item">
              <div
                className="order-header"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="order-title">
                  <h4>Commande #{order.id}</h4>
                  <span className="order-date">
                    {new Date(order.timestamp * 1000).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <div className="order-summary">
                  <span className="product-name">{product?.name}</span>
                  <span className="order-qty">x{order.quantity}</span>
                  <span className="order-price">{parseFloat(priceEth).toFixed(4)} ETH</span>
                </div>

                <div className="order-status" style={{ color: status.color }}>
                  <span>● {status.label}</span>
                  <span className="expand-icon">{expandedOrder === order.id ? '▼' : '▶'}</span>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="order-details">
                  <div className="details-row">
                    <label>Produit:</label>
                    <value>{product?.name}</value>
                  </div>

                  <div className="details-row">
                    <label>Quantité:</label>
                    <value>{order.quantity}</value>
                  </div>

                  <div className="details-row">
                    <label>Prix total:</label>
                    <value>{parseFloat(priceEth).toFixed(4)} ETH</value>
                  </div>

                  <div className="details-row">
                    <label>Acheteur:</label>
                    <value>{order.buyer.slice(0, 6)}...{order.buyer.slice(-4)}</value>
                  </div>

                  <div className="details-row">
                    <label>Vendeur:</label>
                    <value>{order.seller.slice(0, 6)}...{order.seller.slice(-4)}</value>
                  </div>

                  <div className="order-actions">
                    {isSeller && order.status < 4 && (
                      <div className="seller-actions">
                        <label>Mettre à jour le statut:</label>
                        <select
                          onChange={(e) => handleStatusChange(order.id, parseInt(e.target.value))}
                          defaultValue={order.status}
                          className="status-select"
                        >
                          <option value={0}>En attente</option>
                          <option value={1}>Confirmée</option>
                          <option value={2}>Expédiée</option>
                          <option value={3}>Livrée</option>
                        </select>
                      </div>
                    )}

                    {isBuyer && order.status === 4 && (
                      <button className="btn btn-danger" onClick={() => onCancel(order.id)}>
                        Annuler la commande
                      </button>
                    )}

                    {isBuyer && order.status === 3 && !order.isReviewed && (
                      <div className="review-form">
                        <h5>Laisser un avis</h5>
                        <select
                          value={reviewData[order.id]?.rating || ''}
                          onChange={(e) =>
                            setReviewData({
                              ...reviewData,
                              [order.id]: { ...reviewData[order.id], rating: parseInt(e.target.value) },
                            })
                          }
                          className="review-rating"
                        >
                          <option value="">Sélectionner une note (1-5)</option>
                          <option value="1">⭐ 1 - Mauvais</option>
                          <option value="2">⭐⭐ 2 - Acceptable</option>
                          <option value="3">⭐⭐⭐ 3 - Bon</option>
                          <option value="4">⭐⭐⭐⭐ 4 - Très bon</option>
                          <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                        </select>

                        <textarea
                          placeholder="Votre commentaire..."
                          value={reviewData[order.id]?.comment || ''}
                          onChange={(e) =>
                            setReviewData({
                              ...reviewData,
                              [order.id]: { ...reviewData[order.id], comment: e.target.value },
                            })
                          }
                          className="review-comment"
                          rows="3"
                        />

                        <button
                          className="btn btn-primary"
                          onClick={() => handleReviewSubmit(order.id)}
                        >
                          Publier l'avis
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;
