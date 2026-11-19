if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const overlay = document.createElement("div");
  overlay.className = "gallery-confetti";
  overlay.setAttribute("aria-hidden", "true");
  document.body.append(overlay);

  const palette = [
    ["#a36412", "#fff0a7"],
    ["#cf851a", "#fff7ce"],
    ["#aa5439", "#ffd5ae"],
    ["#9f2874", "#ffb3dd"],
    ["#4133a1", "#cec5ff"],
    ["#006f61", "#a3ffe0"],
    ["#7882a4", "#fffaff"]
  ];
  const shapes = [
    { name: "foil", width: 10, height: 15 },
    { name: "foil", width: 10, height: 15 },
    { name: "streamer", width: 7, height: 42 },
    { name: "sparkle", width: 17, height: 17 }
  ];
  const { innerWidth, innerHeight } = window;
  const spread = Math.min(innerWidth, 1100);
  const rise = Math.min(innerHeight, 900);
  const animations = [];

  function launch(origin, direction, count) {
    const glow = document.createElement("span");
    glow.className = "pop-glow";
    glow.style.left = origin;
    glow.style.top = "77%";
    overlay.append(glow);
    animations.push(glow.animate([
      { opacity: 0, transform: "translate(-50%, -50%) scale(.3)" },
      { opacity: 0.9, transform: "translate(-50%, -50%) scale(1)", offset: 0.16 },
      { opacity: 0, transform: "translate(-50%, -50%) scale(2.2)" }
    ], { duration: 240, fill: "both" }).finished);

    for (let index = 0; index < count; index += 1) {
      const paper = document.createElement("span");
      const shape = shapes[index % shapes.length];
      const [shadow, shine] = palette[index % palette.length];
      const size = 0.55 + Math.random() * 0.65;
      const drift = direction * spread * (0.18 + Math.random() * 0.69);
      const lift = rise * (0.22 + Math.random() * 0.58);
      const spin = (90 + Math.random() * 240) * direction;
      const flip = 90 + Math.random() * 180;
      const duration = 2300 + Math.random() * 850;
      const peakOffset = 210 / duration;

      paper.className = shape.name;
      paper.style.left = origin;
      paper.style.top = "77%";
      paper.style.width = `${shape.width * size}px`;
      paper.style.height = `${shape.height * size}px`;
      paper.style.setProperty("--foil-shadow", shadow);
      paper.style.setProperty("--foil-shine", shine);
      overlay.append(paper);

      animations.push(paper.animate([
        { transform: "translate(0, 0) scale(.65)", opacity: 0, easing: "ease-out" },
        { transform: `translate(${drift * 0.52}px, ${-lift}px) rotate(${spin * 0.2}deg) rotateY(${flip * 0.2}deg)`, opacity: 1, offset: peakOffset },
        { opacity: 1, offset: 0.35 },
        { transform: `translate(${drift}px, ${innerHeight * 0.21}px) rotate(${spin}deg) rotateY(${flip}deg)`, opacity: 0 }
      ], {
        duration,
        fill: "both"
      }).finished);
    }
  }

  launch("10%", 1, 38);
  launch("90%", -1, 38);
  launch("21%", 1, 20);
  launch("79%", -1, 20);

  Promise.allSettled(animations).then(() => overlay.remove());
}
