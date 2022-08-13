export default class ColumnChart {

  // chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
    formatHeading
  } = {}) {

    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.chartHeight = 50;

    if (formatHeading) {
      this.value = formatHeading(this.value);
    }


    this.render();

  }



  render() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('column-chart_loading');
    wrapper.classList.add('column-chart');
    wrapper.style = `--chart-height: ${this.chartHeight}`;
    if (this.data.length) {
      wrapper.classList.remove('column-chart_loading');
    }
    wrapper.innerHTML = `
      <div class="column-chart__title">
        ${this.label}
        <a href=${this.link} class="column-chart__link">View all</a>
      </div>
    `;

    const container = document.createElement('div');
    container.classList.add('column-chart__container');

    const wrapperContainer = wrapper.querySelector('.column-chart__title');

    wrapperContainer.after(container);

    const columnContainer = wrapper.querySelector('.column-chart__container');

    const header = document.createElement('div');
    header.classList.add('column-chart__header');
    header.dataset.element = 'header';
    header.innerHTML = `${this.value}`;


    columnContainer.append(header);

    const body = document.createElement('div');
    body.classList.add('column-chart__chart');
    body.dataset.element = 'body';

    columnContainer.append(body);

    const bodyWrapper = wrapper.querySelector('.column-chart__chart');


    this.data.forEach(el => {
      const div = document.createElement('div');
      const maxValue = Math.max(...this.data);
      const scale = 50 / maxValue;
      const value = String(Math.floor(el * scale));
      div.style = `--value: ${value}`;
      const dataMath = Math.round(el * 100 / maxValue) + '%';
      div.dataset.tooltip = dataMath;

      bodyWrapper.append(div);
    });


    this.element = wrapper;


  }


  update(data) {
    this.data = data;
    this.render();
  }

  remove() {
    this.element.remove();
  }

  destroy() {

  }

}
