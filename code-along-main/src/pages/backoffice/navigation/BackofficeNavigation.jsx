import { NavLink } from "react-router-dom"; 
import styles from "./BackofficeNavigation.module.css";

// Navigation til backoffice
const BackofficeNavigation = () => {
  return (
    <>
      {/* Link til "Stays"-siden */}
      <NavLink 
        to="/stays" 
        className={({ isActive }) => isActive ? styles.activeLink : styles.link}
      >
        Stays
      </NavLink>
      
      {/* Link til "Activities"-siden */}
      <NavLink 
        to="/activities" 
        className={({ isActive }) => isActive ? styles.activeLink : styles.link}
      >
        Activity
      </NavLink>

      {/* Link til "Reviews"-siden */}
      <NavLink 
        to="/reviews" 
        className={({ isActive }) => isActive ? styles.activeLink : styles.link}
      >
        Reviews
      </NavLink>
    </>
  );
};

export default BackofficeNavigation;
