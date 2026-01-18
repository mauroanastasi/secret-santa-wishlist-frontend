// URL base del backend Express
const BASE_URL = import.meta.env.VITE_FIRST_SANTA || 'http://localhost:3000/api';

console.log('BASE_URL:', BASE_URL);

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Errore nella richiesta');
    }
    return response.json();
};

// WISHLIST ENDPOINTS

export const createWishlist = async (data) => {
    const response = await fetch(`${BASE_URL}/wishlists`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

export const publishWishlist = async (id) => {
    const response = await fetch(`${BASE_URL}/wishlists/${id}/publish`, {
        method: 'PATCH',
    });
    return handleResponse(response);
};

export const getPublicWishlist = async (secretLink) => {
    const response = await fetch(`${BASE_URL}/wishlists/public/${secretLink}`);
    return handleResponse(response);
};

// GIFT ENDPOINTS

export const createGift = async (giftData) => {
    const response = await fetch(`${BASE_URL}/gifts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(giftData),
    });
    return handleResponse(response);
};

export const updateGift = async (id, giftData) => {
    const response = await fetch(`${BASE_URL}/gifts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(giftData),
    });
    return handleResponse(response);
};

export const deleteGift = async (id) => {
    const response = await fetch(`${BASE_URL}/gifts/${id}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
};

export const reserveGift = async (id, message = '') => {
    const response = await fetch(`${BASE_URL}/gifts/${id}/reserve`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservation_message: message }),
    });
    return handleResponse(response);
};
