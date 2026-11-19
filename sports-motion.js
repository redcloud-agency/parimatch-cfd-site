const sportsStages = document.querySelectorAll(".sport-stage[data-motion]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const { intersectionRatio, target } of entries) {
      if (intersectionRatio < 0.45) continue;

      observer.unobserve(target);
      const images = [...target.querySelectorAll("img")];
      Promise.all(images.map(image => image.decode()))
        .then(() => target.classList.add("is-playing"))
        .catch(() => {});
    }
  }, { threshold: 0.45 });

  for (const stage of sportsStages) observer.observe(stage);
}
