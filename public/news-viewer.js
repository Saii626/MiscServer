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
    <style>
    #attribution {
      width: 100%;
      height: 20px;
      font-size: 80%;
    }
    #poweredBy {
      float: right;
      cursor: pointer;
      margin-right: 20px;
    }
    </style>
    <div id="attribution">
      <span id="poweredBy">powered by: NewsAPI.org</span>
    </div>
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
        }
      },
      _resources: {
        type: Object,
        value: Resources
      }
    }
  }

  static get observers() {
    return ['fetchNews(xhrParams.*)'];
  }

  ready() {
    super.ready();

    window.onscroll = function() {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        console.log('Scrolled till end');
        this.xhrParams.offset = this.xhrParams.offset + 1;
        this.notifyPath('xhrParams.offset');
      }
    }.bind(this);

    this.$.poweredBy.addEventListener('click', e => {
      window.open(this._resources.urls.NEWSAPI_HOME, '_blank');
    });
  }

  handleNewsList(data) {
    if (data && data.detail && data.detail.response) {
      let list = this.newsList;
      list = list.concat(data.detail.response);
      this.set('newsList', list);
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