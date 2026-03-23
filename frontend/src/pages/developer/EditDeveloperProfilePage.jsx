import { Form, Button, Container, Spinner, Alert } from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
    useGetDeveloperProfileQuery,
    useUpdateDeveloperProfileMutation,
} from "../../api/developerApiSlice";
import getErrorMessage from "../../utils/getErrorMessage";

function EditDeveloperProfileForm({ profile, loadingUpdate, updateDeveloperProfile, navigate }) {
    const [bio, setBio] = useState(() => profile.bio || "");
    const [skills, setSkills] = useState(() => profile.skills?.join(", ") || "");
    const [experienceYears, setExperienceYears] = useState(() => profile.experienceYears ?? "");
    const [availability, setAvailability] = useState(() => profile.availability || "available");
    const [portfolio, setPortfolio] = useState(() => profile.links?.portfolio || "");
    const [github, setGithub] = useState(() => profile.links?.github || "");
    const [linkedin, setLinkedin] = useState(() => profile.links?.linkedin || "");
    const [rate, setRate] = useState(() => profile.rate ?? "");

    const submitHandler = async (e) => {
        e.preventDefault();

        const skillsArray = skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "");

        try {
            const res = await updateDeveloperProfile({
                bio,
                skills: skillsArray,
                experienceYears: Number(experienceYears) || 0,
                availability,
                links: {
                    portfolio,
                    github,
                    linkedin,
                },
                rate: Number(rate) || 0,
            }).unwrap();

            toast.success(res?.message || "Developer profile updated successfully");
            navigate("/developer/profile");
        } catch (err) {
            toast.error(getErrorMessage(err, "Unable to update developer profile"));
        }
    };

    return (
        <Form onSubmit={submitHandler}>
            <Form.Group controlId="bio" className="my-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="skills" className="my-3">
                <Form.Label>Skills</Form.Label>
                <Form.Control
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                />
                <Form.Text muted>Enter skills separated by commas.</Form.Text>
            </Form.Group>

            <Form.Group controlId="experienceYears" className="my-3">
                <Form.Label>Experience Years</Form.Label>
                <Form.Control
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="availability" className="my-3">
                <Form.Label>Availability</Form.Label>
                <Form.Select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                </Form.Select>
            </Form.Group>

            <Form.Group controlId="portfolio" className="my-3">
                <Form.Label>Portfolio Link</Form.Label>
                <Form.Control
                    type="text"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="github" className="my-3">
                <Form.Label>GitHub Link</Form.Label>
                <Form.Control
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="linkedin" className="my-3">
                <Form.Label>LinkedIn Link</Form.Label>
                <Form.Control
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="rate" className="my-3">
                <Form.Label>Rate</Form.Label>
                <Form.Control
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                />
            </Form.Group>

            <div className="d-flex gap-2">
                <Button type="submit" className="btn btn-sm" disabled={loadingUpdate}>
                    {loadingUpdate ? "Updating..." : "Update Profile"}
                </Button>

                <Button
                    type="button"
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => navigate("/developer/profile")}
                >
                    Cancel
                </Button>
            </div>
        </Form>
    );
}

function EditDeveloperProfilePage() {
    const { data, isLoading, error } = useGetDeveloperProfileQuery();
    const [updateDeveloperProfile, { isLoading: loadingUpdate }] =
        useUpdateDeveloperProfileMutation();
    const navigate = useNavigate();

    const profile = data?.profile;

    return (
        <Container className="py-4" style={{ maxWidth: "800px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Edit Developer Profile</h2>
                <Button as={Link} to="/developer/profile" variant="outline-secondary" size="sm">
                    Back to Profile
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : error ? (
                <Alert variant="danger">
                    {error?.data?.message || error?.error || "Error fetching developer profile"}
                </Alert>
            ) : !profile ? (
                <Alert variant="info">Developer profile not found.</Alert>
            ) : (
                <EditDeveloperProfileForm
                    key={profile._id || profile.userId?._id || "developer-profile"}
                    profile={profile}
                    loadingUpdate={loadingUpdate}
                    updateDeveloperProfile={updateDeveloperProfile}
                    navigate={navigate}
                />
            )}
        </Container>
    );
}

export default EditDeveloperProfilePage;
