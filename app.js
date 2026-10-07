const STORAGE_KEY = "cisc3012-study-v1";

const UI = {
  en: {
    title: "CISC3012 Study Notes · Ch1–Ch3",
    brand: "Ch1–Ch3 Study Notes",
    toc: "Contents",
    menu: "Contents",
    menuLabel: "Open contents",
    read: "Read",
    cards: "Cards",
    quiz: "Quiz",
    searchLabel: "Search notes",
    searchPlaceholder: "Search the notes…",
    skim: "Skim: headings, lists, and tables",
    exam: "Exam point",
    mark: "Mark as reviewed",
    marked: "Reviewed",
    progress: "Reviewed {0}/{1}   Cards {2}/{3}",
    found: "Found {0} sections",
    foundOne: "Found 1 section",
    cardsTitle: "Flashcards",
    cardsLede: "Answer first, then flip the card. What you remember stays in this browser.",
    cardHint: "Click, or press Space, to flip",
    answer: "Answer",
    prev: "Previous",
    again: "Still learning",
    known: "Got it",
    next: "Next",
    filterAll: "All",
    filterAgain: "Still learning",
    cardEmptyMeta: "No cards left in this set.",
    cardEmptyFront: "You have marked them all as got it. Switch chapter, or mark a card as still learning.",
    cardStatusKnown: "Got it",
    cardStatusNew: "Not marked",
    cardMeta: "{0} / {1}   {2}",
    quizTitle: "Quiz",
    quizLede: "Pick one answer. Wrong questions are kept so you can practice only those.",
    quizRestart: "Start over",
    quizWrongOnly: "Wrong answers only",
    quizMeta: "Question {0} / {1}   {2} correct",
    correct: "Correct. ",
    incorrect: "Look at this one again. ",
    nextQ: "Next question",
    perfect: "All correct. Later, use the cards to write the tables and complexities from memory.",
    wrongDetail: "{0} wrong. Read the explanation, then use “Review wrong answers.”",
    reviewWrong: "Review wrong answers",
    tryAgain: "Try again",
  },
  zh: {
    title: "CISC3012 學習站 · Ch1–Ch3",
    brand: "Ch1–Ch3 學習站",
    toc: "章節目錄",
    menu: "目錄",
    menuLabel: "打開目錄",
    read: "閱讀",
    cards: "閃卡",
    quiz: "自測",
    searchLabel: "搜尋筆記",
    searchPlaceholder: "搜尋知識點…",
    skim: "速覽：只留標題、列表、表格",
    exam: "考試重點",
    mark: "標為已複習",
    marked: "已複習",
    progress: "已複習 {0}/{1}　閃卡 {2}/{3}",
    found: "找到 {0} 節",
    foundOne: "找到 1 節",
    cardsTitle: "閃卡複習",
    cardsLede: "先自己答，再翻面。記住與否會留在這台瀏覽器裡。",
    cardHint: "點一下，或按空白鍵翻面",
    answer: "答案",
    prev: "上一張",
    again: "還不熟",
    known: "記住了",
    next: "下一張",
    filterAll: "全部",
    filterAgain: "還不熟",
    cardEmptyMeta: "這一組已經沒有卡片。",
    cardEmptyFront: "全部記住了。可以改看其他章，或把卡片標回還不熟。",
    cardStatusKnown: "已記住",
    cardStatusNew: "未標記",
    cardMeta: "{0} / {1}　{2}",
    quizTitle: "自測",
    quizLede: "選一個答案。錯題會留下來，可以只再練錯的。",
    quizRestart: "從頭開始",
    quizWrongOnly: "只練錯題",
    quizMeta: "第 {0} / {1} 題　目前 {2} 題正確",
    correct: "答對。",
    incorrect: "這題再看一次。",
    nextQ: "下一題",
    perfect: "這一輪全對。可以隔一陣子再用閃卡把表格和複雜度默寫一次。",
    wrongDetail: "錯了 {0} 題。先看解釋，再用「複習錯題」把同一批重做。",
    reviewWrong: "複習錯題",
    tryAgain: "再測一輪",
  },
};

