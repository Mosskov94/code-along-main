import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useReviews } from "../../../components/hooks/useReviews"; // Assuming this is the correct hook for reviews
import styles from "./form.module.css";
import Button from "../../../components/button/Button";

const ReviewForm = ({ isEditMode }) => {
  const [review, setReview] = useState(""); // Correct state for review text
  const [age, setAge] = useState(""); // Age of reviewer
  const [name, setName] = useState(""); // Name of reviewer
  const [selectedFile, setSelectedFile] = useState(null); // File upload state
  const [image, setImage] = useState(null); // Image preview state
  
  const { refetch } = useOutletContext(); // To trigger a refetch after submit
  const navigate = useNavigate();
  const { id } = useParams();
  const { createReview, isLoading, fetchReviewById, updateReview } = useReviews();

  useEffect(() => {
    if (isEditMode && id) {
      const loadReviewData = async () => {
        try {
          const response = await fetchReviewById(id);

          if (response) {
            setReview(response.review);
            setAge(response.age);
            setName(response.name);
            // Assuming review includes a file property
            setFile(response.file);
          }
        } catch (error) {
          console.error("Error fetching review:", error);
        }
      };

      loadReviewData();
    }
  }, [id, isEditMode, fetchReviewById]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objUrl = window.URL.createObjectURL(file);
      setImage(objUrl);
    }
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    const reviewData = new FormData();
    reviewData.append("review", review);
    reviewData.append("age", age);
    reviewData.append("name", name);

    if (selectedFile) {
      reviewData.append("file", selectedFile);
    }

    try {
      let response;
      if (isEditMode && id) {
        reviewData.append("id", id);
        response = await updateReview(reviewData);
      } else {
        response = await createReview(reviewData);
      }
      console.log(isEditMode ? "Review opdateret" : "Review oprettet", response);

      if (response) {
        await refetch(); // Refetch to update the reviews list
        navigate("/review"); // Redirect after submission
      }
    } catch (error) {
      console.error("Fejl ved håndtering af reviews:", error);
    }
  };

  return (
    <form onSubmit={handleSubmitReview} className={styles.form}>
      <h2>{isEditMode ? "Opdater review" : "Tilføj review"}</h2>
      <div>
        <label htmlFor="review">Review:</label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="age">Age:</label>
        <input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="image">Vælg billede (valgfrit):</label>
        {image && <img className={styles.previewImage} src={image} alt="Preview" />}
        <input id="image" type="file" onChange={handleImageChange} />
      </div>
      <Button type="submit" buttonText={isEditMode ? "Opdater review" : "Tilføj review"} background={!isEditMode && "green"} />
    </form>
  );
};

export default ReviewForm;
