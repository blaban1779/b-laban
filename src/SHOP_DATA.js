import shisha1 from "./assets/pictures/1.jpg";



import food1 from "./assets/pictures/2.jpg";



import sweets1 from "./assets/pictures/3.jpg";


import drink1 from "./assets/pictures/4.jpg";



export const SHOP_DATA = [
  {
    // skin care
    title: "skincare",
    items: [
      {
        id: 1,
        name: "נרגילה רוסית",
        imageUrl: shisha1,
        price: 70,
        price2: null,
        disprice: 0,
      },
    ],
  },



  {
    title: "makeups",
    items: [
      {
        id: 300,
        name: "קריפ",
        imageUrl: sweets1,
        des: "",
        price: 40,
        price2: null,
        disprice: 0,
      },
    
    ],
  },



  {
    title: "haircare",
    items: [
      {
        id: 1000,
        name: "קוקה קולה",
        imageUrl: drink1,
        price: 15,
        disprice: 0,
      },
    ],
  },




  {
    title: "body-lotions",
    items: [
      {
        id: 800,
        name: "ברגר",
        imageUrl: food1,
        price: 80,
        disprice: 0,
      },
    ],
  },







];
