import { registerUser, loginUser, aboutMe, logout } from './../controllers/auth'
import express from 'express'
import {project} from '../middlewares/auth'
const router = express.Router()

// Every path we define here will get /api/v1/movies prefix
router.post('/register',registerUser)
router.post('/login', loginUser)
router.get('/me', project, aboutMe)
router.get('/logout', project, logout)

export default router
