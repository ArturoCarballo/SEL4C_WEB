import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login/Login";
import Usuarios from "./pages/Usuarios";
import Mensajes from "./pages/Mensajes";
import { AdminTable } from "./components/AdminTable";
import UserProfile from "./components/UserProfile";
import Navbar from "./components/Navbar";
import GraficasPage from "./pages/Graficas";

function MainApp() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('admin_token');

  if (isAuthenticated && location.pathname === "/") {
    return <Navigate to="/users" />;
  }

  return (
    <>
      {/* Renderiza la Navbar solo si la ruta no es "/login" */}
      {location.pathname !== "/login" && !location.pathname.includes("/grafica") && <Navbar />}


      <Routes>
        <Route path="/grafica/:idusuario" element={<GraficasPage/>} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/perfil/:id" element={<UserProfile />} />
          <Route path="/users" element={<Usuarios />} />
          <Route path="/admins" element={<AdminTable />} />
          <Route path="/mensajes" element={<Mensajes />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  const isAuthenticated = localStorage.getItem('admin_token');
  return (
    <Router>
      <Routes>
        <Route path="/login" element={ isAuthenticated ? <Navigate to="/users" /> : <Login /> } />
        <Route path="*" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;
