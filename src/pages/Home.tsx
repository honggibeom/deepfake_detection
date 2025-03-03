import styled from "styled-components";
import { PiDetectiveLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";
const HomeCss = styled.div`
  width: 100vw;
  min-height: 100vh;
  text-align: center;
  padding-top: 50px;
  box-sizing: border-box;
  .logo {
    font-size: 200px;
    margin: 100px 0 0 0;
    color: #2e96ff;
  }
  .name {
    font-size: 70px;
    font-weight: 700;
    margin-top: 20px;
    color: #2e96ff;
  }
  .descripiton {
    font-size: 24px;
    color: #00000066;
    text-align: center;
  }
  .container {
    display: flex;
    box-sizing: border-box;
    padding: 0 30vw;
    justify-content: space-between;
    align-items: center;
    margin-top: 100px;
    .btn {
      display: flex;
      background: #ffffff;
      min-width: 17vw;
      padding: 20px 0px;
      border-radius: 8px;
      font-size: 25px;
      text-decoration: none;
      color: #00000088;
      align-items: center;
      justify-content: center;
      border: 1px solid #00000033;
    }
    .right {
      display: flex;
      align-items: center;
      margin-left: 10px;
    }
    .btn:hover {
      background-color: #42a1ff;
      color: #ffffff;
    }
  }
`;
function Home() {
  return (
    <HomeCss>
      <p className="logo">
        <PiDetectiveLight />
      </p>
      <p className="name">Antifake</p>
      <p className="descripiton">
        Ai모델을 이용해 deep페이크 탐지 및 방지 솔루션을 제공합니다.
      </p>
      <div className="container">
        <Link to={"/detection"} className="btn">
          딥페이크 탐지
          <span className="right">
            <FaChevronRight />
          </span>
        </Link>
        <Link to={"/protection"} className="btn">
          딥페이크 방지
          <span className="right">
            <FaChevronRight />
          </span>
        </Link>
      </div>
    </HomeCss>
  );
}
export default Home;
