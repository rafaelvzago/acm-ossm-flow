"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const chapters = [
  ["Architecture", 0, 1.8, "Two Sail-managed control planes", "Each OpenShift cluster runs its own OSSM 3 control plane and east-west gateway."],
  ["Shared trust", 2, 4.4, "A common root of trust", "Cluster intermediate CAs chain to one shared root CA for cross-cluster mTLS."],
  ["Discovery", 4.8, 7.2, "Remote service discovery", "Remote secrets allow each istiod instance to discover services in the other cluster."],
  ["mTLS request", 7.6, 11.1, "Request crosses both gateways", "Port 15443 uses TLS passthrough, preserving workload mTLS end to end."],
  ["Response", 11.6, 14.8, "Encrypted response returns", "The response follows the reverse path without terminating workload mTLS."],
  ["One mesh", 15.2, 17.4, "One logical Istio mesh", "Both clusters use the Istio mesh ID bookinfo-mesh with shared trust and discovery."],
] as const;

function Cert({ x, y, width, label, root = false }: { x: number; y: number; width: number; label: string; root?: boolean }) {
  return <g className={`trust-node ${root ? "root-ca" : ""}`}>
    <rect x={x} y={y} width={width} height="62" rx="16" className="cert-box" />
    <path d={`M ${x+27} ${y+17} L ${x+42} ${y+11} L ${x+57} ${y+17} V ${y+34} C ${x+57} ${y+45}, ${x+48} ${y+51}, ${x+42} ${y+55} C ${x+36} ${y+51}, ${x+27} ${y+45}, ${x+27} ${y+34} Z`} className="shield" />
    <text x={x+75} y={y+40} className="cert-label">{label}</text>
  </g>;
}

function OssmMark({ x, y, size = 50 }: { x: number; y: number; size?: number }) {
  return <image href="/openshift-service-mesh.svg" x={x} y={y} width={size} height={size} className="cluster-mark" />;
}

function Operator({ x, y }: { x: number; y: number }) {
  return <g className="operator">
    <rect x={x} y={y} width="132" height="28" rx="14" fill="#151515" />
    <circle cx={x+17} cy={y+14} r="6.5" fill="#ee0000" />
    <text x={x+31} y={y+19} className="operator-text">Sail operator</text>
  </g>;
}

function Control({ x, y }: { x: number; y: number }) {
  return <g className="node control-node">
    <rect x={x} y={y} width="230" height="110" rx="18" className="node-box" />
    <path d={`M ${x+31} ${y+74} L ${x+45} ${y+35} L ${x+59} ${y+74} Z`} fill="#ee0000" />
    <text x={x+80} y={y+47} className="node-title">Control plane</text>
    <text x={x+80} y={y+77} className="node-sub">istiod</text>
  </g>;
}

function Gateway({ x, y }: { x: number; y: number }) {
  const cx=x+39, cy=y+56;
  return <g className="node gateway-node">
    <rect x={x} y={y} width="270" height="110" rx="18" className="node-box" />
    <path d={`M ${cx} ${cy-18} L ${cx-18} ${cy+17} M ${cx} ${cy-18} L ${cx+18} ${cy+17} M ${cx-18} ${cy+17} L ${cx+18} ${cy+17}`} className="gateway-icon" />
    {[{x:cx,y:cy-18},{x:cx-18,y:cy+17},{x:cx+18,y:cy+17}].map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="6" className="gateway-dot" />)}
    <text x={x+77} y={y+47} className="node-title gateway-title">East-west gateway</text>
    <text x={x+77} y={y+77} className="node-sub">LoadBalancer :15443</text>
  </g>;
}

