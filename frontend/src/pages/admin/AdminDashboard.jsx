import { useSelector } from 'react-redux';
import {Button} from 'react-bootstrap';
function AdminDashboard() {
    const { userInfo } = useSelector(state => state.auth);
    return(
        <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome, {userInfo?.name}</p>
            <p>Role: {userInfo?.role}</p>

            <div>
               <Button>Submit Projects</Button>
               <Button>MY Bids</Button>
               <Button>Profile</Button>
            </div>
        </div>
        
    );
}

export default AdminDashboard;
