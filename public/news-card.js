import {
  PolymerElement,
  html
} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import moment from 'moment';

export class NewsCard extends PolymerElement {
  constructor() {
    super();
  }

  static get template() {
    return html `
    <style>
    #card {
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      transition: 0.3s;
      margin: 20px 40px;
      background-color: rgba(200, 200, 200, 0.2);
    }
    .card:hover {
      box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
    }
    .container {
      padding: 5px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .title {
      font-size: 120%;
      font-weight: 600;
      width: 100%;
      text-align: center;
      margin-top: 30px;
      margin-bottom: 10px;
    }
    .subTitle {
      font-size: 80%;
      font-weight: bold;
      text-align: center;
    }
    .desc {
      color: #606060;
      text-align: center;
    }
    .heading {
      width: 1000px;
      display: flex;
      flex-direction: column;
      margin-bottom: 30px;
    }
    #image {
      width: 400px;
      height: 200px;
      object-fit: contain;
    }
    #textual {
      height: 200px;
      width: 1000px;
      display: flex;
      padding: 0 10px;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;
    }
    #dialog {
      background-color: rgba(0,0,0,0);
    }
    #dialogImg {
      width: 1000px;
      height: 700px;
      object-fit: contain;
    }
    #timestamp {
      padding-left: 20px;
    }
    </style>

    <div id="card">
      <div class="container">
        <div id="textual">
          <div class="heading">
            <span class="title">[[data.title]]</span>
            <div class="subTitle">
              <dom-if if='[[_willShowAuthor(data.author)]]'>
                <template>
                  <span>By: [[data.author]]</span>
                </template>
              </dom-if>
              <span id="timestamp">At: [[_getFormattedTime(data.timestamp)]]</span>
            </div>
          </div>
          <span class="desc">[[data.description]]</span>
        </div>

        <img id="image" src="[[data.image_url]]"></img>
      </div>
    </div>

    <paper-dialog id="dialog" modal>
      <paper-icon-button icon="close" dialog-confirm autofocus></paper-icon-button>
      <img id="dialogImg" src="[[data.image_url]]"></img>
    </paper-dialog>
    `
  }

  static get properties() {
    return {
      data: {
        type: Object,
        value: {}
      }
    }
  }

  ready() {
    super.ready();
    this.$.textual.addEventListener('click', e => {
      window.open(this.data.url, '_blank');
    });

    this.$.image.addEventListener('click', function(e) {
      this.$.dialog.open();
    }.bind(this));
  }
  _willShowAuthor(author) {
    return (author && author.length > 0);
  }
  _getFormattedTime(time) {
    return moment(time).format('h:mm:ss a, Do MMM \'YY');
  }
}

customElements.define('news-card', NewsCard);