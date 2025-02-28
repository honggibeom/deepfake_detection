import { useState } from "react";
import styled from "styled-components";
import loading from "../asset/loading.svg";
const ImgProtectionCss = styled.div``;
function ImgProtection() {
  const [link, setLink] = useState<string>("#");
  const [newImglink, setnewImgLink] = useState<string>("#");
  return (
    <ImgProtectionCss>
      <div>
        {link === "#" ? (
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
