/* Snapmaker U1 Card — early preview, read-only. MIT License. */
const DEFAULTS = {
  printer_state: "sensor.printer_state_snapmaker_u1_despacho",
  print_state: "sensor.current_print_state_snapmaker_u1_despacho",
  active_tool: "sensor.active_tool_lava",
  progress: "sensor.progress_snapmaker_u1_despacho"
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
      .scene{margin:18px auto 8px;width:min(240px,80%);height:140px;position:relative;transition:filter .5s,opacity .5s}
      .scene.offline{filter:grayscale(1);opacity:.35}.printer{height:100%;border:9px solid #506779;border-radius:13px 13px 5px 5px;background:linear-gradient(140deg,#23394c,#0b1722);box-shadow:inset 0 0 0 4px #101b28,0 8px 24px #0008;position:relative}
      .printer:before{content:"";position:absolute;left:12%;right:12%;bottom:19%;height:8px;background:#738e9d;box-shadow:0 4px 9px #000}
      .printer:after{content:"U1";position:absolute;left:46%;top:20%;font-size:13px;background:#152533;padding:12px 5px 20px;border-radius:4px;box-shadow:0 0 12px #5da0ca55}
      .tools{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:16px}.tool{border:1px solid #304658;border-radius:12px;padding:12px 5px;display:flex;align-items:center;flex-direction:column;gap:5px;min-width:0}
      .tool.selected{border-color:#73b9e5;box-shadow:inset 0 0 16px #52baff15}.spool{height:48px;width:48px;border:8px solid var(--filament);border-radius:50%;box-shadow:0 0 0 3px #0b1621,inset 0 0 0 3px #0b1621;display:grid;place-items:center}
      .hub{width:13px;height:13px;border:3px solid #8da0b0;border-radius:50%}.feeding .spool{animation:spin 1.8s linear infinite}.feed{font-size:10px;color:var(--filament);animation:pulse 1s linear infinite;white-space:nowrap}
      .tool small{font-size:11px;color:#a7b8c8;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tool span{font-size:12px}.bar{height:7px;border-radius:8px;background:#304456;margin-top:18px;overflow:hidden}.bar>div{height:100%;background:#49b8fa;transition:width .4s}.foot{margin-top:8px;color:#b8c9d7;font-size:12px;display:flex;justify-content:space-between}
      @keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{opacity:.35}}
      @media(max-width:360px){ha-card{padding:12px}.spool{height:33px;width:33px}.tool{padding:9px 3px}}
    </style><ha-card><div class="top"><div class="title">SNAPMAKER U1</div><div class="status">${offline?"Sin conexión":printing?"Imprimiendo":paused?"En pausa":printer==="ready"?"Disponible":this.esc(printer)}</div></div><div class="scene ${offline?"offline":""}"><div class="printer"></div></div><div class="tools">${tools}</div><div class="bar"><div style="width:${progress}%"></div></div><div class="foot"><span>${this.esc(state)}</span><span>${progress.toFixed(0)}%</span></div></ha-card>`;
  }
}
if (!customElements.get("snapmaker-u1-card")) customElements.define("snapmaker-u1-card",SnapmakerU1Card);
window.customCards=window.customCards||[];
window.customCards.push({type:"snapmaker-u1-card",name:"Snapmaker U1 Card",description:"Read-only printer status and four Spoolman slots"});
