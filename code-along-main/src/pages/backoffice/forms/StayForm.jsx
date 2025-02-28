import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useStays } from "../../../components/hooks/useStays";
import styles from "./form.module.css";
import Button from "../../../components/button/Button";

// Formular til at oprette eller redigere et ophold
const StayForm = ({ isEditMode }) => {
  // Her laver vi nogle bokse til at gemme data om opholdet
  const [title, setTitle] = useState(""); 
  const [date, setDate] = useState(""); 
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState(""); 
  const [image, setImage] = useState(null);
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [numberOfPersons, setNumberOfPersons] = useState("");
  const [price, setPrice] = useState(""); 
  const [includes, setIncludes] = useState("");
  const [file, setFile] = useState(null); 

  const { refetch } = useOutletContext(); // Henter en funktion til at opdatere listen
  const navigate = useNavigate();
  const { id } = useParams(); // Henter ID fra URL'en
  const { createStay, isLoading, fetchStayById, updateStay } = useStays(); // Henter funktioner til at arbejde med ophold

  // Hvis vi redigerer et ophold, så henter vi dets data
  useEffect(() => {
    if (isEditMode && id) {
      const loadStayData = async () => {
        try {
          const response = await fetchStayById(id);

          if (response) {
            setTitle(response.title);
            setDescription(response.description);
            setNumberOfPersons(response.numberOfPersons);
            setPrice(response.price);
            setIncludes(response.includes);
            setFile(response.file);
          }
        } catch (error) {
          console.error("Error fetching stay:", error);
        }
      };

      loadStayData();
    }
  }, []);

  // Når brugeren vælger et billede, gemmer vi det
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objUrl = window.URL.createObjectURL(file); // Vi laver en midlertidig URL til billedet
      setImage(objUrl);
    }
  };

  // Når brugeren trykker på knappen for at gemme opholdet
  const handleSubmitStay = async (event) => {
    event.preventDefault(); // Forhindrer siden i at genindlæse

    const stayData = new FormData(); // Vi laver en form, som kan sende filer og tekst
    stayData.append("title", title);
    stayData.append("description", description);
    stayData.append("date", date);
    stayData.append("numberOfPersons", numberOfPersons);
    stayData.append("price", price);
    stayData.append("includes", includes);

    // Hvis vi redigerer, bruger vi bare den eksisterende tid, ellers samler vi fra- og til-tidspunkt
    const finalTime = isEditMode ? time : `${fromTime}-${toTime}`;
    stayData.append("time", finalTime);

    // Hvis brugeren har valgt et nyt billede, så gemmer vi det
    if (selectedFile) {
      stayData.append("file", selectedFile);
    }

    try {
      let response;
      if (isEditMode && id) {
        stayData.append("id", id);
        response = await updateStay(stayData); // Opdaterer opholdet
      } else {
        response = await createStay(stayData); // Opretter et nyt ophold
      }
      console.log(isEditMode ? "Ophold opdateret" : "Ophold oprettet", response);

      if (response) {
        await refetch(); // Opdaterer listen med ophold
        navigate("/stays"); // Går tilbage til listen med ophold
      }
    } catch (error) {
      console.error("Fejl ved håndtering af ophold:", error);
    }
  };

  return (
    <form onSubmit={handleSubmitStay} className={styles.form}>
      <h2>{isEditMode ? "Opdater ophold" : "Tilføj ophold"}</h2>
      
      <div>
        <label htmlFor='title'>Titel:</label>
        <input id='title' type='text' value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <label htmlFor='description'>Beskrivelse:</label>
        <input id='description' type='text' value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>

      <div>
        <label htmlFor='date'>Dage:</label>
        <input id='date' type='text' value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div>
        <label htmlFor='numberOfPersons'>Antal personer:</label>
        <input id='numberOfPersons' type='number' value={numberOfPersons} onChange={(e) => setNumberOfPersons(e.target.value)} required />
      </div>

      <div>
        <label htmlFor='price'>Pris:</label>
        <input id='price' type='text' value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>

      <div>
        <label htmlFor='includes'>Inkluderer:</label>
        <input id='includes' type='text' value={includes} onChange={(e) => setIncludes(e.target.value)} required />
      </div>

      {/* Hvis vi redigerer, så vises et felt til at skrive tiden direkte */}
      {isEditMode ? (
        <div>
          <label htmlFor='time'>Tid:</label>
          <input id='time' type='text' value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
      ) : (
        <>
          <div>
            <label htmlFor='fromTime'>Fra kl:</label>
            <input id='fromTime' type='time' value={fromTime} onChange={(e) => setFromTime(e.target.value)} required />
          </div>

          <div>
            <label htmlFor='toTime'>Til kl:</label>
            <input id='toTime' type='time' value={toTime} onChange={(e) => setToTime(e.target.value)} required />
          </div>
        </>
      )}

      {/* Billedupload */}
      <div>
        <label htmlFor='image'>Vælg billede (valgfrit):</label>
        {image && <img className={styles.previewImage} src={image} alt='Preview' />}
        <input id='image' type='file' onChange={handleImageChange} />
      </div>

      {/* Knappen til at gemme opholdet */}
      <Button type='submit' buttonText={isEditMode ? "Opdater ophold" : "Tilføj ophold"} background={!isEditMode && "green"} />
    </form>
  );
};

export default StayForm;
