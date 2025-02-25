import { Outlet, useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import { useReviews } from "../../components/hooks/useReviews";
import { useState, useEffect } from "react";

const BackofficeReviews = () => {
  const { reviews, deleteReview, refetch, isLoading, error } = useReviews(); // Antag at useReviews returnerer også isLoading og error
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  const handleAddReview = () => {
    navigate("/reviews/add");
  };

  const handleEdit = (reviewId) => {
    navigate(`/reviews/edit/${reviewId}`);
  };

  useEffect(() => {
    if (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [error]);

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <article>
      <Button
        buttonText={isVisible ? "Skjul Reviews" : "Vis Reviews"}
        onClick={() => setIsVisible(!isVisible)}
      />

      {isVisible && reviews?.length === 0 && <p>Ingen reviews tilgængelige.</p>}

      {isVisible && reviews?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Age</th>
              <th>Name</th>
              <th>Review</th>
              <th>Stay</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews?.map((review) => (
              <tr key={review._id} className="backofficeItem">
                <td>{review.age}</td>
                <td>{review.name}</td>
                <td>{`${review.review.slice(0, 10)}...`}</td>
                <td>{review.stay}</td>
                <td>
                  {review.file && <img src={review.file} alt={`${review.name}'s review`} />}
                </td>
                <td className="buttons">
                  <Button
                    buttonText="Slet"
                    background="red"
                    onClick={() => deleteReview(review._id)} // Delete review
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <Button
                  buttonText="Tilføj review"
                  background="green"
                  onClick={() => handleAddReview()} // Navigate to add review page
                />
              </td>
            </tr>
          </tbody>
        </table>
      )}

      <Outlet context={{ refetch }} />
    </article>
  );
};

export { BackofficeReviews };
