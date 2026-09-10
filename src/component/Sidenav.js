import React, { useState } from 'react';
import { SidebarData } from './SidebarData';
import { NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/sidenav.css';

export default function Sidenav({ role, mini }) { 
  const [openIndex, setOpenIndex] = useState(null);

  const filteredItems = SidebarData.filter(item =>
    item.roles.includes(role?.toUpperCase())
  );

  const toggleSubNav = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section>
      <div className={`sidenav ${mini ? "sidenav-mini" : ""}`}>
        {filteredItems.map((item, index) => (
          <div key={index} className="sidenav-item">
            <NavLink
              to={item.path}
              className="sidenav-link"
              onClick={() => item.subNav && toggleSubNav(index)}
            >
              <span className="sidenav-icon">{item.icon}</span>
              {!mini && <span className="sidenav-title">{item.title}</span>}
            </NavLink>

            {/* 👇 Render sublist if present */}
            {item.subNav && openIndex === index && (
              <div className="sidenav-sublist">
                {item.subNav
                  .filter(subItem => subItem.roles.includes(role?.toUpperCase()))
                  .map((subItem, subIndex) => (
                    <NavLink
                      key={subIndex}
                      to={subItem.path}
                      className="sidenav-sublink"
                    >
                      <span className="sidenav-icon">{subItem.icon}</span>
                      {!mini && <span className="sidenav-title">{subItem.title}</span>}
                    </NavLink>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}



// import React from 'react';
// import { SidebarData } from './SidebarData';
// import { NavLink } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../css/sidenav.css';

// export default function Sidenav({ role, mini }) { 
//   const filteredItems = SidebarData.filter(item =>
//     item.roles.includes(role?.toUpperCase())
//   );

//   return (
//     <section>
//       <div className={`sidenav ${mini ? "sidenav-mini" : ""}`}>
//         {filteredItems.map((item, index) => (
//           <div key={index} className="sidenav-item">
//             <NavLink to={item.path} className="sidenav-link">
//               <span className="sidenav-icon">{item.icon}</span>
//               {!mini && <span className="sidenav-title">{item.title}</span>}
//             </NavLink>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
