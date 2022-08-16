export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();

  }

  get getTemplate() {
    return `
    <div data-element="productsContainer" class="products-list__container">
    <div class="sortable-table">
  
      <div data-element="header" class="sortable-table__header sortable-table__row">
        <div class="sortable-table__cell" data-id="images" data-sortable="false" data-order="asc">
          <span>Image</span>
        </div>
        <div class="sortable-table__cell" data-id="title" data-sortable="true" data-order="asc">
          <span>Name</span>
          <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>
        </div>
        <div class="sortable-table__cell" data-id="title" data-sortable="true" data-order="asc">
          <span>Quantity</span>
        </div>
        <div class="sortable-table__cell" data-id="quantity" data-sortable="true" data-order="asc">
          <span>Price</span>
        </div>
        <div class="sortable-table__cell" data-id="price" data-sortable="true" data-order="asc">
          <span>Sales</span>
        </div>
      </div>
  
      <div data-element="body" class="sortable-table__body">
      ${this.getData()}
      </div>

      <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
  
      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>
        `;
  }

  getData() {

    return this.data.map(el => {
      return `
        <a href="/products/${el.id}" class="sortable-table__row">
          <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src=${el.images[0].url}>
          </div>
          <div class="sortable-table__cell">${el.title}</div>
    
          <div class="sortable-table__cell">${el.quantity}</div>
          <div class="sortable-table__cell">${el.price}</div>
          <div class="sortable-table__cell">${el.sales}</div>
        </a>
      `;
    }).join('');
  }

  sort(field, order) {
    const directions = {
      asc: 1,
      desc: -1
    };
    const direct = directions[order];

    const arr = [...this.data];
    const data = arr.sort((a, b) => {
      if (field === 'title') {
        return direct * a['title'].localeCompare(b['title'], ['ru', 'en'], { caseFirst: 'upper' });
      }
      return direct * a[field] - b[field];
    });

    this.update(data);
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


  update(data) {
    this.data = data;

    this.subElements.body.innerHTML = this.getData();
  }


  render() {
    const element = document.createElement("div");

    element.innerHTML = this.getTemplate;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;

  }
}

