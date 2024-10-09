import { useEffect, useState } from 'react';
import api from '../../../services/api';
import logo from "../../../assets/TeenTechLogo.png";

function ListarAulas() {
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [files, setFiles] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLessons() {
      try {
        setLoadingLessons(true);
        const response = await api.get('/aulas', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setLessons(response.data);
        setLoadingLessons(false);
      } catch (error) {
        console.error('Erro ao buscar aulas:', error);
        setError('Erro ao buscar aulas.');
        setLoadingLessons(false);
      }
    }

    fetchLessons();
  }, []);

  useEffect(() => {
    if (selectedLessonId) {
      async function fetchFiles() {
        try {
          setLoadingFiles(true);
          const response = await api.get(`/aulas/${selectedLessonId}/files`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setFiles(response.data);
          setLoadingFiles(false);
        } catch (error) {
          console.error('Erro ao buscar arquivos da aula:', error);
          setError('Erro ao buscar arquivos da aula.');
          setLoadingFiles(false);
        }
      }

      fetchFiles();
    } else {
      setFiles([]);
    }
  }, [selectedLessonId]);

  const downloadFile = async (file) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/files/${file.id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const fileName = `${file.title}.ipynb`;
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
      setError('Erro ao baixar o arquivo.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-gray-800 flex items-center justify-center">
      <div className="max-w-lg mx-auto bg-white bg-opacity-80 shadow-xl rounded-lg p-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Aulas Disponíveis</h2>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Teen Tech Logo" className="w-32 h-auto" />
        </div>

        {loadingLessons ? (
          <p className="text-center text-gray-500">Carregando aulas...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="mb-6">
            <label htmlFor="lessonSelect" className="block text-lg font-medium text-gray-700 mb-2">
              Selecione uma Aula
            </label>
            <select
              id="lessonSelect"
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 p-3"
            >
              <option value="">Selecione uma Aula</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedLessonId && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Arquivos Disponíveis</h3>
            {loadingFiles ? (
              <p className="text-center text-gray-500">Carregando arquivos...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : files.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {files.map((file) => (
                  <li key={file.id}>
                    <button
                      onClick={() => downloadFile(file)}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      {file.title} (Download)
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhum arquivo disponível para esta aula.</p>
            )}
          </div>
        )}

        {lessons.length === 0 && !loadingLessons && (
          <p className="text-center text-gray-500">Nenhuma aula disponível no momento.</p>
        )}
      </div>
    </div>
  );
}

export default ListarAulas;
