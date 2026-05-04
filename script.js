document.getElementById('yr').textContent = new Date().getFullYear();

// hide hamburger on desktop
(function() {
  const btn = document.getElementById('sb-menu-btn');
  if (window.innerWidth > 640) btn.style.display = 'none';
  window.addEventListener('resize', () => {
    btn.style.display = window.innerWidth > 640 ? 'none' : 'flex';
    if (window.innerWidth > 640) {
      document.getElementById('sb-nav').classList.remove('open');
      btn.classList.remove('open');
    }
  });
})();

function toggleMenu() {
  const btn = document.getElementById('sb-menu-btn');
  const nav = document.getElementById('sb-nav');
  btn.classList.toggle('open');
  nav.classList.toggle('open');
}

// ROUTING
const PAGE_MAP = {
  'home':        'page-home',
  'about':       'page-about',
  'projects':    'page-projects',
  'bookstack':   'page-bookstack',
  'travelogue': 'page-travelogue',
  'letters':      'page-letters',
  'fascinations': 'page-fascinations',
  'contact':      'page-contact'
};

function activatePage(pageKey) {
  const key = PAGE_MAP[pageKey] ? pageKey : 'home';
  document.querySelectorAll('nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === key);
  });
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(PAGE_MAP[key]).classList.add('active');
}

function goTo(el) {
  event.preventDefault();
  const page = el.dataset.page;
  history.pushState({ page }, '', '#' + page);
  activatePage(page);
  // close mobile menu
  document.getElementById('sb-nav').classList.remove('open');
  document.getElementById('sb-menu-btn').classList.remove('open');
}

window.addEventListener('popstate', e => {
  const page = e.state && e.state.page ? e.state.page : (location.hash.slice(1) || 'home');
  activatePage(page);
});

(function() {
  const hash = location.hash.slice(1) || 'home';
  if (PAGE_MAP[hash]) {
    activatePage(hash);
    history.replaceState({ page: hash }, '', '#' + hash);
  }
})();

// STUMBLE
const GITHUB_RAW = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/words.json';

