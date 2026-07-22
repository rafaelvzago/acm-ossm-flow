"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import "./talk.css";

const FOOTER = "TDC Florianópolis 2026 · OpenShift Service Mesh Multi-Cluster";
const TOTAL = 11;

export default function TalkPage() {
  const [index, setIndex] = useState(0);

  const go = useCallback((next: number) => {
    const i = Math.max(0, Math.min(TOTAL - 1, next));
    setIndex(i);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${i + 1}`);
    }
  }, []);

  useEffect(() => {
    const fromHash = Number(window.location.hash.replace("#", ""));
    if (fromHash >= 1 && fromHash <= TOTAL) setIndex(fromHash - 1);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.matches("a,button,input,textarea")) return;
      if (e.code === "ArrowRight" || e.code === "Space" || e.code === "PageDown") {
        e.preventDefault();
        go(index + 1);
      }
      if (e.code === "ArrowLeft" || e.code === "PageUp") {
        e.preventDefault();
        go(index - 1);
      }
      if (e.key === "Home") go(0);
      if (e.key === "End") go(TOTAL - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  return (
    <div className="talk">
      <div className="talk-stage" aria-live="polite">
        <div className="talk-nav" aria-hidden="true">
          <button type="button" aria-label="Previous slide" onClick={() => go(index - 1)} />
          <button type="button" aria-label="Next slide" onClick={() => go(index + 1)} />
        </div>

        {/* 1 Title */}
        <section className={`talk-slide slide-title ${index === 0 ? "is-active" : ""}`}>
          <div className="slide-title-copy">
            <img className="slide-title-logo" src="/talk/logo-redhat.png" alt="Red Hat" />
            <p className="talk-kicker">TDC Florianópolis 2026</p>
            <h1 className="talk-title">
              OpenShift Service Mesh
              <span>Multi-Cluster</span>
            </h1>
            <p className="talk-subtitle">Connecting service meshes across OpenShift clusters</p>
            <div className="slide-title-meta">
              <strong>Rafael Zago</strong>
              <span>Senior Software Automation Engineer · Red Hat</span>
            </div>
          </div>
          <div className="slide-title-hero">
            <img src="/talk/hero-side.jpg" alt="" />
          </div>
        </section>

        {/* 2 Agenda */}
        <section className={`talk-slide ${index === 1 ? "is-active" : ""}`}>
          <p className="talk-kicker">Overview</p>
          <h1 className="talk-title">Agenda</h1>
          <p className="talk-subtitle">From foundational concepts to cross-cluster connectivity validation</p>
          <div className="agenda-grid">
            <article className="agenda-card">
              <b>01</b>
              <h3>Fundamentals</h3>
              <p>What Is a Service Mesh? · Multi-Cluster Architecture</p>
            </article>
            <article className="agenda-card">
              <b>02</b>
              <h3>Configuration</h3>
              <p>6-Phase Setup · CAs · Gateways · Remote Secrets</p>
            </article>
            <article className="agenda-card">
              <b>03</b>
              <h3>Wrap-up</h3>
              <p>Demo Validation · Questions · References</p>
            </article>
          </div>
          <div className="objective">
            <p>
              <strong>Objective. </strong>
              Understand the minimum path to securely connect two OpenShift meshes and enable cross-cluster discovery.
            </p>
          </div>
          <footer className="talk-footer">{FOOTER}</footer>
        </section>

        {/* 3 Part 1 */}
        <section className={`talk-slide slide-divider ${index === 2 ? "is-active" : ""}`}>
          <div className="part">Part 1</div>
          <h1 className="talk-title">Fundamentals</h1>
          <p className="talk-subtitle">What a service mesh adds to OpenShift—and why it matters.</p>
        </section>

        {/* 4 What is a Service Mesh */}
        <section className={`talk-slide ${index === 3 ? "is-active" : ""}`}>
          <p className="talk-kicker">Part 1 · Fundamentals</p>
          <h1 className="talk-title">What Is a Service Mesh?</h1>
          <p className="talk-subtitle">Infrastructure layer for service-to-service communication</p>
          <div className="split">
            <div>
              <h3 style={{ margin: "0 0 12px" }}>Mesh Architecture</h3>
              <ul>
                <li>Envoy as a sidecar in each pod</li>
                <li>Data plane: Envoy proxies in the workloads</li>
                <li>Control plane: istiod configures the proxies</li>
                <li>Automatic mTLS · traffic management · observability</li>
                <li>Scales microservices without changing application code</li>
                <li>OpenShift Service Mesh 3 = Istio managed by the Sail operator</li>
              </ul>
            </div>
            <div className="media-stack">
              <img src="/talk/mesh-arch-a.png" alt="Service mesh architecture diagram" />
              <img src="/talk/mesh-arch-b.png" alt="Service mesh data and control plane" />
            </div>
          </div>
          <footer className="talk-footer">{FOOTER}</footer>
        </section>

        {/* 5 Multi-cluster architecture */}
        <section className={`talk-slide ${index === 4 ? "is-active" : ""}`}>
          <p className="talk-kicker">Part 1 · Fundamentals</p>
          <h1 className="talk-title">Multi-Cluster Architecture</h1>
          <p className="talk-subtitle">Multi-primary topology: two control planes, one mesh</p>
          <ul style={{ marginTop: 22, fontSize: "clamp(0.95rem,1.5vw,1.15rem)", lineHeight: 1.45 }}>
            <li>Each cluster runs its own istiod control plane</li>
            <li>Shared root CA + one intermediate CA per cluster</li>
            <li>East-west gateway: LoadBalancer on port :15443</li>
            <li>TLS AUTO_PASSTHROUGH preserves end-to-end mTLS</li>
            <li>Remote secrets enable cross-cluster service discovery</li>
            <li>meshNetworks explicitly points to the remote gateway</li>
          </ul>
          <div className="stats">
            <article className="stat-card"><strong>2</strong><span>primary clusters</span></article>
            <article className="stat-card"><strong>1</strong><span>Istio mesh ID</span></article>
            <article className="stat-card"><strong>15443</strong><span>east-west TLS passthrough</span></article>
          </div>
          <footer className="talk-footer">{FOOTER}</footer>
        </section>

        {/* 6 Full diagram */}
        <section className={`talk-slide bleed ${index === 5 ? "is-active" : ""}`}>
          <img className="bleed-img" src="/talk/diagram-full.png" alt="Multi-cluster OpenShift Service Mesh architecture diagram" />
        </section>

        {/* 7 Flow CTA (replaces PPTX 7-11) */}
        <section className={`talk-slide flow-cta ${index === 6 ? "is-active" : ""}`}>
          <p className="talk-kicker">Interactive demo</p>
          <h1 className="talk-title">Cross-Cluster Request Flow</h1>
          <p className="talk-subtitle">
            Follow the live animation: discovery, east-west gateway TLS passthrough, and mTLS end to end.
          </p>
          <Link className="cta" href="/">Open interactive request flow</Link>
          <div className="flow-steps">
            <div><b>1</b><span>sleep calls productpage</span></div>
            <div><b>2</b><span>istiod resolves the remote service</span></div>
            <div><b>3</b><span>gateway :15443 TLS passthrough</span></div>
            <div><b>4</b><span>productpage responds</span></div>
            <div><b>5</b><span>mTLS response returns</span></div>
          </div>
          <footer className="talk-footer">{FOOTER}</footer>
        </section>

        {/* 8 Part 2 */}
        <section className={`talk-slide slide-divider ${index === 7 ? "is-active" : ""}`}>
          <div className="part">Part 2</div>
          <h1 className="talk-title">Configuration</h1>
          <p className="talk-subtitle">The POC in six phases: certificates, gateways, remote secrets, and validation.</p>
        </section>

        {/* 9 Questions */}
        <section className={`talk-slide questions ${index === 8 ? "is-active" : ""}`}>
          <h1 className="talk-title">Questions?</h1>
          <div className="slide-title-meta" style={{ marginTop: 24 }}>
            <strong>Rafael Zago</strong>
            <span>Senior Software Automation Engineer · Red Hat</span>
            <span>rafaelvzago.com</span>
          </div>
        </section>

        {/* 10 Materials */}
        <section className={`talk-slide ${index === 9 ? "is-active" : ""}`}>
          <p className="talk-kicker">Part 2 · Resources</p>
          <h1 className="talk-title">Access the Materials</h1>
          <p className="talk-subtitle">Slides, links, and references from this session in one place</p>
          <div className="materials">
            <div className="materials-list">
              <article className="material-card">
                <b>01</b>
                <h3>Presentation Slides</h3>
                <p>Official slide deck and key session links</p>
              </article>
              <article className="material-card">
                <b>02</b>
                <h3>Technology References</h3>
                <p>OpenShift Service Mesh, Istio, and Kiali documentations</p>
              </article>
              <article className="material-card">
                <b>03</b>
                <h3>Multi-Cluster POC</h3>
                <p>All code and materials to reproduce the environment</p>
              </article>
            </div>
            <div className="qr-panel">
              <img src="/talk/logo-tdc.png" alt="Session materials" />
              <strong>rafaelvzago.com</strong>
              <p style={{ margin: "8px 0 0", color: "var(--talk-muted)" }}>
                Scan to Access Instantly<br />Open the session materials directly on your phone
              </p>
            </div>
          </div>
          <footer className="talk-footer">{FOOTER}</footer>
        </section>

        {/* 11 References */}
        <section className={`talk-slide ${index === 10 ? "is-active" : ""}`}>
          <p className="talk-kicker">Resources</p>
          <h1 className="talk-title">References</h1>
          <p className="talk-subtitle">Official documentation and related projects</p>
          <div className="refs">
            <div className="refs-list">
              <article className="ref-card">
                <h3>OpenShift Service Mesh Docs</h3>
                <p>docs.openshift.com</p>
              </article>
              <article className="ref-card">
                <h3>Istio Multi-Cluster</h3>
                <p>istio.io/latest/docs/setup/install/multicluster</p>
              </article>
              <article className="ref-card">
                <h3>Sail Operator</h3>
                <p>github.com/istio-ecosystem/sail-operator</p>
              </article>
              <article className="ref-card">
                <h3>Istio · Kiali</h3>
                <p>github.com/istio/istio · github.com/kiali/kiali</p>
              </article>
            </div>
            <div className="thanks">
              <strong>Thank You</strong>
              <span>Rafael Zago<br />Senior Software Automation Engineer<br />rafaelvzago.com</span>
            </div>
          </div>
          <footer className="talk-footer">{FOOTER}</footer>
        </section>
      </div>

      <div className="talk-chrome">
        <Link href="/">Interactive flow</Link>
        <div className="talk-dots" role="tablist" aria-label="Slides">
          {Array.from({ length: TOTAL }, (_, i) => (
            <button
              key={i}
              type="button"
              className={i === index ? "is-active" : ""}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <span>
          {String(index + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
