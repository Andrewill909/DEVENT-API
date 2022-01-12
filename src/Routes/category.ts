import express, { Router } from 'express';
import { index } from '../Controllers/category';

const router = Router();

router.get('/categories', index);

export { router as CategoryRouter };
