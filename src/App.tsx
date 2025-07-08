import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from "./Context/AuthContext";

import Header from "./Page/shared_component/Header";
import Home from "./Page/Home/Home";
import Login from "./Page/Login/UserLogin";
import CreateAccount from "./Page/SignUp/CreateAccount";
import MovieDetail from './Page/Movie/MovieDetail';
import Search from './Page/Search/Search';
import NotFound from "./Page/shared_component/NotFound";
import Community from './Page/Community/Community';
import MyPage from './Page/MyPage/Mypage';
import ProtectedRoute from './ProtectedRoute';


const AppLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const mainClassName = isHomePage ? 'is-home' : '';

  return (
    <>
      <Header />
      <main className={mainClassName}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/movie/:movieId" element={<MovieDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/community" element={<Community />} />
          <Route 
            path="/mypage" 
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;