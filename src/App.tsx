
import "./App.css";
import Pet from "./components/pet.tsx"; // 导入小猫组件

function App() {

  return (
    <main className="container" data-tauri-drag-region>
      {/* 可以在这里添加您的打字计数器和商城界面 */}
      {/* 渲染小猫组件 */}
      <Pet />
    </main>
  );
}

export default App;

// import { HashRouter, Routes, Route } from 'react-router-dom';
// import Pet from './components/pet';
// import Settings from './components/Settings';

// function App() {
//   return (
//     <HashRouter>
//       <Routes>
//         <Route path="/" element={<main className="container" data-tauri-drag-region><Pet /></main>} />
//         <Route path="/settings" element={<Settings />} />
//       </Routes>
//     </HashRouter>
//   );
// }
// export default App;
