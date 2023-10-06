import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login/Login';
import { UserTable } from './components/UserTable';
import { AdminTable } from './components/AdminTable';
import Navbar from './components/Navbar';

function MainApp() {
    const location = useLocation();

    return (
        <>
            {/* Renderiza la Navbar solo si la ruta no es "/login" */}
            {location.pathname !== '/login' && <Navbar />}
            
            <Routes>
                <Route path="/users" element={<PrivateRoute component={UserTable} />} />
                <Route path="/admins" element={<PrivateRoute component={AdminTable} />} />
                <Route path="*" element={<Navigate to="/login" />} /> 
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<MainApp />} />
            </Routes>
        </Router>
    );
}

export default App;
