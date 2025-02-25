import styles from "./footer.module.css";
import { FaFacebookSquare } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.soMe}>
        <FaFacebookSquare size={50} />
        <RiInstagramFill size={50} />
      </div>
      <div className={styles.text}>
        <h4>Gittes Glamping</h4>
      </div>
    </footer>
  );
};

export default Footer;
