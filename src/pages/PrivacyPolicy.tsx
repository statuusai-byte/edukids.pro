import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  const [markdown, setMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/PRIVACY_POLICY.md')
      .then(response => response.text())
      .then(text => {
        setMarkdown(text);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load privacy policy:", err);
        setMarkdown("Não foi possível carregar a política de privacidade. Tente novamente mais tarde.");
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link to="/settings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Configurações
            </Link>
          </Button>
        </div>
        
        <article className="prose prose-invert prose-lg max-w-none prose-headings:text-primary prose-a:text-cyan-400 hover:prose-a:text-cyan-300">
          {isLoading ? <p>Carregando...</p> : <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>}
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;