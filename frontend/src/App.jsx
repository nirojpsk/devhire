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
import SubmitProjectPage from './pages/projects/SubmitProjectPage';
import SubmittedProjectsPage from './pages/projects/SubmittedProjectsPage';
import EditProjectPage from './pages/projects/EditProjectPage';
import PlaceBidPage from './pages/bids/PlaceBidPage';
import ProjectBidsPage from './pages/bids/ProjectBidsPage';
import EditBidPage from './pages/bids/EditBidPage';
import MyBidsPage from './pages/bids/MyBidsPage';
import AcceptedProjectsPage from './pages/bids/AcceptedProjectsPage';
import CreateDevProfilePage from './pages/developer/CreateDevProfilePage';
import DeveloperProfilePage from './pages/developer/DeveloperProfilePage';
import EditDeveloperProfilePage from './pages/developer/EditDeveloperProfilePage';
import ViewDeveloperProfilePage from './pages/developer/ViewDeveloperProfilePage';
import CreateClientProfilePage from './pages/client/CreateClientProfilePage';
import ClientProfilePage from './pages/client/ClientProfilePage';
import EditClientProfilePage from './pages/client/EditClientProfilePage';
import ManageProjectsPage from './pages/admin/ManageProjectsPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import AdminUserProfilePage from './pages/admin/AdminUserProfilePage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';
import ClientBidsPage from './pages/bids/ClientBidsPage';

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
          <Route path='/change-password' element={<ChangePasswordPage />} />
          <Route element={<RoleRoute allowedRoles={["client"]} />}>
            <Route path='/client/dashboard' element={<ClientDashboard />} />
            <Route path='/projects/create' element={<CreateProjectPage />} />
            <Route path='/my-projects' element={<MyProjectsPage />} />
            <Route path='/projects/:projectId/edit' element={<EditProjectPage />} />
            <Route path='/projects/:projectId/bids' element={<ProjectBidsPage />} />
            <Route path='/client/bids' element={<ClientBidsPage />} />
            <Route path='/client/submitted-projects' element={<SubmittedProjectsPage />} />
            <Route path='/client/profile/create' element={<CreateClientProfilePage />} />
<Route path='/client/profile' element={<ClientProfilePage />} />
<Route path='/client/profile/edit' element={<EditClientProfilePage />} />
            <Route path='/developers/:userId/profile' element={<ViewDeveloperProfilePage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["developer"]} />}>
            <Route path='/developer/dashboard' element={<DeveloperDashboard />} />
            <Route path='/projects/:projectId/bid' element={<PlaceBidPage />} />
            <Route path='/projects/:projectId/submit' element={<SubmitProjectPage />} />
            <Route path='/bids/:bidId/edit' element={<EditBidPage />} />
            <Route path='/my-bids' element={<MyBidsPage />} />
            <Route path='/developer/accepted-projects' element={<AcceptedProjectsPage />} />
            <Route path='/developer/profile/create' element={<CreateDevProfilePage />} />
            <Route path='/developer/profile' element={<DeveloperProfilePage />} />
            <Route path='/developer/profile/edit' element={<EditDeveloperProfilePage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
             <Route path='/admin/users' element={<ManageUsersPage />} />
             <Route path='/admin/users/:userId/profile' element={<AdminUserProfilePage />} />
              <Route path='/admin/projects' element={<ManageProjectsPage />} />
        
          </Route>
        </Route>

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
