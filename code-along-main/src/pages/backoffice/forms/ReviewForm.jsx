import { useEffect, useState } from "react"; 
import { useNavigate, useOutletContext, useParams } from "react-router-dom"; 
import { useReviews } from "../../../components/hooks/useReviews";
import styles from "./form.module.css"; 
import Button from "../../../components/button/Button";

// ReviewForm er en formular til at oprette eller redigere en anmeldelse
const ReviewForm = ({ isEditMode }) => {
  // Opretter forskellige bokse (state) til at gemme data om anmeldelsen
  const [review, setReview] = useState("");
  const [age, setAge] = useState("");
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState(null);

  const { refetch } = useOutletContext(); // Henter en funktion til at opdatere anmeldelser
  const navigate = useNavigate(); // Bruges til at skifte side
  const { id } = useParams(); // Finder anmeldelsens ID fra URL'en
  const { createReview, isLoading, fetchReviewById, updateReview } = useReviews(); // Funktioner til at hente, oprette og opdatere anmeldelser

  // Hvis vi redigerer en anmeldelse, henter vi dens data
  useEffect(() => {
    if (isEditMode && id) {
      const loadReviewData = async () => {
        try {
          const response = await fetchReviewById(id); // Henter anmeldelsen

          if (response) {
            setReview(response.review);
            setAge(response.age);
            setName(response.name);
          }
        } catch (error) {
          console.error("Error fetching review:", error);
        }
      };

      loadReviewData();
    }
  }, [id, isEditMode, fetchReviewById]); // Kører kun, hvis id eller isEditMode ændrer sig

  // Når brugeren vælger et billede, gemmer vi det
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Gemmer filen
      const objUrl = window.URL.createObjectURL(file); // Laver en midlertidig URL til at vise billedet
      setImage(objUrl); // Gemmer billed-URL'en til forhåndsvisning
    }
  };

  // Når brugeren trykker på "Tilføj review" eller "Opdater review"
  const handleSubmitReview = async (event) => {
    event.preventDefault(); // Stopper siden fra at genindlæse

    const reviewData = new FormData(); // Bruger FormData til at kunne sende filer
    reviewData.append("review", review); 
    reviewData.append("age", age); 
    reviewData.append("name", name); 

    // Hvis brugeren har valgt et billede, tilføjes det
    if (selectedFile) {
      reviewData.append("file", selectedFile);
    }

    try {
      let response;
      if (isEditMode && id) {
        reviewData.append("id", id);
        response = await updateReview(reviewData); // Opdaterer anmeldelsen
      } else {
        response = await createReview(reviewData); // Opretter en ny anmeldelse
      }
      console.log(isEditMode ? "Review opdateret" : "Review oprettet", response);

      if (response) {
        await refetch(); // Opdaterer listen med anmeldelser
        navigate("/review"); // Går tilbage til anmeldelsessiden
      }
    } catch (error) {
      console.error("Fejl ved håndtering af reviews:", error);
    }
  };

  return (
    <form onSubmit={handleSubmitReview} className={styles.form}>
      <h2>{isEditMode ? "Opdater review" : "Tilføj review"}</h2>

      {/* Felt til at skrive anmeldelsen */}
      <div>
        <label htmlFor="review">Review:</label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
      </div>

      {/* Felt til at angive alder */}
      <div>
        <label htmlFor="age">Alder:</label>
        <input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </div>

      {/* Felt til at skrive anmelderens navn */}
      <div>
        <label htmlFor="name">Navn:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Billedupload */}
      <div>
        <label htmlFor="image">Vælg billede (valgfrit):</label>
        {image && <img className={styles.previewImage} src={image} alt="Preview" />}
        <input id="image" type="file" onChange={handleImageChange} />
      </div>

      {/* Knappen til at sende anmeldelsen */}
      <Button type="submit" buttonText={isEditMode ? "Opdater review" : "Tilføj review"} background={!isEditMode && "green"} />
    </form>
  );
};

export default ReviewForm;
