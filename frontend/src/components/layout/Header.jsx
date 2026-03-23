import { Container, Navbar } from "react-bootstrap";
import { FaBriefcase, FaTachometerAlt, FaUserCircle } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../../api/authApiSlice";
import apiSlice from "../../api/apiSlice";
import { clearCredentials } from "../../slices/authSlice";
import getErrorMessage from "../../utils/getErrorMessage";
import Button from "../ui/Button";

function Header() {
    const { userInfo } = useSelector((state) => state.auth);
    const [logout] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const dashboardLink = userInfo?.role === "client"
        ? "/client/dashboard"
        : userInfo?.role === "developer"
            ? "/developer/dashboard"
            : userInfo?.role === "admin"
                ? "/admin/dashboard"
                : "/login";

    const primaryAction = userInfo?.role === "client"
        ? { to: "/projects/create", label: "Post Project" }
        : userInfo?.role === "developer"
            ? { to: "/projects", label: "Browse Projects" }
            : userInfo?.role === "admin"
                ? { to: "/admin/users", label: "Admin Tools" }
                : null;

    const navigation = [
        { to: "/", label: "Discover", end: true },
        { to: "/projects", label: "Projects" },
    ];

    if (userInfo?.role === "developer") {
        navigation.push({ to: "/my-bids", label: "My Bids" });
    }

    if (userInfo?.role === "client") {
        navigation.push({ to: "/my-projects", label: "My Projects" });
    }

    if (userInfo?.role === "admin") {
        navigation.push({ to: "/admin/users", label: "Users" });
    }

    const logoutHandler = async () => {
        try {
            const res = await logout().unwrap();
            dispatch(apiSlice.util.resetApiState());
            dispatch(clearCredentials());
            toast.success(res?.message || "Logged out successfully");
            navigate("/login");
        } catch (err) {
            toast.error(getErrorMessage(err, "Unable to log out"));
        }
    };

    return (
        <header className="site-header">
            <Navbar expand="lg" className="site-navbar">
                <Container className="site-navbar__inner">
                    <Navbar.Brand as={NavLink} to="/" className="brand-mark">
                        <span className="brand-mark__logo" aria-hidden="true">
                            <span className="brand-mark__logo-core">
                                <span className="brand-mark__logo-bar brand-mark__logo-bar--primary" />
                                <span className="brand-mark__logo-bar brand-mark__logo-bar--secondary" />
                                <span className="brand-mark__logo-dot" />
                            </span>
                        </span>
                        <span>DevHire</span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="site-navigation" />
                    <Navbar.Collapse id="site-navigation">
                        <nav className="site-nav">
                            {navigation.map(({ to, label, end }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    end={end}
                                    className={({ isActive }) =>
                                        ["site-nav__link", isActive ? "active" : ""].filter(Boolean).join(" ")
                                    }
                                >
                                    {label}
                                </NavLink>
                            ))}
                        </nav>

                        <div className="header-actions">
                            {primaryAction ? (
                                <Button as={NavLink} to={primaryAction.to} tone="light" size="sm" className="header-chip-button">
                                    <FaBriefcase />
                                    {primaryAction.label}
                                </Button>
                            ) : null}

                            {userInfo ? (
                                <>
                                    <NavLink to={dashboardLink} className="user-chip">
                                        <FaUserCircle />
                                        <span>{userInfo.name}</span>
                                    </NavLink>
                                    <Button tone="light" size="sm" onClick={logoutHandler}>
                                        {location.pathname.startsWith("/admin") ? <FaTachometerAlt /> : null}
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button as={NavLink} to="/login" tone="light" size="sm">
                                        Sign In
                                    </Button>
                                    <Button as={NavLink} to="/register" size="sm">
                                        Create Account
                                    </Button>
                                </>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}

export default Header;
