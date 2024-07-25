import React, { useState, useEffect, useCallback } from 'react';
import { Container, Grid, Typography, Pagination, CircularProgress, Box } from '@mui/material';
import SearchFilter from '../SearchFilter';
import ArtworkCard from '../ArtworkCard/ArtworkCard';
import axios from 'axios';
import './ArtworkList.css';
import { useNavigate, useLocation } from 'react-router-dom';


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

const ArtworkList: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [totalResults, setTotalResults] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get('page') || '1', 10);



  const fetchArtworks = useCallback(async (page: number, category: string = '') => {
    setStatus('loading');
    try {
      const response = await axios.get(`https://api.artic.edu/api/v1/artworks`, {
        params: {
          page,
          limit: 10,
        },
      });

      let fetchedArtworks: Artwork[] = response.data.data;
      if (category) {
        fetchedArtworks = fetchedArtworks.filter((artwork) => artwork.category_titles.includes(category));
      }

      if (fetchedArtworks) {
        setArtworks(fetchedArtworks);
        setFilteredArtworks(fetchedArtworks);
        const uniqueCategories = new Set<string>();
        fetchedArtworks.forEach((artwork) => {
          artwork.category_titles.forEach((category: string) => uniqueCategories.add(category));
        });

        setCategories(Array.from(uniqueCategories));
        setTotalResults(response.data.pagination.total);
        setStatus('succeeded');
      } else {
        setStatus('failed');
        console.error('No artworks found in the response');
      }
    } catch (e) {
      setStatus('failed');
      console.error('Fetch artworks error:', e);
    }
  }, []);

  const fetchSearchResults = useCallback(async (query: string, page: number, category: string = '') => {
    setStatus('loading');
    try {
      const response = await axios.get(`https://api.artic.edu/api/v1/artworks/search`, {
        params: {
          q: query,
          page,
          limit: 10,
        },
      });

      let searchResults = await Promise.all(response.data.data.map(async (result: any) => {
        const detailResponse = await axios.get(result.api_link);
        return detailResponse.data.data;
      }));

      if (category) {
        searchResults = searchResults.filter((artwork) => artwork.category_titles.includes(category));
      }

      setArtworks(searchResults);
      setFilteredArtworks(searchResults);
      setTotalResults(response.data.pagination.total);

      const uniqueCategories = new Set<string>();
      searchResults.forEach((artwork) => {
        artwork.category_titles.forEach((category: string) => uniqueCategories.add(category));
      });
      setCategories(Array.from(uniqueCategories));
      setStatus('succeeded');
    } catch (e) {
      setStatus('failed');
      console.error('Fetch artworks error:', e);
    }
  }, []);

  useEffect(() => {
    const query = queryParams.get('search') || '';
    const category = queryParams.get('category') || '';

    setSearchQuery(query);
    setCurrentCategory(category);

    if (query) {
      fetchSearchResults(query, currentPage, category);
      setIsSearching(true);
    } else {
      fetchArtworks(currentPage, category);
      setIsSearching(false);
    }
  }, [fetchArtworks, fetchSearchResults, currentPage, location.search]);

  const handleSearchResults = useCallback((results: Artwork[], total: number, query: string) => {
    if (results) {
      setArtworks(results);
      setFilteredArtworks(results);
      setTotalResults(total);
      setSearchQuery(query);
      setIsSearching(true);
      setCurrentCategory('');
      navigate(`/?page=1&search=${query}`);

      const uniqueCategories = new Set<string>();
      results.forEach((artwork) => {
        artwork.category_titles.forEach((category: string) => uniqueCategories.add(category));
      });
      setCategories(Array.from(uniqueCategories));
      setStatus('succeeded');
    } else {
      console.error('No search results found');
    }
  }, [navigate]);

  const handleFilter = useCallback((category: string) => {
    setCurrentCategory(category);
    if (isSearching) {
      fetchSearchResults(searchQuery, currentPage, category);
    } else {
      fetchArtworks(currentPage, category);
    }
    navigate(`/?page=1&search=${searchQuery}&category=${category}`);
  }, [fetchArtworks, fetchSearchResults, isSearching, searchQuery, currentPage, navigate]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    navigate(`/?page=${value}&search=${searchQuery}&category=${currentCategory}`);
    if (isSearching) {
      fetchSearchResults(searchQuery, value, currentCategory);
    } else {
      fetchArtworks(value, currentCategory);
    }
  }, [fetchArtworks, fetchSearchResults, isSearching, searchQuery, currentCategory, navigate]);

  return (
      <Container>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Artworks
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <SearchFilter
              onSearchResults={handleSearchResults}
              categories={categories}
              onFilter={handleFilter}
          />
        </Box>
        {status === 'loading' ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
        ) : filteredArtworks.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {filteredArtworks.map((artwork) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={artwork.id}>
                      <ArtworkCard artwork={artwork} currentPage={currentPage} searchQuery={searchQuery} category={currentCategory} />
                    </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                    count={Math.ceil(totalResults / 10)}
                    page={currentPage}
                    onChange={handlePageChange}
                />
              </Box>
            </>
        ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Typography variant="h6" component="div">
                No artworks found.
              </Typography>
            </Box>
        )}
      </Container>
  );
};

export default ArtworkList;
