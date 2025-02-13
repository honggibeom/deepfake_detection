import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const AppCss = styled.div`
  width: 100vw;
  background: #00000055;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 40px 0;
  canvas {
    display: block;
    width: 60vw;
    height: 60vh;
  }
  .start {
    background: #ffffff;
    width: 10vw;
    text-align: center;
    height: 30px;
    margin: 20px 0;
    cursor: pointer;
  }
`;

function App() {
  const [link, setLink] = useState<string>(
    "https://www.shutterstock.com/shutterstock/videos/3552321153/preview/stock-footage-online-services-visualization-in-a-diverse-modern-office-environment-top-down-view-on-a-futuristic.webm"
  );
  const canvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  async function init() {
    if (canvas.current === null) return;
    const context = canvas.current.getContext("2d") as CanvasRenderingContext2D;
    const res = await axios.get(link, { responseType: "blob" });
    const blob = new Blob([res.data]);
    const reader = new FileReader();
    const w = (video.current as HTMLVideoElement).videoWidth;
    const h = (video.current as HTMLVideoElement).videoHeight;
    const imgArray = new Array(h);
    for (let i = 0; i < h; i++) {
      imgArray[i] = new Array(w);
    }
    reader.onload = () => {
      const data = reader.result as ArrayBuffer;
      if (data == null) return;
      let arr = new Int8Array(data);
      const tmp = JSON.stringify(arr, null, "  ");

      const paper = context.createImageData(h, w);
      for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
          let s = i * h + j;
          imgArray[i][j] = tmp[s];
          paper.data[s * 4] = imgArray[i][j].charCodeAt(0);
          paper.data[s * 4 + 1] = imgArray[i][j].charCodeAt(0);
          paper.data[s * 4 + 2] = imgArray[i][j].charCodeAt(0);
          paper.data[s * 4 + 3] = 255;
        }
      }
      context.putImageData(paper, 0, 0);
    };
    reader.readAsArrayBuffer(blob);
  }

  async function init1() {
    if (canvas.current === null) return;
    const context = canvas.current.getContext("2d") as CanvasRenderingContext2D;
    //const res = await axios.get(link, { responseType: "blob" });
    const w = (video.current as HTMLVideoElement).videoWidth;
    const h = (video.current as HTMLVideoElement).videoHeight;
    context.drawImage(video.current as HTMLVideoElement, 0, 0, w, h);
    const frame = context.getImageData(0, 0, 10, 10);
    let len = frame.data.length / 4;
    for (let i = 0; i < len; i++) {
      let r = frame.data[i * 4];
      let g = frame.data[i * 4 + 1];
      let b = frame.data[i * 4 + 2];
      if (g > 100 && r > 100 && b < 43) frame.data[i * 4 + 3] = 0;
    }
  }

  return (
    <AppCss>
      <video controls width="1000" autoPlay loop ref={video} preload={"auto"}>
        <source src={link} />
      </video>
      <div
        className="start"
        onClick={() => {
          init1();
        }}
      >
        실행
      </div>
      <canvas ref={canvas}></canvas>
    </AppCss>
  );
}

export default App;
