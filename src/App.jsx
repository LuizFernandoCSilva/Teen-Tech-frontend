import { BrowserRouter, Route, Routes } from "react-router-dom"
import Cadastro from "./pages/Cadastro"
import Login from "./pages/Login"
import Alunos from "./pages/Aulas/Alunos"
import Professores from "./pages/Aulas/Professores"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cadastro/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/aulas" element={<Alunos/>}/>
        <Route path="/upload" element={<Professores/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
