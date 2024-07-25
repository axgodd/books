import React, { useState } from 'react';
import { TextField, Button, Grid, CircularProgress, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
interface SearchFilterProps {
    onSearchResults: (results: any[], total: number, query: string) => void;
    categories: string[];
    onFilter: (category: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearchResults, categories, onFilter }) => {
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleSearchClick = async (page: number = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.artic.edu/api/v1/artworks/search`, {
                params: {
                    q: search,
                    page,
                    limit: 10,
                },
            });

            const searchResults = await Promise.all(response.data.data.map(async (result: any) => {
                const detailResponse = await axios.get(result.api_link);
                return detailResponse.data.data;
            }));

            const total = response.data.pagination.total;
            onSearchResults(searchResults, total, search);
        } catch (e) {
            console.error('Fetch artworks error:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onFilter(event.target.value);
    };


    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Search"
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={handleSearchChange}
                />
            </Grid>
            <Grid item xs={12} sm={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSearchClick(1)}
                    fullWidth
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                </Button>
            </Grid>
            <Grid item xs={12} sm={2}>
                <TextField
                    select
                    label="Category"
                    onChange={handleCategoryChange}
                    variant="outlined"
                    fullWidth
                    SelectProps={{
                        native: true,
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                >
                    <option value="">All</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </TextField>
            </Grid>

        </Grid>
    );
};

export default SearchFilter;
