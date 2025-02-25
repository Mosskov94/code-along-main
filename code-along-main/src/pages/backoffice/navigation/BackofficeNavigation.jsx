import { NavLink } from "react-router-dom";
import styles from "./BackofficeNavigation.module.css";

const BackofficeNavigation = () => {
  return (
    <>
      <NavLink 
        to="/stays" 
        className={({ isActive }) => isActive ? styles.activeLink : styles.link}
      >
        Stays
      </NavLink>
      
      <NavLink 
        to="/activities" 
        className={({ isActive }) => isActive ? styles.activeLink : styles.link}
      >
        Activity
      </NavLink>

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
