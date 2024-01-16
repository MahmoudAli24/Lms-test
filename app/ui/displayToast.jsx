"use client";
import {toast} from 'react-toastify';
export const displayToast = (status) => {
const theme = localStorage.getItem('theme') || 'light';
    const message = status.message
    const type = status.type
    toast[type](message, {
        type,
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: theme === 'dark' ? 'dark' : 'light',
    });
};