const FALLBACK = [
  { word:"AARON",    tag:"person",     type:"biography",   hint:"A programmer who believed information should be free.",                                 reveal:"Aaron Swartz was a prodigy who co-authored RSS at 14, helped build Creative Commons, and later faced federal prosecution for downloading academic articles — a case that became a flashpoint for debates about internet freedom and the law.", attr:"Aaron Swartz (1986–2013)", link:"https://en.wikipedia.org/wiki/Aaron_Swartz", linkLabel:"read his Wikipedia article" },
  { word:"GAME",     tag:"concept",    type:"rabbit hole", hint:"Four rules. Infinite universes. Zero players.",                                         reveal:"The Game of Life isn't a board game — it's a zero-player mathematical universe invented by John Conway in 1970. Four simple rules applied to a grid of cells produce spaceships, oscillators, and self-replicating patterns of infinite complexity.", attr:"Conway's Game of Life", link:"https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life", linkLabel:"enter the game of life" },
  { word:"MALGUDI",  tag:"literature", type:"excerpt",     hint:"A fictional South Indian town that felt more real than most real places.",              reveal:"Malgudi was a whole world. It had its own railway station, its own river, its own eccentric population. R.K. Narayan never put it on a map, and that was the point — it existed more completely in the imagination than any real place could.", attr:"on Malgudi Days — R.K. Narayan", link:"https://en.wikipedia.org/wiki/Malgudi_Days", linkLabel:"explore Malgudi Days" },
  { word:"BABEL",    tag:"myth",       type:"rabbit hole", hint:"A tower that explained why we can't understand each other.",                            reveal:"The Tower of Babel story draws from a Sumerian myth describing a golden age when all people spoke one tongue — and the gods grew nervous. Modern linguists count roughly 7,000 languages spoken today.", attr:"Genesis 11 / Sumerian mythology", link:"https://en.wikipedia.org/wiki/Tower_of_Babel", linkLabel:"read about Babel" },
  { word:"KAFKA",    tag:"writer",     type:"biography",   hint:"He asked for everything he wrote to be burned. It wasn't.",                            reveal:"Franz Kafka published almost nothing in his lifetime and asked his friend Max Brod to burn every manuscript when he died. Brod didn't. The word Kafkaesque entered dictionaries before most people had read a word he wrote.", attr:"Franz Kafka (1883–1924)", link:"https://en.wikipedia.org/wiki/Franz_Kafka", linkLabel:"read about Kafka" },
  { word:"LETHE",    tag:"mythology",  type:"rabbit hole", hint:"A river in the underworld. Drinking from it made you forget everything.",               reveal:"In Greek mythology, the dead drank from the Lethe — the river of forgetting — before reincarnation, so they wouldn't remember their past lives. Its opposite, the Mnemosyne, offered full memory.", attr:"Greek underworld mythology", link:"https://en.wikipedia.org/wiki/Lethe", linkLabel:"explore the Greek underworld" },
  { word:"SAGAN",    tag:"person",     type:"excerpt",     hint:"He made billions and billions feel intimate.",                                          reveal:"The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself. Carl Sagan wrote this in Cosmos, a book that sold more copies than any English-language science book in history at the time.", attr:"Carl Sagan, Cosmos (1980)", link:"https://en.wikipedia.org/wiki/Carl_Sagan", linkLabel:"read about Carl Sagan" },
  { word:"BORGES",   tag:"literature", type:"excerpt",     hint:"He wrote a library that contained every book ever written — and every book ever possible.", reveal:"Borges imagined a Library of Babel containing every possible book — including the true story of your death, the refutation of every false theory, and endless volumes of meaningless letters. The library is infinite, and most of it is gibberish.", attr:"Jorge Luis Borges, The Library of Babel (1941)", link:"https://en.wikipedia.org/wiki/The_Library_of_Babel", linkLabel:"enter the Library of Babel" },
  { word:"TRIAGE",   tag:"medicine",   type:"fact",        hint:"Napoleon's surgeon invented a system that treated enemies before officers.",             reveal:"The word triage comes from the French trier — to sort. It was formalized by Napoleon's surgeon Dominique Larrey, who devised a system to treat soldiers by urgency rather than rank.", attr:"History of triage — Dominique Larrey", link:"https://en.wikipedia.org/wiki/Triage", linkLabel:"read about triage" },
  { word:"ATLAS",    tag:"myth",       type:"rabbit hole", hint:"He held up the sky, not the Earth — and ended up on every map.",                        reveal:"Atlas was condemned to hold up the heavens — not the Earth, as commonly depicted. The first collection of maps bound together was called an atlas by Gerardus Mercator in 1595, because he put a picture of the Titan on the cover.", attr:"Atlas — Greek mythology and cartography", link:"https://en.wikipedia.org/wiki/Atlas_(mythology)", linkLabel:"read about Atlas" },
  { word:"SERENDIP", tag:"etymology",  type:"rabbit hole", hint:"The old name for Sri Lanka quietly gave us one of the most beautiful words in English.", reveal:"The word serendipity was coined in 1754 by Horace Walpole, inspired by a Persian fairy tale about three princes of Serendip — the old Arabic name for Sri Lanka — who made discoveries by accident and sagacity.", attr:"Etymology of serendipity", link:"https://en.wikipedia.org/wiki/Serendipity", linkLabel:"read about serendipity" },
  { word:"PILOT",    tag:"aviation",   type:"fact",        hint:"The hands-off moment happened nine years after Kitty Hawk.",                            reveal:"The word autopilot is older than you think — the first automatic flight control system was fitted to a Curtiss flying boat in 1912, just nine years after Kitty Hawk. The pilot literally tied the controls and walked away.", attr:"Wikipedia: Autopilot history", link:"https://en.wikipedia.org/wiki/Autopilot", linkLabel:"read about autopilot" },
  { word:"AUTOPILOT", tag:"technology", type:"history", hint:"Planes flew themselves before you think.", reveal:"Autopilot systems existed as early as 1912, allowing aircraft to maintain course automatically.", attr:"Aviation history", link:"https://en.wikipedia.org/wiki/Autopilot", linkLabel:"read about autopilot" },
  { word:"AKIRA", tag:"film", type:"culture", hint:"A city rebuilt on psychic destruction.", reveal:"Akira shaped cyberpunk globally, blending political unrest with psychic power in post-war Tokyo.", attr:"1988 anime film", link:"https://en.wikipedia.org/wiki/Akira_(1988_film)", linkLabel:"explore Akira" },
  { word:"MAYA", tag:"civilisation", type:"history", hint:"A calendar more precise than ours.", reveal:"The Maya developed advanced astronomical systems and complex calendars without modern tools.", attr:"Mesoamerica", link:"https://en.wikipedia.org/wiki/Maya_civilization", linkLabel:"explore Maya" },
  { word:"SCHRODINGER", tag:"science", type:"thought experiment", hint:"Alive and dead at once.", reveal:"Schrödinger's cat illustrates quantum superposition — a system existing in multiple states simultaneously.", attr:"Quantum mechanics", link:"https://en.wikipedia.org/wiki/Schr%C3%B6dinger%27s_cat", linkLabel:"open the box" },
  { word:"PROMETHEUS", tag:"myth", type:"symbol", hint:"He stole fire for humanity.", reveal:"Prometheus represents rebellion against divine authority and the cost of progress.", attr:"Greek mythology", link:"https://en.wikipedia.org/wiki/Prometheus", linkLabel:"read Prometheus" },
  { word:"INCEPTION", tag:"film", type:"concept", hint:"Dreams within dreams.", reveal:"Inception explores nested realities where time dilates and perception becomes unreliable.", attr:"Christopher Nolan", link:"https://en.wikipedia.org/wiki/Inception", linkLabel:"enter Inception" },
  { word:"ROME", tag:"civilisation", type:"history", hint:"An empire that shaped the world.", reveal:"Roman law, engineering, and governance still influence modern societies.", attr:"Ancient Rome", link:"https://en.wikipedia.org/wiki/Ancient_Rome", linkLabel:"explore Rome" },
  { word:"ODIN", tag:"mythology", type:"figure", hint:"A god who sacrificed for knowledge.", reveal:"Odin hung himself on Yggdrasil to gain wisdom — a symbol of knowledge through suffering.", attr:"Norse mythology", link:"https://en.wikipedia.org/wiki/Odin", linkLabel:"read Odin" },
  { word:"NIETZSCHE", tag:"philosophy", type:"biography", hint:"God is dead — now what?", reveal:"Nietzsche explored morality beyond religion, introducing the concept of the Übermensch.", attr:"Friedrich Nietzsche", link:"https://en.wikipedia.org/wiki/Friedrich_Nietzsche", linkLabel:"read Nietzsche" },
  { word:"VENICE", tag:"city", type:"history", hint:"A city floating on water.", reveal:"Venice was a maritime republic that dominated trade routes between East and West.", attr:"Italy", link:"https://en.wikipedia.org/wiki/Venice", linkLabel:"explore Venice" },
  { word:"BIGBANG", tag:"universe", type:"theory", hint:"Everything began from nothing.", reveal:"The Big Bang describes the universe expanding from a singularity 13.8 billion years ago.", attr:"Cosmology", link:"https://en.wikipedia.org/wiki/Big_Bang", linkLabel:"explore the Big Bang" },
  { word:"1984", tag:"book", type:"dystopia", hint:"A world where truth is rewritten daily.", reveal:"George Orwell's 1984 introduced concepts like Newspeak and doublethink — mechanisms by which language itself controls reality.", attr:"George Orwell (1949)", link:"https://en.wikipedia.org/wiki/Nineteen_Eighty-Four", linkLabel:"read about 1984" },
  { word:"BRAVE", tag:"book", type:"dystopia", hint:"Control through pleasure, not fear.", reveal:"Brave New World imagines a society engineered for happiness through conditioning and drugs — raising questions about freedom vs comfort.", attr:"Aldous Huxley (1932)", link:"https://en.wikipedia.org/wiki/Brave_New_World", linkLabel:"explore Brave New World" },
  { word:"DUNE", tag:"book", type:"epic", hint:"Power, prophecy, and desert planets.", reveal:"Frank Herbert's Dune blends ecology, religion, and politics into a saga where control of spice determines the fate of the universe.", attr:"Frank Herbert (1965)", link:"https://en.wikipedia.org/wiki/Dune_(novel)", linkLabel:"enter Dune" },
  { word:"LOLIBOOK", tag:"book", type:"controversy", hint:"A masterpiece or moral nightmare?", reveal:"Lolita is both a disturbing narrative and a literary landmark, forcing readers to confront unreliable narration and moral discomfort.", attr:"Vladimir Nabokov (1955)", link:"https://en.wikipedia.org/wiki/Lolita", linkLabel:"read Lolita" },
  { word:"ULYSSES", tag:"book", type:"modernism", hint:"A single day, infinitely complex.", reveal:"James Joyce's Ulysses transforms an ordinary day in Dublin into an experimental narrative mirroring The Odyssey.", attr:"James Joyce (1922)", link:"https://en.wikipedia.org/wiki/Ulysses_(novel)", linkLabel:"explore Ulysses" },
  { word:"SAPIENS", tag:"book", type:"history", hint:"A story of humans who believed in stories.", reveal:"Sapiens argues that shared myths — from money to nations — enabled large-scale human cooperation.", attr:"Yuval Noah Harari (2011)", link:"https://en.wikipedia.org/wiki/Sapiens:_A_Brief_History_of_Humankind", linkLabel:"read Sapiens" },
  { word:"ALCHEMIST", tag:"book", type:"philosophy", hint:"The universe conspires for you.", reveal:"The Alchemist presents a spiritual journey about destiny, intuition, and personal legend.", attr:"Paulo Coelho (1988)", link:"https://en.wikipedia.org/wiki/The_Alchemist_(novel)", linkLabel:"read The Alchemist" },
  { word:"CATCH22", tag:"book", type:"satire", hint:"You're trapped by logic itself.", reveal:"Catch-22 describes a paradox where rules prevent escape — a term now used for bureaucratic absurdity.", attr:"Joseph Heller (1961)", link:"https://en.wikipedia.org/wiki/Catch-22", linkLabel:"understand Catch-22" },
  { word:"FRANKEN", tag:"book", type:"gothic", hint:"The creator fears his creation.", reveal:"Frankenstein explores ambition, isolation, and responsibility in the face of scientific progress.", attr:"Mary Shelley (1818)", link:"https://en.wikipedia.org/wiki/Frankenstein", linkLabel:"read Frankenstein" },
  { word:"METAMOR", tag:"book", type:"existential", hint:"He woke up as an insect.", reveal:"Kafka's Metamorphosis reflects alienation and identity through surreal transformation.", attr:"Franz Kafka (1915)", link:"https://en.wikipedia.org/wiki/The_Metamorphosis", linkLabel:"read Metamorphosis" },
  { word:"GRAVITY", tag:"book", type:"postmodern", hint:"A rocket defines everything.", reveal:"Gravity's Rainbow connects paranoia, war, and technology into a fragmented narrative web.", attr:"Thomas Pynchon (1973)", link:"https://en.wikipedia.org/wiki/Gravity%27s_Rainbow", linkLabel:"explore Gravity's Rainbow" },
  { word:"INFINITE", tag:"book", type:"postmodern", hint:"Entertainment that traps you forever.", reveal:"Infinite Jest explores addiction and media through a film so pleasurable it immobilizes viewers.", attr:"David Foster Wallace (1996)", link:"https://en.wikipedia.org/wiki/Infinite_Jest", linkLabel:"read Infinite Jest" },
  { word:"OUTLIERS", tag:"book", type:"analysis", hint:"Success isn't what you think.", reveal:"Outliers argues that opportunity and timing matter as much as talent.", attr:"Malcolm Gladwell (2008)", link:"https://en.wikipedia.org/wiki/Outliers_(book)", linkLabel:"explore Outliers" },
  { word:"HOBBIT", tag:"book", type:"fantasy", hint:"A journey that changes everything.", reveal:"The Hobbit introduces Middle-earth and themes of courage, greed, and transformation.", attr:"J.R.R. Tolkien (1937)", link:"https://en.wikipedia.org/wiki/The_Hobbit", linkLabel:"enter The Hobbit" },
  { word:"FOG", tag:"phenomenon", type:"natural", hint:"Seeing without seeing.", reveal:"Fog forms when air cools to its dew point, reducing visibility and distorting perception.", attr:"Meteorology", link:"https://en.wikipedia.org/wiki/Fog", linkLabel:"explore fog" },
  { word:"AURORA", tag:"phenomenon", type:"cosmic", hint:"Lights from solar winds.", reveal:"Auroras occur when charged particles collide with Earth's atmosphere, creating glowing skies.", attr:"Space physics", link:"https://en.wikipedia.org/wiki/Aurora", linkLabel:"see auroras" },
  { word:"DEJAVU", tag:"phenomenon", type:"cognitive", hint:"You've been here before.", reveal:"Déjà vu may result from mismatched memory processing, giving a false sense of familiarity.", attr:"Cognitive science", link:"https://en.wikipedia.org/wiki/D%C3%A9j%C3%A0_vu", linkLabel:"understand déjà vu" },
  { word:"FLOW", tag:"phenomenon", type:"psychology", hint:"You lose track of time.", reveal:"Flow is a mental state of deep immersion where performance and satisfaction peak.", attr:"Mihaly Csikszentmihalyi", link:"https://en.wikipedia.org/wiki/Flow_(psychology)", linkLabel:"enter flow" },
  { word:"PLACEBO", tag:"phenomenon", type:"medical", hint:"Belief changes biology.", reveal:"The placebo effect shows that expectation alone can produce measurable physiological outcomes.", attr:"Medicine", link:"https://en.wikipedia.org/wiki/Placebo", linkLabel:"explore placebo" },
  { word:"BUTTERFLY", tag:"phenomenon", type:"chaos", hint:"Small changes, massive impact.", reveal:"The butterfly effect describes how tiny initial differences can lead to vastly different outcomes.", attr:"Chaos theory", link:"https://en.wikipedia.org/wiki/Butterfly_effect", linkLabel:"understand chaos" },
  { word:"SLEEP", tag:"phenomenon", type:"biology", hint:"Why do we lose consciousness daily?", reveal:"Sleep consolidates memory, repairs the body, and regulates emotions — yet its full purpose remains debated.", attr:"Neuroscience", link:"https://en.wikipedia.org/wiki/Sleep", linkLabel:"study sleep" },
  { word:"LUCID", tag:"phenomenon", type:"dreaming", hint:"Dreaming while aware.", reveal:"Lucid dreaming allows conscious control within dreams, blurring reality and imagination.", attr:"Dream research", link:"https://en.wikipedia.org/wiki/Lucid_dream", linkLabel:"explore lucid dreaming" },
  { word:"TIME", tag:"phenomenon", type:"concept", hint:"It flows only forward — or does it?", reveal:"Time may be an emergent property rather than a fundamental force, challenging intuitive experience.", attr:"Physics", link:"https://en.wikipedia.org/wiki/Time", linkLabel:"explore time" },
  { word:"ECHO", tag:"phenomenon", type:"acoustic", hint:"Sound returning to you.", reveal:"Echoes occur when sound waves reflect off surfaces and return after a delay.", attr:"Acoustics", link:"https://en.wikipedia.org/wiki/Echo", linkLabel:"understand echo" },
  { word:"FIREWHIRL", tag:"phenomenon", type:"extreme", hint:"A tornado made of fire.", reveal:"Fire whirls occur when heat and wind combine to create rotating columns of flame.", attr:"Fire science", link:"https://en.wikipedia.org/wiki/Fire_whirl", linkLabel:"see fire whirl" },
  { word:"MIRAGE", tag:"phenomenon", type:"optical", hint:"Water that isn't there.", reveal:"Mirages occur when light bends due to temperature differences, creating illusions.", attr:"Optics", link:"https://en.wikipedia.org/wiki/Mirage", linkLabel:"explore mirages" },
  { word:"SYNESTHESIA", tag:"phenomenon", type:"neurological", hint:"Seeing sounds, tasting colors.", reveal:"Synesthesia links senses, causing cross-perception experiences.", attr:"Neuroscience", link:"https://en.wikipedia.org/wiki/Synesthesia", linkLabel:"understand synesthesia" },
  { word:"DOPPLER", tag:"phenomenon", type:"physics", hint:"Sound shifts as things move.", reveal:"The Doppler effect explains pitch changes based on motion — used in radar and astronomy.", attr:"Physics", link:"https://en.wikipedia.org/wiki/Doppler_effect", linkLabel:"learn Doppler effect" },
  { word:"EVEREST", tag:"mountain", type:"extreme", hint:"The highest point humans can stand on.", reveal:"Mount Everest rises 8,848.86 meters above sea level, yet climbing it is more about surviving low oxygen and weather than raw height.", attr:"Himalayas, Nepal–China", link:"https://en.wikipedia.org/wiki/Mount_Everest", linkLabel:"explore Everest" },
  { word:"K2", tag:"mountain", type:"extreme", hint:"Harder than Everest, deadlier too.", reveal:"K2 has one of the highest fatality rates among major peaks due to unpredictable weather and technical difficulty.", attr:"Karakoram Range", link:"https://en.wikipedia.org/wiki/K2", linkLabel:"explore K2" },
  { word:"ANNAPURNA", tag:"mountain", type:"extreme", hint:"Beauty with a cost.", reveal:"Annapurna I has historically had one of the highest death-to-summit ratios among 8000m peaks.", attr:"Nepal Himalayas", link:"https://en.wikipedia.org/wiki/Annapurna", linkLabel:"explore Annapurna" },
  { word:"KAILASH", tag:"mountain", type:"sacred", hint:"No one climbs this peak.", reveal:"Mount Kailash is considered sacred in Hinduism, Buddhism, Jainism, and Bon — climbing it is forbidden.", attr:"Tibet", link:"https://en.wikipedia.org/wiki/Mount_Kailash", linkLabel:"explore Kailash" },
  { word:"FUJI", tag:"mountain", type:"cultural", hint:"A volcano turned icon.", reveal:"Mount Fuji is both an active volcano and a spiritual symbol deeply embedded in Japanese culture.", attr:"Japan", link:"https://en.wikipedia.org/wiki/Mount_Fuji", linkLabel:"explore Fuji" },
  { word:"KILIMANJARO", tag:"mountain", type:"volcanic", hint:"Africa's highest peak.", reveal:"Kilimanjaro is a dormant volcano with three cones and shrinking glaciers.", attr:"Tanzania", link:"https://en.wikipedia.org/wiki/Mount_Kilimanjaro", linkLabel:"explore Kilimanjaro" },
  { word:"ALPS", tag:"mountain", type:"range", hint:"Europe's natural barrier.", reveal:"The Alps span eight countries and have shaped climate, culture, and warfare for centuries.", attr:"Europe", link:"https://en.wikipedia.org/wiki/Alps", linkLabel:"explore the Alps" },
  { word:"ANDES", tag:"mountain", type:"range", hint:"The longest mountain range.", reveal:"The Andes stretch over 7,000 km along South America's western edge.", attr:"South America", link:"https://en.wikipedia.org/wiki/Andes", linkLabel:"explore the Andes" },
  { word:"ROCKIES", tag:"mountain", type:"range", hint:"A backbone of North America.", reveal:"The Rocky Mountains influence weather patterns and ecosystems across the continent.", attr:"North America", link:"https://en.wikipedia.org/wiki/Rocky_Mountains", linkLabel:"explore Rockies" },
  { word:"CAMINO", tag:"trail", type:"pilgrimage", hint:"A walk toward meaning.", reveal:"The Camino de Santiago is a network of pilgrimage routes leading to a shrine in Spain.", attr:"Spain", link:"https://en.wikipedia.org/wiki/Camino_de_Santiago", linkLabel:"walk the Camino" },
  { word:"MACHUPICCHU", tag:"place", type:"heritage", hint:"A city in the clouds.", reveal:"Machu Picchu was an Incan citadel hidden in the Andes, rediscovered in 1911.", attr:"Peru", link:"https://en.wikipedia.org/wiki/Machu_Picchu", linkLabel:"explore Machu Picchu" },
  { word:"PETRA", tag:"place", type:"ancient", hint:"A city carved into stone.", reveal:"Petra was the capital of the Nabataean kingdom, known for rock-cut architecture.", attr:"Jordan", link:"https://en.wikipedia.org/wiki/Petra", linkLabel:"explore Petra" },
  { word:"ANGKOR", tag:"place", type:"ancient", hint:"A lost jungle city.", reveal:"Angkor was the center of the Khmer Empire and includes the famous Angkor Wat temple.", attr:"Cambodia", link:"https://en.wikipedia.org/wiki/Angkor", linkLabel:"explore Angkor" },
  { word:"VARANASI", tag:"city", type:"spiritual", hint:"One of the oldest living cities.", reveal:"Varanasi has been continuously inhabited for thousands of years and is central to Hindu rituals.", attr:"India", link:"https://en.wikipedia.org/wiki/Varanasi", linkLabel:"explore Varanasi" },
  { word:"ULURU", tag:"place", type:"sacred", hint:"A rock with deep meaning.", reveal:"Uluru is sacred to Indigenous Australians and carries cultural and spiritual significance.", attr:"Australia", link:"https://en.wikipedia.org/wiki/Uluru", linkLabel:"explore Uluru" },
  { word:"SAHARA", tag:"place", type:"desert", hint:"A sea of sand.", reveal:"The Sahara is the largest hot desert, with extreme temperature shifts and vast dunes.", attr:"Africa", link:"https://en.wikipedia.org/wiki/Sahara", linkLabel:"explore Sahara" },
  { word:"GOBI", tag:"place", type:"desert", hint:"Cold, harsh, and vast.", reveal:"The Gobi Desert is known for extreme temperatures and fossil discoveries.", attr:"Mongolia/China", link:"https://en.wikipedia.org/wiki/Gobi_Desert", linkLabel:"explore Gobi" },
  { word:"AMAZON", tag:"place", type:"ecosystem", hint:"The lungs of Earth.", reveal:"The Amazon rainforest produces significant oxygen and hosts immense biodiversity.", attr:"South America", link:"https://en.wikipedia.org/wiki/Amazon_rainforest", linkLabel:"explore Amazon" },
  { word:"ANTARCTICA", tag:"place", type:"extreme", hint:"A frozen continent.", reveal:"Antarctica is the coldest, driest, and windiest continent on Earth.", attr:"South Pole", link:"https://en.wikipedia.org/wiki/Antarctica", linkLabel:"explore Antarctica" },
  { word:"GRANDCANYON", tag:"place", type:"geology", hint:"A timeline carved in rock.", reveal:"The Grand Canyon reveals millions of years of geological history.", attr:"USA", link:"https://en.wikipedia.org/wiki/Grand_Canyon", linkLabel:"explore Grand Canyon" },
  { word:"GALAPAGOS", tag:"place", type:"ecosystem", hint:"Evolution in isolation.", reveal:"The Galápagos Islands inspired Darwin's theory of evolution.", attr:"Ecuador", link:"https://en.wikipedia.org/wiki/Gal%C3%A1pagos_Islands", linkLabel:"explore Galápagos" },
  { word:"YELLOWSTONE", tag:"place", type:"geothermal", hint:"A volcano beneath a park.", reveal:"Yellowstone sits atop a supervolcano with geysers and hot springs.", attr:"USA", link:"https://en.wikipedia.org/wiki/Yellowstone_National_Park", linkLabel:"explore Yellowstone" },
  { word:"BANFF", tag:"place", type:"nature", hint:"Turquoise lakes and peaks.", reveal:"Banff National Park is known for glaciers, lakes, and alpine landscapes.", attr:"Canada", link:"https://en.wikipedia.org/wiki/Banff_National_Park", linkLabel:"explore Banff" },
  { word:"PATAGONIA", tag:"place", type:"wild", hint:"The edge of the world.", reveal:"Patagonia spans Argentina and Chile, known for glaciers and rugged terrain.", attr:"South America", link:"https://en.wikipedia.org/wiki/Patagonia", linkLabel:"explore Patagonia" },
  { word:"TORRES", tag:"mountain", type:"iconic", hint:"Spikes of stone in the sky.", reveal:"Torres del Paine features dramatic granite peaks formed by glacial activity.", attr:"Chile", link:"https://en.wikipedia.org/wiki/Torres_del_Paine", linkLabel:"explore Torres del Paine" }
];

