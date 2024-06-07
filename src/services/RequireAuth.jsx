import { Navigate, useLocation } from 'react-router-dom';
import { useFetchUserQuery } from '../store';  // Adjust the path as necessary
import Loading from '../pages/public/Loading';

function RequireAuth({ children }) {
  const { data: user, isLoading, isError } = useFetchUserQuery();
  const location = useLocation();

  // Handle loading state
  if (isLoading) {
    return <Loading /> // Consider a more robust loading component here
  }

  // Redirect logic based on authentication status and current path
  if (isError || !user) {
    // If there's an error or no user data, and the user is trying to access a protected route
    if (location.pathname !== '/portal/login' && location.pathname !== '/portal/register' && location.pathname !== '/portal/change-password') {
      return <Navigate to="/portal/login" replace />;
    }
  } else {
    // If the user is authenticated but on the login page, redirect them to the manufacturer page
    if (location.pathname === '/portal/login') {
      return <Navigate to="/manufacturer" replace />;
    }
  }

  // If user exists, no errors, and they're not on the login page unnecessarily, render children
  return children;
}

export default RequireAuth;
