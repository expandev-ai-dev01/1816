import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Bem-vindo ao GradeBox</h2>
      <p className="text-lg text-gray-600 mb-8">
        Sistema minimalista para registrar e consultar notas de alunos
      </p>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700 mb-6">
          Gerencie as notas dos seus alunos de forma simples e eficiente.
        </p>
        <Link
          to="/grades"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Acessar Gerenciamento de Notas
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
