import React from 'react';
import { UserTable } from './components/UserTable';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SEL4C</h1>
      </header>
      <main>
        <UserTable />
      </main>
    </div>
  );
}

export default App;
