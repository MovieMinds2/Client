import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const e_logout = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (confirm("로그아웃 하시겠습니까?")) {
      console.log("로그아웃");

      try {
        const result = await axios.post("http://localhost:5000/users/logout", {
          // 쿠키값 전송 여부
          withCredentials: true,
        });

        if (result.status == 200) {
          alert("로그아웃 되었습니다.");
          navigate("/");
        }
      } catch (error) {
        // 타입 가드를 통해서 에러
        if (error instanceof Error) console.log(`error:${error.message}`);
      }
    }
  };
  return (
    <>
      <div>
        Header Page
        <button onClick={e_logout}>로그아웃</button>
      </div>
    </>
  );
};

export default Header;
