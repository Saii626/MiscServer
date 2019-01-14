const {
  Client
} = require('pg');
const fs = require('fs');
const path = require('path');

class News {
  constructor(params) {
    this.timestamp = new Date(params.publishedAt);
    this.title = params.title;
    this.url = params.url;
    this.image_url = params.urlToImage;
    this.description = params.description;
    this.source_id = params.source.id;
    this.source_name = params.source.name;
    this.author = params.author;
  }
}

class NewsService {
  constructor(params) {
    this.repo = new NewsRepo();
  }

  getNewsList(newsList) {
    let news_list = [];

    newsList.forEach((news) => {
      news_list.push(new News(news));
    });
    return news_list;
  }

  storeInDB(newsList) {
    newsList.forEach((news) => {
      this.repo.storeInDB(news);
    });
  }

  async queryNewsList(params) {
    let queryText = 'SELECT * FROM news';
    let values = [];
    if (params.timestamp) {
      queryText = queryText + ' WHERE timestamp <= $1::date';
      values.push(params.timestamp);
    }
    queryText = queryText + ' ORDER BY timestamp';
    queryText = queryText + ' LIMIT ' + (params.limit || 50) + ' OFFSET ' + (params.offset || 0);

    return await this.repo.queryInDb({
      query: queryText,
      values: values
    });
  }
}

class NewsRepo {
  constructor(params) {
    this.client = new Client({
      user: (process.env.NODE_ENV === 'production') ? 'pi' : 'saii',
      host: 'localhost',
      database: 'pi_db',
      password: 'pi_db_pass',
      port: 5432
    });
    this.client.connect();
    let sql = fs.readFileSync(path.join(__dirname, '../db-scripts/news.sql').toString());
    this.client.query(sql, (err, res) => {
      if (err) {
        console.error(err);
      }
    });
  }

  storeInDB(news) {
    let insertQuery = {
      name: 'insert-statement',
      text: 'INSERT INTO news(id, source_id, source_name, author, title, description, url, image_url, timestamp) VALUES(uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8)',
      values: [news.source_id, news.source_name, news.author, news.title, news.description, news.url, news.image_url, news.timestamp]
    }

    this.client.query(insertQuery, (err, res) => {
      if (err) {
        // console.error(err);
      }
    });
  }

  async queryInDb(params) {
    let query = {
      text: params.query,
      values: params.values
    }
    const res = await this.client.query(query);
    return res.rows;
  }
}

module.exports = {
  News: News,
  NewsService: NewsService
}