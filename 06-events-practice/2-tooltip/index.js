class Tooltip {
  element;
  tooltip;

  static activeNotification = null;
  constructor() {

    if (!Tooltip.activeNotification) {
      Tooltip.activeNotification = this;
    } else {
      return Tooltip.activeNotification;
    }
  }

  initialize() {

    const handler = (event) => {

      if (event.target.dataset.tooltip) {
        this.tooltip = event.target.dataset.tooltip;

        if (Tooltip.activeNotification) {
          Tooltip.activeNotification.remove();
        }
        this.render(event);
      }
    };

    document.addEventListener('pointerover', handler);

    document.addEventListener('pointermove', handler);

    document.addEventListener('pointerout', (event) => {
      if (event.target.dataset.tooltip) {
        this.tooltip = null;

        document.removeEventListener('pointerover', handler);
        document.removeEventListener('pointermove', handler);

        if (this.element) {
          this.element.remove();
        }
      }
    });
  }

  setPosition(pageX, pageY, element) {
    element.style.position = 'absoulte';
    element.style.left = pageX + element.offsetWidth / 2 + `px`;
    element.style.top = pageY + element.offsetHeight / 2 + `px`;

  }

  render(event) {
    const element = document.createElement("div");
    element.className = 'tooltip';
    element.innerHTML = this.tooltip;

    this.setPosition(event.pageX, event.pageY, element);

    this.element = element;
    document.body.append(this.element);

  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    document.removeEventListener('pointerover', handler);
    document.removeEventListener('pointermove', handler);
    // pointerout
    this.remove();
    this.element = null;
    Tooltip.activeNotification = null;
  }
}

export default Tooltip;
