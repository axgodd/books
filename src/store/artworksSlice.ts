import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Artwork {
    id: number;
    title: string;
    image_id: string;
    artist_display: string;
    date_display: string;
    main_reference_number: string;
    dimensions: string;
    category_titles: string[];
}

interface ArtworksState {
    artworks: Artwork[];
    filteredArtworks: Artwork[];
    categories: string[];
    currentPage: number;
    search: string;
    category: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ArtworksState = {
    artworks: [],
    filteredArtworks: [],
    categories: [],
    currentPage: 1,
    search: '',
    category: '',
    status: 'idle',
};

export const fetchArtworks = createAsyncThunk('artworks/fetchArtworks', async () => {
    try {
        const response = await axios.get('https://api.artic.edu/api/v1/artworks?limit=100');
        if (response) {
            return response.data.data;
        } else {
            console.error('Fetch artworks error')
        }

    } catch (e) {
        console.error('Fetch artworks error:', e)
    }
});

const artworksSlice = createSlice({
    name: 'artworks',
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
            state.currentPage = 1;
            artworksSlice.caseReducers.applyFilters(state);
        },
        setCategory: (state, action: PayloadAction<string>) => {
            state.category = action.payload;
            state.currentPage = 1;
            artworksSlice.caseReducers.applyFilters(state);
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        applyFilters: (state) => {
            let filtered = state.artworks;
            if (state.search) {
                filtered = filtered.filter((artwork) => artwork.title.toLowerCase().includes(state.search.toLowerCase()));
            }


            if (state.category) {
                filtered = filtered.filter((artwork) => artwork.category_titles.includes(state.category));
            }
            state.filteredArtworks = filtered;
        },
        setCategories: (state) => {
            const categoriesSet = new Set<string>();
            state.artworks.forEach((artwork) => {
                artwork.category_titles.forEach((category) => categoriesSet.add(category));
            });
            state.categories = Array.from(categoriesSet);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchArtworks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchArtworks.fulfilled, (state, action) => {
                state.artworks = action.payload;
                artworksSlice.caseReducers.setCategories(state);
                artworksSlice.caseReducers.applyFilters(state);
                state.status = 'succeeded';
            })
            .addCase(fetchArtworks.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const { setSearch, setCategory, setCurrentPage } = artworksSlice.actions;
export default artworksSlice.reducer;
