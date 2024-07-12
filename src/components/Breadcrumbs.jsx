import React from 'react';
import { useLocation, Link } from 'react-router-dom';


function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <div className="text-sm breadcrumbs ml-4 md:ml-0">
      <ul>
        {pathnames.map((name, index) => {
          // Skip the first route
          if (index === 0) return null;
          
          // Determine the path to this part of the URL
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          // Check if it's the last item in the pathnames array
          const isLast = index === pathnames.length - 1;
          return (
            <li key={name}>
              {isLast ? (
                name // If it's the last item, display it as text
              ) : (
                <Link to={routeTo}>{name}</Link> // Otherwise, render a link
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Breadcrumbs;