let WORDS = [], secret, entry, maxRows, stRow, stCol, board, over;
let played = 0, won = 0, used = [];

async function loadWords() {
  try {
    const r = await fetch(GITHUB_RAW, { cache: 'no-cache' });
    if (!r.ok) throw new Error();
    WORDS = await r.json();
  } catch(e) {
    WORDS = FALLBACK;
    const err = document.getElementById('st-error');
    err.style.display = 'block';
    setTimeout(() => err.style.display = 'none', 4000);
  }
  document.getElementById('st-loading').style.display = 'none';
  document.getElementById('st-game').style.display   = 'block';
  startGame();
}

function pick() {
  if (used.length >= WORDS.length) used = [];
  let i;
  do { i = Math.floor(Math.random() * WORDS.length); } while (used.includes(i));
  used.push(i);
  return WORDS[i];
}

function startGame() {
  entry   = pick();
  secret  = entry.word.toUpperCase();
  maxRows = secret.length + 1;
  stRow = 0; stCol = 0;
  board = Array.from({ length: maxRows }, () => Array(secret.length).fill(''));
  over  = false;

  document.getElementById('p-len').textContent = secret.length + ' letters';
  document.getElementById('p-try').textContent = maxRows + ' chances';
  document.getElementById('p-tag').textContent = entry.tag;

  document.getElementById('st-hint-btn').style.display = 'inline-block';
  document.getElementById('st-hint-text').style.display = 'none';
  document.getElementById('st-hint-text').textContent = '';
  document.getElementById('st-reveal').classList.remove('show');
  document.getElementById('st-next').style.display = 'none';
  setMsg('start typing', '');
  buildGrid();
  updateScore();
  resetKeys();
}

