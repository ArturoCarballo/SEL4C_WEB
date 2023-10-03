import React from 'react';
import { UserTable } from './components/UserTable';
import { UserForm } from './components/UserForm';

function App() {
    return (
        <div className="App">
            <UserForm />
            <UserTable />
        </div>
    );
}

export default App;
