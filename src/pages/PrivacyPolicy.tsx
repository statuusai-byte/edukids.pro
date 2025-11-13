import { Link } from "react-router-dom";

const sections = [
  {
    title: "1. Informações que Coletamos",
    content: (
      <>
        <p>Coletamos dados apenas para oferecer a melhor experiência possível durante o aprendizado:</p>
        <ul className="ml-6 list-disc space-y-2 text-base text-slate-200/90">
          <li>
            <strong className="text-amber-300 font-semibold">Informações de Conta:</strong> endereço de e-mail fornecido no cadastro.
            Nome e avatar são opcionais e podem ser armazenados localmente ou associados ao perfil.
          </li>
          <li>
            <strong className="text-amber-300 font-semibold">Dados de Progresso:</strong> lições concluídas e atividades realizadas para acompanhar a evolução dos estudos.
          </li>
          <li>
            <strong className="text-amber-300 font-semibold">Dados de Uso:</strong> interações dentro do app (como tempo de uso e recursos acessados) para aprimorar funcionalidades.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "2. Como Usamos Suas Informações",
    content: (
      <>
        <p>Utilizamos essas informações para:</p>
        <ul className="ml-6 list-disc space-y-2 text-base text-slate-200/90">
          <li>Prover, operar e manter o serviço com segurança.</li>
          <li>Personalizar a experiência de aprendizado por faixa etária.</li>
          <li>Gerenciar o login e sincronizar o progresso entre dispositivos.</li>
          <li>Entrar em contato quando necessário para suporte ou avisos importantes.</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Serviços de Terceiros",
    content: (
      <>
        <p>Alguns recursos integram serviços externos que também podem processar dados:</p>
        <ul className="ml-6 list-disc space-y-2 text-base text-slate-200/90">
          <li>
            <strong className="text-amber-300 font-semibold">Supabase:</strong> autenticação e armazenamento seguro de dados (com Row Level Security).
          </li>
          <li>
            <strong className="text-amber-300 font-semibold">Google AdMob:</strong> exibição de anúncios na versão gratuita — usa cookies/identificadores para anúncios personalizados.
          </li>
          <li>
            <strong className="text-amber-300 font-semibold">Google Play Billing:</strong> processamento das compras no aplicativo; não armazenamos informações de pagamento localmente.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Segurança dos Dados",
    content: (
      <p>
        Adotamos medidas técnicas e organizacionais robustas — incluindo as proteções nativas do Supabase (RLS) — para impedir
        o acesso não autorizado às informações dos exploradores.
      </p>
    ),
  },
  {
    title: "5. Direitos do Usuário",
    content: (
      <p>
        O responsável pode acessar e excluir todos os dados da conta diretamente no aplicativo, através do menu
        <strong className="text-amber-300 font-semibold"> Configurações</strong>, onde há a opção de remoção definitiva.
      </p>
    ),
  },
  {
    title: "6. Alterações nesta Política",
    content: (
      <p>
        Podemos atualizar esta política ocasionalmente. Quando isso ocorrer, publicaremos a nova versão nesta página para que você
        esteja sempre informado.
      </p>
    ),
  },
  {
    title: "7. Contato",
    content: (
      <p>
        Em caso de dúvidas, fale com a nossa equipe:&nbsp;
        <a
          href="mailto:contatojpds@gmail.com"
          className="text-sky-300 underline decoration-dotted underline-offset-4 transition hover:text-sky-200"
        >
          contatojpds@gmail.com
        </a>
      </p>
    ),
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05031a] text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(124,58,237,0.28),transparent_55%)] opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(14,165,233,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[length:32px_32px] opacity-20" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-10 md:px-10 lg:px-12">
        <header className="flex justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-400/30 bg-slate-200/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-indigo-400/60 hover:bg-indigo-500/10"
          >
            ← Voltar ao EDUKIDS+
          </Link>
        </header>

        <main className="mt-6 flex-1">
          <article className="relative overflow-hidden rounded-3xl border border-slate-400/20 bg-slate-900/70 p-6 backdrop-blur-2xl md:p-10">
            <div className="pointer-events-none absolute inset-x-10 -top-32 h-64 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.35),transparent_65%)] blur-[80px]" />
            <div className="pointer-events-none absolute inset-x-20 bottom-[-30%] h-72 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.25),transparent_60%)] blur-3xl" />

            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-3 rounded-full bg-indigo-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
                Proteção de Dados
              </span>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                Política de Privacidade do EDUKIDS+
              </h1>
              <p className="max-w-3xl text-lg text-slate-200/90">
                A seguir explicamos, de forma clara, como coletamos, usamos e protegemos as informações dos exploradores que utilizam o nosso app educativo.
              </p>
              <p className="text-sm text-slate-400">
                <strong className="text-slate-200 font-semibold">Última atualização:</strong> 25 de julho de 2025
              </p>
            </div>

            <div className="relative z-10 mt-10 space-y-10 text-base leading-relaxed text-slate-200/95">
              {sections.map((section) => (
                <section key={section.title} className="space-y-4">
                  <h2 className="text-2xl font-semibold text-indigo-100">{section.title}</h2>
                  {section.content}
                </section>
              ))}
            </div>

            <footer className="relative z-10 mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-400/20 pt-6 text-sm text-slate-400">
              <span>© EDUKIDS+. Todos os direitos reservados.</span>
              <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-200">
                Aprender brincando
              </span>
            </footer>
          </article>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;