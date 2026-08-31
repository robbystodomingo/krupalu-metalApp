import * as MuiIcon from "@mui/icons-material";
import React from 'react'


export const SidebarData = [
    // {
    //     title: "Vendors",
    //     path: "/",
    //     icon: <MuiIcon.Groups2Rounded/>
    // },
    // {
    //     title: "Items",
    //     path: "/items",
    //     icon: <MuiIcon.StorefrontRounded/>
    // },
    // {
    //     title: "Purchase Order",
    //     path: "/puchaseOrder",
    //     icon: <MuiIcon.ShoppingCartRounded/>
    // },
    // {
    //     title: "Sales",
    //     path: "/items",
    //     icon: <MuiIcon.PointOfSaleRounded/>
    // },
    // {
    //     title: "Bin Locations",
    //     path: "/binLocation",
    //     icon: <MuiIcon.LocationOnRounded/>
    // },
    // {
    //     title: "Contacts",
    //     path: "/contacts",
    //     icon: <MuiIcon.ContactPage/>
    // }

   // SidebarData.js

 
  {
    title: "Users",
    path: "/admin/users",
    icon: "👥",
    roles: ["ADMIN"], // only admin
  },
  {
    title: "Products",
    path: "/seller/products",
    icon: "📦",
    roles: ["SELLER"], // only seller
  },
  {
    title: "Cart",
    path: "/buyer/cart",
    icon: "🛒",
    roles: ["BUYER"], // only buyer
  },
  {
    title: "Campaigns",
    path: "/advertiser/campaigns",
    icon: "📢",
    roles: ["ADVERTISER"], // only advertiser
  },
];


