import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useFetch } from "../../../components/hooks/useFetch";
import styles from "./form.module.css";
import Button from "../../../components/button/Button";

const ActivityForm = ({ isEditMode }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [image, setImage] = useState(null);
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { refetch } = useOutletContext(); 
  const navigate = useNavigate(); 
  const { id } = useParams();
  const { createActivity, isLoading, fetchActivityById, updateActivity } = useFetch();

  // Hent aktivitetdata hvis vi er i redigeringstilstand
  useEffect(() => {
    if (isEditMode && id) {
      const loadActivityData = async () => {
        try {
          const response = await fetchActivityById(id);

          if (response) {
            setTitle(response.title ?? "");
            setDate(response.date ?? "");
            setTime(response.time ?? "");
            setDescription(response.description ?? "");
            setImage(response.image ?? "");
          }
        } catch (error) {
          console.error("Error fetching activity:", error);
        }
      };

      loadActivityData();
    }
  }, [id, isEditMode, fetchActivityById]); // Kaldt når ID eller isEditMode ændres

  // Håndter filvalg og billede preview
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (image) {
        window.URL.revokeObjectURL(image); // Frigør tidligere URL for billede
      }
      setSelectedFile(file); // Sæt den valgte fil
      setImage(window.URL.createObjectURL(file)); // Opret en URL til at vise billedet
    }
  };

  // Håndter formularindsendelse
  const handleSubmitActivity = async (event) => {
    event.preventDefault();

    const activityData = new FormData(); // Opretter en FormData for at sende data til serveren
    activityData.append("title", title);
    activityData.append("description", description); 
    activityData.append("date", date);

    // Hvis vi er i redigeringstilstand, brug den eksisterende tid
    // Ellers, brug tid fra to inputfelter
    const finalTime = isEditMode ? time : `${fromTime}-${toTime}`;
    activityData.append("time", finalTime);

    // Hvis der er valgt billede, vedhæft det
    if (selectedFile) {
      activityData.append("file", selectedFile);
    }

    try {
      let response;
      // Hvis vi er i redigeringstilstand, opdater aktiviteten
      if (isEditMode && id) {
        activityData.append("id", id); // Tilføj ID for opdatering
        response = await updateActivity(activityData); // Opdater aktivitet
      } else {
        response = await createActivity(activityData); // Opret aktivitet
      }
      console.log(
        isEditMode ? "Aktivitet opdateret" : "Aktivitet oprettet",
        response
      );

      if (response) {
        await refetch(); // Opdater oversigten over aktiviteter
        navigate("/activities"); // Naviger tilbage til aktivitetsoversigten
      }
    } catch (error) {
      console.error("Fejl ved håndtering af aktivitet:", error);
    }
  };

  return (
    <form onSubmit={handleSubmitActivity} className={styles.form}>
      <h2>{isEditMode ? "Opdater aktivitet" : "Tilføj aktivitet"}</h2>

      <div>
        <label htmlFor="title">Titel:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Håndter ændring af titel
          required
        />
      </div>

      <div>
        <label htmlFor="description">Beskrivelse:</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Håndter ændring af beskrivelse
          required
        />
      </div>

      <div>
        <label htmlFor="date">Dage:</label>
        <input
          id="date"
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)} // Håndter ændring af dato
          required
        />
      </div>

      {isEditMode ? (
        <div>
          <label htmlFor="time">Tid:</label>
          <input
            id="time"
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)} // Håndter ændring af tid (kun ved redigering)
            required
          />
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="fromTime">Fra kl:</label>
            <input
              id="fromTime"
              type="time"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)} // Håndter ændring af starttidspunkt
              required
            />
          </div>
          <div>
            <label htmlFor="toTime">Til kl:</label>
            <input
              id="toTime"
              type="time"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)} // Håndter ændring af sluttidspunkt
              required
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="image">Vælg billede (valgfrit):</label>
        {image && <img className={styles.previewImage} src={image} alt="Preview" />}
        <input id="image" type="file" onChange={handleImageChange} />
      </div>

      <Button
        type="submit"
        buttonText={isEditMode ? "Opdater aktivitet" : "Tilføj aktivitet"}
        background={!isEditMode && "green"} // Sætter baggrundsfarve til grøn ved oprettelse
        disabled={isLoading} // Deaktiverer knappen, når aktiviteten behandles
      />
    </form>
  );
};

export default ActivityForm;
