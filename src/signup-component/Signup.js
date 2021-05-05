import { useReducer } from "react";
import styles from "./Signup.module.css";
import { signupUserApi } from "../fakeAuthApi";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router";
import { useToast } from "../context/ToastProvider";

const initialFormFieldsState = {
  name: "",
  email: "",
  password: "",
  cnfPassword: "",
};

const formFieldsReducer = (state, action) => {
  switch (action.type) {
    case "NAME":
      return { ...state, name: action.payload.name };

    case "EMAIL":
      return { ...state, email: action.payload.email };

    case "PASSWORD":
      return { ...state, password: action.payload.password };

    case "CNF_PASSWORD":
      return { ...state, cnfPassword: action.payload.cnfPassword };

    default:
      return state;
  }
};

export const Signup = () => {
  const [
    { name, email, password, cnfPassword },
    dispatchFormFields,
  ] = useReducer(formFieldsReducer, initialFormFieldsState);

  const { dispatchAuth } = useAuth();

  const navigate = useNavigate();

  const { dispatchToast } = useToast();

  const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
  let emailError = "";
  let passwordMissmatchError = "";

  if (email !== "" && !emailRegex.test(email)) {
    emailError = "please enter valid email";
  } else {
    emailError = "";
  }

  if (cnfPassword !== "" && password !== cnfPassword) {
    passwordMissmatchError = "password doesn't match confirmation password";
  } else {
    passwordMissmatchError = "";
  }

  const signupUser = async (enteredName, enteredEmail, enteredPassword) => {
    try {
      const response = await signupUserApi(
        enteredName,
        enteredEmail,
        enteredPassword
      );
      if (response.status === 201) {
        const { name, email, password } = response.data;
        dispatchAuth({
          type: "SET_CREDENTIALS",
          payload: { name, email, password },
        });
        dispatchAuth({ type: "SIGNUP_USER" });
        navigate("/account/login");
        dispatchToast({ type: "TOGGLE_TOAST", payload: true });
        dispatchToast({
          type: "TOAST_TYPE",
          payload: { toastType: "success" },
        });
        dispatchToast({
          type: "TOAST_MESSAGE",
          payload: { toastMessage: "signed up successfully" },
        });
      }
    } catch (err) {
      console.log("error while signup", err);
    }
  };

  const signupUserOnSubmit = (event) => {
    event.preventDefault();
    signupUser(name, email, password);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Signup</h3>
      <form onSubmit={signupUserOnSubmit}>
        <div className={styles.inputContainer}>
          <input
            className={styles.signupInput + " input"}
            placeholder="Name"
            value={name}
            onChange={(e) =>
              dispatchFormFields({
                type: "NAME",
                payload: { name: e.target.value },
              })
            }
            type="text"
          />
        </div>
        <div className={styles.inputContainer}>
          <input
            className={styles.signupInput + " input"}
            placeholder="Email"
            value={email}
            onChange={(e) =>
              dispatchFormFields({
                type: "EMAIL",
                payload: { email: e.target.value },
              })
            }
            type="text"
          />
          {emailError !== "" && <p className={styles.error}>{emailError}</p>}
        </div>
        <div className={styles.inputContainer}>
          <input
            className={styles.signupInput + " input"}
            placeholder="Password"
            value={password}
            onChange={(e) =>
              dispatchFormFields({
                type: "PASSWORD",
                payload: { password: e.target.value },
              })
            }
            type="password"
          />
        </div>

        <div className={styles.inputContainer}>
          <input
            className={styles.signupInput + " input"}
            placeholder="Confirm Password"
            value={cnfPassword}
            onChange={(e) =>
              dispatchFormFields({
                type: "CNF_PASSWORD",
                payload: { cnfPassword: e.target.value },
              })
            }
            type="password"
          />
          {passwordMissmatchError !== "" && (
            <p className={styles.error}>{passwordMissmatchError}</p>
          )}
        </div>

        <button
          disabled={
            email === "" ||
            password === "" ||
            cnfPassword === "" ||
            emailError !== "" ||
            passwordMissmatchError !== ""
          }
          className={styles.signupButton + " btn primary"}
          type="submit"
        >
          Signup
        </button>
      </form>
      <p className={styles.footer}>
        Already signed up?{" "}
        <a className={styles.loginLink} href="/account/login">
          Log in!
        </a>
      </p>
    </div>
  );
};
