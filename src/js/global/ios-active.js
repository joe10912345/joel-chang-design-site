  // iOS Safari only applies :active (pressed states) when a touchstart listener exists.
  document.addEventListener('touchstart', function () {}, { passive: true });
