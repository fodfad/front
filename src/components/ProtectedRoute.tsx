import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
  allowedRole: string;
}

export default function ProtectedRoute({
  children,
  allowedRole,
}: Props) {
  const role = localStorage.getItem('role');

  if (role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}