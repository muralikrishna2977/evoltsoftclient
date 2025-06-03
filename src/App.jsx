import { HashRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp.jsx";
import SignIn from "./components/SignIn.jsx";
import MainPage from "./components/MainPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mainpage" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;

