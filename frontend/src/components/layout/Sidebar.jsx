import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    FaArrowLeft,
    FaBolt,
    FaBriefcase,
    FaFolderOpen,
    FaHome,
    FaLock,
    FaProjectDiagram,
    FaReceipt,
    FaShieldAlt,
    FaUser,
    FaUsers,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../../api/authApiSlice";
import apiSlice from "../../api/apiSlice";
import { clearCredentials } from "../../slices/authSlice";
import getErrorMessage from "../../utils/getErrorMessage";
import Button from "../ui/Button";

const NAVIGATION = {
    client: [
        { to: "/client/dashboard", label: "Overview", icon: <FaHome />, end: true },
        { to: "/projects/create", label: "Post Project", icon: <FaBolt /> },
        { to: "/my-projects", label: "My Projects", icon: <FaProjectDiagram /> },
        { to: "/client/bids", label: "All Bids", icon: <FaReceipt /> },
        { to: "/client/submitted-projects", label: "Submissions", icon: <FaFolderOpen /> },
        { to: "/client/profile", label: "Profile", icon: <FaUser /> },
        { to: "/change-password", label: "Security", icon: <FaLock /> },
    ],
    developer: [
        { to: "/developer/dashboard", label: "Overview", icon: <FaHome />, end: true },
        { to: "/projects", label: "Discover Projects", icon: <FaBriefcase /> },
        { to: "/my-bids", label: "My Bids", icon: <FaReceipt /> },
        { to: "/developer/accepted-projects", label: "Accepted Work", icon: <FaProjectDiagram /> },
        { to: "/developer/profile", label: "Profile", icon: <FaUser /> },
        { to: "/change-password", label: "Security", icon: <FaLock /> },
    ],
    admin: [
        { to: "/admin/dashboard", label: "Overview", icon: <FaHome />, end: true },
        { to: "/admin/users", label: "Manage Users", icon: <FaUsers /> },
        { to: "/admin/projects", label: "Manage Projects", icon: <FaProjectDiagram /> },
        { to: "/change-password", label: "Security", icon: <FaShieldAlt /> },
    ],
};

const ROLE_LABELS = {
    client: "Hiring Workspace",
    developer: "Available for Hire",
    admin: "Platform Control",
};

function Sidebar() {
    const { userInfo } = useSelector((state) => state.auth);
    const [logout] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const role = userInfo?.role || "developer";
    const items = NAVIGATION[role] || [];

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
        <aside className="dashboard-sidebar">
            <div className="dashboard-sidebar__inner">
                <div className="sidebar-card dashboard-profile-card">
                    <div className="dashboard-profile-card__top">
                        <span className="dashboard-profile-card__avatar">
                            <FaUser />
                        </span>
                        <div>
                            <h3>{userInfo?.name || "DevHire User"}</h3>
                            <p>{userInfo?.email || role}</p>
                        </div>
                    </div>
                    <span className={`status-pill status-pill--${role === "developer" ? "available" : role === "admin" ? "open" : "reviewing"}`}>
                        {ROLE_LABELS[role]}
                    </span>
                </div>

                <nav className="sidebar-card dashboard-sidebar__nav" aria-label="Dashboard navigation">
                    {items.map(({ to, label, icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                ["dashboard-nav__link", isActive ? "active" : ""].filter(Boolean).join(" ")
                            }
                        >
                            <span className="dashboard-nav__icon">
                                {icon}
                            </span>
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-card stacked-info">
                    <h3>Need a quick action?</h3>
                    <p>
                        {role === "client"
                            ? "Post a new project or review incoming proposals from your workspace."
                            : role === "developer"
                                ? "Jump back into active proposals or discover fresh opportunities."
                                : "Review platform activity and keep your marketplace healthy."}
                    </p>
                    <Button
                        as={NavLink}
                        to={
                            role === "client"
                                ? "/projects/create"
                                : role === "developer"
                                    ? "/projects"
                                    : "/admin/users"
                        }
                        size="sm"
                    >
                        {role === "client" ? "Post Project" : role === "developer" ? "Browse Projects" : "Open Admin Tools"}
                    </Button>
                </div>

                <div className="sidebar-card stacked-info">
                    <Button tone="light" onClick={logoutHandler}>
                        <FaArrowLeft />
                        Sign Out
                    </Button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
