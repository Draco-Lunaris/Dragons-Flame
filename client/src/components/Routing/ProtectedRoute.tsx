import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { State } from '../../store/reducers';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useSelector((state: State) => state.auth);

  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to="/settings/app" replace />;
  }
};
