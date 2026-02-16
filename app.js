import { content } from './data.js';

const VALID_TABS = ['venue', 'schedule', 'hotels', 'transport', 'faq', 'gifts'];
const VALID_TRANSPORT_SUB_TABS = ['parking', 'airports', 'taxi', 'carpool'];

// Helper to get text based on current language
function getText(obj, lang) {
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj['en'] || '';
}

class WeddingApp {
    constructor() {
        this.lang = localStorage.getItem('preferred-lang') || 'en';
        this.activeTab = localStorage.getItem('active-tab') || 'venue';
        this.activeSubTab = localStorage.getItem('active-sub-tab') || 'parking';

        // Migration
        if (VALID_TRANSPORT_SUB_TABS.includes(this.activeTab)) {
            this.activeSubTab = this.activeTab;
            this.activeTab = 'transport';
        }

        if (!VALID_TABS.includes(this.activeTab)) this.activeTab = 'venue';
        if (!VALID_TRANSPORT_SUB_TABS.includes(this.activeSubTab)) this.activeSubTab = 'parking';

        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-lang', this.lang);
        this.render();
        this.attachGlobalListeners();
        this.updateLanguageToggles();
        this.startCountdown();
    }

    setLanguage(lang) {
        this.lang = lang;
        localStorage.setItem('preferred-lang', lang);
        document.documentElement.setAttribute('data-lang', lang);
        this.render(); // Re-render everything with new language
        this.updateLanguageToggles();
    }

