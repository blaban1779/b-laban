import React, { useMemo, useState, useEffect } from "react";
import "./product.styles.scss";
import { useParams } from "react-router-dom";
import { selectCategoriesMap } from "../../store/category.selector";
import { useDispatch, useSelector } from "react-redux";
import Markdown from "react-markdown";
import Button from "../../components/button/button.component";
import { addItemToCart, toggleMinicart } from "../../store/minicart.reducer";
import { useIntl } from "react-intl";
import ProductCard from "../../components/product-card/product-card.component";

const ProductDetails = () => {
  const intl = useIntl();
  const params = useParams();
  const { productId, category } = params;
  const categoriesMap = useSelector(selectCategoriesMap);
  const dispatch = useDispatch();
  const product = useMemo(
    () =>
      categoriesMap
        ? categoriesMap[category].find((elem) => elem.id == productId)
        : null,
    [categoriesMap, productId, category]
  );

  const { name, imageUrl, price, des } = product;

  const [text, setText] = useState("");

  useEffect(() => {
    const fetchText = async () => {
      try {
        const locale = intl.locale;
        const path =
          locale == "ar"
            ? `/data/${productId}.txt`
            : `/dataHeb/${productId}.txt`;
        console.log("locale", locale);
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.text();
        setText(data);
      } catch (error) {
        console.error("Error fetching the text file:", error);
      }
    };

    if (productId) {
      fetchText();
    }
  }, [productId, intl]);

  const addProductToCart = () => {
    dispatch(addItemToCart(product));
    dispatch(toggleMinicart(true));
  };

  return (
    <div className="container product-container">
      <ProductCard product={product} />
      <Markdown style={{ width: "100px", overflow: "hidden" }} breaks>
        {text}
      </Markdown>
      <div className="sticky-footer">
        <Button
          label={intl.formatMessage({ id: "add_product" })}
          onClick={addProductToCart}
        />
      </div>
    </div>
  );
};

export default ProductDetails;