const store = loadStore();
const state = {
  lang: store.lang === "zh" ? "zh" : "en",
  mode: "read",
  skim: false,
  query: "",
  cardFilter: "all",
  cardIndex: 0,
  cardFlipped: false,
  quiz: [],
  quizIndex: 0,
  quizPicked: null,
  quizCorrect: 0,
  quizAnswered: 0,
  quizWrongIds: [],
};

const article = document.querySelector("#article");
const toc = document.querySelector("#toc");
const progressEl = document.querySelector("#progress");
const searchEl = document.querySelector("#search");

function loadStore() {
  try {
    return Object.assign({ lang: "en", read: {}, cards: {}, quizBest: 0, quizWrong: [] }, JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
  } catch {
    return { lang: "en", read: {}, cards: {}, quizBest: 0, quizWrong: [] };
  }
}

function saveStore() {
  store.lang = state.lang;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  renderProgress();
  renderToc();
}

function t(key, ...args) {
  let text = UI[state.lang][key];
  args.forEach((arg, index) => {
    text = text.replaceAll(`{${index}}`, String(arg));
  });
  return text;
}

function notes() {
  return state.lang === "en" ? window.NOTES_EN : (window.NOTES_ZH || window.NOTES);
}

function currentCards() {
  const raw = state.lang === "en" ? window.CARDS_EN : (window.CARDS_ZH || window.CARDS);
  return raw.map((card, index) => ({ ...card, id: `card-${index}` }));
}

function quizBank() {
  const raw = state.lang === "en" ? window.QUIZ_EN : (window.QUIZ_ZH || window.QUIZ);
  return raw.map((item, index) => ({ ...item, id: `q-${index}` }));
}

function allSections() {
  return notes().flatMap((chapter) => chapter.sections.map((section) => ({ chapter, section })));
}

function chapterColor(index) {
  return ["#b24a28", "#1d6a5f", "#29456f", "#8a4b12", "#5c4d7a"][index % 5];
}

function renderToc() {
  const parts = [];
  notes().forEach((chapter, index) => {
    parts.push(`<p class="toc-chapter"><span class="dot" style="background:${chapterColor(index)}"></span>${escapeHtml(chapter.title)}</p>`);
    chapter.sections.forEach((section) => {
      const done = store.read[section.id] ? " done" : "";
      parts.push(`<a class="${done}" href="#${section.id}" data-id="${section.id}">${escapeHtml(section.title)}</a>`);
    });
  });
  toc.innerHTML = parts.join("");
}

function renderArticle() {
  article.innerHTML = notes().map((chapter, index) => {
    const banner = `
      <header class="chapter-banner" id="${chapter.id}">
        <h1><span class="dot" style="background:${chapterColor(index)}"></span>${escapeHtml(chapter.title)}</h1>
      </header>`;
    const sections = chapter.sections.map((section) => {
      const exam = section.exam ? `<span class="exam">${escapeHtml(t("exam"))}</span>` : "";
      const on = store.read[section.id] ? " on" : "";
      const label = store.read[section.id] ? t("marked") : t("mark");
      return `
        <section class="section" id="${section.id}" data-id="${section.id}">
          <div class="section-head">
            <h2>${escapeHtml(section.title)}${exam}</h2>
            <button type="button" class="mark${on}" data-mark="${section.id}">${label}</button>
          </div>
          <div class="prose">${section.html}</div>
        </section>`;
    }).join("");
    return banner + sections;
  }).join("");
}

function renderProgress() {
  const total = allSections().length;
  const done = Object.values(store.read).filter(Boolean).length;
  const known = currentCards().filter((card) => store.cards[card.id] === "known").length;
  progressEl.textContent = t("progress", done, total, known, currentCards().length);
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll(".mode").forEach((button) => {
    button.setAttribute("aria-selected", String(button.dataset.mode === mode));
  });
  document.querySelector("#view-read").hidden = mode !== "read";
  document.querySelector("#view-cards").hidden = mode !== "cards";
  document.querySelector("#view-quiz").hidden = mode !== "quiz";
  document.querySelector(".search").hidden = mode !== "read";
  if (mode === "cards") renderCard();
  if (mode === "quiz" && state.quiz.length === 0) startQuiz(false);
  closeSidebar();
}

function applySearch() {
  const q = state.query.trim().toLowerCase();
  let shown = 0;
  document.querySelectorAll(".section").forEach((section) => {
    clearMarks(section);
    const text = section.textContent.toLowerCase();
    const match = !q || text.includes(q);
    section.hidden = !match;
    if (match) {
      shown += 1;
      if (q) highlight(section, state.query.trim());
    }
  });
  document.querySelectorAll(".chapter-banner").forEach((banner) => {
    const next = nextElementUntilBanner(banner);
    banner.hidden = next.length === 0;
  });
  const meta = document.querySelector("#search-meta");
  meta.textContent = !q ? "" : shown === 1 ? t("foundOne") : t("found", shown);
  document.querySelectorAll(".toc a").forEach((link) => {
    const target = document.getElementById(link.dataset.id);
    link.hidden = target ? target.hidden : false;
  });
}

function nextElementUntilBanner(banner) {
  const found = [];
  let node = banner.nextElementSibling;
  while (node && !node.classList.contains("chapter-banner")) {
    if (node.classList.contains("section") && !node.hidden) found.push(node);
    node = node.nextElementSibling;
  }
  return found;
}

function clearMarks(root) {
  root.querySelectorAll("mark.hit").forEach((mark) => {
    mark.replaceWith(document.createTextNode(mark.textContent));
  });
  root.normalize();
}

function highlight(root, query) {
  const re = new RegExp(escapeRegExp(query), "gi");
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      if (node.parentElement && node.parentElement.closest("script, style")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    re.lastIndex = 0;
    if (!re.test(node.nodeValue)) return;
    re.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0;
    let match;
    const text = node.nodeValue;
    while ((match = re.exec(text))) {
      frag.append(document.createTextNode(text.slice(last, match.index)));
      const mark = document.createElement("mark");
      mark.className = "hit";
      mark.textContent = match[0];
      frag.append(mark);
      last = match.index + match[0].length;
      if (match.index === re.lastIndex) re.lastIndex += 1;
    }
    frag.append(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  });
}

function activeCards() {
  if (state.cardFilter === "again") {
    return currentCards().filter((card) => store.cards[card.id] !== "known");
  }
  return currentCards().filter((card) => state.cardFilter === "all" || card.ch === state.cardFilter);
}

function renderCardFilters() {
  const filters = [
    ["all", t("filterAll")],
    ["Ch1", "Ch1"],
    ["Ch2", "Ch2"],
    ["Ch3", "Ch3"],
    ["again", t("filterAgain")],
  ];
  document.querySelector("#card-filters").innerHTML = filters.map(([id, name]) => {
    const pressed = id === state.cardFilter ? "true" : "false";
    return `<button type="button" class="chip" data-card-filter="${id}" aria-pressed="${pressed}">${name}</button>`;
  }).join("");
}

function renderCard() {
  const cards = activeCards();
  const meta = document.querySelector("#card-meta");
  if (cards.length === 0) {
    meta.textContent = t("cardEmptyMeta");
    document.querySelector("#card-front").textContent = t("cardEmptyFront");
    document.querySelector("#card-back").textContent = "";
    document.querySelector("#card-tag").textContent = "";
    return;
  }
  state.cardIndex = Math.min(state.cardIndex, cards.length - 1);
  const card = cards[state.cardIndex];
  document.querySelector("#card-tag").textContent = card.ch;
  document.querySelector("#card-front").textContent = card.front;
  document.querySelector("#card-back").textContent = card.back;
  document.querySelector("#card").classList.toggle("flipped", state.cardFlipped);
  const status = store.cards[card.id] === "known" ? t("cardStatusKnown") : t("cardStatusNew");
  meta.textContent = t("cardMeta", state.cardIndex + 1, cards.length, status);
  document.querySelector("#card").dataset.current = card.id;
}

function currentCard() {
  return activeCards()[state.cardIndex] || null;
}

function moveCard(step) {
  const cards = activeCards();
  if (cards.length === 0) return;
  state.cardIndex = (state.cardIndex + step + cards.length) % cards.length;
  state.cardFlipped = false;
  renderCard();
}

function gradeCard(grade) {
  const card = currentCard();
  if (!card) return;
  store.cards[card.id] = grade;
  saveStore();
  if (state.cardFilter === "again" && grade === "known") {
    state.cardFlipped = false;
    renderCard();
    return;
  }
  moveCard(1);
}

function startQuiz(wrongOnly) {
  const bank = quizBank();
  const wrong = new Set(store.quizWrong);
  const source = wrongOnly ? bank.filter((item) => wrong.has(item.id)) : bank.slice();
  state.quiz = source.length ? source : bank.slice();
  state.quizIndex = 0;
  state.quizPicked = null;
  state.quizCorrect = 0;
  state.quizAnswered = 0;
  state.quizWrongIds = [];
  document.querySelector("#quiz-play").hidden = false;
  document.querySelector("#quiz-done").hidden = true;
  renderQuiz();
}

function renderQuiz() {
  const item = state.quiz[state.quizIndex];
  if (!item) return finishQuiz();
  document.querySelector("#quiz-meta").textContent = t("quizMeta", state.quizIndex + 1, state.quiz.length, state.quizCorrect);
  document.querySelector("#quiz-tag").textContent = item.ch;
  document.querySelector("#quiz-q").textContent = item.q;
  document.querySelector("#quiz-choices").innerHTML = item.choices.map((choice, index) =>
    `<button type="button" class="choice" data-choice="${index}">${escapeHtml(choice)}</button>`
  ).join("");
  const why = document.querySelector("#quiz-why");
  why.hidden = true;
  why.textContent = "";
  document.querySelector("#quiz-next").disabled = true;
}

function pickChoice(index) {
  if (state.quizPicked !== null) return;
  const item = state.quiz[state.quizIndex];
  state.quizPicked = index;
  state.quizAnswered += 1;
  const correct = index === item.answer;
  if (correct) state.quizCorrect += 1;
  else state.quizWrongIds.push(item.id);
  document.querySelectorAll(".choice").forEach((button) => {
    const choice = Number(button.dataset.choice);
    if (choice === item.answer) button.classList.add("correct");
    if (choice === index && !correct) button.classList.add("wrong");
  });
  const why = document.querySelector("#quiz-why");
  why.hidden = false;
  why.textContent = (correct ? t("correct") : t("incorrect")) + item.why;
  document.querySelector("#quiz-next").disabled = false;
  document.querySelector("#quiz-meta").textContent = t("quizMeta", state.quizIndex + 1, state.quiz.length, state.quizCorrect);
}

function nextQuiz() {
  state.quizIndex += 1;
  state.quizPicked = null;
  if (state.quizIndex >= state.quiz.length) finishQuiz();
  else renderQuiz();
}

function finishQuiz() {
  document.querySelector("#quiz-play").hidden = true;
  const done = document.querySelector("#quiz-done");
  done.hidden = false;
  const total = state.quizAnswered || state.quiz.length;
  const score = state.quizCorrect;
  document.querySelector("#quiz-score").textContent = `${score} / ${total}`;
  document.querySelector("#quiz-score-detail").textContent = score === total
    ? t("perfect")
    : t("wrongDetail", state.quizWrongIds.length);
  store.quizWrong = state.quizWrongIds;
  store.quizBest = Math.max(store.quizBest || 0, score);
  saveStore();
}

function closeSidebar() {
  document.querySelector("#sidebar").classList.remove("open");
  document.querySelector("#backdrop").hidden = true;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[char]));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

