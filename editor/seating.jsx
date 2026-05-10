const { useState, useEffect, useRef, useMemo, useCallback } = React;
const createIcon = (iconDef) => ({ size = 24, className = '', ...props }) => {
    if (!iconDef) return null;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size} height={size} viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={className}
            {...props}
        >
            {iconDef.map(([tag, attrs], i) => {
                const Tag = tag;
                return <Tag key={i} {...attrs} />;
            })}
        </svg>
    );
};

const X = createIcon(lucide.X);
const Plus = createIcon(lucide.Plus);
const RotateCcw = createIcon(lucide.RotateCcw);
const Trash2 = createIcon(lucide.Trash2);
const Edit3 = createIcon(lucide.Edit3);
const Check = createIcon(lucide.Check);
const ListPlus = createIcon(lucide.ListPlus);
const Search = createIcon(lucide.Search);
const Users = createIcon(lucide.Users);
const Sparkles = createIcon(lucide.Sparkles);
const Eraser = createIcon(lucide.Eraser);
const Pencil = createIcon(lucide.Pencil);
const GripVertical = createIcon(lucide.GripVertical);
const Save = createIcon(lucide.Save);
const ArrowRight = createIcon(lucide.ArrowRight);
const Hash = createIcon(lucide.Hash);
const Download = createIcon(lucide.Download);
const Upload = createIcon(lucide.Upload);

// ===== Geometry =====
const SCALE = 56;            // px per metre
const PADDING = 32;
const ROOM_L = 14;
const ROOM_W = 7;
const ARC_R = ROOM_W / 2;    // 3.5m

const TABLE_CFG = {
    13: { tableR: 0.85, chairR: 1.13, chairSize: 0.22 },
    11: { tableR: 0.70, chairR: 0.97, chairSize: 0.22 },
};

const DEFAULT_TABLES = [
    { id: 't1', name: 'Table 1', capacity: 13, x: 2.50, y: 1.85 },
    { id: 't2', name: 'Table 2', capacity: 13, x: 4.875, y: 1.85 },
    { id: 't3', name: 'Table 3', capacity: 13, x: 7.25, y: 1.85 },
    { id: 't4', name: 'Table 4', capacity: 13, x: 9.625, y: 1.85 },
    { id: 't5', name: 'Table 5', capacity: 13, x: 12.0, y: 1.85 },
    { id: 't6', name: 'Table 6', capacity: 11, x: 2.50, y: 5.15 },
    { id: 't7', name: 'Table 7', capacity: 11, x: 4.875, y: 5.15 },
    { id: 't8', name: 'Table 8', capacity: 11, x: 7.25, y: 5.15 },
    { id: 't9', name: 'Table 9', capacity: 11, x: 9.625, y: 5.15 },
    { id: 't10', name: 'Table 10', capacity: 11, x: 12.0, y: 5.15 },
];

const STORAGE_KEY = 'seating-planner-v2';

// ===== Theme tokens =====
const C = {
    paper: '#EBE3D1',
    paperHi: '#F4ECD8',
    surface: '#F8F1DD',
    ink: '#1F180E',
    soft: '#6F614A',
    line: '#C5B58C',
    rule: '#A89265',
    accent: '#9C4A30',
    accentHi: '#B85A3D',
    gold: '#C68522',
    cap13: '#DBC1A0',
    cap11: '#CAC1A6',
    stroke: '#5C4A2F',
    seatEmpty: '#F8F1DD',
};

// ===== Helpers =====
const uid = () => Math.random().toString(36).slice(2, 10);

const initials = (name) => {
    const p = (name || '').trim().split(/\s+/).filter(Boolean);
    if (p.length === 0) return '?';
    if (p.length >= 2) return (p[0][0] + p[p.length - 1][0]).toUpperCase();
    return p[0].slice(0, 2).toUpperCase();
};

const seatPositions = (table) => {
    const cfg = TABLE_CFG[table.capacity];
    return Array.from({ length: table.capacity }, (_, i) => {
        const a = (i / table.capacity) * 2 * Math.PI - Math.PI / 2;
        return { index: i, x: table.x + cfg.chairR * Math.cos(a), y: table.y + cfg.chairR * Math.sin(a) };
    });
};

const roomPath = () => {
    const sx = ARC_R * SCALE + PADDING;
    const sy = PADDING;
    const rr = ROOM_L * SCALE + PADDING;
    const rb = ROOM_W * SCALE + PADDING;
    const ar = ARC_R * SCALE;
    return `M ${sx} ${sy} L ${rr} ${sy} L ${rr} ${rb} L ${sx} ${rb} A ${ar} ${ar} 0 0 1 ${sx} ${sy} Z`;
};

