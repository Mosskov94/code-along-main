// ACTIVITYFORM
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
  const { refetch } = useOutletContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { createActivity, isLoading, fetchActivityById, updateActivity } =
    useFetch();

  // Hent review hvis editMode er true
  useEffect(() => {
    if (isEditMode && id) {
      const loadReviewData = async () => {
        try {
          const response = await fetchActivityById(id);

          if (response) {
            // Forudfyld formularen med opholdets data
            setTitle(response.title);
            setDate(response.date);
            setTime(response.time);
            setDescription(response.description);
            setImage(response.image);
          }
        } catch (error) {
          console.error("Error fetching activity:", error);
        }
      };

      loadReviewData();
    }
  }, []);

  // Forhåndsvis billede
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objUrl = window.URL.createObjectURL(file);
      setImage(objUrl);
    }
  };

  const handleSubmitActivity = async (event) => {
    event.preventDefault();

    const activityData = new FormData();
    activityData.append("title", title);
    activityData.append("description", description);
    activityData.append("date", date);

    // Kombiner `fromTime` og `toTime` kun hvis `isEditMode` er falsk
    const finalTime = isEditMode ? time : `${fromTime}-${toTime}`;
    activityData.append("time", finalTime);

    // Tilføj billedet hvis det er valgt
    if (selectedFile) {
      activityData.append("file", selectedFile);
    }

    try {
      let response;
      if (isEditMode && id) {
        activityData.append("id", id);
        response = await updateActivity(activityData);
      } else {
        response = await createActivity(activityData);
      }
      console.log(
        isEditMode ? "Aktivitet opdateret" : "Ophold oprettet",
        response
      );

      if (response) {
        await refetch();
        navigate("/activities");
      }
    } catch (error) {
      console.error("Fejl ved håndtering af aktivitet:", error);
    }
  };

  return (
    <form onSubmit={handleSubmitActivity} className={styles.form}>
      <h2>{isEditMode ? "Opdater aktivitet" : "Tilføj aktivitet"}</h2>
      <div>
        {/* 
        Når htmlFor-attributten på en <label> matcher id-attributten på et <input>-element, oprettes der en forbindelse mellem dem.
        Dette betyder, at når brugeren klikker på etiketten, bliver det tilknyttede inputfelt automatisk aktiveret eller fokuseret. 
        Dette gør både brugervenligheden og tilgængeligheden (accessibility) bedre
        */}
        <label htmlFor='title'>Titel:</label>
        <input
          id='title'
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor='description'>Beskrivelse:</label>
        <input
          id='description'
          type='text'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor='date'>Dage:</label>
        <input
          id='date'
          type='text'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      {isEditMode ? (
        <div>
          <label htmlFor='time'>Tid:</label>
          <input
            id='time'
            type='text'
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      ) : (
        <>
          <div>
            <label htmlFor='fromTime'>Fra kl:</label>
            <input
              id='fromTime'
              type='time'
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor='toTime'>Til kl:</label>
            <input
              id='toTime'
              type='time'
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              required
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor='image'>Vælg billede (valgfrit):</label>
        {image && <img className={styles.previewImage} src={image} />}
        <input id='image' type='file' onChange={handleImageChange} />
      </div>

      <Button
        type='submit'
        buttonText={isEditMode ? "Opdater aktivitet" : "Tilføj aktivitet"}
        background={!isEditMode && "green"}
      />
    </form>
  );
};

export default ActivityForm;