document.querySelectorAll(".mode").forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});

document.querySelector("#skim-btn").addEventListener("click", () => {
  state.skim = !state.skim;
  document.body.classList.toggle("skim", state.skim);
  document.querySelector("#skim-btn").setAttribute("aria-pressed", String(state.skim));
});

searchEl.addEventListener("input", () => {
  state.query = searchEl.value;
  applySearch();
});

article.addEventListener("click", (event) => {
  const button = event.target.closest("[data-mark]");
  if (!button) return;
  const id = button.dataset.mark;
  store.read[id] = !store.read[id];
  button.classList.toggle("on", store.read[id]);
  button.textContent = store.read[id] ? t("marked") : t("mark");
  saveStore();
});

toc.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-id]");
  if (!link) return;
  setMode("read");
  const target = document.getElementById(link.dataset.id);
  if (target && target.hidden) {
    searchEl.value = "";
    state.query = "";
    applySearch();
  }
  closeSidebar();
});

document.querySelector("#menu-btn").addEventListener("click", () => {
  document.querySelector("#sidebar").classList.add("open");
  document.querySelector("#backdrop").hidden = false;
});
document.querySelector("#backdrop").addEventListener("click", closeSidebar);

document.querySelector("#card-filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-card-filter]");
  if (!button) return;
  state.cardFilter = button.dataset.cardFilter;
  state.cardIndex = 0;
  state.cardFlipped = false;
  renderCardFilters();
  renderCard();
});
document.querySelector("#card").addEventListener("click", () => {
  state.cardFlipped = !state.cardFlipped;
  document.querySelector("#card").classList.toggle("flipped", state.cardFlipped);
});
document.querySelector("#card-prev").addEventListener("click", () => moveCard(-1));
document.querySelector("#card-next").addEventListener("click", () => moveCard(1));
document.querySelector("#card-again").addEventListener("click", () => gradeCard("again"));
document.querySelector("#card-known").addEventListener("click", () => gradeCard("known"));

