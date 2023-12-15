import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

interface RatingProps {
  movieId: number;
}

const Rating: React.FC<RatingProps> = ({ movieId }) => {
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      const q = query(
        collection(db, "ratings"),
        where("movieId", "==", movieId),
        where("userEmail", "==", auth.currentUser?.email)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setRating(doc.data().rating);
      });
    };

    fetchRating();
  }, [movieId]);

  const handleRating = async (ratingValue: number) => {
    setRating(ratingValue);

    const q = query(
      collection(db, "ratings"),
      where("movieId", "==", movieId),
      where("userEmail", "==", auth.currentUser?.email)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Document exists, update it
      const docRef = doc(db, "ratings", querySnapshot.docs[0].id);
      await updateDoc(docRef, { rating: ratingValue });
    } else {
      // Document does not exist, create it
      await addDoc(collection(db, "ratings"), {
        movieId: movieId,
        userEmail: auth.currentUser?.email,
        rating: ratingValue,
      });
    }
  };

  return (
    <div className="flex justify-center">
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <label key={i} className="mx-1">
            <input
              type="radio"
              name={`rating-${movieId}`}
              value={ratingValue}
              className="hidden"
              onClick={() => handleRating(ratingValue)}
            />
            <FaStar
              size={30}
              color={ratingValue <= (rating || 0) ? "#ffc107" : "gray"}
            />
          </label>
        );
      })}
    </div>
  );
};

export default Rating;
