import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import GiftForm from '../components/GiftForm'
import { createGift, updateGift } from '../services/api'
import { loadDraft } from '../utils/localStorage'
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
            await createGift({
                wishlist_id: wishlistId,
                ...giftData
            });
            navigate('/');
        } catch (error) {
            throw error;
        }
    };


    const handleUpdate = async (giftData) => {
        try {
            await updateGift(id, giftData);
            navigate('/');
        } catch (error) {
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
