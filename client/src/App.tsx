import Chat from "./components/Chat/Chat";
import Home from "./pages/Home";
import Search from "./pages/Search";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/home" element={<Chat />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
