let currentAuthor = null;

const authorAPI = {
  statham: "Jason Statham",
  ronaldo: "Cristiano Ronaldo",
  David: "David Goggins",
  Jack: "Jack Ma"
};

const backgrounds = {
  statham: "url('images/statham.jpg')",
  ronaldo: "url('images/ronaldo.jpg')",
  David: "url('images/David.jpg')",
  Jack: "url('images/jack.jpg')"
};

const quoteText = document.getElementById("quoteText");
const historyList = document.getElementById("historyList");
const menuBtn = document.getElementById("menuBtn");
const menuList = document.getElementById("menuList");

menuBtn.addEventListener("click", () => {
  menuList.style.display = menuList.style.display === "flex" ? "none" : "flex";
});

function selectAuthor(author) {
  currentAuthor = author;
  document.body.style.backgroundImage = backgrounds[author];
  nextQuote();
  menuList.style.display = "none";
}

async function fetchFromQuotable(authorName) {
  const res = await fetch(`https://api.quotable.io/random?author=${authorName}`);
  const data = await res.json();
  return data.content || null;
}

async function fetchFromZen() {
  const res = await fetch("https://zenquotes.io/api/random");
  const data = await res.json();
  return data[0].q;
}

async function nextQuote() {
  if (!currentAuthor) {
    quoteText.textContent = "Сначала выберите автора 🙂";
    return;
  }

  quoteText.classList.remove("show");

  let quote = null;

  try {
    // 70% шанс — авторская цитата через Quotable
    if (Math.random() < 0.7) {
      quote = await fetchFromQuotable(authorAPI[currentAuthor]);
    }

    // если API автора не дал цитату → взять ZenQuotes
    if (!quote) quote = await fetchFromZen();
  } catch {
    quote = "Ошибка получения цитаты 😢";
  }

  quoteText.textContent = quote;
  setTimeout(() => quoteText.classList.add("show"), 50);

  addToHistory(quote);
}

function addToHistory(quote) {
  const li = document.createElement("li");
  li.textContent = quote;
  historyList.prepend(li);
}

function saveAsImage() {
  html2canvas(document.querySelector(".quote-box")).then(canvas => {
    const link = document.createElement("a");
    link.download = "quote.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
