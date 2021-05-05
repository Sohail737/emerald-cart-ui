import styles from "./Preloader.module.css"

export const Preloader=()=>{
    return (
        <div>
            <span className={styles.preLoader+" pre-loader"}></span>
        </div>
    )
}