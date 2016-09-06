import express from 'express';
import bodyParser from 'body-parser';
import Promise from 'bluebird';
import db from 'sqlite';

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.post('/readings', async (req, res, next) => {
  try {
    const sensor = await db
      .get('select * from sensors where serialNo = ?', [req.body.serialNo]);
    const lastID = await db
      .run(
        'insert into readings (sensor_id, temperature, humidity) values (?, ?, ?)',
        [sensor.id, req.body.temp, req.body.hum])
      .then(s => s.lastID);
    res
      .status(201)
      .json({ id: lastID });
  } catch (error) {
    next(error);
  }
});

Promise.resolve()
  .then(() => db.open('./db.sqlite', { verbose: true, Promise }))
  .then(() => db.migrate())
  .catch(error => console.error(error.stack))
  .finally(() => app.listen(3000));