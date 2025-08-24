import React, { useState, useEffect, useRef } from 'react';
import catIdle from '../assets/frog.gif'; // 导入小猫默认图片
import './pet.css'; // 导入 CSS 文件来控制动画和样式
import { invoke } from '@tauri-apps/api/core';
import { WebviewWindow } from "@tauri-apps/api/WebviewWindow";

function Pet() {
  const petRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(catIdle); // 默认图片
  const [isAwake, setIsAwake] = useState(true); // 初始状态为清醒

  // // 模拟小猫眨眼或做一些小动作
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // 在这里可以添加更多逻辑来切换图片，比如眨眼
  //     // 为了简单起见，我们先保持一张图
  //   }, 5000); // 每隔5秒检查一次
  //   return () => clearInterval(interval);
  // }, []);

  // // 处理右键点击事件
  // const handleContextMenu = (event: any) => {
  //   event.preventDefault(); // 阻止浏览器默认的右键菜单
  //   invoke('show_context_menu'); // 调用后端 show_context_menu 函数
  // };

  // const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseDown = async (event: MouseEvent) => {
      if (event.button === 0) {
        await WebviewWindow.getCurrent().startDragging();
      }

      const el = petRef.current;

      if(el) {
        el.addEventListener("mousedown", handleMouseDown);
      }

      return () => {
        if (el) {
          el.removeEventListener("mousedown", handleMouseDown);
        }
      };
    };
  }, []);

  return (
    <div className="cat-container" ref={petRef}>
      <img src={currentImage} alt="小猫" className={`cat ${!isAwake ? 'sleeping' : ''}`}/>
    </div>
  );
};

export default Pet;