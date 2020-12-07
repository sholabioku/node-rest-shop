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

import admin from '../middlewares/admin';
import validateObjectId from '../middlewares/validateObjectId';

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

router.post('/', [checkAuth, admin], upload.single('productImage'), addProduct);

router.get('/:id', validateObjectId, getProduct);

router.patch('/:id', [checkAuth, admin, validateObjectId], editProduct);

router.delete('/:id', [checkAuth, admin, validateObjectId], deleteProduct);

export default router;
