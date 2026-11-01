/* Snapmaker U1 Card — MIT License. */
const DEFAULTS = {};
const CARD_EXTRA_I18N={"en":{"Trabajo actual":"Current job","En este trabajo":"Used in this job"},"fr":{"Trabajo actual":"Impression en cours","En este trabajo":"Utilisé pour cette impression","Finalización estimada":"Fin estimée"},"de":{"Trabajo actual":"Aktueller Druck","En este trabajo":"Für diesen Druck","Finalización estimada":"Voraussichtliches Ende"},"it":{"Trabajo actual":"Stampa attuale","En este trabajo":"Usato in questa stampa","Finalización estimada":"Fine prevista"},"pt":{"Trabajo actual":"Impressão atual","En este trabajo":"Usado nesta impressão","Finalización estimada":"Conclusão prevista"},"nl":{"Trabajo actual":"Huidige print","En este trabajo":"Gebruikt voor deze print","Finalización estimada":"Verwacht einde"}};
const CARD_I18N={...{"fr":{"Apagada":"Hors ligne","Imprimiendo":"Impression","En pausa":"En pause","Disponible":"Disponible","En espera":"En attente","Capa":"Couche","Tiempo restante":"Temps restant","Cama":"Plateau","Interior":"Chambre","Pausar":"Pause","Reanudar":"Reprendre","Parar":"Arrêter","Emergencia":"Urgence","Vista previa de la pieza":"Aperçu de l'impression","Cámara de la impresora":"Caméra de l'imprimante","Inventario Spoolman":"Inventaire Spoolman","bobinas":"bobines","Potencia":"Puissance","Trabajo":"Travail","Coste":"Coût"},"de":{"Apagada":"Offline","Imprimiendo":"Druckt","En pausa":"Pausiert","Disponible":"Bereit","En espera":"Standby","Capa":"Schicht","Tiempo restante":"Restzeit","Cama":"Druckbett","Interior":"Bauraum","Pausar":"Pause","Reanudar":"Fortsetzen","Parar":"Stoppen","Emergencia":"Not-Aus","Vista previa de la pieza":"Druckvorschau","Cámara de la impresora":"Druckerkamera","Inventario Spoolman":"Spoolman-Bestand","bobinas":"Spulen","Potencia":"Leistung","Trabajo":"Auftrag","Coste":"Kosten"},"it":{"Apagada":"Offline","Imprimiendo":"In stampa","En pausa":"In pausa","Disponible":"Disponibile","En espera":"In attesa","Capa":"Strato","Tiempo restante":"Tempo rimanente","Cama":"Piano","Interior":"Camera","Pausar":"Pausa","Reanudar":"Riprendi","Parar":"Ferma","Emergencia":"Emergenza","Vista previa de la pieza":"Anteprima stampa","Cámara de la impresora":"Fotocamera stampante","Inventario Spoolman":"Inventario Spoolman","bobinas":"bobine","Potencia":"Potenza","Trabajo":"Lavoro","Coste":"Costo"},"pt":{"Apagada":"Desligada","Imprimiendo":"A imprimir","En pausa":"Em pausa","Disponible":"Disponível","En espera":"Em espera","Capa":"Camada","Tiempo restante":"Tempo restante","Cama":"Mesa","Interior":"Câmara","Pausar":"Pausar","Reanudar":"Retomar","Parar":"Parar","Emergencia":"Emergência","Vista previa de la pieza":"Pré-visualização","Cámara de la impresora":"Câmara da impressora","Inventario Spoolman":"Inventário Spoolman","bobinas":"bobinas","Potencia":"Potência","Trabajo":"Trabalho","Coste":"Custo"},"nl":{"Apagada":"Offline","Imprimiendo":"Bezig met printen","En pausa":"Gepauzeerd","Disponible":"Beschikbaar","En espera":"Stand-by","Capa":"Laag","Tiempo restante":"Resterende tijd","Cama":"Printbed","Interior":"Kamer","Pausar":"Pauzeren","Reanudar":"Hervatten","Parar":"Stoppen","Emergencia":"Noodstop","Vista previa de la pieza":"Afdrukvoorbeeld","Cámara de la impresora":"Printercamera","Inventario Spoolman":"Spoolman-voorraad","bobinas":"spoelen","Potencia":"Vermogen","Trabajo":"Taak","Coste":"Kosten"}},en:{"Apagada":"Offline","Imprimiendo":"Printing","En pausa":"Paused","Disponible":"Available","En espera":"Standby","Capa":"Layer","Tiempo restante":"Time left","Cama":"Bed","Interior":"Chamber","Pausar":"Pause","Reanudar":"Resume","Parar":"Stop","Emergencia":"Emergency","Vista previa de la pieza":"Print preview","Cámara de la impresora":"Printer camera","Inventario Spoolman":"Spoolman inventory","bobinas":"spools","Potencia":"Power","Trabajo":"Job","Coste":"Cost","Finalización estimada":"Estimated finish","Miniatura no disponible":"Thumbnail unavailable","La impresora comunica una incidencia":"The printer reports an issue","falta filamento":"filament missing","Filamento":"Filament","Completo":"Full","Compacto":"Compact","Desconocido":"Unknown","No se pudo ejecutar":"Could not execute","Revisa la conexión de la impresora.":"Check the printer connection.","¿Cancelar la impresión actual?":"Cancel the current print?","¿Ejecutar PARADA DE EMERGENCIA? Puede interrumpir inmediatamente el funcionamiento.":"Execute EMERGENCY STOP? This may immediately interrupt operation."}};
const CARD_WIZARD_EXTRA_I18N={"fr":{"Para utilizar todas las funciones necesitas Moonraker y Lava. Spoolman es opcional.":"Pour profiter de toutes les fonctions, configurez Moonraker et Lava. Spoolman est facultatif.","Detectadas y aplicadas":"Détectées et attribuées","Revisión manual":"Vérification manuelle","Las coincidencias ambiguas no se asignan.":"Les correspondances ambiguës ne sont pas attribuées."},"de":{"Para utilizar todas las funciones necesitas Moonraker y Lava. Spoolman es opcional.":"Für alle Funktionen werden Moonraker und Lava benötigt. Spoolman ist optional.","Detectadas y aplicadas":"Erkannt und zugeordnet","Revisión manual":"Manuelle Prüfung","Las coincidencias ambiguas no se asignan.":"Mehrdeutige Treffer werden nicht zugeordnet."},"it":{"Para utilizar todas las funciones necesitas Moonraker y Lava. Spoolman es opcional.":"Per tutte le funzioni servono Moonraker e Lava. Spoolman è opzionale.","Detectadas y aplicadas":"Rilevate e assegnate","Revisión manual":"Verifica manuale","Las coincidencias ambiguas no se asignan.":"Le corrispondenze ambigue non vengono assegnate."},"pt":{"Para utilizar todas las funciones necesitas Moonraker y Lava. Spoolman es opcional.":"Para todas as funcionalidades, configure Moonraker e Lava. Spoolman é opcional.","Detectadas y aplicadas":"Detetadas e atribuídas","Revisión manual":"Revisão manual","Las coincidencias ambiguas no se asignan.":"As correspondências ambíguas não são atribuídas."},"nl":{"Para utilizar todas las funciones necesitas Moonraker y Lava. Spoolman es opcional.":"Voor alle functies zijn Moonraker en Lava nodig. Spoolman is optioneel.","Detectadas y aplicadas":"Gedetecteerd en toegewezen","Revisión manual":"Handmatige controle","Las coincidencias ambiguas no se asignan.":"Onduidelijke overeenkomsten worden niet toegewezen."}};
const CARD_WIZARD_I18N={"en":{"Configuración inicial":"Initial setup","1. Impresora":"1. Printer","2. Cabezales":"2. Toolheads","3. Funciones opcionales":"3. Optional features","Detectar entidades automáticamente":"Auto-detect entities","Anterior":"Back","Siguiente":"Next","Terminar":"Finish","Paso":"Step","de":"of","Selecciona las entidades principales para mostrar el estado de la Snapmaker U1.":"Select the main entities to display your Snapmaker U1 status.","Asigna los sensores de temperatura. Puedes completar otros sensores más adelante.":"Assign the temperature sensors. You can configure additional sensors later.","La cámara, Spoolman y la electricidad se pueden configurar después en el editor avanzado.":"Camera, Spoolman and electricity can also be configured later in the advanced editor."},"pt":{"Configuración inicial":"Configuração inicial","1. Impresora":"1. Impressora","2. Cabezales":"2. Cabeças","3. Funciones opcionales":"3. Funções opcionais","Detectar entidades automáticamente":"Detetar entidades automaticamente","Anterior":"Anterior","Siguiente":"Seguinte","Terminar":"Concluir","Paso":"Passo","de":"de","Selecciona las entidades principales para mostrar el estado de la Snapmaker U1.":"Selecione as entidades principais para mostrar o estado da Snapmaker U1.","Asigna los sensores de temperatura. Puedes completar otros sensores más adelante.":"Associe os sensores de temperatura. Pode configurar outros sensores mais tarde.","La cámara, Spoolman y la electricidad se pueden configurar después en el editor avanzado.":"A câmara, Spoolman e a eletricidade podem ser configurados depois no editor avançado."},"fr":{"Configuración inicial":"Configuration initiale","1. Impresora":"1. Imprimante","2. Cabezales":"2. Têtes d'impression","3. Funciones opcionales":"3. Fonctions facultatives","Detectar entidades automáticamente":"Détecter automatiquement les entités","Anterior":"Précédent","Siguiente":"Suivant","Terminar":"Terminer","Paso":"Étape","de":"sur","Selecciona las entidades principales para mostrar el estado de la Snapmaker U1.":"Sélectionnez les entités principales pour afficher l'état de la Snapmaker U1.","Asigna los sensores de temperatura. Puedes completar otros sensores más adelante.":"Associez les capteurs de température. Vous pourrez compléter les autres capteurs plus tard.","La cámara, Spoolman y la electricidad se pueden configurar después en el editor avanzado.":"La caméra, Spoolman et l'électricité pourront être configurés dans l'éditeur avancé."},"de":{"Configuración inicial":"Ersteinrichtung","1. Impresora":"1. Drucker","2. Cabezales":"2. Druckköpfe","3. Funciones opcionales":"3. Optionale Funktionen","Detectar entidades automáticamente":"Entitäten automatisch erkennen","Anterior":"Zurück","Siguiente":"Weiter","Terminar":"Fertigstellen","Paso":"Schritt","de":"von","Selecciona las entidades principales para mostrar el estado de la Snapmaker U1.":"Wähle die wichtigsten Entitäten für den Status deiner Snapmaker U1.","Asigna los sensores de temperatura. Puedes completar otros sensores más adelante.":"Ordne die Temperatursensoren zu. Weitere Sensoren kannst du später konfigurieren.","La cámara, Spoolman y la electricidad se pueden configurar después en el editor avanzado.":"Kamera, Spoolman und Strom lassen sich später im erweiterten Editor konfigurieren."},"it":{"Configuración inicial":"Configurazione iniziale","1. Impresora":"1. Stampante","2. Cabezales":"2. Testine","3. Funciones opcionales":"3. Funzioni opzionali","Detectar entidades automáticamente":"Rileva automaticamente le entità","Anterior":"Indietro","Siguiente":"Avanti","Terminar":"Fine","Paso":"Passo","de":"di","Selecciona las entidades principales para mostrar el estado de la Snapmaker U1.":"Seleziona le entità principali per mostrare lo stato della Snapmaker U1.","Asigna los sensores de temperatura. Puedes completar otros sensores más adelante.":"Assegna i sensori di temperatura. Potrai configurare altri sensori in seguito.","La cámara, Spoolman y la electricidad se pueden configurar después en el editor avanzado.":"Fotocamera, Spoolman ed elettricità si possono configurare nell'editor avanzato."},"nl":{"Configuración inicial":"Eerste configuratie","1. Impresora":"1. Printer","2. Cabezales":"2. Printkoppen","3. Funciones opcionales":"3. Optionele functies","Detectar entidades automáticamente":"Entiteiten automatisch detecteren","Anterior":"Vorige","Siguiente":"Volgende","Terminar":"Voltooien","Paso":"Stap","de":"van","Selecciona las entidades principales para mostrar el estado de la Snapmaker U1.":"Selecteer de belangrijkste entiteiten om de status van de Snapmaker U1 te tonen.","Asigna los sensores de temperatura. Puedes completar otros sensores más adelante.":"Koppel de temperatuursensoren. Andere sensoren kun je later instellen.","La cámara, Spoolman y la electricidad se pueden configurar después en el editor avanzado.":"Camera, Spoolman en elektriciteit kunnen later in de geavanceerde editor worden ingesteld."}};
const CARD_EDITOR_EXTRA_I18N={"en":{"Spoolman (opcional)":"Spoolman (optional)","Introduce el ID de cada bobina de Spoolman. Si no utilizas Spoolman, deja estos campos vacíos.":"Enter each Spoolman spool ID. Leave these fields empty if you do not use Spoolman.","Bobina T":"Spool T","Sin Spoolman":"No Spoolman","Mostrar inventario completo de Spoolman (opcional)":"Show full Spoolman inventory (optional)","Control de filamento":"Filament monitoring","Margen de seguridad (%)":"Safety margin (%)","0 % = comparación exacta; puedes añadir un margen si lo deseas.":"0% = exact comparison; you can add a safety margin.","Visualización y electricidad":"Display and electricity","Modo de tarjeta":"Card display mode","Completo":"Full","Compacto":"Compact","Origen del precio eléctrico":"Electricity price source","Sensor de Home Assistant":"Home Assistant sensor","Precio fijo":"Fixed price","Sensor de precio (€/kWh)":"Price sensor (€/kWh)","Precio fijo (€/kWh)":"Fixed price (€/kWh)","Miniatura abierta por defecto":"Thumbnail expanded by default","Cámara abierta por defecto":"Camera expanded by default"},"pt":{"Spoolman (opcional)":"Spoolman (opcional)","Control de filamento":"Monitorização do filamento","Margen de seguridad (%)":"Margem de segurança (%)","Modo de tarjeta":"Modo do cartão","Sensor de Home Assistant":"Sensor do Home Assistant","Precio fijo":"Preço fixo","Miniatura abierta por defecto":"Miniatura aberta por predefinição","Cámara abierta por defecto":"Câmara aberta por predefinição"},"fr":{"Spoolman (opcional)":"Spoolman (facultatif)","Control de filamento":"Surveillance du filament","Margen de seguridad (%)":"Marge de sécurité (%)","Modo de tarjeta":"Mode de la carte","Sensor de Home Assistant":"Capteur Home Assistant","Precio fijo":"Prix fixe","Miniatura abierta por defecto":"Miniature ouverte par défaut","Cámara abierta por defecto":"Caméra ouverte par défaut"},"de":{"Spoolman (opcional)":"Spoolman (optional)","Control de filamento":"Filamentüberwachung","Margen de seguridad (%)":"Sicherheitszuschlag (%)","Modo de tarjeta":"Kartenansicht","Sensor de Home Assistant":"Home Assistant-Sensor","Precio fijo":"Festpreis","Miniatura abierta por defecto":"Vorschaubild standardmäßig geöffnet","Cámara abierta por defecto":"Kamera standardmäßig geöffnet"},"it":{"Spoolman (opcional)":"Spoolman (opzionale)","Control de filamento":"Monitoraggio filamento","Margen de seguridad (%)":"Margine di sicurezza (%)","Modo de tarjeta":"Modalità scheda","Sensor de Home Assistant":"Sensore Home Assistant","Precio fijo":"Prezzo fisso","Miniatura abierta por defecto":"Anteprima aperta per impostazione predefinita","Cámara abierta por defecto":"Fotocamera aperta per impostazione predefinita"},"nl":{"Spoolman (opcional)":"Spoolman (optioneel)","Control de filamento":"Filamentbewaking","Margen de seguridad (%)":"Veiligheidsmarge (%)","Modo de tarjeta":"Kaartweergave","Sensor de Home Assistant":"Home Assistant-sensor","Precio fijo":"Vaste prijs","Miniatura abierta por defecto":"Miniatuur standaard geopend","Cámara abierta por defecto":"Camera standaard geopend"}};
const CARD_EDITOR_I18N={"en":{"Impresora y estado":"Printer and status","Estado de la impresora":"Printer status","Estado de impresión":"Print status","Herramienta activa":"Active toolhead","Progreso":"Progress","Capa actual":"Current layer","Capas totales":"Total layers","Tiempo restante":"Time remaining","Temperatura de cama":"Bed temperature","Temperatura interior":"Chamber temperature","Archivo de impresión":"Print filename","Hora de finalización":"Estimated finish","Cabezales y temperaturas":"Toolheads and temperatures","Control de filamento":"Filament monitoring","Visualización y electricidad":"Display and electricity","Modo de tarjeta":"Card display mode","Origen del precio eléctrico":"Electricity price source","Completo":"Full","Compacto":"Compact"},"fr":{"Impresora y estado":"Imprimante et état","Estado de la impresora":"État de l’imprimante","Estado de impresión":"État de l’impression","Herramienta activa":"Tête active","Progreso":"Progression","Capa actual":"Couche actuelle","Capas totales":"Nombre de couches","Tiempo restante":"Temps restant","Temperatura de cama":"Température du plateau","Temperatura interior":"Température de la chambre","Archivo de impresión":"Fichier d’impression","Hora de finalización":"Fin estimée","Cabezales y temperaturas":"Têtes et températures","Control de filamento":"Suivi du filament","Visualización y electricidad":"Affichage et électricité","Modo de tarjeta":"Mode d’affichage","Origen del precio eléctrico":"Source du prix électrique","Completo":"Complet","Compacto":"Compact"},"de":{"Impresora y estado":"Drucker und Status","Estado de la impresora":"Druckerstatus","Estado de impresión":"Druckstatus","Herramienta activa":"Aktiver Druckkopf","Progreso":"Fortschritt","Capa actual":"Aktuelle Schicht","Capas totales":"Schichten gesamt","Tiempo restante":"Restzeit","Temperatura de cama":"Druckbetttemperatur","Temperatura interior":"Bauraumtemperatur","Archivo de impresión":"Druckdatei","Hora de finalización":"Voraussichtliches Ende","Cabezales y temperaturas":"Druckköpfe und Temperaturen","Control de filamento":"Filamentüberwachung","Visualización y electricidad":"Anzeige und Strom","Modo de tarjeta":"Kartenansicht","Origen del precio eléctrico":"Strompreisquelle","Completo":"Vollständig","Compacto":"Kompakt"},"it":{"Impresora y estado":"Stampante e stato","Estado de la impresora":"Stato stampante","Estado de impresión":"Stato stampa","Herramienta activa":"Testina attiva","Progreso":"Avanzamento","Capa actual":"Strato attuale","Capas totales":"Strati totali","Tiempo restante":"Tempo rimanente","Temperatura de cama":"Temperatura piano","Temperatura interior":"Temperatura camera","Archivo de impresión":"File di stampa","Hora de finalización":"Fine prevista","Cabezales y temperaturas":"Testine e temperature","Control de filamento":"Monitoraggio filamento","Visualización y electricidad":"Visualizzazione ed elettricità","Modo de tarjeta":"Modalità scheda","Origen del precio eléctrico":"Fonte prezzo energia","Completo":"Completo","Compacto":"Compatto"},"pt":{"Impresora y estado":"Impressora e estado","Estado de la impresora":"Estado da impressora","Estado de impresión":"Estado da impressão","Herramienta activa":"Cabeça ativa","Progreso":"Progresso","Capa actual":"Camada atual","Capas totales":"Total de camadas","Tiempo restante":"Tempo restante","Temperatura de cama":"Temperatura da mesa","Temperatura interior":"Temperatura da câmara","Archivo de impresión":"Ficheiro de impressão","Hora de finalización":"Fim previsto","Cabezales y temperaturas":"Cabeças e temperaturas","Control de filamento":"Monitorização do filamento","Visualización y electricidad":"Visualização e eletricidade","Modo de tarjeta":"Modo do cartão","Origen del precio eléctrico":"Origem do preço da eletricidade","Completo":"Completo","Compacto":"Compacto"},"nl":{"Impresora y estado":"Printer en status","Estado de la impresora":"Printerstatus","Estado de impresión":"Afdrukstatus","Herramienta activa":"Actieve printkop","Progreso":"Voortgang","Capa actual":"Huidige laag","Capas totales":"Totaal lagen","Tiempo restante":"Resterende tijd","Temperatura de cama":"Bedtemperatuur","Temperatura interior":"Kamertemperatuur","Archivo de impresión":"Afdrukbestand","Hora de finalización":"Verwachte eindtijd","Cabezales y temperaturas":"Printkoppen en temperaturen","Control de filamento":"Filamentbewaking","Visualización y electricidad":"Weergave en elektriciteit","Modo de tarjeta":"Kaartweergave","Origen del precio eléctrico":"Bron elektriciteitsprijs","Completo":"Volledig","Compacto":"Compact"}};
function translateEditor(root,lang){if(lang==="es")return;const dictionary={...(CARD_EDITOR_I18N.en||{}),...(CARD_EDITOR_EXTRA_I18N.en||{}),...(CARD_EDITOR_I18N[lang]||{}),...(CARD_EDITOR_EXTRA_I18N[lang]||{})};const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while((node=walker.nextNode())){if(node.parentElement?.closest("style,script"))continue;let text=node.nodeValue;for(const [source,target] of Object.entries(dictionary).sort((a,b)=>b[0].length-a[0].length))text=text.split(source).join(target);node.nodeValue=text;}for(const element of root.querySelectorAll("[placeholder],[title],[aria-label]")){for(const attr of ["placeholder","title","aria-label"]){const original=element.getAttribute(attr);if(!original)continue;let translated=original;for(const [source,target] of Object.entries(dictionary).sort((a,b)=>b[0].length-a[0].length))translated=translated.split(source).join(target);if(translated!==original)element.setAttribute(attr,translated);}}}
function cardLanguage(config,hass){const selected=config?.language||"auto";const supported=["es","en","fr","de","it","pt","nl"];if(selected!=="auto")return supported.includes(selected)?selected:"en";const detected=(hass?.language||navigator.language||"en").toLowerCase().split(/[-_]/)[0];return supported.includes(detected)?detected:"en";}
function cardTranslate(text,language){if(language==="es")return text;const map={...CARD_I18N.en,...(CARD_I18N[language]||{}),...(CARD_EXTRA_I18N[language]||{})};return String(text).replace(/Trabajo actual|En este trabajo|Apagada|Imprimiendo|En pausa|Disponible|En espera|Tiempo restante|Finalización estimada|Vista previa de la pieza|Cámara de la impresora|Inventario Spoolman|Miniatura no disponible|La impresora comunica una incidencia|Revisa la conexión de la impresora\.|¿Ejecutar PARADA DE EMERGENCIA\? Puede interrumpir inmediatamente el funcionamiento\.|¿Cancelar la impresión actual\?|No se pudo ejecutar|falta filamento|Emergencia|Reanudar|Pausar|Parar|Potencia|Trabajo|Coste|Interior|Capa|Cama|bobinas|Filamento|Desconocido/g,match=>map[match]||CARD_I18N.en[match]||match);}

