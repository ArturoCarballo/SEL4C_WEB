import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import { Institucion } from '../interface/Institucion';
import { Formik, Form, Field } from 'formik';
import { Button, Select, MenuItem, InputLabel, FormControl, Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import TextField from '@mui/material/TextField';

interface InstitucionFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (institucion: Institucion) => Promise<Institucion>;
    initialData?: Institucion;
}

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const InstitucionFormModal: React.FC<InstitucionFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleFormSubmit = async (values: Institucion) => {

        if (!values.nombre_institucion) {
            // Mostrar un mensaje indicando que la contraseña es obligatoria
            setSnackbarSeverity('error');
            setSnackbarMessage('Ingresa un nombre de institucion');
            setOpenSnackbar(true);
            return;
        }

        try {
            // Lógica para guardar el admin...
            const savedInstitucion = await onSave(values);
            console.log('Institucion saved:', savedInstitucion);
            // Mostrar un mensaje de éxito
            setSnackbarSeverity('success');
            setSnackbarMessage('Institucion registrada con éxito!');
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error in handleFormSubmit:', error);
            // Mostrar un mensaje de error
            setSnackbarSeverity('error');
            setSnackbarMessage('Error registrando Institucion.');
            setOpenSnackbar(true);
        }
    };
    
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
        >
            <div style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', backgroundColor: 'white', padding: '16px', width: '400px' }}>
                <h2>{initialData ? 'Editar' : 'Añadir'} Institucion</h2>
                <Formik
                    initialValues={initialData ? {...initialData, nombre_institucion: ''} : { nombre_institucion: '' }}
                    onSubmit={handleFormSubmit}
                >
                    {({ values, handleChange }) => (
                        <Form>
                            <FormControl fullWidth margin="normal">
                                <Field
                                    name="nombre_institucion"
                                    as={TextField}
                                    label="Nombre_institucion"
                                    variant="outlined"
                                    value={values.nombre_institucion}
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
