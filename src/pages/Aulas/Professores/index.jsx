// src/pages/Aulas/Alunos/UploadAulas.jsx
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import logo from "../../../assets/TeenTechLogo.png"; // Certifique-se de que o caminho está correto

function UploadAulas() {
  const titleRef = useRef();
  const fileRef = useRef();
  const newLessonTitleRef = useRef();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState('');

  useEffect(() => {
    async function fetchLessons() {
      try {
        const response = await api.get('/aulas', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setLessons(response.data);
      } catch (error) {
        console.error('Erro ao buscar aulas:', error.response ? error.response.data : error);
        alert('Erro ao buscar aulas.');
      }
    }

    fetchLessons();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
  
    // Verifica se um arquivo foi selecionado
    if (!fileRef.current.files[0]) {
      alert('Por favor, selecione um arquivo.');
      return;
    }
  
    const formData = new FormData();
  
    // Verifica se uma aula foi selecionada ou se uma nova aula será criada
    if (selectedLesson) {
      // Caso uma aula existente tenha sido selecionada
      formData.append('lessonId', selectedLesson);
    } else {
      // Caso uma nova aula esteja sendo criada (sem selecionar uma aula existente)
      if (!newLessonTitleRef.current.value) {
        alert('Por favor, insira um título para a nova aula.');
        return;
      }
      formData.append('newLessonTitle', newLessonTitleRef.current.value);
    }
  
    // Título do arquivo (pode ser para uma nova ou existente aula)
    formData.append('title', titleRef.current.value);
    formData.append('ipynbFile', fileRef.current.files[0]);
  
    try {
      await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Arquivo enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error.response ? error.response.data : error);
      alert('Erro ao enviar o arquivo: ' + (error.response ? error.response.data.error : error.message));
    }
  
    // Limpa os campos do formulário
    titleRef.current.value = '';
    fileRef.current.value = '';
    newLessonTitleRef.current.value = '';
    setSelectedLesson('');
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white bg-opacity-90 shadow-xl rounded-lg p-8">
        {/* Logo do Teen Tech */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Teen Tech Logo" className="w-32 h-auto" />
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Upload de Aulas</h2>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
              <option value="" style={{ fontSize: '10px' }} >Selecione uma Aula (ou deixe em branco para criar uma nova)</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </div>

          {/* Título da Nova Aula (opcional) */}
          {selectedLesson === '' && (
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
          <button className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition duration-200">
            Enviar
          </button>

          {/* Link para Ir para as Aulas */}
          <Link to="/aulas" className="text-blue-600 hover:underline block text-center pt-3">
            Ir para as aulas
          </Link>
        </form>
      </div>
    </div>
  );
}

export default UploadAulas;
