import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/Button';
import { BRAND_NAME, BRAND_TAGLINE } from '../lib/brand';
import {
  Sun,
  Moon,
  Settings,
  CheckSquare,
  Bell,
  MessageCircle,
  ShieldCheck,
  CreditCard,
  Database,
  CalendarRange,
  CalendarClock,
  FileDown,
  Users,
  X,
} from 'lucide-react';

export default function Landing() {
  const { theme, toggleTheme } = useTheme();
  const [sessionsPerWeek, setSessionsPerWeek] = useState<number>(12);
  const [noShowPercent, setNoShowPercent] = useState<number>(25);
  const [annual, setAnnual] = useState<boolean>(false);
  const [isDemoOpen, setIsDemoOpen] = useState<boolean>(false);
  const [showMobileCTA, setShowMobileCTA] = useState<boolean>(false);

  // ROI: weeks_per_month = 4.3; reduction_rate = 0.5 (50% das faltas evitadas)
  const recoveredPerMonth = useMemo(() => {
    const weeks_per_month = 4.3;
    const reduction_rate = 0.5;
    return Math.round(sessionsPerWeek * (noShowPercent / 100) * weeks_per_month * reduction_rate);
  }, [sessionsPerWeek, noShowPercent]);

  const trackEvent = (name: string, payload?: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w: any = typeof window !== 'undefined' ? window : {};
    if (w.dataLayer) {
      w.dataLayer.push({ event: name, payload });
    } else {
      // eslint-disable-next-line no-console
      console.log('[event]', name, payload || {});
    }
  };

  useEffect(() => {
    trackEvent('page_view', { page: 'landing' });
  }, []);

  // Dispara evento de ROI calculado quando valores mudarem
  useEffect(() => {
    trackEvent('roi_calculated', { sessions_week: sessionsPerWeek, no_show_pct: noShowPercent, recovered_month: recoveredPerMonth });
  }, [sessionsPerWeek, noShowPercent, recoveredPerMonth]);

  // CTA fixo no mobile após 300px; oculta quando modal aberto
  useEffect(() => {
    const onScroll = () => setShowMobileCTA(window.scrollY >= 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const priceStartMonthly = 29;
  const priceProMonthly = 59;
  const priceStartYear = 290; // anual com 2 meses grátis
  const priceProYear = 590;   // anual com 2 meses grátis

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text font-sans">
      <Head>
        <link rel="canonical" href={`${SITE_URL}/`} />
        <link rel="icon" href="/favicon.svg" />
        <title>{`${BRAND_NAME} — Reduza faltas com WhatsApp + Agenda (LGPD)`}</title>
        <meta name="description" content={BRAND_TAGLINE} />
        <meta property="og:title" content={`${BRAND_NAME} — Reduza faltas com WhatsApp + Agenda (LGPD)`} />
        <meta property="og:site_name" content={BRAND_NAME} />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:description" content="Reduza faltas com WhatsApp + Agenda (LGPD)" />
        <meta property="og:image" content="/og-agendacerta.svg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${BRAND_NAME} — Reduza faltas com WhatsApp + Agenda (LGPD)`} />
        <meta name="twitter:description" content={BRAND_TAGLINE} />
        <meta name="twitter:image" content="/og-agendacerta.svg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: BRAND_NAME,
            brand: BRAND_NAME,
            offers: [
              { '@type': 'Offer', priceCurrency: 'BRL', price: priceStartMonthly, name: 'Start (mensal)' },
              { '@type': 'Offer', priceCurrency: 'BRL', price: priceStartYear, name: 'Start (anual)' },
              { '@type': 'Offer', priceCurrency: 'BRL', price: priceProMonthly, name: 'Pro (mensal)' },
              { '@type': 'Offer', priceCurrency: 'BRL', price: priceProYear, name: 'Pro (anual)' },
            ],
          }),
        }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'Guardam conteúdo clínico?', acceptedAnswer: { '@type': 'Answer', text: 'Não. Só agenda e contato.' } },
              { '@type': 'Question', name: 'É WhatsApp oficial?', acceptedAnswer: { '@type': 'Answer', text: 'Sim, via API oficial.' } },
              { '@type': 'Question', name: 'Posso cancelar quando?', acceptedAnswer: { '@type': 'Answer', text: 'A qualquer momento.' } },
              { '@type': 'Question', name: 'Integra com meu calendário?', acceptedAnswer: { '@type': 'Answer', text: 'Export .ics no MVP; Google Calendar na v1.1.' } },
              { '@type': 'Question', name: 'Quais pagamentos?', acceptedAnswer: { '@type': 'Answer', text: 'Pix e cartão via Mercado Pago.' } },
            ],
          }),
        }} />
      </Head>

      {/* Navbar sticky */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-light-bg/85 dark:bg-dark-bg/85 border-b border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="text-h2 font-semibold">{BRAND_NAME}</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-body">
            <a href="#como-funciona" className="hover:text-primary">Como funciona</a>
            <a href="#recursos" className="hover:text-primary">Recursos</a>
            <a href="#precos" className="hover:text-primary">Preços</a>
            <a href="#faq" className="hover:text-primary">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <button aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'} onClick={toggleTheme} className="p-2 rounded-md border border-light-border dark:border-dark-border hover:bg-light-card dark:hover:bg-dark-card">
              {theme === 'dark' ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
            </button>
            <Link href="/login" className="hidden sm:inline text-body px-3 py-2 rounded-md border border-light-border dark:border-dark-border hover:bg-light-card dark:hover:bg-dark-card">Login</Link>
            <Button href="/signup" variant="primary" size="md">Começar grátis</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-h1 font-bold">Menos furos. Mais sessões confirmadas.</h1>
            <p className="mt-4 text-body text-light-text/80 dark:text-dark-text/80">Confirmações e lembretes automáticos pelo WhatsApp. Agenda simples, LGPD por padrão. Pronto em 5 minutos.</p>
            <div className="mt-8 flex gap-4">
              <Button href="/signup" onClick={() => trackEvent('hero_cta_click', { source: 'hero' })} variant="primary" size="lg">Começar grátis (7 dias)</Button>
              <Button onClick={() => { setIsDemoOpen(true); trackEvent('demo_open', { source: 'hero' }); }} variant="secondary" size="lg">Ver demo (60 s)</Button>
            </div>
            {/* Trust bar */}
            <div className="mt-10 flex flex-wrap gap-3 text-small">
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-light-border dark:border-dark-border"><MessageCircle className="h-4 w-4 text-primary" aria-hidden="true"/> API WhatsApp</span>
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-light-border dark:border-dark-border"><CreditCard className="h-4 w-4 text-primary" aria-hidden="true"/> Mercado Pago</span>
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-light-border dark:border-dark-border"><Database className="h-4 w-4 text-primary" aria-hidden="true"/> Sem dados clínicos</span>
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-light-border dark:border-dark-border"><ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true"/> LGPD by design</span>
            </div>
          </div>
          {/* Hero image: print real do dashboard */}
          <div className="relative">
            <div className="rounded-DEFAULT shadow-md border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card p-4">
              <img src="/og-agendacerta.svg" alt={`Dashboard ${BRAND_NAME}`} className="rounded-DEFAULT w-full h-auto" loading="lazy" />
            </div>
          </div>
        </div>
        {/* CTA fixo mobile (após 300px; oculto quando modal aberto) */}
        {showMobileCTA && !isDemoOpen && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-light-bg/90 dark:bg-dark-bg/90 border-t border-light-border dark:border-dark-border p-3 sm:hidden">
            <Button href="/signup" className="w-full" size="lg">Começar grátis (7 dias)</Button>
          </div>
        )}
      </section>

      {/* Modal de demo com fallback para /demo */}
      {isDemoOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-DEFAULT w-11/12 max-w-3xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-h3 font-semibold">Demo (60 s)</h2>
              <button aria-label="Fechar" onClick={() => setIsDemoOpen(false)} className="p-2 rounded hover:bg-light-bg dark:hover:bg-dark-bg">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video w-full rounded-DEFAULT overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title={`Demo ${BRAND_NAME}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-small mt-3">Se o vídeo não carregar, <Link href="/demo" className="text-primary underline">acesse a página de demo</Link>.</p>
          </div>
        </div>
      )}

      {/* Como funciona (3 passos) */}
      <section id="como-funciona" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-DEFAULT shadow-sm border border-light-border dark:border-dark-border p-6 bg-light-card dark:bg-dark-card">
              <Settings className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
              <h3 className="text-h3 font-semibold">1. Configure</h3>
              <p className="text-body mt-2">Defina sua disponibilidade e importe pacientes (CSV simples).</p>
            </div>
            <div className="rounded-DEFAULT shadow-sm border border-light-border dark:border-dark-border p-6 bg-light-card dark:bg-dark-card">
              <CheckSquare className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
              <h3 className="text-h3 font-semibold">2. Confirme</h3>
              <p className="text-body mt-2">Enviamos [Confirmar] [Remarcar] [Pausar] no WhatsApp; o paciente escolhe o horário.</p>
            </div>
            <div className="rounded-DEFAULT shadow-sm border border-light-border dark:border-dark-border p-6 bg-light-card dark:bg-dark-card">
              <Bell className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
              <h3 className="text-h3 font-semibold">3. Lembre</h3>
              <p className="text-body mt-2">Lembretes D-1 e H-3. Tudo aparece na sua Agenda.</p>
            </div>
          </div>
          <div className="mt-8">
            <Button href="/signup" size="lg">Começar agora</Button>
          </div>
        </div>
      </section>

      {/* Benefícios (4 cards) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          {[
            'Confirmação em 1 clique — o paciente escolhe o horário e pronto.',
            'Lembretes inteligentes — D-1 e H-3 reduzem esquecimento.',
            'Agenda em paz — visão semanal/mensal, arraste-e-solte.',
            'Política de no-show aplicada — janela de cancelamento configurável.',
          ].map((title) => (
            <div key={title} className="rounded-DEFAULT shadow-sm border border-light-border dark:border-dark-border p-6 bg-light-card dark:bg-dark-card">
              <h4 className="text-h3 font-semibold">{title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Simulador de ROI */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-DEFAULT shadow-sm border border-light-border dark:border-dark-border p-6 bg-light-card dark:bg-dark-card">
          <h3 className="text-h3 font-semibold">Simulador de ROI</h3>
          <p className="mt-2 text-small">Recupere sessões todo mês. Insira suas sessões/semana e seu % de no-show atual para estimar até quantas sessões você pode recuperar.</p>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-small" htmlFor="sessions">Sessões/semana</label>
              <input id="sessions" type="number" min={1} max={100} value={sessionsPerWeek} onChange={(e) => { setSessionsPerWeek(Number(e.target.value)); }} className="mt-2 block w-full rounded-md border dark:border-dark-border border-light-border p-2 bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text" />
            </div>
            <div>
              <label className="text-small" htmlFor="noshow">% no-show atual</label>
              <input id="noshow" type="range" min={0} max={100} value={noShowPercent} onChange={(e) => { setNoShowPercent(Number(e.target.value)); }} className="mt-2 w-full" />
              <p className="text-small mt-1">{noShowPercent}%</p>
            </div>
            <div className="flex items-end">
              <p className="text-body">Você pode recuperar <span className="font-semibold">até {recoveredPerMonth}</span> sessões/mês.</p>
            </div>
          </div>
          <p className="text-small mt-3 text-light-text/70 dark:text-dark-text/70">Estimativa baseada em boas práticas (confirmação + lembretes). Resultados variam.</p>
        </div>
      </section>

      {/* Recursos (6 itens) */}
      <section id="recursos" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          {[
            { icon: CalendarRange, title: 'Agenda semana/mês' },
            { icon: Settings, title: 'Disponibilidade recorrente' },
            { icon: CheckSquare, title: 'Convite semanal' },
            { icon: CalendarClock, title: 'Lembretes D-1/H-3' },
            { icon: Bell, title: 'Política de no-show (12 h padrão)' },
            { icon: FileDown, title: 'Export .ics' },
          ].map(({ icon: Icon, title }) => (
            <div key={title} className="rounded-DEFAULT shadow-sm border border-light-border dark:border-dark-border p-6 bg-light-card dark:bg-dark-card flex items-start gap-3">
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <div>
                <h4 className="text-h3 font-semibold">{title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Depoimentos (placeholders) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
          {[
            { quote: '“Pare de correr atrás de confirmação. O sistema faz.”', name: 'Dra. Ana Luiza', crp: 'CRP 00/000000' },
            { quote: '“Reduzi meus furos em poucas semanas.”', name: 'Dr. Pedro Santos', crp: 'CRP 00/000000' },
            { quote: '“Sem prontuário, sem dor de cabeça com LGPD.”', name: 'Dra. Marina Costa', crp: 'CRP 00/000000' },
          ].map(({ quote, name, crp }) => (
            <div key={name} className="rounded-DEFAULT shadow-sm border border-light-border dark:border-dark-border p-6 bg-light-card dark:bg-dark-card">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-body font-semibold">{name}</p>
                  <p className="text-small text-light-text/70 dark:text-dark-text/70">{crp}</p>
                </div>
              </div>
              <p className="text-body mt-3">{quote}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/privacidade" className="inline-flex items-center gap-2 text-body hover:text-primary">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" /> LGPD por padrão
          </Link>
        </div>
      </section>

      {/* Planos & Preços (toggle Mensal/Anual) */}
      <section id="precos" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-body">Mensal</span>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only" checked={annual} onChange={() => { const next = !annual; setAnnual(next); trackEvent('pricing_toggle', { annual: next }); }} />
              <span className="w-12 h-6 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-full relative">
                <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-primary transition-transform ${annual ? 'translate-x-6' : ''}`}></span>
              </span>
            </label>
            <span className="text-body">Anual <span className="text-small text-light-text/70 dark:text-dark-text/70">(2 meses grátis)</span></span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Start */}
            <div className="rounded-DEFAULT shadow-sm border border-light-border dark:border-dark-border p-6 bg-light-card dark:bg-dark-card">
              <h4 className="text-h3 font-semibold">Start – {annual ? `R$ ${priceStartYear}/ano` : `R$ ${priceStartMonthly}/mês`}</h4>
              <p className="mt-2 text-body">• até 50 pacientes • 1.000 mensagens/mês • Export .ics</p>
              <p className="text-small mt-1 text-light-text/70 dark:text-dark-text/70">{annual ? 'Cobrança única anual.' : 'Mensal sem fidelidade.'} Sem taxa de cancelamento. Você controla tudo.</p>
              <Button href="/signup" onClick={() => trackEvent('plan_start_click', { annual })} className="mt-6 w-full" size="lg">Assinar Start</Button>
            </div>
            {/* Pro */}
            <div className="rounded-DEFAULT shadow-sm border border-light-border dark:border-dark-border p-6 bg-light-card dark:bg-dark-card">
              <h4 className="text-h3 font-semibold">Pro – {annual ? `R$ ${priceProYear}/ano` : `R$ ${priceProMonthly}/mês`}</h4>
              <p className="mt-2 text-body">• até 200 pacientes • 4.000 mensagens/mês • Branding simples nos lembretes</p>
              <p className="text-small mt-1 text-light-text/70 dark:text-dark-text/70">{annual ? 'Cobrança única anual.' : 'Mensal sem fidelidade.'} Sem taxa de cancelamento. Você controla tudo.</p>
              <Button href="/signup" onClick={() => trackEvent('plan_pro_click', { annual })} className="mt-6 w-full" size="lg">Assinar Pro</Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ (5) */}
      <section id="faq" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {[
            { q: 'Guardam conteúdo clínico?', a: 'Não. Só agenda e contato.' },
            { q: 'É WhatsApp oficial?', a: 'Sim, via API oficial.' },
            { q: 'Posso cancelar quando?', a: 'A qualquer momento.' },
            { q: 'Integra com meu calendário?', a: 'Export .ics no MVP; Google Calendar na v1.1.' },
            { q: 'Quais pagamentos?', a: 'Pix e cartão via Mercado Pago.' },
          ].map(({ q, a }) => (
            <details key={q} className="rounded-DEFAULT shadow-sm border border-light-border dark:border-dark-border p-4 bg-light-card dark:bg-dark-card mb-3" onToggle={(e) => trackEvent('faq_open', { question: q, open: (e.target as HTMLDetailsElement).open })}>
              <summary className="cursor-pointer text-h3 font-semibold">{q}</summary>
              <p className="mt-2 text-body">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-DEFAULT shadow-md border border-light-border dark:border-dark-border p-6 bg-light-card dark:bg-dark-card flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-h3 font-semibold">Reduza faltas esta semana. Comece grátis em 5 minutos.</p>
            <Button href="/signup" size="lg">Começar grátis (7 dias)</Button>
          </div>
        </div>
      </section>
    </div>
  );
}