    switchTab(tab) {
        if (!VALID_TABS.includes(tab)) return;
        this.activeTab = tab;
        localStorage.setItem('active-tab', tab);

        // If transport, preserve sub-tab
        if (tab === 'transport') {
            // Logic handled in render
        }

        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    switchSubTab(subTab) {
        if (!VALID_TRANSPORT_SUB_TABS.includes(subTab)) return;
        this.activeSubTab = subTab;
        localStorage.setItem('active-sub-tab', subTab);
        this.render();
    }

    attachGlobalListeners() {
        window.setLanguage = (lang) => this.setLanguage(lang);
        window.switchTab = (tab) => this.switchTab(tab);
        window.switchSubTab = (subTab) => this.switchSubTab(subTab);
    }

    updateLanguageToggles() {
        const enBtn = document.getElementById('lang-btn-en');
        const itBtn = document.getElementById('lang-btn-it');

        if (enBtn && itBtn) {
            if (this.lang === 'en') {
                enBtn.classList.remove('text-sage-400', 'hover:bg-white/40');
                enBtn.classList.add('text-sage-900', 'bg-white', 'shadow-sm');
                itBtn.classList.remove('text-sage-900', 'bg-white', 'shadow-sm');
                itBtn.classList.add('text-sage-400', 'hover:bg-white/40');
            } else {
                itBtn.classList.remove('text-sage-400', 'hover:bg-white/40');
                itBtn.classList.add('text-sage-900', 'bg-white', 'shadow-sm');
                enBtn.classList.remove('text-sage-900', 'bg-white', 'shadow-sm');
                enBtn.classList.add('text-sage-400', 'hover:bg-white/40');
            }
        }
    }

    render() {
        const main = document.getElementById('app-content');
        if (!main) return;

        main.innerHTML = '';

        // Render current active tab
        switch (this.activeTab) {
            case 'venue': main.appendChild(this.renderVenue()); break;
            case 'schedule': main.appendChild(this.renderSchedule()); break;
            case 'hotels': main.appendChild(this.renderHotels()); break;
            case 'transport': main.appendChild(this.renderTransport()); break;
            case 'faq': main.appendChild(this.renderFAQ()); break;
            case 'gifts': main.appendChild(this.renderGifts()); break;
        }

        // Update Nav State
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById(`tab-${this.activeTab}`);
        if (activeBtn) activeBtn.classList.add('active');
    }

    // --- Renderers ---

    renderVenue() {
        const data = content.venue;
        const l = this.lang;
        const div = document.createElement('div');
        div.id = 'view-venue';
        div.className = "animate-fade-in space-y-6";

        div.innerHTML = `
      <div class="text-center mb-4">
        <div class="inline-flex flex-wrap justify-center gap-3 text-sage-600 font-medium text-sm bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-sage-100/50 tracking-wide">
          <span>${data.meta.date}</span>
          <span class="text-sage-200">|</span>
          <span>${data.meta.time}</span>
          <span class="text-sage-200">|</span>
          <span>${data.meta.location}</span>
        </div>
      </div>

      <div class="glass-card p-8 md:p-10 rounded-3xl shadow-xl shadow-sage-900/5 border border-white/40">
        <div class="flex items-center gap-3 text-sage-400 mb-4">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
          <span class="uppercase tracking-[0.2em] text-[10px] font-black">Ceremony <span class="serif-italic lowercase text-xs">&amp;</span> Reception</span>
        </div>
        <h2 class="font-serif text-3xl md:text-4xl text-sage-800 mb-4 tracking-tight">${data.title}</h2>
        <div class="mb-8 overflow-hidden rounded-2xl shadow-md border border-white/20">
          <img src="${data.image}" alt="${data.title}" class="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-700">
        </div>
        <p class="text-sage-600 mb-8 leading-relaxed text-lg font-light">
          ${data.address.line1}<br>
          ${data.address.line2}
        </p>

        <div class="bg-sage-50/50 backdrop-blur-md border-l-2 border-sage-300 p-6 mb-8 rounded-r-2xl">
          <h3 class="font-bold text-sage-800 text-xs uppercase tracking-widest mb-2">${getText(data.arrivalInfo.title, l)}</h3>
          <p class="text-sage-600 text-sm leading-relaxed">${getText(data.arrivalInfo.text, l)}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <a href="${data.maps.google}" target="_blank" rel="noopener noreferrer" class="flex-1 inline-flex justify-center items-center px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-2xl text-white bg-sage-500 hover:bg-sage-600 transition-all duration-300 shadow-lg shadow-sage-200/50 hover:scale-[1.02] active:scale-95">
            ${l === 'en' ? 'Open Google Maps' : 'Apri Google Maps'}
          </a>
          <a href="${data.maps.directions}" target="_blank" rel="noopener noreferrer" class="flex-1 inline-flex justify-center items-center px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-2xl text-sage-600 bg-white border border-sage-100 hover:bg-sage-50 transition-all duration-300 shadow-sm hover:scale-[1.02] active:scale-95">
            ${l === 'en' ? 'Get Directions' : 'Ottieni Indicazioni'}
          </a>
        </div>
      </div>

      <div class="h-64 md:h-80 rounded-2xl overflow-hidden shadow-md border border-como-200 map-container relative">
        <iframe title="Map centered on wedding venue" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${data.maps.embed}"></iframe>
      </div>
    `;
        return div;
    }

    renderSchedule() {
        const data = content.schedule;
        const l = this.lang;
        const div = document.createElement('div');
        div.id = 'view-schedule';
        div.className = "animate-fade-in space-y-6";

        let timelineHtml = '';
        data.forEach(item => {
            timelineHtml += `
          <div class="relative flex flex-col md:flex-row items-center md:justify-between group">
            <div class="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-sage-100 border-2 border-sage-300 group-hover:bg-sage-500 transition-colors z-10 shadow-sm"></div>
            
            <div class="hidden md:flex w-5/12 justify-end text-right pr-12">
              <span class="text-sage-400 font-bold uppercase tracking-widest text-xs">${item.time}</span>
            </div>

            <div class="w-full md:w-5/12 pl-12 md:pl-12">
              <span class="md:hidden block text-sage-400 font-bold uppercase tracking-widest text-[10px] mb-1">${item.time}</span>
              <h3 class="text-xl font-serif text-sage-800">${getText(item.title, l)}</h3>
              <p class="text-sage-600 text-sm mt-1">${getText(item.description, l)}</p>
            </div>
          </div>
        `;
        });

        div.innerHTML = `
      <div class="glass-card p-8 md:p-12 rounded-3xl shadow-xl shadow-sage-900/5 border border-white/40">
        <div class="relative space-y-12 before:absolute before:inset-y-0 before:left-4 md:before:left-1/2 before:w-px before:bg-sage-200 pb-8">
          ${timelineHtml}
        </div>
      </div>
    `;
        return div;
    }

    renderHotels() {
        const data = content.hotels;
        const l = this.lang;
        const div = document.createElement('div');
        div.id = 'view-hotels';
        div.className = "animate-fade-in space-y-6";

        let staysHtml = '';
        data.smartStays.forEach(stay => {
            let badgeClass = stay.badgeColor === 'green' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';

            let linksHtml = '';
            if (stay.link) {
                linksHtml = `<a href="${stay.link.url}" target="_blank" class="text-como-600 font-bold hover:underline decoration-como-300">${stay.link.text} &rarr;</a>`;
            } else if (stay.links) {
                linksHtml = stay.links.map((link, idx) => `
                <a href="${link.url}" target="_blank" class="text-como-600 font-bold hover:underline decoration-como-300">${link.text} &rarr;</a>
                ${idx < stay.links.length - 1 ? '<span class="text-como-300 mx-2">|</span>' : ''}
              `).join('');
            }

            staysHtml += `
            <div class="bg-white border border-como-200 rounded-xl p-4 shadow-sm hover:border-como-400 transition-colors">
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-bold text-como-800">${stay.name}</h4>
                  <span class="text-[10px] font-bold uppercase ${badgeClass} px-2 py-0.5 rounded">
                    ${getText(stay.badge, l)}
                  </span>
                </div>
                <p class="text-sm text-como-600 mb-3">${getText(stay.description, l)}</p>
                <div class="bg-como-50 rounded-lg p-3 text-xs space-y-2">
                  <div class="flex items-center gap-2">
                    <span class="text-como-400">🕒</span>
                    <span class="font-medium text-como-700">${getText(stay.returnInfo, l)}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-como-400">🏨</span>
                    ${linksHtml}
                  </div>
                </div>
            </div>
          `;
        });

        div.innerHTML = `
        <div class="glass-card rounded-3xl shadow-xl shadow-sage-900/5 border border-white/40 overflow-hidden">
        <div class="p-8 bg-sage-50/30 border-b border-sage-100/50">
          <h2 class="font-serif text-3xl md:text-4xl text-sage-800 mb-8 flex items-center gap-4 tracking-tight">
            <span class="text-2xl grayscale opacity-50">🛎️</span>
            ${l === 'en' ? 'Accommodation' : 'Alloggi'}
          </h2>

          <div class="bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-sage-100/50 text-sm text-sage-700 leading-relaxed italic">
            <p>${getText(data.note, l)}</p>
          </div>
        </div>

        <div class="p-8 space-y-10">
          <div class="space-y-6">
            <h3 class="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-como-500">
              <span>💡</span>
              ${l === 'en' ? '"Smart Stay" Budget Options' : 'Opzioni di Soggiorno "Smart"'}
            </h3>
            <p class="text-xs text-como-500 -mt-4">
              ${l === 'en' ? 'Standard hotels in Como center can be expensive. These nearby spots offer great value and reliable transport.' : 'Gli hotel nel centro di Como possono essere costosi. Queste zone vicine offrono un ottimo valore e trasporti affidabili.'}
            </p>

            <div class="grid gap-4">
                ${staysHtml}
            </div>
          </div>
        </div>
      </div>
      `;
        return div;
    }

    renderTransport() {
        const data = content.transport;
        const l = this.lang;
        const div = document.createElement('div');
        div.id = 'view-transport';
        div.className = "animate-fade-in space-y-6";

        // Render Sub-Navigation
        const subNavHtml = `
      <div class="flex flex-wrap justify-center gap-2 mb-8 bg-white/30 backdrop-blur-sm p-2 rounded-3xl border border-white/50 max-w-2xl mx-auto shadow-sm">
        ${VALID_TRANSPORT_SUB_TABS.map(tab => {
            const isActive = this.activeSubTab === tab ? 'active' : '';
            return `<button onclick="switchSubTab('${tab}')" id="sub-tab-${tab}" class="sub-nav-btn ${isActive} px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full border border-transparent hover:bg-white/50">
                ${getText(data.subTabs[tab].title, l)}
            </button>`;
        }).join('')}
      </div>`;

        // Render Active Sub-Content
        let subContentHtml = `<div id="view-${this.activeSubTab}" class="sub-tab-content space-y-6">`;
        switch (this.activeSubTab) {
            case 'parking': subContentHtml += this.renderParking(data.subTabs.parking, l); break;
            case 'airports': subContentHtml += this.renderAirports(data.subTabs.airports, l); break;
            case 'taxi': subContentHtml += this.renderTaxi(data.subTabs.taxi, l); break;
            case 'carpool': subContentHtml += this.renderCarpool(data.subTabs.carpool, l); break;
        }
        subContentHtml += `</div>`;

        div.innerHTML = `
        <div class="max-w-2xl mx-auto mb-8">
            <div class="bg-orange-50/50 backdrop-blur-sm border border-orange-100 rounded-2xl p-4 md:p-6 shadow-sm flex items-start gap-4">
            <div class="text-2xl mt-1">⚠️</div>
            <div>
                <p class="text-orange-900 text-sm leading-relaxed mb-2">
                ${getText(data.safetyNote, l)}
                </p>
            </div>
            </div>
        </div>
        ${subNavHtml}
        ${subContentHtml}
      `;
        return div;
    }

    renderParking(data, l) {
        let optionsHtml = '';
        data.options.forEach((opt, idx) => {
            let busDetailsHtml = '';
            if (opt.busInfo) {
                const b = opt.busInfo;
                let toVenueSteps = b.instructions.toVenue.map((s, i) => `<li>${getText(s, l)}</li>`).join('');
                let returnSteps = b.instructions.return.map((s, i) => `<li>${getText(s, l)}</li>`).join('');

                busDetailsHtml = `
                <div class="mt-4 bg-white/70 border border-sage-100 rounded-xl p-4">
                    <div class="flex items-center gap-2 text-sage-600 mb-2">
                        <span class="uppercase tracking-wide text-[11px] font-bold">${b.title}</span>
                    </div>
                    <div class="text-sm text-sage-700 leading-relaxed space-y-2">
                        <div>
                           <p class="font-semibold text-sage-800">${l === 'en' ? 'Walk to the bus stop' : 'Camminate verso la fermata'}</p>
                           <p>${l === 'en' ? 'Bus stop' : 'Fermata'}: <strong>${getText(b.from, l)}</strong></p>
                        </div>
                        <div>
                             <p class="font-semibold text-sage-800">${l === 'en' ? 'To Como Yacht Club' : 'Verso il Como Yacht Club'}</p>
                             <ol class="list-decimal ml-5 space-y-1">${toVenueSteps}</ol>
                        </div>
                        ${returnSteps ? `
                        <div>
                             <p class="font-semibold text-sage-800">${l === 'en' ? 'Back to Como Central' : 'Ritorno a Como Central'}</p>
                             <ol class="list-decimal ml-5 space-y-1">${returnSteps}</ol>
                        </div>` : ''}
                        
                        <div class="pt-2 border-t border-sage-100">
                             <p class="font-semibold text-sage-800">${getText(b.lastBus.title, l)}</p>
                             <p class="text-sage-700">${b.lastBus.details}</p>
                        </div>
                    </div>
                </div>
              `;
            }

            optionsHtml += `
            <div class="p-8 hover:bg-sage-50/50 transition-colors duration-300">
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-sage-800 text-lg">${opt.name}</h4>
                <a href="${opt.mapUrl}" target="_blank" class="text-[9px] font-black uppercase tracking-widest bg-sage-100 text-sage-800 px-3 py-1.5 rounded-full hover:bg-sage-800 hover:text-white transition-colors">
                  ${l === 'en' ? 'View Map &rarr;' : 'Vedi Mappa &rarr;'}
                </a>
              </div>
              <p class="text-sm text-sage-500 font-light">${getText(opt.description, l)}</p>
              ${busDetailsHtml}
              <p class="inline-block mt-4 text-[10px] font-black text-sage-400 uppercase tracking-[0.2em]">${getText(opt.walkTime, l)}</p>
            </div>
          `;
        });

        return `
        <div class="glass-card rounded-3xl shadow-xl shadow-sage-900/5 border border-white/40 overflow-hidden">
          <div class="p-8 bg-sage-50/30 border-b border-sage-100/50">
            <h2 class="font-serif text-3xl md:text-4xl text-sage-800 mb-8 flex items-center gap-4 tracking-tight">
              <span class="text-2xl grayscale opacity-50">🅿</span>
              ${getText(data.heading, l)}
            </h2>
            <p class="text-sage-700 text-sm leading-relaxed max-w-2xl">${getText(data.intro, l)}</p>
          </div>
          <div class="divide-y divide-sage-100/30">
            ${optionsHtml}
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-sage-100/50 p-5">
            <div class="flex items-start gap-3">
                 <div class="mt-0.5 text-sage-500">
                 <!-- Icon -->
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 00.293.707l2 2a1 1 0 001.414-1.414L11 9.586V7a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                 </div>
                 <div>
                    <h3 class="font-bold text-sage-800 text-sm mb-1">${getText(data.busNote.title, l)}</h3>
                    <p class="text-sage-600 text-sm leading-relaxed">${getText(data.busNote.text, l)}</p>
                 </div>
            </div>
        </div>

        <div class="h-64 rounded-2xl overflow-hidden map-container shadow-sm border border-sage-100/50">
          <iframe title="Map with parking options" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${data.embedMap}"></iframe>
        </div>
      `;
    }

    renderAirports(data, l) {
        let listHtml = data.list.map(item => `
        <div class="pb-4 border-b border-como-50 last:border-0 last:pb-0">
            <div class="flex justify-between items-center mb-1">
                <strong class="text-lg text-como-800">${item.name}</strong>
                ${item.badge ? `<span class="text-[10px] font-bold uppercase bg-como-600 text-white px-2 py-0.5 rounded">${getText(item.badge, l)}</span>` : ''}
            </div>
            <span class="text-sm text-como-500">${getText(item.desc, l)}</span>
        </div>
      `).join('');

        let gettingToHtml = data.gettingToComo.options.map(opt => `
        <div class="${opt.title.includes('Malpensa') ? 'bg-como-50' : 'bg-white'} p-4 rounded-xl border border-como-100 ${!opt.title.includes('Malpensa') ? 'shadow-sm' : ''}">
            <h4 class="font-bold text-como-800 mb-2">${opt.title}</h4>
            <p class="text-sm text-como-600 mb-2">${getText(opt.text, l)}</p>
            <p class="text-xs italic text-como-400">${getText(opt.info, l)}</p>
        </div>
      `).join('');

        return `
        <div class="glass-card rounded-3xl shadow-xl shadow-sage-900/5 border border-white/40 overflow-hidden">
            <div class="p-8 bg-sage-50/30 border-b border-sage-100/50">
                <h2 class="font-serif text-3xl md:text-4xl text-sage-800 flex items-center gap-4 tracking-tight">
                    <span class="text-2xl grayscale opacity-50">✈️</span>
                    ${getText(data.heading, l)}
                </h2>
            </div>
            <div class="p-8 space-y-6">
                ${listHtml}
                <div class="mt-8 pt-6 border-t border-como-100">
                    <h3 class="font-serif text-lg text-como-800 mb-4">${getText(data.gettingToComo.title, l)}</h3>
                    <div class="grid gap-6">
                        ${gettingToHtml}
                    </div>
                </div>
            </div>
            <div class="h-64 rounded-b-2xl overflow-hidden map-container">
                <iframe title="Map with nearby airports" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${data.embedMap}"></iframe>
            </div>
        </div>
      `;
    }

    renderTaxi(data, l) {
        let servicesHtml = data.services.map(s => {
            let actionsHtml = '';
            if (s.actions) {
                actionsHtml = `<div class="space-y-4">` + s.actions.map(a => `
                <a href="${a.url}" ${a.primary ? '' : 'target="_blank" rel="noopener noreferrer"'} class="flex items-center justify-center gap-3 px-6 py-4 rounded-xl ${a.primary ? 'bg-sage-500 text-white shadow-md' : 'bg-white border border-sage-100 text-sage-600 hover:bg-sage-50'} font-bold tracking-widest uppercase text-[10px] hover:scale-[1.02] active:scale-95 transition-all">
                    ${getText(a.label, l)}
                </a>
             `).join('') + `</div>`;
                return `
                <div class="bg-white border border-sage-100 rounded-2xl p-6 shadow-sm">
                  <h3 class="font-bold text-sage-800 text-lg mb-2">${s.name}</h3>
                  <p class="text-sm text-sage-600 mb-6">${getText(s.desc, l)}</p>
                  ${actionsHtml}
                </div>
             `;
            } else if (s.links) {
                return `
                <div class="bg-sage-50/50 border border-sage-100/50 rounded-2xl p-6">
                    <h4 class="font-bold text-sage-800 text-sm uppercase tracking-widest mb-2">${s.name}</h4>
                    <p class="text-xs text-sage-600 leading-relaxed mb-3">${getText(s.desc, l)}</p>
                    <div class="flex flex-col gap-2">
                        ${s.links.map(link => `<a href="${link.url}" target="_blank" class="text-[10px] font-bold text-sage-500 hover:text-sage-800 underline uppercase tracking-widest">${getText(link.label, l)}</a>`).join('')}
                    </div>
                </div>
              `;
            } else {
                return `
                <div class="bg-white border border-sage-100 rounded-2xl p-6 shadow-sm">
                    <h4 class="font-bold text-sage-800 text-sm uppercase tracking-widest mb-2">${s.name}</h4>
                    <p class="text-xs text-sage-500 leading-relaxed">${getText(s.desc, l)}</p>
                </div>
              `;
            }
        }).join('');

        let ratesHtml = data.rates.destinations.map(d => `
        <div class="bg-white p-4 rounded-xl border border-como-50 shadow-sm text-center">
            <span class="block text-[10px] text-como-400 font-bold uppercase tracking-tighter">${d.name}</span>
            <span class="text-lg font-serif text-como-800">${d.price}</span>
        </div>
      `).join('');

        return `
        <div class="glass-card rounded-3xl shadow-xl shadow-sage-900/5 border border-white/40 overflow-hidden">
            <div class="p-8 bg-sage-50/30 border-b border-sage-100/50">
              <h2 class="font-serif text-3xl md:text-4xl text-sage-800 mb-8 flex items-center gap-4 tracking-tight">
                <span class="text-2xl grayscale opacity-50">🚕</span>
                ${getText(data.heading, l)}
              </h2>
               <p class="text-sage-700 text-sm leading-relaxed max-w-2xl">${getText(data.intro, l)}</p>
            </div>
            
            <div class="p-8 space-y-8">
                <div class="grid gap-6 md:grid-cols-2">
                    ${servicesHtml}
                </div>

                <div class="mt-8 bg-cream-50 border-l-4 border-sage-400 p-6 rounded-r-2xl">
                    <h3 class="font-bold text-sage-800 text-xs uppercase tracking-widest mb-2 italic">${getText(data.tip.title, l)}</h3>
                    <p class="text-sage-600 text-sm leading-relaxed">${getText(data.tip.text, l)}</p>
                </div>

                <div class="mt-8">
                    <h3 class="text-xs font-bold uppercase tracking-widest text-como-500 mb-4 border-b border-como-100 pb-2">${getText(data.rates.title, l)}</h3>
                    <div class="mb-6 text-xs text-como-600 space-y-1">
                        ${data.rates.details.map(det => `<p class="${det.italic ? 'italic text-como-400 font-medium' : ''}">${getText(det, l)}</p>`).join('')}
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        ${ratesHtml}
                    </div>
                </div>
            </div>
        </div>
      `;
    }

    renderCarpool(data, l) {
        return `
        <div class="glass-card rounded-3xl shadow-xl shadow-sage-900/5 border border-white/40 overflow-hidden">
            <div class="p-8 bg-sage-50/30 border-b border-sage-100/50">
              <h2 class="font-serif text-3xl md:text-4xl text-sage-800 mb-8 flex items-center gap-4 tracking-tight">
                <span class="text-2xl grayscale opacity-50">🚗</span>
                ${getText(data.heading, l)}
              </h2>
               <p class="text-sage-700 text-sm leading-relaxed max-w-2xl">${getText(data.intro, l)}</p>
            </div>
            <div class="p-8 space-y-6">
                <p class="text-como-500 mb-6 text-xs leading-relaxed md:hidden">${getText(data.mobileNote, l)}</p>
                <div class="flex flex-col gap-4">
                    <a href="${data.sheetUrl}" target="_blank" class="inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-como-600 hover:bg-como-700 transition shadow-sm">
                        ${l === 'en' ? 'Open Spreadsheet to Edit' : 'Apri il Foglio per Modificare'}
                    </a>
                    <div class="border border-como-100 rounded-xl overflow-hidden h-[600px] hidden md:block">
                        <iframe src="${data.embedUrl}" width="100%" height="100%" style="border:0;" loading="lazy"></iframe>
                    </div>
                </div>
            </div>
        </div>
      `;
    }

    renderFAQ() {
        const data = content.faq;
        const l = this.lang;
        const div = document.createElement('div');
        div.id = 'view-faq';
        div.className = "animate-fade-in space-y-6";

        let faqHtml = data.items.map((item, idx) => `
        <div class="group ${idx > 0 ? 'pt-6 border-t border-como-50' : ''}">
             <h3 class="font-bold text-como-800 text-lg mb-2">${getText(item.q, l)}</h3>
             <p class="text-como-600 leading-relaxed ${item.italic ? 'italic' : ''}">${getText(item.a, l)}</p>
        </div>
      `).join('');

        div.innerHTML = `
        <div class="glass-card p-8 md:p-12 rounded-3xl shadow-xl shadow-sage-900/5 border border-white/40">
            <h2 class="font-serif text-3xl md:text-4xl text-sage-800 mb-10 flex items-center gap-4 tracking-tight">
                 <span class="text-2xl grayscale opacity-50">🤔</span>
                 ${l === 'en' ? 'Frequently Asked Questions' : 'Domande Frequenti'}
            </h2>
            <div class="space-y-6">${faqHtml}</div>
        </div>
      `;
        return div;
    }

    renderGifts() {
        const data = content.gifts;
        const l = this.lang;
        const div = document.createElement('div');
        div.id = 'view-gifts';
        div.className = "animate-fade-in space-y-6";

        let methodsHtml = data.methods.map(m => `
        <div class="flex flex-col bg-white/50 rounded-2xl p-6 border border-sage-100 shadow-sm ${m.qr ? 'relative overflow-hidden' : ''}">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner" style="background-color: ${m.color}">${m.logo}</div>
                <h3 class="font-bold text-sage-800 text-sm uppercase tracking-wider">${m.name}</h3>
            </div>
             <p class="text-xs text-sage-500 mb-6 leading-relaxed">
                <strong>${getText(m.recommended, l)}</strong> ${getText(m.desc, l)}
             </p>
             
             ${m.qr ? `
                 <div class="flex flex-col sm:flex-row gap-6 items-center sm:items-end mt-auto">
                    <a href="${m.url}" target="_blank" rel="noopener noreferrer" class="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white font-bold tracking-widest uppercase text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-md group" style="background-color: ${m.color}">
                        ${getText(m.btn, l)}
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                         </svg>
                    </a>
                    <div class="flex flex-col items-center gap-2 shrink-0">
                         <div class="bg-white p-2 rounded-lg shadow-sm border border-sage-100 shrink-0">
                            <img src="${m.qr}" alt="${m.name} QR Code" class="w-20 h-20 md:w-24 md:h-24 aspect-square block" loading="lazy">
                         </div>
                         <span class="text-[9px] font-bold text-sage-400 uppercase tracking-widest">Scan to Pay</span>
                    </div>
                 </div>
             ` : `
                 <a href="${m.url}" target="_blank" rel="noopener noreferrer" class="mt-auto flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white font-bold tracking-widest uppercase text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-md group" style="background-color: ${m.color}">
                    ${getText(m.btn, l)}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                 </a>
             `}
        </div>
      `).join('');

        div.innerHTML = `
        <div class="glass-card p-8 md:p-12 rounded-3xl shadow-xl shadow-sage-900/5 border border-white/40">
           <h2 class="font-serif text-3xl md:text-4xl text-sage-800 mb-8 flex items-center gap-4 tracking-tight">
             <span class="text-2xl grayscale opacity-50">🎁</span>
             ${l === 'en' ? 'Wedding Gifts' : 'Regali di Nozze'}
           </h2>
           <div class="max-w-3xl">
              <p class="text-sage-700 text-lg leading-relaxed mb-10">${getText(data.intro, l)}</p>
              <div class="grid gap-8 md:grid-cols-2">
                ${methodsHtml}
              </div>
           </div>
        </div>
      `;
        return div;
    }

    startCountdown() {
        const weddingDate = new Date("2026-05-23T15:00:00").getTime();

        const update = () => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                document.getElementById("countdown").innerHTML = "HAPPILY EVER AFTER";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            const labelDays = this.lang === 'en' ? 'DAYS' : 'GIORNI';
            // const labelHours = this.lang === 'en' ? 'HOURS' : 'ORE';

            const timerEl = document.getElementById("countdown-timer");
            if (timerEl) timerEl.innerText = `${days} ${labelDays} TO GO`;
        };

        update();
        setInterval(update, 1000 * 60 * 60); // Update every hour is enough for days
        window.updateCountdown = update; // Expose for language toggle
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    new WeddingApp();
});
