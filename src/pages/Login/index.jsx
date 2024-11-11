import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode"; 
import { FaEnvelope, FaLock } from "react-icons/fa";
import logo from "../../assets/TeenTechLogo.png";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState(null); // Estado para mensagens de erro

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null); // Limpar mensagem de erro ao submeter

    try {
      const response = await api.post("/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      const token = response.data.token;

      if (!token) {
        setError("Token de autenticação não recebido.");
        return;
      }

      localStorage.setItem("token", token);

      try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        if (userRole === "teacher") {
          navigate("/upload");
        } else if (userRole === "student") {
          navigate("/aulas");
        } else {
          setError("Papel de usuário inválido.");
        }
      } catch {
        setError("Erro ao decodificar o token. Verifique os dados.");
      }
    } catch (error) {
      console.error("Erro ao logar:", error);
      if (error.response) {
        // Erro de resposta do servidor
        const errorMsg =
          error.response.data.message ||
          "Erro ao logar. Verifique suas credenciais.";
        setError(errorMsg);
      } else if (error.request) {
        // Sem resposta do servidor
        setError("Servidor indisponível. Tente novamente mais tarde.");
      } else {
        // Outro tipo de erro
        setError("Erro desconhecido. Tente novamente.");
      }
    }

    emailRef.current.value = "";
    passwordRef.current.value = "";
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-gray-800 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-gradient-to-r from-black to-gray-800 p-8 border border-gray-300 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Teen Tech Logo" className="w-32 h-auto" />
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Login
        </h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}{" "}
        {/* Exibir mensagem de erro */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
              pattern=".{6,}"
              className="w-full px-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
              required
            />
          </div>
          <button className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-700 transition duration-200">
            Entrar
          </button>
        </form>
        <Link
          to="/"
          className="text-blue-400 hover:underline block text-center pt-4"
        >
          Não tem uma conta? Cadastre-se
        </Link>
      </div>
    </div>
  );
}

export default Login;
