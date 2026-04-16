function carouselNav(carousel) {
  const imgs = carousel.querySelectorAll(".carousel-img");
  const desc = carousel.querySelector(".carousel-desc");
  let index = parseInt(carousel.dataset.index);

  // Si on est à la dernière image → montrer la description
  if (index === imgs.length - 1) {
    imgs[index].classList.remove("active");
    desc.classList.add("active");
    carousel.dataset.index = -1;
    return;
  }

  // Si la description est visible → revenir à la première image
  if (index === -1) {
    desc.classList.remove("active");
    imgs[0].classList.add("active");
    carousel.dataset.index = 0;
    const counter = carousel.querySelector(".carousel-current");
    if (counter) counter.textContent = 1;
    return;
  }

  // Sinon → image suivante
  imgs[index].classList.remove("active");
  index = index + 1;
  imgs[index].classList.add("active");
  carousel.dataset.index = index;

  const counter = carousel.querySelector(".carousel-current");
  if (counter) counter.textContent = index + 1;
}

document.querySelectorAll(".carousel").forEach((carousel) => {
  carousel.addEventListener("click", () => carouselNav(carousel));
});

document.querySelectorAll(".carousel").forEach((carousel) => {
  const h = 35 + Math.floor(Math.random() * 30);
  const w = 25 + Math.floor(Math.random() * 20);
  carousel.style.height = `${h}vh`;
  carousel.style.width = `${w}vw`;
});
document.querySelectorAll("li").forEach((li) => {
  const x = Math.floor(Math.random() * 10);
  const y = -5 + Math.floor(Math.random() * 30); // 0vh à 60vh
  li.style.transform = `translateX(-${x}vw)`;
  li.style.marginTop = `${y}vh`;
});
