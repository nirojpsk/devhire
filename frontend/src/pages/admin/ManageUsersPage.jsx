import { Container, Table, Spinner, Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
    useGetAllUsersQuery,
    useDeleteUserMutation,
    useBanUserMutation,
} from "../../api/adminApiSlice";

function ManageUsersPage() {
    const { data, isLoading, error } = useGetAllUsersQuery();
    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
    const [banUser, { isLoading: loadingBan }] = useBanUserMutation();

    const users = (data?.users || []).filter((user) => user.role !== "admin");
    const developerUsers = users.filter((user) => user.role === "developer");
    const clientUsers = users.filter((user) => user.role === "client");

    const deleteHandler = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const res = await deleteUser(userId).unwrap();
                toast.success(res?.message || "User deleted successfully");
            } catch (err) {
                toast.error(
                    err?.data?.message ||
                    err?.data?.error ||
                    err?.error ||
                    "Error deleting user"
                );
            }
        }
    };

    const banHandler = async (userId) => {
        try {
            const res = await banUser(userId).unwrap();
            toast.success(res?.message || "User status updated successfully");
        } catch (err) {
            toast.error(
                err?.data?.message ||
                err?.data?.error ||
                err?.error ||
                "Error banning user"
            );
        }
    };

    const renderUserTable = (title, list) => (
        <div className="mb-5">
            <h4 className="mb-3">{title}</h4>
            {list.length === 0 ? (
                <Alert variant="info">No {title.toLowerCase()} found.</Alert>
            ) : (
                <Table striped bordered hover responsive className="shadow-sm">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Banned</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isBanned ? "Yes" : "No"}</td>
                                <td className="d-flex gap-2 flex-wrap">
                                    <Button
                                        as={Link}
                                        to={`/admin/users/${user._id}/profile`}
                                        variant="info"
                                        size="sm"
                                    >
                                        View Profile
                                    </Button>
                                    <Button
                                        variant={user.isBanned ? "success" : "warning"}
                                        size="sm"
                                        disabled={loadingBan}
                                        onClick={() => banHandler(user._id)}
                                    >
                                        {user.isBanned ? "Unban" : "Ban"}
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        disabled={loadingDelete}
                                        onClick={() => deleteHandler(user._id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Manage Users</h2>
                <Button as={Link} to="/admin/dashboard" variant="outline-secondary" size="sm">
                    Back to Dashboard
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">
                    {error?.data?.message || error?.error || "Error fetching users"}
                </Alert>
            ) : users.length === 0 ? (
                <Alert variant="info">No developer/client users found.</Alert>
            ) : (
                <>
                    {renderUserTable("Developers", developerUsers)}
                    {renderUserTable("Clients", clientUsers)}
                </>
            )}
        </Container>
    );
}

export default ManageUsersPage;
