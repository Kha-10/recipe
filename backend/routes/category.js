const express = require('express')
const CategoriesController = require ('../controllers/CategoriesController')
const {body} = require('express-validator');
const handleErrorMessage = require('../middlewares/handleErrorMessage');

const router = express.Router();

router.get('',CategoriesController.index)

router.post('',[
    body('title').notEmpty(),
],handleErrorMessage,CategoriesController.store)

router.get('/:id',CategoriesController.show)

router.delete('/:id',CategoriesController.destroy)

router.patch('/:id',CategoriesController.update)

module.exports = router