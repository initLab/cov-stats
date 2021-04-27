const pug = require('pug');
const request = require('superagent');

const url = 'https://data.egov.bg/api/getResourceData';
const resource_uri = 'cb5d7df0-3066-4d7a-b4a1-ac26525e0f0c';
// show data for {days} amount of days before current
const days = 7;
const region = 'SOF_ACT';

const getData = () => request
  .post(url)
  .send({resource_uri})
  .set('Accept', 'application/json')
  .then(res => res.body.data)
  .then(data => ({
    index: data[0].findIndex(r => r === region), // SOF_ACT
    data
  }))
  .then(({index, data}) => ({
    current: data.slice(-1).pop()[index],
    data: data.slice(-(days + 1), -1).map(r => [r[0], r[index]])
  }));

module.exports = () => getData().then(data => pug.renderFile('index.pug', data));

// module.exports = () => pug.renderFile('index.pug', {
//   data: [['2021-04-25', 11211], ['2021-04-26', 11456], ['2021-04-27', 11789]],
//   current: 12345
// })
