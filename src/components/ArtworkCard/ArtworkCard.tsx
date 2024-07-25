import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ArtworkCardProps {
    artwork: {
        id: number;
        title: string;
        image_id: string;
        artist_display: string;
        date_display: string;
        main_reference_number: string;
        dimensions: string;
    };
    currentPage: number;
    searchQuery: string;
    category: string;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, currentPage, searchQuery, category }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/artwork/${artwork.id}`, { state: { currentPage, searchQuery, category } });
    };

    return (
        <Card onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <CardMedia
                component="img"
                alt={artwork.title}
                height="200"
                image={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
                title={artwork.title}
            />
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {artwork.title}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ArtworkCard;
