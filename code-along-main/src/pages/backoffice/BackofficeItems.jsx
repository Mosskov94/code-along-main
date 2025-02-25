import { Outlet, useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import { useFetch } from "../../components/hooks/useFetch";
import { useState } from "react";

const BackofficeActivities = () => {
  const { activities, deleteActivity, refetch } = useFetch();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true); // Ny state for at styre synligheden

  const handleAddActivity = () => {
    navigate("/activities/add");
  };

  const handleEdit = (activityId) => {
    navigate(`/activities/edit/${activityId}`);
  };

  return (
    <article>
      <Button
        buttonText={isVisible ? "Skjul Aktiviteter" : "Vis Aktiviteter"}
        onClick={() => setIsVisible(!isVisible)}
      />

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
            {activities?.map((activity) => (
              <tr key={activity._id} className='backofficeItem'>
                <td>{activity.title}</td>
                <td>{`${activity.description.slice(0, 10)}...`}</td>
                <td>{activity.date}</td>
                <td>{activity.time}</td>
                <td>
                  <img src={activity.image} alt={activity.title}></img>
                </td>
                <td className='buttons'>
                  <Button
                    buttonText='Slet'
                    background='red'
                    onClick={() => deleteActivity(activity._id)}
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
