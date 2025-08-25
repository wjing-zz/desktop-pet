import React, { useState, useEffect, useRef} from 'react';
import catIdle from '../assets/frog.gif';
import './pet.css';
import { invoke } from '@tauri-apps/api/core';
import { WebviewWindow } from "@tauri-apps/api/WebviewWindow";
import { REMINDER_INTERVAL_MS, REMINDER_VISIBLE_DURATION_MS } from '../config.ts';
import { load } from '@tauri-apps/plugin-store';

const store = await load('store.json');
await store.set('reminder_setting', { value: 1 * 20 * 1000 });
const stored = await store.get<{ value: number }>('reminder_setting');
const interval_ms = stored?.value ?? REMINDER_INTERVAL_MS;

function Pet() {
  const petRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(catIdle);
  const [isAwake, setIsAwake] = useState(true);

  const [showBubble, setShowBubble] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState('');

  // const notificationSound = useMemo(() => new Audio('/notification.mp3'), []);

  // 拖拽功能 (无需改动)
  useEffect(() => {
    const el = petRef.current;
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        WebviewWindow.getCurrent().startDragging();
      }
    };
    el?.addEventListener("mousedown", handleMouseDown);
    return () => {
      el?.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // --- 更新后的重复提醒功能 ---
  useEffect(() => {
    // 设置一个定时器，每隔一段时间触发提醒
    const intervalId = setInterval(() => {
      setBubbleMessage('该休息眼睛了！');
      setShowBubble(true);
      // notificationSound.play().catch(error => {
      //   console.error("音频播放失败:", error);
      // });
      invoke('play_native_sound', { soundName: 'Basso' });

      // 设置另一个定时器，用于自动隐藏气泡
      setTimeout(() => {
        setShowBubble(false);
      }, REMINDER_VISIBLE_DURATION_MS); // 使用配置的显示时长

    }, interval_ms); // 使用配置的提醒间隔

    // 组件卸载时，必须清除定时器，防止内存泄漏
    return () => {
      clearInterval(intervalId);
    };
  }, []); 

  return (
    <div className="cat-container" ref={petRef}>
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