function revealHint() {
  document.getElementById('st-hint-btn').style.display = 'none';
  const htxt = document.getElementById('st-hint-text');
  htxt.textContent   = entry.hint || 'no hint available.';
  htxt.style.display = 'block';
}

function buildGrid() {
  const g = document.getElementById('st-grid');
  g.innerHTML = '';
  for (let r = 0; r < maxRows; r++) {
    const rw = document.createElement('div');
    rw.className = 'st-row';
    for (let c = 0; c < secret.length; c++) {
      const cell = document.createElement('div');
      cell.className = 'st-cell' + (r === 0 ? ' active' : '');
      cell.id = `s-${r}-${c}`;
      rw.appendChild(cell);
    }
    g.appendChild(rw);
  }
}

function setCell(r, c, letter, state) {
  const el = document.getElementById(`s-${r}-${c}`);
  if (!el) return;
  el.textContent = letter;
  let cls = 'st-cell';
  if (state)            cls += ' ' + state;
  else if (letter)      cls += ' filled';
  else if (r === stRow) cls += ' active';
  el.className = cls;
}

document.addEventListener('keydown', e => {
  if (!document.getElementById('page-home').classList.contains('active')) return;
  if (e.metaKey || e.ctrlKey) return;
  const k = e.key.toUpperCase();
  if      (k === 'BACKSPACE') handle('BACKSPACE');
  else if (k === 'ENTER')     handle('ENTER');
  else if (/^[A-Z]$/.test(k)) handle(k);
});

