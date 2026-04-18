// Tailles et positions aléatoires
document.querySelectorAll("li").forEach((li) => {
  const carousel = li.querySelector(".carousel");
  if (!carousel) return;
  const h = 35 + Math.floor(Math.random() * 30);
  const w = 20 + Math.floor(Math.random() * 25);
  const x = -10 + Math.floor(Math.random() * 10);
  const y = -20 + Math.floor(Math.random() * 20);
  carousel.style.height = `${h}vh`;
  carousel.style.width = `${w}vw`;
  li.style.transform = `translate(${x}vw, ${y}vh)`;
  li.style.zIndex = 1;
});

// Shuffle
const ul = document.querySelector("ul");
const lis = [...ul.querySelectorAll("li")];
lis.sort(() => Math.random() - 0.5);
lis.forEach((li) => ul.appendChild(li));

// Drag
let wasDragging = false;
let zCounter = 10;

document.querySelectorAll("li").forEach((li) => {
  let isDragging = false;
  let startX, startY, origX, origY;

  li.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = false;
    wasDragging = false;
    startX = e.clientX;
    startY = e.clientY;
    const transform = new DOMMatrix(getComputedStyle(li).transform);
    origX = transform.m41;
    origY = transform.m42;

    zCounter++;
    li.style.zIndex = zCounter;
    li.style.cursor = "grabbing";

    function onMove(e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        isDragging = true;
        wasDragging = true;
      }
      if (!isDragging) return;
      li.style.transform = `translate(${origX + dx}px, ${origY + dy}px)`;
    }

    function onUp() {
      li.style.cursor = "grab";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });

  li.addEventListener("click", (e) => {
    if (isDragging || wasDragging) {
      isDragging = false;
      e.stopPropagation();
    }
  });
});

// Carrousel
document.querySelectorAll(".carousel").forEach((carousel) => {
  carousel.addEventListener("click", (e) => {
    if (wasDragging) {
      wasDragging = false;
      return;
    }
    if (
      !e.target.classList.contains("carousel-img") &&
      !e.target.classList.contains("carousel-desc") &&
      !e.target.closest(".carousel-desc")
    )
      return;

    zCounter++;
    carousel.closest("li").style.zIndex = zCounter;
    carouselNav(carousel);
  });
});

function carouselNav(carousel) {
  const imgs = carousel.querySelectorAll(".carousel-img");
  const desc = carousel.querySelector(".carousel-desc");
  let index = parseInt(carousel.dataset.index);

  if (index === imgs.length - 1) {
    imgs[index].classList.remove("active");
    if (desc) desc.classList.add("active");
    carousel.dataset.index = -1;
    return;
  }

  if (index === -1) {
    if (desc) desc.classList.remove("active");
    imgs[0].classList.add("active");
    carousel.dataset.index = 0;
    const counter = carousel.querySelector(".carousel-current");
    if (counter) counter.textContent = 1;
    return;
  }

  imgs[index].classList.remove("active");
  index = index + 1;
  imgs[index].classList.add("active");
  carousel.dataset.index = index;

  const counter = carousel.querySelector(".carousel-current");
  if (counter) counter.textContent = index + 1;
}

