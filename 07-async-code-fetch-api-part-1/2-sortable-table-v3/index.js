import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElement = {};

  constructor(
    headerConfig = [],
    { data = [], sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    }, url } = {}, isSortLocally = false
  ) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.url = url;
    this.end = 30;

    this.render();
  }

  sortOnClient(id, order) {

    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === id);
    const { sortType } = column;

    const directions = {
      asc: 1,
      desc: -1
    };
    const direct = directions[order];

    return arr.sort((a, b) => {
      if (sortType === 'string') {
        return direct * a[id].localeCompare(b[id], ['ru', 'en']);
      }
      if (sortType === 'number') {
        return direct * (a[id] - b[id]);
      } else {
        return direct * (a[id] - b[id]);
      }
    });
  }

  async sortOnServer(id, order) {
    try {
      return await fetchJson(`${BACKEND_URL}/${this.url}?_embed=subcategory.category&_sort=${id}&_order=${order}&_start=0&_end=${this.end}`);
    } catch (error) {
      console.log(error);
    }
  }

  infinityScroll() {
    window.addEventListener('scroll', async () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      if (clientHeight + scrollTop >= scrollHeight) {

        this.start += 30;
        this.end += 30;
        
        try {
          const newdata = await this.addFetchData(this.start, this.end);
          this.subElements.body.innerHTML += this.getTableRows(newdata);
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  async addFetchData(start, end) {
    try {
      return await fetchJson(`${BACKEND_URL}/${this.url}?_embed=subcategory.category&_start=${start}&_end=${end}`);

    } catch (error) {
      alert(error);
    }
  }

  fetchOnServer(end) {
    try {
      fetchJson(`${BACKEND_URL}/${this.url}?_embed=subcategory.category&_start=0&_end=${end}`)
        .then(response => {
          this.data = response;
          this.subElements.body.innerHTML = this.getTableRows(response);
        });
    } catch (error) {
      alert(error);
    }
  }

  onSortClick = async event => {
    const column = event.target.closest('[data-sortable="true"]');

    if (column) {
      const { id, order } = column.dataset;
      const newOrder = order === 'asc' ? 'desc' : 'asc';
      let sortedData;

      if (!this.isSortLocally) {

        this.subElements.body.innerHTML = this.loadingTemplate();

        sortedData = await this.sortOnServer(id, newOrder);
      } else if (this.isSortLocally) {
        sortedData = this.sortOnClient(id, newOrder);
      }
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = newOrder;

      if (!arrow) {
        column.append(this.subElements.arrow);
      }

      this.subElements.body.innerHTML = this.getTableRows(sortedData);
    }
  }

  loadingTemplate() {
    return `
      <div>Loading....</div>
    `;
  }

  emptyTemplate() {
    return `
      <div>Запрос неверный</div>
    `;
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
    if (!this.data.length) {
      this.subElements.body.innerHTML = this.loadingTemplate();
      this.fetchOnServer(this.end);
    }

    this.initEventListeners();
    this.infinityScroll();
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
