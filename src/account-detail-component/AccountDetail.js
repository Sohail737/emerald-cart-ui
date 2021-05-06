import styles from "./AccountDetail.module.css";
import {useAuth} from "../context/AuthProvider"
import { useEffect } from "react";

export const AccountDetail = () => {
    const {name,email,logoutUser}=useAuth()
    
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Account Detail</h3>
      <div>
        <p>Name : {name}</p>
        <p>Email : {email}</p>
      </div>
      <button onClick={logoutUser} className= "btn primary" type="submit">
        Logout
      </button>
    </div>
  );
};
