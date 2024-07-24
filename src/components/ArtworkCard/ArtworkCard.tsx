import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, CardMedia, CardContent, Typography, Tooltip } from '@mui/material';
import { Artwork } from '../../store/artworksSlice';


interface ArtworkCardProps {
    artwork: Artwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
    return (
        <Grid item key={artwork.id} xs={12} sm={6} md={3}>
            <Card className="artwork-card">
                <Link to={`/artwork/${artwork.id}`} style={{ textDecoration: 'none' }}>
                    <CardMedia
                        component="img"
                        alt={artwork.title}
                        height="200"
                        image={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
                        title={artwork.title}
                        className="artwork-image"
                    />
                    <CardContent>
                        <Tooltip title={artwork.title} placement="top" arrow>
                            <Typography
                                gutterBottom
                                variant="h6"
                                component="div"
                                className="artwork-title"
                            >
                                {artwork.title}
                            </Typography>
                        </Tooltip>
                    </CardContent>
                </Link>
            </Card>
        </Grid>
    );
};

export default ArtworkCard;
