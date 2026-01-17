import './GiftCard.css'

function GiftCard({ gift, onEdit, onDelete, onReserve, isPublic = false }) {
    const renderStars = (priority) => {
        return '⭐'.repeat(priority);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    return (
        <div className="gift-card">
            <img
                src={gift.image_url}
                alt={gift.gift_name}
                className="gift-card-image"
            />

            <div className="gift-card-content">
                <h3 className="gift-card-title">{gift.gift_name}</h3>

                <div className="gift-card-info">
                    <span className="gift-card-price">{formatPrice(gift.price)}</span>
                    <span className="gift-card-priority" title={`Priorità: ${gift.priority_gift}/5`}>
                        {renderStars(gift.priority_gift)}
                    </span>
                </div>

                {gift.notes && (
                    <p className="gift-card-notes">{gift.notes}</p>
                )}

                <a
                    href={gift.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gift-card-link"
                >
                    Vedi prodotto →
                </a>

                {gift.is_reserved && (
                    <>
                        <div className="reserved-badge">🎁 Prenotato</div>
                        {gift.reservation_message && (
                            <div className="reservation-message">
                                💬 {gift.reservation_message}
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="gift-card-actions">
                {!isPublic ? (
                    <>
                        <button
                            onClick={() => onEdit(gift)}
                            className="btn-secondary"
                        >
                            ✏️ Modifica
                        </button>
                        <button
                            onClick={() => onDelete(gift.id)}
                            className="btn-danger"
                        >
                            🗑️ Elimina
                        </button>
                    </>
                ) : (
                    !gift.is_reserved && (
                        <button
                            onClick={() => onReserve(gift)}
                            className="btn-success"
                        >
                            🎁 Prenota questo regalo
                        </button>
                    )
                )}
            </div>
        </div>
    );
}

export default GiftCard;
