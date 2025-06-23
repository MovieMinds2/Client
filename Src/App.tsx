//import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from "./Context/AuthContext"; 

import Header from "./Page/shared_component/Header";
import Home from "./Page/Home/Home";
import Login from "./Page/Login/UserLogin";
import CreateAccount from "./Page/SignUp/CreateAccount";
import MovieDetail from './Page/Movie/MovieDetail';
import NotFound from "./Page/shared_component/NotFound";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />

          <Route path="/movie/:movieId" element={<MovieDetail />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;