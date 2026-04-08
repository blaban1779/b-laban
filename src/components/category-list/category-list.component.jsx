import CategoryItem from "../category-item/category-item.component";
import "./categories.styles.scss";
import shisha from "./mainPic/shisha.jpg";
import food from "./mainPic/food.jpg";
import drinks from "./mainPic/drinks.jpg";
import sweets from "./mainPic/sweets.jpg";



const categories = [
  {
    id: 1,
    titleId: "skincare",
    imageUrl: shisha,
    route: "shop/skincare",
  },
  {
    id: 2,
    titleId: "bodycare",
    imageUrl: food,
    route: "shop/body-lotions",
  },
  {
    id: 3,
    titleId: "haircare",
    imageUrl: drinks,
    route: "shop/haircare",
  },
  {
    id: 4,
    titleId: "makeup",
    imageUrl: sweets,
    route: "shop/makeups",
  },


];

const CategoryList = () => {
  return (
    <div className="container">
      <div className="categories-container">
        {categories.map((category) => {
          return <CategoryItem key={category.id} category={category} />;
        })}
      </div>
    </div>
  );
};

export default CategoryList;
