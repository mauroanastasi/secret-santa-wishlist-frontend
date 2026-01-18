import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import GiftForm from '../components/GiftForm'
import { createGift, updateGift } from '../services/api'
import { loadDraft, saveDraft } from '../utils/localStorage'
import './AddGiftPage.css'

function AddGiftPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const [giftToEdit, setGiftToEdit] = useState(null);
    const [wishlistId, setWishlistId] = useState(null);

    useEffect(() => {
        const draft = loadDraft();
        if (draft && draft.wishlistId) {
            setWishlistId(draft.wishlistId);
        }

        if (id) {
            if (location.state && location.state.gift) {
                setGiftToEdit(location.state.gift);
            } else {
                console.warn('Gift data not found in location.state');
                navigate('/');
            }
        }
    }, [id, location.state, navigate]);

    const handleCreate = async (giftData) => {
        if (!wishlistId) {
            alert('Errore: wishlist non trovata');
            navigate('/');
            return;
        }

        try {
            const response = await createGift({
                wishlist_id: wishlistId,
                ...giftData
            });
            console.log('Regalo creato:', response);

            // Aggiorna il draft con il nuovo regalo
            const draft = loadDraft();
            if (draft) {
                const updatedGifts = draft.gifts ? [...draft.gifts, response] : [response];
                saveDraft({
                    ...draft,
                    gifts: updatedGifts
                });
            }

            navigate('/');
        } catch (error) {
            console.error('Errore nel creare il regalo:', error);
            alert('Errore nel salvare il regalo: ' + error.message);
            throw error;
        }
    };


    const handleUpdate = async (giftData) => {
        try {
            const response = await updateGift(id, giftData);
            console.log('Regalo aggiornato:', response);

            // Aggiorna il draft con il regalo modificato
            const draft = loadDraft();
            if (draft) {
                const updatedGifts = draft.gifts.map(g => g.id === parseInt(id) ? response : g);
                saveDraft({
                    ...draft,
                    gifts: updatedGifts
                });
            }

            navigate('/');
        } catch (error) {
            console.error('Errore nell\'aggiornamento del regalo:', error);
            alert('Errore nel salvare il regalo: ' + error.message);
            throw error;
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="add-gift-page">
            <div className="container">
                <div className="page-header">
                    <button onClick={handleCancel} className="btn-back">
                        ← Indietro
                    </button>
                    <h1 className="page-title">
                        {id ? 'Modifica Regalo' : 'Aggiungi Regalo'}
                    </h1>
                </div>

                <GiftForm
                    initialData={giftToEdit}
                    onSubmit={id ? handleUpdate : handleCreate}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}

export default AddGiftPage;
