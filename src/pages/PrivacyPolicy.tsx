import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glass-card p-6">
        <CardContent className="space-y-4">
          <h1 className="text-3xl font-bold">Política de Privacidade para EDUKIDS+</h1>
          <p className="text-sm text-muted-foreground">Última atualização: 25 de Julho de 2025</p>

          <p>
            Bem-vindo ao EDUKIDS+! Esta Política de Privacidade explica como diego Ferreira Da Costa
            (“nós”, “nosso”) coleta, usa e protege as informações em relação ao nosso aplicativo móvel
            EDUKIDS+ (o “Serviço”).
          </p>

          <h2 className="text-xl font-semibold mt-4">1. Informações que Coletamos</h2>
          <p>Coletamos as seguintes informações para fornecer e melhorar nosso Serviço:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Informações de Conta:</strong> Quando você cria uma conta, coletamos seu endereço de e-mail.
              O nome e o avatar do perfil são fornecidos opcionalmente pelo usuário e armazenados localmente no
              dispositivo ou associados à sua conta.
            </li>
            <li>
              <strong>Dados de Progresso:</strong> Salvamos as lições e atividades que você completa para acompanhar
              seu progresso de aprendizado.
            </li>
            <li>
              <strong>Dados de Uso:</strong> Podemos coletar informações sobre como você interage com o aplicativo,
              como as funcionalidades que você usa e o tempo gasto nas atividades, para melhorar a experiência.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-4">2. Como Usamos Suas Informações</h2>
          <p>Usamos as informações que coletamos para:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Fornecer, operar e manter nosso Serviço.</li>
            <li>Personalizar sua experiência de aprendizado.</li>
            <li>Permitir o login seguro e o gerenciamento da sua conta.</li>
            <li>Sincronizar seu progresso entre dispositivos (quando aplicável).</li>
            <li>Comunicar com você, incluindo o envio de informações sobre o serviço e suporte.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-4">3. Serviços de Terceiros</h2>
          <p>Nosso aplicativo utiliza os seguintes serviços de terceiros que podem coletar informações:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Supabase:</strong> Usado para autenticação de usuários e armazenamento de dados de progresso na nuvem.
              Consulte a política de privacidade do Supabase em seu site oficial.
            </li>
            <li>
              <strong>Google AdMob:</strong> Usado para exibir anúncios na versão gratuita do aplicativo.
              O Google pode usar cookies e identificadores de publicidade para exibir anúncios personalizados.
            </li>
            <li>
              <strong>Google Play Billing:</strong> Usado para processar compras no aplicativo, como assinaturas Premium.
              As transações são processadas pelo Google, e não armazenamos suas informações de pagamento.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-4">4. Segurança dos Dados</h2>
          <p>
            A segurança dos seus dados é importante para nós. Usamos medidas de segurança robustas, como as fornecidas
            pelo Supabase (incluindo Row Level Security), para proteger suas informações contra acesso não autorizado.
          </p>

          <h2 className="text-xl font-semibold mt-4">5. Direitos do Usuário</h2>
          <p>
            Você tem o direito de acessar e excluir suas informações pessoais. Na tela de “Configurações” do aplicativo,
            você encontrará uma opção para excluir permanentemente sua conta e todos os dados associados.
          </p>

          <h2 className="text-xl font-semibold mt-4">6. Alterações a Esta Política de Privacidade</h2>
          <p>
            Podemos atualizar nossa Política de Privacidade de tempos em tempos. Notificaremos você sobre quaisquer alterações,
            publicando a nova Política de Privacidade nesta página.
          </p>

          <h2 className="text-xl font-semibold mt-4">7. Contato</h2>
          <p>
            Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco em:{" "}
            <a href="mailto:contatojpds@gmail.com" className="underline text-primary">contatojpds@gmail.com</a>
          </p>

          <div className="pt-2 text-xs text-muted-foreground">© EDUKIDS+. Todos os direitos reservados.</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;