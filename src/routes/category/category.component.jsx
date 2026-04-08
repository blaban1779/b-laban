import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectCategoriesMap,
  selectCategoriesIsLoading,
} from "../../store/category.selector";
import ProductCard from "../../components/product-card/product-card.component";
import SpinnerComponent from "../../components/spinner/spinner.component";

const Category = () => {
  const { category } = useParams();
  const categoriesMap = useSelector(selectCategoriesMap);
  const isLoading = useSelector(selectCategoriesIsLoading);
  const [products, setProducts] = useState(categoriesMap[category]);

  useEffect(() => {
    setProducts(categoriesMap[category]);
  }, [category, categoriesMap]);

  return (
    <>
      {isLoading ? (
        <SpinnerComponent />
      ) : (
        <div className="container page-container">
          {/* <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <h2 className="cat-page-name">{category}</h2>
            <span className="product-count" style={{}}>
              {products && ` ${products.length} products`}
            </span>
          </div> */}
          <div className="shop-container">
            {products &&
              products.map((product) => {
                return <ProductCard key={product.id} product={product} />;
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default Category;
