export const content = {
    venue: {
        meta: {
            date: "May 23, 2026",
            time: "3:00 PM",
            location: "Como, Italy"
        },
        title: "Yacht Club Como",
        image: "img/yacht-club-como-2025.jpg",
        address: {
            line1: "Viale Giancarlo Puecher, 8",
            line2: "22100 Como CO, Italia"
        },
        arrivalInfo: {
            title: {
                en: "Important Arrival Info",
                it: "Info Importanti sull'Arrivo"
            },
            text: {
                en: "Please allow extra time for traffic. Try to arrive in central Como <strong>45–60 minutes before 3:00 PM</strong>.",
                it: "Si prega di considerare il traffico. Cercate di arrivare nel centro di Como <strong>45-60 minuti prima delle 15:00</strong>."
            }
        },
        maps: {
            google: "https://maps.google.com/?q=Yacht+Club+Como,+Viale+Giancarlo+Puecher,+8,+22100+Como+CO,+Italia",
            directions: "https://www.google.com/maps/dir/?api=1&destination=Yacht+Club+Como,+Viale+Giancarlo+Puecher,+8,+22100+Como+CO,+Italia",
            embed: "https://www.google.com/maps?q=Yacht+Club+Como,+Viale+Giancarlo+Puecher,+8,+22100+Como+CO,+Italia&z=17&output=embed"
        }
    },
    schedule: [
        {
            time: "3:00 PM",
            title: { en: "Arrival", it: "Arrivo" },
            description: { en: "Welcome and welcome drinks", it: "Drink di benvenuto" }
        },
        {
            time: "4:00 PM",
            title: { en: "Ceremony", it: "Cerimonia" },
            description: { en: "Exchange of vows", it: "Scambio delle promesse" }
        },
        {
            time: "5:00 PM",
            title: { en: "Group Photo", it: "Foto di Gruppo" },
            description: { en: "Creating memories together", it: "Creare ricordi insieme" }
        },
        {
            time: "5:30 PM",
            title: { en: "Aperitivo", it: "Aperitivo" },
            description: { en: "Drinks and hors d'oeuvres", it: "Drink e stuzzichini" }
        },
        {
            time: "6:00 PM",
            title: { en: "Dinner", it: "Cena" },
            description: { en: "A celebration of flavors", it: "Una celebrazione di sapori" }
        },
        {
            time: "8:00 PM",
            title: { en: "Speeches <span class=\"text-sage-300\">&amp;</span> Cake", it: "Discorsi <span class=\"text-sage-300\">&amp;</span> Torta" },
            description: { en: "Toasts and sweetness", it: "Brindisi e dolcezza" }
        },
        {
            time: "10:00 PM",
            title: { en: "Dancing", it: "Balli" },
            description: { en: "Celebration continues", it: "La festa continua" }
        }
    ],
    hotels: {
        note: {
            en: "The wedding is in Lake Como, but we will be staying in Varedo (40 mins away). For the best experience, we recommend staying closer to Como for the Friday & Saturday.",
            it: "Il matrimonio si terrà sul Lago di Como, ma noi soggiorneremo a Varedo (40 min). Per la migliore esperienza, consigliamo di alloggiare più vicino a Como per il venerdì e il sabato."
        },
        smartStays: [
            {
                name: "Como Camerlata",
                badge: { en: "Top Value", it: "Miglior Valore" },
                badgeColor: "green",
                description: {
                    en: "Only 4 mins away by train. Modern hotels at half the price of the center.",
                    it: "A soli 4 minuti di treno. Hotel moderni a metà prezzo rispetto al centro."
                },
                returnInfo: {
                    en: "Return: 23:20 train from San Giovanni (latest on Saturdays)",
                    it: "Ritorno: Treno delle 23:20 da San Giovanni (ultimo al sabato)"
                },
                link: { text: "B&B Hotel Como Camerlata", url: "https://www.hotel-bb.com/en/hotel/como-camerlata" }
            },
            {
                name: "Tavernola / Cernobbio",
                badge: { en: "Lakeside", it: "Lungo Lago" },
                badgeColor: "blue",
                description: {
                    en: "Stay on the lake without the central city price tag. A scenic 25-min walk along the promenade.",
                    it: "Soggiorna sul lago senza il prezzo del centro città. Una passeggiata di 25 min sul lungolago."
                },
                returnInfo: {
                    en: "Return: 01:30 AM via \"Flex Urbano\" on-demand bus (Saturdays)",
                    it: "Ritorno: Ore 01:30 via bus \"Flex Urbano\" su richiesta (Sabato)"
                },
                links: [
                    { text: "Hotel Como", url: "https://www.hotelcomo.it/" },
                    { text: "Airbnbs", url: "https://www.booking.com/searchresults.en-gb.html?ss=Tavernola%2C+Como" }
                ]
            }
        ]
    },
    transport: {
        safetyNote: {
            en: "<strong>Important Safety Note:</strong> While Como has a central train station (San Giovanni), the area and surrounding trains can be <strong>unsafe late at night</strong>. We strongly advise taking a taxi, carpooling, or using the bus instead of the train for late-night travel.",
            it: "<strong>Nota importante sulla sicurezza:</strong> Anche se Como ha una stazione ferroviaria centrale (San Giovanni), la zona e i treni possono essere <strong>poco sicuri a tarda notte</strong>. Consigliamo vivamente di prendere un taxi, organizzare un passaggio o usare l'autobus invece del treno per gli spostamenti notturni."
        },
        subTabs: {
            parking: {
                title: { en: "Parking", it: "Parcheggio" },
                heading: { en: "Parking for Guests Arriving by Car", it: "Parcheggio per gli ospiti in auto" },
                intro: {
                    en: "For guests arriving with their own transportation, here are a few <strong>paid parking areas in Como</strong> where you can leave your car and then <strong>walk or take a bus</strong> to reach <strong>Como Yacht Club</strong>. Please note: <strong>unfortunately, there is no free parking in the area</strong>.",
                    it: "Per gli ospiti che arrivano con i propri mezzi, ecco alcune <strong>aree di parcheggio a pagamento a Como</strong> dove potete lasciare l'auto e poi <strong>camminare o prendere un autobus</strong> per raggiungere il <strong>Como Yacht Club</strong>. Nota bene: <strong>purtroppo non ci sono parcheggi gratuiti in zona</strong>."
                },
                options: [
                    {
                        name: "Parcheggio Lungolago",
                        mapUrl: "https://maps.google.com/maps/place//data=!4m2!3m1!1s0x47869d0063fb2759:0x3a062a0d943c03e4",
                        description: { en: "Easiest option. Walk directly to the venue.", it: "L'opzione più semplice. Camminate direttamente verso il luogo." },
                        walkTime: { en: "2 min walk", it: "2 min a piedi" }
                    },
                    {
                        name: "Centro Lago",
                        mapUrl: "https://maps.google.com/maps/place//data=!4m2!3m1!1s0x47869db2e7775585:0xf95f84e6b755e3fb",
                        description: { en: "Short walk along the lake. Or Bus N1 from Cavour.", it: "Breve passeggiata lungo il lago. Oppure Bus N1 da Cavour." },
                        walkTime: { en: "7 min walk", it: "7 min a piedi" }
                    },
                    {
                        name: "Como Central",
                        mapUrl: "https://maps.app.goo.gl/Yu7GPdrTMzTmYMcz6",
                        description: { en: "Bus N1 from <em>S. Rocchetto</em> to <em>Villa Olmo</em>.", it: "Bus N1 da <em>S. Rocchetto</em> a <em>Villa Olmo</em>." },
                        busInfo: {
                            title: "Bus N1 to the Yacht Club",
                            from: { en: "Como – S. Rocchetto", it: "Como – S. Rocchetto" },
                            to: { en: "Como – Villa Olmo", it: "Como – Villa Olmo" },
                            instructions: {
                                toVenue: [
                                    { en: "From <strong>Como – S. Rocchetto</strong>, take <strong>ASF Autolinee Linea N1</strong> toward the lakefront.", it: "Da <strong>Como – S. Rocchetto</strong>, prendete <strong>ASF Autolinee Linea N1</strong> verso il lungolago." },
                                    { en: "Get off at <strong>Como – Villa Olmo</strong>, then walk a few minutes along the lake to <strong>Como Yacht Club</strong>.", it: "Scendete a <strong>Como – Villa Olmo</strong>, poi camminate qualche minuto lungo il lago fino al <strong>Como Yacht Club</strong>." }
                                ],
                                return: [
                                    { en: "Return to the <strong>Como – Villa Olmo</strong> bus stop.", it: "Tornate alla fermata <strong>Como – Villa Olmo</strong>." },
                                    { en: "Take <strong>Linea N1</strong> back toward the centre.", it: "Prendete la <strong>Linea N1</strong> verso il centro." },
                                    { en: "Get off at <strong>Como – S. Rocchetto</strong>, then walk back to the parking.", it: "Scendete a <strong>Como – S. Rocchetto</strong>, poi tornate al parcheggio a piedi." }
                                ]
                            },
                            lastBus: {
                                title: { en: "Saturday night (last bus)", it: "Sabato sera (ultimo bus)" },
                                details: "<strong>23:41</strong> <span class=\"text-sage-300\">from</span> <strong>Como – Villa Olmo</strong> <span class=\"text-sage-300\">→</span> <strong>23:46</strong> <strong>S. Rocchetto</strong>"
                            }
                        },
                        walkTime: { en: "15 min walk", it: "15 min a piedi" }
                    },
                    {
                        name: "Autosilo Viale Lecco",
                        mapUrl: "https://maps.app.goo.gl/62m9FzPkVUqr2r3i8",
                        description: { en: "Bus N1 from <em>Cavour</em> to <em>Villa Olmo</em>.", it: "Bus N1 da <em>Cavour</em> a <em>Villa Olmo</em>." },
                        busInfo: {
                            title: "Bus N1 to the Yacht Club",
                            from: { en: "Como – Cavour", it: "Como – Cavour" },
                            to: { en: "Como – Villa Olmo", it: "Como – Villa Olmo" },
                            instructions: {
                                toVenue: [
                                    { en: "From <strong>Como – Cavour</strong>, take <strong>ASF Autolinee Linea N1</strong> toward the lakefront.", it: "Da <strong>Como – Cavour</strong>, prendete <strong>ASF Autolinee Linea N1</strong> verso il lungolago." },
                                    { en: "Get off at <strong>Como – Villa Olmo</strong>, then walk along the lake to <strong>Como Yacht Club</strong>.", it: "Scendete a <strong>Como – Villa Olmo</strong>, poi camminate lungo il lago fino al <strong>Como Yacht Club</strong>." }
                                ],
                                return: [] // Logic handled in renderer if empty
                            },
                            lastBus: {
                                title: { en: "Saturday night (last bus)", it: "Sabato sera (ultimo bus)" },
                                details: "<strong>23:41</strong> <span class=\"text-sage-300\">from</span> <strong>Como – Villa Olmo</strong> <span class=\"text-sage-300\">→</span> <strong>23:50</strong> <strong>Como – Cavour</strong>"
                            }
                        },
                        walkTime: { en: "20 min walk", it: "20 min a piedi" }
                    }
                ],
                busNote: {
                    title: { en: "Important note about buses", it: "Nota importante sugli autobus" },
                    text: {
                        en: "Bus services can change due to events or temporary diversions. We recommend re-checking <strong>Linea N1</strong> on the official <a class=\"font-bold text-sage-500 hover:text-sage-800\" href=\"https://www.asfautolinee.it/search-for-lines-and-schedules/?lang=en&utm_source=chatgpt.com\" target=\"_blank\" rel=\"noopener noreferrer\">ASF Autolinee</a> site before leaving.",
                        it: "I servizi degli autobus possono variare a causa di eventi o deviazioni temporanee. Vi consigliamo di ricontrollare la <strong>Linea N1</strong> sul sito ufficiale di <a class=\"font-bold text-sage-500 hover:text-sage-800\" href=\"https://www.asfautolinee.it/search-for-lines-and-schedules/?lang=en&utm_source=chatgpt.com\" target=\"_blank\" rel=\"noopener noreferrer\">ASF Autolinee</a> prima di partire."
                    }
                },
                embedMap: "https://www.google.com/maps?q=parcheggio+near+Viale+Giancarlo+Puecher,+8,+22100+Como+CO,+Italy&z=16&output=embed"
            },
            airports: {
                title: { en: "Airports", it: "Aeroporti" },
                heading: { en: "Nearby Airports", it: "Aeroporti Vicini" },
                list: [
                    { name: "Milan Malpensa (MXP)", badge: { en: "Best Choice", it: "Scelta Migliore" }, badgeColor: "como", desc: { en: "Major international hub, ~45 mins away.", it: "Principale hub internazionale, a circa 45 minuti." } },
                    { name: "Milan Linate (LIN)", desc: { en: "Closest to Milan center, ~1 hour away.", it: "Il più vicino al centro di Milano, a circa 1 ora." } },
                    { name: "Milan Bergamo (BGY)", desc: { en: "Good for low-cost flights (Ryanair), ~1 hr 15 mins.", it: "Ottimo per voli low-cost (Ryanair), a circa 1h 15 min." } },
                    { name: "Lugano Airport (LUG)", desc: { en: "Closest Swiss option, ~40 mins away.", it: "L'opzione svizzera più vicina, a circa 40 minuti." } }
                ],
                gettingToComo: {
                    title: { en: "Getting to Como from the Airports", it: "Come raggiungere Como dagli aeroporti" },
                    options: [
                        { title: "Milan Malpensa (MXP)", text: { en: "<strong>Best Option:</strong> Take the <strong>Malpensa Express</strong> to <strong>Saronno</strong> station. There, change for a train to <strong>Como Lago</strong> (arrives right by the lake) or <strong>Como S. Giovanni</strong>.", it: "<strong>Opzione Migliore:</strong> Prendete il <strong>Malpensa Express</strong> fino alla stazione di <strong>Saronno</strong>. Lì, cambiate con un treno per <strong>Como Lago</strong> (arriva proprio vicino al lago) o <strong>Como S. Giovanni</strong>." }, info: { en: "Duration: ~1h 15m | Cost: ~€11-15", it: "Durata: ~1h 15m | Costo: ~€11-15" } },
                        { title: "Milan Linate (LIN)", text: { en: "Take the <strong>Linate Shuttle</strong> or <strong>AirBus</strong> to <strong>Milano Centrale</strong>. From there, take a Trenitalia train to <strong>Como S. Giovanni</strong>.", it: "Prendete il <strong>Linate Shuttle</strong> o <strong>AirBus</strong> fino a <strong>Milano Centrale</strong>. Da lì, prendete un treno Trenitalia per <strong>Como S. Giovanni</strong>." }, info: { en: "Duration: ~1h 45m | Cost: ~€15-20", it: "Durata: ~1h 45m | Costo: ~€15-20" } },
                        { title: "Milan Bergamo (BGY)", text: { en: "Take the <strong>Orio Shuttle</strong> to <strong>Milano Centrale</strong>, then a train to <strong>Como S. Giovanni</strong>. Alternatively, <strong>FlixBus</strong> offers some direct trips to <strong>Como (Grandate)</strong>.", it: "Prendete l'<strong>Orio Shuttle</strong> fino a <strong>Milano Centrale</strong>, poi un treno per <strong>Como S. Giovanni</strong>. In alternativa, <strong>FlixBus</strong> offre alcuni viaggi diretti per <strong>Como (Grandate)</strong>." }, info: { en: "Duration: ~2h 15m | Cost: ~€15-25", it: "Durata: ~2h 15m | Costo: ~€15-25" } },
                        { title: "Lugano Airport (LUG)", text: { en: "Take a regional train (S10, S40, or S50) directly to <strong>Como S. Giovanni</strong>. It is a quick and very scenic route.", it: "Prendete un treno regionale (S10, S40 o S50) direttamente per <strong>Como S. Giovanni</strong>. È un percorso veloce e molto panoramico." }, info: { en: "Duration: ~40m | Cost: ~€10-15", it: "Durata: ~40m | Costo: ~€10-15" } }
                    ]
                },
                embedMap: "https://www.google.com/maps?q=Airports+near+Como+Italy&z=9&output=embed"
            },
            taxi: {
                title: { en: "Taxi", it: "Taxi" },
                heading: { en: "Local Taxis", it: "Taxi Locali" },
                intro: {
                    en: "For moving around Como or reaching Varedo at night, here are the official taxi services and estimated rates.",
                    it: "Per spostarsi a Como o raggiungere Varedo di notte, ecco i servizi taxi ufficiali e le tariffe stimate."
                },
                services: [
                    {
                        name: "Radio Taxi Como",
                        desc: { en: "Official provider, available 24/7.", it: "Fornitore ufficiale, disponibile 24/7." },
                        actions: [
                            { label: { en: "Call +39 031 261515", it: "Chiama +39 031 261515" }, url: "tel:+39031261515", primary: true },
                            { label: { en: "App: InTaxi", it: "App: InTaxi" }, url: "https://www.intaxi.it/", primary: false }
                        ]
                    },
                    {
                        name: "Flex Urbano (On-Demand)",
                        desc: {
                            en: "On-demand bus active Fri/Sun until 01:00 AM and <strong>Saturdays until 01:30 AM</strong>. Bookable via app or call center.",
                            it: "Bus a chiamata attivo Ven/Dom fino alle 01:00 e <strong>Sabato fino alle 01:30</strong>. Prenotabile via app o call center."
                        },
                        links: [
                            { label: { en: "Learn More (English) &rarr;", it: "Scopri di più (Inglese) &rarr;" }, url: "https://www.asfautolinee.it/asf-flex-urbano/?lang=en" },
                            { label: { en: "Learn More (Italian) &rarr;", it: "Scopri di più (Italiano) &rarr;" }, url: "https://www.asfautolinee.it/asf-flex-urbano/" }
                        ]
                    },
                    {
                        name: "Uber Black",
                        desc: {
                            en: "Luxury cars available via the Uber app. Expect higher rates (starting €30-€40).",
                            it: "Auto di lusso disponibili tramite l'app Uber. Tariffe più elevate (da €30-€40)."
                        }
                    }
                ],
                tip: {
                    title: { en: "Strategic Tip", it: "Consiglio Strategico" },
                    text: {
                        en: "After midnight, taxis can be busy. Instead of waiting at the venue, walk to the taxi stands at <strong>Piazza Cavour</strong> or <strong>San Giovanni Station</strong> for a better chance of finding a cab.",
                        it: "Dopo mezzanotte, i taxi possono essere molto richiesti. Invece di aspettare al luogo dell'evento, camminate verso i posteggi dei taxi in <strong>Piazza Cavour</strong> o alla <strong>Stazione San Giovanni</strong> per avere più possibilità di trovarne uno."
                    }
                },
                rates: {
                    title: { en: "Taxi Details & Estimated Night Rates", it: "Dettagli Taxi e Tariffe Notturne Stimate" },
                    details: [
                        { en: "<strong>Night Base Fare:</strong> €7.50", it: "<strong>Quota fissa notturna:</strong> €7.50" },
                        { en: "<strong>Group Surcharge (5-8 pax):</strong> +20%", it: "<strong>Supplemento gruppi (5-8 persone):</strong> +20%" },
                        { en: "Groups: call the dispatch center to pre-book.", it: "Gruppi: chiamate il centralino per prenotare in anticipo.", italic: true }
                    ],
                    destinations: [
                        { name: "To Tavernola", price: "€12–€15" },
                        { name: "To Camerlata", price: "€15–€18" },
                        { name: "To Grandate", price: "€20–€25" },
                        { name: "To Lipomo", price: "€18–€22" }
                    ]
                }
            },
            carpool: {
                title: { en: "Carpool", it: "Passaggi" },
                heading: { en: "Carpool Coordination", it: "Coordinamento Passaggi" },
                intro: {
                    en: "If you have extra space in your car or if you are looking for a ride, please use the spreadsheet below to coordinate with other guests.",
                    it: "Se avete spazio extra in auto o se cercate un passaggio, usate il foglio di calcolo qui sotto per coordinarvi con gli altri ospiti."
                },
                mobileNote: {
                    en: "On mobile, tap the button to edit directly in Google Sheets (the embedded view can be hard to edit on phones).",
                    it: "Da mobile, toccate il pulsante per modificare direttamente in Google Sheets (la vista incorporata può essere difficile da modificare sul telefono)."
                },
                sheetUrl: "https://docs.google.com/spreadsheets/d/1Ce6bkD-IclU2j1PzZ5qWcROJWGvhIcvJPfZmhJLb4GA/edit?usp=sharing",
                embedUrl: "https://docs.google.com/spreadsheets/d/1Ce6bkD-IclU2j1PzZ5qWcROJWGvhIcvJPfZmhJLb4GA/edit?usp=sharing&rm=minimal"
            }
        }
    },
    faq: {
        items: [
            { q: { en: "Are children invited to the wedding?", it: "I bambini sono invitati al matrimonio?" }, a: { en: "Of course!", it: "Certamente!" } },
            { q: { en: "How do we RSVP?", it: "Come facciamo per l'RSVP?" }, a: { en: "Please RSVP to Max's email: <a href=\"mailto:tsalxam@gmail.com\" class=\"text-como-500 hover:text-como-800 font-semibold underline decoration-como-100 underline-offset-4\">tsalxam@gmail.com</a>", it: "Per favore inviate l'RSVP all'email di Max: <a href=\"mailto:tsalxam@gmail.com\" class=\"text-como-500 hover:text-como-800 font-semibold underline decoration-como-100 underline-offset-4\">tsalxam@gmail.com</a>" } },
            { q: { en: "Are the wedding ceremony and the reception at the same venue?", it: "Cerimonia e ricevimento sono nello stesso luogo?" }, a: { en: "Yes, both the ceremony and reception are at the Yacht Club in Lake Como.", it: "Sì, sia la cerimonia che il ricevimento si terranno presso lo Yacht Club di Como." } },
            { q: { en: "What is the dress code?", it: "Qual è il dress code?" }, a: { en: "Dress to impress!", it: "Vestitevi per stupire!" }, italic: true },
            { q: { en: "What about dietary requirements?", it: "E per le esigenze alimentari?" }, a: { en: "We are catering for vegetarians, vegans, and nut/lactose-free diets. If you have any other specific allergies, please let us know when you RSVP.", it: "Abbiamo previsto opzioni per vegetariani, vegani e persone intolleranti a frutta a guscio e lattosio. Se avete altre allergie specifiche, fatecelo sapere nell'RSVP." } }
        ]
    },
    gifts: {
        intro: {
            en: "Your presence is the most valuable gift to us, but if you absolutely insist on giving us a gift, we would very much welcome donations towards our honeymoon.",
            it: "La vostra presenza è per noi il dono più prezioso. Se tuttavia desiderate assolutamente farci un regalo, apprezzeremmo molto un contributo per la nostra luna di miele."
        },
        methods: [
            {
                name: "NatWest Pay",
                logo: "NW",
                color: "#5d2a84",
                recommended: { en: "Recommended for UK guests.", it: "Consigliato per gli ospiti del Regno Unito." },
                desc: { en: "Fast and secure bank transfer via NatWest Pay It.", it: "Trasferimento bancario veloce e sicuro tramite NatWest Pay It." },
                url: "https://paymentrequest.natwestpayit.com/reusable-links/c4b2870e-642d-4a00-8287-37b04cf01ae4",
                btn: { en: "Donate via NatWest", it: "Dona via NatWest" }
            },
            {
                name: "Revolut",
                logo: "R",
                color: "#0075eb",
                recommended: { en: "Recommended for European guests", it: "Consigliato per gli ospiti europei" },
                desc: { en: "to send money in <strong>Euros</strong>.", it: "per inviare denaro in <strong>Euro</strong>." },
                url: "https://revolut.me/federizck6",
                btn: { en: "Donate via Revolut", it: "Dona via Revolut" },
                qr: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://revolut.me/federizck6"
            }
        ]
    }
};
