import { useState } from "react";
import styled from "styled-components";
import loading from "../asset/loading.svg";
import { BiImageAdd } from "react-icons/bi";
import axios from "axios";
import { Link } from "react-router-dom";
const ImgProtectionCss = styled.div`
  .main {
    overflow: auto;
    background: #f5f5f5;
    min-height: 100vh;
    padding: 20px 20vw;
  }
  .container {
    margin-top: 18vh;
    margin-bottom: 5vh;
    .title {
      text-align: center;
      font-size: 40px;
      font-weight: 600;
    }
    .explain {
      font-size: 18px;
      text-align: center;
    }
  }
  #file {
    display: none;
  }
  #label1 {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 180px 0;
    background: #ffffff;
    border: 1px dashed #000000;
    border-radius: 12px;
    box-sizing: border-box;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    .imgAdd {
      font-size: 50px;
      color: #00000088;
    }
    .inputContainer {
      text-align: center;
    }
    .addText {
      margin-top: 15px;
      font-size: 18px;
    }
  }
  .imgArea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    padding: 50px 50px 10px 50px;
    box-sizing: border-box;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  }
  .imgContainer {
    img {
      width: 24vw;
      height: 24vw;
      object-fit: cover;
      border-radius: 4px;
    }
    .imgState {
      width: 100%;
      text-align: center;
      font-size: 24px;
      background: #ffffff;
      margin-top: 15px;
      font-weight: 700;
      color: #00000099;
    }
  }
  .home {
    width: 100%;
    background: #ffffff;
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    padding: 20px 0;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    margin-top: 50px;
    color: #00000099;
    cursor: pointer;
  }

  .home:hover {
    background: #2e96ff;
    color: #ffffff;
  }
  .link {
    text-decoration: none;
    color: #000000;
  }

  .warn {
    text-align: center;
    font-size: 12px;
    color: #db4455;
  }
`;
function ImgProtection() {
  const [link, setLink] = useState<string>("#");
  const [newImglink, setnewImgLink] = useState<string>("#");
  return (
    <ImgProtectionCss>
      <div className="main">
        <div className="container">
          <p className="title">딥페이크 방지</p>
          <p className="explain">
            이미지에 노이즈를 추가해 딥페이크를 방지합니다
          </p>
          <p className="warn">*10분이상 걸릴수 있음</p>
        </div>
        {link === "#" ? (
          <>
            <input
              type="file"
              id="file"
              accept="image/*"
              onChange={(e) => {
                const file = (e.target.files as FileList)[0];
                if (file.size > 10 * 1024 * 1024) {
                  alert("업로드 가능한 최대 용량은 10MB입니다. ");
                  return;
                }
                const formData = new FormData();
                formData.append("file", file);
                axios
                  .post(process.env.REACT_APP_ORIGIN + "/noise", formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  })
                  .then((res) => {
                    setnewImgLink(res.data);
                    const link = document.createElement("a");
                    link.href = res.data;
                    link.download = "noise.jpg";
                    link.click();
                  });
                setLink(URL.createObjectURL(file));
              }}
            />
            <label htmlFor="file" id="label1">
              <div className="inputContainer">
                <BiImageAdd className="imgAdd" />
                <p className="addText">사진 선택</p>
              </div>
            </label>
          </>
        ) : (
          <>
            <div className="imgArea">
              <div className="imgContainer">
                <img src={link} className="img" />
                <p className="imgState">before</p>
              </div>
              <div className="imgContainer">
                {newImglink === "#" ? (
                  <img src={loading} />
                ) : (
                  <img
                    src={newImglink}
                    className="img"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = newImglink;
                    }}
                  />
                )}
                <p className="imgState">after</p>
              </div>
            </div>
            <p
              className="home"
              onClick={() => {
                window.location.reload();
              }}
            >
              재시도
            </p>
            <Link to="/" className="link">
              <p className="home">홈으로</p>
            </Link>
          </>
        )}
      </div>
    </ImgProtectionCss>
  );
}
export default ImgProtection;
