import { useNavigate } from "react-router-dom";
import styles from "./AuthModal.module.css";

export const AuthModal = ({ setOpenModal,path }) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => setOpenModal((openModal) => (openModal = false))} className={styles.modalContainer}>
      <div className={styles.authModalContentContainer + " modal"}>
        <h3 className="modal-heading">Want to access premium features?</h3>
        <div className="modal-content">Login to continue</div>

        <div className="modal-footer">
          <button
            onClick={()=>navigate("/account/login",{state:{from:path}})}
            className="btn primary outline"
          >
            Login
          </button>
          <button
             onClick={() => setOpenModal((openModal) => (openModal = false))}
            className="btn primary outline margin-left"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