function handle(k) {
  if (over) return;
  const W = secret.length;
  if (k === 'BACKSPACE') {
    if (stCol > 0) { stCol--; board[stRow][stCol] = ''; setCell(stRow, stCol, '', ''); }
    setMsg('', '');
  } else if (k === 'ENTER') {
    submit();
  } else if (/^[A-Z]$/.test(k) && stCol < W) {
    board[stRow][stCol] = k;
    setCell(stRow, stCol, k, '');
    stCol++;
    setMsg('', '');
  }
}

function colorKeys(guess, result) {
  const priority = { correct: 3, present: 2, absent: 1 };
  result.forEach((state, i) => {
    const letter = guess[i];
    const btn = document.querySelector(`.kb-key[data-key="${letter}"]`);
    if (!btn) return;
    const cur = btn.dataset.state || '';
    if ((priority[state] || 0) > (priority[cur] || 0)) {
      btn.dataset.state = state;
      btn.className = 'kb-key' + (btn.classList.contains('wide') ? ' wide' : '') + ' ' + state;
    }
  });
}

function resetKeys() {
  document.querySelectorAll('.kb-key').forEach(btn => {
    delete btn.dataset.state;
    btn.className = 'kb-key' + (btn.dataset.key === 'ENTER' || btn.dataset.key === 'BACKSPACE' ? ' wide' : '');
  });
}

