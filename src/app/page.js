"use client";

import "./script.js";
const Index = () => {
  return (
    <>
      <div className="w-screen h-screen" id="container">
        <canvas className="w-full h-full" id="canvas"></canvas>
      </div>
      <script src="./script.js"></script>
    </>
  );
};

export default Index;