// ===== Component =====
function SeatingPlanner() {
    const [loaded, setLoaded] = useState(false);
    const [tables, setTables] = useState(DEFAULT_TABLES);
    const [guests, setGuests] = useState([]);
    const [search, setSearch] = useState('');
    const [drag, setDrag] = useState(null);
    const [assigning, setAssigning] = useState(null);   // { tableId, seatIndex }
    const [tableModal, setTableModal] = useState(null); // tableId
    const [renamingId, setRenamingId] = useState(null);
    const [renameValue, setRenameValue] = useState('');
    const [showBulk, setShowBulk] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [hoverSeat, setHoverSeat] = useState(null);
    const [savedFlash, setSavedFlash] = useState(false);
    const [showNumbers, setShowNumbers] = useState(true);
    const [importError, setImportError] = useState('');
    const [confirmModal, setConfirmModal] = useState(null);

    const svgRef = useRef(null);
    const fileInputRef = useRef(null);

    // ----- Persistence -----
    useEffect(() => {
        (async () => {
            try {
                const res = await window.storage.get(STORAGE_KEY);
                if (res?.value) {
                    const parsed = JSON.parse(res.value);
                    if (Array.isArray(parsed.guests)) setGuests(parsed.guests);
                    if (Array.isArray(parsed.tables)) setTables(parsed.tables);
                }
            } catch (_) { }
            setLoaded(true);
        })();
    }, []);

    useEffect(() => {
        if (!loaded) return;
        const t = setTimeout(async () => {
            try {
                await window.storage.set(STORAGE_KEY, JSON.stringify({ guests, tables }));
                setSavedFlash(true);
                setTimeout(() => setSavedFlash(false), 900);
            } catch (_) { }
        }, 350);
        return () => clearTimeout(t);
    }, [guests, tables, loaded]);

    // ----- Derived -----
    const totalCapacity = useMemo(
        () => tables.reduce((s, t) => s + t.capacity, 0),
        [tables]
    );

    const seatedGuests = useMemo(() => guests.filter(g => g.tableId), [guests]);
    const unassigned = useMemo(() => guests.filter(g => !g.tableId), [guests]);

    const guestBySeat = useMemo(() => {
        const m = new Map();
        guests.forEach(g => { if (g.tableId) m.set(`${g.tableId}-${g.seatIndex}`, g); });
        return m;
    }, [guests]);

    const filteredUnassigned = useMemo(() => {
        if (!search.trim()) return unassigned;
        const q = search.toLowerCase();
        return unassigned.filter(g => g.name.toLowerCase().includes(q));
    }, [unassigned, search]);

    const filteredSeated = useMemo(() => {
        if (!search.trim()) return seatedGuests;
        const q = search.toLowerCase();
        return seatedGuests.filter(g => g.name.toLowerCase().includes(q));
    }, [seatedGuests, search]);

    // ----- Drag tables -----
    const beginDrag = (e, tableId) => {
        if (e.target?.dataset?.role === 'seat') return;
        e.currentTarget.setPointerCapture(e.pointerId);
        const t = tables.find(x => x.id === tableId);
        const svg = svgRef.current;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const p = pt.matrixTransform(svg.getScreenCTM().inverse());
        setDrag({
            tableId,
            offX: p.x - (t.x * SCALE + PADDING),
            offY: p.y - (t.y * SCALE + PADDING),
            startX: e.clientX, startY: e.clientY,
            moved: false,
        });
    };

    const moveDrag = (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.startX;
        const dy = e.clientY - drag.startY;
        if (!drag.moved && Math.hypot(dx, dy) < 4) return;
        const svg = svgRef.current;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        const p = pt.matrixTransform(svg.getScreenCTM().inverse());
        const nx = (p.x - drag.offX - PADDING) / SCALE;
        const ny = (p.y - drag.offY - PADDING) / SCALE;
        const cx = Math.max(0.4, Math.min(ROOM_L - 0.4, nx));
        const cy = Math.max(0.4, Math.min(ROOM_W - 0.4, ny));
        setTables(prev => prev.map(t => t.id === drag.tableId ? { ...t, x: cx, y: cy } : t));
        setDrag(d => ({ ...d, moved: true }));
    };

    const endDrag = (tableId) => {
        if (drag && !drag.moved) setTableModal(tableId);
        setDrag(null);
    };

    // ----- Guest actions -----
    const addGuest = (name) => {
        if (!name?.trim()) return;
        setGuests(prev => [...prev, { id: uid(), name: name.trim(), tableId: null, seatIndex: null }]);
    };

    const bulkAdd = (text) => {
        const lines = text.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
        if (!lines.length) return;
        const newOnes = lines.map(name => ({ id: uid(), name, tableId: null, seatIndex: null }));
        setGuests(prev => [...prev, ...newOnes]);
    };

    const removeGuest = (id) => setGuests(prev => prev.filter(g => g.id !== id));

    const renameGuest = (id, name) => {
        if (!name?.trim()) return;
        setGuests(prev => prev.map(g => g.id === id ? { ...g, name: name.trim() } : g));
    };

    const unassignGuest = (id) =>
        setGuests(prev => prev.map(g => g.id === id ? { ...g, tableId: null, seatIndex: null } : g));

    const assignGuestToSeat = (guestId, tableId, seatIndex) => {
        setGuests(prev => prev.map(g => {
            if (g.id === guestId) return { ...g, tableId, seatIndex };
            if (g.tableId === tableId && g.seatIndex === seatIndex) return { ...g, tableId: null, seatIndex: null };
            return g;
        }));
    };

    const clearSeat = (tableId, seatIndex) => {
        setGuests(prev => prev.map(g =>
            (g.tableId === tableId && g.seatIndex === seatIndex)
                ? { ...g, tableId: null, seatIndex: null } : g));
    };

    const autoFill = () => {
        const ua = guests.filter(g => !g.tableId);
        if (!ua.length) return;
        const occ = new Set();
        guests.forEach(g => { if (g.tableId) occ.add(`${g.tableId}-${g.seatIndex}`); });
        const updates = new Map();
        let i = 0;
        outer: for (const t of tables) {
            for (let s = 0; s < t.capacity; s++) {
                if (i >= ua.length) break outer;
                const k = `${t.id}-${s}`;
                if (!occ.has(k)) {
                    updates.set(ua[i].id, { tableId: t.id, seatIndex: s });
                    occ.add(k);
                    i++;
                }
            }
        }
        setGuests(prev => prev.map(g => updates.has(g.id) ? { ...g, ...updates.get(g.id) } : g));
    };

    const clearAllAssignments = () => {
        if (!seatedGuests.length) return;
        setConfirmModal({
            title: 'Unseat all guests?',
            message: 'Everyone will be moved back to the unseated list. The guest list itself is kept.',
            confirmLabel: 'Unseat all',
            danger: true,
            action: () => setGuests(prev => prev.map(g => ({ ...g, tableId: null, seatIndex: null }))),
        });
    };

    const removeAllGuests = () => {
        if (!guests.length) return;
        setConfirmModal({
            title: 'Clear guest list?',
            message: 'Every guest will be removed. This cannot be undone (export first if you want a backup).',
            confirmLabel: 'Clear list',
            danger: true,
            action: () => setGuests([]),
        });
    };

    const resetTableLayout = () => {
        setConfirmModal({
            title: 'Reset table positions?',
            message: 'Tables return to their default positions. Names and seat assignments are kept.',
            confirmLabel: 'Reset layout',
            action: () => setTables(prev => DEFAULT_TABLES.map(d => {
                const cur = prev.find(p => p.id === d.id);
                return cur ? { ...d, name: cur.name } : d;
            })),
        });
    };

    const renameTable = (id, name) => {
        if (!name?.trim()) return;
        setTables(prev => prev.map(t => t.id === id ? { ...t, name: name.trim() } : t));
    };

    // ----- Export / Import -----
    const exportPlan = () => {
        const data = {
            version: 1,
            exportedAt: new Date().toISOString(),
            room: { length_m: ROOM_L, width_m: ROOM_W, rounded_end_radius_m: ARC_R },
            tables,
            guests,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ts = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
        a.download = `seating-plan-${ts}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const importPlan = (file) => {
        setImportError('');
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (!parsed || typeof parsed !== 'object') throw new Error('Not a valid plan file.');
                const incomingTables = Array.isArray(parsed.tables) ? parsed.tables : null;
                const incomingGuests = Array.isArray(parsed.guests) ? parsed.guests : null;
                if (!incomingTables && !incomingGuests) throw new Error('No tables or guests found.');

                // Validate shapes lightly
                const validTables = incomingTables?.every(t =>
                    t && typeof t.id === 'string' && typeof t.name === 'string' &&
                    typeof t.x === 'number' && typeof t.y === 'number' &&
                    (t.capacity === 11 || t.capacity === 13)
                );
                const validGuests = incomingGuests?.every(g =>
                    g && typeof g.id === 'string' && typeof g.name === 'string'
                );
                if (incomingTables && !validTables) throw new Error('Table data is malformed.');
                if (incomingGuests && !validGuests) throw new Error('Guest data is malformed.');

                const applyImport = () => {
                    if (incomingTables) setTables(incomingTables);
                    if (incomingGuests) setGuests(incomingGuests.map(g => ({
                        id: g.id, name: g.name,
                        tableId: g.tableId ?? null,
                        seatIndex: typeof g.seatIndex === 'number' ? g.seatIndex : null,
                    })));
                };

                setConfirmModal({
                    title: 'Replace current plan?',
                    message: `Imported file contains ${incomingTables?.length ?? 0} tables and ${incomingGuests?.length ?? 0} guests. The current plan will be overwritten.`,
                    confirmLabel: 'Replace plan',
                    danger: true,
                    action: applyImport,
                });
            } catch (err) {
                setImportError(err.message || 'Could not read file.');
                setTimeout(() => setImportError(''), 4000);
            }
        };
        reader.readAsText(file);
    };

    const triggerImport = () => fileInputRef.current?.click();

    // ----- Render =====
    const SVG_W = ROOM_L * SCALE + PADDING * 2;
    const SVG_H = ROOM_W * SCALE + PADDING * 2;

    return (
        <div className="min-h-screen w-full" style={{ background: C.paper, color: C.ink }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700;9..144,300..700&family=Outfit:wght@300..600&display=swap');
        .ff-display { font-family: 'Fraunces', 'EB Garamond', Georgia, serif; font-feature-settings: 'ss01' on, 'ss02' on; letter-spacing: -0.01em; }
        .ff-body    { font-family: 'Outfit', system-ui, -apple-system, sans-serif; }
        .grain { position: relative; }
        .grain::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.12 0 0 0 0 0.10 0 0 0 0 0.07 0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          mix-blend-mode: multiply; opacity: 0.35;
        }
        .scroll-fade { mask-image: linear-gradient(to bottom, black 92%, transparent); }
        @keyframes flash { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; } }
        .flash { animation: flash 900ms ease-out; }
        details > summary { list-style: none; cursor: pointer; }
        details > summary::-webkit-details-marker { display: none; }
        input, textarea, button { font-family: inherit; }
        .btn-primary { background: ${C.ink}; color: ${C.paperHi}; }
        .btn-primary:hover { background: ${C.accent}; }
        .btn-ghost:hover { background: ${C.line}33; }
        .seat-num { font-family: 'Outfit', sans-serif; font-size: 8px; fill: ${C.soft}; pointer-events: none; user-select: none; }
        .seat-init { font-family: 'Outfit', sans-serif; font-size: 8.5px; font-weight: 600; fill: ${C.paperHi}; pointer-events: none; user-select: none; letter-spacing: 0.02em; }
      `}</style>

            <div className="ff-body grain" style={{ minHeight: '100vh' }}>
                <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10">

                    {/* ===== Header ===== */}
                    <header className="mb-6 lg:mb-8 flex flex-wrap items-end justify-between gap-4 pb-5 border-b" style={{ borderColor: C.line }}>
                        <div>
                            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em]" style={{ color: C.soft }}>
                                <span>№ 01</span>
                                <span style={{ color: C.line }}>·</span>
                                <span>Floor Plan</span>
                                <span style={{ color: C.line }}>·</span>
                                <span>14 m × 7 m</span>
                            </div>
                            <h1 className="ff-display mt-1 text-4xl sm:text-5xl lg:text-6xl leading-[0.95]" style={{ fontWeight: 380 }}>
                                Seating <em style={{ fontStyle: 'italic', color: C.accent }}>plan</em>.
                            </h1>
                        </div>

                        <div className="flex items-stretch gap-3">
                            <Stat label="Seated" value={seatedGuests.length} max={totalCapacity} />
                            <Stat label="On list" value={guests.length} max={totalCapacity} />
                            <Stat label="Unseated" value={unassigned.length} tone="warn" />
                        </div>
                    </header>

                    <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-8">

                        {/* ===== Floor plan column ===== */}
                        <section>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: C.soft }}>
                                    <span className="inline-block w-6 h-px" style={{ background: C.rule }} />
                                    Drag tables to arrange · tap chairs to seat guests
                                </div>
                                <div className="flex items-center gap-1 flex-wrap">
                                    <ToolbarBtn onClick={() => setShowNumbers(s => !s)} title="Show or hide empty seats (filled seats always show)" active={showNumbers}>
                                        <Hash size={14} /> {showNumbers ? 'Empty seats on' : 'Empty seats off'}
                                    </ToolbarBtn>
                                    <ToolbarBtn onClick={autoFill} title="Fill empty seats with unassigned guests, in order">
                                        <Sparkles size={14} /> Auto-fill
                                    </ToolbarBtn>
                                    <ToolbarBtn onClick={clearAllAssignments} title="Unseat everyone">
                                        <Eraser size={14} /> Unseat all
                                    </ToolbarBtn>
                                    <ToolbarBtn onClick={resetTableLayout} title="Reset table positions">
                                        <RotateCcw size={14} /> Reset layout
                                    </ToolbarBtn>
                                    <span className="inline-block w-px h-5 mx-1" style={{ background: C.line }} />
                                    <ToolbarBtn onClick={exportPlan} title="Download plan as JSON">
                                        <Download size={14} /> Export
                                    </ToolbarBtn>
                                    <ToolbarBtn onClick={triggerImport} title="Load plan from JSON">
                                        <Upload size={14} /> Import
                                    </ToolbarBtn>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="application/json,.json"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) importPlan(f);
                                            e.target.value = '';
                                        }}
                                    />
                                </div>
                            </div>

                            <div
                                className="relative rounded-sm overflow-hidden"
                                style={{
                                    background: C.paperHi,
                                    boxShadow: `inset 0 0 0 1px ${C.line}, 0 1px 0 ${C.line}, 0 18px 40px -28px rgba(35,25,10,0.35)`,
                                }}
                            >
                                {/* corner marks */}
                                <CornerMarks />

                                <div className="overflow-x-auto">
                                    <svg
                                        ref={svgRef}
                                        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                                        style={{ width: '100%', minWidth: 720, height: 'auto', display: 'block', touchAction: 'none' }}
                                        onPointerMove={moveDrag}
                                    >
                                        {/* defs */}
                                        <defs>
                                            <pattern id="grid" width={SCALE} height={SCALE} patternUnits="userSpaceOnUse">
                                                <path d={`M ${SCALE} 0 L 0 0 0 ${SCALE}`} fill="none" stroke={C.line} strokeWidth="0.5" opacity="0.5" />
                                            </pattern>
                                            <pattern id="gridFine" width={SCALE / 2} height={SCALE / 2} patternUnits="userSpaceOnUse">
                                                <path d={`M ${SCALE / 2} 0 L 0 0 0 ${SCALE / 2}`} fill="none" stroke={C.line} strokeWidth="0.3" opacity="0.25" />
                                            </pattern>
                                        </defs>

                                        {/* outer paper area grid */}
                                        <rect x="0" y="0" width={SVG_W} height={SVG_H} fill={C.paperHi} />
                                        <rect x="0" y="0" width={SVG_W} height={SVG_H} fill="url(#gridFine)" />

                                        {/* room */}
                                        <path d={roomPath()} fill={C.surface} stroke={C.stroke} strokeWidth="1.6" />
                                        <path d={roomPath()} fill="url(#grid)" />

                                        {/* dimensions */}
                                        <Dimensions />

                                        {/* tables */}
                                        {tables.map(table => (
                                            <TableGroup
                                                key={table.id}
                                                table={table}
                                                guestBySeat={guestBySeat}
                                                onPointerDown={beginDrag}
                                                onPointerUp={() => endDrag(table.id)}
                                                onSeatClick={(seatIndex) => setAssigning({ tableId: table.id, seatIndex })}
                                                onSeatHover={setHoverSeat}
                                                hoverSeat={hoverSeat}
                                                dragging={drag?.tableId === table.id}
                                                showNumbers={showNumbers}
                                            />
                                        ))}
                                    </svg>
                                </div>

                                {/* save indicator */}
                                <div className="absolute bottom-2 right-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em]"
                                    style={{ color: C.soft }}>
                                    <Save size={11} className={savedFlash ? 'flash' : ''} />
                                    Auto-saved
                                </div>
                            </div>

                            {/* table list strip */}
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {tables.map(t => {
                                    const filled = guests.filter(g => g.tableId === t.id).length;
                                    const full = filled >= t.capacity;
                                    return (
                                        <button
                                            key={t.id}
                                            onClick={() => setTableModal(t.id)}
                                            className="text-left rounded-sm px-3 py-2 transition-colors"
                                            style={{
                                                background: full ? C.cap13 : C.surface,
                                                border: `1px solid ${C.line}`,
                                            }}
                                        >
                                            <div className="ff-display text-base leading-none" style={{ fontWeight: 420 }}>{t.name}</div>
                                            <div className="mt-1 flex items-center justify-between text-[11px]" style={{ color: C.soft }}>
                                                <span className="uppercase tracking-wider">Cap {t.capacity}</span>
                                                <span style={{ color: full ? C.accent : C.ink, fontWeight: 600 }}>{filled}/{t.capacity}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* ===== Guest panel ===== */}
                        <aside className="rounded-sm overflow-hidden" style={{ background: C.paperHi, border: `1px solid ${C.line}` }}>
                            {/* search + add */}
                            <div className="p-4 border-b" style={{ borderColor: C.line }}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Users size={16} style={{ color: C.soft }} />
                                    <div className="ff-display text-xl" style={{ fontWeight: 420 }}>Guest list</div>
                                    <div className="ml-auto text-[11px] uppercase tracking-wider" style={{ color: C.soft }}>
                                        {guests.length} of {totalCapacity}
                                    </div>
                                </div>

                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.soft }} />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        placeholder="Search names…"
                                        className="w-full pl-9 pr-3 py-2 rounded-sm text-sm outline-none"
                                        style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink }}
                                    />
                                </div>

                                <AddGuestRow onAdd={addGuest} onBulk={() => setShowBulk(true)} />
                            </div>

                            {/* unassigned */}
                            <details open className="border-b" style={{ borderColor: C.line }}>
                                <summary className="px-4 py-3 flex items-center justify-between hover:bg-black/[0.02]">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: C.accent }} />
                                        <span className="text-sm font-medium uppercase tracking-wider">Unseated</span>
                                        <span className="text-xs" style={{ color: C.soft }}>{filteredUnassigned.length}</span>
                                    </div>
                                </summary>
                                <div className="px-2 pb-3 max-h-[280px] overflow-y-auto">
                                    {filteredUnassigned.length === 0 ? (
                                        <Empty text={search ? 'No matches.' : guests.length ? 'Everyone is seated.' : 'Add guests to begin.'} />
                                    ) : (
                                        <ul>
                                            {filteredUnassigned.map(g => (
                                                <GuestRow
                                                    key={g.id}
                                                    guest={g}
                                                    renaming={renamingId === g.id}
                                                    onStartRename={() => { setRenamingId(g.id); setRenameValue(g.name); }}
                                                    renameValue={renameValue}
                                                    onRenameChange={setRenameValue}
                                                    onCommitRename={() => { renameGuest(g.id, renameValue); setRenamingId(null); }}
                                                    onCancelRename={() => setRenamingId(null)}
                                                    onRemove={() => removeGuest(g.id)}
                                                />
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </details>

                            {/* seated */}
                            <details open>
                                <summary className="px-4 py-3 flex items-center justify-between hover:bg-black/[0.02]">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: C.gold }} />
                                        <span className="text-sm font-medium uppercase tracking-wider">Seated</span>
                                        <span className="text-xs" style={{ color: C.soft }}>{filteredSeated.length}</span>
                                    </div>
                                </summary>
                                <div className="px-2 pb-3 max-h-[300px] overflow-y-auto">
                                    {filteredSeated.length === 0 ? (
                                        <Empty text="Nobody seated yet." />
                                    ) : (
                                        <ul>
                                            {filteredSeated.map(g => {
                                                const t = tables.find(tt => tt.id === g.tableId);
                                                return (
                                                    <GuestRow
                                                        key={g.id}
                                                        guest={g}
                                                        tableLabel={t ? `${t.name} · seat ${g.seatIndex + 1}` : ''}
                                                        onLocate={() => setTableModal(g.tableId)}
                                                        onUnassign={() => unassignGuest(g.id)}
                                                        onRemove={() => removeGuest(g.id)}
                                                        renaming={renamingId === g.id}
                                                        onStartRename={() => { setRenamingId(g.id); setRenameValue(g.name); }}
                                                        renameValue={renameValue}
                                                        onRenameChange={setRenameValue}
                                                        onCommitRename={() => { renameGuest(g.id, renameValue); setRenamingId(null); }}
                                                        onCancelRename={() => setRenamingId(null)}
                                                    />
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </details>

                            <div className="px-4 py-3 flex items-center justify-between border-t" style={{ borderColor: C.line, background: C.surface }}>
                                <button onClick={removeAllGuests} className="text-[11px] uppercase tracking-wider hover:underline" style={{ color: C.soft }}>
                                    Clear list
                                </button>
                                <button onClick={() => setShowHelp(true)} className="text-[11px] uppercase tracking-wider hover:underline" style={{ color: C.soft }}>
                                    How it works
                                </button>
                            </div>
                        </aside>
                    </div>

                    <footer className="mt-10 pt-6 border-t flex items-center justify-between text-[11px] uppercase tracking-[0.18em]"
                        style={{ borderColor: C.line, color: C.soft }}>
                        <span>5 × 13-seat &nbsp;·&nbsp; 5 × 11-seat &nbsp;·&nbsp; capacity {totalCapacity}</span>
                        <span>Fraunces &amp; Outfit</span>
                    </footer>
                </div>
            </div>

            {/* ===== Modals ===== */}
            {assigning && (
                <AssignModal
                    tables={tables}
                    guests={guests}
                    unassigned={unassigned}
                    guestBySeat={guestBySeat}
                    assigning={assigning}
                    onClose={() => setAssigning(null)}
                    onAssign={(gid) => { assignGuestToSeat(gid, assigning.tableId, assigning.seatIndex); setAssigning(null); }}
                    onClear={() => { clearSeat(assigning.tableId, assigning.seatIndex); setAssigning(null); }}
                    onAddNew={(name) => {
                        const newId = uid();
                        setGuests(prev => [...prev, { id: newId, name: name.trim(), tableId: assigning.tableId, seatIndex: assigning.seatIndex }]);
                        // also clear any conflict
                        setGuests(prev => {
                            const conflict = prev.find(g => g.id !== newId && g.tableId === assigning.tableId && g.seatIndex === assigning.seatIndex);
                            if (conflict) return prev.map(g => g.id === conflict.id ? { ...g, tableId: null, seatIndex: null } : g);
                            return prev;
                        });
                        setAssigning(null);
                    }}
                />
            )}

            {tableModal && (
                <TableModal
                    table={tables.find(t => t.id === tableModal)}
                    guests={guests}
                    guestBySeat={guestBySeat}
                    unassigned={unassigned}
                    onClose={() => setTableModal(null)}
                    onAssign={(guestId, seatIndex) => assignGuestToSeat(guestId, tableModal, seatIndex)}
                    onAddNew={(name, seatIndex) => {
                        const newId = uid();
                        setGuests(prev => {
                            const conflict = prev.find(g => g.tableId === tableModal && g.seatIndex === seatIndex);
                            const cleared = conflict
                                ? prev.map(g => g.id === conflict.id ? { ...g, tableId: null, seatIndex: null } : g)
                                : prev;
                            return [...cleared, { id: newId, name: name.trim(), tableId: tableModal, seatIndex }];
                        });
                    }}
                    onClearSeat={(seatIndex) => clearSeat(tableModal, seatIndex)}
                    onRename={(name) => renameTable(tableModal, name)}
                    onFillRemaining={() => {
                        const tbl = tables.find(t => t.id === tableModal);
                        if (!tbl) return;
                        const ua = guests.filter(g => !g.tableId);
                        if (!ua.length) return;
                        const occ = new Set();
                        guests.forEach(g => { if (g.tableId === tableModal) occ.add(g.seatIndex); });
                        const updates = new Map();
                        let i = 0;
                        for (let s = 0; s < tbl.capacity; s++) {
                            if (i >= ua.length) break;
                            if (!occ.has(s)) {
                                updates.set(ua[i].id, { tableId: tableModal, seatIndex: s });
                                occ.add(s);
                                i++;
                            }
                        }
                        setGuests(prev => prev.map(g => updates.has(g.id) ? { ...g, ...updates.get(g.id) } : g));
                    }}
                />
            )}

            {showBulk && (
                <BulkModal onClose={() => setShowBulk(false)} onAdd={(text) => { bulkAdd(text); setShowBulk(false); }} />
            )}

            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

            {confirmModal && (
                <ConfirmModal
                    {...confirmModal}
                    onClose={() => setConfirmModal(null)}
                    onConfirm={() => { confirmModal.action(); setConfirmModal(null); }}
                />
            )}

            {importError && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-sm text-sm flex items-center gap-2 ff-body"
                    style={{ background: C.ink, color: C.paperHi, boxShadow: '0 12px 30px -10px rgba(0,0,0,0.4)' }}>
                    <span style={{ color: C.accentHi }}>✕</span>
                    Import failed: {importError}
                </div>
            )}
        </div>
    );
}

// ===== Sub-components =====

function Stat({ label, value, max, tone }) {
    const pct = max ? Math.round((value / max) * 100) : 0;
    const color = tone === 'warn' ? C.accent : C.ink;
    return (
        <div className="px-4 py-2 rounded-sm" style={{ background: C.paperHi, border: `1px solid ${C.line}` }}>
            <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: C.soft }}>{label}</div>
            <div className="ff-display flex items-baseline gap-1.5" style={{ color, fontWeight: 420 }}>
                <span className="text-2xl leading-none">{value}</span>
                {max != null && <span className="text-sm" style={{ color: C.soft }}>/ {max}</span>}
            </div>
        </div>
    );
}

function ToolbarBtn({ children, onClick, title, active }) {
    return (
        <button
            onClick={onClick}
            title={title}
            className="btn-ghost inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[11px] uppercase tracking-wider transition-colors"
            style={{
                color: active ? C.paperHi : C.ink,
                border: `1px solid ${active ? C.ink : C.line}`,
                background: active ? C.ink : C.paperHi,
            }}
        >
            {children}
        </button>
    );
}

function CornerMarks() {
    const Mark = ({ pos }) => (
        <div className="absolute w-3 h-3" style={{
            ...pos,
            borderColor: C.rule,
            borderStyle: 'solid',
        }} />
    );
    return (
        <>
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l" style={{ borderColor: C.rule }} />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r" style={{ borderColor: C.rule }} />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l" style={{ borderColor: C.rule }} />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r" style={{ borderColor: C.rule }} />
        </>
    );
}

function Dimensions() {
    const left = PADDING - 14;
    const right = ROOM_L * SCALE + PADDING + 14;
    const top = PADDING - 14;
    const bottom = ROOM_W * SCALE + PADDING + 14;
    const tickColor = C.rule;
    return (
        <g style={{ pointerEvents: 'none' }}>
            {/* horizontal dim (top) */}
            <line x1={ARC_R * SCALE + PADDING} y1={top} x2={ROOM_L * SCALE + PADDING} y2={top} stroke={tickColor} strokeWidth="0.6" />
            <line x1={ARC_R * SCALE + PADDING} y1={top - 4} x2={ARC_R * SCALE + PADDING} y2={top + 4} stroke={tickColor} strokeWidth="0.6" />
            <line x1={ROOM_L * SCALE + PADDING} y1={top - 4} x2={ROOM_L * SCALE + PADDING} y2={top + 4} stroke={tickColor} strokeWidth="0.6" />
            <text x={(ARC_R * SCALE + ROOM_L * SCALE) / 2 + PADDING} y={top - 6}
                textAnchor="middle" fontSize="10" fill={C.soft}
                style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                10.5 m
            </text>

            {/* vertical dim (right) */}
            <line x1={right} y1={PADDING} x2={right} y2={ROOM_W * SCALE + PADDING} stroke={tickColor} strokeWidth="0.6" />
            <line x1={right - 4} y1={PADDING} x2={right + 4} y2={PADDING} stroke={tickColor} strokeWidth="0.6" />
            <line x1={right - 4} y1={ROOM_W * SCALE + PADDING} x2={right + 4} y2={ROOM_W * SCALE + PADDING} stroke={tickColor} strokeWidth="0.6" />
            <text x={right + 8} y={(PADDING + ROOM_W * SCALE + PADDING) / 2}
                textAnchor="start" dominantBaseline="middle"
                fontSize="10" fill={C.soft}
                style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                7 m
            </text>

            {/* radius arrow on rounded end */}
            <line
                x1={ARC_R * SCALE + PADDING} y1={ARC_R * SCALE + PADDING}
                x2={PADDING + 6} y2={ARC_R * SCALE + PADDING}
                stroke={tickColor} strokeWidth="0.6" strokeDasharray="2 3" />
            <text x={ARC_R * SCALE + PADDING - 6} y={ARC_R * SCALE + PADDING - 6}
                textAnchor="end" fontSize="9" fill={C.soft}
                style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                R 3.5
            </text>
        </g>
    );
}

function TableGroup({ table, guestBySeat, onPointerDown, onPointerUp, onSeatClick, onSeatHover, hoverSeat, dragging, showNumbers }) {
    const cfg = TABLE_CFG[table.capacity];
    const cx = table.x * SCALE + PADDING;
    const cy = table.y * SCALE + PADDING;
    const tR = cfg.tableR * SCALE;
    const seats = seatPositions(table);
    const tableFill = table.capacity === 13 ? C.cap13 : C.cap11;
    const filled = Array.from(guestBySeat.keys()).filter(k => k.startsWith(`${table.id}-`)).length;

    return (
        <g
            style={{ cursor: dragging ? 'grabbing' : 'grab' }}
            onPointerDown={(e) => onPointerDown(e, table.id)}
            onPointerUp={(e) => onPointerUp(e, table.id)}
        >
            {/* connectors from table to chairs */}
            {seats.map(s => {
                const guest = guestBySeat.get(`${table.id}-${s.index}`);
                if (!guest && !showNumbers) return null;
                const sx = s.x * SCALE + PADDING;
                const sy = s.y * SCALE + PADDING;
                const dx = sx - cx; const dy = sy - cy;
                const len = Math.hypot(dx, dy);
                const ux = dx / len; const uy = dy / len;
                const x1 = cx + ux * tR;
                const y1 = cy + uy * tR;
                const x2 = sx - ux * (cfg.chairSize * SCALE);
                const y2 = sy - uy * (cfg.chairSize * SCALE);
                return <line key={s.index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.stroke} strokeWidth="0.6" opacity="0.45" />;
            })}

            {/* table body */}
            <circle
                cx={cx} cy={cy} r={tR}
                fill={tableFill}
                stroke={C.stroke}
                strokeWidth="1.2"
            />
            <circle cx={cx} cy={cy} r={tR - 4} fill="none" stroke={C.stroke} strokeWidth="0.4" opacity="0.45" />

            {/* table label */}
            <text
                x={cx} y={cy - 4}
                textAnchor="middle"
                fontSize={table.capacity === 13 ? 14 : 12}
                style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, letterSpacing: '0.01em' }}
                fill={C.ink}
                pointerEvents="none"
            >
                {table.name}
            </text>
            <text
                x={cx} y={cy + 10}
                textAnchor="middle"
                fontSize="9"
                style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '0.2em', textTransform: 'uppercase' }}
                fill={C.soft}
                pointerEvents="none"
            >
                {filled}/{table.capacity}
            </text>

            {/* seats */}
            {seats.map(s => {
                const sx = s.x * SCALE + PADDING;
                const sy = s.y * SCALE + PADDING;
                const guest = guestBySeat.get(`${table.id}-${s.index}`);
                if (!guest && !showNumbers) return null;
                const r = cfg.chairSize * SCALE;
                const isHover = hoverSeat?.tableId === table.id && hoverSeat?.seatIndex === s.index;
                return (
                    <g key={s.index}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); onSeatClick(s.index); }}
                        onMouseEnter={() => onSeatHover({ tableId: table.id, seatIndex: s.index })}
                        onMouseLeave={() => onSeatHover(null)}
                        style={{ cursor: 'pointer' }}
                        data-role="seat-group"
                    >
                        <circle
                            data-role="seat"
                            cx={sx} cy={sy} r={r + 2}
                            fill="transparent"
                        />
                        <circle
                            data-role="seat"
                            cx={sx} cy={sy} r={r}
                            fill={guest ? C.accent : C.seatEmpty}
                            stroke={guest ? C.stroke : C.soft}
                            strokeWidth={isHover ? 1.4 : 0.9}
                            style={{ transition: 'fill 0.15s' }}
                        />
                        {guest ? (
                            <text data-role="seat" x={sx} y={sy + 0.5} textAnchor="middle" dominantBaseline="middle" className="seat-init">
                                {initials(guest.name)}
                            </text>
                        ) : showNumbers ? (
                            <text data-role="seat" x={sx} y={sy + 0.5} textAnchor="middle" dominantBaseline="middle" className="seat-num">
                                {s.index + 1}
                            </text>
                        ) : null}
                        {isHover && guest && (
                            <g pointerEvents="none">
                                <rect
                                    x={sx - 60} y={sy - r - 28}
                                    width={120} height={20}
                                    fill={C.ink} rx="2"
                                />
                                <text x={sx} y={sy - r - 14} textAnchor="middle" fontSize="11" fill={C.paperHi}
                                    style={{ fontFamily: 'Outfit, sans-serif' }}>
                                    {guest.name.length > 18 ? guest.name.slice(0, 17) + '…' : guest.name}
                                </text>
                            </g>
                        )}
                    </g>
                );
            })}
        </g>
    );
}

