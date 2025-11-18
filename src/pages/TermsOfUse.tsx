import { Card, CardContent } from "@/components/ui/card";

const TermsOfUse = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glass-card p-6">
        <CardContent className="space-y-4">
          <h1 className="text-3xl font-bold">Termos de Uso para EDUKIDS+</h1>
          <p className="text-sm text-muted-foreground">Última atualização: 25 de Julho de 2025</p>

          <p>Bem-vindo ao EDUKIDS+! Estes termos e condições descrevem as regras e regulamentos para o uso do aplicativo EDUKIDS+.</p>

          <h2 className="text-xl font-semibold mt-4">1. Aceitação dos Termos</h2>
          <p>Ao acessar e usar nosso Serviço, você concorda em cumprir estes Termos de Uso. Se você não concordar com qualquer parte dos termos, não poderá acessar o Serviço.</p>

          <h2 className="text-xl font-semibold mt-4">2. Contas</h2>
          <p>Ao criar uma conta conosco, você deve nos fornecer informações precisas, completas e atuais. A falha em fazer isso constitui uma violação dos Termos, o que pode resultar na rescisão imediata de sua conta em nosso Serviço.</p>

          <h2 className="text-xl font-semibold mt-4">3. Assinaturas e Compras</h2>
          <p>Algumas partes do Serviço estão disponíveis apenas com uma assinatura paga ("Premium"). Você será cobrado antecipadamente de forma recorrente e periódica ("ciclo de faturamento").</p>

          <h2 className="text-xl font-semibold mt-4">4. Propriedade Intelectual</h2>
          <p>O Serviço e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva de diego Ferreira Da Costa e seus licenciadores.</p>

          <h2 className="text-xl font-semibold mt-4">5. Limitação de Responsabilidade</h2>
          <p>Em nenhuma circunstância o EDUKIDS+, nem seus diretores, funcionários, parceiros, agentes, fornecedores ou afiliados, serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos.</p>

          <h2 className="text-xl font-semibold mt-4">6. Alterações</h2>
          <p>Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento.</p>

          <h2 className="text-xl font-semibold mt-4">7. Contato</h2>
          <p>
            Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em:{" "}
            <a href="mailto:contatojpds@gmail.com" className="underline text-primary">contatojpds@gmail.com</a>
          </p>

          <div className="pt-2 text-xs text-muted-foreground">© EDUKIDS+. Todos os direitos reservados.</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfUse;