import styles from "./button.module.css";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { useLocalStorage } from "@uidotdev/usehooks";

const LikeButton = ({ activity, type = "button" }) => {
  const [likedActivities, setLikedActivities] = useLocalStorage(
    "likedActivities",
    []
  );

  const handleLikeClick = () => {
    // Tjek om activity allerede er i likedActivities
    if (!likedActivities.includes(activity)) {
      // Hvis ikke, tilføj id'et til listen over liked activities
      setLikedActivities([...likedActivities, activity]);
    } else {
      // Hvis det allerede er liket, fjern det fra listen
      setLikedActivities(likedActivities.filter((id) => id !== activity));
    }
  };

  // Tjek om aktiviteten allerede er liket
  const isLiked = likedActivities.includes(activity);

  return (
    <button className={styles.likeButton} type={type} onClick={handleLikeClick}>
      {isLiked ? <FcLike size={30} /> : <FcLikePlaceholder size={30} />}
    </button>
  );
};

export default LikeButton;
