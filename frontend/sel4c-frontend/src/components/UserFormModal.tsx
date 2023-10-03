import React from 'react';
import { UserForm } from './UserForm';
import { User } from '../interface/User';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: User) => void;
}

export const UserFormModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
    if(!isOpen) {
        return null;
    }

    return (
        <div className='modal'>
            <div className='modal-content'>
                <button onClick={onClose}>Cerrar</button>
                <UserForm onClose={onClose} onSave={onSave}></UserForm>
            </div>
        </div>
    );
}