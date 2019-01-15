const request = require('request');
const {
  News,
  NewsService
} = require('../helper-scripts/news_service.js');

let interval = 5 // minutes
fetchNews();
let newsFetchLoop = setInterval(fetchNews, interval * 1000 * 60); // Producer

let newsService = new NewsService();

function fetchNews() {
  const options = {
    url: 'https://newsapi.org/v2/top-headlines?country=in&pageSize=100',
    method: 'GET',
    headers: {
      authorization: 'fd5cae3f615841cf9e13b5dd7fbc0ef6'
    },
    json: true
  }

  request.get(options, function(err, res, body) {
    if (err) {
      console.error(err);
    } else {
      if (body.status && body.status === "ok") {
        let news = newsService.getNewsList(body.articles);
        newsService.storeInDB(news);
      } else {
        console.log(body);
      }
    }
  });
}

// Consumer
function showNews() {
  let newsListPromise = newsService.queryNewsList({});
  newsListPromise.then((newsList) => {
    if (!newsList || newsList.length <= 0) {
      setTimeout(showNews, 1000);
      return;
    }
    newsList.forEach((news) => {
      let postData = {
        msg: news.title,
        duration: 4,
        priority: 'LOW'
      }
      request.post('http://localhost:8040/lcd/displayMsg', {
        json: postData
      }, function(err, res, body) {
        if (err) {
          console.error(err);
        }
      });
    });
    setTimeout(showNews, interval * 1000 * 60);
  });
}

showNews();

function getNews(params) {
  return newsService.queryNewsList(params);
}

function setFetchRate(params) {
  interval = (params.interval && params.interval > 2) ? params.interval : interval;
  clearInterval(newsFetchLoop);
  newsFetchLoop = setInterval(fetchNews, interval * 1000 * 60);
}

module.exports = {
  setFetchRate: setFetchRate,
  getNews: getNews
}