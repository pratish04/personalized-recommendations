import { Routes, Route, BrowserRouter } from "react-router-dom";

import LoginRegister from "./components/LoginRegister/LoginRegister";
import Home from "./components/Home/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LoginRegister />} />
          <Route exact path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
