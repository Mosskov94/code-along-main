import { Outlet, useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import { useStays } from "../../components/hooks/useStays";
import { useState } from "react";

const BackofficeStays = () => {
  const { stays, deleteStay, refetch } = useStays();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true); // Ny state for at styre synligheden

  const handleAddStays = () => {
    navigate("/stays/add");
  };


  const handleEdit = (staysId) => {
    console.log(staysId)
    navigate(`/stays/edit/${staysId}`);
  };

  return (
    <article>
      <Button
        buttonText={isVisible ? "Skjul Ophold" : "Vis Ophold"}
        onClick={() => setIsVisible(!isVisible)}
      />

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
                    onClick={() => deleteStay(stay._id)}
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

      <Outlet context={{ refetch }} />
    </article>
  );
};

export { BackofficeStays };
