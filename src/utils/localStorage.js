// Chiave univoca per salvare la bozza nel localStorage del browser
const DRAFT_KEY = 'secret_santa_draft';

export const saveDraft = (data) => {
    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
        console.log('Bozza salvata:', data);
    } catch (error) {
        console.error('Errore nel salvare la bozza:', error);
    }
};

export const loadDraft = () => {
    try {
        const draft = localStorage.getItem(DRAFT_KEY);
        if (draft) {
            const parsed = JSON.parse(draft);
            console.log('Bozza caricata:', parsed);
            return parsed;
        }
        return null;
    } catch (error) {
        console.error('Errore nel caricare la bozza:', error);
        return null;
    }
};

export const clearDraft = () => {
    try {
        localStorage.removeItem(DRAFT_KEY);
        console.log('Bozza cancellata');
    } catch (error) {
        console.error('Errore nel cancellare la bozza:', error);
    }
};

export const hasDraft = () => {
    return localStorage.getItem(DRAFT_KEY) !== null;
};
