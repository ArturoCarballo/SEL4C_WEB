import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import { User } from '../interface/User';
import { Formik, Form, Field } from 'formik';
import { Button, Select, MenuItem, InputLabel, FormControl, Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import TextField from '@mui/material/TextField';

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User) => Promise<Response>;
    initialData?: User;
}

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const [actionType, setActionType] = useState<'create' | 'edit' | null>(null);


    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleFormSubmit = async (values: User) => {
        try {
            const currentActionType = initialData ? 'edit' : 'create';
            await onSave(values);
    
            if (currentActionType === 'create') {
                setSnackbarMessage('Usuario registrado con éxito!');
            } else if (currentActionType === 'edit') {
                setSnackbarMessage('Usuario editado con éxito!');
            }
            
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage('Error al procesar el usuario.');
            setOpenSnackbar(true);
        }
    };
    
    
    

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
        >
            <div style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', backgroundColor: 'white', padding: '16px', width: '400px' }}>
                <h2>{initialData ? 'Editar' : 'Añadir'} Usuario</h2>
                <Formik
                    initialValues={initialData || { nombre: '', apellido: '', email: '', edad: 0, disciplina: '', sexo: '', grado_academico: '', institucion: '', pais: '' }}
                    onSubmit={handleFormSubmit}
                >
                    {({ values, handleChange }) => (
                        <Form>
                            <FormControl fullWidth margin="normal">
                                <Field
                                    name="nombre"
                                    as={TextField}
                                    label="Nombre"
                                    variant="outlined"
                                    value={values.nombre}
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <Field
                                    name="apellido"
                                    as={TextField}
                                    label="Apellido"
                                    variant="outlined"
                                    value={values.apellido}
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <Field
                                    name="email"
                                    as={TextField}
                                    label="Email"
                                    variant="outlined"
                                    value={values.email}
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <FormControl fullWidth variant="outlined" margin="normal">
                                <TextField
                                    name="edad"
                                    label="Edad"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="outlined"
                                    value={values.edad}
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 1,
                                    }}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="disciplina-label">Disciplina</InputLabel>
                                <Field
                                    as={Select}
                                    labelId="disciplina-label"
                                    id="disciplina"
                                    name="disciplina"
                                    value={values.disciplina}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={'Ingenieria Y Ciencias'}>Ingeniería y Ciencias</MenuItem>
                                    <MenuItem value={'Humanidades y Educacion'}>Humanidades y Educación</MenuItem>
                                    {/* ... otros valores de disciplina ... */}
                                </Field>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="sexo-label">Sexo</InputLabel>
                                <Field
                                    as={Select}
                                    labelId="sexo-label"
                                    id="sexo"
                                    name="sexo"
                                    value={values.sexo}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={'Masculino'}>Masculino</MenuItem>
                                    <MenuItem value={'Femenino'}>Femenino</MenuItem>
                                </Field>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="grado_academico-label">Grado Académico</InputLabel>
                                <Field
                                    as={Select}
                                    labelId="grado_academico-label"
                                    id="grado_academico"
                                    name="grado_academico"
                                    value={values.grado_academico}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={'Pregrado'}>Pregrado</MenuItem>
                                    <MenuItem value={'Posgrado'}>Posgrado</MenuItem>
                                    <MenuItem value={'Educacion continua'}>Educación continua</MenuItem>
                                </Field>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="institucion-label">Institución</InputLabel>
                                <Field
                                    as={Select}
                                    labelId="institucion-label"
                                    id="institucion"
                                    name="institucion"
                                    value={values.institucion}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={'Tecnologico de Monterrey'}>Tecnológico de Monterrey</MenuItem>
                                    <MenuItem value={'Otros'}>Otros</MenuItem>
                                </Field>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <Field
                                    name="pais"
                                    as={TextField}
                                    label="Pais"
                                    variant="outlined"
                                    value={values.pais}
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
