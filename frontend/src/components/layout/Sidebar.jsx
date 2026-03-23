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
    FaUserPlus,
    FaUsers,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../../api/authApiSlice";
import apiSlice from "../../api/apiSlice";
import { useGetClientProfileQuery } from "../../api/clientApiSlice";
import { useGetDeveloperProfileQuery } from "../../api/developerApiSlice";
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
        { key: "profile", to: "/client/profile", label: "Profile", icon: <FaUser /> },
        { to: "/change-password", label: "Security", icon: <FaLock /> },
    ],
    developer: [
        { to: "/developer/dashboard", label: "Overview", icon: <FaHome />, end: true },
        { to: "/projects", label: "Discover Projects", icon: <FaBriefcase /> },
        { to: "/my-bids", label: "My Bids", icon: <FaReceipt /> },
        { to: "/developer/accepted-projects", label: "Accepted Work", icon: <FaProjectDiagram /> },
        { key: "profile", to: "/developer/profile", label: "Profile", icon: <FaUser /> },
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
    admin: "Platform Control",
};

const ROLE_SUBTITLES = {
    client: "Client Workspace",
    developer: "Senior Developer",
    admin: "Operations Admin",
};

function Sidebar() {
    const { userInfo } = useSelector((state) => state.auth);
    const [logout] = useLogoutMutation();
    const { error: clientProfileError } = useGetClientProfileQuery(undefined, {
        skip: userInfo?.role !== "client",
    });
    const { data: developerProfileData, error: developerProfileError } = useGetDeveloperProfileQuery(undefined, {
        skip: userInfo?.role !== "developer",
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const role = userInfo?.role || "developer";
    const developerAvailability = developerProfileData?.profile?.availability || "available";
    const isMissingProfile = role === "client"
        ? clientProfileError?.status === 404
        : role === "developer"
            ? developerProfileError?.status === 404
            : false;
    const statusLabel = role === "developer"
        ? developerAvailability === "busy"
            ? "Busy"
            : "Available for Hire"
        : ROLE_LABELS[role];
    const statusTone = role === "developer"
        ? developerAvailability === "busy"
            ? "busy"
            : "available"
        : role === "admin"
            ? "open"
            : "reviewing";

    const items = (NAVIGATION[role] || []).map((item) => {
        if (item.key !== "profile" || !isMissingProfile) {
            return item;
        }

        return {
            ...item,
            to: role === "client" ? "/client/profile/create" : "/developer/profile/create",
            label: "Create Profile",
            icon: <FaUserPlus />,
        };
    });

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
                <div className="dashboard-profile-card">
                    <span className="dashboard-profile-card__avatar">
                        {userInfo?.name?.slice?.(0, 2)?.toUpperCase?.() || <FaUser />}
                    </span>
                    <div className="dashboard-profile-card__identity">
                        <h3>{userInfo?.name || "DevHire User"}</h3>
                        <p>{ROLE_SUBTITLES[role]}</p>
                    </div>
                    <span className={`status-pill status-pill--${statusTone}`}>
                        {statusLabel}
                    </span>
                </div>

                <nav className="dashboard-sidebar__nav" aria-label="Dashboard navigation">
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

                <div className="dashboard-sidebar__footer">
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

                    <button type="button" className="dashboard-signout" onClick={logoutHandler}>
                        <FaArrowLeft />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