function AddGuestRow({ onAdd, onBulk }) {
    const [val, setVal] = useState('');
    return (
        <div className="mt-3 flex gap-2">
            <input
                type="text"
                value={val}
                onChange={e => setVal(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { onAdd(val); setVal(''); } }}
                placeholder="Add a guest…"
                className="flex-1 px-3 py-2 rounded-sm text-sm outline-none"
                style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink }}
            />
            <button
                onClick={() => { onAdd(val); setVal(''); }}
                className="btn-primary px-3 rounded-sm text-sm flex items-center gap-1 transition-colors"
            >
                <Plus size={14} />
            </button>
            <button
                onClick={onBulk}
                title="Paste many names at once"
                className="px-3 rounded-sm text-sm flex items-center gap-1 transition-colors"
                style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink }}
            >
                <ListPlus size={14} />
            </button>
        </div>
    );
}

function GuestRow({ guest, tableLabel, renaming, renameValue, onRenameChange, onStartRename, onCommitRename, onCancelRename, onRemove, onUnassign, onLocate }) {
    return (
        <li className="px-2 py-1.5 rounded-sm hover:bg-black/[0.04] flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0"
                style={{ background: tableLabel ? C.accent : C.surface, color: tableLabel ? C.paperHi : C.soft, border: `1px solid ${C.line}` }}>
                {initials(guest.name)}
            </div>

            {renaming ? (
                <input
                    autoFocus
                    value={renameValue}
                    onChange={e => onRenameChange(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') onCommitRename();
                        else if (e.key === 'Escape') onCancelRename();
                    }}
                    onBlur={onCommitRename}
                    className="flex-1 text-sm px-2 py-1 rounded-sm outline-none"
                    style={{ background: C.paperHi, border: `1px solid ${C.accent}`, color: C.ink }}
                />
            ) : (
                <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{guest.name}</div>
                    {tableLabel && (
                        <button onClick={onLocate} className="text-[10px] uppercase tracking-wider hover:underline" style={{ color: C.soft }}>
                            {tableLabel}
                        </button>
                    )}
                </div>
            )}

            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {!renaming && (
                    <button onClick={onStartRename} title="Rename" className="p-1 rounded-sm hover:bg-black/10">
                        <Pencil size={12} />
                    </button>
                )}
                {onUnassign && !renaming && (
                    <button onClick={onUnassign} title="Unseat" className="p-1 rounded-sm hover:bg-black/10">
                        <Eraser size={12} />
                    </button>
                )}
                {!renaming && (
                    <button onClick={onRemove} title="Remove" className="p-1 rounded-sm hover:bg-black/10" style={{ color: C.accent }}>
                        <Trash2 size={12} />
                    </button>
                )}
            </div>
        </li>
    );
}

