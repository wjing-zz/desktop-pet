// import { useState, useEffect } from 'react';
// import { load } from '@tauri-apps/plugin-store';
// import { emit } from '@tauri-apps/api/event';
// import { WebviewWindow } from "@tauri-apps/api/WebviewWindow";
// import './settings.css'; // 我们会为它创建一些样式

// const store = await load('store.json');

// function Settings() {
//   // 默认值设为1分钟
//   const [minutes, setMinutes] = useState<number | ''>(1);

//   // 组件加载时，从文件中读取已保存的设置
//   useEffect(() => {
//     const loadSettings = async () => {
//       const savedMinutes = await store.get<number>('reminderIntervalMinutes');
//       if (savedMinutes !== null && savedMinutes !== undefined) {
//         setMinutes(savedMinutes);
//       }
//     };
//     loadSettings();
//   }, []);

//   // 保存设置
//   const handleSave = async () => {
//     if (typeof minutes === 'number' && minutes > 0) {
//       await store.set('reminderIntervalMinutes', minutes*60*1000);
//       await store.save(); // 确保写入磁盘

//       // 发出一个全局事件，通知主窗口设置已变更
//       await emit('settings-changed');

//       // 关闭设置窗口
//       await WebviewWindow.getCurrent().close();
//     } else {
//       alert('请输入一个有效的分数！');
//     }
//   };

//   return (
//     <div className="settings-container">
//       <h3>提醒设置</h3>
//       <div className="form-group">
//         <label>每隔</label>
//         <input
//           type="number"
//           value={minutes}
//           onChange={(e) => setMinutes(e.target.value === '' ? '' : Number(e.target.value))}
//           min="1"
//         />
//         <label>分钟，提醒我喝水。</label>
//       </div>
//       <button onClick={handleSave}>保存并关闭</button>
//     </div>
//   );
// }

// export default Settings;

import React from 'react';

function Settings() {
  return <div><h1>Settings Page</h1></div>;
};

export default Settings;