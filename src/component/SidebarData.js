import * as MuiIcon from "@mui/icons-material";
import React from 'react'


export const SidebarData = [ 
  {
    title: "Dashboard",
    path: "/admin",
    icon: "🖥️",
    roles: ["ADMIN"], // only admin
  },
  {
    title: "Buyers",
    path: "/admin/buyersList",
    icon: "🛒",
    roles: ["ADMIN"], // only admin
  },
  {
    title: "Sellers",
    path: "/admin/sellersList",
    icon: "🏪",
    roles: ["ADMIN"], // only admin
  },
  {
    title: "Advertisers",
    path: "/admin/advertisersList",
    icon: "📢",
    roles: ["ADMIN"], // only admin
  },
  {
    title: "Sellers",
    path: "/buyer/sellersList",
    icon: "🏪",
    roles: ["BUYER"], // only buyer
  },

  {
    title: "Campaigns",
    path: "/advertiser",
    icon: "📢",
    roles: ["ADVERTISER"], // only advertiser
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
    title: "Dashboard",
    path: "/seller",
    icon: "🏠",
    roles: ["SELLER"], // only seller
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
];


