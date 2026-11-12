import React from "react";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import RolePage from "./RolePage";

const SellersPage = () => (
  <RolePage
    label="For Sellers"
    title="Grow Your Sales for Free — For a Limited Time!"
    intro="Showcase your products to thousands of potential buyers and expand your reach without paying listing fees."
    benefits={[
      "Post unlimited product listings for free",
      "Manage your products easily",
      "Reach more potential customers",
      "Promote your business and increase visibility",
    ]}
    closing="Start selling today and grow your customer base at no cost."
    ctaLabel="Register Now"
    ctaHref="/register"
    Icon={StorefrontOutlinedIcon}
    tint="#FDE0A6"
  />
);

export default SellersPage;
