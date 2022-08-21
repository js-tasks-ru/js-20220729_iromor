import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {

  chartHeight = 50;

  constructor({
    url = '',
    range: {
      from,
      to
    },
    label = '',
    link = '',
    formatHeading = data => data
  } = {}) {

    this.data = [];
    this.label = label;
    this.link = link;
    this.url = url;
    this.from = from;
    this.to = to;
    this.status = false;
    // this.value = formatHeading(value);

    this.render();
  }

  template() {
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

  async fetchData() {
    const from = this.from.toISOString().split('T')[0];
    const to = this.to.toISOString().split('T')[0];
    const _from = '2022-05-20';
    const _to = '2022-07-07';


    try {
      const response = await fetchJson(`${BACKEND_URL}/${this.url}`);
      const arr = Object.entries(response);
      let count = 0;
      const result = [];
      arr.forEach(([key, value], i) => {
        if (key === _from) {
          count = i;
        }
        if (key === _to) {
          count = 0;
        }
        if (count < arr.length && count) {
          result.push(value);
        }
      });
      this.data = result;
    } catch (err) {
      console.log(err);
    }

  }

  dataValue() {

    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    // this.element.classList.remove('column-chart_loading');
    if (this.data.length) {
      console.log(1);
      return this.data.map(el => {
        const value = String(Math.floor(el * scale));
        const dataMath = Math.round(el * 100 / maxValue) + '%';

        return `
            <div style="--value: ${value}" data-tooltip="${dataMath}"></div>
          `;
      }).join('');
    }

  }

  showLink() {
    return this.link ? `
    <a href="${this.link}" class="column-chart__link">View all</a>
    ` : '';
  }



  async render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template();

    this.element = wrapper.firstElementChild;

    if (!this.data.length) {
      this.element.classList.add('column-chart_loading');
    }
    await this.fetchData();

    this.subElements = this.getSubElemnts();
  }

  getSubElemnts() {

    const result = {};

    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    return result;
  }


  async update(from, to) {

    const startInput = from.toISOString();
    const endInput = to.toISOString();
    console.log(startInput, endInput);

    try {
      const response = await fetchJson(`${BACKEND_URL}/${this.url}?from=${startInput}&to=${endInput}`);
      this.data = await response.json();
      console.log(data);
    } catch (err) {
      alert('err');
    }

    this.subElements.body.innerHTML = this.dataValue();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

