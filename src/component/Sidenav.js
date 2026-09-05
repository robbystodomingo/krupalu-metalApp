import React from 'react';
import { SidebarData } from './SidebarData';
import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/sidenav.css';

export default function Sidenav({ role, mini }) { 
  const filteredItems = SidebarData.filter(item =>
    item.roles.includes(role?.toUpperCase())
  );

  return (
    <section>
      <div className={`sidenav ${mini ? "sidenav-mini" : ""}`}>
        {filteredItems.map((item, index) => (
          <div key={index} className="sidenav-item">
            <NavLink to={item.path} className="sidenav-link">
              <span className="sidenav-icon">{item.icon}</span>
              {!mini && <span className="sidenav-title">{item.title}</span>}
            </NavLink>
          </div>
        ))}
      </div>
    </section>
  );
}
