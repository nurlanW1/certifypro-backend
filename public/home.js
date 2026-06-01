(() => {
  const counter = document.getElementById("bulk-count");
  if (!counter) return;

  const targets = [120, 350, 780, 1024];
  let index = 0;

  const animate = () => {
    if (index >= targets.length) return;
    counter.textContent = `${targets[index]} loaded`;
    index += 1;
    setTimeout(animate, 900);
  };

  setTimeout(animate, 500);
})();

