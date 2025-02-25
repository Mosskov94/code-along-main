import { useAuthContext } from "../../../context/useAuthContext";
import styles from "./userProfile.module.css";

const UserProfile = () => {
  const { signOut, user } = useAuthContext();
  return (
    <figure className={styles.userProfile}>
      <img src={user.picture} alt={user.name} />
      <figcaption>
        <p>{user.name}</p>
        <button onClick={() => signOut()}>Log ud</button>
      </figcaption>
    </figure>
  );
};

export default UserProfile;
