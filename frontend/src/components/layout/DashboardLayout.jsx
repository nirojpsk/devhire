import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function DashboardLayout() {
    return (
        <div className="dashboard-shell animate-in">
            <Sidebar />
            <main className="dashboard-main">
                <div className="dashboard-main__content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default DashboardLayout;
