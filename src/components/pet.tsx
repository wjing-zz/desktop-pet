import React, { useState, useEffect } from 'react';
import catIdle from '../assets/frog.gif'; // 导入小猫默认图片
import './pet.css'; // 导入 CSS 文件来控制动画和样式
import { invoke } from '@tauri-apps/api/core';
import { WebviewWindow } from "@tauri-apps/api/WebviewWindow";

function Pet() {
  const [currentImage, setCurrentImage] = useState(catIdle); // 默认图片
  const [isAwake, setIsAwake] = useState(true); // 初始状态为清醒

  // 模拟小猫眨眼或做一些小动作
  useEffect(() => {
    const interval = setInterval(() => {
      // 在这里可以添加更多逻辑来切换图片，比如眨眼
      // 为了简单起见，我们先保持一张图
    }, 5000); // 每隔5秒检查一次
    return () => clearInterval(interval);
  }, []);

  // 处理右键点击事件
  const handleContextMenu = (event: any) => {
    event.preventDefault(); // 阻止浏览器默认的右键菜单
    invoke('show_context_menu'); // 调用后端 show_context_menu 函数
  };

  const [isDragging, setIsDragging] = useState(false);

  // 鼠标按下事件：开始拖拽
  const handleMouseDown = (event:any) => {
    // 确保只有左键点击才能拖拽
    if (event.button === 0) {
      setIsDragging(true);
      console.log("start dragging");
      // 调用Tauri后端API开始拖拽窗口
      WebviewWindow.getCurrent().startDragging();
    }
  };

  // 鼠标松开事件：停止拖拽
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="cat-container"
    // onContextMenu={handleContextMenu} // 添加右键事件监听
     onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      // 其他事件，比如右键菜单
      onContextMenu={(event) => event.preventDefault()}
    >
      <img src={currentImage} alt="小猫" className={`cat ${!isAwake ? 'sleeping' : ''}`} />
    </div>
  );
};

export default Pet;