function observeSportsMotion() {
  const readyThreshold = 0.48;
  const visibleStages = new WeakSet();
  const observer = new IntersectionObserver((entries) => {
    for (const { intersectionRatio, isIntersecting, target } of entries) {
      const replay = target.classList.contains("football");
      if (intersectionRatio < readyThreshold) {
        visibleStages.delete(target);
        if (!isIntersecting && replay) target.classList.remove("is-playing");
        continue;
      }
      if (target.classList.contains("is-playing")) continue;

      visibleStages.add(target);
      const images = [...target.querySelectorAll("img")];
      Promise.all(images.map(image => image.decode()))
        .then(() => {
          if (!visibleStages.has(target)) return;
          target.classList.add("is-playing");
          if (!replay) observer.unobserve(target);
        })
        .catch(() => {});
    }
  }, { threshold: [0, readyThreshold] });

  for (const stage of document.querySelectorAll(".sport-stage[data-motion]")) observer.observe(stage);
}

if ("IntersectionObserver" in window) {
  const ageGate = document.getElementById("age");
  if (!ageGate || ageGate.classList.contains("hidden")) {
    observeSportsMotion();
  } else {
    const gateObserver = new MutationObserver(() => {
      if (!ageGate.classList.contains("hidden")) return;
      gateObserver.disconnect();
      observeSportsMotion();
    });
    gateObserver.observe(ageGate, { attributes: true, attributeFilter: ["class"] });
  }
}
