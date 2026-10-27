/* Snapmaker U1 Card — early preview, read-only. MIT License. */
const DEFAULTS = {
  printer_state: "sensor.printer_state_snapmaker_u1_despacho",
  print_state: "sensor.current_print_state_snapmaker_u1_despacho",
  active_tool: "sensor.active_tool_lava",
  progress: "sensor.progress_snapmaker_u1_despacho",
  current_layer: "sensor.current_layer_snapmaker_u1_despacho",
  total_layers: "sensor.total_layer_snapmaker_u1_despacho",
  time_left: "sensor.slicer_print_time_left_estimate_snapmaker_u1_despacho",
  bed_temperature: "sensor.bed_temperature_snapmaker_u1_despacho",
  chamber_temperature: "sensor.cavity_temp_snapmaker_u1_despacho",
  extruder1_temperature: "sensor.extruder1_temperature_snapmaker_u1_despacho",
  extruder2_temperature: "sensor.extruder2_temperature_snapmaker_u1_despacho",
  extruder3_temperature: "sensor.extruder3_temperature_snapmaker_u1_despacho",
  extruder4_temperature: "sensor.extruder4_temperature_snapmaker_u1_despacho"
};
class SnapmakerU1Card extends HTMLElement {
  setConfig(config) {
    this.config = { ...DEFAULTS, ...config };
    this.attachShadowOnce();
    this.render();
  }
  attachShadowOnce() { if (!this.shadowRoot) this.attachShadow({mode:"open"}); }
  set hass(hass) { this._hass = hass; if (this.config) this.render(); }
  getCardSize() { return 5; }
  static getStubConfig() { return {type:"custom:snapmaker-u1-card"}; }
  read(id) { return this._hass?.states?.[id]?.state ?? "unavailable"; }
  esc(value) { return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  render() {
    if (!this.shadowRoot || !this.config) return;
    const c=this.config, printer=this.read(c.printer_state), state=this.read(c.print_state);
    const offline=["unknown","unavailable"].includes(printer);
    const normalizedState=String(state).toLowerCase();
    const printing=!offline && normalizedState==="printing", paused=!offline && normalizedState==="paused";
    const rawActive=this.read(c.active_tool);
    const active=/^[0-3]$/.test(String(rawActive).trim())?Number(rawActive):null;
    const progress=Math.max(0,Math.min(100,Number(this.read(c.progress))||0));
    const metric=(id,suffix="")=>{const v=this.read(id);return ["unknown","unavailable","none",""].includes(String(v).toLowerCase())?"—":this.esc(v)+suffix;};
    const layer=(printing||paused)?metric(c.current_layer):"—", total=(printing||paused)?metric(c.total_layers):"—";
    const rawRemaining=this.read(c.time_left);
    const remaining=(!printing && !paused)?"—":(()=>{const n=Number(rawRemaining);if(!Number.isFinite(n)||n<0||["unknown","unavailable",""].includes(rawRemaining))return "—";const unit=this._hass?.states?.[c.time_left]?.attributes?.unit_of_measurement;const minutes=unit==="s"?Math.ceil(n/60):unit==="h"?Math.ceil(n*60):Math.ceil(n);return `${Math.floor(minutes/60)} h ${String(minutes%60).padStart(2,"0")} min`;})();
    const bed=metric(c.bed_temperature," °C"), chamber=metric(c.chamber_temperature," °C");
    const hotends=[1,2,3,4].map((i)=>`<div class="metric ${(printing||paused)&&active===i-1?"hot-active":""}"><label>Cabezal T${i-1}</label><b>${metric(c["extruder"+i+"_temperature"]," °C")}</b></div>`).join("");
    const spool=(i)=>{
      const color=this.read(c["tool"+i+"_color"]||"sensor.u1_t"+i+"_color_spoolman");
      const normalizedColor=String(color).trim();
      const safeColor=/^#?[0-9a-fA-F]{6}$/.test(normalizedColor)?(normalizedColor.startsWith("#")?normalizedColor:"#"+normalizedColor):"#808080";
      const rawWeight=this.read(c["tool"+i+"_weight"]||"sensor.u1_t"+i+"_peso_spoolman");
      const weight=Number(rawWeight);
      const grams=rawWeight!=="" && !["unknown","unavailable","none"].includes(String(rawWeight).toLowerCase()) && Number.isFinite(weight)?Math.round(weight)+" g":"—";
      const rawMaterial=this.read(c["tool"+i+"_material"]||"sensor.t"+i+"_filamento_display");
      const material=["unknown","unavailable","none"].includes(String(rawMaterial).toLowerCase())?"Sin asignar":this.esc(rawMaterial);
      
      const selected=!offline && active===i && (printing||paused);
      const feeding=printing && selected;
      return `<div class="tool ${selected?"selected":""} ${feeding?"feeding":""}" style="--filament:${safeColor}"><div class="spool-side"><div class="spool-rim"></div><div class="spool-winding"></div><div class="spool-rim rear"></div></div><small>${material}</small><span>${grams}</span></div>`;
    };
    const leftTools=spool(0)+spool(1),rightTools=spool(3)+spool(2);
    const headColors=[0,1,2,3].map(i=>{
      const value=this.read(c["tool"+i+"_color"]||"sensor.u1_t"+i+"_color_spoolman");
      const v=String(value).trim();return /^#?[0-9a-fA-F]{6}$/.test(v)?(v.startsWith("#")?v:"#"+v):"#808080";
    });
    const heads=headColors.map((color,i)=>{
      const highlighted=printing && active===i;
      return `<g class="head ${highlighted?"head-printing":""}" transform="translate(${105+i*52},29)" style="--head-color:${color}">
        <rect x="-18" y="-12" width="36" height="30" rx="5" fill="#111c27" stroke="${highlighted?color:"#667d90"}" stroke-width="2"/><rect x="-12" y="-7" width="24" height="6" rx="2" fill="#344655"/><rect x="-9" y="8" width="18" height="7" rx="2" fill="#263b4b"/><path d="M-14 -10 H14 M-14 16 H14" stroke="#91a5b2" stroke-width="1" opacity=".65"/><rect x="-15" y="-3" width="4" height="14" rx="1" fill="#455f71"/><rect x="11" y="-3" width="4" height="14" rx="1" fill="#455f71"/>
        <path d="M-6 18 H6 L3 25 H-3Z" fill="${highlighted?color:"#a4b4bf"}"/>
        <circle cx="0" cy="2" r="5" fill="${color}" stroke="#ffffff44" stroke-width="1"/>
      </g>`;
    }).join("");
    const routePoints=[
      [55,82,236,125],
      [55,252,291,125],
      [545,252,346,125],
      [545,82,401,125]
    ];
    const filamentRoute=(i)=>{
      const [sx,sy,ex]=routePoints[i];
      const entryY=99;
      const sideX=i<2?135:465;
      const laneY=[53,8,8,53][i];
      const approachX=ex+(i<2?-24:24);
      const startDirection=i<2?1:-1;
      return `M${sx} ${sy} C${sx+startDirection*55} ${sy},${sideX} ${laneY},${sideX+startDirection*18} ${laneY} S${approachX} ${laneY},${ex} ${laneY+15} Q${ex} ${laneY+24},${ex} ${entryY}`;
    };
    const filamentGuides=headColors.map((color,i)=>
      `<path d="${filamentRoute(i)}" fill="none" stroke="#0a1520" stroke-width="5" stroke-linecap="round"/><path d="${filamentRoute(i)}" fill="none" stroke="${color}" stroke-width="2.5" stroke-opacity=".85" stroke-linecap="round"/>`
    ).join("");
    const filamentPaths=headColors.map((color,i)=>{
      if(!printing || active!==i) return "";
      return `<path class="filament-track" d="${filamentRoute(i)}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>`;
    }).join("");
    this.shadowRoot.innerHTML=`<style>
      :host{display:block;color:#edf5ff;font-family:system-ui,sans-serif}
      ha-card{background:linear-gradient(145deg,#152536,#09111b);color:inherit;border:1px solid #31485c;border-radius:20px;padding:20px;overflow:hidden}
      .top{display:flex;align-items:center;justify-content:space-between;gap:12px}.title{font-size:18px;font-weight:750;letter-spacing:.08em}.status{font-size:12px;color:#a5b9c8}
      .scene{margin:12px auto 8px;width:min(360px,100%);height:auto;position:relative;transition:filter .5s,opacity .5s}.machine{display:block;width:100%;height:auto;filter:drop-shadow(0 8px 16px #0007)}
      .filament-track{stroke-dasharray:7 8;animation:filament-move 1.1s linear infinite;opacity:.9;filter:drop-shadow(0 0 3px #d1e8ff)}@keyframes filament-move{to{stroke-dashoffset:-30}}.head-printing{filter:drop-shadow(0 0 6px var(--head-color))}.scene.offline{filter:grayscale(1);opacity:.35}.printer{height:100%;border:9px solid #506779;border-radius:13px 13px 5px 5px;background:linear-gradient(140deg,#23394c,#0b1722);box-shadow:inset 0 0 0 4px #101b28,0 8px 24px #0008;position:relative}
      .printer:before{content:"";position:absolute;left:12%;right:12%;bottom:19%;height:8px;background:#738e9d;box-shadow:0 4px 9px #000}
      .printer:after{content:"U1";position:absolute;left:46%;top:20%;font-size:13px;background:#152533;padding:12px 5px 20px;border-radius:4px;box-shadow:0 0 12px #5da0ca55}
      .metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:10px}.metric{background:#142536;border:1px solid #304658;border-radius:10px;padding:6px 9px;min-height:0}.metric label{display:block;color:#9fb4c4;font-size:11px}.metric b{display:block;font-size:14px;margin-top:2px}
      .hot-active{border-color:#73b9e5;background:#1b3245}.scene-layout{position:relative;display:grid;grid-template-columns:minmax(68px,1fr) minmax(0,4.1fr) minmax(68px,1fr);gap:5px;align-items:center;margin-top:14px;isolation:isolate}.scene-layout .tools-side:first-child{margin-right:0;z-index:2}.scene-layout .tools-side:last-child{margin-left:0;z-index:2}.filament-overlay{position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none;overflow:visible}.scene-layout .scene{z-index:1;transform:scale(1.02);filter:drop-shadow(0 9px 10px #0008)}.tools-side{display:flex;flex-direction:column;gap:12px;min-width:0}.scene-layout .scene{width:100%;margin:0}.tool{border:0;border-radius:9px;padding:5px 1px;background:transparent;display:flex;align-items:center;flex-direction:column;gap:5px;min-width:0}
      .tool.selected{background:color-mix(in srgb,var(--filament) 12%,transparent);box-shadow:0 0 12px color-mix(in srgb,var(--filament) 30%,transparent)}.spool-side{position:relative;width:43px;height:78px;transform:perspective(160px) rotateY(-17deg);filter:drop-shadow(0 3px 5px #0008)}.tools-side:last-child .spool-side{transform:perspective(160px) rotateY(17deg)}.spool-winding{position:absolute;left:5px;right:5px;top:7px;bottom:7px;border-radius:8px;background:repeating-linear-gradient(0deg,color-mix(in srgb,var(--filament) 72%,#111) 0px,var(--filament) 3px,color-mix(in srgb,var(--filament) 60%,#000) 5px);box-shadow:inset 3px 0 5px #0007,inset -3px 0 4px #fff3}.spool-rim{position:absolute;z-index:2;left:0;top:1px;bottom:1px;width:6px;border-radius:45%;background:linear-gradient(90deg,#aeb7bc,#414b54);border:1px solid #8b979f}.spool-side:after{content:"";position:absolute;inset:12px 8px;border:1px solid #ffffff24;border-radius:4px;pointer-events:none}.spool-rim.rear{left:auto;right:0;background:linear-gradient(90deg,#48515a,#a4b0b8)}.feeding .spool-winding{animation:filament-flow 1.8s linear infinite}.feeding .spool-side{filter:drop-shadow(0 0 8px var(--filament))}@keyframes filament-flow{50%{filter:brightness(1.35);background-position:0 8px}}.tool small{font-size:10px;color:#a7b8c8;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tool span{font-size:11px}.bar{height:7px;border-radius:8px;background:#304456;margin-top:18px;overflow:hidden}.bar>div{height:100%;background:#49b8fa;transition:width .4s}.foot{margin-top:8px;color:#b8c9d7;font-size:12px;display:flex;justify-content:space-between}
      @media(prefers-reduced-motion:reduce){.feeding,.feeding .spool-winding,.filament-track{animation:none}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{opacity:.35}}
      @media(max-width:480px){ha-card{padding:12px}.scene-layout{grid-template-columns:minmax(57px,1fr) minmax(0,3.8fr) minmax(57px,1fr);gap:3px}.spool-side{width:28px;height:56px}.spool-winding{top:5px;bottom:5px}.tool{padding:6px 2px}.tool small{font-size:9px}.tool span{font-size:9px}}
    </style><ha-card><div class="top"><div class="title">SNAPMAKER U1</div><div class="status">${offline?"Sin conexión":printing?"Imprimiendo":paused?"En pausa":printer==="ready"?"Disponible":this.esc(printer)}</div></div><div class="scene-layout"><svg class="filament-overlay" viewBox="0 0 600 350" preserveAspectRatio="none" aria-hidden="true">${filamentGuides}${filamentPaths}</svg><div class="tools-side">${leftTools}</div><div class="scene ${offline?"offline":""}">
<svg class="machine" viewBox="0 -20 360 270" role="img" aria-label="Snapmaker U1, vista frontal estilizada">
<defs><linearGradient id="u1shell" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6c7984"/><stop offset=".5" stop-color="#303d49"/><stop offset="1" stop-color="#151f29"/></linearGradient><linearGradient id="u1glass" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#29485c" stop-opacity=".8"/><stop offset="1" stop-color="#09141e" stop-opacity=".9"/></linearGradient></defs>
<ellipse cx="181" cy="236" rx="160" ry="11" fill="#000" opacity=".42"/>
<path d="M30 47 L45 32 V215 L30 218Z" fill="#283847" stroke="#718a9c" stroke-width="1.5"/>
<path d="M329 32 L344 47 V216 L329 221Z" fill="#182733" stroke="#667c8d" stroke-width="1.5"/>
<path d="M48 219 H328 L311 238 H44Z" fill="#1d2c39" stroke="#7e94a2" stroke-width="1.5"/>
<path d="M57 35 L76 19 H300 L313 35Z" fill="#5a6b78" opacity=".55"/>
<path d="M46 31 L70 12 H312 L329 32 V221 L310 235 H45 L31 217 V46Z" fill="url(#u1shell)" stroke="#8b9aa6" stroke-width="2"/>
<path d="M50 42 L75 26 H300 L314 42 V203 H50Z" fill="#111b25" stroke="#738796" stroke-width="2"/>
<path d="M72 48 H294 V190 H72Z" fill="url(#u1glass)" stroke="#415767" stroke-width="2"/><path d="M76 53 H290 V186 H76Z" fill="none" stroke="#9cc0d0" stroke-opacity=".22" stroke-width="2"/><path d="M80 57 L97 57 L97 183" fill="none" stroke="#ffffff" stroke-opacity=".09" stroke-width="4"/>
<path d="M88 94 V144 M278 94 V144" stroke="#496579" stroke-width="3" opacity=".55"/><path d="M85 61 H281 M85 74 H281" stroke="#6b8799" stroke-width="3" opacity=".6"/><path d="M91 84 H275" stroke="#a8cad6" stroke-width="2" opacity=".25"/>
<path d="M91 166 L118 151 H265 L284 166 V184 H91Z" fill="#344a59" stroke="#81929d" stroke-width="2"/><path d="M118 151 L132 143 H252 L265 151Z" fill="#617c8d" stroke="#a4b8c3" stroke-width="1.5"/><path d="M131 146 H253" stroke="#d2e4ed" stroke-width="1" opacity=".65"/>
<path d="M117 155 H266" stroke="#b3bdc3" stroke-width="4"/>
<path d="M100 163 H276" stroke="#a6c5d7" stroke-width="1.5" opacity=".45"/>
<path d="M114 166 L132 176 H255 L271 166" fill="none" stroke="#162936" stroke-width="3"/>
<path d="M92 182 H281" stroke="#4d6777" stroke-width="3" opacity=".65"/>
<path d="M158 69 H206 V76 H158Z" fill="#263a49" stroke="#90a9b7" stroke-width="1.5"/><path d="M166 76 H198 V112 L190 121 H173 L166 112Z" fill="#758995" stroke="#b2c2ca" stroke-width="2"/><path d="M171 80 H193 V105 H171Z" fill="#95a8b2" opacity=".28"/><rect x="178" y="84" width="9" height="14" rx="2" fill="#283d4b"/><circle cx="182" cy="103" r="3" fill="#d3e1e9"/>
<path d="M177 122 L183 136 L189 122" fill="#e7a857"/>
<path d="M72 48 V190 M294 48 V190" stroke="#a5b6c2" stroke-width="5" opacity=".75"/>
<path d="M50 42 L72 26 M314 42 L299 26" stroke="#b4c0c8" stroke-width="4"/>
<path d="M31 217 H329" stroke="#9baab4" stroke-width="4"/>
<rect x="151" y="205" width="66" height="21" rx="5" fill="#0d1b27" stroke="#526d80"/>
<text x="184" y="220" text-anchor="middle" fill="#d8e8f3" font-size="13" font-family="system-ui" font-weight="700">U1</text>
<g opacity=".8"><rect x="72" y="17" width="40" height="7" rx="2" fill="#283c49"/><rect x="121" y="17" width="40" height="7" rx="2" fill="#283c49"/><rect x="171" y="17" width="40" height="7" rx="2" fill="#283c49"/><rect x="221" y="17" width="40" height="7" rx="2" fill="#283c49"/></g>
<path d="M102 47 C107 62 105 70 112 78 M154 47 C158 58 157 64 162 72 M206 47 C211 59 211 65 216 72 M258 47 C265 61 268 66 270 78" fill="none" stroke="#647d8e" stroke-width="2" stroke-dasharray="3 4" opacity=".5"/><path d="M99 52 L130 52 M245 52 L275 52" stroke="#b3d6ec" opacity=".3" stroke-width="2"/>
${heads}
</svg></div><div class="tools-side">${rightTools}</div></div><div class="metrics"><div class="metric"><label>Capa</label><b>${layer} / ${total}</b></div><div class="metric"><label>Tiempo restante</label><b>${remaining}</b></div><div class="metric"><label>Cama</label><b>${bed}</b></div><div class="metric"><label>Cámara</label><b>${chamber}</b></div></div><div class="metrics">${hotends}</div><div class="bar"><div style="width:${progress}%"></div></div><div class="foot"><span>${(normalizedState==="standby"?"En espera":normalizedState==="ready"?"Disponible":this.esc(state))}</span><span>${progress.toFixed(0)}%</span></div></ha-card>`;
  }
}
if (!customElements.get("snapmaker-u1-card")) customElements.define("snapmaker-u1-card",SnapmakerU1Card);
window.customCards=window.customCards||[];
window.customCards.push({type:"snapmaker-u1-card",name:"Snapmaker U1 Card",description:"Read-only printer status and four Spoolman slots"});
