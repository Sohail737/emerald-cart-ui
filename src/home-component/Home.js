import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Top Genre",
    value: [
      { name: "Fiction", image: "https://images-na.ssl-images-amazon.com/images/I/51T8OXMiB5L._SX356_BO1,204,203,200_.jpg" },
      { name: "Lifestyle", image: "https://rukminim1.flixcart.com/image/416/416/kkec4280/book/4/3/g/the-pursuit-of-happiness-original-imafzra6tnxyrmbq.jpeg?q=70" },
      { name: "Romance", image: "https://rukminim1.flixcart.com/image/416/416/k5y7tzk0/book/6/3/8/snug-original-imafzgrbqze77qze.jpeg?q=70" },
      { name: "Thriller", image: "https://rukminim1.flixcart.com/image/416/416/jvzkb680/book/9/4/8/it-original-imaeuyawhguhx8gz.jpeg?q=70" },
    ],
  },
  {
    name: "Top Authors",
    value: [
      {
        name: "Daniel G. Brinton",
        image: "https://images.gr-assets.com/authors/1386294492p5/200945.jpg",
      },
      {
        name: "Hector Garcia Puigcerver",
        image: "https://tse4.mm.bing.net/th?id=OIP.cy2FbZC9w9aO4ARMYC1_YAHaE9&pid=Api&P=0&w=245&h=165",
      },
      {
        name: "Stephen King",
        image: "https://d2g9wbak88g7ch.cloudfront.net/authorimages/stephen-edwin-king.jpg",
      },
      {
        name: "Vijaya Rao",
        image: "https://d2g9wbak88g7ch.cloudfront.net/authorimages/notavailable.jpg",
      },
    ],
  },
];

export const Home = () => {
  const navigate = useNavigate();
  const navigateToProductList = (param,category) => {
    if(category==="Top Authors"){
      navigate(`/products?author=${param}`);
    }else{
      navigate(`/products?genre=${param}`);
    }
    
  };

  return (
    <div class={styles.home}>
      {categories.map((category) => {
        return (
          <div key={category.name}>
            <h3 className="margin-left">{category.name}</h3>
            <div className={styles.categoryLayout}>
              {category.value.map((item) => {
                return (
                  <div
                    key={item.name}
                    onClick={() => navigateToProductList(item.name,category.name)}
                    className={styles.card + " card"}
                  >
                    <div className="card-img">
                      <img
                        className={
                          category.name === "Top Authors"
                            ? styles.avatar + " avatar large"
                            : ""
                        }
                        src={item.image}
                        alt=""
                      />
                    </div>
                    <div className="card-detail">
                      <div
                        role="heading"
                        className={
                          category.name === "Top Authors"
                            ? styles.avatarName + " card-heading"
                            : "card-heading"
                        }
                      >
                        {item.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <h3 className="margin-left">Explore All books</h3>
      <button className={styles.explore+" btn primary outline"} onClick={() => navigate(`/products`)}>
        Explore
      </button>
    </div>
  );
};
