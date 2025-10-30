import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import { User } from './models/user';
import { Exercise } from './models/exercise';
require('dotenv').config();

(async () => {
  const app = express()
  console.log('MongoDB connecting...')
  await mongoose.connect(process.env['MONGO_URL'] as string)
  console.log('MongoDB connected.')

  app.use(cors())
  app.use(bodyParser.urlencoded())
  app.use(bodyParser.json())
  app.use(express.static('public'))
  app.get('/', (_, res) => {
    res.sendFile(__dirname + '/views/index.html')
  });

  app.post('/api/users', async (req, res) => {
    try {
      const { username } = req.body
      const user = new User({ username })
      await user.save()
      res.json({ username: user.username, _id: user._id })
    } catch (err) {
      res.status(500).json({ error: 'Failed to create user!' })
    }
  })

  app.get('/api/users', async (_, res) => {
    const users = await User.find().select('_id').select('username')
    res.json(users)
  })

  app.post('/api/users/:_id/exercises', async (req, res) => {
    try {
      const { description, duration, date } = req.body
      const userId = req.params._id
      const user = await User.findById(userId)
      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }

      const exercise = new Exercise({
        userId,
        description,
        duration: parseInt(duration),
        date: date ? new Date(date) : new Date()
      })
      await exercise.save()

      res.json({
        _id: user._id,
        username: user.username,
        date: exercise.date.toDateString(),
        duration: exercise.duration,
        description: exercise.description
      })
    } catch (err) {
      res.status(500).json({ error: 'Failed to add exercise' })
    }
  })

  app.get('/api/users/:_id/logs', async (req, res) => {
    try {
      const { from, to, limit } = req.query;
      const userId = req.params._id;

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      };

      const filter: any = { userId };

      if (from || to) filter.date = {};
      if (from) filter.date.$gte = new Date(from as string);
      if (to) filter.date.$lte = new Date(to as string);

      let query = Exercise.find(filter);
      if (limit) query = query.limit(parseInt(limit as string));

      const exercises = await query.exec();

      res.json({
        _id: user._id,
        username: user.username,
        count: exercises.length,
        log: exercises.map(e => ({
          description: e.description,
          duration: e.duration,
          date: e.date.toDateString()
        }))
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get logs' });
    }
  })

  const port = +(process.env['PORT'] || 3000)

  app.listen(port, () => {
    console.log('Your app is listening on port ' + port)
  })
})()
