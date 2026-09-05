import * as MuiIcon from "@mui/icons-material";
import React from 'react'


export const SidebarData = [ 
  {
    title: "Users",
    path: "/admin/users",
    icon: "👥",
    roles: ["ADMIN"], // only admin
  },
  {
    title: "Dashboard",
    path: "/seller",
    icon: "🏠",
    roles: ["SELLER"], // only seller
  },
  {
    title: "Sellers",
    path: "/buyer/sellersList",
    icon: "🏪",
    roles: ["BUYER"], // only buyer
  },
  {
    title: "Advertisers",
    path: "/buyer/advertisersList",
    icon: "🛒",
    roles: ["BUYER"], // only buyer
  },
  {
    title: "Sellers",
    path: "/advertiser/sellersList",
    icon: "🏪",
    roles: ["ADVERTISER"], // only advertiser
  },
  {
    title: "Buyers",
    path: "/advertiser/buyersList",
    icon: "🛒",
    roles: ["ADVERTISER"], // only advertiser
  },
  {
    title: "Buyers",
    path: "/seller/buyersList",
    icon: "🛒",
    roles: ["SELLER"], // only seller
  },
  {
    title: "Advertisers",
    path: "/seller/advertisersList",
    icon: "📢",
    roles: ["SELLER"], // only seller
  },
  {
    title: "Campaigns",
    path: "/advertiser",
    icon: "📢",
    roles: ["ADVERTISER"], // only advertiser
  },
];


