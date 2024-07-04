const express = require('express')
const RecipesController = require ('../controllers/RecipesController')
const {body} = require('express-validator');
const handleErrorMessage = require('../middlewares/handleErrorMessage');

const router = express.Router();

router.get('',RecipesController.index)

router.post('',[
    body('title').notEmpty(),
    body('price').notEmpty(),
    body('category').notEmpty(),
],handleErrorMessage,RecipesController.store)

router.get('/:id',RecipesController.show)

router.delete('/:id',RecipesController.destroy)

router.patch('/:id',RecipesController.update)

module.exports = router