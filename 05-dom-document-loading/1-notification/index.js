export default class NotificationMessage {

  constructor(message = 'Hello World', { duration = 1000, type = 'success' } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    // this.notifications = [];

  }

  get getTemplate() {
    return `
    <div class="notification ${this.type}" style="--value:20s">
      <div class="timer"></div>
      <div class="inner-wrapper">
       <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>
    </div>
      `;
  }

  render(html) {
    const element = document.createElement("div"); // (*)

    element.innerHTML = this.getTemplate;

    this.element = element.firstElementChild;
    html.append(this.element);

  }

  show(html = document.body) {

    const notification = document.querySelectorAll('.notification');

    if (notification.length) {
      for (const not of notification) {
        not.remove();
      }
    }
    this.render(html);
    setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  initEventListeners() {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
    // NOTE: удаляем обработчики событий, если они есть
  }
}
