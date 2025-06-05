// import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Page/shared_component/Header";

import Main from "./Page/Home/Home";
import Login from "./Page/Login/UserLogin";
import CreateAccoount from "./Page/SignUp/CreateAccount";

import NotFound from "./Page/shared_component/NotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/createAccount" element={<CreateAccoount />}></Route>
          {/* 일치하는 라우트가 없는 경우 404 처리 */}
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
