import { useAuthContext } from "../../../context/useAuthContext"; // Henter login-information
import styles from "./userProfile.module.css"; // Henter vores CSS-styling

// Komponent der viser brugerens profil
const UserProfile = () => {
  const { signOut, user } = useAuthContext(); // Henter brugeren og en funktion til at logge ud

  return (
    <figure className={styles.userProfile}> {/* Beholder til profilbilledet og navn */}
      <img src={user.picture} alt={user.name} /> {/* Viser brugerens billede */}
      <figcaption>
        <p>{user.name}</p> {/* Viser brugerens navn */}
        <button onClick={() => signOut()}>Log ud</button> {/* Knappen til at logge ud */}
      </figcaption>
    </figure>
  );
};

export default UserProfile;
