/* eslint-disable eqeqeq */
import { useState, useEffect } from "react";
import { API_KEY, API_URL } from "../../config";

export const useHomeFetch = searchTerm => {
  const [state, setState] = useState({ movies: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchMovies = async endpoint => {
    setError(false);
    setLoading(true);

    const isLoadMore = endpoint.search("page");

    try {
      const result = await (await fetch(endpoint)).json();
      setState(prevState => ({
        ...prevState,
        movies:
          isLoadMore !== -1
            ? [...prevState.movies, ...result.results]
            : [...result.results],
        heroImage: prevState.heroImage || result.results[0],
        currentPage: result.page,
        totalPages: result.total_pages
      }));
    } catch (error) {
      console.log(error);
      setError(true);
    }

    setLoading(false);
  };

  // Fetch popular movies initially on mount
  useEffect(() => {
    if (sessionStorage.homeState) {
      console.log("Grabbing from session storage");
      setState(JSON.parse(sessionStorage.homeState));
    } else {
      console.log("Grabbing from API");
      fetchMovies(`${API_URL}movie/popular?api_key=${API_KEY}`);
    }
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      console.log("Writing to session storage");
      sessionStorage.setItem("homeState", JSON.stringify(state));
    }
  }, [searchTerm, state]);

  return [{ state, loading, error }, fetchMovies];
};
