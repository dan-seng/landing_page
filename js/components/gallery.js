export class GalleryComponent {
  constructor(scrollAnimationManager) {
    this.scrollAnimationManager = scrollAnimationManager;
    this.imageTargets = document.querySelectorAll(
      '.room-card img, .amenity-photo img, .experience-card img, .gallery-grid img',
    );
    this.imageVariants = [
      'anim-rise-left',
      'anim-rise-right',
      'anim-zoom-in',
      'anim-tilt-up',
      'anim-curtain',
    ];
    this.colorPalette = ['#0f636b', '#b89056', '#ef7f55', '#3b7dd8', '#8f5bd0'];
  }

  init() {
    this.imageTargets.forEach((img, index) => {
      img.classList.add('scroll-image');

      let variant = this.imageVariants[index % this.imageVariants.length];
      if (img.closest('.gallery-grid') && variant === 'anim-curtain') {
        variant = 'anim-zoom-in';
      }

      img.classList.add(variant);
      img.style.setProperty('--hover-tilt', `${index % 2 === 0 ? -1.8 : 1.8}deg`);
      img.style.setProperty(
        '--glow-color',
        this.colorPalette[index % this.colorPalette.length],
      );

      this.scrollAnimationManager.registerAnimationTarget(img, {
        animationClass: null,
        delay: (index % 4) * 90,
      });

      img.addEventListener('mouseenter', () => {
        img.classList.add('is-hovered');
      });

      img.addEventListener('mouseleave', () => {
        img.classList.remove('is-hovered');
      });
    });
  }
}
