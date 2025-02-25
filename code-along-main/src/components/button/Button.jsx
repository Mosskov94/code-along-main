import styles from "./button.module.css";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Button = ({
  buttonText,
  background,
  type = "button",
  arrow,
  onClick,
  showDetails,
}) => {
  return (
    <button
      className={
        background === "red"
          ? styles.redButton
          : background === "green"
          ? styles.greenButton
          : styles.orangeButton
      }
      onClick={onClick}
      type={type}>
      <h4>
        {buttonText}
        {arrow &&
          (showDetails ? (
            <IoIosArrowUp color='white' size={30} />
          ) : (
            <IoIosArrowDown color='white' size={30} />
          ))}
      </h4>
    </button>
  );
};

export default Button;
