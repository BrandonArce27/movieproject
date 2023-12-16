import { Movie, Review } from "./Home";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase";
import { ChangeEvent, FormEvent, useState } from "react";

interface ModalProps {
  movie: Movie;
  reviews: Review[];
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ movie, reviews, onClose }) => {
  const [newReview, setNewReview] = useState<string>("");

  const handleNewReviewChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview(event.target.value);
  };

  const handleNewReviewSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (newReview.trim() !== "") {
      const userEmail = auth.currentUser
        ? auth.currentUser.email
        : "No user signed in";
      await addDoc(collection(db, "reviews"), {
        movieId: movie.id,
        userEmail: userEmail,
        content: newReview,
      });

      setNewReview("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 max-w-md max-h-full overflow-auto">
        <h2 className="font-bold text-xl mb-2">Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="mb-2">
              <p className="font-bold">{review.userEmail}</p>
              <p>{review.content}</p>
            </div>
          ))
        ) : (
          <p>No reviews for this movie.</p>
        )}
        <form onSubmit={handleNewReviewSubmit} className="mt-4">
          <textarea
            value={newReview}
            onChange={handleNewReviewChange}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            type="submit"
            className="mr-2 py-1 px-2 bg-blue-500 text-white rounded"
          >
            Add Review
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-1 px-2 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
