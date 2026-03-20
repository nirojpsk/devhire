import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/HomePage';
import PrivateRoute from './components/auth/PrivateRoute';
import RoleRoute from './components/auth/RoleRoute';
import RegisterPage from './pages/auth/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route element={<PrivateRoute />}>
          <Route path='/protected' element={<h1>Protected Page</h1>} />
        </Route>
        <Route element={<RoleRoute allowedRoles={["client"]} />}>
<Route path='/client/dashboard' element={<h1>Client Dashboard</h1>} />
        </Route>
        <Route element={<RoleRoute allowedRoles={["developer"]} />}>
        <Route path='/developer/dashboard' element={<h1>Developer Dashboard</h1>} />
        </Route>
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
        <Route path='/admin/dashboard' element={<h1>Admin Dashboard</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;