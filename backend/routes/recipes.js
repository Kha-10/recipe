const express = require('express')
const RecipesController = require ('../controllers/RecipesController')
const {body} = require('express-validator');
const handleErrorMessage = require('../middlewares/handleErrorMessage');
const upload = require('../helpers/upload');
const awsUpload = require('../helpers/awsUpload')

const router = express.Router();

router.get('',RecipesController.index)

router.post('',[
    body('title').notEmpty(),
    body('price').notEmpty(),
    body('category').notEmpty(),
],handleErrorMessage,RecipesController.store)

router.get('/:id',RecipesController.show)

// router.post('/:id/upload',[
//     upload.single('photo'),
//     body('photo').custom(async (value,{req}) => {
//         if (!req.file) {
//           throw new Error("Photo is required");
//         }
//         if(!req.file.mimetype.startsWith('image')) {
//             throw new Error('Photo must be image type')
//         }
//       }),
// ],handleErrorMessage,RecipesController.upload)

router.post('/:id/upload',[
    awsUpload.single('photo'),
    body('photo').custom(async (value,{req}) => {
        if (!req.file) {
          throw new Error("Photo is required");
        }
        if(!req.file.mimetype.startsWith('image')) {
            throw new Error('Photo must be image type')
        }
      }),
],handleErrorMessage,RecipesController.upload)

router.delete('/:id',RecipesController.destroy)

router.patch('/:id',RecipesController.update)

module.exports = router