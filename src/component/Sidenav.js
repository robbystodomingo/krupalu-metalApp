import React from 'react'
import { SidebarData } from './SidebarData';
import { NavLink } from "react-router-dom";


import 'bootstrap/dist/css/bootstrap.min.css'




export default function Sidenav({ role }){ 



  // ✅ Filter items based on role
  const filteredItems = SidebarData.filter(item =>
    item.roles.includes(role?.toUpperCase())
  );


  return (
    <React.Fragment>
      <section>
      <div className="sidenav">
        {filteredItems.map((item, index) => (
          <div key={index}>
            <NavLink to={item.path}>
              <span>{item.icon}</span>
              <span>{item.title}</span>
            </NavLink>
          </div>
        ))}
      </div>
    </section>
  </React.Fragment>

     )
}
