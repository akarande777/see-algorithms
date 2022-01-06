import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export var showToast = () => {};

function Toast() {
    const [options, setOptions] = useState({});
    const { message, variant } = options;
    showToast = (options) => setOptions(options);
    return (
        <Snackbar
            open={Boolean(message)}
            autoHideDuration={3000}
            onClose={() => setOptions({})}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            {message && <Alert severity={variant}>{message}</Alert>}
        </Snackbar>
    );
}

export default Toast;
