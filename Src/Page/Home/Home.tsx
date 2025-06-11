import { Link } from "react-router-dom";

const Main = () => {
  return (
    <>
      <div>Main Page</div>
      <Link to="/login">로그인</Link>
      <br />
      <Link to="/create-account">회원가입</Link>
    </>
  );
};

export default Main;
