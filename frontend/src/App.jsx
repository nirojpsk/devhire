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
import ProjectListPage from './pages/projects/ProjectListPage';
import CreateProjectPage from './pages/projects/CreateProjectPage';
import MyProjectsPage from './pages/projects/MyProjectsPage';
import ProjectDetailsPage from './pages/projects/ProjectDetailPage';
import EditProjectPage from './pages/projects/EditProjectPage';
import PlaceBidPage from './pages/bids/PlaceBidPage';
import ProjectBidsPage from './pages/bids/ProjectBidsPage';
import EditBidPage from './pages/bids/EditBidPage';
import MyBidsPage from './pages/bids/MyBidsPage';
import CreateDevProfilePage from './pages/developer/CreateDevProfilePage';
import DeveloperProfilePage from './pages/developer/DeveloperProfilePage';
import EditDeveloperProfilePage from './pages/developer/EditDeveloperProfilePage';
import CreateClientProfilePage from './pages/client/CreateClientProfilePage';
import ClientProfilePage from './pages/client/ClientProfilePage';
import EditClientProfilePage from './pages/client/EditClientProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/projects' element={<ProjectListPage />} />
        <Route path='/projects/:projectId' element={<ProjectDetailsPage />} />

        <Route element={<PrivateRoute />}>
          <Route path='/protected' element={<h1>Protected Page</h1>} />
          <Route element={<RoleRoute allowedRoles={["client"]} />}>
            <Route path='/client/dashboard' element={<ClientDashboard />} />
            <Route path='/projects/create' element={<CreateProjectPage />} />
            <Route path='/my-projects' element={<MyProjectsPage />} />
            <Route path='/projects/:projectId/edit' element={<EditProjectPage />} />
            <Route path='/projects/:projectId/bids' element={<ProjectBidsPage />} />
            <Route path='/client/profile/create' element={<CreateClientProfilePage />} />
<Route path='/client/profile' element={<ClientProfilePage />} />
<Route path='/client/profile/edit' element={<EditClientProfilePage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["developer"]} />}>
            <Route path='/developer/dashboard' element={<DeveloperDashboard />} />
            <Route path='/projects/:projectId/bid' element={<PlaceBidPage />} />
            <Route path='/bids/:bidId/edit' element={<EditBidPage />} />
            <Route path='/my-bids' element={<MyBidsPage />} />
            <Route path='/developer/profile/create' element={<CreateDevProfilePage />} />
            <Route path='/developer/profile' element={<DeveloperProfilePage />} />
            <Route path='/developer/profile/edit' element={<EditDeveloperProfilePage />} />
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