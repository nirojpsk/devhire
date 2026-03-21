import { useSelector } from 'react-redux';
import {Button} from 'react-bootstrap';
function ClientDashboard() {
    const { userInfo } = useSelector(state => state.auth);
    return(
        <div>
            <h2>Client Dashboard</h2>
            <p>Welcome, {userInfo?.name}</p>
            <p>Role: {userInfo?.role}</p>

            <div>
               <Button>Create Project</Button>
               <Button>MY projects</Button>
               <Button>Profile</Button>
            </div>
        </div>
        
    );
}

export default ClientDashboard;
