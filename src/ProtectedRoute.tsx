import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();

  // 인증 상태를 확인하는 동안 로딩 화면을 보여줍니다.
  if (loading) {
    return <div>인증 상태를 확인하는 중...</div>;
  }
  
  // 확인이 끝났는데도 유저 정보가 없다면 (로그인 안 됨), 로그인 페이지로 보냅니다.
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 확인이 끝났고 유저 정보가 있다면, 원래 가려던 페이지를 보여줍니다.
  return <>{children}</>;
};

export default ProtectedRoute;