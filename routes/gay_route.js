const app = require('express');
const router = app.Router();

const gay_controller = require('../controllers/gay_controller')

router.get('/gay-users', gay_controller.get_gay_users);

router.post('/gay-users', gay_controller.post_gay_users);


module.exports = router