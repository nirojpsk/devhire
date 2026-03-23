import { Container, Table, Spinner, Alert, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
    useGetAllProjectsAdminQuery,
    useDeleteProjectAdminMutation,
} from "../../api/adminApiSlice";

function ManageProjectsPage() {
    const { data, isLoading, error } = useGetAllProjectsAdminQuery();
    const [deleteProjectAdmin, { isLoading: loadingDelete }] =
        useDeleteProjectAdminMutation();

    const projects = data?.projects || [];

    const deleteHandler = async (projectId) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                const res = await deleteProjectAdmin(projectId).unwrap();
                toast.success(res?.message || "Project deleted successfully");
            } catch (err) {
                toast.error(
                    err?.data?.message ||
                    err?.data?.error ||
                    err?.error ||
                    "Error deleting project"
                );
            }
        }
    };

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Manage Projects</h2>
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
                    {error?.data?.message || error?.error || "Error fetching projects"}
                </Alert>
            ) : projects.length === 0 ? (
                <Alert variant="info">No projects found.</Alert>
            ) : (
                <Table striped bordered hover responsive className="shadow-sm">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Client</th>
                            <th>Budget</th>
                            <th>Status</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project._id}>
                                <td>{project.title}</td>
                                <td>
                                    {project.clientId?.name || "N/A"}
                                    <br />
                                    <small>{project.clientId?.email || ""}</small>
                                </td>
                                <td>
                                    ${project.budget?.min} - ${project.budget?.max}
                                </td>
                                <td>{project.status}</td>
                                <td>
                                    {project.deadline
                                        ? new Date(project.deadline).toLocaleDateString()
                                        : "N/A"}
                                </td>
                                <td className="d-flex gap-2 flex-wrap">
                                    <Button
                                        as={Link}
                                        to={`/projects/${project._id}`}
                                        variant="dark"
                                        size="sm"
                                    >
                                        View
                                    </Button>

                                    <Button
                                        variant="danger"
                                        size="sm"
                                        disabled={loadingDelete}
                                        onClick={() => deleteHandler(project._id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}

export default ManageProjectsPage;
