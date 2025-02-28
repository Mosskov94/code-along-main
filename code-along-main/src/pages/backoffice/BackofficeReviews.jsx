import { Outlet, useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import { useReviews } from "../../components/hooks/useReviews";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2'; // Import SweetAlert2

// Her laver vi en side til at styre anmeldelser i backoffice
const BackofficeReviews = () => {
  const { reviews, deleteReview, refetch, isLoading, error } = useReviews(); // Henter vores anmeldelser og funktioner til at slette og opdatere
  const navigate = useNavigate(); // Gør det muligt at skifte side
  const [isVisible, setIsVisible] = useState(true); // Bestemmer om vi skal vise listen eller ej

  // Funktion til at gå til siden, hvor vi kan tilføje en ny anmeldelse
  const handleAddReview = () => {
    navigate("/reviews/add");
  };

  // Funktion til at gå til siden, hvor vi kan redigere en anmeldelse
  const handleEdit = (reviewId) => {
    navigate(`/reviews/edit/${reviewId}`);
  };

  // Hvis der opstår en fejl ved hentning af anmeldelser, så viser vi den i konsollen
  useEffect(() => {
    if (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [error]);

  // Hvis anmeldelserne er ved at blive hentet, viser vi en besked
  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  // Funktion til at håndtere sletning med bekræftelse
  const handleDelete = (reviewId) => {
    Swal.fire({
      title: 'Er du sikker?',
      text: 'Du kan ikke fortryde denne handling!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ja, slet',
      cancelButtonText: 'Annuller',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Sletning af anmeldelsen, hvis brugeren bekræfter
        deleteReview(reviewId);
        Swal.fire('Slettet!', 'Anmeldelsen er blevet slettet.', 'success');
      }
    });
  };

  return (
    <article>
      <Button
        buttonText={isVisible ? "Skjul Reviews" : "Vis Reviews"}
        onClick={() => setIsVisible(!isVisible)}
      />

      {/* Hvis der ikke er nogen anmeldelser, viser vi en besked */}
      {isVisible && reviews?.length === 0 && <p>Ingen reviews tilgængelige.</p>}

      {/* Hvis der er anmeldelser, viser vi dem i en tabel */}
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
            {/* Vi kører igennem alle anmeldelserne og viser dem i tabellen */}
            {reviews?.map((review) => (
              <tr key={review._id} className="backofficeItem">
                <td>{review.age}</td>
                <td>{review.name}</td>
                <td>{`${review.review.slice(0, 10)}...`}</td> {/* Forkorter anmeldelsen */}
                <td>{review.stay}</td>
                <td>
                  {review.file && <img src={review.file} alt={`${review.name}'s review`} />}
                </td>
                <td className="buttons">
                  <Button
                    buttonText="Slet"
                    background="red"
                    onClick={() => handleDelete(review._id)} // Brug handleDelete her
                  />
                  <Button
                    buttonText="Rediger"
                    background="yellow"
                    onClick={() => handleEdit(review._id)}
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="6">
                <Button
                  buttonText="Tilføj review"
                  background="green"
                  onClick={() => handleAddReview()}
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
