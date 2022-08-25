export default class DoubleSlider {

  element;

  constructor({
    min = 0,
    max = 0,
    formatValue = value => value,
    selected: {
      from = 0,
      to = 0,
    }
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue(value);
    this.from = from;
    this.to = to;
  }

  initialize() {

    document.addEventListener('pointerover', (event) => {

      if (event.target.dataset.to) {

        this.render();
      }
    });

  }

  get getTemplate() {
    return `
    <div class="range-slider">
      <span>${this.min}</span>
      <div class="range-slider__inner">
        <span class="range-slider__progress"></span>
        <span class="range-slider__thumb-left" data-element="from"></span>
        <span class="range-slider__thumb-right" data-element="to"></span>
      </div>
      <span>${this.max}</span>
    </div>
    `;
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.getTemplate;

    this.element = element.firstElementChild;
  }


  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    Tooltip.activeNotification = null;
  }

}
