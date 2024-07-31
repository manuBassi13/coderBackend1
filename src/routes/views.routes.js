import { Router } from "express"

const router = Router()


router.get('/', (req, res) => {
    res.render('home', {})
})

router.get('/realtimeproducts', (req, res) => {

})

export default router