export default class Animation {
  static reveal(elements) {
    if (!('IntersectionObserver' in window)) { elements.forEach(element => element.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    elements.forEach(element => observer.observe(element));
  }
  static toast(message) {
    const toast = document.querySelector('#toast');
    toast.textContent = message; toast.classList.add('show');
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }
}
