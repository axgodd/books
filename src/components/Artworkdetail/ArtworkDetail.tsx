import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, Box, AppBar, Toolbar, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import CommentForm from '../CommentForm';
import './ArtworkDetail.css';

interface Artwork {
    id: number;
    title: string;
    image_id: string;
    artist_display: string;
    date_display: string;
    main_reference_number: string;
    dimensions: string;
    category_titles: string[];
}

const ArtworkDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const currentPage = location.state?.currentPage || 1;
    const searchQuery = location.state?.searchQuery || '';
    const category = location.state?.category || '';


    useEffect(() => {
        const fetchArtwork = async () => {
            try {
                const response = await axios.get(`https://api.artic.edu/api/v1/artworks/${id}`);
                setArtwork(response.data.data);
            } catch (e) {
                console.error('Fetch artwork error:', e);
            }
        };

        fetchArtwork();
    }, [id]);

    if (!artwork) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <AppBar position="static" className="header">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate(`/?page=${currentPage}&search=${searchQuery}&category=${category}`)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Artwork Detail
                    </Typography>
                </Toolbar>
            </AppBar>
            <Card className="artwork-detail-card">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <img
                            src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
                            alt={artwork.title}
                            className="artwork-detail-image"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <CardContent>
                            <Typography variant="h4" component="h1">{artwork.title}</Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                                Artist: <span style={{ fontWeight: 'normal' }}>{artwork.artist_display}</span>
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                                Date: <span style={{ fontWeight: 'normal' }}>{artwork.date_display}</span>
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                                Main Reference Number: <span style={{ fontWeight: 'normal' }}>{artwork.main_reference_number}</span>
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                                Dimensions: <span style={{ fontWeight: 'normal' }}>{artwork.dimensions}</span>
                            </Typography>
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
            <Box mt={4}>
                <CommentForm />
            </Box>
        </Container>
    );
};

export default ArtworkDetail;
