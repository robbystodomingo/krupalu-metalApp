
import React from "react";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import RolePage from "./RolePage";

const AdvertisersPage = () => (
  <RolePage
    label="For Advertisers"
    title="Promote Your Brand For Free — For a Limited Time!"
    intro="Whether you're advertising a business, service, event, or special promotion, our platform gives you access to a growing audience."
    benefits={[
      "Post advertisements for free",
      "Increase brand visibility",
      "Reach new audiences and grow awareness",
      "Promote services, events, and special offers",
    ]}
    closing="Get your message in front of the right audience and grow your business."
    ctaLabel="Register Now"
    ctaHref="/register"
    Icon={CampaignOutlinedIcon}
    tint="#FFBF94"
  />
);

export default AdvertisersPage;