class SnapmakerU1Card extends HTMLElement {
  setConfig(config) {
    this.config = { ...DEFAULTS, ...config };
    this._previewOpen=undefined;
    this._cameraOpen=undefined;
    this._cameraZoomOpen=false;
    this.attachShadowOnce();
    this.render();
  }
  attachShadowOnce() { if (!this.shadowRoot) this.attachShadow({mode:"open"}); }
  set hass(hass) {
    this._hass=hass;
    if(!this.config)return;
    const c=this.config;
    const ids=new Set(Object.values(c).filter(v=>typeof v==="string"&&/^(sensor|binary_sensor|camera|button|switch|light|number|input_boolean)\./.test(v)));
    if(c.show_spoolman_inventory===true)for(const id of Object.keys(hass.states))if(/^sensor\.spoolman_spool_\d+(?:_color_hex|_filament_name|_vendor)?$/.test(id))ids.add(id);
    const language=cardLanguage(c,hass);
    const themeSignature=JSON.stringify([hass.themes?.darkMode,hass.themes?.theme,hass.themes?.themes?.[hass.themes?.theme]]);
    const changed=!this._lastHass||this._lastLanguage!==language||this._lastThemeSignature!==themeSignature||[...ids].some(id=>this._lastHass.states?.[id]!==hass.states?.[id]);
    this._lastHass=hass;
    this._lastLanguage=language;
    this._lastThemeSignature=themeSignature;
    if(changed)this.render();
  }
  connectedCallback() {
    if(!this._energyRefreshTimer)this._energyRefreshTimer=setInterval(()=>{if(this.config&&this._hass)this.render();},10000);
    if(!this._cameraRefreshTimer)this._cameraRefreshTimer=setInterval(()=>{
      const img=this.shadowRoot?.querySelector("details.camera-panel[open] img.camera-image");
      const zoomImg=this.shadowRoot?.querySelector(".camera-zoom:not([hidden]) img.camera-zoom-image");
      const activeImg=zoomImg||img;
      if(activeImg&&activeImg.dataset.cameraBase&&this._hass?.states?.[this.config?.live_camera]?.state!=="unavailable"){
        const separator=activeImg.dataset.cameraBase.includes("?")?"&":"?";
        const refreshed=activeImg.dataset.cameraBase+separator+"_refresh="+Date.now();
        if(img)img.src=refreshed;
        if(zoomImg)zoomImg.src=refreshed;
      }
    },2500);
  }
  disconnectedCallback() {
    if(this._cameraRefreshTimer){clearInterval(this._cameraRefreshTimer);this._cameraRefreshTimer=null;}
    if(this._energyRefreshTimer){clearInterval(this._energyRefreshTimer);this._energyRefreshTimer=null;}
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
    const existingGui=this.shadowRoot.querySelector("details.gui-screen");
    if(existingGui)this._guiOpen=existingGui.open;
    if(this._guiOpen===undefined)this._guiOpen=this.config.gui_open_default===true;
    const c=this.config, lang=cardLanguage(c,this._hass), printer=this.read(c.printer_state), state=this.read(c.print_state);
    // Treat either missing status feed as disconnected; never show stale print controls.
    const statusMissing=value=>["unknown","unavailable","none",""].includes(String(value).trim().toLowerCase());
    const offline=statusMissing(printer)||statusMissing(state);
    const updateAvailable=this.read(c.update_available_sensor)==="on";
    const powerEntity=c.power_switch_entity||(this._hass?.states?.["switch.impresora3d"]?"switch.impresora3d":"");
    const powerState=powerEntity?this._hass?.states?.[powerEntity]?.state:"unavailable";
    const powerReady=powerState==="on"||powerState==="off";
    const switchChangedAt=Date.parse(this._hass?.states?.[powerEntity]?.last_changed||"");
    const printerUpdatedAt=Date.parse(this._hass?.states?.[c.printer_state]?.last_updated||"");
    const freshPrinterSignal=!offline&&(!Number.isFinite(switchChangedAt)||Number.isFinite(printerUpdatedAt)&&printerUpdatedAt>=switchChangedAt);
    const ledEntity=c.led_light_entity;
    const ledState=ledEntity?this._hass?.states?.[ledEntity]?.state:"unavailable";
    const ledOn=ledState==="on";
    const ledUnavailable=!["on","off"].includes(ledState);
    const ledBrightness=ledOn?Math.round((Number(this._hass?.states?.[ledEntity]?.attributes?.brightness)||255)*100/255):0;
    const normalizedState=String(state).toLowerCase();
    const printing=!offline && normalizedState==="printing", paused=!offline && normalizedState==="paused";
    const displayStatus=powerState==="off"?"Apagada":printing?"Imprimiendo":paused?"En pausa":powerState==="on"?(offline||!freshPrinterSignal?"Encendiéndose":printer==="ready"?"Disponible":this.esc(printer)):offline?"Apagada":printer==="ready"?"Disponible":this.esc(printer);
    const rawActive=this.read(c.active_tool);
    const active=/^[0-3]$/.test(String(rawActive).trim())?Number(rawActive):null;
    const rawProgress=this.read(c.progress);
    const progressValid=!offline&&!statusMissing(rawProgress)&&Number.isFinite(Number(rawProgress));
    const progress=progressValid?Math.max(0,Math.min(100,Number(rawProgress))):0;
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
      return `<div data-spool-tool="${i}" role="button" tabindex="0" title="${lang==="es"?"Ver propiedades de la bobina":"View spool properties"}" class="tool ${selected?"selected":""} ${feeding?"feeding":""} ${planned?"planned":""}" style="--filament:${safeColor}"><div class="spool-side"><div class="spool-rim"></div><div class="spool-winding"></div><div class="spool-rim rear"></div></div><small>${material}</small><span>${grams}</span>${feeding?"":planned?`<em class="tool-planned">${this.esc(cardTranslate("En este trabajo",lang))}</em>`:""}</div>`;
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
    const guiCameraUrl=picture(c.gui_camera);
    const rawEta=this.read(c.print_eta);
    let eta="—";
    if(printing||paused){const date=Date.parse(rawEta);if(valid(rawEta)&&Number.isFinite(date))eta=new Intl.DateTimeFormat(lang==="es"?"es-ES":"en-US",{hour:"2-digit",minute:"2-digit"}).format(new Date(date));else if(printing&&Number.isFinite(Number(rawRemaining))&&Number(rawRemaining)>0){const unit=this._hass?.states?.[c.time_left]?.attributes?.unit_of_measurement;const mins=unit==="s"?Number(rawRemaining)/60:unit==="h"?Number(rawRemaining)*60:Number(rawRemaining);eta=new Intl.DateTimeFormat(lang==="es"?"es-ES":"en-US",{hour:"2-digit",minute:"2-digit"}).format(new Date(Date.now()+mins*60000));}}
    // ETA refinement: use recent actual progress speed, blend conservatively with printer ETA.
    let etaConfidence="";
    if(printing&&progressValid&&progress>=3&&progress<99.5){
      const stamp=Date.now();
      const key=String(jobName||"print");
      if(!this._etaTracking||this._etaTracking.key!==key||progress+1<this._etaTracking.lastProgress)
        this._etaTracking={key,lastProgress:progress,samples:[]};
      const tr=this._etaTracking;
      if(!tr.samples.length||stamp-tr.samples[tr.samples.length-1].t>=30000){
        tr.samples.push({t:stamp,p:progress});
        if(tr.samples.length>16)tr.samples.shift();
      }
      tr.lastProgress=progress;
      const first=tr.samples[0],last=tr.samples[tr.samples.length-1];
      const elapsed=last.t-first.t;
      const gained=last.p-first.p;
      if(elapsed>=180000&&gained>=1&&gained<=60){
        const rate=gained/(elapsed/60000);
        const observedMins=(100-progress)/rate;
        if(observedMins>0&&observedMins<1440){
          const rawUnit=this._hass?.states?.[c.time_left]?.attributes?.unit_of_measurement;
          const rawNum=Number(rawRemaining);
          const deviceMins=valid(rawRemaining)&&Number.isFinite(rawNum)&&rawNum>0?(rawUnit==="s"?rawNum/60:rawUnit==="h"?rawNum*60:rawNum):null;
          const blended=deviceMins!==null?deviceMins*0.75+observedMins*0.25:observedMins;
          eta=new Intl.DateTimeFormat(lang==="es"?"es-ES":"en-US",{hour:"2-digit",minute:"2-digit"}).format(new Date(stamp+blended*60000));
          etaConfidence=elapsed>=600000&&gained>=5?(lang==="es"?" · confianza media":" · medium confidence"):(lang==="es"?" · confianza baja":" · low confidence");
        }
      }
    }else if(!printing&&this._etaTracking){this._etaTracking=null;}
    const exception=this._hass?.states?.[c.exception_sensor];
    const exceptionText=exception?.attributes?.exceptions;
    const warnings=[];
    if(exception?.state==="on")warnings.push(Array.isArray(exceptionText)&&exceptionText.length?exceptionText.map(x=>typeof x==="string"?x:JSON.stringify(x)).join("; "):"La impresora comunica una incidencia");
    if(printing||paused){for(let i=0;i<4;i++)if(slotPresent[i]===false&&(plannedTools[i]||active===i))warnings.push("T"+i+": falta filamento");}
    const required=[0,1,2,3].map(i=>{const v=this.read(c["tool"+i+"_job_estimated"]);const n=Number(v);return valid(v)&&Number.isFinite(n)&&n>0?n:null;});
    const marginRaw=Number(c.filament_safety_margin??0);
    const filamentMargin=Number.isFinite(marginRaw)?Math.max(0,Math.min(100,marginRaw)):0;
    const filamentCheck=(printing||paused)?required.map((need,i)=>{if(need===null||!Number.isFinite(need)||need<=0)return {i,unused:true,low:false,unknown:false};const raw=spoolData[i].weight;const available=raw!==null&&raw!==undefined&&String(raw).trim()!==""&&valid(raw)&&Number.isFinite(Number(raw))?Number(raw):null;const needed=need*(1+filamentMargin/100);if(available===null||spoolData[i].empty)return {i,need,needed,available:null,low:false,unknown:true};return {i,need,needed,available,low:available<needed,unknown:false};}).filter(Boolean):[];
    for(const f of filamentCheck)if(f.low)warnings.push("T"+f.i+": filamento insuficiente ("+Math.round(f.available)+" g / "+Math.round(f.needed)+" g con margen)");
    const powerRaw=this.read(c.power_sensor);
    const power=valid(powerRaw)&&Number.isFinite(Number(powerRaw))?Number(powerRaw):null;
    const dailyEnergyRaw=this.read(c.daily_energy_sensor);
    const dailyEnergyState=this._hass?.states?.[c.daily_energy_sensor];
    const dailyEnergyNumber=Number(dailyEnergyRaw);
    const dailyEnergy=valid(dailyEnergyRaw)&&String(dailyEnergyRaw).trim()!==""&&Number.isFinite(dailyEnergyNumber)?dailyEnergyNumber*(dailyEnergyState?.attributes?.unit_of_measurement==="Wh"?0.001:1):null;
    const energyRaw=this.read(c.energy_sensor);
    const energy=valid(energyRaw)&&Number.isFinite(Number(energyRaw))?Number(energyRaw):null;
    const priceMode=c.electricity_price_mode||"sensor";
    const priceRaw=priceMode==="fixed"?c.electricity_price:this.read(c.electricity_price_sensor);
    const price=priceRaw!==null&&priceRaw!==undefined&&String(priceRaw).trim()!==""&&valid(priceRaw)&&Number.isFinite(Number(priceRaw))&&Number(priceRaw)>=0?Number(priceRaw):null;
    // Estimate job energy from observed power samples; cumulative meters may reset.
    const trackingKey="snapmaker-u1-card-print-energy-v5:"+String(c.energy_sensor||c.power_sensor||c.power_switch_entity||"printer");
    if(!this._jobTracking||this._jobTrackingKey!==trackingKey){
      this._jobTrackingKey=trackingKey;
      try{this._jobTracking=JSON.parse(localStorage.getItem(trackingKey)||"null");}catch(e){this._jobTracking=null;}
    }
    const now=Date.now(),trackingActive=printing||paused;
    const prior=this._jobTracking;
    const newJob=trackingActive&&prior&&((jobName&&prior.jobName&&prior.jobName!==jobName)||(!prior.wasActive&&printing&&(!prior.jobName||prior.completedAt)));
    if(newJob){this._jobTracking=null;this._etaTracking=null;try{localStorage.removeItem(trackingKey);}catch(e){}}
    if(trackingActive&&!this._jobTracking){
      this._jobTracking={jobName,usedKwh:0,cost:0,lastEnergy:energy,lastTick:now,lastPower:power,lastPrice:price,lastState:normalizedState,wasActive:true,pendingKwh:0,pendingCost:0,powerSamples:[],startedAt:now};
    }
    if(this._jobTracking){
      const t=this._jobTracking;
      // On completion, freeze the last estimate instead of clearing it on idle.
      if(!trackingActive&&!offline&&t.wasActive){
        t.usedKwh+=Number(t.pendingKwh)||0;
        t.cost+=Number(t.pendingCost)||0;
        t.pendingKwh=0;t.pendingCost=0;
        t.completedAt=now;
      }
      const hours=Math.max(0,Math.min((now-(Number(t.lastTick)||now))/3600000,1/60));
      if(t.lastState==="printing"&&printing&&Number.isFinite(t.lastPower)&&t.lastPower>=0){
        const estimated=t.lastPower*hours/1000;
        t.pendingKwh=(Number(t.pendingKwh)||0)+estimated;
        if(Number.isFinite(t.lastPrice)&&t.lastPrice>=0)t.pendingCost=(Number(t.pendingCost)||0)+estimated*t.lastPrice;
      }
      if(trackingActive&&printing&&power!==null){
        if(!Array.isArray(t.powerSamples))t.powerSamples=[];
        if(!t.powerSamples.length||now-t.powerSamples[t.powerSamples.length-1].t>=15000){
          t.powerSamples.push({t:now,w:power,kwh:t.usedKwh+(Number(t.pendingKwh)||0),eur:t.cost+(Number(t.pendingCost)||0)});
          if(t.powerSamples.length>240)t.powerSamples=t.powerSamples.filter((_,i)=>i%2===0).slice(-240);
        }
      }
      t.lastTick=now;t.lastPower=power;t.lastPrice=price;t.lastState=offline?t.lastState:normalizedState;t.wasActive=offline?t.wasActive:trackingActive;
      if(jobName&&trackingActive)t.jobName=jobName;
      try{localStorage.setItem(trackingKey,JSON.stringify(t));}catch(e){}
    }
    // Material estimate: slicer grams per tool × Spoolman filament price / spool filament weight.
    // Snapshot per job so subsequent spool changes do not alter a finished print.
    const materialRows=[0,1,2,3].map(i=>{
      const spoolId=Number(Array.isArray(c.spoolman_spool_ids)?c.spoolman_spool_ids[i]:null);
      const attrs=spoolId>0?this._hass?.states?.["sensor.spoolman_spool_"+spoolId]?.attributes:null;
      const grams=required[i];
      const filamentPrice=Number(attrs?.filament_price);
      const filamentWeight=Number(attrs?.filament_weight);
      const validPrice=attrs?.filament_price!==null&&attrs?.filament_price!==undefined&&Number.isFinite(filamentPrice)&&filamentPrice>=0;
      const validWeight=Number.isFinite(filamentWeight)&&filamentWeight>0;
      return {tool:i,spoolId,grams,unitCost:validPrice&&validWeight?filamentPrice/filamentWeight:null};
    });
    if(this._jobTracking){
      const t=this._jobTracking;
      if(trackingActive&&!offline){
        if(!Array.isArray(t.materialRows))t.materialRows=[null,null,null,null];
        for(const row of materialRows){
          if(row.grams!==null&&row.grams>0&&row.unitCost!==null&&(!t.materialRows[row.tool]||t.materialRows[row.tool].grams!==row.grams))
            t.materialRows[row.tool]=row;
        }
        t.lastProgress=Math.max(Number(t.lastProgress)||0,progressValid?progress:0);
      }
      if(!trackingActive&&!offline&&t.completedAt&&Number(t.lastProgress)>=99)t.lastProgress=100;
      try{localStorage.setItem(trackingKey,JSON.stringify(t));}catch(e){}
    }
    const materialTracked=this._jobTracking?.materialRows||[];
    const materialRequired=materialTracked.filter(row=>row&&row.grams>0);
    const materialKnown=materialRequired.length>0&&materialRequired.every(row=>row.unitCost!==null)&&materialRows.filter(row=>row.grams!==null&&row.grams>0).every(row=>row.unitCost!==null);
    const showLastJob=trackingActive||(!offline&&["complete","cancelled","error"].includes(normalizedState)&&Boolean(this._jobTracking?.completedAt));
    const materialCost=showLastJob&&materialKnown?materialRequired.reduce((sum,row)=>sum+row.grams*row.unitCost,0):null;
    const energyUsed=showLastJob&&this._jobTracking?this._jobTracking.usedKwh+(Number(this._jobTracking.pendingKwh)||0):null;
    const jobCost=showLastJob&&this._jobTracking?this._jobTracking.cost+(Number(this._jobTracking.pendingCost)||0):null;
    const money=v=>v===null?"--":v.toLocaleString(lang==="es"?"es-ES":"en-US",{minimumFractionDigits:3,maximumFractionDigits:3})+" €";
    const combinedCost=jobCost!==null&&materialCost!==null?jobCost+materialCost:null;
    const samples=Array.isArray(this._jobTracking?.powerSamples)?this._jobTracking.powerSamples:[];
    const spark=(key,color)=>{if(samples.length<2)return '<span class="chart-empty">—</span>';const vals=samples.map(p=>Number(p[key])||0);const max=Math.max(0.001,...vals),min=Math.min(0,...vals);const pts=vals.map((v,i)=>((i/(vals.length-1))*100).toFixed(2)+","+((1-(v-min)/(max-min||1))*42+3).toFixed(2)).join(" ");return '<svg viewBox="0 0 100 48" preserveAspectRatio="none" role="img" aria-label="Trend"><polyline points="'+pts+'" fill="none" stroke="'+color+'" stroke-width="1.8" vector-effect="non-scaling-stroke"/></svg>';};
    const chartsHtml=samples.length>1?`<details class="energy-charts"><summary>${lang==="es"?"📈 Gráficos de impresión":"📈 Print charts"}</summary><div class="chart-grid"><div><small>${lang==="es"?"Potencia (W)":"Power (W)"}</small>${spark("w","#65c9ff")}</div><div><small>${lang==="es"?"Energía (kWh)":"Energy (kWh)"}</small>${spark("kwh","#a5e6b0")}</div><div><small>${lang==="es"?"Coste eléctrico (€)":"Electricity cost (€)"}</small>${spark("eur","#ffc88a")}</div></div><small class="chart-note">${lang==="es"?"Muestras tomadas mientras la tarjeta está abierta":"Samples collected while the card is open"}</small></details>`:"";
    const energyLabel=lang==="es"?"Energía impresión":"Print energy";
    const energyText=energyUsed===null?"—":energyUsed.toLocaleString(lang==="es"?"es-ES":"en-US",{minimumFractionDigits:3,maximumFractionDigits:3})+" kWh";
    const electricityHtml=c.show_energy!==false?`<div class="electricity"><div class="electricity-usage"><span>⚡ ${lang==="es"?"Potencia":"Power"}: <b>${power===null?"—":Math.round(power)+" W"}</b></span><span>${energyLabel}: <b>${energyText}</b></span></div><div class="electricity-costs"><span>${lang==="es"?"Electricidad":"Electricity"}: <b>${money(jobCost)}</b></span><span>${lang==="es"?"Material":"Material"}: <b>${money(materialCost)}</b></span><span class="total-print-cost">${lang==="es"?"Total":"Total"}: <b>${money(combinedCost)}</b></span></div></div>`:"";
    const filamentHtml=filamentCheck.length?`<div class="filament-check">${filamentCheck.map(f=>`<span class="${f.unused?"unknown":f.unknown?"unknown":f.low?"low":"ok"}">T${f.i}: ${f.unused?"-- / --":(f.available===null?"sin lectura":Math.round(f.available)+" g")+" / "+Math.round(f.needed)+" g "+(f.unknown?"?":f.low?"⚠":"✓")}</span>`).join("")}</div>`:"";
    const warningsHtml=warnings.length?`<div class="printer-warnings" role="alert">⚠ ${warnings.map(w=>this.esc(w)).join(" · ")}</div>`:"";
    const jobHtml=(printing||paused)&&jobName?`<div class="job-summary">${thumbUrl?`<img src="${this.esc(thumbUrl)}" alt="Vista previa de la pieza" loading="lazy">`:""}<div><small>Trabajo actual</small><strong title="${this.esc(jobName)}">${this.esc(jobName)}</strong><span>Finalización estimada: ${eta}${etaConfidence}</span></div></div>`:"";
    // The current print thumbnail is already shown in the job summary.
    // Do not render a duplicate preview panel, including when idle.
    const previewHtml="";
    const cameraHtml=c.show_camera!==false&&powerState==="on"&&cameraUrl?`<details class="camera-panel" ${this._cameraOpen?"open":""}><summary>📷 Cámara de la impresora</summary><img class="camera-image" src="${this.esc(cameraUrl)}" data-camera-base="${this.esc(cameraUrl)}" alt="Cámara Snapmaker U1" loading="eager" role="button" tabindex="0" title="${lang==="es"?"Ampliar cámara":"Enlarge camera"}"></details><div class="camera-zoom" ${this._cameraZoomOpen?"":"hidden"} role="dialog" aria-modal="true" aria-label="${lang==="es"?"Cámara ampliada":"Enlarged camera"}"><div class="camera-zoom-toolbar"><button class="camera-fullscreen" type="button">${lang==="es"?"Pantalla completa":"Fullscreen"}</button><button class="camera-zoom-close" type="button" aria-label="${lang==="es"?"Cerrar":"Close"}">✕</button></div><img class="camera-zoom-image" src="${this.esc(cameraUrl)}" data-camera-base="${this.esc(cameraUrl)}" alt="Snapmaker U1"></div>`:"";
    const guiHtml=c.gui_camera&&powerState==="on"&&guiCameraUrl?`<details class="gui-screen" ${this._guiOpen?"open":""}><summary>🖥️ ${lang==="es"?"Pantalla de la impresora":"Printer screen"}</summary><img src="${this.esc(guiCameraUrl)}" alt="Snapmaker U1 GUI" loading="lazy" style="display:block;width:100%;height:auto;max-height:400px;object-fit:contain;margin-top:10px;border-radius:8px"></details>`:"";
    const inventoryHtml=showInventory&&inventory.length?`<details class="inventory" ${this._inventoryOpen?"open":""}><summary>Inventario Spoolman <span>${inventory.length} bobinas</span></summary><div class="inventory-grid">${inventory.map(item=>`<div class="inventory-item"><span class="inventory-reel" style="--filament:${item.color}"></span><div class="inventory-info"><b>${this.esc(item.name)}</b><small>${this.esc(item.vendor)}</small><strong>${Math.round(item.grams)} g</strong></div></div>`).join("")}</div></details>`:"";
    this.shadowRoot.innerHTML=`<style>
      :host{display:block;color:#edf5ff;font-family:system-ui,sans-serif}
      ha-card{background:linear-gradient(145deg,#152536,#09111b);color:inherit;border:1px solid #31485c;border-radius:20px;padding:20px;overflow:hidden}
      /* Powered-off minimalist view: keep only the power control, printer illustration, spools and Spoolman inventory. */
      ha-card.power-off .top>:not(.power-toggle){display:none!important}
      ha-card.power-off .top{justify-content:flex-start}
      ha-card.power-off .progress-top,ha-card.power-off .metrics,ha-card.power-off .job,ha-card.power-off .filament,ha-card.power-off .warnings,ha-card.power-off .electricity,ha-card.power-off .controls,ha-card.power-off .preview,ha-card.power-off .camera-panel,ha-card.power-off .gui-screen,ha-card.power-off .led-control{display:none!important}
      .inventory{margin-top:16px;border:1px solid #334a5b;border-radius:12px;padding:10px 12px;background:#0c1a27}.inventory summary{cursor:pointer;font-size:13px;font-weight:700;display:flex;justify-content:space-between;align-items:center}.inventory summary span{color:#91afc1;font-size:11px}.inventory-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:9px;margin-top:12px}.inventory-item{display:flex;align-items:center;gap:10px;padding:9px;background:#172a3a;border-radius:10px;min-width:0}.inventory-reel{width:34px;height:34px;flex:none;border-radius:50%;background:radial-gradient(circle at center,#152535 0 20%,#7c8790 22% 29%,var(--filament) 31% 70%,#647584 72% 78%,#1b2b38 80%);box-shadow:0 2px 8px #0007}.inventory-info{display:flex;flex-direction:column;min-width:0;gap:2px}.inventory-info b{font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.inventory-info small{font-size:10px;color:#9cb2c2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.inventory-info strong{font-size:11px;color:#d7e8f3}
      .electricity{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;font-size:11px}.electricity-usage,.electricity-costs{display:flex;flex-wrap:wrap;gap:8px;width:100%}.electricity-costs span{flex:1 1 80px;min-width:0}@media(max-width:550px){.electricity-costs{flex-wrap:nowrap;gap:5px}.electricity-costs span{font-size:10px;padding:7px 5px;white-space:nowrap;text-align:center}}.electricity span{background:#162c3e;border:1px solid #33495c;border-radius:8px;padding:8px}.filament-check{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;font-size:11px}.filament-check span{padding:6px 8px;border-radius:7px;background:#193b30}.filament-check .low{background:#603223;color:#ffe3bf}.compact{padding:11px!important}.compact .top{margin-bottom:2px}.compact .title{font-size:14px;letter-spacing:.055em}.compact .status{font-size:11px}.compact .scene-layout{grid-template-columns:minmax(44px,1fr) minmax(0,2.8fr) minmax(44px,1fr);gap:2px;max-width:320px;margin:0 auto}.compact .scene{max-width:205px;margin:1px auto 0}.compact .tool{transform:scale(.82);transform-origin:center center}.compact .tools-side{gap:2px}.compact .filament-overlay{opacity:.8}.compact .metrics{grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;margin-top:3px}.compact .metric{padding:5px 4px;border-radius:7px}.compact .metric label{font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.compact .metric b{font-size:11px;white-space:nowrap}.compact .electricity{gap:4px;margin-top:5px;font-size:10px}.compact .electricity span{padding:5px}.compact .printer-controls{gap:4px;margin-top:6px}.compact .printer-action{padding:6px 2px;font-size:10px;gap:2px;border-radius:7px}.compact .printer-action span{font-size:16px}.compact .preview-panel,.compact .camera-panel,.compact .inventory{margin-top:5px;padding:7px;border-radius:8px}.compact .filament-check{margin-top:4px;gap:4px}.compact .bar{margin-top:7px}.compact .foot{font-size:10px}.compact .inventory[open]{padding:8px}@media(max-width:350px){.compact .metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.compact .scene{max-width:180px}.compact .tool{transform:scale(.74)}}
      .preview-panel{margin-top:10px;border:1px solid #344b5e;border-radius:10px;padding:10px;background:#102131}.preview-panel summary{cursor:pointer;font-size:12px;font-weight:650}.preview-body{display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 4px;color:#b5c7d8;font-size:12px}.preview-body img{width:100%;max-height:260px;object-fit:contain;border-radius:8px;background:#06121b}.preview-body strong{max-width:100%;overflow-wrap:anywhere}.preview-body small{color:#a7bece}
      .empty-slot{width:43px;height:78px;border:1px dashed #516778;border-radius:9px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#8ba3b6;font-size:13px}.empty-slot small{font-size:10px}.printer-warnings{margin-top:10px;padding:10px;border:1px solid #d48b50;border-radius:10px;background:#4b2b20;color:#ffe1c1;font-size:12px}.job-summary{display:flex;align-items:center;gap:10px;margin-top:10px;padding:9px;border:1px solid #304658;border-radius:10px;background:#132536;min-width:0}.job-summary img{width:70px;height:70px;object-fit:contain;border-radius:7px;background:#081522}.job-summary>div{display:flex;flex-direction:column;gap:4px;min-width:0}.job-summary small,.job-summary span{font-size:11px;color:#a7bece}.job-summary strong{font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}.camera-panel{margin-top:10px;border:1px solid #344b5e;border-radius:10px;padding:10px;background:#102131}.camera-panel summary{cursor:pointer;font-size:12px;font-weight:650}.energy-charts{margin:10px 0;padding:10px;border:1px solid #344b5e;border-radius:10px;background:#102131}.energy-charts summary{cursor:pointer;font-weight:650}.chart-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-top:12px}.chart-grid>div{min-width:0}.chart-grid small{display:block;color:#b5cbd9}.chart-grid svg{width:100%;height:75px;display:block;margin-top:4px;background:#071723;border-radius:6px}.chart-note{color:#93a8b8;display:block;margin-top:8px}
      .camera-image{width:100%;height:auto;max-height:300px;object-fit:contain;margin-top:10px;border-radius:8px;background:#06121b;cursor:zoom-in}
      .camera-zoom[hidden]{display:none!important}.camera-zoom{position:fixed;inset:0;z-index:9999;background:rgba(2,8,15,.96);display:flex;align-items:center;justify-content:center;padding:54px 12px 12px;box-sizing:border-box}
      .camera-zoom-image{max-width:100%;max-height:100%;object-fit:contain}.camera-zoom-toolbar{position:absolute;top:10px;right:14px;display:flex;gap:8px}
      .camera-zoom-toolbar button{background:#203c53;color:#fff;border:1px solid #64809a;border-radius:8px;padding:8px 12px;cursor:pointer}
      .top{display:flex;align-items:center;justify-content:space-between;gap:12px}.title{font-size:18px;font-weight:750;letter-spacing:.08em}.status{font-size:12px;color:#a5b9c8}
      .scene{margin:12px auto 8px;width:min(360px,100%);height:auto;position:relative;transition:filter .5s,opacity .5s}.machine{display:block;width:100%;height:auto;filter:drop-shadow(0 8px 16px #0007)}
      .print-carriage{transform-origin:center;will-change:transform}.print-carriage.moving{animation:carriage-sweep 3.2s ease-in-out infinite}@keyframes carriage-sweep{0%,100%{transform:translateX(0)}25%{transform:translateX(73px)}50%{transform:translateX(0)}75%{transform:translateX(-73px)}}.filament-track{stroke-dasharray:7 8;animation:filament-move 1.1s linear infinite;opacity:.9;filter:drop-shadow(0 0 3px #d1e8ff)}@keyframes filament-move{to{stroke-dashoffset:-30}}.head-planned:not(.head-printing){filter:drop-shadow(0 0 2px var(--head-color))}.head-printing{filter:drop-shadow(0 0 6px var(--head-color))}.scene.offline{opacity:.55}.scene-layout.offline .tool{opacity:.55}.scene-layout.offline .filament-overlay{opacity:.5}.printer{height:100%;border:9px solid #506779;border-radius:13px 13px 5px 5px;background:linear-gradient(140deg,#23394c,#0b1722);box-shadow:inset 0 0 0 4px #101b28,0 8px 24px #0008;position:relative}
      .printer:before{content:"";position:absolute;left:12%;right:12%;bottom:19%;height:8px;background:#738e9d;box-shadow:0 4px 9px #000}
      .printer:after{content:"U1";position:absolute;left:46%;top:20%;font-size:13px;background:#152533;padding:12px 5px 20px;border-radius:4px;box-shadow:0 0 12px #5da0ca55}
      .metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:10px}.metric{background:#142536;border:1px solid #304658;border-radius:10px;padding:6px 9px;min-height:0}.metric label{display:block;color:#9fb4c4;font-size:11px}.metric b{display:block;font-size:14px;margin-top:2px}
      .hot-active{border-color:#73b9e5;background:#1b3245}.printer-controls{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:10px}.printer-action{border:1px solid #47637a;border-radius:10px;background:#1a3449;color:#e9f6ff;padding:10px 3px;font:600 11px system-ui;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px}.printer-action span{font-size:19px}.printer-action.cancel{border-color:#a37d51}.printer-action.emergency{background:#69262b;border-color:#d66a6a;color:white}.printer-action:disabled{opacity:.35;cursor:not-allowed}.scene-layout{position:relative;display:grid;grid-template-columns:minmax(68px,1fr) minmax(0,4.1fr) minmax(68px,1fr);gap:5px;align-items:center;margin-top:14px;isolation:isolate}.scene-layout .tools-side:first-child{margin-right:0;z-index:2}.scene-layout .tools-side:last-child{margin-left:0;z-index:2}.filament-overlay{position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none;overflow:visible}.scene-layout .scene{z-index:1;transform:scale(1.02);filter:drop-shadow(0 9px 10px #0008)}.tools-side{display:flex;flex-direction:column;gap:12px;min-width:0}.scene-layout .scene{width:100%;margin:0}.tool{border:0;border-radius:9px;padding:5px 1px;background:transparent;display:flex;align-items:center;flex-direction:column;gap:5px;min-width:0}
      .tool.planned:not(.selected) .spool-side{filter:drop-shadow(0 0 5px var(--filament))}.tool-planned{font-style:normal;font-size:9px;color:#a8cde4;white-space:nowrap}.tool.selected{background:transparent;box-shadow:none}.spool-side{position:relative;width:43px;height:78px;transform:perspective(160px) rotateY(-17deg);filter:drop-shadow(0 3px 5px #0008)}.tools-side:last-child .spool-side{transform:perspective(160px) rotateY(17deg)}.spool-winding{position:absolute;left:5px;right:5px;top:7px;bottom:7px;border-radius:8px;background:repeating-linear-gradient(0deg,color-mix(in srgb,var(--filament) 72%,#111) 0px,var(--filament) 3px,color-mix(in srgb,var(--filament) 60%,#000) 5px);box-shadow:inset 3px 0 5px #0007,inset -3px 0 4px #fff3}.spool-rim{position:absolute;z-index:2;left:0;top:1px;bottom:1px;width:6px;border-radius:45%;background:linear-gradient(90deg,#aeb7bc,#414b54);border:1px solid #8b979f}.spool-side:after{content:"";position:absolute;inset:12px 8px;border:1px solid #ffffff24;border-radius:4px;pointer-events:none}.spool-rim.rear{left:auto;right:0;background:linear-gradient(90deg,#48515a,#a4b0b8)}.feeding .spool-winding{animation:filament-flow 1.8s linear infinite}.feeding .spool-side{filter:drop-shadow(0 0 8px var(--filament))}@keyframes filament-flow{50%{filter:brightness(1.35);background-position:0 8px}}.tool small{font-size:10px;color:#a7b8c8;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tool span{font-size:11px}.bar{height:7px;border-radius:8px;background:#304456;margin-top:18px;overflow:hidden}.bar>div{height:100%;background:#49b8fa;transition:width .4s}.foot{margin-top:8px;color:#b8c9d7;font-size:12px;display:flex;justify-content:space-between}
      @media(prefers-reduced-motion:reduce){.feeding,.feeding .spool-winding,.filament-track,.print-carriage.moving{animation:none}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{opacity:.35}}
      @media(max-width:480px){ha-card{padding:12px}.scene-layout{grid-template-columns:minmax(57px,1fr) minmax(0,3.8fr) minmax(57px,1fr);gap:3px}.spool-side{width:28px;height:56px}.spool-winding{top:5px;bottom:5px}.tool{padding:6px 2px}.tool small{font-size:9px}.tool span{font-size:9px}}
    
      /* Neutral theme-aware surfaces inspired by EV Builder Card. */
      :host{--u1-surface:var(--card-background-color,#fff);--u1-text:var(--primary-text-color,#222);--u1-muted:var(--secondary-text-color,#666);--u1-tile:var(--secondary-background-color,#e8e8e8);--u1-line:var(--divider-color,#d6d6d6);--u1-accent:var(--primary-color,#03a9d8);color:var(--u1-text)}
      ha-card{background:var(--u1-surface);color:var(--u1-text);border:1px solid var(--u1-line);border-radius:14px;padding:16px;box-shadow:none}
      .metric{background:var(--u1-tile);border:1px solid transparent;border-radius:18px;padding:8px 12px;color:var(--u1-text)}
      .metric label{color:var(--u1-muted)}.metric b{color:var(--u1-text)}
      .metric.hot-active{background:color-mix(in srgb,var(--u1-accent) 15%,var(--u1-surface));border-color:var(--u1-accent)}
      .printer-action{background:var(--u1-tile);color:var(--u1-text);border:1px solid var(--u1-line);border-radius:12px;transition:background .15s,border-color .15s}
      .printer-action:not(:disabled):hover{border-color:var(--u1-accent);background:color-mix(in srgb,var(--u1-accent) 12%,var(--u1-surface))}
      .printer-action.emergency{background:color-mix(in srgb,#d94141 14%,var(--u1-surface));border-color:#d94141;color:var(--u1-text)}
      .gui-screen{margin-top:10px;padding:10px;border:1px solid var(--u1-line);border-radius:10px;background:var(--u1-surface);color:var(--u1-text)}.gui-screen summary{cursor:pointer;font-size:12px;font-weight:650}\n      .inventory,.preview-panel,.camera-panel{background:var(--u1-surface);border:1px solid var(--u1-line);color:var(--u1-text)}
      .inventory-item{background:var(--u1-tile);color:var(--u1-text)}
      .inventory-info small,.inventory summary span{color:var(--u1-muted)}
      .top .title,.top .status{color:var(--u1-text)}

      /* Electricity pills: readable in both light and dark Home Assistant themes. */
      .electricity{color:var(--u1-text);gap:6px}
      .electricity span{background:var(--u1-tile);border:1px solid var(--u1-line);color:var(--u1-text);border-radius:14px;padding:8px 10px}
      .electricity span b{color:var(--u1-text);font-weight:750}

      /* EV Builder visual identity: cyan-blue accent on text and progress. */
      :host{--u1-accent:#00a6d6;--u1-accent-strong:#008dbd}
      .bar{background:color-mix(in srgb,var(--u1-accent) 16%,var(--u1-tile));border-radius:999px;overflow:hidden}
      .bar>div{background:var(--u1-accent)!important;border-radius:999px}
      .foot{color:var(--u1-accent-strong)}.foot span{color:var(--u1-accent-strong)}
      .electricity span{color:var(--u1-accent-strong)}.electricity span b{color:var(--u1-accent-strong)}
      /* Inventory readability: maintain contrast on light and dark themes. */
      .inventory-info{min-width:0}
      .inventory-info b{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;white-space:normal;overflow-wrap:anywhere;line-height:1.25;color:var(--u1-text)}
      .inventory-info small{color:var(--u1-muted);opacity:1}
      .inventory-info strong{display:block;color:var(--u1-text);font-weight:800;font-size:13px;opacity:1}
      .metric label{color:var(--u1-accent-strong)}
      .printer-action:not(:disabled):not(.emergency){color:var(--u1-accent-strong)}

      /* Current job: match the approved EV Builder-inspired light theme. */
      .job-summary{background:var(--u1-surface);border:1px solid var(--u1-line);color:var(--u1-text);border-radius:14px}
      .job-summary img{background:var(--u1-tile);border:1px solid var(--u1-line)}
      .job-summary small{color:var(--u1-accent-strong);font-weight:650}
      .job-summary strong{color:var(--u1-text)}
      .job-summary span{color:var(--u1-muted)}

      /* Filament estimates and active tool: neutral, high-contrast EV Builder look. */
      .filament-check span{background:var(--u1-tile);color:var(--u1-text);border:1px solid var(--u1-line);border-radius:14px;font-weight:650}
      .filament-check .ok{background:color-mix(in srgb,var(--u1-accent) 9%,var(--u1-surface));border-color:color-mix(in srgb,var(--u1-accent) 38%,var(--u1-line));color:var(--u1-accent-strong)}
      .filament-check .unknown{background:var(--u1-tile);color:var(--u1-muted)}
      .filament-check .low{background:color-mix(in srgb,#d67b22 13%,var(--u1-surface));border-color:#c77a25;color:var(--u1-text)}
      .tool.selected{background:transparent;border:0;box-shadow:none;padding:5px 1px}
      .tool-active-label{display:block;color:var(--u1-accent-strong);font-size:10px;font-weight:800;line-height:1.2;text-align:center;white-space:nowrap}
      .tool.selected .spool-side{filter:drop-shadow(0 0 5px var(--u1-accent))}
      .power-toggle{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;flex:none;border:1px solid var(--u1-line);border-radius:9px;background:var(--u1-tile);color:var(--u1-muted);cursor:pointer;padding:3px;transition:background .2s,color .2s,border-color .2s}.power-toggle:hover{background:var(--u1-surface)}.power-toggle.on{color:#37c976;border-color:color-mix(in srgb,#37c976 35%,var(--u1-line));background:color-mix(in srgb,#37c976 9%,var(--u1-tile))}.power-toggle:disabled{opacity:.45;cursor:not-allowed}.power-toggle svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}.update-notice{font-size:11px;font-weight:700;color:#ffe2a0;background:#6b451d;border:1px solid #a87834;border-radius:8px;padding:4px 8px;white-space:nowrap}
.led-control{display:flex;flex-direction:column;gap:8px;margin:4px auto 12px;padding:10px 12px;max-width:420px;border:1px solid var(--u1-line);border-radius:12px;background:var(--u1-tile);font-size:12px}.led-control.on{border-color:#b28b3d}.led-control .led-header{display:flex;align-items:center;gap:9px}.led-control .led-toggle{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border:0;border-radius:50%;background:transparent;color:var(--u1-muted);font-size:21px;cursor:pointer}.led-control .led-toggle{filter:grayscale(1) brightness(.65);opacity:.55}.led-control.on .led-toggle{filter:none;opacity:1;color:#eab748;background:color-mix(in srgb,#eab748 13%,transparent)}.led-control .led-toggle:disabled,.led-control input:disabled{opacity:.35;cursor:not-allowed}.led-control input[type=range]{width:100%;accent-color:#d7a73a;cursor:pointer}

</style><ha-card class="${c.display_mode==="compact"?"compact":""} ${powerState==="off"?"power-off":""}"><div class="top">${powerEntity?`<button class="power-toggle ${powerState==="on"?"on":""}" type="button" title="${powerState==="on"?"Apagar impresora":"Encender impresora"}" aria-label="${powerState==="on"?"Apagar impresora":"Encender impresora"}" ${!powerReady?"disabled":""}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v10M5.6 5.6a9 9 0 1 0 12.8 0"/></svg></button>`:""}${c.title===undefined?`<div class="title">SNAPMAKER U1</div>`:String(c.title).trim()?`<div class="title">${this.esc(c.title)}</div>`:""}${updateAvailable?`<div class="update-notice" title="Actualización disponible">⬆ ${lang==="es"?"Actualización disponible":"Update available"}</div>`:""}<div class="status">${displayStatus}</div></div><div class="scene-layout ${offline?"offline":""}"><svg class="filament-overlay" viewBox="0 0 600 350" preserveAspectRatio="none" aria-hidden="true">${filamentGuides}${filamentPaths}</svg><div class="tools-side">${leftTools}</div><div class="scene ${offline?"offline":""}">
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
</svg></div><div class="tools-side">${rightTools}</div></div><div class="progress-top" style="${powerState==="off"?"display:none":""}"><div class="bar"><div style="width:${progress}%"></div></div><div class="foot"><span>${(normalizedState==="standby"?"En espera":normalizedState==="ready"?"Disponible":this.esc(state))}</span><span>${progressValid?progress.toFixed(0)+"%":"—"}</span></div></div><div class="metrics" style="${powerState==="off"?"display:none":""}"><div class="metric"><label>Capa</label><b>${layer} / ${total}</b></div><div class="metric"><label>Tiempo restante</label><b>${remaining}</b></div><div class="metric"><label>Cama</label><b>${bed}</b></div><div class="metric"><label>Interior</label><b>${chamber}</b></div></div>${powerState==="off"?"":jobHtml+filamentHtml+warningsHtml+electricityHtml+chartsHtml+controlsHtml+previewHtml+cameraHtml+guiHtml}${powerState!=="off"&&ledEntity?`<div class="led-control ${ledOn?"on":""}"><div class="led-header"><button class="led-toggle" ${ledUnavailable?"disabled":""} aria-label="${ledOn?"Apagar luz LED":"Encender luz LED"}" title="${ledOn?"Apagar":"Encender"}">💡</button></div><input class="led-brightness" type="range" min="0" max="100" value="${ledBrightness}" ${ledUnavailable?"disabled":""} aria-label="${lang==="es"?"Brillo LED":"LED brightness"}"></div>`:""}${inventoryHtml}</ha-card>`;
    if(lang!=="es"){
      const walker=document.createTreeWalker(this.shadowRoot,NodeFilter.SHOW_TEXT);
      let node;while((node=walker.nextNode())){if(node.parentElement?.closest("style,script,svg"))continue;const next=cardTranslate(node.nodeValue,lang);if(next!==node.nodeValue)node.nodeValue=next;}
      for(const el of this.shadowRoot.querySelectorAll("[title]"))el.title=cardTranslate(el.title,lang);
    }
    // Open the complete Home Assistant entity details for the selected spool.
    for(const el of this.shadowRoot.querySelectorAll("[data-spool-tool]")){
      const openSpool=()=>{
        const i=Number(el.dataset.spoolTool);
        const id=Number(Array.isArray(c.spoolman_spool_ids)?c.spoolman_spool_ids[i]:null);
        const entity=id>0?"sensor.spoolman_spool_"+id:c["tool"+i+"_weight"];
        if(!entity||!this._hass?.states?.[entity])return;
        this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:true,composed:true,detail:{entityId:entity}}));
      };
      el.addEventListener("click",openSpool);
      el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openSpool();}});
      el.style.cursor="pointer";
    }
    const guiDetails=this.shadowRoot.querySelector("details.gui-screen");
    if(guiDetails){
      guiDetails.addEventListener("toggle",()=>{this._guiOpen=guiDetails.open;});
    }
    const powerButton=this.shadowRoot.querySelector("button.power-toggle");
    powerButton?.addEventListener("click",async()=>{
      if(this._commandPending||!powerReady)return;
      const turningOff=powerState==="on";
      if(turningOff){
        const currentPrint=this.read(c.print_state).toLowerCase();
        if(["printing","paused","pausing","resuming"].includes(currentPrint)){window.alert(lang==="es"?"No se puede apagar: hay una impresión activa o pausada.":"Cannot power off: a print is active or paused.");return;}
        if(!window.confirm(lang==="es"?"¿Apagar la impresora Snapmaker U1?":"Turn off the Snapmaker U1 printer?"))return;
      }
      this._commandPending=true;powerButton.disabled=true;
      try{await this._hass.callService("switch",turningOff?"turn_off":"turn_on",{entity_id:powerEntity});}
      catch(error){console.error("Snapmaker U1 power control failed",error);window.alert(lang==="es"?"No se pudo cambiar la alimentación de la impresora.":"Could not change printer power.");}
      finally{this._commandPending=false;}
    });
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
    const ledButton=this.shadowRoot.querySelector(".led-toggle");
    if(ledButton)ledButton.addEventListener("click",async()=>{
      if(!ledEntity||ledButton.disabled)return;
      ledButton.disabled=true;
      try{const isOn=this._hass?.states?.[ledEntity]?.state==="on";if(isOn)await this._hass.callService("light","turn_off",{entity_id:ledEntity});else {await this._hass.callService("light","turn_on",{entity_id:ledEntity});await this._hass.callService("light","turn_on",{entity_id:ledEntity,brightness_pct:100});}}
      catch(error){console.error("Snapmaker LED toggle failed",error);}
      finally{ledButton.disabled=false;}
    });
    const ledSlider=this.shadowRoot.querySelector(".led-brightness");
    if(ledSlider){
      const setLedLevel=async value=>{
        if(!ledEntity||ledUnavailable)return;
        const pct=Math.max(0,Math.min(100,Math.round(Number(value)||0)));
        try{
          if(pct===0)return; // Zero on the slider is never an implicit OFF; use the LED button.
          else {if(this._hass?.states?.[ledEntity]?.state!=="on")await this._hass.callService("light","turn_on",{entity_id:ledEntity});if(pct!==100)await this._hass.callService("light","turn_on",{entity_id:ledEntity,brightness_pct:pct});}
        }catch(error){console.error("Snapmaker LED brightness failed",error);}
      };
      // Handle pointer interactions ourselves. Native range events can reset the
      // thumb to zero while the light state is updating, issuing an unwanted OFF.
      let dragging=false;
      const valueAt=event=>{
        const rect=ledSlider.getBoundingClientRect();
        return rect.width?Math.round(Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width))*100):Number(ledSlider.value);
      };
      ledSlider.addEventListener("pointerdown",event=>{
        if(ledSlider.disabled)return;
        event.preventDefault();
        dragging=true;
        ledSlider.setPointerCapture?.(event.pointerId);
        ledSlider.value=String(valueAt(event));
      });
      ledSlider.addEventListener("pointermove",event=>{
        if(dragging)ledSlider.value=String(valueAt(event));
      });
      ledSlider.addEventListener("pointerup",event=>{
        if(!dragging)return;
        event.preventDefault();
        dragging=false;
        const pct=valueAt(event);
        ledSlider.value=String(pct);
        void setLedLevel(pct);
      });
      ledSlider.addEventListener("pointercancel",()=>{dragging=false;});
      ledSlider.addEventListener("change",event=>{
        if(event.isTrusted&&event.detail===0&&!dragging&&Number(ledSlider.value)>0)void setLedLevel(ledSlider.value);
      });
    }
    const previewDetails=this.shadowRoot.querySelector("details.preview-panel");
    if(previewDetails)previewDetails.addEventListener("toggle",()=>{this._previewOpen=previewDetails.open;});
    const cameraDetails=this.shadowRoot.querySelector("details.camera-panel");
    if(cameraDetails){
      cameraDetails.addEventListener("toggle",()=>{this._cameraOpen=cameraDetails.open;});
      const image=cameraDetails.querySelector("img.camera-image");
      if(image){
        const reveal=()=>{if(image.naturalWidth>0&&image.naturalHeight>0)cameraDetails.style.display="";};
        image.addEventListener("load",reveal);
        image.addEventListener("error",()=>{cameraDetails.style.display="none";});
        if(image.complete)reveal();
      }
    }
    const zoom=this.shadowRoot.querySelector(".camera-zoom");
    if(zoom){
      const closeZoom=()=>{this._cameraZoomOpen=false;zoom.hidden=true;if(document.fullscreenElement===zoom&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});};
      const openZoom=()=>{this._cameraZoomOpen=true;zoom.hidden=false;zoom.querySelector(".camera-zoom-close")?.focus();};
      const cameraImage=this.shadowRoot.querySelector("img.camera-image");
      cameraImage?.addEventListener("click",openZoom);
      cameraImage?.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openZoom();}});
      zoom.querySelector(".camera-zoom-close")?.addEventListener("click",closeZoom);
      zoom.addEventListener("click",e=>{if(e.target===zoom)closeZoom();});
      zoom.querySelector(".camera-fullscreen")?.addEventListener("click",()=>{if(!document.fullscreenElement&&zoom.requestFullscreen)zoom.requestFullscreen().catch(()=>{});else if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});});
      zoom.addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();closeZoom();}});
    }
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
    if((value===""||value===null)&&key!=="title")delete config[key];else config[key]=value??"";
    this._config=config;
    if(key==="language"){this._editorInitialized=true;this.render();}
    this.dispatchEvent(new CustomEvent("config-changed",{detail:{config},bubbles:true,composed:true}));
  }
  detectEntities(){
    const states=this._hass?.states||{};
    const all=Object.keys(states);
    const specs={printer_state:["sensor",["printer_state","printer_status"]],print_state:["sensor",["current_print_state","print_state"]],progress:["sensor",["progress"]],active_tool:["sensor",["active_tool"]],current_layer:["sensor",["current_layer"]],total_layers:["sensor",["total_layer"]],time_left:["sensor",["print_time_left","time_left"]],bed_temperature:["sensor",["bed_temperature"]],chamber_temperature:["sensor",["cavity_temp","chamber_temperature"]],filename:["sensor",["filename"]],print_eta:["sensor",["print_eta"]],thumbnail_camera:["camera",["thumbnail"]],live_camera:["camera",["case","live"]],exception_sensor:["binary_sensor",["exception"]],led_light_entity:["light",["led_cavity_led","snapmaker"]],update_available_sensor:["binary_sensor",["update_available_lava","update_available"]],pause_button:["button",["pause_print"]],resume_button:["button",["resume_print"]],cancel_button:["button",["cancel_print"]],emergency_button:["button",["emergency_stop"]],power_sensor:["sensor",["energy_power","printer_power"]],daily_energy_sensor:["sensor",["energy_today","daily_energy"]],energy_sensor:["sensor",["energy_total"]],electricity_price_sensor:["sensor",["precio_kwh","electricity_price"]]};
    for(let i=0;i<4;i++){
      specs["extruder"+(i+1)+"_temperature"]=["sensor",["head_"+i+"_nozzle_temperature","extruder"+(i+1)+"_temperature"]];
      for(const [k,terms,domain] of [["present",["slot_"+i+"_filament_present"],"binary_sensor"],["job_estimated",["slot_"+i+"_job_filament_estimated"],"sensor"],["color",["u1_t"+i+"_color"],"sensor"],["weight",["u1_t"+i+"_peso","u1_t"+i+"_weight"],"sensor"],["material",["t"+i+"_filamento_display"],"sensor"]])specs["tool"+i+"_"+k]=[domain,terms];
    }
    const printerIds=all.filter(id=>/snapmaker|lava/i.test(id));
    const prefixGroups=new Map();
    for(const id of printerIds){const m=id.match(/(?:snapmaker_u1|u1)_[a-z0-9_]+/i);if(m){const prefix=m[0].replace(/_(?:despacho|office|printer|impresora)$/i,"");prefixGroups.set(prefix,(prefixGroups.get(prefix)||0)+1);}}
    const candidates={};const ambiguous=[];const detected={};
    for(const [key,[domain,terms]] of Object.entries(specs)){
      const matches=all.filter(id=>id.startsWith(domain+".")&&terms.some(t=>id.includes(t)));
      const scoped=matches.filter(id=>/snapmaker|lava|spoolman|u1_/i.test(id));
      const pool=scoped.length?scoped:matches;
      const ranked=pool.map(id=>({id,score:(/snapmaker|lava|u1_/i.test(id)?5:0)+(id.includes("snapmaker_u1")?3:0)+(terms.some(t=>id.endsWith(t))?2:0)})).sort((a,b)=>b.score-a.score);
      if(ranked.length===1||ranked.length>1&&ranked[0].score>ranked[1].score&&ranked[0].score>=5){detected[key]=ranked[0].id;}
      else if(ranked.length>0){ambiguous.push(key);candidates[key]=ranked.map(x=>x.id);}
    }
    const required=["printer_state","print_state"];
    return {detected,ambiguous,candidates,required,optional:["Lava","Spoolman","Cámara","Energía"],counts:{printer:printerIds.length,lava:all.filter(x=>x.includes("_lava")).length,spoolman:all.filter(x=>x.includes("spoolman")).length,camera:all.filter(x=>x.startsWith("camera.")&&/snapmaker|u1/i.test(x)).length}};
  }
  applyDetection(){
    const result=this.detectEntities();const changes={};
    for(const [key,id] of Object.entries(result.detected))if(!this._config[key])changes[key]=id;
    if(Object.keys(changes).length){this._config={...this._config,...changes};this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:{...this._config}},bubbles:true,composed:true}));}
    this._detectionResult={...result,applied:Object.keys(changes).length};
    this.renderWizard();
  }
  renderWizard(){
    const es=cardLanguage(this._config,this._hass)==="es";
    const lang=cardLanguage(this._config,this._hass);
    const tr=(esText,enText)=>lang==="es"?esText:(CARD_WIZARD_EXTRA_I18N[lang]?.[esText]||CARD_WIZARD_I18N[lang]?.[esText]||enText);
    const steps=[
      {title:tr("1. Impresora","1. Printer"),desc:tr("Selecciona las entidades principales para mostrar el estado de la Snapmaker U1.","Select the main entities to display your Snapmaker U1 status."),fields:[["printer_state",tr("Estado de la impresora","Printer status")],["print_state",tr("Estado de impresión","Print status")],["progress",tr("Progreso (%)","Progress (%)")],["active_tool",tr("Cabezal activo (T0–T3)","Active toolhead (T0–T3)")]]},
      {title:tr("2. Cabezales","2. Toolheads"),desc:tr("Asigna los sensores de temperatura. Puedes completar otros sensores más adelante.","Assign the temperature sensors. You can configure additional sensors later."),fields:[["extruder1_temperature",tr("Temperatura T0","T0 temperature")],["extruder2_temperature",tr("Temperatura T1","T1 temperature")],["extruder3_temperature",tr("Temperatura T2","T2 temperature")],["extruder4_temperature",tr("Temperatura T3","T3 temperature")]]},
      {title:tr("3. Funciones opcionales","3. Optional features"),desc:tr("La cámara, Spoolman y la electricidad se pueden configurar después en el editor avanzado.","Camera, Spoolman and electricity can also be configured later in the advanced editor."),fields:[["thumbnail_camera",tr("Miniatura","Thumbnail")],["live_camera",tr("Cámara","Camera")],["power_sensor",tr("Potencia eléctrica","Electric power")],["electricity_price_sensor",tr("Precio de electricidad","Electricity price")]]}
    ];
    const step=Math.max(0,Math.min(steps.length-1,this._wizardStep||0));const current=steps[step];const found=this._detectionResult;const safe=v=>String(v).replace(/[&<>"\x27]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","\x27":"&#39;"}[ch]));
    this.shadowRoot.innerHTML=`<style>:host{display:block;color:var(--primary-text-color)}.wizard{border:1px solid var(--divider-color);border-radius:12px;padding:16px}.wizard h3{margin:0 0 8px}.wizard p{color:var(--secondary-text-color);font-size:13px}.wizard label{display:block;font-size:13px;margin:14px 0 5px}ha-entity-picker{display:block;width:100%}input[data-card-title]{display:block;width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color)}.actions{display:flex;gap:8px;justify-content:space-between;margin-top:18px}button{padding:10px 14px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color);cursor:pointer}button.primary{background:var(--primary-color);color:var(--text-primary-color,#fff)}</style><div class="wizard"><label>${tr("Nombre de la tarjeta","Card name")}</label><input type="text" data-card-title placeholder="Snapmaker U1" value="${safe(this._config.title||"")}"><h3>${tr("Configuración inicial","Initial setup")} · ${current.title}</h3><p>${current.desc}</p>${step===0?`<p class="requirements-note">${tr("Para utilizar todas las funciones necesitas Moonraker y Lava. Spoolman es opcional.","For full functionality, configure Moonraker and Lava. Spoolman is optional.")}</p>`:""}<p>${tr("Paso","Step")} ${step+1} ${tr("de","of")} ${steps.length}</p><button type="button" data-detect>${tr("Detectar entidades automáticamente","Auto-detect entities")}</button>${found?`<p>${tr("Detectadas y aplicadas","Detected and assigned")}: ${found.applied}. ${tr("Revisión manual","Manual review")}: ${found.ambiguous.length}. Lava: ${found.counts.lava?tr("detectada","detected"):tr("no detectada","not detected")} · Spoolman: ${found.counts.spoolman?tr("detectada","detected"):tr("no detectada","not detected")} · ${tr("Cámara","Camera")}: ${found.counts.camera?tr("detectada","detected"):tr("no detectada","not detected")}. ${tr("Las coincidencias ambiguas no se asignan.","Ambiguous matches are not assigned.")}</p>`:""}<div class="fields">${current.fields.map(([key,label])=>`<label>${label}</label><ha-entity-picker data-key="${key}" allow-custom-entity></ha-entity-picker>`).join("")}</div><div class="actions"><button data-prev ${step===0?"disabled":""}>${tr("Anterior","Back")}</button><button class="primary" data-next>${step===steps.length-1?tr("Terminar","Finish"):tr("Siguiente","Next")}</button></div><p>${tr("Los campos opcionales pueden dejarse vacíos. La configuración avanzada siempre estará disponible.","Optional fields can be left empty. Advanced configuration remains available.")}</p></div>`;
    const wizardLang=document.createElement("select");wizardLang.setAttribute("aria-label","Language / Idioma");wizardLang.style.cssText="width:100%;padding:10px;border:1px solid var(--divider-color);border-radius:10px;background:var(--card-background-color);color:var(--primary-text-color);margin-bottom:14px;cursor:pointer";
    for(const [value,label] of [["auto","🌐 Auto · Home Assistant"],["en","🇬🇧 English"],["es","🇪🇸 Español"],["pt","🇵🇹 Português"],["fr","🇫🇷 Français"],["de","🇩🇪 Deutsch"],["it","🇮🇹 Italiano"],["nl","🇳🇱 Nederlands"]]){const opt=document.createElement("option");opt.value=value;opt.textContent=label;wizardLang.appendChild(opt);}
    wizardLang.value=this._config.language||"auto";wizardLang.addEventListener("change",()=>this.change("language",wizardLang.value));this.shadowRoot.querySelector(".wizard").prepend(wizardLang);
    translateEditor(this.shadowRoot,lang);
    for(const picker of this.shadowRoot.querySelectorAll("ha-entity-picker[data-key]")){
      const key=picker.dataset.key;picker.hass=this._hass;picker.value=this._config[key]||"";
      picker.addEventListener("value-changed",e=>{if(e.detail?.value!==undefined)this.change(key,e.detail.value);});
    }
    this.shadowRoot.querySelector("[data-card-title]")?.addEventListener("change",e=>this.change("title",e.target.value.trim()));
    this.shadowRoot.querySelector("[data-detect]").addEventListener("click",()=>this.applyDetection());
    this.shadowRoot.querySelector("[data-prev]").addEventListener("click",()=>{this._wizardStep=step-1;this.renderWizard();});
    this.shadowRoot.querySelector("[data-next]").addEventListener("click",()=>{
      if(step===0&&(!this._config.printer_state||!this._config.print_state)){
        this.shadowRoot.querySelector(".wizard p").textContent=tr("Selecciona el estado de la impresora y el estado de impresión para continuar.","Select the printer status and print status to continue.");return;
      }
      if(step<steps.length-1){this._wizardStep=step+1;this.renderWizard();}
      else{this.change("setup_complete",true);this.render();}
    });
  }
  render(){
    if(!this._config||!this._hass)return;
    // First-run wizard: only for a new, unconfigured card.
    if(this._wizardActive===undefined)this._wizardActive=this._config.setup_complete!==true&&(!this._config.printer_state||!this._config.print_state);
    if(this._wizardActive&&this._config.setup_complete!==true){
      this.renderWizard();return;
    }
    const languageRow=document.createElement("label");languageRow.style.cssText="display:block;margin:8px 0 14px";languageRow.textContent=cardLanguage(this._config,this._hass)==="es"?"Idioma / Language":"Language / Idioma";
    const languageSelect=document.createElement("select");languageSelect.style.cssText="display:block;width:100%;padding:12px;margin-top:8px;border:1px solid var(--divider-color);border-radius:12px;background:var(--card-background-color);color:var(--primary-text-color);font:inherit;cursor:pointer;min-height:44px";
    for(const [value,label] of [["auto","🌐 Auto · Home Assistant"],["es","🇪🇸 Español"],["en","🇬🇧 English"],["fr","🇫🇷 Français"],["de","🇩🇪 Deutsch"],["it","🇮🇹 Italiano"],["pt","🇵🇹 Português"],["nl","🇳🇱 Nederlands"]]){const opt=document.createElement("option");opt.value=value;opt.textContent=label;languageSelect.appendChild(opt);}
    languageSelect.value=this._config.language||"auto";languageSelect.addEventListener("change",()=>this.change("language",languageSelect.value));languageRow.appendChild(languageSelect);
    const sections=[
      ["Impresora y estado",[
        ["printer_state","Estado de la impresora"],["print_state","Estado de impresión"],["power_switch_entity","Interruptor de alimentación"],
        ["active_tool","Herramienta activa"],["progress","Progreso"],
        ["current_layer","Capa actual"],["total_layers","Capas totales"],
        ["time_left","Tiempo restante"],["bed_temperature","Temperatura de cama"],
        ["chamber_temperature","Temperatura interior"],["filename","Archivo de impresión"],["print_eta","Hora de finalización"],["thumbnail_camera","Cámara de miniatura"],["live_camera","Cámara interior"],["gui_camera","Pantalla GUI de la impresora"],["exception_sensor","Sensor de errores"],["led_light_entity","Luz LED de la impresora"],["update_available_sensor","Actualización disponible (Lava)"],["power_sensor","Potencia eléctrica (W)"],["daily_energy_sensor","Consumo diario (kWh)"],["energy_sensor","Energía acumulada (kWh)"]
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
    const es=(this._hass?.language||navigator.language||"en").toLowerCase().startsWith("es");
    if(!es){const terms={"Impresora y estado":"Printer and status","Estado de la impresora":"Printer status","Estado de impresión":"Print status","Herramienta activa":"Active tool","Progreso":"Progress","Capa actual":"Current layer","Capas totales":"Total layers","Tiempo restante":"Time remaining","Temperatura de cama":"Bed temperature","Temperatura interior":"Chamber temperature","Archivo de impresión":"Print file","Hora de finalización":"Finish time","Cámara de miniatura":"Thumbnail camera","Cámara interior":"Live camera","Sensor de errores":"Error sensor","Potencia eléctrica (W)":"Electric power (W)","Energía acumulada (kWh)":"Total energy (kWh)","Controles de impresión":"Print controls","Botón de pausa":"Pause button","Botón de reanudación":"Resume button","Botón de cancelar":"Cancel button","Botón de emergencia":"Emergency stop button","Presencia de filamento":"Filament presence","Filamento presente en T":"Filament present in T","Temperaturas de los cabezales":"Toolhead temperatures","Temperatura T":"Temperature T","Bobina T":"Spool T","Color del filamento":"Filament color","Peso del filamento":"Filament weight","Material":"Material","Filamento previsto para el trabajo":"Estimated filament for job"};for(const section of sections){section[0]=terms[section[0]]||section[0].replace("Bobina T","Spool T");for(const field of section[1]){field[1]=terms[field[1]]||field[1].replace("Filamento presente en T","Filament present in T").replace("Temperatura T","Temperature T");}}}
    const style=`<style>:host{display:block;color:var(--primary-text-color)}.group{border:1px solid var(--divider-color);border-radius:12px;padding:12px;margin:12px 0}.group summary{cursor:pointer;font-size:15px;font-weight:650;padding:4px 0;list-style-position:inside}.group[open] summary{margin-bottom:12px}h3{font-size:15px;margin:0 0 12px}label{display:block;font-size:13px;margin:10px 0 5px}ha-entity-picker{display:block;width:100%}input{width:100%;box-sizing:border-box;padding:10px;border:1px solid var(--divider-color);border-radius:8px;background:var(--card-background-color);color:var(--primary-text-color)}p{font-size:12px;color:var(--secondary-text-color)}</style>`;
    this.shadowRoot.innerHTML=style+`<label for="snapmaker-card-title">${es?"Nombre de la tarjeta":"Card name"}</label><input id="snapmaker-card-title" type="text" placeholder="" value="${String(this._config.title||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;")}">`+sections.map(([title,fields],index)=>`<details class="group" data-editor-group="${index}" ${this._openGroups?.has(String(index))?"open":""}><summary>${title}</summary>${fields.map(([key,label])=>`<label>${label}</label><ha-entity-picker data-key="${key}" allow-custom-entity></ha-entity-picker>`).join("")}</details>`).join("")+`<details class="group" data-editor-group="spoolman" ${this._openGroups?.has("spoolman")?"open":""}><summary>Spoolman (opcional)</summary><p>Introduce el ID de cada bobina de Spoolman. Si no utilizas Spoolman, deja estos campos vacíos.</p>${[0,1,2,3].map(i=>`<label>Bobina T${i} · ID de Spoolman</label><input data-spool="${i}" type="number" min="1" step="1" placeholder="Sin Spoolman"></input>`).join("")}</details>`;
    this.shadowRoot.prepend(languageRow);
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
    for(const [key,label] of [["camera_open_default","Cámara abierta por defecto"],["gui_open_default","Mostrar pantalla al iniciar"]]){
      const row=document.createElement("label");
      row.style.cssText="display:flex;align-items:center;gap:10px;margin:10px 0;padding:12px;border:1px solid var(--divider-color);border-radius:10px";
      const checkbox=document.createElement("input");checkbox.type="checkbox";checkbox.style.width="auto";checkbox.checked=this._config[key]===true;
      checkbox.addEventListener("change",()=>this.change(key,checkbox.checked));
      row.append(checkbox,document.createTextNode(label));this.shadowRoot.appendChild(row);
    }
    translateEditor(this.shadowRoot,cardLanguage(this._config,this._hass));
    this.shadowRoot.querySelector("#snapmaker-card-title")?.addEventListener("input",e=>this.change("title",e.target.value));
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
if(!window.customCards.some(card=>card.type==="snapmaker-u1-card"))window.customCards.push({type:"snapmaker-u1-card",name:"Snapmaker U1 Card",description:"Tarjeta para Snapmaker U1: cuatro cabezales, impresión, temperaturas, filamentos, cámara y controles. / Four-toolhead dashboard.",documentationURL:"https://github.com/sergey08/snapmaker-u1-card"});
