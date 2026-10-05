import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
export default function Guard({children,admin}){
const{user}=useAuth();
if(!localStorage.getItem('iq_token'))return <Navigate to='/login'/>;
if(admin&&user&&user.role!=='ADMIN')return <Navigate to='/app'/>;
return children;}