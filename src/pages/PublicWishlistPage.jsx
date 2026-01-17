import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import GiftCard from '../components/GiftCard'
import Modal from '../components/Modal'
import { getPublicWishlist, reserveGift } from '../services/api'
import './PublicWishlistPage.css'

function PublicWishlistPage() {
    const { secret_link } = useParams();

    const [wishlist, setWishlist] = useState(null);
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showReserveModal, setShowReserveModal] = useState(false);
    const [selectedGift, setSelectedGift] = useState(null);
    const [reserveMessage, setReserveMessage] = useState('');
    const [isReserving, setIsReserving] = useState(false);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setLoading(true);
                const data = await getPublicWishlist(secret_link);
                setWishlist(data.wishlist);
                setGifts(data.gifts);
                setError(null);
            } catch (err) {
                setError(err.message || 'Impossibile caricare la wishlist');
            } finally {
                setLoading(false);
            }
        };

        if (secret_link) {
            fetchWishlist();
        }
    }, [secret_link]);

    const handleOpenReserve = (gift) => {
        setSelectedGift(gift);
        setReserveMessage('');
        setShowReserveModal(true);
    };

    const handleConfirmReserve = async () => {
        if (!selectedGift) return;

        try {
            setIsReserving(true);
            const updated = await reserveGift(selectedGift.id, reserveMessage);

            setGifts(gifts.map(g =>
                g.id === updated.id ? updated : g
            ));

            setShowReserveModal(false);
            setSelectedGift(null);
            setReserveMessage('');

            alert('🎁 Regalo prenotato con successo!');
        } catch (error) {
            alert('Errore: ' + error.message);
        } finally {
            setIsReserving(false);
        }
    };

    const handleCloseModal = () => {
        setShowReserveModal(false);
        setSelectedGift(null);
        setReserveMessage('');
    };

    if (loading) {
        return (
            <div className="public-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Caricamento wishlist...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="public-page">
                <div className="container">
                    <div className="error-state card">
                        <h2>❌ Errore</h2>
                        <p>{error}</p>
                        <p>Verifica che il link sia corretto.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="public-page">
            <div className="container">
                <div className="wishlist-header card">
                    <div className="header-content">
                        <h1>{wishlist.title}</h1>
                        {wishlist.owner_name && (
                            <p className="owner-name">Wishlist di {wishlist.owner_name}</p>
                        )}
                    </div>
                    <div className="wishlist-badge">📋 Vista Pubblica</div>
                </div>

                <div className="gifts-info card">
                    <p>
                        Totale regali: <strong>{gifts.length}</strong>
                    </p>
                    <p>
                        Disponibili: <strong>{gifts.filter(g => !g.is_reserved).length}</strong>
                    </p>
                    <p>
                        Prenotati: <strong>{gifts.filter(g => g.is_reserved).length}</strong>
                    </p>
                </div>

                <div className="gifts-grid">
                    {gifts.length === 0 ? (
                        <div className="empty-state card">
                            <p>📦 Nessun regalo in questa wishlist.</p>
                        </div>
                    ) : (
                        gifts.map(gift => (
                            <GiftCard
                                key={gift.id}
                                gift={gift}
                                onReserve={handleOpenReserve}
                                isPublic={true}
                            />
                        ))
                    )}
                </div>
            </div>

            <Modal
                isOpen={showReserveModal}
                onClose={handleCloseModal}
                title="Prenota Regalo"
            >
                {selectedGift && (
                    <div className="reserve-modal-content">
                        <p className="reserve-gift-name">
                            <strong>{selectedGift.gift_name}</strong>
                        </p>

                        <div className="form-group">
                            <label htmlFor="reserve-message">
                                Vuoi lasciare un messaggio pubblico? (opzionale)
                            </label>
                            <textarea
                                id="reserve-message"
                                value={reserveMessage}
                                onChange={(e) => setReserveMessage(e.target.value)}
                                placeholder="es. Ho pensato a te! 🎁"
                                rows={3}
                                disabled={isReserving}
                            />
                            <small className="form-hint">
                                Il proprietario della wishlist vedrà questo messaggio
                            </small>
                        </div>

                        <div className="modal-actions">
                            <button
                                onClick={handleCloseModal}
                                className="btn-secondary"
                                disabled={isReserving}
                            >
                                Annulla
                            </button>
                            <button
                                onClick={handleConfirmReserve}
                                className="btn-success"
                                disabled={isReserving}
                            >
                                {isReserving ? 'Prenotazione...' : 'Conferma Prenotazione'}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default PublicWishlistPage;
