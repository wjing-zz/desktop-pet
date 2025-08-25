// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );


// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { HashRouter, Routes, Route } from 'react-router-dom';
// import App from './App';
// import Settings from './components/Settings'; // 我们即将创建这个组件

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <HashRouter>
//       <Routes>
//         <Route path="/" element={<App />} />
//         <Route path="/settings" element={<Settings />} />
//       </Routes>
//     </HashRouter>
//   </React.StrictMode>
// );

// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Settings from './components/Settings';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

