import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useStays } from "../../../components/hooks/useStays";
import styles from "./form.module.css";
import Button from "../../../components/button/Button";

const StayForm = ({ isEditMode }) => {
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
  
  const { refetch } = useOutletContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const { createStay, isLoading, fetchStayById, updateStay } = useStays();

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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objUrl = window.URL.createObjectURL(file);
      setImage(objUrl);
    }
  };

  const handleSubmitStay = async (event) => {
    event.preventDefault();

    const stayData = new FormData();
    stayData.append("title", title);
    stayData.append("description", description);
    stayData.append("date", date);
    stayData.append("numberOfPersons", numberOfPersons);
    stayData.append("price", price);
    stayData.append("includes", includes);

    const finalTime = isEditMode ? time : `${fromTime}-${toTime}`;
    stayData.append("time", finalTime);

    if (selectedFile) {
      stayData.append("file", selectedFile);
    }

    try {
      let response;
      if (isEditMode && id) {
        stayData.append("id", id);
        response = await updateStay(stayData);
      } else {
        response = await createStay(stayData);
      }
      console.log(isEditMode ? "Ophold opdateret" : "Ophold oprettet", response);

      if (response) {
        await refetch();
        navigate("/stays");
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
      <div>
        <label htmlFor='image'>Vælg billede (valgfrit):</label>
        {image && <img className={styles.previewImage} src={image} alt='Preview' />}
        <input id='image' type='file' onChange={handleImageChange} />
      </div>
      <Button type='submit' buttonText={isEditMode ? "Opdater ophold" : "Tilføj ophold"} background={!isEditMode && "green"} />
    </form>
  );
};

export default StayForm;
