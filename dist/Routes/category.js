"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRouter = void 0;
const express_1 = require("express");
const category_1 = require("../Controllers/category");
const router = (0, express_1.Router)();
exports.CategoryRouter = router;
router.get('/categories', category_1.index);
