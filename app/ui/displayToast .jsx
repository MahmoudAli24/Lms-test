import {toast} from 'react-toastify';

export const displayToast = (status) => {
    const message = status.message
    const type = status.type
    toast[type](message, {
        type,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
    });
};