// Filtres — définis avant d'être appelés
function updateAvailableFilters() {
  const activeType = document.querySelector(
    'input[name="fav_language"]:checked',
  )?.value;
  const activeYear = document.querySelector(
    'input[name="year"]:checked',
  )?.value;
  const activeLieu = document.querySelector(
    'input[name="lieu"]:checked',
  )?.value;
  const allLis = [...document.querySelectorAll("li")];

  // Type
  document.querySelectorAll('input[name="fav_language"]').forEach((radio) => {
    const label = document.querySelector(`label[for="${radio.value}"]`);
    if (!label) return;
    if (activeType) {
      // Un type est sélectionné → griser tous les autres
      label.style.opacity = radio.value === activeType ? "1" : "0.3";
    } else {
      // Aucun type sélectionné → griser ceux sans résultats
      const hasMatch = allLis.some((li) => {
        const liTypes = li.dataset.type
          ? li.dataset.type
              .replace(/"/g, "")
              .split(",")
              .map((t) => t.trim())
          : [];
        return (
          liTypes.includes(radio.value) &&
          (!activeYear || li.dataset.year.replace(/"/g, "") === activeYear) &&
          (!activeLieu || li.dataset.lieu.replace(/"/g, "") === activeLieu)
        );
      });
      label.style.opacity = hasMatch ? "1" : "0.3";
    }
  });

  // Année
  document.querySelectorAll('input[name="year"]').forEach((radio) => {
    const label = document.querySelector(`label[for="${radio.value}"]`);
    if (!label) return;
    if (activeYear) {
      label.style.opacity = radio.value === activeYear ? "1" : "0.3";
    } else {
      const hasMatch = allLis.some((li) => {
        const liTypes = li.dataset.type
          ? li.dataset.type
              .replace(/"/g, "")
              .split(",")
              .map((t) => t.trim())
          : [];
        return (
          li.dataset.year.replace(/"/g, "") === radio.value &&
          (!activeType || liTypes.includes(activeType)) &&
          (!activeLieu || li.dataset.lieu.replace(/"/g, "") === activeLieu)
        );
      });
      label.style.opacity = hasMatch ? "1" : "0.3";
    }
  });

  // Lieu
  document.querySelectorAll('input[name="lieu"]').forEach((radio) => {
    const label = document.querySelector(`label[for="${radio.value}"]`);
    if (!label) return;
    if (activeLieu) {
      label.style.opacity = radio.value === activeLieu ? "1" : "0.3";
    } else {
      const hasMatch = allLis.some((li) => {
        const liTypes = li.dataset.type
          ? li.dataset.type
              .replace(/"/g, "")
              .split(",")
              .map((t) => t.trim())
          : [];
        return (
          li.dataset.lieu.replace(/"/g, "") === radio.value &&
          (!activeType || liTypes.includes(activeType)) &&
          (!activeYear || li.dataset.year.replace(/"/g, "") === activeYear)
        );
      });
      label.style.opacity = hasMatch ? "1" : "0.3";
    }
  });
}

function applyFilters() {
  const activeType = document.querySelector(
    'input[name="fav_language"]:checked',
  )?.value;
  const activeYear = document.querySelector(
    'input[name="year"]:checked',
  )?.value;
  const activeLieu = document.querySelector(
    'input[name="lieu"]:checked',
  )?.value;

  document.querySelectorAll("li").forEach((li) => {
    const types = li.dataset.type ? li.dataset.type.split(",") : [];
    const matchType = !activeType || types.includes(activeType);
    const matchYear =
      !activeYear || li.dataset.year.replace(/"/g, "") === activeYear;
    const matchLieu =
      !activeLieu || li.dataset.lieu.replace(/"/g, "") === activeLieu;
    li.style.display = matchType && matchYear && matchLieu ? "flex" : "none";
  });

  // Labels actifs en gris
  document.querySelectorAll("label").forEach((label) => {
    label.style.backgroundColor = "white";
  });
  if (activeType)
    document
      .querySelector(`label[for="${activeType}"]`)
      ?.style.setProperty("background-color", "grey");
  if (activeYear)
    document
      .querySelector(`label[for="${activeYear}"]`)
      ?.style.setProperty("background-color", "grey");
  if (activeLieu)
    document
      .querySelector(`label[for="${activeLieu}"]`)
      ?.style.setProperty("background-color", "grey");

  updateAvailableFilters();
}

// Listeners filtres
document
  .querySelectorAll(
    'input[name="fav_language"], input[name="year"], input[name="lieu"]',
  )
  .forEach((radio) => {
    radio.addEventListener("change", applyFilters);
    radio.addEventListener("click", function () {
      if (this.dataset.checked === "true") {
        this.checked = false;
        this.dataset.checked = "false";
        applyFilters();
      } else {
        document
          .querySelectorAll(`input[name="${this.name}"]`)
          .forEach((r) => (r.dataset.checked = "false"));
        this.dataset.checked = "true";
      }
    });
  });

// Init au chargement
updateAvailableFilters();
