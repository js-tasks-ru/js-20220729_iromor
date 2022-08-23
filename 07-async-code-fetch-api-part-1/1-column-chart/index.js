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
    this.fullData = [];
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
      <div data-element="header" class="column-chart__header">${this.value}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.dataValue()}
        </div>
      </div>
    </div>
  </div>
    `;
  }

  fetchData() {

    try {
      fetchJson(`${BACKEND_URL}/${this.url}?from=${this.from}&to=${this.to}`)
        .then(data => {
          this.data = Object.entries(data);
          this.update();
        });
    } catch (err) {
      console.log(err);
    }
  }

  dataValue() {

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');

      const newArr = [...this.data].map(el => el[1]);
      
      this.subElements.header.innerText = newArr.reduce((acc, val) => acc + val, 0);

      const maxValue = Math.max(...newArr);
      const scale = this.chartHeight / maxValue;

      return newArr.map(el => {
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


  async update(from, to) {

    if (this.data.length) {
      this.subElements.body.innerHTML = this.dataValue();
    } else {
      let response;
      try {
        response = await fetchJson(`${BACKEND_URL}/${this.url}?from=${from}&to=${to}`);

        this.data = Object.entries(response);
        this.subElements.body.innerHTML = this.dataValue();

      } catch (err) {
        alert('err');
      }
      return response;
    }
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

