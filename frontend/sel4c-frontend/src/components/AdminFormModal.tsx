import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import { Admin } from '../interface/Admin';
import { Formik, Form, Field } from 'formik';
import { Button, Select, MenuItem, InputLabel, FormControl, Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import TextField from '@mui/material/TextField';

interface AdminFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (admin: Admin) => Promise<Admin>;
    initialData?: Admin;
}

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const AdminFormModal: React.FC<AdminFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleFormSubmit = async (values: Admin) => {

        if (!values.password) {
            // Mostrar un mensaje indicando que la contraseña es obligatoria
            setSnackbarSeverity('error');
            setSnackbarMessage('La contraseña es obligatoria.');
            setOpenSnackbar(true);
            return;
        }

        try {
            // Lógica para guardar el admin...
            const savedAdmin = await onSave(values);
            console.log('Admin saved:', savedAdmin);
            // Mostrar un mensaje de éxito
            setSnackbarSeverity('success');
            setSnackbarMessage('Admin registrado con éxito!');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error in handleFormSubmit:', error);
            // Mostrar un mensaje de error
            setSnackbarSeverity('error');
            setSnackbarMessage('Error registrando al admin.');
            setOpenSnackbar(true);
        }
    };
    
    
    

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
        >
            <div style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', backgroundColor: 'white', padding: '16px', width: '400px' }}>
                <h2>{initialData ? 'Editar' : 'Añadir'} Admin</h2>
                <Formik
                    initialValues={initialData ? {...initialData, password: ''} : { username: '', password: ''}}
                    onSubmit={handleFormSubmit}
                >
                    {({ values, handleChange }) => (
                        <Form>
                            <FormControl fullWidth margin="normal">
                                <Field
                                    name="username"
                                    as={TextField}
                                    label="Username"
                                    variant="outlined"
                                    value={values.username}
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <Field
                                    name="password"
                                    as={TextField}
                                    type="password"
                                    label="Password"
                                    variant="outlined"
                                    value={values.password}
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <Button type="submit" variant="contained" color="primary">
                                Guardar
                            </Button>
                            <Button type="button" onClick={onClose} variant="contained">
                                Cancelar
                            </Button>
                        </Form>
                    )}
                </Formik>
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </div>
        </Modal>
    );
};
