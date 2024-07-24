import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, Box, AppBar, Toolbar, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import CommentForm from '../CommentForm';
import './ArtworkDetail.css';
import { Artwork } from '../../store/artworksSlice';

const ArtworkDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const navigate = useNavigate();
    const currentPage = useSelector((state: RootState) => state.artworks.currentPage);

    useEffect(() => {
        axios.get(`https://api.artic.edu/api/v1/artworks/${id}`)
            .then((response) => {
                if (response.data && response.data.data) {
                    setArtwork(response.data.data);
                } else {
                    setError(true);
                }
            })
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (error) {
            navigate('/');
        }
    }, [error]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress/></Box>;
    }

    if (!artwork) {
        return null;
    }

    return (
        <Container>
            <AppBar position="static" className="header">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate(`/?page=${currentPage}`)}>
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