function Empty({ text }) {
    return (
        <div className="px-3 py-6 text-center text-xs italic" style={{ color: C.soft }}>{text}</div>
    );
}

// ----- Modals -----
function ModalShell({ children, onClose, title, eyebrow, size = 'md' }) {
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);
    const widthClass = size === 'lg' ? 'max-w-2xl' : 'max-w-md';
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ff-body" style={{ background: 'rgba(20,15,5,0.45)', backdropFilter: 'blur(2px)' }}
            onClick={onClose}>
            <div onClick={e => e.stopPropagation()} className={`w-full ${widthClass} rounded-sm overflow-hidden`}
                style={{ background: C.paperHi, border: `1px solid ${C.line}`, boxShadow: '0 30px 60px -20px rgba(0,0,0,0.4)' }}>
                <div className="px-5 py-4 flex items-start justify-between border-b" style={{ borderColor: C.line }}>
                    <div>
                        {eyebrow && <div className="text-[10px] uppercase tracking-[0.22em] mb-0.5" style={{ color: C.soft }}>{eyebrow}</div>}
                        <div className="ff-display text-2xl leading-tight" style={{ fontWeight: 420 }}>{title}</div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-sm hover:bg-black/10" style={{ color: C.soft }}>
                        <X size={16} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function AssignModal({ tables, unassigned, guestBySeat, assigning, onClose, onAssign, onClear, onAddNew }) {
    const [q, setQ] = useState('');
    const table = tables.find(t => t.id === assigning.tableId);
    const occupant = guestBySeat.get(`${assigning.tableId}-${assigning.seatIndex}`);
    const filtered = unassigned.filter(g => g.name.toLowerCase().includes(q.toLowerCase()));

    return (
        <ModalShell onClose={onClose} eyebrow={`${table.name} · seat ${assigning.seatIndex + 1}`} title={occupant ? 'Reassign seat' : 'Assign seat'}>
            <div className="p-5 space-y-4">
                {occupant && (
                    <div className="rounded-sm p-3 flex items-center justify-between" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium"
                                style={{ background: C.accent, color: C.paperHi }}>
                                {initials(occupant.name)}
                            </div>
                            <div>
                                <div className="text-sm">{occupant.name}</div>
                                <div className="text-[11px] uppercase tracking-wider" style={{ color: C.soft }}>currently seated</div>
                            </div>
                        </div>
                        <button onClick={onClear} className="text-[11px] uppercase tracking-wider hover:underline" style={{ color: C.accent }}>
                            Unseat
                        </button>
                    </div>
                )}

                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.soft }} />
                    <input
                        autoFocus
                        type="text"
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && q.trim()) {
                                if (filtered[0]) onAssign(filtered[0].id);
                                else onAddNew(q);
                            }
                        }}
                        placeholder="Search or type a new name…"
                        className="w-full pl-9 pr-3 py-2 rounded-sm text-sm outline-none"
                        style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink }}
                    />
                </div>

                <div className="max-h-[280px] overflow-y-auto -mx-2">
                    {filtered.length === 0 && q.trim() && (
                        <button onClick={() => onAddNew(q)} className="w-full text-left px-4 py-2 rounded-sm hover:bg-black/[0.04] flex items-center justify-between">
                            <span className="text-sm">Add &amp; seat &nbsp;<em className="italic" style={{ color: C.accent }}>"{q}"</em></span>
                            <ArrowRight size={14} />
                        </button>
                    )}
                    {filtered.length === 0 && !q.trim() && unassigned.length === 0 && (
                        <Empty text="No unseated guests. Type a name above to add and seat them." />
                    )}
                    {filtered.map(g => (
                        <button key={g.id} onClick={() => onAssign(g.id)}
                            className="w-full text-left px-4 py-2 rounded-sm hover:bg-black/[0.04] flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium"
                                style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.soft }}>
                                {initials(g.name)}
                            </div>
                            <span className="text-sm flex-1">{g.name}</span>
                            <ArrowRight size={14} style={{ color: C.soft }} />
                        </button>
                    ))}
                </div>
            </div>
        </ModalShell>
    );
}

