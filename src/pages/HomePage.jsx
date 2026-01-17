import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GiftCard from '../components/GiftCard'
import { createWishlist, publishWishlist, deleteGift } from '../services/api'
import { saveDraft, loadDraft, clearDraft, hasDraft } from '../utils/localStorage'
import './HomePage.css'

function HomePage() {
    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState(null);
    const [gifts, setGifts] = useState([]);
    const [isPublished, setIsPublished] = useState(false);
    const [secretLink, setSecretLink] = useState('');
    const [showLinkModal, setShowLinkModal] = useState(false);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [title, setTitle] = useState('');
    const [ownerName, setOwnerName] = useState('');

    useEffect(() => {
        const draft = loadDraft();
        if (draft) {
            setWishlist({
                id: draft.wishlistId,
                title: draft.title,
                owner_name: draft.owner_name
            });
            setGifts(draft.gifts || []);
            setShowCreateForm(false);
        } else {
            setShowCreateForm(true);
        }
    }, []);

    useEffect(() => {
        if (wishlist && !isPublished) {
            saveDraft({
                wishlistId: wishlist.id,
                title: wishlist.title,
                owner_name: wishlist.owner_name,
                gifts: gifts
            });
        }
    }, [wishlist, gifts, isPublished]);

    const handleCreateWishlist = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Inserisci un titolo per la wishlist');
            return;
        }

        try {
            const newWishlist = await createWishlist({
                title: title.trim(),
                owner_name: ownerName.trim() || null
            });

            setWishlist(newWishlist);
            setShowCreateForm(false);
            setTitle('');
            setOwnerName('');
        } catch (error) {
            alert('Errore nella creazione: ' + error.message);
        }
    };

    const handleAddGift = () => {
        navigate('/add-gift');
    };

    const handleEditGift = (gift) => {
        navigate(`/edit-gift/${gift.id}`, { state: { gift } });
    };

    const handleDeleteGift = async (giftId) => {
        if (!window.confirm('Sei sicuro di voler eliminare questo regalo?')) {
            return;
        }

        try {
            await deleteGift(giftId);
            setGifts(gifts.filter(g => g.id !== giftId));
        } catch (error) {
            alert('Errore nell\'eliminazione: ' + error.message);
        }
    };

    const handlePublish = async () => {
        if (gifts.length === 0) {
            alert('Aggiungi almeno un regalo prima di pubblicare!');
            return;
        }

        if (!window.confirm('Pubblicare la wishlist? Non potrai più modificarla!')) {
            return;
        }

        try {
            const published = await publishWishlist(wishlist.id);
            setIsPublished(true);
            setSecretLink(published.secret_link);
            setShowLinkModal(true);
            clearDraft();
        } catch (error) {
            alert('Errore nella pubblicazione: ' + error.message);
        }
    };

    const handleCopyLink = () => {
        const fullLink = `${window.location.origin}/wishlist/${secretLink}`;
        navigator.clipboard.writeText(fullLink)
            .then(() => alert('Link copiato!'))
            .catch(() => alert('Errore nella copia'));
    };

    return (
        <div className="home-page">
            <div className="container">
                <h1 className="page-title">🎅 Secret Santa Wishlist</h1>

                {showCreateForm && (
                    <div className="card">
                        <h2>Crea la tua Wishlist</h2>
                        <form onSubmit={handleCreateWishlist} className="create-form">
                            <div className="form-group">
                                <label htmlFor="title">Titolo Wishlist *</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="es. Natale 2026"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="ownerName">Il tuo nome (opzionale)</label>
                                <input
                                    type="text"
                                    id="ownerName"
                                    value={ownerName}
                                    onChange={(e) => setOwnerName(e.target.value)}
                                    placeholder="es. Marco"
                                />
                            </div>

                            <button type="submit" className="btn-primary">
                                Crea Wishlist
                            </button>
                        </form>
                    </div>
                )}

                {wishlist && (
                    <>
                        <div className="wishlist-header card">
                            <div>
                                <h2>{wishlist.title}</h2>
                                {wishlist.owner_name && <p>Di: {wishlist.owner_name}</p>}
                            </div>

                            {!isPublished && (
                                <button
                                    onClick={handlePublish}
                                    className="btn-success"
                                >
                                    📢 Pubblica Wishlist
                                </button>
                            )}
                        </div>

                        <div className="gifts-grid">
                            {gifts.length === 0 ? (
                                <div className="empty-state card">
                                    <p>📦 Nessun regalo ancora. Inizia ad aggiungere!</p>
                                </div>
                            ) : (
                                gifts.map(gift => (
                                    <GiftCard
                                        key={gift.id}
                                        gift={gift}
                                        onEdit={handleEditGift}
                                        onDelete={handleDeleteGift}
                                        isPublic={false}
                                    />
                                ))
                            )}
                        </div>

                        {!isPublished && (
                            <button
                                onClick={handleAddGift}
                                className="btn-primary btn-add-gift"
                            >
                                ➕ Aggiungi Regalo
                            </button>
                        )}
                    </>
                )}
            </div>

            {showLinkModal && (
                <div className="modal-overlay" onClick={() => setShowLinkModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>🎉 Wishlist Pubblicata!</h2>
                        <p>Condividi questo link con i tuoi amici:</p>
                        <div className="link-box">
                            <code>{`${window.location.origin}/wishlist/${secretLink}`}</code>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleCopyLink} className="btn-primary">
                                📋 Copia Link
                            </button>
                            <button onClick={() => setShowLinkModal(false)} className="btn-secondary">
                                Chiudi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
