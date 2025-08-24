import React, { useState, useEffect, useRef } from 'react';
import catIdle from '../assets/frog.gif';
import './pet.css';
import { invoke } from '@tauri-apps/api/core';
import { WebviewWindow } from "@tauri-apps/api/WebviewWindow";
// 1. 从配置文件导入时间设置
import { REMINDER_INTERVAL_MS, REMINDER_VISIBLE_DURATION_MS } from '../config.ts';

function Pet() {
  const petRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(catIdle);
  const [isAwake, setIsAwake] = useState(true);

  // 状态：控制气泡是否显示
  const [showBubble, setShowBubble] = useState(false);
  // 状态：控制气泡里的文字内容
  const [bubbleMessage, setBubbleMessage] = useState('');

  // --- 修正后的拖拽功能 ---
  useEffect(() => {
    const el = petRef.current;

    const handleMouseDown = (event: MouseEvent) => {
      // 仅当鼠标左键按下时触发拖拽
      if (event.button === 0) {
        WebviewWindow.getCurrent().startDragging();
      }
    };

    // 为宠物容器添加事件监听
    el?.addEventListener("mousedown", handleMouseDown);

    // 组件卸载时，务必移除事件监听
    return () => {
      el?.removeEventListener("mousedown", handleMouseDown);
    };
  }, []); // 空依赖数组确保此 effect 只运行一次

  // --- 新增的提醒功能 ---
  useEffect(() => {
    // 设置一个定时器，在指定延迟后触发提醒
    const mainTimer = setInterval(() => {
      setBubbleMessage('该休息眼睛了！');
      setShowBubble(true);

      // 设置另一个定时器，用于自动隐藏气泡
      const hideTimer = setTimeout(() => {
        setShowBubble(false);
      }, REMINDER_VISIBLE_DURATION_MS); // 使用配置的显示时长

      // 清理函数，以防在气泡显示期间组件被卸载
      return () => clearTimeout(hideTimer);
    }, REMINDER_INTERVAL_MS); // 使用配置的提醒间隔

    // 组件卸载时，清除主定时器
    return () => {
      clearInterval(mainTimer);
    };
  }, []); // 空依赖数组确保此 effect 只运行一次

  return (
    <div className="cat-container" ref={petRef}>
      {/* 条件渲染提示气泡 */}
      {showBubble && (
        <div className="speech-bubble">
          {bubbleMessage}
        </div>
      )}

      <img
        src={currentImage}
        alt="小猫"
        className={`cat ${!isAwake ? 'sleeping' : ''}`}
      />
    </div>
  );
};

export default Pet;