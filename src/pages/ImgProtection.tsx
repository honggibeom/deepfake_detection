import { useState } from "react";
import styled from "styled-components";
import loading from "../asset/loading.svg";
import { BiImageAdd } from "react-icons/bi";
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
        </div>
        {link === "#" ? (
          <>
            <input
              type="file"
              id="file"
              accept="image/*,video/*"
              onChange={(e) => {
                const file = (e.target.files as FileList)[0];
                const formData = new FormData();
                formData.append("file", file);
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
          <div className="imgArea">
            <div className="imgContainer">
              <img src={link} className="img" />
              <p className="text">before</p>
            </div>
            <div className="imgContainer">
              {newImglink === "#" ? (
                <img src={loading} />
              ) : (
                <img src={newImglink} className="img" />
              )}
              <p className="text">after</p>
            </div>
          </div>
        )}
      </div>
    </ImgProtectionCss>
  );
}
export default ImgProtection;
