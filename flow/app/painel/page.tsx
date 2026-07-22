"use client";

import { useEffect, useMemo, useState } from "react";

type Question = {
  id: string;
  text: string;
  note?: string;
};

type Block = {
  id: string;
  title: string;
  clock: string;
  duration: string;
  goal: string;
  questions: Question[];
};

const blocks: Block[] = [
  {
    id: "abertura",
    title: "Abertura",
    clock: "14:10 – 14:18",
    duration: "8 min",
    goal: "Nomear o problema com uma história real. A plateia precisa sentir a pressão, não só a teoria.",
    questions: [
      {
        id: "q1",
        text: "“A nuvem não corrige falhas de design; ela as amplifica.” Qual foi o caso em que vocês viram isso acontecer de forma mais cara — e qual era a falha de design por trás?",
        note: "Peça um exemplo concreto, não o catálogo de boas práticas.",
      },
      {
        id: "q2",
        text: "Quando alguém diz “vamos escalar”, o que vocês olham primeiro: throughput da aplicação, limites da infra, ou o blast radius de uma falha?",
      },
      {
        id: "q3",
        text: "Em ambientes de alta demanda, qual sinal precoce mais ignorado termina virando colapso sistêmico?",
        note: "Útil se a abertura ficar abstrata demais.",
      },
    ],
  },
  {
    id: "aplicacao",
    title: "Decisões na aplicação",
    clock: "14:18 – 14:30",
    duration: "12 min",
    goal: "Conectar design de software à sobrevivência sob carga. Retries, isolamento e o que não se resolve com “mais réplicas”.",
    questions: [
      {
        id: "q4",
        text: "Quais decisões no nível do software — timeouts, retries, circuit breakers, idempotência, filas — vocês consideram não negociáveis antes de falar em auto-scale?",
      },
      {
        id: "q5",
        text: "Retries bem-intencionados às vezes viram DDoS interno. Como vocês desenham retry e backoff para não amplificar um gargalo?",
      },
      {
        id: "q6",
        text: "Quando o time pede “mais réplicas” e o problema é acoplamento ou estado compartilhado: como vocês param o scaling cego e forçam a conversa de arquitetura?",
      },
      {
        id: "q7",
        text: "Isolamento de falha na aplicação: o que funciona melhor na prática — bulkheads, filas, feature flags, degradação graciosa? O que falhou quando tentaram?",
        note: "Use se sobrar tempo neste bloco.",
      },
    ],
  },
  {
    id: "kubernetes",
    title: "Kubernetes e isolamento",
    clock: "14:30 – 14:45",
    duration: "15 min",
    goal: "Separar isolamento de verdade de isolamento de teatro. Blast radius no cluster.",
    questions: [
      {
        id: "q8",
        text: "No Kubernetes, onde o isolamento costuma ser teatro e onde ele é real: namespaces, NetworkPolicies, quotas, limit ranges, privilégios?",
      },
      {
        id: "q9",
        text: "Qual configuração “padrão de cluster” mais já viu virar incidente sob pressão — HPA agressivo, PDB mal calibrado, node pressure, DNS, etcd?",
      },
      {
        id: "q10",
        text: "Multi-tenant versus clusters separados: em que ponto o isolamento lógico deixa de bastar e o isolamento físico vira decisão de resiliência, não só de custo?",
      },
      {
        id: "q11",
        text: "Como vocês pensam blast radius em um cluster: um Deployment ruim pode derrubar o quê — e como vocês limitam isso por design?",
      },
    ],
  },
  {
    id: "multicloud",
    title: "Multi-cloud e crescimento",
    clock: "14:45 – 14:57",
    duration: "12 min",
    goal: "Desmistificar multi-cloud como solução mágica. Custo, latência e complexidade como riscos.",
    questions: [
      {
        id: "q12",
        text: "Multi-cloud por resiliência ou por política comercial? Em que cenário a complexidade do multi-cloud aumenta o risco de colapso em vez de reduzir?",
      },
      {
        id: "q13",
        text: "Failover entre regiões ou clouds: qual parte é realmente automática na prática, e qual ainda depende de runbook humano sob estresse?",
      },
      {
        id: "q14",
        text: "Latência, custo e consistência: qual trade-off vocês mais veem times subestimarem ao espalhar o sistema?",
      },
      {
        id: "q15",
        text: "Quando a infra está ok e a aplicação não — ou o contrário: como vocês evitam o jogo de empurra entre time de app e plataforma no meio do incidente?",
        note: "Ponte para o bloco de operação.",
      },
    ],
  },
  {
    id: "operacao",
    title: "Operação sob caos",
    clock: "14:57 – 15:05",
    duration: "8 min",
    goal: "Trazer a conversa para o minuto do incidente: sinais, decisões rápidas, aprendizado estrutural.",
    questions: [
      {
        id: "q16",
        text: "Quais métricas ou SLOs realmente antecipam colapso — não só “CPU alto”? Se só pudessem escolher três sinais, quais seriam?",
        note: "Liga com a palestra de SRE que veio antes, sem repetir o framework.",
      },
      {
        id: "q17",
        text: "Chaos engineering: vale a pena em todo sistema, ou só depois de um nível mínimo de maturidade? Qual experimento deu o melhor retorno?",
      },
      {
        id: "q18",
        text: "Em incidente real, qual decisão vocês tomariam em cinco minutos — degradar feature, cortar tráfego, failover, freeze de deploys — e o que quase nunca dá certo sob pressão?",
      },
      {
        id: "q19",
        text: "Como transformar um postmortem em mudança estrutural — código e plataforma — e não só em “vamos documentar melhor”?",
        note: "Opcional se o tempo apertar.",
      },
    ],
  },
  {
    id: "fechamento",
    title: "Fechamento",
    clock: "15:05 – 15:10",
    duration: "5 min",
    goal: "Três decisões acionáveis + uma pergunta da plateia. Encerrar com clareza, não com resumo genérico.",
    questions: [
      {
        id: "q20",
        text: "Se um time está crescendo rápido e ainda tem arquitetura frágil, quais três decisões vocês priorizariam nos próximos 90 dias para reduzir a chance de colapso?",
      },
      {
        id: "q21",
        text: "Qual anti-padrão de “arquitetura cloud moderna” mais preocupa vocês hoje — microserviços demais, mesh cedo demais, multi-cloud sem necessidade, observability sem ação?",
      },
      {
        id: "q22",
        text: "Uma frase para a plateia levar: o que a nuvem não perdoa quando o design é fraco?",
      },
    ],
  },
];

