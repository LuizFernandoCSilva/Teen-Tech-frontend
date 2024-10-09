import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import api from "../../services/api";
import TeenTechLogo from "../../assets/TeenTechLogo.png";
import { FaUser, FaEnvelope, FaLock, FaGraduationCap } from "react-icons/fa";

function Cadastro() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const roleRef = useRef();
  const registrationNumberRef = useRef();
  const [role, setRole] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const data = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      role: roleRef.current.value,
    };

    if (role === "teacher") {
      data.registrationNumber = registrationNumberRef.current.value;
    }

    try {
      await api.post("/register", data);
      alert("Cadastro realizado com sucesso");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar");
    }
    nameRef.current.value = "";
    emailRef.current.value = "";
    passwordRef.current.value = "";
    roleRef.current.value = "";
    if (role === "teacher" && registrationNumberRef.current) {
      registrationNumberRef.current.value = "";
    }
  }

  function handleRoleChange(event) {
    setRole(event.target.value);
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-gray-800 flex items-center justify-center">
      <div className="max-w-md mx-autobg-gradient-to-r from-black to-gray-800 p-8 border border-gray-300 rounded-lg shadow-lg">
      <img src={TeenTechLogo} alt="Logo Teen Tech" className="w-1/2 mx-auto pb-5" />
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Cadastro</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="relative flex items-center">
            <FaUser className="absolute left-3 text-gray-500" />
            <input
              ref={nameRef}
              placeholder="Nome"
              type="text"
              className="w-full px-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
              aria-label="Nome"
              pattern="[A-Za-z\s]+"
              title="O nome deve conter apenas letras."
              required
            />
          </div>
          <div className="relative flex items-center">
            <FaEnvelope className="absolute left-3 text-gray-500" />
            <input
              ref={emailRef}
              placeholder="Email"
              type="email"
              className="w-full px-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
              required
            />
          </div>
          <div className="relative flex items-center">
            <FaLock className="absolute left-3 text-gray-500" />
            <input
              ref={passwordRef}
              placeholder="Senha"
              type="password"
              className="w-full px-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
              pattern=".{6,}"
              title="A senha deve ter no mínimo 6 caracteres."
              required
            />
          </div>

          <select
            ref={roleRef}
            onChange={handleRoleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Selecione seu papel</option>
            <option value="student">Aluno</option>
            <option value="teacher">Professor</option>
          </select>

          {role === "teacher" && (
            <div className="relative flex items-center">
              <FaGraduationCap className="absolute left-3 text-gray-500" />
              <input
                ref={registrationNumberRef}
                placeholder="Número de Matrícula"
                type="text"
                className="w-full px-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                pattern="\d{10}"
                minLength="10"
                maxLength="10"
                title="O número de matrícula deve conter exatamente 10 números."
                required
              />
            </div>
          )}

          <button className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-700 transition duration-200">
            Cadastrar-se
          </button>
        </form>
        <Link to="/login" className="text-blue-400 hover:underline block text-center pt-4">
          Já tem uma conta? Faça seu login
        </Link>
      </div>
    </div>
  );
}

export default Cadastro;