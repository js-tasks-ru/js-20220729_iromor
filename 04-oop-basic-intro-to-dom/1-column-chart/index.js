export default class ColumnChart {

  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
    formatHeading = data => data
  } = {}) {

    this.data = data;
    this.label = label;
    this.link = link;
    this.value = formatHeading(value);

    this.render();
  }

  get template() {
    return `
    <div class="dashboard__chart_orders">
    <div class="column-chart" style="--chart-height: ${this.chartHeight}}">
      <div class="column-chart__title">
        Total ${this.label}
        ${this.showLink()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.value}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.dataValue()}
        </div>
      </div>
    </div>
  </div>
    `;
  }

  dataValue() {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return this.data.map(el => {

      const value = String(Math.floor(el * scale));
      const dataMath = Math.round(el * 100 / maxValue) + '%';

      return `
        <div style="--value: ${value}" data-tooltip="${dataMath}"></div>
      `;
    }).join('');

  }

  showLink() {
    return this.link ? `
    <a href="${this.link}" class="column-chart__link">View all</a>
    ` : '';
  }



  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;

    if (!this.data.length) {
      this.element.classList.add('column-chart_loading');
    }

    this.subElements = this.getSubElemnts();
  }

  getSubElemnts() {

    const result = {};
    
    const elements = this.element.querySelectorAll('[data-element]');
    console.log(elements);

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    // console.log(result.body.innerHTML);
    return result;
  }


  update(data) {
    this.data = data;

    this.subElements.body.innerHTML = this.dataValue();

  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