function TableModal({ table, guests, guestBySeat, unassigned, onClose, onAssign, onAddNew, onClearSeat, onRename, onFillRemaining }) {
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(table.name);
    const [search, setSearch] = useState('');
    const [activeSeat, setActiveSeat] = useState(null);
    const searchRef = useRef(null);

    const seats = Array.from({ length: table.capacity }, (_, i) => i);
    const filled = guests.filter(g => g.tableId === table.id).length;

    const nextEmpty = seats.find(i => !guestBySeat.get(`${table.id}-${i}`));
    const targetSeat = activeSeat != null && !guestBySeat.get(`${table.id}-${activeSeat}`)
        ? activeSeat : nextEmpty;

    const filteredUnassigned = unassigned.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase())
    );

    const advanceSeat = (justFilled) => {
        // find next empty seat after the one we just filled, wrapping around
        const after = seats.find(i => i > justFilled && !guestBySeat.get(`${table.id}-${i}`));
        const wrap = after != null ? after : seats.find(i => i !== justFilled && !guestBySeat.get(`${table.id}-${i}`));
        setActiveSeat(wrap ?? null);
    };

    const seatGuest = (guestId) => {
        if (targetSeat == null) return;
        const seatIdx = targetSeat;
        onAssign(guestId, seatIdx);
        setSearch('');
        advanceSeat(seatIdx);
        setTimeout(() => searchRef.current?.focus(), 0);
    };

    const addAndSeat = (name) => {
        if (targetSeat == null || !name.trim()) return;
        const seatIdx = targetSeat;
        onAddNew(name, seatIdx);
        setSearch('');
        advanceSeat(seatIdx);
        setTimeout(() => searchRef.current?.focus(), 0);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredUnassigned[0]) seatGuest(filteredUnassigned[0].id);
            else if (search.trim()) addAndSeat(search);
        }
    };

    const tableFull = filled >= table.capacity;
    const canFillRemaining = !tableFull && unassigned.length > 0;

    return (
        <ModalShell
            size="lg"
            onClose={onClose}
            eyebrow={`Capacity ${table.capacity} · ${filled}/${table.capacity} seated`}
            title={
                editing ? (
                    <input
                        autoFocus
                        value={val}
                        onChange={e => setVal(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') { onRename(val); setEditing(false); }
                            if (e.key === 'Escape') { setVal(table.name); setEditing(false); }
                        }}
                        onBlur={() => { onRename(val); setEditing(false); }}
                        className="ff-display text-2xl px-2 py-0.5 rounded-sm outline-none"
                        style={{ background: C.surface, border: `1px solid ${C.accent}`, fontWeight: 420 }}
                    />
                ) : (
                    <span onClick={() => setEditing(true)} className="cursor-text">{table.name}<Pencil size={12} className="inline-block ml-2 opacity-40" /></span>
                )
            }
        >
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.1fr]" style={{ borderTop: `1px solid ${C.line}` }}>
                {/* === Seats column === */}
                <div className="p-4 sm:border-r" style={{ borderColor: C.line, maxHeight: '60vh', overflowY: 'auto' }}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: C.soft }}>Seats</div>
                        {tableFull && (
                            <div className="text-[11px] uppercase tracking-wider" style={{ color: C.gold }}>Full</div>
                        )}
                    </div>
                    <div className="space-y-0.5">
                        {seats.map(i => {
                            const g = guestBySeat.get(`${table.id}-${i}`);
                            const isTarget = i === targetSeat;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 rounded-sm px-2 py-1.5 transition-colors cursor-pointer"
                                    onClick={() => !g && setActiveSeat(i)}
                                    style={{
                                        background: isTarget ? `${C.accent}1a` : 'transparent',
                                        boxShadow: isTarget ? `inset 0 0 0 1px ${C.accent}` : 'none',
                                    }}
                                >
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0"
                                        style={{
                                            background: g ? C.accent : (isTarget ? C.paperHi : C.surface),
                                            color: g ? C.paperHi : C.soft,
                                            border: `1px solid ${isTarget ? C.accent : C.line}`,
                                        }}>
                                        {g ? initials(g.name) : i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[10px] uppercase tracking-wider leading-none" style={{ color: C.soft }}>Seat {i + 1}</div>
                                        <div className="text-sm truncate">
                                            {g ? g.name : <em style={{ color: isTarget ? C.accent : C.soft, fontStyle: 'italic' }}>{isTarget ? 'next →' : 'empty'}</em>}
                                        </div>
                                    </div>
                                    {g && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onClearSeat(i); }}
                                            className="text-[11px] uppercase tracking-wider hover:underline shrink-0"
                                            style={{ color: C.soft }}
                                        >
                                            clear
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* === Add-from-list column === */}
                <div className="p-4" style={{ maxHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: C.soft }}>
                            {tableFull ? 'Table full' : targetSeat != null ? `Add to seat ${targetSeat + 1}` : 'Pick a seat'}
                        </div>
                        {canFillRemaining && (
                            <button
                                onClick={onFillRemaining}
                                className="text-[11px] uppercase tracking-wider inline-flex items-center gap-1 hover:underline"
                                style={{ color: C.accent }}
                            >
                                <Sparkles size={11} /> Fill remaining
                            </button>
                        )}
                    </div>

                    <div className="relative mb-3">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.soft }} />
                        <input
                            ref={searchRef}
                            autoFocus
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={tableFull}
                            placeholder={tableFull ? 'Every seat is taken' : 'Type a name — Enter to seat'}
                            className="w-full pl-9 pr-3 py-2 rounded-sm text-sm outline-none disabled:opacity-50"
                            style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink }}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto -mx-1">
                        {tableFull ? (
                            <Empty text="Clear a seat to swap someone in." />
                        ) : filteredUnassigned.length === 0 && search.trim() ? (
                            <button
                                onClick={() => addAndSeat(search)}
                                className="w-full text-left px-3 py-2 rounded-sm hover:bg-black/[0.04] flex items-center justify-between"
                            >
                                <span className="text-sm">Add &amp; seat &nbsp;<em className="italic" style={{ color: C.accent }}>"{search}"</em></span>
                                <ArrowRight size={14} />
                            </button>
                        ) : filteredUnassigned.length === 0 ? (
                            <Empty text={unassigned.length === 0 ? 'No unseated guests. Type a name above.' : 'No matches.'} />
                        ) : (
                            filteredUnassigned.map((g, idx) => (
                                <button
                                    key={g.id}
                                    onClick={() => seatGuest(g.id)}
                                    className="w-full text-left px-3 py-1.5 rounded-sm hover:bg-black/[0.04] flex items-center gap-2.5"
                                    style={idx === 0 && search ? { background: `${C.accent}10` } : undefined}
                                >
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0"
                                        style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.soft }}>
                                        {initials(g.name)}
                                    </div>
                                    <span className="text-sm flex-1 truncate">{g.name}</span>
                                    <ArrowRight size={12} style={{ color: C.soft }} />
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 py-2.5 flex items-center justify-between text-[11px]" style={{ borderTop: `1px solid ${C.line}`, background: C.surface, color: C.soft }}>
                <span className="uppercase tracking-wider">{unassigned.length} unseated</span>
                <span className="hidden sm:inline">Type · <kbd style={{ fontFamily: 'inherit', padding: '1px 6px', border: `1px solid ${C.line}`, borderRadius: 2, background: C.paperHi, color: C.ink }}>Enter</kbd> to seat fastest match</span>
                <button onClick={onClose} className="uppercase tracking-wider hover:underline">Done</button>
            </div>
        </ModalShell>
    );
}

