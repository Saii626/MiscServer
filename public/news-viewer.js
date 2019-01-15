import {
  PolymerElement,
  html
} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import './news-card.js';
import moment from 'moment';

export class NewsViewer extends PolymerElement {
  constructor() {
    super();
  }

  static get template() {
    return html `
    <dom-repeat items={{newsList}}>
      <template>
        <news-card data={{item}}></news-card>
      </template>
    </dom-repeat>

    <iron-ajax id="getNews"
      on-response="handleNewsList"
      on-error="handleError">
      </iron-ajax>
    `
  }

  static get properties() {
    return {
      newsList: {
        type: Array,
        value: []
      },
      xhrParams: {
        type: Object,
        value: {
          timestamp: moment().format('YYYY-MM-DDTHH:mm:ss.SSS'),
          limit: 10,
          offset: 0
        },
        observer: 'fetchNews'
      },
      _resources: {
        type: Object,
        value: Resources
      }
    }
  }

  handleNewsList(data) {
    if (data && data.detail && data.detail.response) {
      this.set('newsList', data.detail.response);
      console.log(this.newsList);
    }
  }

  fetchNews() {
    let xhr = this.$.getNews;
    xhr.url = this._resources.urls.GET_NEWS;
    xhr.params = this.xhrParams;
    xhr.generateRequest();
  }
}

customElements.define('news-viewer', NewsViewer);