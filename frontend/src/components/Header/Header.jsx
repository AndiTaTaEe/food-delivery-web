import React from "react";
import "./Header.css";

const Header = () => {

  const scrollToMenu = () => {
    const menuElement = document.getElementById("explore-menu");
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="header">
      <div className="header-contents">
        <h2 data-testid="header-text">Order your favorite food here</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest ingredients and culinary expertise. Our
          mission is to satisfy your cravings and elevate your dining
          experience, one delicious meal at a time.
        </p>
        <button onClick={scrollToMenu} data-testid = "view-menu">View Menu</button>
      </div>
    </div>
  );
};

export default Header;
