import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { BiImageAdd } from "react-icons/bi";
import PieChart from "../components/PieChart";
import { IoMdHome } from "react-icons/io";
import loading from "../asset/loading.svg";
const DetectionCss = styled.div`
  width: 100vw;
  .main {
    overflow: auto;
    background: #f5f5f5;
    min-height: 100vh;
    padding: 20px 20vw;
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
    margin: 20vh 0;
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
    margin: 50px 0 100px 0;
    padding: 50px 100px;
    background: #ffffff;
    box-sizing: border-box;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    text-align: center;
    .chart {
      display: flex;
      justify-content: space-between;
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


  #canvas1,
  #canvas2 {
    display: none;
    background: #ffffff;
  }
`;

function Detection() {
  const [link, setLink] = useState<string>("#");
  const [loadingTime, setLoadingTime] = useState<number>(-1);
  const canvas = useRef<HTMLCanvasElement>(null);
  const canvas1 = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  function timeoutTimer(endTime: Date, timeout: number, duration: number) {
    if (link === "#") return;
    const now = Date.now();
    const end = endTime.getTime();
    const timeLeft = end - now;

    if (timeLeft <= 0) {
      setLoadingTime(duration);
      return;
    }
    setTimeout(() => {
      timeoutTimer(endTime, timeout, duration);
    }, timeout);
  }
  useEffect(() => {
    if (link === "#") return;
    doLoad();
  }, [link]);

  function timerCallback(
    videoElement: HTMLVideoElement,
    context: CanvasRenderingContext2D,
    context1: CanvasRenderingContext2D
  ) {
    if (videoElement.paused || videoElement.ended || link === "#") {
      return;
    }
    computeFrame(videoElement, context, context1);
    setTimeout(function () {
      timerCallback(videoElement, context, context1);
    }, 0);
  }

  function doLoad() {
    const videoElement = video.current as HTMLVideoElement;
    const context = (canvas.current as HTMLCanvasElement).getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    const context1 = (canvas1.current as HTMLCanvasElement).getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    videoElement.onplay = () => {
      timeoutTimer(
        new Date(Date.now() + videoElement.duration * 1000),
        1000,
        videoElement.duration
      );
      (canvas.current as HTMLCanvasElement).width = (
        canvas1.current as HTMLCanvasElement
      ).width = videoElement.videoWidth;
      (canvas.current as HTMLCanvasElement).height = (
        canvas1.current as HTMLCanvasElement
      ).height = videoElement.videoHeight;
      timerCallback(videoElement, context, context1);
    };
  }

  function computeFrame(
    videoElement: HTMLVideoElement,
    context: CanvasRenderingContext2D,
    context1: CanvasRenderingContext2D
  ) {
    context.drawImage(
      videoElement,
      0,
      0,
      videoElement.videoWidth,
      videoElement.videoHeight
    );
    let frame = context.getImageData(
      0,
      0,
      videoElement.videoWidth,
      videoElement.videoHeight
    );
    let l = frame.data.length / 4;
    for (let i = 0; i < l; i++) {
      let r = frame.data[i * 4];
      let g = frame.data[i * 4 + 1];
      let b = frame.data[i * 4 + 2];
      //let alpha = frame.data[i * 4 + 3];
      if (r > 100 && g > 100 && b > 100)
        frame.data[i * 4] = frame.data[i * 4 + 1] = frame.data[i * 4 + 2] = 0;
    }
    context1.putImageData(frame, 0, 0);
    return;
  }

  return (
    <DetectionCss>
      <div className="main">
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
                axios
                  .post("http://localhost:5000/identification", formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  })
                  .then((res) => {
                    console.log(res);
                  });
                setLink(URL.createObjectURL(file));
              }}
            />
            <label htmlFor="file" id="label1">
              <div className="inputContainer">
                <BiImageAdd className="imgAdd" />
                <p className="addText">사진 혹은 비디오 추가</p>
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
            ></video>

            <div className="resultContainer">
              {loadingTime > 0 ? (
                <>
                  <div className="chart">
                    <div>
                      <PieChart accuracy={50} />
                    </div>
                    <p className="time">8초 소요됨</p>
                  </div>
                  <p className="result">
                    해당 영상은 50%확률로 딥페이크 입니다.
                  </p>
                </>
              ) : (
                <img src={loading} />
              )}
            </div>
          </>
        )}
        <canvas ref={canvas} id="canvas1"></canvas>
        <canvas ref={canvas1} id="canvas2"></canvas>
      </div>
    </DetectionCss>
  );
}

export default Detection;
