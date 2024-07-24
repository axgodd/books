import React, { useState } from 'react';
import { TextField, MenuItem, Button, Grid, Autocomplete } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const SearchFilter: React.FC<{ onSearch: (search: string) => void, onFilter: (category: string) => void, categories: string[] }> = ({ onSearch, onFilter, categories }) => {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    const artworks = useSelector((state: RootState) => state.artworks.artworks);

    const handleSearchChange = (event: React.ChangeEvent<{}>, value: string) => {
        setSearch(value);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCategory(event.target.value);
        onFilter(event.target.value);
    };

    const handleSearchClick = () => {
        onSearch(search);
    };

    const handleResetClick = () => {
        setSearch('');
        setCategory('');
        onSearch('');
        onFilter('');
    };

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
                <Autocomplete
                    freeSolo
                    options={artworks}
                    getOptionLabel={(option) => typeof option === 'string' ? option : option.title}
                    onInputChange={handleSearchChange}
                    renderOption={(props, option) => {
                        const { key, ...optionProps } = props;
                        return (
                            <li key={typeof option === 'string' ? option : option.id} {...optionProps}>
                                {typeof option === 'string' ? option : option.title}
                            </li>
                        );
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search"
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={2}>
                <Button variant="contained" color="primary" onClick={handleSearchClick} fullWidth>
                    Search
                </Button>
            </Grid>
            <Grid item xs={12} sm={2}>
                <TextField
                    select
                    label="Category"
                    value={category}
                    onChange={handleCategoryChange}
                    variant="outlined"
                    fullWidth
                >
                    <MenuItem value="">All</MenuItem>
                    {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12} sm={2}>
                <Button variant="outlined" color="secondary" onClick={handleResetClick} fullWidth>
                    Reset
                </Button>
            </Grid>
        </Grid>
    );
};

export default SearchFilter;
