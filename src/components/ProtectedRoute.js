import React, {useEffect, useState} from "react";
import {Outlet, useNavigate} from 'react-router-dom'
import {auth} from "../firebase_config";

const ProtectedRoute = ({children}) => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if(user){
                setUser(user)
            }else {
                navigate('/login', {replace:true})
            }
        })
    },[])


    return children ? children : <Outlet/>;
};

export default ProtectedRoute
