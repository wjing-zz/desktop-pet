import { useState, useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { WebviewWindow } from "@tauri-apps/api/WebviewWindow";
import { emit } from '@tauri-apps/api/event'; // <-- Import emit from here
import './Settings.css';

const storePromise = load('store.json');

function Settings() {
  const [minutes, setMinutes] = useState<number | ''>(1);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const store = await storePromise;
        const savedValue = await store.get<{ value: number }>('reminderIntervalMinutes');
        if (savedValue && typeof savedValue.value === 'number') {
          setMinutes(savedValue.value / 60000); // ms to minutes
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    if (typeof minutes === 'number' && minutes > 0) {
      try {
        const store = await storePromise;
        const newInterval = minutes * 60000; // minutes to ms
        await store.set('reminderIntervalMinutes', { value: newInterval });
        await store.save();

        // Use the global event system to notify all windows
        await emit('settings-changed', { newInterval });

        await WebviewWindow.getCurrent().close();
      } catch (error) {
        console.error("Failed to save settings:", error);
        alert('保存设置失败！');
      }
    } else {
      alert('请输入一个有效的分钟数！');
    }
  };

  return (
    <div className="settings-container">
      <h3>提醒设置</h3>
      <div className="form-group">
        <label>每隔</label>
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value === '' ? '' : Number(e.target.value))}
          min="1"
        />
        <label>分钟，提醒我休息。</label>
      </div>
      <button onClick={handleSave}>保存并关闭</button>
    </div>
  );
}

export default Settings;