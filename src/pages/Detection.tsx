import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { BiImageAdd } from "react-icons/bi";
import PieChart from "../components/PieChart";
import loading from "../asset/loading.svg";
import { Link } from "react-router-dom";
const DetectionCss = styled.div`
  width: 100vw;
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
  .video {
    width: 100%;
    border-radius: 12px;
    margin: 50px 0;
    box-sizing: border-box;
  }
  .resultContainer {
    width: 100%;
    margin: 50px 0 50px 0;
    padding: 50px 100px;
    background: #ffffff;
    box-sizing: border-box;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    text-align: center;
    .chart {
      display: flex;
      justify-content: center;
      align-items: center;

      .time {
        color: #000000;
        font-size: 20px;
        margin-right: 100px;
      }
    }
    .result {
      color: #000000;
      font-size: 22px;
      margin-top: 50px;
      font-weight: 500;
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
    margin-top: 0;
    color: #00000099;
    cursor: pointer;
  }
  .home:hover {
    background: #2e96ff;
    color: #ffffff;
  }
  .home:hover {
    background: #2e96ff;
    color: #ffffff;
  }
  .link {
    text-decoration: none;
    color: #000000;
  }
`;

function Detection() {
  type resultType = { data: boolean[]; fake: number; real: number };
  const [link, setLink] = useState<string>("#");
  const [loadingTime, setLoadingTime] = useState<number>(-1);
  const [result, setResult] = useState<resultType>({
    data: [],
    real: 0,
    fake: 0,
  });
  const [ratio, setRatio] = useState<number>(0);
  const video = useRef<HTMLVideoElement>(null);
  const [videoFrameState, setVideoFrameState] = useState<boolean>(true);
  return (
    <DetectionCss>
      <div className="main">
        <div className="container">
          <p className="title">딥페이크 영상 탐지</p>
          <p className="explain">
            x-exception 방식을 통해 영상의 딥페이크 여부를 구분합니다.
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
                if (file.size > 10 * 1024 * 1024) {
                  alert("업로드 가능한 최대 용량은 10MB입니다. ");
                  return;
                }
                const formData = new FormData();
                formData.append("file", file);
                const start = new Date().getTime();
                axios
                  .post(
                    process.env.REACT_APP_ORIGIN + "/identification",
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  )
                  .then((res) => {
                    const end = new Date().getTime();
                    console.log(res);
                    setLoadingTime(end - start);
                    setResult({
                      data: res.data.data,
                      fake: res.data.fake,
                      real: res.data.real,
                    });
                    if (res.data.fake + res.data.real > 0) {
                      setRatio(
                        (res.data.fake / (res.data.fake + res.data.real)) * 100
                      );
                    }
                  });
                setLink(URL.createObjectURL(file));
              }}
            />
            <label htmlFor="file" id="label1">
              <div className="inputContainer">
                <BiImageAdd className="imgAdd" />
                <p className="addText">사진 혹은 비디오 선택</p>
              </div>
            </label>
          </>
        ) : (
          <>
            <video
              controls
              width="1000"
              className="video"
              autoPlay
              loop
              ref={video}
              preload={"auto"}
              src={link}
              onTimeUpdate={(e) => {
                if (result.data.length > 0) {
                  const cur = e.target as HTMLVideoElement;
                  const curTime = cur.currentTime;
                  const per = (result.data.length * cur.duration) / curTime;
                  setVideoFrameState(result.data[Math.floor(per)]);
                }
              }}
            ></video>
            <div className="resultContainer">
              {loadingTime > 0 ? (
                <>
                  <div className="chart">
                    <div>
                      <PieChart accuracy={ratio * 100} />
                    </div>
                    {/* <p className="time">{loadingTime}ms 소요됨</p> */}
                  </div>
                  {ratio === 0 && (
                    <p className="result">해당 영상은 딥페이크가 아닙니다.</p>
                  )}
                  {ratio > 0 && (
                    <p className="result">영상의 {ratio}%가 딥페이크 입니다.</p>
                  )}
                </>
              ) : (
                <img src={loading} />
              )}
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
    </DetectionCss>
  );
}

export default Detection;
