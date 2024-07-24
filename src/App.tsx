import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

const ArtworkList = lazy(() => import('./components/ArtworkList/ArtworkList'));
const ArtworkDetail = lazy(() => import('./components/Artworkdetail/ArtworkDetail'));

function App() {
    return (
        <Router>
            <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress />Loading...</Box>}>
                <Routes>
                    <Route path="/" element={<ArtworkList />} />
                    <Route path="/artwork/:id" element={<ArtworkDetail />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
