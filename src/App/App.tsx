import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import getMovies from "../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../types/movie";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

function App() {
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => getMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.results.length === 0) {
      toast.error("No movies found for the given query.");
    }
  }, [data]);

  const handleQuery = (query: string) => {
    setCurrentPage(1);
    setQuery(query);
  };

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };
  const totalPages = data?.total_pages || 0;
  const page = currentPage;

  const setPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleQuery} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isSuccess ? (
        <MovieGrid onSelect={openModal} movies={data.results} />
      ) : null}
      {isLoading && <Loader />}
      {isError && <ErrorMessage error={error} />}
      {isModalOpen && selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