function BulkModal({ onClose, onAdd }) {
    const [val, setVal] = useState('');
    const lines = val.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
    return (
        <ModalShell onClose={onClose} eyebrow="Add many at once" title="Paste guest list">
            <div className="p-5 space-y-3">
                <p className="text-xs" style={{ color: C.soft }}>One name per line, or comma-separated. Paste straight from a spreadsheet.</p>
                <textarea
                    autoFocus
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    rows={10}
                    placeholder={'Alice Chen\nBen Mendez\nCharlotte O\'Sullivan\n…'}
                    className="w-full px-3 py-2 rounded-sm text-sm outline-none resize-none"
                    style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink, fontFamily: 'inherit' }}
                />
                <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider" style={{ color: C.soft }}>{lines.length} name{lines.length === 1 ? '' : 's'}</span>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-3 py-2 rounded-sm text-sm" style={{ color: C.soft }}>Cancel</button>
                        <button onClick={() => onAdd(val)} disabled={!lines.length}
                            className="btn-primary px-3 py-2 rounded-sm text-sm transition-colors disabled:opacity-40">
                            Add {lines.length || ''}
                        </button>
                    </div>
                </div>
            </div>
        </ModalShell>
    );
}

function ConfirmModal({ title, message, confirmLabel = 'Confirm', danger, onClose, onConfirm }) {
    return (
        <ModalShell onClose={onClose} eyebrow="Are you sure?" title={title}>
            <div className="p-5 space-y-4">
                <p className="text-sm" style={{ color: C.ink, lineHeight: 1.5 }}>{message}</p>
                <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                        onClick={onClose}
                        className="px-3 py-2 rounded-sm text-sm transition-colors"
                        style={{ color: C.soft, background: 'transparent', border: `1px solid transparent` }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        autoFocus
                        className="px-3 py-2 rounded-sm text-sm transition-colors"
                        style={{
                            background: danger ? C.accent : C.ink,
                            color: C.paperHi,
                            border: `1px solid ${danger ? C.accent : C.ink}`,
                        }}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </ModalShell>
    );
}

function HelpModal({ onClose }) {
    return (
        <ModalShell onClose={onClose} eyebrow="Quick reference" title="How it works">
            <div className="p-5 space-y-3 text-sm" style={{ color: C.ink }}>
                <Hint k="Tap a chair" v="Open the assign panel for that seat." />
                <Hint k="Tap a table" v="See all of that table's seats at once." />
                <Hint k="Drag a table" v="Reposition it on the floor plan. Chairs follow." />
                <Hint k="Add guests" v="Type one at a time, or paste a whole list." />
                <Hint k="Auto-fill" v="Sweeps unseated guests into empty seats in order." />
                <Hint k="Saves automatically" v="Your plan persists between visits in your browser." />
            </div>
        </ModalShell>
    );
}
function Hint({ k, v }) {
    return (
        <div className="flex gap-3">
            <div className="w-28 shrink-0 text-[11px] uppercase tracking-wider pt-0.5" style={{ color: C.soft }}>{k}</div>
            <div className="flex-1">{v}</div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SeatingPlanner />);