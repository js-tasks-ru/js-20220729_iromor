export default class SortableTable {
  element;
  subElement = {};
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();

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

  headerTemplateData() {
    return this.headerConfig.map(el => {
      return `
        <div class="sortable-table__cell" data-id=${el.id} data-sortable=${el.sortable} data-order="">
          <span>${el.title}</span>
          ${this.arrowTemplate()}
        </div>
      `;
    }).join('');
  }

  headerTemplate() {
    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerTemplateData()}
    </div>
    `;
  }

  arrowTemplate() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
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

    const data = arr.sort((a, b) => {
      if (sortType === 'string') {
        return direct * a[field].localeCompare(b[field], ['ru', 'en']);
      }
      return direct * (a[field] - b[field]);
    });

    this.update(data, field, order);
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


  update(data, field, order) {

    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    // NOTE: Remove sorting arrow from other columns
    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getTableRows(data);
  }


  render() {
    const element = document.createElement("div");

    element.innerHTML = this.getTemplate;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
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

