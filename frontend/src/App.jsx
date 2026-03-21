import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/HomePage';
import PrivateRoute from './components/auth/PrivateRoute';
import RoleRoute from './components/auth/RoleRoute';
import RegisterPage from './pages/auth/RegisterPage';
import ClientDashboard from './pages/client/ClientDashboard';
import DeveloperDashboard from './pages/developer/DeveloperDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route element={<PrivateRoute />}>
          <Route path='/protected' element={<h1>Protected Page</h1>} />
          <Route element={<RoleRoute allowedRoles={["client"]} />}>
            <Route path='/client/dashboard' element={<ClientDashboard />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={["developer"]} />}>
            <Route path='/developer/dashboard' element={<DeveloperDashboard />} />
          </Route>
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
          </Route>
        </Route>

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;