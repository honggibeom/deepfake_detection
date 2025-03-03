import styled from "styled-components";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import Detection from "./pages/Detection";
import ImgProtection from "./pages/ImgProtection";
import Home from "./pages/Home";
import { PiDetectiveLight } from "react-icons/pi";
type appType = {
  sidebar: boolean;
};
const AppCss = styled.div<appType>`
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 200px;
    box-sizing: border-box;
    width: 100vw;
    min-height: 60px;
    background-color: #ffffff;
    position: fixed;
    top: 0;
    border-bottom: 1px solid #00000022;
    .logo {
      text-decoration: none;
      color: #090909;
      font-size: 26px;
      display: flex;
      align-items: center;
      .logoIcon {
        margin: 0;
        margin-right: 10px;
        display: flex;
        align-items: center;
      }
    }
    .logo,
    .menuIcon {
      margin: 0;
      cursor: pointer;
    }
    .menuIcon {
      font-size: 35px;
    }
  }
  .reset {
    position: fixed;
    bottom: 0;
    background: #ffffff;
    display: flex;
    padding: 30px 0;
    margin: 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 40px;
    text-align: center;
    font-size: 40px;
    font-weight: 600;
    cursor: pointer;
    .home {
      color: #2e96ff;
    }
  }

  .reset:hover {
    background: #2e96ff;
    .home {
      color: #ffffff;
    }
  }

  .sidebar {
    position: fixed;
    width: 22vw;
    height: 100vh;
    position: fixed;
    background: #ffffff;
    top: 0px;
    right: ${(props) => (props.sidebar ? 0 : -500)}px;
    transition: ${(props) => (props.sidebar ? 0.3 : 0)}s;
    z-index: 3;
    box-sizing: border-box;
    padding: 0 40px;
    .menu {
      display: block;
      text-decoration: none;
      color: #090909;
      font-size: 26px;
      margin: 50px 0;
      font-weight: 600;
      cursor: pointer;
    }
    .menu:hover {
      color: #2e96ff;
    }
    .close {
      font-size: 32px;
      margin: 40px 0 60px 0;
      cursor: pointer;
    }
    .close:hover {
      color: #2e96ff;
    }
  }

  .back {
    position: fixed;
    ${(props) => !props.sidebar && "display: none"};
    width: 100vw;
    height: 100vh;
    background: #00000044;
    z-index: 2;
    top: 0;
  }
`;

function App() {
  const [sidebar, setSidebar] = useState<boolean>(false);
  const menu = [
    { name: "home", url: "/" },
    { name: "detection", url: "/detection" },
    { name: "img proctection", url: "/protection" },
  ];
  return (
    <BrowserRouter>
      <AppCss sidebar={sidebar}>
        <div className="header">
          <Link to={"/"} className="logo">
            <p className="logoIcon">
              <PiDetectiveLight />
            </p>
            Antifake
          </Link>
          <p
            className="menuIcon"
            onClick={() => {
              setSidebar(true);
            }}
          >
            <IoIosMenu />
          </p>
        </div>
        <div>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/detection" component={Detection} />
            <Route path="/protection" component={ImgProtection} />
          </Switch>
        </div>
        <div className="sidebar">
          <p
            className="close"
            onClick={() => {
              setSidebar(false);
            }}
          >
            <FaChevronRight />
          </p>
          {menu.map((e, idx) => {
            return (
              <Link
                to={e.url}
                className="menu"
                key={idx}
                onClick={() => {
                  setSidebar(false);
                }}
              >
                {e.name}
              </Link>
            );
          })}
        </div>
        <div
          className="back"
          onClick={() => {
            setSidebar(false);
          }}
        ></div>
      </AppCss>
    </BrowserRouter>
  );
}

export default App;
