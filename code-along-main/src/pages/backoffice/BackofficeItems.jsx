import { Outlet, useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import { useFetch } from "../../components/hooks/useFetch";
import { useState } from "react";
import Swal from 'sweetalert2'; // Import SweetAlert2

// Her laver vi en side til at styre aktiviteter i backoffice
const BackofficeActivities = () => {
  const { activities, deleteActivity, refetch } = useFetch(); // Henter aktiviteter og funktioner til at slette og opdatere
  const navigate = useNavigate(); // Gør det muligt at skifte side
  const [isVisible, setIsVisible] = useState(true); // Bestemmer om vi skal vise listen eller ej

  // Funktion til at gå til siden, hvor vi kan tilføje en ny aktivitet
  const handleAddActivity = () => {
    navigate("/activities/add");
  };

  // Funktion til at gå til siden, hvor vi kan redigere en aktivitet
  const handleEdit = (activityId) => {
    navigate(`/activities/edit/${activityId}`);
  };

  // Funktion til at håndtere sletning af aktivitet med bekræftelse
  const handleDelete = (activityId) => {
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
        // Slet aktivitet, hvis bekræftet
        deleteActivity(activityId);
        Swal.fire('Slettet!', 'Aktiviteten er blevet slettet.', 'success');
      }
    });
  };

  return (
    <article>
      {/* Knappen viser eller skjuler vores liste over aktiviteter */}
      <Button
        buttonText={isVisible ? "Skjul Aktiviteter" : "Vis Aktiviteter"}
        onClick={() => setIsVisible(!isVisible)}
      />

      {/* Hvis isVisible er sandt, så viser vi tabellen */}
      {isVisible && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Ugedage</th>
              <th>Tidspunkt</th>
              <th>Billede</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Vi kører igennem alle aktiviteterne og viser dem i tabellen */}
            {activities?.map((activity) => (
              <tr key={activity._id} className='backofficeItem'>
                <td>{activity.title}</td>
                <td>{`${activity.description.slice(0, 10)}...`}</td> {/* Forkorter beskrivelsen */}
                <td>{activity.date}</td>
                <td>{activity.time}</td>
                <td>
                  <img src={activity.image} alt={activity.title}></img> {/* Viser billedet af aktiviteten */}
                </td>
                <td className='buttons'>
                  <Button
                    buttonText='Slet'
                    background='red'
                    onClick={() => handleDelete(activity._id)} // Brug handleDelete her
                  />
                  <Button
                    buttonText='Redigér'
                    onClick={() => handleEdit(activity._id)}
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <Button
                  buttonText='Tilføj aktivitet'
                  background='green'
                  onClick={() => handleAddActivity()}
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

export { BackofficeActivities };