function scoreGuess(guess, ans) {
  const W = ans.length, res = Array(W).fill('absent'), cnt = {};
  for (const c of ans) cnt[c] = (cnt[c] || 0) + 1;
  for (let i = 0; i < W; i++) if (guess[i] === ans[i]) { res[i] = 'correct'; cnt[guess[i]]--; }
  for (let i = 0; i < W; i++) if (res[i] !== 'correct' && cnt[guess[i]] > 0) { res[i] = 'present'; cnt[guess[i]]--; }
  return res;
}

// Wire on-screen keyboard: touchstart for instant mobile response, mousedown for desktop fallback
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.kb-key').forEach(btn => {
    const fire = (e) => {
      e.preventDefault();
      handle(btn.dataset.key);
    };
    btn.addEventListener('touchstart', fire, { passive: false });
    btn.addEventListener('mousedown', fire);
  });
});

function submit() {
  const W = secret.length;
  if (stCol < W) { setMsg('not enough letters', 'err'); return; }
  const guess  = board[stRow].join('');
  const result = scoreGuess(guess, secret);
  result.forEach((state, c) => setCell(stRow, c, guess[c], state));
  colorKeys(guess, result);

  if (guess === secret) {
    won++; played++;
    setMsg('you found the rabbit hole', 'win');
    over = true; showReveal();
    document.getElementById('st-next').style.display = 'inline-block';
    updateScore(); return;
  }

  stRow++; stCol = 0;
  if (stRow < maxRows) {
    for (let c = 0; c < secret.length; c++) setCell(stRow, c, '', '');
    setMsg('', '');
  } else {
    played++;
    setMsg('the word was ' + secret, 'err');
    over = true; showReveal();
    document.getElementById('st-next').style.display = 'inline-block';
    updateScore();
  }
}

function showReveal() {
  const w = entry.word;
  document.getElementById('st-reveal-word').textContent    = w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  document.getElementById('st-reveal-typetag').textContent = entry.type + ' · ' + entry.tag;
  document.getElementById('st-reveal-text').textContent    = entry.reveal;
  document.getElementById('st-reveal-attr').textContent    = '— ' + entry.attr;
  const lk = document.getElementById('st-reveal-link');
  if (entry.link) { lk.href = entry.link; lk.textContent = entry.linkLabel || 'read more →'; lk.style.display = 'inline'; }
  else { lk.style.display = 'none'; }
  document.getElementById('st-reveal').classList.add('show');
  document.getElementById('st-hint-btn').style.display = 'none';
  document.getElementById('st-hint-text').style.display = 'none';
}

function setMsg(t, cls) {
  const el = document.getElementById('st-msg');
  el.textContent = t; el.className = cls || '';
}

function updateScore() {
  document.getElementById('st-score').textContent =
    played > 0 ? won + ' of ' + played + ' words solved' : '';
}

loadWords();