document.querySelector("#quiz-choices").addEventListener("click", (event) => {
  const button = event.target.closest("[data-choice]");
  if (!button) return;
  pickChoice(Number(button.dataset.choice));
});
document.querySelector("#quiz-next").addEventListener("click", nextQuiz);
document.querySelector("#quiz-restart").addEventListener("click", () => startQuiz(false));
document.querySelector("#quiz-wrong").addEventListener("click", () => startQuiz(true));
document.querySelector("#quiz-again").addEventListener("click", () => startQuiz(false));
document.querySelector("#quiz-review-wrong").addEventListener("click", () => startQuiz(true));

document.addEventListener("keydown", (event) => {
  const typing = event.target.matches("input, textarea");
  if (state.mode === "cards" && !typing) {
    if (event.key === " ") {
      event.preventDefault();
      state.cardFlipped = !state.cardFlipped;
      document.querySelector("#card").classList.toggle("flipped", state.cardFlipped);
    } else if (event.key === "ArrowRight") moveCard(1);
    else if (event.key === "ArrowLeft") moveCard(-1);
    else if (event.key === "1") gradeCard("again");
    else if (event.key === "2") gradeCard("known");
  }
  if (state.mode === "read" && event.key === "/" && !typing) {
    event.preventDefault();
    searchEl.focus();
  }
});

