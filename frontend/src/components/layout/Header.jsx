import { Nav, Navbar, Container } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from "../../api/authApiSlice";
import { clearCredentials } from "../../slices/authSlice";
import apiSlice from '../../api/apiSlice';
import { toast } from 'react-toastify';


function Header() {
    const { userInfo } = useSelector(state => state.auth);
    const [logout] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await logout().unwrap();
            dispatch(apiSlice.util.resetApiState());
            dispatch(clearCredentials());
            toast.success(res.message || 'Logged out successfully');
            navigate("/login");


        } catch (err) {
            toast.error(
                err?.data?.message ||
                err?.data?.error
                || err?.error
                ||
                'Error logging out');
        };
    };

    const getDashboardLink = () => {
        if (!userInfo) return '/login';
        if (userInfo.role === 'client') return '/client/dashboard';
        if (userInfo.role === 'developer') return '/developer/dashboard';
        if (userInfo.role === 'admin') return '/admin/dashboard';
        return '/';
    };


    return (
        <header>
            <Navbar expand='lg' collapseOnSelect>
                <Container>
                    <Navbar.Brand as={NavLink} to='/' className='d-flex align-items-center gap-2'>
                        <img
                            src='/logo.png'
                            alt='logo'
                            style={{ width: '20px', height: '20px' }}
                        />
                        DevHire
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls='nav-bar' />
                    <Navbar.Collapse id='nav-bar'>
                        <Nav className='ms-auto align-items-center'>
                            {userInfo ? (
                                <>
                                    <Nav.Link as={NavLink} to={getDashboardLink()}>
                                        <FaUser className='me-1' />
                                        {userInfo.name}
                                    </Nav.Link>
                                    <Nav.Link onClick={logoutHandler} style={{ cursor: 'pointer' }}>
                                        Logout
                                    </Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={NavLink} to='/login'>Login</Nav.Link>
                                    <Nav.Link as={NavLink} to='/register'>Register</Nav.Link>
                                </>
                            )}



                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