const sparks = [
  "Isso é problema de código ou de plataforma?",
  "O que vocês não fariam de novo?",
  "Em 2026, o que ainda é overengineering disfarçado de resiliência?",
  "Se o orçamento de cloud cair 30% amanhã, o que preservam para não colapsar?",
];

const STORAGE_KEY = "tdc-painel-used-questions";

export default function PainelPage() {
  const [used, setUsed] = useState<Record<string, boolean>>({});
  const [activeBlock, setActiveBlock] = useState(blocks[0].id);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUsed(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const nodes = blocks
      .map((b) => document.getElementById(b.id))
      .filter((n): n is HTMLElement => Boolean(n));

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveBlock(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const usedCount = useMemo(
    () => Object.values(used).filter(Boolean).length,
    [used],
  );

  function toggleUsed(id: string) {
    setUsed((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function resetUsed() {
    setUsed({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <header className="painel-hero">
        <div className="painel-shell">
          <p className="painel-kicker">
            TDC Florianópolis 2026 · Trilha Arquitetura Cloud
          </p>
          <h1 className="painel-brand">
            Arquitetura resiliente <em>sob pressão</em>
          </h1>
          <p className="painel-lead">
            A nuvem não corrige falhas de design — ela as amplifica. Roteiro de
            perguntas para conectar aplicação, Kubernetes e multi-cloud sem
            deixar o painel virar slide falado.
          </p>
          <div className="painel-meta">
            <span>
              <strong>24/07/2026</strong> · 14:10–15:10
            </span>
            <span>
              <strong>60 min</strong> · Florianópolis
            </span>
            <span>
              <strong>{usedCount}</strong> perguntas marcadas
            </span>
          </div>
          <a className="painel-cta" href="#roteiro">
            Abrir roteiro <span>↓</span>
          </a>
        </div>
      </header>

      <nav className="painel-clock" aria-label="Linha do tempo do painel">
        <div className="painel-shell">
          <div className="painel-clock-row">
            <p className="painel-clock-label">
              Pressão do painel · <b>14:10 → 15:10</b>
            </p>
            <p className="painel-clock-label">
              Bloco ativo: <b>{blocks.find((b) => b.id === activeBlock)?.title}</b>
            </p>
          </div>
          <div className="painel-track">
            {blocks.map((b) => (
              <a
                key={b.id}
                href={`#${b.id}`}
                data-active={activeBlock === b.id}
                title={`${b.title} · ${b.clock}`}
              >
                {b.title}
              </a>
            ))}
          </div>
          <div className="painel-track-legend" aria-hidden="true">
            {blocks.map((b) => (
              <span key={b.id}>{b.duration}</span>
            ))}
          </div>
        </div>
      </nav>

      <main id="roteiro" className="painel-main">
        <div className="painel-shell">
          <section className="painel-intro" aria-label="Contexto do painel">
            <div>
              <h2>Por que este painel existe</h2>
              <p>
                Escalar sistemas distribuídos sem maturidade arquitetural é um
                convite para incidentes. Em alta demanda, um gargalo pequeno vira
                colapso sistêmico se aplicação e infraestrutura não forem
                desenhadas juntas — com isolamento real, não só labels bonitos.
              </p>
            </div>
            <ul className="painel-people">
              <li>
                <strong>Marcelo Kruger</strong>
                <span>Engenheiro de Cloud · Trillia B3</span>
              </li>
              <li>
                <strong>Flávio Pimenta</strong>
                <span>Staff Engineer · Select Soluções</span>
              </li>
              <li>
                <strong>
                  <a
                    href="https://www.linkedin.com/in/amim/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Amim K.
                  </a>
                </strong>
                <span>Principal Software Engineer · Broadcom</span>
              </li>
            </ul>
          </section>

          {blocks.map((block) => (
            <section
              key={block.id}
              id={block.id}
              className="painel-block"
              aria-labelledby={`${block.id}-title`}
            >
              <div className="painel-block-head">
                <h2 id={`${block.id}-title`}>{block.title}</h2>
                <span className="painel-block-time">
                  {block.clock} · {block.duration}
                </span>
              </div>
              <p className="painel-block-goal">{block.goal}</p>
              <ol className="painel-questions">
                {block.questions.map((q, i) => (
                  <li
                    key={q.id}
                    className="painel-q"
                    data-used={used[q.id] ? "true" : "false"}
                  >
                    <span className="painel-q-num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="painel-q-text">{q.text}</p>
                      {q.note ? (
                        <span className="painel-q-note">{q.note}</span>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className="painel-mark"
                      onClick={() => toggleUsed(q.id)}
                      aria-pressed={Boolean(used[q.id])}
                    >
                      {used[q.id] ? "Usada" : "Marcar"}
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          ))}

          <section className="painel-sparks" aria-labelledby="sparks-title">
            <h2 id="sparks-title">Gatilhos se a conversa esfriar</h2>
            <ul>
              {sparks.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>

          <footer className="painel-footer">
            <span>
              Roteiro interno · Trilha Arquitetura Cloud · TDC Floripa 2026
            </span>
            <span>
              <button type="button" className="painel-reset" onClick={resetUsed}>
                Limpar marcas
              </button>
              {" · "}
              <a href="/">Voltar ao diagrama OSSM</a>
            </span>
          </footer>
        </div>
      </main>
    </>
  );
}
