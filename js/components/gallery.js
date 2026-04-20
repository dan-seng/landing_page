export class GalleryComponent {
  constructor(scrollAnimationManager) {
    this.scrollAnimationManager = scrollAnimationManager;
    this.imageTargets = Array.from(document.querySelectorAll(
      '.room-card img, .amenity-photo img, .experience-card img, .gallery-grid img',
    ));
    this.galleryImages = Array.from(document.querySelectorAll('.gallery-grid img'));
    this.imageVariants = [
      'anim-rise-left',
      'anim-rise-right',
      'anim-zoom-in',
      'anim-tilt-up',
      'anim-curtain',
    ];
    this.colorPalette = ['#0f636b', '#b89056', '#ef7f55', '#3b7dd8', '#8f5bd0'];
    this.lightbox = document.getElementById('galleryLightbox');
    this.lightboxImage = document.getElementById('lightboxImage');
    this.lightboxCaption = document.getElementById('lightboxCaption');
    this.lightboxCloseControls = document.querySelectorAll('[data-lightbox-close]');
    this.lightboxPrevButton = document.querySelector('[data-lightbox-prev]');
    this.lightboxNextButton = document.querySelector('[data-lightbox-next]');
    this.currentIndex = 0;
    this.lastFocusedImage = null;
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

    this.setupLightbox();
  }

  setupLightbox() {
    if (!this.lightbox || !this.galleryImages.length) {
      return;
    }

    this.galleryImages.forEach((image, index) => {
      image.setAttribute('tabindex', '0');
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', `Open gallery image ${index + 1}`);

      image.addEventListener('click', () => {
        this.openLightbox(index, image);
      });

      image.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.openLightbox(index, image);
        }
      });
    });

    this.lightboxCloseControls.forEach((control) => {
      control.addEventListener('click', () => this.closeLightbox());
    });

    this.lightboxPrevButton?.addEventListener('click', () => this.showPreviousImage());
    this.lightboxNextButton?.addEventListener('click', () => this.showNextImage());

    document.addEventListener('keydown', (event) => {
      if (!this.lightbox.classList.contains('open')) {
        return;
      }

      if (event.key === 'Escape') {
        this.closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        this.showPreviousImage();
      } else if (event.key === 'ArrowRight') {
        this.showNextImage();
      }
    });
  }

  openLightbox(index, triggerImage) {
    this.lastFocusedImage = triggerImage || null;
    this.lightbox.classList.add('open');
    this.lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    this.showImageAt(index);
    this.lightboxNextButton?.focus();
  }

  closeLightbox() {
    this.lightbox.classList.remove('open');
    this.lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (this.lastFocusedImage) {
      this.lastFocusedImage.focus();
    }
  }

  showImageAt(index) {
    const total = this.galleryImages.length;
    this.currentIndex = (index + total) % total;
    const source = this.galleryImages[this.currentIndex];
    if (!source || !this.lightboxImage || !this.lightboxCaption) {
      return;
    }

    this.lightboxImage.src = source.currentSrc || source.src;
    this.lightboxImage.alt = source.alt || 'Gallery image';
    this.lightboxCaption.textContent = source.alt || `Image ${this.currentIndex + 1}`;
  }

  showNextImage() {
    this.showImageAt(this.currentIndex + 1);
  }

  showPreviousImage() {
    this.showImageAt(this.currentIndex - 1);
  }
}
