export default class SortableTable {
  element;
  subElement = {};

  constructor(headerConfig = [],
    { data = [], sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    } } = {}, isSortLocally = true) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;

    this.render();
  }


  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');

    if (column) {
      const { id, order } = column.dataset;
      const newOrder = order === 'asc' ? 'desc' : 'asc';
      const sortedData = this.sort(id, newOrder);
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = newOrder;

      if (!arrow) {
        column.append(this.subElements.arrow);
      }

      this.subElements.body.innerHTML = this.getTableRows(sortedData);
    }
  }


  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
  }

  get getTemplate() {
    return `
    <div data-element="productsContainer" class="products-list__container">
    <div class="sortable-table">
        ${this.headerTemplate()}
        ${this.getBody()}
      <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>
      `;
  }

  getHeaderRow({ id, title, sortable }) {
    const order = this.sorted.id === id ? this.sorted.order : 'asc';

    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
        <span>${title}</span>
        ${this.getHeaderSortingArrow(id)}
      </div>
    `;
  }

  headerTemplate() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
      </div>
    `;
  }

  getHeaderSortingArrow(id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';

    return isOrderExist
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : '';
  }

  getBody() {
    return `
        <div data-element="body" class="sortable-table__body">
          ${this.getTableRows(this.data)}
        </div>
    `;
  }

  getTableRows(data = []) {
    return data.map((item) => {
      return `
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.getTableRow(item)}
      </a>
      `;
    }).join('');
  }

  getTableRow(item) {
    return this.headerConfig.map(({ id, template }) => {
      return template ?
        template(item[id]) :
        ` <div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  sort(field, order) {

    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === field);
    const { sortType } = column;

    const directions = {
      asc: 1,
      desc: -1
    };
    const direct = directions[order];

    return arr.sort((a, b) => {
      if (sortType === 'string') {
        return direct * a[field].localeCompare(b[field], ['ru', 'en']);
      }
      if (sortType === 'number') {
        return direct * (a[field] - b[field]);
      } else {
        return direct * (a[field] - b[field]);
      }
    });
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }
    return result;
  }

  render() {
    const element = document.createElement("div");

    element.innerHTML = this.getTemplate;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
    this.sort(this.sorted?.id, this.sorted?.order);

    this.initEventListeners();
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
