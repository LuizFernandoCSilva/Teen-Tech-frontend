import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import logo from "../../../assets/TeenTechLogo.png"; // Certifique-se de que o caminho está correto

function UploadAulas() {
  const titleRef = useRef();
  const fileRef = useRef();
  const newLessonTitleRef = useRef();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Inicializando com null

  useEffect(() => {
    async function fetchLessons() {
      try {
        const response = await api.get("/aulas", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLessons(response.data);
      } catch (error) {
        console.error(
          "Erro ao buscar aulas:",
          error.response ? error.response.data : error
        );
        setError("Erro ao buscar aulas. Por favor, tente novamente.");
      }
    }

    fetchLessons();
  }, []); // Certifique-se de que o useEffect está sendo chamado apenas uma vez

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null); // Limpa qualquer erro anterior

    // Verifica se um arquivo foi selecionado
    if (!fileRef.current.files[0]) {
      setError("Por favor, selecione um arquivo.");
      return;
    }

    setLoading(true); // Inicia o carregamento
    const formData = new FormData();

    // Define o título da aula e do arquivo
    formData.append("title", titleRef.current.value);
    formData.append("ipynbFile", fileRef.current.files[0]);

    // Verifica se uma aula existente foi selecionada ou uma nova está sendo criada
    if (selectedLesson) {
      formData.append("lessonId", selectedLesson);
    } else if (newLessonTitleRef.current.value) {
      formData.append("newLessonTitle", newLessonTitleRef.current.value);
    } else {
      setError(
        "Por favor, insira um título para a nova aula ou selecione uma existente."
      );
      setLoading(false);
      return;
    }

    try {
      await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Arquivo enviado com sucesso!");
      // Limpa os campos do formulário
      titleRef.current.value = "";
      fileRef.current.value = "";
      newLessonTitleRef.current.value = "";
      setSelectedLesson("");
    } catch (error) {
      console.error(
        "Erro ao fazer upload do arquivo:",
        error.response ? error.response.data : error
      );
      setError(
        "Erro ao enviar o arquivo: " +
          (error.response ? error.response.data.error : error.message)
      );
    } finally {
      setLoading(false); // Encerra o carregamento
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white bg-opacity-90 shadow-xl rounded-lg p-8">
        {/* Logo do Teen Tech */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Teen Tech Logo" className="w-32 h-auto" />
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Upload de Aulas
        </h2>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Mensagem de erro */}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* Título do Arquivo */}
          <div className="relative">
            <input
              ref={titleRef}
              placeholder="Título do Arquivo"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Seleção de Aula ou Criação de Nova */}
          <div className="relative">
            <select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                Selecione uma Aula (ou deixe em branco para criar uma nova)
              </option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </div>

          {/* Título da Nova Aula (opcional) */}
          {selectedLesson === "" && (
            <div className="relative">
              <input
                ref={newLessonTitleRef}
                placeholder="Título da Nova Aula (se aplicável)"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Upload de Arquivo */}
          <div className="relative">
            <input
              ref={fileRef}
              type="file"
              accept=".ipynb"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            className={`w-full py-3 rounded-md transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>

          {/* Link para Ir para as Aulas */}
          <Link
            to="/aulas"
            className="text-blue-600 hover:underline block text-center pt-3"
          >
            Ir para as aulas
          </Link>
        </form>
      </div>
    </div>
  );
}

export default UploadAulas;
