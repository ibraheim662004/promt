
import React, { useState, useCallback } from 'react';
import { generatePromptsAndImage } from './services/geminiService';
import { PromptCard } from './components/PromptCard';
import { Spinner } from './components/Spinner';
import { SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPrompts([]);
    setPreviewImageUrl(null);

    try {
      const baseIdea = "إنشاء صورة تحمل أسم 'شباب إعلام الشروق' تعبر عن الصحافة والإعلام والشباب";
      const result = await generatePromptsAndImage(baseIdea);
      setPrompts(result.prompts);
      setPreviewImageUrl(result.imageUrl);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء إنشاء المحتوى. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            مولد برومبت الصور
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            أنشئ برومبتات إبداعية وصورة معاينة لفكرتك بضغطة زر.
          </p>
        </header>

        <main>
          <div className="flex justify-center mb-8">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span className="mr-3">جاري الإنشاء...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-6 h-6 mr-3" />
                  <span>أنشئ البرومبتات والصورة</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          {previewImageUrl && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-200">صورة المعاينة</h2>
              <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                <img 
                  src={previewImageUrl} 
                  alt="AI generated preview" 
                  className="w-full h-auto object-cover" 
                />
              </div>
            </div>
          )}

          {prompts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-4 text-gray-200">البرومبتات المقترحة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {prompts.map((prompt, index) => (
                  <PromptCard key={index} prompt={prompt} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
