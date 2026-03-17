const input = document.getElementById("searchInput");
const cardsContainer = document.getElementById("cardsContainer");
let cards = Array.from(document.querySelectorAll(".card"));
let currentFilter = "all";

// SEARCH
input.addEventListener("input", filterCards);

// FILTER BUTTONS
document.querySelectorAll(".filters button").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterCards();
  });
});

// SORT
document.getElementById("sortAZ").addEventListener("click", () => {
  cards.sort((a, b) => {
    return a.dataset.user.localeCompare(b.dataset.user);
  });

  cards.forEach(card => cardsContainer.appendChild(card));
});

// FILTER FUNCTION
function filterCards() {
  const value = input.value.toLowerCase();

  cards.forEach(card => {
    const user = card.dataset.user.toLowerCase();
    const text = card.innerText.toLowerCase();
    const category = card.dataset.category;

    const matchSearch = user.includes(value) || text.includes(value);
    const matchFilter = currentFilter === "all" || category === currentFilter;

    if (matchSearch && matchFilter) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  });
}
