document.querySelectorAll("li").forEach((li) => {
  const carousel = li.querySelector(".carousel");
  const h = 35 + Math.floor(Math.random() * 30);
  const w = 20 + Math.floor(Math.random() * 25);
  const x = -10 + Math.floor(Math.random() * 10); // -10vw à +10vw
  const y = -5 + Math.floor(Math.random() * 20); // 0vh à 30vh

  carousel.style.height = `${h}vh`;
  carousel.style.width = `${w}vw`;
  li.style.transform = `translate(${x}vw, ${y}vh)`;
  li.style.zIndex = 1;
});

let wasDragging = false;

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

    document.querySelectorAll("li").forEach((l) => (l.style.zIndex = 1));
    li.style.zIndex = 10;
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

document.querySelectorAll(".carousel").forEach((carousel) => {
  carousel.addEventListener("click", (e) => {
    if (wasDragging) {
      wasDragging = false;
      return;
    }
    // Seulement si on clique sur l'image ou la description
    if (
      !e.target.classList.contains("carousel-img") &&
      !e.target.classList.contains("carousel-desc") &&
      !e.target.closest(".carousel-desc")
    )
      return;

    document.querySelectorAll("li").forEach((l) => (l.style.zIndex = 1));
    carousel.closest("li").style.zIndex = 10;
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
