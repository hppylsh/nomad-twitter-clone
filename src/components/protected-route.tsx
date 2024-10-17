import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser;
  //login되어있지 않다면 null을 return함 login페이지로 리디렉션
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
}