function App({ x, y, label, className="" }: { x:number; y:number; label:string; className?:string }) {
  return <g className={`app-node ${className}`}>
    <rect x={x} y={y} width="210" height="48" rx="11" className="app-box" />
    <rect x={x+16} y={y+14} width="18" height="18" rx="4" className="app-icon" />
    <text x={x+46} y={y+32} className="app-label">{label}</text>
  </g>;
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const chapterTween = useRef<gsap.core.Tween | null>(null);
  const [playing,setPlaying]=useState(false);
  const [progress,setProgress]=useState(0);
  const [active,setActive]=useState(0);
  const [reduced,setReduced]=useState(false);
  const [speed,setSpeed]=useState(1);

  useLayoutEffect(()=>{
    if(!root.current) return;
    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(reduce);
    const ctx=gsap.context(()=>{
      if(reduce){
        gsap.set(".anim,.trust-node,.remote,.summary,.request-line,.response-line",{autoAlpha:1,y:0,scale:1});
        gsap.set(".draw",{strokeDasharray:1,strokeDashoffset:0});
        gsap.set(".packet",{autoAlpha:0});
        setProgress(100); setActive(5); return;
      }
      gsap.set(".title-group",{autoAlpha:0,y:-12});
      gsap.set(".cluster",{autoAlpha:0,y:18,scale:.97,transformOrigin:"50% 50%"});
      gsap.set(".node,.operator,.apps,.app-node,.mesh-badge",{autoAlpha:0,y:14});
      gsap.set(".trust-node,.summary",{autoAlpha:0,y:12,scale:.97,transformOrigin:"50% 50%"});
      gsap.set(".draw",{strokeDasharray:1,strokeDashoffset:1});
      gsap.set(".request-line,.response-line",{autoAlpha:0});
      gsap.set(".packet",{autoAlpha:0,x:0,y:0});
      gsap.set(".mesh-link",{autoAlpha:0});

      const tl=gsap.timeline({paused:true,defaults:{ease:"power2.out"},onUpdate:()=>{
        const t=tl.time(); let idx=0;
        chapters.forEach((c,i)=>{if(t>=c[1]) idx=i;});
        setActive(a=>a===idx?a:idx); setProgress(Number((tl.progress()*100).toFixed(1)));
      },onComplete:()=>setPlaying(false)});
      tl.to(".title-group",{autoAlpha:1,y:0,duration:.45})
        .to(".cluster",{autoAlpha:1,y:0,scale:1,duration:.7,stagger:.12},.15)
        .to(".operator",{autoAlpha:1,y:0,duration:.35,stagger:.08},.7)
        .to(".node",{autoAlpha:1,y:0,duration:.48,stagger:.07},.78)
        .to(".apps",{autoAlpha:1,y:0,duration:.4,stagger:.08},.95)
        .to(".app-node",{autoAlpha:1,y:0,duration:.38,stagger:.05},1.08)
        .to(".mesh-badge",{autoAlpha:1,y:0,duration:.42,stagger:.08},1.38)
        .to(".node,.operator,.apps,.app-node,.mesh-badge,.remote",{opacity:.35,duration:.3},2)
        .to(".trust-node",{autoAlpha:1,y:0,scale:1,duration:.55,stagger:.1},2)
        .to(".trust-line",{strokeDashoffset:0,duration:1,stagger:.08,ease:"power1.inOut"},2.25)
        .to(".root-ca",{scale:1.035,duration:.28,yoyo:true,repeat:1},3.35)
        .to(".cluster-box",{stroke:"#ee0000",duration:.3,stagger:.08},3.55)
        .to(".cluster-box",{stroke:"#d8d8d8",duration:.5,stagger:.08},3.95)
        .to(".trust-node",{opacity:.35,duration:.3},4.8)
        .to(".control-node,.remote",{opacity:1,duration:.3},4.8)
        .to(".discovery-line",{strokeDashoffset:0,duration:1.05,stagger:.1,ease:"power1.inOut"},5.05)
        .to(".control-node .node-box",{stroke:"#ee0000",fill:"#fff0f0",strokeWidth:3.5,duration:.35,stagger:.08},5.35)
        .to(".discovery-line",{strokeDashoffset:-.18,duration:.7,ease:"none"},6.35)
        .to(".control-node .node-box",{stroke:"#c7c7c7",fill:"#fff",strokeWidth:2,duration:.4,stagger:.08},6.85)
        .to(".control-node,.remote",{opacity:.35,duration:.3},7.6)
        .to(".gateway-node,.apps,.east-sleep,.west-product",{opacity:1,duration:.3},7.6)
        .to(".req-1",{autoAlpha:1,duration:.01},7.6)
        .to(".req-1",{strokeDashoffset:0,duration:.4,ease:"power1.inOut"},7.6)
        .to(".req-2",{autoAlpha:1,duration:.01},8.05)
        .to(".req-2",{strokeDashoffset:0,duration:.5,ease:"power1.inOut"},8.05)
        .to(".req-3",{autoAlpha:1,duration:.01},8.6)
        .to(".req-3",{strokeDashoffset:0,duration:.4,ease:"power1.inOut"},8.6)
        .to(".east-sleep .app-box",{stroke:"#ee0000",fill:"#fff0f0",strokeWidth:3,duration:.25},7.6)
        .to(".request-packet",{autoAlpha:1,duration:.01},7.7)
        .to(".request-packet",{y:66,duration:.3},7.7)
        .to(".gateway-node .node-box",{stroke:"#ee0000",fill:"#fff0f0",strokeWidth:3.5,duration:.28,stagger:.08},8.05)
        .to(".request-packet",{x:-420,y:66,duration:.4,ease:"none"},8.1)
        .to(".request-packet",{x:-840,y:66,duration:.4,ease:"none"},8.5)
        .to(".request-packet",{x:-840,y:0,duration:.25},8.9)
        .to(".west-product .app-box",{stroke:"#ee0000",fill:"#fff0f0",strokeWidth:3,duration:.25},8.9)
        .to(".request-packet",{autoAlpha:0,duration:.18},10.85)
        .to(".res-1",{autoAlpha:1,duration:.01},11.6)
        .to(".res-1",{strokeDashoffset:0,duration:.4,ease:"power1.inOut"},11.6)
        .to(".res-2",{autoAlpha:1,duration:.01},12.05)
        .to(".res-2",{strokeDashoffset:0,duration:.5,ease:"power1.inOut"},12.05)
        .to(".res-3",{autoAlpha:1,duration:.01},12.6)
        .to(".res-3",{strokeDashoffset:0,duration:.4,ease:"power1.inOut"},12.6)
        .to(".response-packet",{autoAlpha:1,duration:.01},11.7)
        .to(".response-packet",{y:106,duration:.3},11.7)
        .to(".response-packet",{x:420,y:106,duration:.4,ease:"none"},12.1)
        .to(".response-packet",{x:840,y:106,duration:.4,ease:"none"},12.5)
        .to(".response-packet",{x:840,y:0,duration:.25},12.9)
        .to(".response-packet",{autoAlpha:0,duration:.18},14.55)
        .to(".node,.trust-node,.operator,.apps,.app-node,.mesh-badge,.remote",{opacity:1,duration:.4},15.2)
        .to(".req-1,.req-2,.req-3,.res-1,.res-2,.res-3,.discovery-line",{opacity:.16,duration:.4},15.2)
        .to(".mesh-link",{autoAlpha:1,strokeDashoffset:0,duration:.8,ease:"power1.inOut"},15.3)
        .to(".mesh-box",{fill:"#fff0f0",stroke:"#ee0000",strokeWidth:2.5,duration:.35,stagger:.08},15.45)
        .to(".summary",{autoAlpha:1,y:0,scale:1,duration:.55,ease:"back.out(1.5)"},15.75)
        .to(".cluster",{scale:1.008,duration:.28,stagger:.08,yoyo:true,repeat:1},16.35)
        .to({}, {duration:.7});
      timeline.current=tl; tl.play(0); setPlaying(true);
    },root);
    return()=>{chapterTween.current?.kill();timeline.current=null;ctx.revert();};
  },[]);

  const toggle=()=>{const tl=timeline.current;if(!tl||reduced)return;chapterTween.current?.kill();if(tl.progress()>=.999){tl.restart();setPlaying(true);}else if(tl.paused()){tl.play();setPlaying(true);}else{tl.pause();setPlaying(false);}};
  const replay=()=>{const tl=timeline.current;if(!tl||reduced)return;chapterTween.current?.kill();tl.restart();setPlaying(true);};
  const go=(i:number)=>{const tl=timeline.current;if(!tl||reduced)return;chapterTween.current?.kill();tl.pause();tl.time(Number(chapters[i][2]),false);setPlaying(false);};
  const scrub=(v:number)=>{const tl=timeline.current;if(!tl||reduced)return;chapterTween.current?.kill();tl.pause().progress(v/100);setProgress(v);setPlaying(false);};
  const changeSpeed=(s:number)=>{setSpeed(s);timeline.current?.timeScale(s);};

  useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.target as HTMLElement)?.matches("button,input,textarea,select"))return;if(e.code==="Space"){e.preventDefault();toggle();}if(e.key==="ArrowRight")go(Math.min(5,active+1));if(e.key==="ArrowLeft")go(Math.max(0,active-1));if(e.key.toLowerCase()==="r")replay();};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key);});

  const chapter=chapters[active];
  return <main className="page" ref={root}>
    <header className="header">
      <div><p>OpenShift Service Mesh 3</p><h1>Istio mesh ID architecture</h1></div>
      <div className="tags"><Link href="/talk/">TDC talk</Link><span>OSSM 3</span><span>Sail operator</span><span>Istio</span></div>
    </header>

    <section className="experience" aria-label="Interactive Istio mesh architecture animation">
      <div className="stage">
        <svg viewBox="0 0 1600 960" className="diagram" role="img" aria-labelledby="svg-title svg-desc">
          <title id="svg-title">OpenShift Service Mesh 3 multi-cluster Istio mesh ID architecture</title>
          <desc id="svg-desc">Two OpenShift clusters, shared certificate trust, remote discovery, east-west gateways, and one Istio mesh ID.</desc>
          <defs>
            <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="7" stdDeviation="9" floodColor="#000" floodOpacity=".11" /></filter>
            <filter id="glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <marker id="arrow" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L12 6L0 12Z" fill="#ee0000"/></marker>
            <marker id="arrow-dark" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M0 0L12 6L0 12Z" fill="#0066cc"/></marker>
          </defs>
          <rect width="1600" height="960" rx="30" fill="#fbfbfb"/><rect width="1600" height="10" rx="5" fill="#ee0000"/>
          <g className="title-group"><text x="55" y="65" className="svg-kicker">OPENSHIFT SERVICE MESH 3</text><text x="55" y="110" className="svg-title">Multi-Cluster Request Flow</text><text x="1545" y="68" textAnchor="end" className="svg-meta">OSSM 3 • SAIL OPERATOR • ISTIO</text></g>

          <path pathLength="1" d="M800 199V220H340V245" className="draw trust-line"/><path pathLength="1" d="M800 220H1260V245" className="draw trust-line"/>
          <Cert x={650} y={137} width={300} label="Shared Root CA" root/><Cert x={150} y={245} width={380} label="Intermediate CA — west"/><Cert x={1070} y={245} width={380} label="Intermediate CA — east"/>
          <text x="800" y="327" textAnchor="middle" className="trust-caption trust-node">Shared trust enables mTLS between clusters</text>

          <g className="cluster west"><rect x="55" y="345" width="650" height="500" rx="28" className="cluster-box"/><OssmMark x={80} y={372}/><text x="147" y="397" className="cluster-title">Cluster West</text><text x="147" y="429" className="cluster-sub">west-network</text></g>
          <g className="cluster east"><rect x="895" y="345" width="650" height="500" rx="28" className="cluster-box"/><OssmMark x={920} y={372}/><text x="987" y="397" className="cluster-title">Cluster East</text><text x="987" y="429" className="cluster-sub">east-network</text></g>
          <Operator x={154} y={444}/><Operator x={1339} y={444}/><Control x={105} y={472}/><Gateway x={385} y={472}/><Gateway x={945} y={472}/><Control x={1290} y={472}/>

          <g className="apps"><rect x="105" y="607" width="550" height="125" rx="18" className="apps-box"/><text x="380" y="638" textAnchor="middle" className="apps-title">Applications</text></g>
          <g className="apps"><rect x="945" y="607" width="550" height="125" rx="18" className="apps-box"/><text x="1220" y="638" textAnchor="middle" className="apps-title">Applications</text></g>
          <App x={125} y={654} label="productpage" className="west-product"/><App x={365} y={654} label="reviews" className="west-reviews"/><App x={965} y={654} label="sleep" className="east-sleep"/><App x={1205} y={654} label="bookinfo" className="east-bookinfo"/>

          <path d="M230 654V618H220V582" className="sidecar-line"/>
          <path d="M470 654V618H220V582" className="sidecar-line"/>
          <path d="M1070 654V618H1405V582" className="sidecar-line"/>
          <path d="M1310 654V618H1405V582" className="sidecar-line"/>

          <path d="M230 654V618H520V582" className="datapath-line"/>
          <path d="M470 654V618H520V582" className="datapath-line"/>
          <path d="M1070 654V618H1080V582" className="datapath-line"/>
          <path d="M1310 654V618H1080V582" className="datapath-line"/>

          <g className="remote"><rect x="650" y="604" width="300" height="108" rx="18" className="node-box remote-box"/><rect x="674" y="649" width="30" height="27" rx="4" className="lock"/><path d="M679 649V640A10 10 0 0 1 699 640V649" className="shackle"/><text x="722" y="651" className="node-title">Remote secrets</text><text x="722" y="681" className="node-sub">service discovery</text></g>
          <path pathLength="1" d="M1405 582V658H950" className="draw discovery-line" markerEnd="url(#arrow)"/><path pathLength="1" d="M650 658H220V582" className="draw discovery-line" markerEnd="url(#arrow)"/>

          <path pathLength="1" d="M1055 702V768" className="draw request-line req-1"/>
          <path pathLength="1" d="M1055 768H215" className="draw request-line req-2" markerEnd="url(#arrow)"/>
          <path pathLength="1" d="M215 768V702" className="draw request-line req-3" markerEnd="url(#arrow)"/>
          <path pathLength="1" d="M245 702V808" className="draw response-line res-1"/>
          <path pathLength="1" d="M245 808H1085" className="draw response-line res-2" markerEnd="url(#arrow-dark)"/>
          <path pathLength="1" d="M1085 808V702" className="draw response-line res-3" markerEnd="url(#arrow-dark)"/>
          <circle cx="1055" cy="702" r="11" className="packet request-packet"/><circle cx="245" cy="702" r="11" className="packet response-packet"/>
          <g className="gateway-caption">
            <rect x="684" y="498" width="232" height="56" rx="16" className="gateway-caption-box" filter="url(#shadow)"/>
            <text x="800" y="520" textAnchor="middle" className="gateway-caption-text">15443 • TLS passthrough</text>
            <text x="800" y="540" textAnchor="middle" className="gateway-caption-text">workload mTLS preserved</text>
          </g>

          <path pathLength="1" d="M375 878H1225" className="draw mesh-link"/>
          <g className="mesh-badge"><rect x="220" y="862" width="320" height="34" rx="17" className="mesh-box"/><text x="380" y="885" textAnchor="middle" className="mesh-label">Istio mesh ID: bookinfo-mesh</text></g>
          <g className="mesh-badge"><rect x="1060" y="862" width="320" height="34" rx="17" className="mesh-box"/><text x="1220" y="885" textAnchor="middle" className="mesh-label">Istio mesh ID: bookinfo-mesh</text></g>
          <g className="summary"><rect x="610" y="906" width="380" height="44" rx="22" fill="#151515" filter="url(#shadow)"/><circle cx="649" cy="928" r="7" fill="#ee0000"/><text x="800" y="935" textAnchor="middle" className="summary-label">ONE LOGICAL ISTIO MESH</text></g>
        </svg>
      </div>

      <div className="controls">
        <div className="transport"><button className="primary" onClick={toggle} disabled={reduced}>{playing?"Ⅱ  Pause":"▶  Play"}</button><button onClick={replay} disabled={reduced}>↻ Replay</button>{[.5,1,2].map(s=><button key={s} onClick={()=>changeSpeed(s)} disabled={reduced} style={s===speed?{borderColor:"var(--red)",background:"var(--soft)",color:"var(--dark-red)"}:{}}>{s===1?"1":s<1?"½":"2"}×</button>)}</div>
        <div className="chapter-copy" aria-live="polite"><p>{String(active+1).padStart(2,"0")} / 06</p><h2>{chapter[3]}</h2><span>{chapter[4]}</span></div>
        <div className="timeline"><label htmlFor="progress">Timeline <span>{Math.round(progress)}%</span></label><input id="progress" type="range" min="0" max="100" step=".1" value={progress} onChange={e=>scrub(Number(e.target.value))} disabled={reduced}/><div className="chapter-buttons">{chapters.map((c,i)=><button key={c[0]} onClick={()=>go(i)} className={i===active?"active":""} disabled={reduced} aria-current={i===active?"step":undefined}><b>{String(i+1).padStart(2,"0")}</b>{c[0]}</button>)}</div></div>
      </div>
    </section>
    <footer><span>{reduced?"Reduced-motion mode: complete architecture shown.":"Keyboard: Space play/pause • ←/→ chapters • R replay"}</span><span>Editable SVG • GSAP timeline • No video encoding</span></footer>
  </main>;
}
