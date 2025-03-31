import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes
        crafted with the finest ingredients and culinary expertise. Our mission
        is to satisfy your cravings and elevate your dining experience, one
        delicious meal at a time.
      </p>
      <div className="explore-menu-list" >
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() => 
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              } //to do: creeaza functie pentru a evita inline functions
              key={index}
              className="explore-menu-list-item"
              data-testid="menu-categories"
            >
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt={item.menu_name}
                data-testid="menu-image"
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}{" "}
        {/* folosesti mapping pentru a afisa fiecare item din menu_list (vezi assets/assets.js) */}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
