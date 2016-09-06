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
  console.log(req.body);
  try {
    const [sensors] = await Promise.all([
      db.all('select * from sensors').then(ss => {
        console.log(ss);
        return ss;
      })
    ]);
    console.log(sensors);
    const sensor = await db
      .get('select * from sensors where serialNo = ?', [req.body.serialNo]);
    console.log(sensor);
    await db.run(
      'insert into reading (sensor_id, temperature, humidity) values (?, ?, ?)',
      [sensor.id, req.temp, req.hum]);
    res.end();
  } catch (error) {
    next(error);
  }
});

Promise.resolve()
  .then(() => db.open('./db.sqlite', { Promise }))
  .then(() => db.migrate())
  .catch(error => console.error(error.stack))
  .finally(() => app.listen(3000));