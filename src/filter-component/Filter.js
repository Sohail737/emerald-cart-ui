import { useNavigate } from "react-router-dom";
import styles from "./Filter.module.css";

const sortParamArray = [
  { name: "Default", value: "DEFAULT" },
  { name: "Price : Low To High", value: "LOW_TO_HIGH" },
  { name: "Price : High To Low", value: "HIGH_TO_LOW" },
];

const filters = {
  genre: ["Fiction", "Lifestyle","Thriller","Romance"],
  author: ["Daniel G. Brinton", "Hector Garcia Puigcerver","Stephen King","Vijaya Rao","Catana Chetwynd"],
};

export const Filter = ({
  showAllInventory,
  showFastDeliveryOnly,
  showOffersOnly,
  author,
  genre,
  sortBy,
  showFilter,
  setShowFilter,
}) => {
  // const {
  //   showAllInventory,
  //   showFastDeliveryOnly,
  //   genre,
  //   author,
  //   sortBy,
  //   dispatch,
  // } = useFilter();

  const navigate = useNavigate();
  // let queryString = ``;
  // showAllInventory=showAllInventory===null || showAllInventory===""?true:showAllInventory==="true"?true:false;
  // showFastDeliveryOnly=showFastDeliveryOnly===null || showFastDeliveryOnly===""?false:showFastDeliveryOnly==="true"?true:false;
  console.log("showAllInventory in filter", showAllInventory);
  console.log("showFastDeliveryOnly in filter", showFastDeliveryOnly);

  const filterProductList = (action) => {
    switch (action.type) {
      case "TOGGLE_INVENTORY":
        showAllInventory = !showAllInventory;

        break;
      case "TOGGLE_DELIVERY":
        showFastDeliveryOnly = !showFastDeliveryOnly;
        break;
      case "SHOW_OFFERS_ONLY":
        showOffersOnly = !showOffersOnly;

        break;
      case "AUTHOR":
        author = author.includes(action.payload)
          ? author.filter((a) => a !== action.payload)
          : [...author, action.payload];

        break;
      case "GENRE":
        genre = genre.includes(action.payload)
          ? genre.filter((g) => g !== action.payload)
          : [...genre, action.payload];

        break;
      case "SORT":
        sortBy = action.payload;

        break;
      default:
        return;
    }

    let queryString = `?showOutOfStock=${showAllInventory}&showOffersOnly=${showOffersOnly}&fastDeliveryOnly=${showFastDeliveryOnly}&genre=${genre.join(
      ","
    )}&author=${author.join(",")}&sortBy=${sortBy}`;
    navigate("/products" + encodeURI(queryString));
  };

  return (
    <>
      <div
        onClick={(e) => {
          setShowFilter((showFilter) => !showFilter);
          // e.stopPropagation();
        }}
        className={showFilter ? styles.filterOverlayOpen : styles.filterOverlay}
      ></div>
      <div className={showFilter ? styles.filterOpen : styles.filter}>
        <>
          <h3>Sort</h3>
          <select
            className={styles.select}
            onChange={
              // (e) => dispatch({ type: "SORT", payload: e.target.value })
              (e) =>
                filterProductList({ type: "SORT", payload: e.target.value })
            }
          >
            {sortParamArray.map((param) => {
              return (
                <option selected={param.value === sortBy} value={param.value}>
                  {param.name}
                </option>
              );
            })}
          </select>
          <h3>Filters</h3>
          <h4>General</h4>
          <ul className={styles.filterContainer + " stacked-list"}>
            <li className="list-item">
              <label>
                <input
                  className={styles.filterCheckbox}
                  type="checkbox"
                  checked={showAllInventory}
                  onChange={
                    // () => dispatch({ type: "TOGGLE_INVENTORY" })
                    (e) =>
                      filterProductList({
                        type: "TOGGLE_INVENTORY",
                      })
                  }
                />
                Include Out of Stock
              </label>
            </li>
            <li className="list-item">
              <label>
                <input
                  className={styles.filterCheckbox}
                  type="checkbox"
                  checked={showOffersOnly}
                  onChange={
                    // () => dispatch({ type: "TOGGLE_INVENTORY" })
                    (e) =>
                      filterProductList({
                        type: "SHOW_OFFERS_ONLY",
                      })
                  }
                />
                Show Offers Only
              </label>
            </li>
            <li className="list-item">
              <label>
                <input
                  className={styles.filterCheckbox}
                  type="checkbox"
                  checked={showFastDeliveryOnly}
                  onChange={
                    // () => dispatch({ type: "TOGGLE_DELIVERY" })
                    (e) =>
                      filterProductList({
                        type: "TOGGLE_DELIVERY",
                      })
                  }
                />
                Fast Delivery Only
              </label>
            </li>
          </ul>
          <h4>Genre</h4>
          <ul className={styles.filterContainer + " stacked-list"}>
            {filters.genre.map((item) => {
              return (
                <li className="list-item" key={item}>
                  <label>
                    <input
                      className={styles.filterCheckbox}
                      type="checkbox"
                      checked={genre.length > 0 && genre.includes(item)}
                      onChange={
                        // () =>dispatch({ type: "GENRE", payload: { genre: item } })
                        () =>
                          filterProductList({ type: "GENRE", payload: item })
                      }
                    />
                    {item}
                  </label>
                </li>
              );
            })}
          </ul>
          <h4>Authors</h4>
          <ul className={styles.filterContainer + " stacked-list"}>
            {filters.author.map((item) => {
              return (
                <li className="list-item" key={item}>
                  <label>
                    <input
                      className={styles.filterCheckbox}
                      type="checkbox"
                      checked={author.length > 0 && author.includes(item)}
                      onChange={
                        // () =>dispatch({ type: "AUTHOR", payload: { author: item } })
                        () =>
                          filterProductList({ type: "AUTHOR", payload: item })
                      }
                    />
                    {item}
                  </label>
                </li>
              );
            })}
          </ul>
        </>
      </div>
    </>
  );
};
