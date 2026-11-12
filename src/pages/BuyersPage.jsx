import React from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import RolePage from "./RolePage";

const BuyersPage = () => (
  <RolePage
    label="For Buyers"
    title="Find Metals For Free — For a Limited Time!"
    intro="Discover products from trusted sellers all in one place. Browse a wide range of categories, compare options!"
    benefits={[
      "Browse products for free",
      "Discover new products and offers",
      "Search across multiple categories",
      "Save time with easy product searches",
    ]}
    closing="Start browsing today and find exactly what you need."
    ctaLabel="Register Now"
    ctaHref="/register"
    Icon={ShoppingCartOutlinedIcon}
    tint="#86A5BB" 
  />
);

export default BuyersPage;
