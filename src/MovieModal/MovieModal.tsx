import css from "./MovieModal.module.css";
import { createPortal } from "react-dom";
import type { Movie } from "../types/movie";
import { useEffect } from "react";

interface MovieModalProps {
  onClose: () => void;
  movie: Movie;
}

function MovieModal({
  onClose,
  movie: { backdrop_path, title, overview, release_date, vote_average },
}: MovieModalProps) {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <button
          onClick={onClose}
          className={css.closeButton}
          aria-label="Close modal"
        >
          &times;
        </button>
        <img
          src={`https://image.tmdb.org/t/p/original/${backdrop_path}`}
          alt={`${title}`}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{`${title}`}</h2>
          <p>{`${overview}`}</p>
          <p>
            <strong>Release Date:</strong> {`${release_date}`}
          </p>
          <p>
            <strong>Rating:</strong> {`${vote_average}/10`}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default MovieModal;
