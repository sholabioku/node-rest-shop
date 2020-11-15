import { Router } from 'express';
import multer from 'multer';

import checkAuth from '../middlewares/check-auth';
import {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
} from '../controllers/products';

import { validateProductId } from '../middlewares/validateObjectId';

const router = Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './src/uploads/');
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

router.get('/', getProducts);

router.post('/', checkAuth, upload.single('productImage'), addProduct);

router.get('/:productId', validateProductId, getProduct);

router.patch('/:productId', [checkAuth, validateProductId], editProduct);

router.delete('/:productId', [checkAuth, validateProductId], deleteProduct);

export default router;
