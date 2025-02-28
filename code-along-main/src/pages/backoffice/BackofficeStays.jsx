import { Outlet, useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import { useStays } from "../../components/hooks/useStays";
import { useState } from "react";
import Swal from 'sweetalert2'; // Importér SweetAlert2

// Her laver vi en side til at styre vores ophold i backoffice
const BackofficeStays = () => {
  const { stays, deleteStay, refetch } = useStays(); // Henter vores ophold og funktioner til at slette og opdatere
  const navigate = useNavigate(); // Gør det muligt at skifte side
  const [isVisible, setIsVisible] = useState(true); // Bestemmer om vi skal vise listen eller ej

  // Funktion til at gå til siden, hvor vi kan tilføje et nyt ophold
  const handleAddStays = () => {
    navigate("/stays/add");
  };

  // Funktion til at gå til siden, hvor vi kan redigere et ophold
  const handleEdit = (staysId) => {
    navigate(`/stays/edit/${staysId}`);
  };

  // Funktion til at håndtere sletning med bekræftelse
  const handleDelete = (stayId) => {
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
        // Sletning af opholdet, hvis brugeren bekræfter
        deleteStay(stayId);
        Swal.fire('Slettet!', 'Opholdet er blevet slettet.', 'success');
      }
    });
  };

  return (
    <article>
      {/* Knappen viser eller skjuler vores liste over ophold */}
      <Button
        buttonText={isVisible ? "Skjul Ophold" : "Vis Ophold"}
        onClick={() => setIsVisible(!isVisible)}
      />

      {/* Hvis isVisible er sandt, så viser vi tabellen */}
      {isVisible && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Persons</th>
              <th>Price</th>
              <th>Includes</th>
              <th>Picture</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Vi kører igennem alle vores ophold og viser dem i tabellen */}
            {stays?.map((stay) => (
              <tr key={stay._id} className='backofficeItem'>
                <td>{stay.title}</td>
                <td>{`${stay.description.slice(0, 10)}...`}</td>
                <td>{stay.numberOfPersons}</td>
                <td>{stay.price}</td>
                <td>{stay.includes}</td>
                <td>
                  <img src={stay.file} alt={stay.title}></img>
                </td>

                <td className='buttons'>
                  <Button
                    buttonText='Slet'
                    background='red'
                    onClick={() => handleDelete(stay._id)} // Brug handleDelete her
                  />
                  <Button
                    buttonText='Redigér'
                    onClick={() => handleEdit(stay._id)}
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <Button
                  buttonText='Tilføj ophold'
                  background='green'
                  onClick={() => handleAddStays()}
                />
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* Outlet gør det muligt at vise indhold fra underliggende routes */}
      <Outlet context={{ refetch }} />
    </article>
  );
};

export { BackofficeStays };
