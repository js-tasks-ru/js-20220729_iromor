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
    value = 0,
    formatHeading = data => data
  } = {}) {

    this.data = [];
    this.label = label;
    this.link = link;
    this.url = url;
    this.from = from;
    this.to = to;
    this.status = false;
    this.value = formatHeading(value);


    this.render();
    this.fetchData();
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
          ${this.getHeader()}
        <div data-element="body" class="column-chart__chart">
          ${this.dataValue()}
        </div>
      </div>
    </div>
  </div>
    `;
  }

  fetchData() {
    const from = this.from.toISOString().split('T')[0];
    const to = this.to.toISOString().split('T')[0];
    const _from = '2022-05-20';
    const _to = '2022-07-07';
    const _fromMs = Number(new Date(_from))
    const _toMs = Number(new Date(_to))

    try {
      fetchJson(`${BACKEND_URL}/${this.url}`)
        .then(data => Object.entries(data))
        .then(arr => arr.filter(([key]) => Number(new Date(key)) >= _fromMs && Number(new Date(key)) <= _toMs))
        .then(filteredArr => this.update(filteredArr));
    } catch (err) {
      console.log(err);
    }
  }

  dataValue() {

    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    // this.element.classList.remove('column-chart_loading');
    if (this.data.length) {
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

  getHeader() {
    return `
      <div data-element="header" class="column-chart__header">${this.value}</div>
    `;
  }



  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template();

    this.element = wrapper.firstElementChild;

    if (!this.data.length) {
      this.element.classList.add('column-chart_loading');
    }

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


  async fetchUpdate(from, to) {

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

  update(from, to) {

  }

  oldUpdate(data) {
    this.data = data.map(el => el[1]);
    const value = this.data.reduce((acc, val) => acc + val, 0);
    this.value = value;

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    this.subElements.header.innerText = this.value;
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

