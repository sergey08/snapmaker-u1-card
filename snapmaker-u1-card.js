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
    const printing=!offline && state==="printing", paused=!offline && state==="paused";
    const active=Number(this.read(c.active_tool));
    const progress=Math.max(0,Math.min(100,Number(this.read(c.progress))||0));
    const metric=(id,suffix="")=>{const v=this.read(id);return ["unknown","unavailable","none",""].includes(String(v).toLowerCase())?"—":this.esc(v)+suffix;};
    const layer=(printing||paused)?metric(c.current_layer):"—", total=(printing||paused)?metric(c.total_layers):"—";
    const rawRemaining=this.read(c.time_left);
    const remaining=(!printing && !paused)?"—":(()=>{const n=Number(rawRemaining);if(!Number.isFinite(n)||n<0||["unknown","unavailable",""].includes(rawRemaining))return "—";const unit=this._hass?.states?.[c.time_left]?.attributes?.unit_of_measurement;const minutes=unit==="s"?Math.ceil(n/60):unit==="h"?Math.ceil(n*60):Math.ceil(n);return `${Math.floor(minutes/60)} h ${String(minutes%60).padStart(2,"0")} min`;})();
    const bed=metric(c.bed_temperature," °C"), chamber=metric(c.chamber_temperature," °C");
    const hotends=[1,2,3,4].map((i)=>`<div class="metric ${active===i-1?"hot-active":""}"><label>Cabezal T${i-1}</label><b>${metric(c["extruder"+i+"_temperature"]," °C")}</b></div>`).join("");
    const tools=[0,1,2,3].map(i=>{
      const prefix=c["tool"+i+"_"]||"";
      const color=this.read(c["tool"+i+"_color"]||"sensor.u1_t"+i+"_color_spoolman");
      const safeColor=/^#[0-9a-fA-F]{6}$/.test(color)?color:"#808080";
      const weight=this.read(c["tool"+i+"_weight"]||"sensor.u1_t"+i+"_peso_spoolman");
      const material=this.read(c["tool"+i+"_material"]||"sensor.t"+i+"_filamento_display");
      const inUse=this.read(c["tool"+i+"_in_use"]||"binary_sensor.slot_"+i+"_in_use_lava")==="on";
      const animate=printing && active===i && inUse;
      const selected=!offline && active===i;
      return `<div class="tool ${selected?"selected":""} ${animate?"feeding":""}" style="--filament:${safeColor}"><div class="spool"><div class="hub"></div></div><strong>T${i}</strong><small>${this.esc(material)}</small><span>${Number.isFinite(Number(weight))?Math.round(Number(weight))+" g":"—"}</span>${animate?'<div class="feed">● ● ● ● ●</div>':""}</div>`;
    }).join("");
    this.shadowRoot.innerHTML=`<style>
      :host{display:block;color:#edf5ff;font-family:system-ui,sans-serif}
      ha-card{background:linear-gradient(145deg,#152536,#09111b);color:inherit;border:1px solid #31485c;border-radius:20px;padding:20px;overflow:hidden}
      .top{display:flex;align-items:center;justify-content:space-between;gap:12px}.title{font-size:18px;font-weight:750;letter-spacing:.08em}.status{font-size:12px;color:#a5b9c8}
      .scene{margin:12px auto 8px;width:min(360px,100%);height:auto;position:relative;transition:filter .5s,opacity .5s}.machine{display:block;width:100%;height:auto;filter:drop-shadow(0 8px 16px #0007)}
      .scene.offline{filter:grayscale(1);opacity:.35}.printer{height:100%;border:9px solid #506779;border-radius:13px 13px 5px 5px;background:linear-gradient(140deg,#23394c,#0b1722);box-shadow:inset 0 0 0 4px #101b28,0 8px 24px #0008;position:relative}
      .printer:before{content:"";position:absolute;left:12%;right:12%;bottom:19%;height:8px;background:#738e9d;box-shadow:0 4px 9px #000}
      .printer:after{content:"U1";position:absolute;left:46%;top:20%;font-size:13px;background:#152533;padding:12px 5px 20px;border-radius:4px;box-shadow:0 0 12px #5da0ca55}
      .metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:14px}.metric{background:#142536;border:1px solid #304658;border-radius:10px;padding:9px}.metric label{display:block;color:#9fb4c4;font-size:11px}.metric b{display:block;font-size:14px;margin-top:3px}
      .hot-active{border-color:#73b9e5;background:#1b3245}.tools{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:16px}.tool{border:1px solid #304658;border-radius:12px;padding:12px 5px;display:flex;align-items:center;flex-direction:column;gap:5px;min-width:0}
      .tool.selected{border-color:#73b9e5;box-shadow:inset 0 0 16px #52baff15}.spool{height:48px;width:48px;border:8px solid var(--filament);border-radius:50%;box-shadow:0 0 0 3px #0b1621,inset 0 0 0 3px #0b1621;display:grid;place-items:center}
      .hub{width:13px;height:13px;border:3px solid #8da0b0;border-radius:50%}.feeding .spool{animation:spin 1.8s linear infinite}.feed{font-size:10px;color:var(--filament);animation:pulse 1s linear infinite;white-space:nowrap}
      .tool small{font-size:11px;color:#a7b8c8;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tool span{font-size:12px}.bar{height:7px;border-radius:8px;background:#304456;margin-top:18px;overflow:hidden}.bar>div{height:100%;background:#49b8fa;transition:width .4s}.foot{margin-top:8px;color:#b8c9d7;font-size:12px;display:flex;justify-content:space-between}
      @keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{opacity:.35}}
      @media(max-width:360px){ha-card{padding:12px}.spool{height:33px;width:33px}.tool{padding:9px 3px}}
    </style><ha-card><div class="top"><div class="title">SNAPMAKER U1</div><div class="status">${offline?"Sin conexión":printing?"Imprimiendo":paused?"En pausa":printer==="ready"?"Disponible":this.esc(printer)}</div></div><div class="scene ${offline?"offline":""}">
<svg class="machine" viewBox="0 0 360 250" role="img" aria-label="Snapmaker U1, vista frontal estilizada">
<defs><linearGradient id="u1shell" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6c7984"/><stop offset=".5" stop-color="#303d49"/><stop offset="1" stop-color="#151f29"/></linearGradient><linearGradient id="u1glass" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#29485c" stop-opacity=".8"/><stop offset="1" stop-color="#09141e" stop-opacity=".9"/></linearGradient></defs>
<ellipse cx="181" cy="233" rx="155" ry="11" fill="#000" opacity=".35"/>
<path d="M46 31 L70 12 H312 L329 32 V221 L310 235 H45 L31 217 V46Z" fill="url(#u1shell)" stroke="#8b9aa6" stroke-width="2"/>
<path d="M50 42 L75 26 H300 L314 42 V203 H50Z" fill="#111b25" stroke="#738796" stroke-width="2"/>
<path d="M72 48 H294 V190 H72Z" fill="url(#u1glass)" stroke="#415767" stroke-width="2"/>
<path d="M85 61 H281 M85 74 H281" stroke="#6b8799" stroke-width="3" opacity=".6"/>
<path d="M91 166 L118 151 H265 L284 166 V184 H91Z" fill="#344a59" stroke="#81929d" stroke-width="2"/>
<path d="M117 155 H266" stroke="#b3bdc3" stroke-width="4"/>
<path d="M166 71 H198 V112 L190 121 H173 L166 112Z" fill="#758995" stroke="#b2c2ca" stroke-width="2"/>
<path d="M177 122 L183 136 L189 122" fill="#e7a857"/>
<path d="M72 48 V190 M294 48 V190" stroke="#a5b6c2" stroke-width="5" opacity=".75"/>
<path d="M50 42 L72 26 M314 42 L299 26" stroke="#b4c0c8" stroke-width="4"/>
<path d="M31 217 H329" stroke="#9baab4" stroke-width="4"/>
<rect x="151" y="205" width="66" height="21" rx="5" fill="#0d1b27" stroke="#526d80"/>
<text x="184" y="220" text-anchor="middle" fill="#d8e8f3" font-size="13" font-family="system-ui" font-weight="700">U1</text>
<g opacity=".8"><rect x="72" y="17" width="40" height="7" rx="2" fill="#283c49"/><rect x="121" y="17" width="40" height="7" rx="2" fill="#283c49"/><rect x="171" y="17" width="40" height="7" rx="2" fill="#283c49"/><rect x="221" y="17" width="40" height="7" rx="2" fill="#283c49"/></g>
<path d="M99 52 L130 52 M245 52 L275 52" stroke="#b3d6ec" opacity=".3" stroke-width="2"/>
</svg></div><div class="metrics"><div class="metric"><label>Capa</label><b>${layer} / ${total}</b></div><div class="metric"><label>Tiempo restante</label><b>${remaining}</b></div><div class="metric"><label>Cama</label><b>${bed}</b></div><div class="metric"><label>Cámara</label><b>${chamber}</b></div></div><div class="metrics">${hotends}</div><div class="tools">${tools}</div><div class="bar"><div style="width:${progress}%"></div></div><div class="foot"><span>${this.esc(state)}</span><span>${progress.toFixed(0)}%</span></div></ha-card>`;
  }
}
if (!customElements.get("snapmaker-u1-card")) customElements.define("snapmaker-u1-card",SnapmakerU1Card);
window.customCards=window.customCards||[];
window.customCards.push({type:"snapmaker-u1-card",name:"Snapmaker U1 Card",description:"Read-only printer status and four Spoolman slots"});
