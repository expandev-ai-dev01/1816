import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">404</h2>
      <p className="text-lg text-gray-600 mb-8">Página não encontrada</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Voltar para a página inicial
      </button>
    </div>
  );
};

export default NotFoundPage;
