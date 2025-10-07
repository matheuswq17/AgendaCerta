import { useState } from 'react';
import { X, Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export default function ImportPatientsModal({ isOpen, onClose, onImportPatients }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus(null);
      setErrorMessage('');
    }
  };
  
  const handleImport = () => {
    if (!file) {
      setUploadStatus('error');
      setErrorMessage('Por favor, selecione um arquivo para importar.');
      return;
    }
    
    setIsUploading(true);
    
    // Simulação de processamento de arquivo
    setTimeout(() => {
      // Simulação de dados importados
      const importedPatients = [
        {
          id: Date.now().toString() + '1',
          name: 'Roberto Almeida',
          email: 'roberto.almeida@email.com',
          phone: '(11) 98765-4321',
          birthdate: '1985-06-15',
          address: 'Rua das Flores, 123',
          notes: 'Paciente importado via CSV',
          createdAt: new Date().toISOString(),
          status: 'active'
        },
        {
          id: Date.now().toString() + '2',
          name: 'Fernanda Costa',
          email: 'fernanda.costa@email.com',
          phone: '(11) 91234-5678',
          birthdate: '1990-03-22',
          address: 'Av. Paulista, 1000',
          notes: 'Paciente importado via CSV',
          createdAt: new Date().toISOString(),
          status: 'active'
        },
        {
          id: Date.now().toString() + '3',
          name: 'Marcelo Santos',
          email: 'marcelo.santos@email.com',
          phone: '(11) 99876-5432',
          birthdate: '1978-11-10',
          address: 'Rua Augusta, 500',
          notes: 'Paciente importado via CSV',
          createdAt: new Date().toISOString(),
          status: 'active'
        }
      ];
      
      setIsUploading(false);
      setUploadStatus('success');
      
      // Enviar pacientes importados para o componente pai
      onImportPatients(importedPatients);
      
      // Fechar o modal após 1.5 segundos
      setTimeout(() => {
        onClose();
        setFile(null);
        setUploadStatus(null);
      }, 1500);
    }, 2000);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-card w-full max-w-md rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b dark:border-dark-border">
          <h2 className="text-xl font-bold dark:text-dark-text">Importar Pacientes</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <p className="text-sm dark:text-dark-text text-light-text mb-4">
              Importe seus pacientes através de um arquivo CSV. O arquivo deve conter as seguintes colunas:
            </p>
            <ul className="list-disc pl-5 text-sm dark:text-dark-text/70 text-light-text/70 mb-4">
              <li>Nome (obrigatório)</li>
              <li>Email</li>
              <li>Telefone (obrigatório)</li>
              <li>Data de Nascimento (formato: AAAA-MM-DD)</li>
              <li>Endereço</li>
              <li>Observações</li>
            </ul>
            <p className="text-sm dark:text-dark-text/70 text-light-text/70">
              <a href="#" className="text-primary hover:underline">Baixar modelo de CSV</a>
            </p>
          </div>
          
          <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
            file ? 'border-primary' : 'dark:border-dark-border border-light-border'
          }`}>
            {!file ? (
              <>
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="dark:text-dark-text text-light-text mb-2">
                  Arraste e solte seu arquivo CSV aqui
                </p>
                <p className="text-sm dark:text-dark-text/70 text-light-text/70 mb-4">
                  ou
                </p>
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="mx-auto"
                  >
                    Selecionar Arquivo
                  </Button>
                </label>
              </>
            ) : (
              <div className="flex items-center">
                <FileText className="w-10 h-10 text-primary mr-4" />
                <div className="text-left">
                  <p className="dark:text-dark-text text-light-text font-medium">
                    {file.name}
                  </p>
                  <p className="text-sm dark:text-dark-text/70 text-light-text/70">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          
          {uploadStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}
          
          {uploadStatus === 'success' && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-start">
              <Check className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">Pacientes importados com sucesso!</p>
            </div>
          )}
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button 
              type="button"
              onClick={handleImport}
              disabled={!file || isUploading || uploadStatus === 'success'}
              className={isUploading ? 'opacity-70 cursor-not-allowed' : ''}
            >
              {isUploading ? 'Importando...' : 'Importar Pacientes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}