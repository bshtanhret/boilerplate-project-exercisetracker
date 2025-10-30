import { Request, Response } from "express"
import { User } from "../models/user"
import { Exercise } from "../models/exercise"

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username } = req.body

        const existingUser = await User.findOne({ username })

        if (existingUser) {
            return res.status(400).json({ error: `User with username '${username}' already exists!` })
        }

        const user = new User({ username })
        await user.save()
        return res.json({ username: user.username, _id: user._id })
    } catch (err) {
        return res.status(500).json({ error: 'Failed to create user!' })
    }
}

export const getAllUsers = async (_: Request, res: Response) => {
    const users = await User.find().select('_id').select('username')
    res.json(users)
}

export const addExercise = async (req: Request, res: Response) => {
    try {
        const { description, duration, date } = req.body
        const userId = req.params['_id']
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
}

export const getAllExercises = async (req: Request, res: Response) => {
    try {
        const { from, to, limit } = req.query;
        const userId = req.params['_id'];

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' })
            return
        };

        const filter: any = { userId };

        if (from || to) filter.date = {};
        if (from) filter.date.$gte = new Date(from as string);
        if (to) filter.date.$lte = new Date(to as string);

        const totalCount = await Exercise.countDocuments(filter);
        let query = Exercise.find(filter).sort({ date: 1 });
        if (limit) query = query.limit(parseInt(limit as string));

        const exercises = await query.exec();

        res.json({
            _id: user._id,
            username: user.username,
            count: totalCount,
            log: exercises.map(e => ({
                description: e.description,
                duration: e.duration,
                date: e.date.toDateString()
            }))
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get logs' });
    }
}