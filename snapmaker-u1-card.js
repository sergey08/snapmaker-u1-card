/* Snapmaker U1 Card — early preview, read-only. MIT License. */
const DEFAULTS = {};
class SnapmakerU1Card extends HTMLElement {
  setConfig(config) {
    this.config = { ...DEFAULTS, ...config };
    this._previewOpen=undefined;
    this._cameraOpen=undefined;
    this.attachShadowOnce();
    this.render();
  }
  attachShadowOnce() { if (!this.shadowRoot) this.attachShadow({mode:"open"}); }
  set hass(hass) {
    this._hass=hass;
    if(!this.config)return;
    const c=this.config;
    const ids=new Set(Object.values(c).filter(v=>typeof v==="string"&&/^(sensor|binary_sensor|camera|button|switch|number|input_boolean)\./.test(v)));
    if(c.show_spoolman_inventory===true)for(const id of Object.keys(hass.states))if(/^sensor\.spoolman_spool_\d+(?:_color_hex|_filament_name|_vendor)?$/.test(id))ids.add(id);
    const changed=!this._lastHass||[...ids].some(id=>this._lastHass.states?.[id]!==hass.states?.[id]);
    this._lastHass=hass;
    if(changed)this.render();
  }
  getCardSize() { return 5; }
  static getStubConfig() { return {type:"custom:snapmaker-u1-card"}; }
  static getConfigElement() { return document.createElement("snapmaker-u1-card-editor"); }
  read(id) { return this._hass?.states?.[id]?.state ?? "unavailable"; }
  esc(value) { return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  render() {
    if (!this.shadowRoot || !this.config) return;
    const existingInventory=this.shadowRoot.querySelector("details.inventory");
    if(existingInventory) this._inventoryOpen=existingInventory.open;
    const existingPreview=this.shadowRoot.querySelector("details.preview-panel");
    if(existingPreview) this._previewOpen=existingPreview.open;
    const existingCamera=this.shadowRoot.querySelector("details.camera-panel");
    if(existingCamera) this._cameraOpen=existingCamera.open;
    if(this._previewOpen===undefined)this._previewOpen=this.config.preview_open_default===true;
    if(this._cameraOpen===undefined)this._cameraOpen=this.config.camera_open_default===true;
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
    const plannedTools=[0,1,2,3].map(i=>{
      const raw=this.read(c["tool"+i+"_job_estimated"]);
      return (printing||paused) && Number.isFinite(Number(raw)) && Number(raw)>0;
    });

    const spoolCacheKey="snapmaker-u1-card-spools-v1";
    let saved={};
    try { saved=JSON.parse(localStorage.getItem(spoolCacheKey)||"{}")||{}; } catch(e) {}
    const valid=(v)=>!["unknown","unavailable","none","null",""].includes(String(v).trim().toLowerCase());
    const slotPresent=[0,1,2,3].map(i=>{const v=this.read(c["tool"+i+"_present"]);return v==="on"?true:v==="off"?false:null;});
    const spoolData=[0,1,2,3].map(i=>{
      const color=this.read(c["tool"+i+"_color"]);
      const weight=this.read(c["tool"+i+"_weight"]);
      const material=this.read(c["tool"+i+"_material"]);
      if(!offline && slotPresent[i]===false){delete saved[i];return {color:"#FFFFFF",weight:"",material:"",empty:true};}
      const fresh=!offline && valid(material) && String(material).toLowerCase()!=="libre" && /^#?[0-9a-fA-F]{6}$/.test(String(color).trim()) && valid(weight) && Number(weight)>0;
      if(fresh) saved[i]={color,weight,material};
      if(fresh) return {color,weight,material};
      if(saved[i]) return saved[i];
      const spoolIds=Array.isArray(c.spoolman_spool_ids)?c.spoolman_spool_ids:[];
      const spoolId=Number(spoolIds[i]);
      if(!Number.isInteger(spoolId)||spoolId<=0) return {color:"#FFFFFF",weight:"",material:""};
      const fallbackColor=this.read("sensor.spoolman_spool_"+spoolId+"_color_hex");
      const fallbackWeight=this.read("sensor.spoolman_spool_"+spoolId);
      const fallbackName=this.read("sensor.spoolman_spool_"+spoolId+"_filament_name");
      if(/^#?[0-9a-fA-F]{6}$/.test(String(fallbackColor).trim()) && Number(fallbackWeight)>0 && valid(fallbackName)){
        return {color:fallbackColor,weight:fallbackWeight,material:String(fallbackName).split(" ")[0]};
      }
      return {color:"#FFFFFF",weight:"",material:""};
    });
    if(!offline) { try {localStorage.setItem(spoolCacheKey,JSON.stringify(saved));}catch(e){} }
    const spool=(i)=>{
      if(spoolData[i].empty)return `<div class="tool empty"><div class="empty-slot">T${i}<small>Libre</small></div></div>`;
      const color=spoolData[i].color;
      const normalizedColor=String(color).trim();
      const safeColor=/^#?[0-9a-fA-F]{6}$/.test(normalizedColor)?(normalizedColor.startsWith("#")?normalizedColor:"#"+normalizedColor):"#808080";
      const rawWeight=spoolData[i].weight;
      const weight=Number(rawWeight);
      const grams=rawWeight!=="" && !["unknown","unavailable","none"].includes(String(rawWeight).toLowerCase()) && Number.isFinite(weight)?Math.round(weight)+" g":"—";
      const rawMaterial=spoolData[i].material;
      const material=!valid(rawMaterial)?"":this.esc(rawMaterial);
      
      const selected=!offline && active===i && (printing||paused);
      const feeding=printing && selected;
      const planned=plannedTools[i] || selected;
      return `<div class="tool ${selected?"selected":""} ${feeding?"feeding":""} ${planned?"planned":""}" style="--filament:${safeColor}"><div class="spool-side"><div class="spool-rim"></div><div class="spool-winding"></div><div class="spool-rim rear"></div></div><small>${material}</small><span>${grams}</span>${planned?`<em class="tool-planned">${selected?"Imprimiendo":"En este trabajo"}</em>`:""}</div>`;
    };
    const leftTools=spool(0)+spool(1),rightTools=spool(2)+spool(3);
    const headColors=[0,1,2,3].map(i=>{
      const value=spoolData[i].color;
      const v=String(value).trim();return /^#?[0-9a-fA-F]{6}$/.test(v)?(v.startsWith("#")?v:"#"+v):"#808080";
    });
    const heads=headColors.map((color,i)=>{
      const highlighted=printing && active===i;
      const planned=plannedTools[i] || ((printing||paused) && active===i);
      const temp=metric(c["extruder"+(i+1)+"_temperature"]," °C");
      return `<g class="head ${highlighted?"head-printing":""} ${planned?"head-planned":""}" transform="translate(${105+i*52},29)" style="--head-color:${color}">
        <text x="0" y="-20" text-anchor="middle" font-size="10" font-weight="700" fill="${highlighted?color:"#e3eff7"}">${this.esc(temp)}</text><rect x="-18" y="-12" width="36" height="30" rx="5" fill="#111c27" stroke="${planned?color:"#667d90"}" stroke-width="2"/><rect x="-12" y="-7" width="24" height="6" rx="2" fill="#344655"/><rect x="-9" y="8" width="18" height="7" rx="2" fill="#263b4b"/><path d="M-14 -10 H14 M-14 16 H14" stroke="#91a5b2" stroke-width="1" opacity=".65"/><rect x="-15" y="-3" width="4" height="14" rx="1" fill="#455f71"/><rect x="11" y="-3" width="4" height="14" rx="1" fill="#455f71"/>
        <path d="M-6 18 H6 L3 25 H-3Z" fill="${highlighted?color:"#a4b4bf"}"/>
        <circle cx="0" cy="2" r="5" fill="${color}" stroke="#ffffff44" stroke-width="1"/>
      </g>`;
    }).join("");
    const routePoints=[
      [55,82,236,125],
      [55,252,291,125],
      [545,82,346,125],
      [545,252,401,125]
    ];
    const filamentRoute=(i)=>{
      const [sx,sy,ex]=routePoints[i];
      // Two smooth, parallel lanes on each side; all four tubes
      // approach their head vertically, above the temperature label.
      const left=i<2, sign=left?1:-1;
      const laneY=(i===0||i===2)?2:-14;
      const edgeX=left?138:462;
      const entryY=63; // clear gap above the hotend temperature labels
      const bendX=ex-sign*12;
      return `M${sx} ${sy} C${sx+sign*32} ${sy},${edgeX-sign*28} ${laneY},${edgeX} ${laneY} L${bendX} ${laneY} Q${ex} ${laneY},${ex} ${laneY+12} L${ex} ${entryY}`;
    };
    const filamentGuides=headColors.map((color,i)=>
      spoolData[i].empty?"":`<path d="${filamentRoute(i)}" fill="none" stroke="#0a1520" stroke-width="5" stroke-linecap="round"/><path d="${filamentRoute(i)}" fill="none" stroke="${color}" stroke-width="2.5" stroke-opacity=".85" stroke-linecap="round"/>`
    ).join("");
    const filamentPaths=headColors.map((color,i)=>{
      if(!printing || active!==i || spoolData[i].empty) return "";
      return `<path class="filament-track" d="${filamentRoute(i)}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>`;
    }).join("");
    const controls=[
      {key:"pause",label:"Pausar",icon:"⏸",entity:c.pause_button,enabled:printing},
      {key:"resume",label:"Reanudar",icon:"▶",entity:c.resume_button,enabled:paused},
      {key:"cancel",label:"Parar",icon:"■",entity:c.cancel_button,enabled:printing||paused},
      {key:"emergency",label:"Emergencia",icon:"!",entity:c.emergency_button,enabled:!offline}
    ];
    const controlsHtml=`<div class="printer-controls">${controls.map(item=>`<button type="button" class="printer-action ${item.key}" data-action="${item.key}" ${!item.enabled||this.read(item.entity)==="unavailable"?"disabled":""} title="${item.label}"><span>${item.icon}</span>${item.label}</button>`).join("")}</div>`;
    const showInventory=c.show_spoolman_inventory===true;
    const inventory=showInventory?Object.keys(this._hass?.states||{})
      .map(id=>/^sensor\.spoolman_spool_(\d+)$/.exec(id))
      .filter(Boolean)
      .map(match=>{
        const id=Number(match[1]),prefix="sensor.spoolman_spool_"+id;
        const rawColor=this.read(prefix+"_color_hex");
        const color=/^#?[0-9a-fA-F]{6}$/.test(String(rawColor).trim())?(String(rawColor).startsWith("#")?rawColor:"#"+rawColor):"#d6dbe1";
        const name=this.read(prefix+"_filament_name");
        const grams=this.read(prefix);
        const vendor=this.read(prefix+"_vendor");
        return {id,color,name:valid(name)?String(name):"Filamento",grams:Number(grams),vendor:valid(vendor)?String(vendor):""};
      }).filter(item=>Number.isFinite(item.grams)&&item.grams>=0).sort((a,b)=>a.name.localeCompare(b.name,"es")):[];
    const fileName=this.read(c.filename);
    const jobName=valid(fileName)?String(fileName).split("/").pop():"";
    const picture=(id)=>{const state=this._hass?.states?.[id];const path=state?.attributes?.entity_picture;return state&&!["unknown","unavailable"].includes(state.state)&&typeof path==="string"&&path.startsWith("/api/camera_proxy/")?path:"";};
    const thumbUrl=picture(c.thumbnail_camera);
    const cameraUrl=picture(c.live_camera);
    const rawEta=this.read(c.print_eta);
    let eta="—";
    if(printing||paused){const date=Date.parse(rawEta);if(valid(rawEta)&&Number.isFinite(date))eta=new Intl.DateTimeFormat("es-ES",{hour:"2-digit",minute:"2-digit"}).format(new Date(date));else if(printing&&Number.isFinite(Number(rawRemaining))&&Number(rawRemaining)>0){const unit=this._hass?.states?.[c.time_left]?.attributes?.unit_of_measurement;const mins=unit==="s"?Number(rawRemaining)/60:unit==="h"?Number(rawRemaining)*60:Number(rawRemaining);eta=new Intl.DateTimeFormat("es-ES",{hour:"2-digit",minute:"2-digit"}).format(new Date(Date.now()+mins*60000));}}
    const exception=this._hass?.states?.[c.exception_sensor];
    const exceptionText=exception?.attributes?.exceptions;
    const warnings=[];
    if(exception?.state==="on")warnings.push(Array.isArray(exceptionText)&&exceptionText.length?exceptionText.map(x=>typeof x==="string"?x:JSON.stringify(x)).join("; "):"La impresora comunica una incidencia");
    if(printing||paused){for(let i=0;i<4;i++)if(slotPresent[i]===false&&(plannedTools[i]||active===i))warnings.push("T"+i+": falta filamento");}
    const required=[0,1,2,3].map(i=>{const v=this.read(c["tool"+i+"_job_estimated"]);const n=Number(v);return valid(v)&&Number.isFinite(n)&&n>0?n:null;});
    const marginRaw=Number(c.filament_safety_margin??0);
    const filamentMargin=Number.isFinite(marginRaw)?Math.max(0,Math.min(100,marginRaw)):0;
    const filamentCheck=(printing||paused)?required.map((need,i)=>{if(need===null)return null;const raw=spoolData[i].weight;const available=raw!==null&&raw!==undefined&&String(raw).trim()!==""&&valid(raw)&&Number.isFinite(Number(raw))?Number(raw):null;const needed=need*(1+filamentMargin/100);if(available===null||spoolData[i].empty)return {i,need,needed,available:null,low:false,unknown:true};return {i,need,needed,available,low:available<needed,unknown:false};}).filter(Boolean):[];
    for(const f of filamentCheck)if(f.low)warnings.push("T"+f.i+": filamento insuficiente ("+Math.round(f.available)+" g / "+Math.round(f.needed)+" g con margen)");
    const powerRaw=this.read(c.power_sensor);
    const power=valid(powerRaw)&&Number.isFinite(Number(powerRaw))?Number(powerRaw):null;
    const energyRaw=this.read(c.energy_sensor);
    const energy=valid(energyRaw)&&Number.isFinite(Number(energyRaw))?Number(energyRaw):null;
    const priceMode=c.electricity_price_mode||"sensor";
    const priceRaw=priceMode==="fixed"?c.electricity_price:this.read(c.electricity_price_sensor);
    const price=priceRaw!==null&&priceRaw!==undefined&&String(priceRaw).trim()!==""&&valid(priceRaw)&&Number.isFinite(Number(priceRaw))&&Number(priceRaw)>=0?Number(priceRaw):null;
    if(printing&&!this._jobTracking)this._jobTracking={energyStart:energy,lastEnergy:energy,lastPrice:price,cost:0};
    if(this._jobTracking&&energy!==null){
      const t=this._jobTracking;
      if(t.lastEnergy!==null&&energy>=t.lastEnergy&&t.lastPrice!==null)t.cost+=(energy-t.lastEnergy)*t.lastPrice;
      t.lastEnergy=energy;t.lastPrice=price;
    }
    if(!printing&&!paused)this._jobTracking=null;
    const energyUsed=this._jobTracking&&energy!==null&&this._jobTracking.energyStart!==null?Math.max(0,energy-this._jobTracking.energyStart):null;
    const jobCost=this._jobTracking&&price!==null?this._jobTracking.cost:null;
    const electricityHtml=c.show_energy!==false?`<div class="electricity"><span>⚡ Potencia: <b>${power===null?"—":Math.round(power)+" W"}</b></span><span>Trabajo: <b>${energyUsed===null?"—":energyUsed.toFixed(2)+" kWh"}</b></span><span>Coste: <b>${jobCost===null?"—":jobCost.toFixed(2)+" €"}</b></span></div>`:"";
    const filamentHtml=filamentCheck.length?`<div class="filament-check">${filamentCheck.map(f=>`<span class="${f.unknown?"unknown":f.low?"low":"ok"}">T${f.i}: ${f.available===null?"sin lectura":Math.round(f.available)+" g"} / ${Math.round(f.needed)} g ${f.unknown?"?":f.low?"⚠":"✓"}</span>`).join("")}</div>`:"";
    const warningsHtml=warnings.length?`<div class="printer-warnings" role="alert">⚠ ${warnings.map(w=>this.esc(w)).join(" · ")}</div>`:"";
    const jobHtml=(printing||paused)&&jobName?`<div class="job-summary">${thumbUrl?`<img src="${this.esc(thumbUrl)}" alt="Vista previa de la pieza" loading="lazy">`:""}<div><small>Trabajo actual</small><strong title="${this.esc(jobName)}">${this.esc(jobName)}</strong><span>Finalización estimada: ${eta}</span></div></div>`:"";
    const previewHtml=c.show_preview!==false?`<details class="preview-panel" ${this._previewOpen?"open":""}><summary>🖼 Vista previa de la pieza</summary><div class="preview-body">${thumbUrl?`<img src="${this.esc(thumbUrl)}" alt="Miniatura del trabajo" loading="lazy">`:`<span>Miniatura no disponible</span>`}${jobName?`<strong>${this.esc(jobName)}</strong>`:""}${(printing||paused)?`<small>Finalización estimada: ${eta}</small>`:""}</div></details>`:"";
    const cameraHtml=c.show_camera!==false&&cameraUrl?`<details class="camera-panel" ${this._cameraOpen?"open":""}><summary>📷 Cámara de la impresora</summary><img class="camera-image" src="${this.esc(cameraUrl)}" alt="Cámara Snapmaker U1" loading="lazy"></details>`:"";
    const inventoryHtml=showInventory&&inventory.length?`<details class="inventory" ${this._inventoryOpen?"open":""}><summary>Inventario Spoolman <span>${inventory.length} bobinas</span></summary><div class="inventory-grid">${inventory.map(item=>`<div class="inventory-item"><span class="inventory-reel" style="--filament:${item.color}"></span><div class="inventory-info"><b>${this.esc(item.name)}</b><small>${this.esc(item.vendor)}</small><strong>${Math.round(item.grams)} g</strong></div></div>`).join("")}</div></details>`:"";
    this.shadowRoot.innerHTML=`<style>
      :host{display:block;color:#edf5ff;font-family:system-ui,sans-serif}
      ha-card{background:linear-gradient(145deg,#152536,#09111b);color:inherit;border:1px solid #31485c;border-radius:20px;padding:20px;overflow:hidden}
      .inventory{margin-top:16px;border:1px solid #334a5b;border-radius:12px;padding:10px 12px;background:#0c1a27}.inventory summary{cursor:pointer;font-size:13px;font-weight:700;display:flex;justify-content:space-between;align-items:center}.inventory summary span{color:#91afc1;font-size:11px}.inventory-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:9px;margin-top:12px}.inventory-item{display:flex;align-items:center;gap:10px;padding:9px;background:#172a3a;border-radius:10px;min-width:0}.inventory-reel{width:34px;height:34px;flex:none;border-radius:50%;background:radial-gradient(circle at center,#152535 0 20%,#7c8790 22% 29%,var(--filament) 31% 70%,#647584 72% 78%,#1b2b38 80%);box-shadow:0 2px 8px #0007}.inventory-info{display:flex;flex-direction:column;min-width:0;gap:2px}.inventory-info b{font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.inventory-info small{font-size:10px;color:#9cb2c2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.inventory-info strong{font-size:11px;color:#d7e8f3}
      .electricity{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;font-size:11px}.electricity span{background:#162c3e;border:1px solid #33495c;border-radius:8px;padding:8px}.filament-check{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;font-size:11px}.filament-check span{padding:6px 8px;border-radius:7px;background:#193b30}.filament-check .low{background:#603223;color:#ffe3bf}.compact .scene{max-width:270px}.compact .metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.compact .metric{padding:7px}.compact .inventory,.compact .camera-panel,.compact .preview-panel{margin-top:7px}
      .preview-panel{margin-top:10px;border:1px solid #344b5e;border-radius:10px;padding:10px;background:#102131}.preview-panel summary{cursor:pointer;font-size:12px;font-weight:650}.preview-body{display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 4px;color:#b5c7d8;font-size:12px}.preview-body img{width:100%;max-height:260px;object-fit:contain;border-radius:8px;background:#06121b}.preview-body strong{max-width:100%;overflow-wrap:anywhere}.preview-body small{color:#a7bece}
      .empty-slot{width:43px;height:78px;border:1px dashed #516778;border-radius:9px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#8ba3b6;font-size:13px}.empty-slot small{font-size:10px}.printer-warnings{margin-top:10px;padding:10px;border:1px solid #d48b50;border-radius:10px;background:#4b2b20;color:#ffe1c1;font-size:12px}.job-summary{display:flex;align-items:center;gap:10px;margin-top:10px;padding:9px;border:1px solid #304658;border-radius:10px;background:#132536;min-width:0}.job-summary img{width:70px;height:70px;object-fit:contain;border-radius:7px;background:#081522}.job-summary>div{display:flex;flex-direction:column;gap:4px;min-width:0}.job-summary small,.job-summary span{font-size:11px;color:#a7bece}.job-summary strong{font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.camera-panel{margin-top:10px;border:1px solid #344b5e;border-radius:10px;padding:10px;background:#102131}.camera-panel summary{cursor:pointer;font-size:12px;font-weight:650}.camera-image{width:100%;height:auto;max-height:300px;object-fit:contain;margin-top:10px;border-radius:8px;background:#06121b}
      .top{display:flex;align-items:center;justify-content:space-between;gap:12px}.title{font-size:18px;font-weight:750;letter-spacing:.08em}.status{font-size:12px;color:#a5b9c8}
      .scene{margin:12px auto 8px;width:min(360px,100%);height:auto;position:relative;transition:filter .5s,opacity .5s}.machine{display:block;width:100%;height:auto;filter:drop-shadow(0 8px 16px #0007)}
      .print-carriage{transform-origin:center;will-change:transform}.print-carriage.moving{animation:carriage-sweep 3.2s ease-in-out infinite}@keyframes carriage-sweep{0%,100%{transform:translateX(0)}25%{transform:translateX(73px)}50%{transform:translateX(0)}75%{transform:translateX(-73px)}}.filament-track{stroke-dasharray:7 8;animation:filament-move 1.1s linear infinite;opacity:.9;filter:drop-shadow(0 0 3px #d1e8ff)}@keyframes filament-move{to{stroke-dashoffset:-30}}.head-planned:not(.head-printing){filter:drop-shadow(0 0 2px var(--head-color))}.head-printing{filter:drop-shadow(0 0 6px var(--head-color))}.scene.offline{opacity:.55}.scene-layout.offline .tool{opacity:.55}.scene-layout.offline .filament-overlay{opacity:.5}.printer{height:100%;border:9px solid #506779;border-radius:13px 13px 5px 5px;background:linear-gradient(140deg,#23394c,#0b1722);box-shadow:inset 0 0 0 4px #101b28,0 8px 24px #0008;position:relative}
      .printer:before{content:"";position:absolute;left:12%;right:12%;bottom:19%;height:8px;background:#738e9d;box-shadow:0 4px 9px #000}
      .printer:after{content:"U1";position:absolute;left:46%;top:20%;font-size:13px;background:#152533;padding:12px 5px 20px;border-radius:4px;box-shadow:0 0 12px #5da0ca55}
      .metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:10px}.metric{background:#142536;border:1px solid #304658;border-radius:10px;padding:6px 9px;min-height:0}.metric label{display:block;color:#9fb4c4;font-size:11px}.metric b{display:block;font-size:14px;margin-top:2px}
      .hot-active{border-color:#73b9e5;background:#1b3245}.printer-controls{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:10px}.printer-action{border:1px solid #47637a;border-radius:10px;background:#1a3449;color:#e9f6ff;padding:10px 3px;font:600 11px system-ui;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px}.printer-action span{font-size:19px}.printer-action.cancel{border-color:#a37d51}.printer-action.emergency{background:#69262b;border-color:#d66a6a;color:white}.printer-action:disabled{opacity:.35;cursor:not-allowed}.scene-layout{position:relative;display:grid;grid-template-columns:minmax(68px,1fr) minmax(0,4.1fr) minmax(68px,1fr);gap:5px;align-items:center;margin-top:14px;isolation:isolate}.scene-layout .tools-side:first-child{margin-right:0;z-index:2}.scene-layout .tools-side:last-child{margin-left:0;z-index:2}.filament-overlay{position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none;overflow:visible}.scene-layout .scene{z-index:1;transform:scale(1.02);filter:drop-shadow(0 9px 10px #0008)}.tools-side{display:flex;flex-direction:column;gap:12px;min-width:0}.scene-layout .scene{width:100%;margin:0}.tool{border:0;border-radius:9px;padding:5px 1px;background:transparent;display:flex;align-items:center;flex-direction:column;gap:5px;min-width:0}
      .tool.planned:not(.selected) .spool-side{filter:drop-shadow(0 0 5px var(--filament))}.tool-planned{font-style:normal;font-size:9px;color:#a8cde4;white-space:nowrap}.tool.selected{background:color-mix(in srgb,var(--filament) 12%,transparent);box-shadow:0 0 12px color-mix(in srgb,var(--filament) 30%,transparent)}.spool-side{position:relative;width:43px;height:78px;transform:perspective(160px) rotateY(-17deg);filter:drop-shadow(0 3px 5px #0008)}.tools-side:last-child .spool-side{transform:perspective(160px) rotateY(17deg)}.spool-winding{position:absolute;left:5px;right:5px;top:7px;bottom:7px;border-radius:8px;background:repeating-linear-gradient(0deg,color-mix(in srgb,var(--filament) 72%,#111) 0px,var(--filament) 3px,color-mix(in srgb,var(--filament) 60%,#000) 5px);box-shadow:inset 3px 0 5px #0007,inset -3px 0 4px #fff3}.spool-rim{position:absolute;z-index:2;left:0;top:1px;bottom:1px;width:6px;border-radius:45%;background:linear-gradient(90deg,#aeb7bc,#414b54);border:1px solid #8b979f}.spool-side:after{content:"";position:absolute;inset:12px 8px;border:1px solid #ffffff24;border-radius:4px;pointer-events:none}.spool-rim.rear{left:auto;right:0;background:linear-gradient(90deg,#48515a,#a4b0b8)}.feeding .spool-winding{animation:filament-flow 1.8s linear infinite}.feeding .spool-side{filter:drop-shadow(0 0 8px var(--filament))}@keyframes filament-flow{50%{filter:brightness(1.35);background-position:0 8px}}.tool small{font-size:10px;color:#a7b8c8;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tool span{font-size:11px}.bar{height:7px;border-radius:8px;background:#304456;margin-top:18px;overflow:hidden}.bar>div{height:100%;background:#49b8fa;transition:width .4s}.foot{margin-top:8px;color:#b8c9d7;font-size:12px;display:flex;justify-content:space-between}
      @media(prefers-reduced-motion:reduce){.feeding,.feeding .spool-winding,.filament-track,.print-carriage.moving{animation:none}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{opacity:.35}}
      @media(max-width:480px){ha-card{padding:12px}.scene-layout{grid-template-columns:minmax(57px,1fr) minmax(0,3.8fr) minmax(57px,1fr);gap:3px}.spool-side{width:28px;height:56px}.spool-winding{top:5px;bottom:5px}.tool{padding:6px 2px}.tool small{font-size:9px}.tool span{font-size:9px}}
    </style><ha-card class="${c.display_mode==="compact"?"compact":""}"><div class="top"><div class="title">SNAPMAKER U1</div><div class="status">${offline?"Apagada":printing?"Imprimiendo":paused?"En pausa":printer==="ready"?"Disponible":this.esc(printer)}</div></div><div class="scene-layout ${offline?"offline":""}"><svg class="filament-overlay" viewBox="0 0 600 350" preserveAspectRatio="none" aria-hidden="true">${filamentGuides}${filamentPaths}</svg><div class="tools-side">${leftTools}</div><div class="scene ${offline?"offline":""}">
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
<g class="${printing?"print-carriage moving":paused?"print-carriage paused": "print-carriage"}">
<path d="M158 69 H206 V76 H158Z" fill="#263a49" stroke="#90a9b7" stroke-width="1.5"/><path d="M166 76 H198 V112 L190 121 H173 L166 112Z" fill="#758995" stroke="#b2c2ca" stroke-width="2"/><path d="M171 80 H193 V105 H171Z" fill="#95a8b2" opacity=".28"/><rect x="178" y="84" width="9" height="14" rx="2" fill="#283d4b"/><circle cx="182" cy="103" r="3" fill="#d3e1e9"/>
<path d="M177 122 L183 136 L189 122" fill="${printing && active!==null ? headColors[active] : "#e7a857"}"/></g>
<path d="M72 48 V190 M294 48 V190" stroke="#a5b6c2" stroke-width="5" opacity=".75"/>
<path d="M50 42 L72 26 M314 42 L299 26" stroke="#b4c0c8" stroke-width="4"/>
<path d="M31 217 H329" stroke="#9baab4" stroke-width="4"/>
<rect x="151" y="205" width="66" height="21" rx="5" fill="#0d1b27" stroke="#526d80"/>
<text x="184" y="220" text-anchor="middle" fill="#d8e8f3" font-size="13" font-family="system-ui" font-weight="700">U1</text>
<g opacity=".8"><rect x="72" y="17" width="40" height="7" rx="2" fill="#283c49"/><rect x="121" y="17" width="40" height="7" rx="2" fill="#283c49"/><rect x="171" y="17" width="40" height="7" rx="2" fill="#283c49"/><rect x="221" y="17" width="40" height="7" rx="2" fill="#283c49"/></g>
<path d="M102 47 C107 62 105 70 112 78 M154 47 C158 58 157 64 162 72 M206 47 C211 59 211 65 216 72 M258 47 C265 61 268 66 270 78" fill="none" stroke="#647d8e" stroke-width="2" stroke-dasharray="3 4" opacity=".5"/><path d="M99 52 L130 52 M245 52 L275 52" stroke="#b3d6ec" opacity=".3" stroke-width="2"/>
${heads}
</svg></div><div class="tools-side">${rightTools}</div></div><div class="metrics"><div class="metric"><label>Capa</label><b>${layer} / ${total}</b></div><div class="metric"><label>Tiempo restante</label><b>${remaining}</b></div><div class="metric"><label>Cama</label><b>${bed}</b></div><div class="metric"><label>Interior</label><b>${chamber}</b></div></div>${jobHtml}${filamentHtml}${warningsHtml}${electricityHtml}${controlsHtml}${previewHtml}${cameraHtml}<div class="bar"><div style="width:${progress}%"></div></div><div class="foot"><span>${(normalizedState==="standby"?"En espera":normalizedState==="ready"?"Disponible":this.esc(state))}</span><span>${progress.toFixed(0)}%</span></div>${inventoryHtml}</ha-card>`;
    for(const button of this.shadowRoot.querySelectorAll("button.printer-action")){
      button.addEventListener("click",async()=>{
        if(button.disabled||this._commandPending)return;
        const action=button.dataset.action;
        const item=controls.find(x=>x.key===action);
        if(!item||!item.enabled||this.read(item.entity)==="unavailable")return;
        if((action==="cancel"||action==="emergency")&&!window.confirm(action==="emergency"?"¿Ejecutar PARADA DE EMERGENCIA? Puede interrumpir inmediatamente el funcionamiento.":"¿Cancelar la impresión actual?"))return;
        this._commandPending=true;button.disabled=true;
        try{await this._hass.callService("button","press",{entity_id:item.entity});}
        catch(error){console.error("Snapmaker U1 control failed",error);window.alert("No se pudo ejecutar "+item.label+". Revisa la conexión de la impresora.");}
        finally{this._commandPending=false;}
      });
    }
    const previewDetails=this.shadowRoot.querySelector("details.preview-panel");
    if(previewDetails)previewDetails.addEventListener("toggle",()=>{this._previewOpen=previewDetails.open;});
    const cameraDetails=this.shadowRoot.querySelector("details.camera-panel");
    if(cameraDetails)cameraDetails.addEventListener("toggle",()=>{this._cameraOpen=cameraDetails.open;});
    const inventoryDetails=this.shadowRoot.querySelector("details.inventory");
    if(inventoryDetails) inventoryDetails.addEventListener("toggle",()=>{this._inventoryOpen=inventoryDetails.open;});
  }
}

class SnapmakerU1CardEditor extends HTMLElement {
  constructor(){super();this.attachShadow({mode:"open"});}
  setConfig(config){this._config={...config};this.render();}
  set hass(hass){
    // The visual editor only needs a fresh entity registry when it is first built.
    // Avoid recreating dozens of entity pickers on every sensor update.
    this._hass=hass;
    if(!this._editorInitialized){this._editorInitialized=true;this.render();}
  }
  change(key,value){
    if(!this._config)return;
    const config={...this._config};
    if(value===""||value===null)delete config[key];else config[key]=value;
    this._config=config;
    this.dispatchEvent(new CustomEvent("config-changed",{detail:{config},bubbles:true,composed:true}));
  }
  renderWizard(){
    const steps=[
      {title:"1. Impresora",desc:"Selecciona las entidades principales para mostrar el estado de la Snapmaker U1.",fields:[["printer_state","Estado de la impresora"],["print_state","Estado de impresión"],["progress","Progreso (%)"],["active_tool","Cabezal activo (T0–T3)"]]},
      {title:"2. Cabezales",desc:"Asigna los sensores de temperatura. Puedes completar otros sensores más adelante.",fields:[["extruder1_temperature","Temperatura T0"],["extruder2_temperature","Temperatura T1"],["extruder3_temperature","Temperatura T2"],["extruder4_temperature","Temperatura T3"]]},
      {title:"3. Funciones opcionales",desc:"La cámara, Spoolman y la electricidad se pueden configurar después en el editor avanzado.",fields:[["thumbnail_camera","Miniatura"],["live_camera","Cámara"],["power_sensor","Potencia eléctrica"],["electricity_price_sensor","Precio de electricidad"]]}
    ];
    const step=Math.max(0,Math.min(steps.length-1,this._wizardStep||0));const current=steps[step];
    this.shadowRoot.innerHTML=`<style>:host{display:block;color:var(--primary-text-color)}.wizard{border:1px solid var(--divider-color);border-radius:12px;padding:16px}.wizard h3{margin:0 0 8px}.wizard p{color:var(--secondary-text-color);font-size:13px}.wizard label{display:block;font-size:13px;margin:14px 0 5px}ha-entity-picker{display:block;width:100%}.actions{display:flex;gap:8px;justify-content:space-between;margin-top:18px}button{padding:10px 14px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color);cursor:pointer}button.primary{background:var(--primary-color);color:var(--text-primary-color,#fff)}</style><div class="wizard"><h3>Configuración inicial · ${current.title}</h3><p>${current.desc}</p><p>Paso ${step+1} de ${steps.length}</p><div class="fields">${current.fields.map(([key,label])=>`<label>${label}</label><ha-entity-picker data-key="${key}" allow-custom-entity></ha-entity-picker>`).join("")}</div><div class="actions"><button data-prev ${step===0?"disabled":""}>Anterior</button><button class="primary" data-next>${step===steps.length-1?"Terminar":"Siguiente"}</button></div><p>Los campos opcionales pueden dejarse vacíos. La configuración avanzada siempre estará disponible.</p></div>`;
    for(const picker of this.shadowRoot.querySelectorAll("ha-entity-picker[data-key]")){
      const key=picker.dataset.key;picker.hass=this._hass;picker.value=this._config[key]||"";
      picker.addEventListener("value-changed",e=>{if(e.detail?.value!==undefined)this.change(key,e.detail.value);});
    }
    this.shadowRoot.querySelector("[data-prev]").addEventListener("click",()=>{this._wizardStep=step-1;this.renderWizard();});
    this.shadowRoot.querySelector("[data-next]").addEventListener("click",()=>{
      if(step===0&&(!this._config.printer_state||!this._config.print_state)){
        this.shadowRoot.querySelector(".wizard p").textContent="Selecciona el estado de la impresora y el estado de impresión para continuar.";return;
      }
      if(step<steps.length-1){this._wizardStep=step+1;this.renderWizard();}
      else{this.change("setup_complete",true);this.render();}
    });
  }
  render(){
    if(!this._config||!this._hass)return;
    // First-run wizard: only for a new, unconfigured card.
    if(this._config.setup_complete!==true&&(!this._config.printer_state||!this._config.print_state)){
      this.renderWizard();return;
    }
    const sections=[
      ["Impresora y estado",[
        ["printer_state","Estado de la impresora"],["print_state","Estado de impresión"],
        ["active_tool","Herramienta activa"],["progress","Progreso"],
        ["current_layer","Capa actual"],["total_layers","Capas totales"],
        ["time_left","Tiempo restante"],["bed_temperature","Temperatura de cama"],
        ["chamber_temperature","Temperatura interior"],["filename","Archivo de impresión"],["print_eta","Hora de finalización"],["thumbnail_camera","Cámara de miniatura"],["live_camera","Cámara interior"],["exception_sensor","Sensor de errores"],["power_sensor","Potencia eléctrica (W)"],["energy_sensor","Energía acumulada (kWh)"]
      ]],
      ["Controles de impresión", [["pause_button","Botón de pausa"],["resume_button","Botón de reanudación"],["cancel_button","Botón de cancelar"],["emergency_button","Botón de emergencia"]]],
      ["Presencia de filamento", [0,1,2,3].map(i=>["tool"+i+"_present","Filamento presente en T"+i])],
      ["Temperaturas de los cabezales",[0,1,2,3].map(i=>["extruder"+(i+1)+"_temperature","Temperatura T"+i])],
      ...[0,1,2,3].map(i=>["Bobina T"+i,[
        ["tool"+i+"_color","Color del filamento"],
        ["tool"+i+"_weight","Peso del filamento"],
        ["tool"+i+"_material","Material"],
        ["tool"+i+"_job_estimated","Filamento previsto para el trabajo"]
      ]])
    ];
    const style=`<style>:host{display:block;color:var(--primary-text-color)}.group{border:1px solid var(--divider-color);border-radius:12px;padding:12px;margin:12px 0}.group summary{cursor:pointer;font-size:15px;font-weight:650;padding:4px 0;list-style-position:inside}.group[open] summary{margin-bottom:12px}h3{font-size:15px;margin:0 0 12px}label{display:block;font-size:13px;margin:10px 0 5px}ha-entity-picker{display:block;width:100%}input{width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color)}p{font-size:12px;color:var(--secondary-text-color)}</style>`;
    this.shadowRoot.innerHTML=style+sections.map(([title,fields],index)=>`<details class="group" data-editor-group="${index}" ${this._openGroups?.has(String(index))?"open":""}><summary>${title}</summary>${fields.map(([key,label])=>`<label>${label}</label><ha-entity-picker data-key="${key}" allow-custom-entity></ha-entity-picker>`).join("")}</details>`).join("")+`<details class="group" data-editor-group="spoolman" ${this._openGroups?.has("spoolman")?"open":""}><summary>Spoolman (opcional)</summary><p>Introduce el ID de cada bobina de Spoolman. Si no utilizas Spoolman, deja estos campos vacíos.</p>${[0,1,2,3].map(i=>`<label>Bobina T${i} · ID de Spoolman</label><input data-spool="${i}" type="number" min="1" step="1" placeholder="Sin Spoolman"></input>`).join("")}</details>`;
    const inventoryToggle=document.createElement("label");
    inventoryToggle.style.cssText="display:flex;align-items:center;gap:10px;margin:14px 0;padding:12px;border:1px solid var(--divider-color);border-radius:10px";
    inventoryToggle.innerHTML='<input type="checkbox" style="width:auto"> Mostrar inventario completo de Spoolman (opcional)';
    const toggle=inventoryToggle.querySelector("input");
    toggle.checked=this._config.show_spoolman_inventory===true;
    toggle.addEventListener("change",()=>this.change("show_spoolman_inventory",toggle.checked));
    this.shadowRoot.appendChild(inventoryToggle);
    const marginRow=document.createElement("details");marginRow.className="group";marginRow.innerHTML='<summary>Control de filamento</summary><label>Margen de seguridad (%)</label><input data-margin type="number" min="0" max="100" step="0.5"><p>0 % = comparación exacta; puedes añadir un margen si lo deseas.</p>';
    marginRow.dataset.editorGroup="filament";marginRow.open=this._openGroups?.has("filament")??false;this.shadowRoot.appendChild(marginRow);
    const marginInput=marginRow.querySelector("[data-margin]");marginInput.value=this._config.filament_safety_margin??0;
    marginInput.addEventListener("change",()=>{const n=Number(marginInput.value);this.change("filament_safety_margin",Number.isFinite(n)?Math.max(0,Math.min(100,n)):0);});
    const extra=document.createElement("details");extra.className="group";extra.innerHTML='<summary>Visualización y electricidad</summary><label>Modo de tarjeta</label><select data-display><option value="full">Completo</option><option value="compact">Compacto</option></select><label>Origen del precio eléctrico</label><select data-price-mode><option value="sensor">Sensor de Home Assistant</option><option value="fixed">Precio fijo</option></select><div data-sensor-row><label>Sensor de precio (€/kWh)</label><ha-entity-picker data-price-sensor allow-custom-entity></ha-entity-picker></div><div data-fixed-row><label>Precio fijo (€/kWh)</label><input data-rate type="number" min="0" step="0.0001" placeholder="0.0753"></input></div>';
    extra.dataset.editorGroup="electricity";extra.open=this._openGroups?.has("electricity")??false;this.shadowRoot.appendChild(extra);
    const display=extra.querySelector("[data-display]");display.value=this._config.display_mode||"full";display.addEventListener("change",()=>this.change("display_mode",display.value));
    const mode=extra.querySelector("[data-price-mode]");mode.value=this._config.electricity_price_mode||"sensor";
    const sensorPicker=extra.querySelector("[data-price-sensor]");sensorPicker.hass=this._hass;sensorPicker.value=this._config.electricity_price_sensor||"";
    sensorPicker.addEventListener("value-changed",ev=>{if(ev.detail?.value!==undefined)this.change("electricity_price_sensor",ev.detail.value);});
    const syncPriceFields=()=>{extra.querySelector("[data-sensor-row]").hidden=mode.value!=="sensor";extra.querySelector("[data-fixed-row]").hidden=mode.value!=="fixed";};
    mode.addEventListener("change",()=>{this.change("electricity_price_mode",mode.value);syncPriceFields();});syncPriceFields();
    const rateInput=extra.querySelector("[data-rate]");rateInput.value=this._config.electricity_price??"";rateInput.addEventListener("change",()=>this.change("electricity_price",rateInput.value===""?null:Number(rateInput.value)));
    for(const [key,label] of [["preview_open_default","Miniatura abierta por defecto"],["camera_open_default","Cámara abierta por defecto"]]){
      const row=document.createElement("label");
      row.style.cssText="display:flex;align-items:center;gap:10px;margin:10px 0;padding:12px;border:1px solid var(--divider-color);border-radius:10px";
      const checkbox=document.createElement("input");checkbox.type="checkbox";checkbox.style.width="auto";checkbox.checked=this._config[key]===true;
      checkbox.addEventListener("change",()=>this.change(key,checkbox.checked));
      row.append(checkbox,document.createTextNode(label));this.shadowRoot.appendChild(row);
    }
    for(const section of this.shadowRoot.querySelectorAll("details[data-editor-group]"))section.addEventListener("toggle",()=>{
      if(!this._openGroups)this._openGroups=new Set();
      if(section.open)this._openGroups.add(section.dataset.editorGroup);else this._openGroups.delete(section.dataset.editorGroup);
    });
    for(const el of this.shadowRoot.querySelectorAll("ha-entity-picker[data-key]")){
      const key=el.dataset.key;el.hass=this._hass;el.value=this._config[key]??"";
      el.addEventListener("value-changed",ev=>{if(ev.detail?.value!==undefined)this.change(key,ev.detail.value);});
    }
    for(const el of this.shadowRoot.querySelectorAll("input[data-spool]")){
      const i=Number(el.dataset.spool);el.value=this._config.spoolman_spool_ids?.[i]??"";
      el.addEventListener("change",()=>{
        const ids=Array.isArray(this._config.spoolman_spool_ids)?[...this._config.spoolman_spool_ids]:[];
        ids[i]=el.value?Number(el.value):null;
        this.change("spoolman_spool_ids",ids.some(Boolean)?ids:"");
      });
    }
  }
}
if(!customElements.get("snapmaker-u1-card-editor"))customElements.define("snapmaker-u1-card-editor",SnapmakerU1CardEditor);

if (!customElements.get("snapmaker-u1-card")) customElements.define("snapmaker-u1-card",SnapmakerU1Card);
window.customCards=window.customCards||[];
window.customCards.push({type:"snapmaker-u1-card",name:"Snapmaker U1 Card",description:"Printer status, controls, camera and four Spoolman slots"});
