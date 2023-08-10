import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login';
import ClassMain from './components/ClassMain';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/classMain" element={<ClassMain />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
