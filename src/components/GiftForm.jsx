import { useState, useEffect } from 'react'
import './GiftForm.css'

function GiftForm({ initialData = null, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        gift_name: '',
        image_url: '',
        link: '',
        price: '',
        priority_gift: 3,
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                gift_name: initialData.gift_name || '',
                image_url: initialData.image_url || '',
                link: initialData.link || '',
                price: initialData.price || '',
                priority_gift: initialData.priority_gift || 3,
                notes: initialData.notes || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.gift_name.trim()) {
            newErrors.gift_name = 'Il nome del regalo è obbligatorio';
        }

        if (!formData.image_url.trim()) {
            newErrors.image_url = "L'URL dell'immagine è obbligatorio";
        } else if (!isValidUrl(formData.image_url)) {
            newErrors.image_url = 'Inserisci un URL valido';
        }

        if (!formData.link.trim()) {
            newErrors.link = 'Il link del prodotto è obbligatorio';
        } else if (!isValidUrl(formData.link)) {
            newErrors.link = 'Inserisci un URL valido';
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Inserisci un prezzo valido';
        }

        const priority = parseInt(formData.priority_gift);
        if (priority < 1 || priority > 5) {
            newErrors.priority_gift = 'La priorità deve essere tra 1 e 5';
        }

        return newErrors;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const dataToSubmit = {
                ...formData,
                price: parseFloat(formData.price),
                priority_gift: parseInt(formData.priority_gift)
            };

            await onSubmit(dataToSubmit);
        } catch (error) {
            console.error('Errore submit:', error);
            alert('Errore nel salvare il regalo: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="gift-form" onSubmit={handleSubmit}>
            <h2 className="gift-form-title">
                {initialData ? 'Modifica Regalo' : 'Aggiungi Regalo'}
            </h2>

            <div className="form-group">
                <label htmlFor="gift_name">Nome del regalo *</label>
                <input
                    type="text"
                    id="gift_name"
                    name="gift_name"
                    value={formData.gift_name}
                    onChange={handleChange}
                    placeholder="es. PlayStation 5"
                    disabled={isSubmitting}
                />
                {errors.gift_name && <span className="form-error">{errors.gift_name}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="image_url">URL Immagine *</label>
                <input
                    type="url"
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://esempio.com/immagine.jpg"
                    disabled={isSubmitting}
                />
                {errors.image_url && <span className="form-error">{errors.image_url}</span>}
                {formData.image_url && isValidUrl(formData.image_url) && (
                    <img
                        src={formData.image_url}
                        alt="Anteprima"
                        className="form-image-preview"
                    />
                )}
            </div>

            <div className="form-group">
                <label htmlFor="link">Link del prodotto *</label>
                <input
                    type="url"
                    id="link"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="https://esempio.com/prodotto"
                    disabled={isSubmitting}
                />
                {errors.link && <span className="form-error">{errors.link}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="price">Prezzo (€) *</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="99.99"
                        min="0"
                        step="0.01"
                        disabled={isSubmitting}
                    />
                    {errors.price && <span className="form-error">{errors.price}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="priority_gift">Priorità (1-5) *</label>
                    <select
                        id="priority_gift"
                        name="priority_gift"
                        value={formData.priority_gift}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    >
                        <option value="1">1 - Bassa</option>
                        <option value="2">2</option>
                        <option value="3">3 - Media</option>
                        <option value="4">4</option>
                        <option value="5">5 - Alta</option>
                    </select>
                    {errors.priority_gift && <span className="form-error">{errors.priority_gift}</span>}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="notes">Note (opzionale)</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Aggiungi dettagli, colore preferito, taglia..."
                    disabled={isSubmitting}
                />
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-secondary"
                    disabled={isSubmitting}
                >
                    Annulla
                </button>
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Salvataggio...' : (initialData ? 'Salva modifiche' : 'Aggiungi regalo')}
                </button>
            </div>
        </form>
    );
}

export default GiftForm;
