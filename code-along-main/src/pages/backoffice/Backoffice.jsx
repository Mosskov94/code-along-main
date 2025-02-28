import { Outlet } from "react-router-dom";
import BackofficeNavigation from "./navigation/BackofficeNavigation";
import UserProfile from "./userProfile/UserProfile";

// Her laver vi en side, der samler hele backoffice-systemet
const Backoffice = () => {
  return (
    <article className='backoffice'>
      <h1>Backoffice</h1>
      
      <UserProfile />
      
      <BackofficeNavigation /> {/* Viser menuen, så vi kan navigere rundt */}

      {/* Her viser vi det indhold, der passer til den valgte side */}
      <div className='backofficeContent'>
        <Outlet />
      </div>
    </article>
  );
};

export default Backoffice;
