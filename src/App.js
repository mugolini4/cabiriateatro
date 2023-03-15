import React from 'react';
import './App.css';
import {Typography} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import WaitingRoom from "./pages/WaitingRoom";
import MainStage from "./stages/Main";
import ProtectedRoute from "./components/ProtectedRoute";
import {Login} from "./pages/Login";
import Control from "./components/Control";


function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Routes>
                    <Route path="/" element={<WaitingRoom/>} />
                    <Route path="main" element={<MainStage show/>}/>
                    <Route path="about" element={<Typography>About</Typography>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route element={<ProtectedRoute/>}>
                        <Route path="control" element={<Control/>} />
                    </Route>
                </Routes>
            </header>
        </div>
    );
}

export default App;
