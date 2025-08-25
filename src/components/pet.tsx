import React, { useState, useEffect, useRef } from 'react';
import catIdle from '../assets/frog.gif';
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

  // 组件加载时从 store 加载设置，并监听设置变化
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

    const unlistenPromise = listen('settings-changed', (event) => {
      const payload = event.payload as { newInterval?: number };
      if (payload && typeof payload.newInterval === 'number') {
        setIntervalMs(payload.newInterval);
      }
    });

    return () => {
      unlistenPromise.then(unlisten => unlisten());
    };
  }, []);


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
    if (interval_ms <= 0) return; // 防止间隔为0或负数

    // 设置一个定时器，每隔一段时间触发提醒
    const intervalId = setInterval(() => {
      setBubbleMessage('该休息眼睛了！');
      setShowBubble(true);
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
  }, [interval_ms]); // 当 interval_ms 变化时，重新设置定时器

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