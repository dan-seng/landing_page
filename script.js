import { BookingComponent } from './js/components/booking.js';
import { FAQComponent } from './js/components/faq.js';
import { GalleryComponent } from './js/components/gallery.js';
import { NavbarComponent } from './js/components/navbar.js';
import { RoomsRenderer } from './js/components/rooms.js';
import { ScrollAnimationManager } from './js/components/scroll-animations.js';
import { ROOM_DATA } from './js/data/rooms.js';

const bootstrap = () => {
  const roomsRenderer = new RoomsRenderer('#roomsGrid', ROOM_DATA);
  roomsRenderer.render();

  const scrollAnimationManager = new ScrollAnimationManager();
  scrollAnimationManager.registerSections('.fade-section');
  scrollAnimationManager.setupStaggeredSections('[data-stagger]');

  const galleryComponent = new GalleryComponent(scrollAnimationManager);
  galleryComponent.init();

  scrollAnimationManager.observe();

  const faqComponent = new FAQComponent('.faq-question');
  faqComponent.init();

  const bookingComponent = new BookingComponent();
  bookingComponent.init();

  const navbarComponent = new NavbarComponent({
    navSelector: '[data-navbar]',
    linkSelector: '[data-nav-links] a',
    menuButtonSelector: '[data-nav-toggle]',
    menuPanelSelector: '[data-nav-panel]',
  });
  navbarComponent.init();
};

bootstrap();
