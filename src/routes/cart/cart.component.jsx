import React, { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useIntl } from "react-intl";
import FormInput from "../../components/form-input/form-input.component";
import {
  addItemToCart,
  removeOrDecreaseItem,
} from "../../store/minicart.reducer";
import {
  selectBagTotalPrice,
  selectCartItems,
} from "../../store/minicart.selector";
import "./cart.styles.scss";
import Button from "../../components/button/button.component";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const locations = [
  { label: "locations.nazareth", price: 50 },
  { label: "locations.tiberias", price: 50 },
  { label: "locations.sakhnin", price: 50 },
  { label: "locations.shefa_amr_haifa", price: 50 },
  { label: "locations.tel_aviv_center", price: 100 },
  { label: "locations.south", price: 150 },
  { label: "locations.tira", price: 100 },
  { label: "locations.kiryat_shmona", price: 80 },
];

const CartComponent = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const bagTotalPrice = useSelector(selectBagTotalPrice);
  const [selectedLocation, setSelectedLocation] = useState("");
  const handleAddToCart = (product) => {
    if (product.quantity < 10) {
      dispatch(addItemToCart(product));
    }
  };

  const handleRemoveOrDecrease = (product, directRemove = false) =>
    dispatch(removeOrDecreaseItem({ product, directRemove }));

  const [values, setValues] = useState({ name: "", location: "" });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const intl = useIntl();

  const generatePDF = async () => {
    const { name, location } = values;
    const doc = new jsPDF();

    // Add text
    doc.text(`Name: ${name}`, 10, 10);
    doc.text(`Location: ${location}`, 10, 20);
    doc.text("Items:", 10, 30);

    // Add table headers
    const tableBody = cartItems.map((item) => [
      item.name,
      item.quantity,
      `₪${item.price.toFixed(2)}`,
      { content: "", styles: { cellWidth: 30, cellPadding: 0 } },
    ]);

    doc.autoTable({
      head: [["Product", "Quantity", "Unit Price", "Image"]],
      body: tableBody,
      startY: 40,
      willDrawCell: (data) => {
        if (data.section === "body") {
          data.cell.styles.minCellHeight = 200;
        }
      },
      didDrawCell: (data) => {
        if (data.column.index === 3 && data.cell.section === "body") {
          const itemIndex = data.row.index;
          const img = new Image();
          img.src = cartItems[itemIndex].imageUrl; // Reference the correct item
          img.onload = () => {
            doc.addImage(
              img,
              "JPEG",
              data.cell.x + 2,
              data.cell.y + 2,
              196,
              196
            );
          };
        }
      },
    });

    // Add total price
    doc.text(
      `Total: ₪${totalAll.toFixed(2)}`,
      10,
      doc.autoTable.previous.finalY + 10
    );

    // Save the PDF
    const pdfOutput = doc.output("blob");

    // Create a download link
    const pdfURL = URL.createObjectURL(pdfOutput);
    const link = document.createElement("a");
    link.href = pdfURL;
    link.download = "invoice.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // const sendWhatsAppMessage = async () => {
  //   const pdfURL = await generatePDF();
  //   const { name, location } = values;

  //   let message = `Name: ${name}\nLocation: ${location}\n\nPlease download your invoice: ${pdfURL}`;

  //   const encodedMessage = encodeURIComponent(message);
  //   const phoneNumber = "+972522911779".replace(/\D/g, ""); // Ensure phone number is in the correct format
  //   const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  //   // Open WhatsApp link
  //   window.open(whatsappLink, "_blank");
  // };

  const locationPrice = useMemo(
    () => locations.find((elem) => elem.label === selectedLocation)?.price ?? 0,
    [selectedLocation]
  );

  const sendWhatsAppMessage = () => {
    const { name, location } = values;

    let message = `שם: ${name}\nמיקום: ${selectedLocation}, ${location}\n\nפריטים:\n`;
    message += "------------------------------------------\n";

    cartItems.forEach((item) => {
      message += `מוצר: ${item.name}\n`;
      message += `כמות: ${item.quantity}\n`;
      message += `מחיר: ₪${item.price.toFixed(2)} * ${item.quantity} = ${(
        item.quantity * item.price
      ).toFixed(2)}\n`;
      message += "------------------------------------------\n";
    });

    message += `סך הכל: ₪${bagTotalPrice.toFixed(2)} + ₪${locationPrice.toFixed(
      2
    )} = ₪${totalAll.toFixed(2)}`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "+972532837623".replace(/\D/g, ""); // Ensure phone number is in the correct format
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp link
    window.open(whatsappLink, "_blank");
  };

  const handleChange2 = (event) => {
    setSelectedLocation(event.target.value);
  };

  const totalAll = useMemo(
    () => bagTotalPrice + locationPrice,
    [selectedLocation, bagTotalPrice]
  );

  const onSendItems = () => {
    if (!values.name) {
      toast.error(intl.formatMessage({ id: "please_write_full_name" }), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      return;
    }

    if (!selectedLocation) {
      toast.error(intl.formatMessage({ id: "please_pick_location" }), {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      return;
    }

    toast.success(intl.formatMessage({ id: "sent_successfully" }), {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
    });
    sendWhatsAppMessage();
  };
  return (
    <div
      className={`container cart-container ${
        !cartItems.length && "empty-container"
      }`}
    >
      {cartItems.length > 0 && (
        <>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          {/* <h1>{intl.formatMessage({ id: "cart" })}</h1> */}
          <div className="total">
            {totalAll.toFixed(2)}₪
            <Button
              label={intl.formatMessage({ id: "send" })}
              onClick={onSendItems}
            />
          </div>
        </>
      )}
      {!cartItems.length ? (
        <div>
          <h2>{intl.formatMessage({ id: "cart.empty" })}</h2>
          <Link className="button-container" to={"/shop"}>
            {intl.formatMessage({ id: "cart.go_shopping" })}
          </Link>
        </div>
      ) : (
        <>
          <div className="info-container">
            <div className="location-select-container">
              <select
                className="location-select"
                value={selectedLocation}
                onChange={handleChange2}
              >
                <option value="" disabled>
                  {intl.formatMessage({ id: "select_location" })}
                </option>
                {locations.map((location, index) => (
                  <option key={index} value={location.label}>
                    {intl.formatMessage({ id: location.label })} -{" "}
                    {location.price}₪
                  </option>
                ))}
              </select>
              {/* {selectedLocation && (
                <p className="selected-location">
                  Selected Location: {selectedLocation}
                </p>
              )} */}
            </div>
            <FormInput
              label={intl.formatMessage({ id: "full_name" })}
              type="text"
              name="name"
              onChange={handleChange}
              value={values.name}
              required
            />
            <FormInput
              label={intl.formatMessage({ id: "location" })}
              type="text"
              name="location"
              onChange={handleChange}
              value={values.location}
              required
            />
            <div className="cart-header semibold-barlow-cond">
              <div className="header-block">
                {intl.formatMessage({ id: "product" })}
              </div>
              <div className="header-block"></div>
              <div className="header-block text-center">
                {intl.formatMessage({ id: "quantity" })}
              </div>
              <div className="header-block text-right">
                {intl.formatMessage({ id: "unit_price" })}
              </div>
              <div className="header-block"></div>
            </div>
            {cartItems.map((item) => {
              return (
                <div key={item.id} className="cart-item-container">
                  <div className="image-container">
                    <img src={item.imageUrl} alt="" />
                  </div>
                  <div className="name medium-barlow-cond">{item.name}</div>
                  <div className="quantity">
                    <button
                      type="button"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onClick={() => handleRemoveOrDecrease(item)}
                    >
                      -
                    </button>
                    <span className="value">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div className="price text-right">
                    ₪ {item.price.toFixed(2)}
                  </div>
                  <div className="remove-button text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveOrDecrease(item, true)}
                    >
                      &#10005;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CartComponent;