let observer;

function observeSections() {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    document.querySelectorAll(".toc a").forEach((link) => {
      link.classList.toggle("active", link.dataset.id === visible.target.id);
    });
  }, { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.4] });
  document.querySelectorAll(".section").forEach((section) => observer.observe(section));
}

function applyChrome() {
  document.documentElement.lang = state.lang === "en" ? "en" : "zh-Hant";
  document.title = t("title");
  document.querySelector("#brand-title").textContent = t("brand");
  document.querySelector("#toc").setAttribute("aria-label", t("toc"));
  const menu = document.querySelector("#menu-btn");
  menu.textContent = t("menu");
  menu.setAttribute("aria-label", t("menuLabel"));
  document.querySelector('.mode[data-mode="read"]').textContent = t("read");
  document.querySelector('.mode[data-mode="cards"]').textContent = t("cards");
  document.querySelector('.mode[data-mode="quiz"]').textContent = t("quiz");
  document.querySelector("#search-label").textContent = t("searchLabel");
  searchEl.placeholder = t("searchPlaceholder");
  document.querySelector("#skim-btn").textContent = t("skim");
  document.querySelector("#cards-title").textContent = t("cardsTitle");
  document.querySelector("#cards-lede").textContent = t("cardsLede");
  document.querySelector("#card-hint").textContent = t("cardHint");
  document.querySelector("#card-answer-label").textContent = t("answer");
  document.querySelector("#card-prev").textContent = t("prev");
  document.querySelector("#card-again").textContent = t("again");
  document.querySelector("#card-known").textContent = t("known");
  document.querySelector("#card-next").textContent = t("next");
  document.querySelector("#quiz-title").textContent = t("quizTitle");
  document.querySelector("#quiz-lede").textContent = t("quizLede");
  document.querySelector("#quiz-restart").textContent = t("quizRestart");
  document.querySelector("#quiz-wrong").textContent = t("quizWrongOnly");
  document.querySelector("#quiz-next").textContent = t("nextQ");
  document.querySelector("#quiz-review-wrong").textContent = t("reviewWrong");
  document.querySelector("#quiz-again").textContent = t("tryAgain");
  document.querySelector("#lang-label").textContent = state.lang === "en" ? "EN" : "中文";
  document.querySelectorAll("#lang-menu [data-lang]").forEach((button) => {
    button.setAttribute("aria-selected", String(button.dataset.lang === state.lang));
  });
}

