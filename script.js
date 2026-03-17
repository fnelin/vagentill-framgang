const input = document.getElementById("searchInput");
const cardsContainer = document.getElementById("cardsContainer");
let cards = Array.from(document.querySelectorAll(".card"));
let currentFilter = "all";

// ---------------- FILTER BUTTONS ----------------
document.querySelectorAll(".filters button").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterCards();
  });
});

// ---------------- SEARCH ----------------
input.addEventListener("input", filterCards);

// ---------------- SORT ----------------
document.getElementById("sortAZ").addEventListener("click", () => {
  cards.sort((a, b) =>
    a.dataset.user.localeCompare(b.dataset.user)
  );
  cards.forEach(card => cardsContainer.appendChild(card));
});

// ---------------- DROPDOWN ----------------
const dropdown = document.querySelector(".dropdown");
const btn = document.getElementById("dropdownBtn");

btn.addEventListener("click", () => {
  dropdown.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});

// ---------------- RADIO BUTTONS ----------------
const strengthRadios = document.querySelectorAll('input[name="strength"]');

strengthRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    btn.innerText = radio.value || "Alla";
    filterCards();
    dropdown.classList.remove("show");
  });
});

// ---------------- FILTER FUNCTION ----------------
function filterCards() {
  const value = input.value.toLowerCase();

  const selectedRadio = document.querySelector('input[name="strength"]:checked');
  const selectedStrength = selectedRadio
    ? selectedRadio.value.toLowerCase().trim()
    : "";

  cards.forEach(card => {
    const user = card.dataset.user.toLowerCase();
    const text = card.innerText.toLowerCase();
    const category = card.dataset.category;

    // support BOTH ul and ol
    const items = card.querySelectorAll("li");
    const strengths = Array.from(items).map(li =>
      li.innerText.toLowerCase().trim()
    );

    const matchSearch =
      user.includes(value) ||
      text.includes(value) ||
      strengths.some(s => s.includes(value));

    const matchStrength =
      selectedStrength === "" ||
      strengths.some(s => s.includes(selectedStrength));

    const matchFilter =
      currentFilter === "all" || category === currentFilter;

    if (matchSearch && matchFilter && matchStrength) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  });
}
