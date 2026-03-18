// ---------------- ELEMENTS ----------------
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
if (input) {
  input.addEventListener("input", filterCards);
}

// ---------------- SORT ----------------
const sortBtn = document.getElementById("sortAZ");
if (sortBtn) {
  sortBtn.addEventListener("click", () => {
    cards.sort((a, b) =>
      a.dataset.user.localeCompare(b.dataset.user)
    );
    cards.forEach(card => cardsContainer.appendChild(card));
  });
}

// ---------------- DROPDOWN ----------------
const dropdown = document.querySelector(".dropdown");
const dropdownBtn = document.getElementById("dropdownBtn");

if (dropdown && dropdownBtn) {
  dropdownBtn.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });
}

const strengthCheckboxes = document.querySelectorAll('input[name="strength"]');
const errorMsg = document.getElementById("strengthError");

strengthCheckboxes.forEach(box => { box.addEventListener("change", () => {
    const checked = document.querySelectorAll('input[name="strength1"]:checked');

      if (checked.length > 4) { box.checked = false;
      errorMsg.style.display = "block";
    } else {
      errorMsg.style.display = "none";
    }
  });
});

// ---------------- RADIO BUTTONS ----------------
const strengthRadios = document.querySelectorAll('input[name="strength2"]');

strengthRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    if (dropdownBtn) {
      dropdownBtn.innerText = radio.value || "Alla";
    }
    filterCards();
    if (dropdown) dropdown.classList.remove("show");
  });
});

// ---------------- FILTER FUNCTION ----------------
function filterCards() {
  const value = input ? input.value.toLowerCase() : "";

  const selectedRadio = document.querySelector('input[name="strength2"]:checked');
  const selectedStrength = selectedRadio ? selectedRadio.value.toLowerCase().trim() : "";

  cards.forEach(card => {
    const user = card.dataset.user.toLowerCase();
    const text = card.innerText.toLowerCase();
    const category = card.dataset.category;

    const items = card.querySelectorAll("li");
    const strengths = Array.from(items).map(li => li.innerText.toLowerCase().trim());

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

// ---------------- FORM ----------------
const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");

let imageData = "";

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    imageData = e.target.result; // base64 image
    preview.src = imageData;
    preview.style.display = "block";
  };

  reader.readAsDataURL(file);
});

const link = document.getElementById("link").value;


const toggleBtn = document.getElementById("toggleForm");
const form = document.getElementById("storyForm");

// SHOW / HIDE FORM
if (toggleBtn && form) {
  toggleBtn.addEventListener("click", () => {
    form.classList.toggle("hidden");
  });
}

// SUBMIT FORM
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const rubrik = document.getElementById("rubrik").value;
    const story = document.getElementById("story").value;

    const selectedBoxes = document.querySelectorAll('input[name="strength1"]:checked');
    const strengths1 = Array.from(selectedBoxes).map(cb => cb.value);

//    const selectedRadio = document.querySelector('input[name="strength"]:checked');
//    const strength = selectedRadio ? selectedRadio.value : "";

    // CREATE NEW CARD
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.user = fname;
    card.dataset.category = "user";


let link = document.getElementById("link").value.trim();

if (link && !link.startsWith("http")) {
  link = "https://" + link;
}

card.innerHTML = `
  <h3>${rubrik}</h3>

  ${imageData ? `<img src="${imageData}" style="width:100%; border-radius:8px;" />` : ""}

  <p>${story}</p>
  <small>${fname} ${lname}</small>

  ${link ? `<a href="${link}" target="_blank" class="card-link">Besök profil</a>` : ""}

  <ul>
    ${strengths1.map(s => `<li>${s}</li>`).join("")}
  </ul>
`;
    cardsContainer.appendChild(card);

    cards.push(card);

    // reset form
    form.reset();
    form.classList.add("hidden");

    // re-run filter so it appears correctly
    filterCards();
  });
}
