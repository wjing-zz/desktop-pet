import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Pet from "./components/pet.tsx"; // 导入小猫组件

function App() {

  return (
    <main className="container">
      {/* 可以在这里添加您的打字计数器和商城界面 */}
      <h1>我的桌面宠物</h1>
      {/* 渲染小猫组件 */}
      <Pet />
    </main>
  );
}

export default App;
