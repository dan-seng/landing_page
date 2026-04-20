export class RoomsRenderer {
  constructor(containerSelector, rooms) {
    this.container = document.querySelector(containerSelector);
    this.rooms = rooms;
  }

  render() {
    if (!this.container || !Array.isArray(this.rooms)) {
      return;
    }

    this.container.innerHTML = this.rooms
      .map(
        (room) => `
          <article class="room-card">
            <img src="${room.image}" alt="${room.alt}" />
            <div class="body">
              <h3>${room.title}</h3>
              <p>${room.description}</p>
              <div class="room-meta">
                <span>${room.guests}</span>
                <span>${room.price}</span>
              </div>
            </div>
          </article>
        `,
      )
      .join('');
  }
}
