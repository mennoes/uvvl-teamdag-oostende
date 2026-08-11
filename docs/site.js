const slides = [...document.querySelectorAll('.slide')];
const dots = document.querySelector('.dots');
const counter = document.querySelector('.counter');
const progress = document.querySelector('.progress span');
const previous = document.querySelector('.previous');
const next = document.querySelector('.next');
let active = 0;

const goTo = (index) => {
  const target = Math.max(0, Math.min(slides.length - 1, index));
  slides[target].scrollIntoView({ behavior: 'smooth' });
};

const setActive = (index) => {
  active = index;
  [...dots.children].forEach((dot, i) => dot.classList.toggle('active', i === active));
  counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  progress.style.width = `${((active + 1) / slides.length) * 100}%`;
  previous.disabled = active === 0;
  next.disabled = active === slides.length - 1;
};

slides.forEach((slide, index) => {
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', slide.dataset.label);
  dot.addEventListener('click', () => goTo(index));
  dots.append(dot);
});

const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setActive(slides.indexOf(visible.target));
}, { threshold: [0.45, 0.7] });
slides.forEach((slide) => observer.observe(slide));

previous.addEventListener('click', () => goTo(active - 1));
next.addEventListener('click', () => goTo(active + 1));
document.querySelector('.restart')?.addEventListener('click', () => goTo(0));
window.addEventListener('keydown', (event) => {
  if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); goTo(active + 1); }
  if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); goTo(active - 1); }
  if (event.key === 'Home') goTo(0);
  if (event.key === 'End') goTo(slides.length - 1);
});
setActive(0);
