import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Typography, Pagination, CircularProgress, Box } from '@mui/material';
import { fetchArtworks, setSearch, setCategory, setCurrentPage } from '../../store/artworksSlice';
import SearchFilter from '../SearchFilter';
import { RootState } from '../../store';
import { AppDispatch } from '../../store';
import './ArtworkList.css';
import ArtworkCard from "../ArtworkCard/ArtworkCard";

const ArtworkList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { filteredArtworks, currentPage, categories, status } = useSelector((state: RootState) => state.artworks);

    useEffect(() => {
        dispatch(fetchArtworks());
    }, []);

    const handleSearch = (search: string) => {
        dispatch(setSearch(search));
    };

    const handleFilter = (category: string) => {
        dispatch(setCategory(category));
    };

    if (status === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container>
            <Typography variant="h3" component="h1" align="center" gutterBottom>
                Artworks
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <SearchFilter onSearch={handleSearch} onFilter={handleFilter} categories={categories} />
            </Box>
            <Grid container spacing={3}>
                {filteredArtworks.slice((currentPage - 1) * 10, currentPage * 10).map((artwork) => (
                    <ArtworkCard key={artwork.id} artwork={artwork} />
                ))}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                    count={Math.ceil(filteredArtworks.length / 10)}
                    page={currentPage}
                    onChange={(event, value) => dispatch(setCurrentPage(value))}
                />
            </Box>
        </Container>
    );
};

export default ArtworkList;
