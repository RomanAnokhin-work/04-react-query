import axios from "axios";
import type { Movie } from "../types/movie";

const myKey = import.meta.env.VITE_TMDB_TOKEN;

export interface GetMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
}

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3/search",
  timeout: 1000,
  headers: {
    Authorization: `Bearer ${myKey}`,
    accept: "application/json",
  },
});

async function getMovies(
  movieQuery: string,
  currentPage: number,
): Promise<GetMoviesResponse> {
  const { data } = await instance.get<GetMoviesResponse>(
    `/movie?query=${movieQuery}&page=${currentPage}`,
  );

  return data;
}
export default getMovies;
