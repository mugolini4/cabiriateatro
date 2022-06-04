import React from 'react';
import './App.css';
import {Typography} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import WaitingRoom from "./WaitingRoom";
import MainStage from "./stages/Main";


function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Routes>
                    <Route path="/" element={<WaitingRoom/>} />
                    <Route path="main" element={<MainStage show/>}/>
                    <Route path="about" element={<Typography>About</Typography>} />
                </Routes>
            </header>
        </div>
    );
}

export default App;
