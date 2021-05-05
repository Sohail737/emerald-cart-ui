import { NavLink } from "react-router-dom";
import styles from "./NavigationAside.module.css";

const components = [
  {
    name: "Home",
    svg: (
      <svg width="1em" height="1em" viewBox="0 0 24 24">
        <path
          d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z"
          fill="currentColor"
        ></path>
      </svg>
    ),
  },
  {
    name: "Products",
    svg: (
      <svg width="1em" height="1em" viewBox="0 0 24 24">
        <path
          d="M5 6h14c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1s.45 1 1 1zm15.16 1.8c-.09-.46-.5-.8-.98-.8H4.82c-.48 0-.89.34-.98.8l-1 5c-.12.62.35 1.2.98 1.2H4v5c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-5h4v5c0 .55.45 1 1 1s1-.45 1-1v-5h.18c.63 0 1.1-.58.98-1.2l-1-5zM12 18H6v-4h6v4z"
          fill="currentColor"
        ></path>
      </svg>
    ),
  },
];

export const NavigationAside = ({ isAsideOpen, setIsAsideOpen }) => {
  return (
    <>
      <div
        onClick={(e) => {
          setIsAsideOpen((isAsideOpen) => !isAsideOpen);
          // e.stopPropagation();
        }}
        className={isAsideOpen ? styles.asideOverlayOpen:styles.asideOverlay}
      ></div>
      <div className={isAsideOpen ? styles.asideOpen : styles.aside}>
        <ul className="stacked-list">
          {components.map((comp) => {
            return (
              <li class="list-item">
                <NavLink
                  to={`/${comp.name.toLowerCase()}`}
                  onClick={()=>setIsAsideOpen(isAsideOpen=>!isAsideOpen)}
                  className={styles.asideNavPills}
                >
                  <div className="list-item-left">{comp.svg}</div>
                  {/* <span>ProductList</span> */}
                  {comp.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
