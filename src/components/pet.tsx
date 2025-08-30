import React, { useState, useEffect, useRef } from 'react';
import catIdle from '../assets/frog.gif';
import happyFrog from '../assets/happyfrog.gif'; // 导入新图片
import './pet.css';
import { invoke } from '@tauri-apps/api/core';
import { WebviewWindow } from "@tauri-apps/api/WebviewWindow";
import { REMINDER_INTERVAL_MS, REMINDER_VISIBLE_DURATION_MS } from '../config.ts';
import { load } from '@tauri-apps/plugin-store';
import { listen } from '@tauri-apps/api/event';

function Pet() {
  const petRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState(catIdle);
  const [isAwake, setIsAwake] = useState(true);

  const [showBubble, setShowBubble] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState('');

  const [interval_ms, setIntervalMs] = useState(REMINDER_INTERVAL_MS);

  // 加载和监听设置 (不变)
  useEffect(() => {
    const setupInterval = async () => {
      try {
        const store = await load('store.json');
        const stored = await store.get<{ value: number }>('reminderIntervalMinutes');
        if (stored && typeof stored.value === 'number') {
          setIntervalMs(stored.value);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    setupInterval();

    const unlistenSettings = listen('settings-changed', (event) => {
      const payload = event.payload as { newInterval?: number };
      if (payload && typeof payload.newInterval === 'number') {
        setIntervalMs(payload.newInterval);
      }
    });

    // 新增：监听来自菜单的 'next_gif' 事件
    const unlistenNextGif = listen('next_gif', () => {
        setCurrentImage(prevImage => (prevImage === catIdle ? happyFrog : catIdle));
    });

    return () => {
      // 组件卸载时，清理所有监听器
      unlistenSettings.then(unlisten => unlisten());
      unlistenNextGif.then(unlisten => unlisten());
    };
  }, []); 


  // 拖拽功能 (不变)
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

  // 提醒功能 (不变)
  useEffect(() => {
    if (interval_ms <= 0) return;

    const intervalId = setInterval(() => {
      setBubbleMessage('该休息眼睛了！');
      setShowBubble(true);
      invoke('play_native_sound', { soundName: 'Basso' });
      
      setTimeout(() => {
        setShowBubble(false);
      }, REMINDER_VISIBLE_DURATION_MS);

    }, interval_ms);

    return () => {
      clearInterval(intervalId);
    };
  }, [interval_ms]); 

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