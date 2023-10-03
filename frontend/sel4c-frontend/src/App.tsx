import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import Usuarios from './components/Usuarios';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Mi Aplicación</h1>
        </header>
        <main>
          <Routes>
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/" element={<p>Inicio</p>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
