import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { AppBar, Box, Toolbar } from "@mui/material";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

interface RatingReviewProps {
  tmdbRating: number;
  setRating: (rating: number) => void;
}

const Header: React.FC = () => (
  <AppBar
    position="static"
    style={{ backgroundColor: "#E50914", color: "#FFFFFF" }}
  >
    <Toolbar>
      <Typography variant="h6" style={{ fontWeight: "bold" }}>
        KinFlix
      </Typography>
    </Toolbar>
  </AppBar>
);

const RatingReview: React.FC<RatingReviewProps> = ({
  tmdbRating,
  setRating,
}) => {
  const [internalRating, setInternalRating] = useState<number>(0);

  useEffect(() => {
    const initialRating = Math.round((tmdbRating / 2) * 10) / 10;
    setInternalRating(initialRating);
  }, [tmdbRating]);

  const handleRating = (ratingValue: number) => {
    setInternalRating(ratingValue);
    setRating(ratingValue);
  };

  return (
    <div>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={starValue}
            style={{
              cursor: "pointer",
              color:
                internalRating >= starValue
                  ? "gold"
                  : internalRating >= starValue - 0.5
                  ? "gold"
                  : "gray",
              fontSize: `35px`,
            }}
            onClick={() => handleRating(starValue)}
          >
            {internalRating >= starValue
              ? "★"
              : internalRating >= starValue - 0.5
              ? "☆"
              : "☆"}
          </span>
        );
      })}
    </div>
  );
};

const MovieCatalog: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const API_KEY = "YOUR_API_KEY";
    const URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

    axios
      .get(URL)
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  return (
    <>
      <Header />
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Grid container spacing={2}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={2.4} key={movie.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#121212",
                  color: "#fff",
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ height: 250, objectFit: "cover" }}
                  image={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                />
                <CardContent sx={{ flexGrow: 1, backgroundColor: "#181818" }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    {movie.title}
                  </Typography>
                  <RatingReview
                    tmdbRating={movie.vote_average}
                    setRating={(newRating) => console.log(newRating)}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default MovieCatalog;