function setLanguage(lang) {
  if (lang !== "en" && lang !== "zh") return;
  state.lang = lang;
  store.lang = lang;
  const scrollY = window.scrollY;
  saveStore();
  applyChrome();
  renderArticle();
  window.scrollTo(0, scrollY);
  renderToc();
  observeSections();
  applySearch();
  renderCardFilters();
  if (state.mode === "cards") renderCard();
  if (state.mode === "quiz") {
    const bank = Object.fromEntries(quizBank().map((item) => [item.id, item]));
    state.quiz = state.quiz.map((item) => bank[item.id]).filter(Boolean);
    state.quizPicked = null;
    if (!document.querySelector("#quiz-done").hidden) {
      document.querySelector("#quiz-score-detail").textContent = state.quizCorrect === state.quizAnswered
        ? t("perfect")
        : t("wrongDetail", state.quizWrongIds.length);
    } else if (state.quiz.length) {
      renderQuiz();
    }
  }
  document.querySelector("#lang-menu").hidden = true;
  document.querySelector("#lang-btn").setAttribute("aria-expanded", "false");
}

function scrollToHash() {
  const id = location.hash.replace("#", "");
  const target = id && document.getElementById(id);
  if (target) target.scrollIntoView();
}

document.querySelector("#lang-btn").addEventListener("click", () => {
  const menu = document.querySelector("#lang-menu");
  menu.hidden = !menu.hidden;
  document.querySelector("#lang-btn").setAttribute("aria-expanded", String(!menu.hidden));
});
document.querySelector("#lang-menu").addEventListener("click", (event) => {
  const button = event.target.closest("[data-lang]");
  if (!button) return;
  setLanguage(button.dataset.lang);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".lang")) {
    document.querySelector("#lang-menu").hidden = true;
    document.querySelector("#lang-btn").setAttribute("aria-expanded", "false");
  }
});

applyChrome();
renderArticle();
renderToc();
renderProgress();
renderCardFilters();
observeSections();
setMode("read");
scrollToHash();
window.addEventListener("hashchange", () => {
  setMode("read");
  scrollToHash();
});
