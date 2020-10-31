import { Router } from 'express';

const router = Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET requets for /products',
  });
});

router.post('/', (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price,
  };
  res.status(201).json({
    message: 'Handling POST requets for /products',
    createdProduct: product,
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;

  if (id === 'specila') {
    res.status(200).json({
      message: 'You discovered the special id',
      id,
    });
  } else {
    res.status(200).json({
      message: 'You passed an ID',
    });
  }
});

router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Updated product',
  });
});

router.delete('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Deleted product',
  });
});

export default router;
