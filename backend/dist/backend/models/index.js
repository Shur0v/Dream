"use strict";
/**
 * MongoDB Models Index
 * Central export for all models
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductReviewModel = exports.FestivalBannerModel = exports.PromoBannerModel = exports.HeroBannerModel = exports.BestSellingProductModel = exports.FeaturedProductModel = exports.OrderModel = exports.UserModel = exports.ColorModel = exports.CategoryModel = exports.ProductModel = void 0;
var Product_1 = require("./Product");
Object.defineProperty(exports, "ProductModel", { enumerable: true, get: function () { return __importDefault(Product_1).default; } });
var Category_1 = require("./Category");
Object.defineProperty(exports, "CategoryModel", { enumerable: true, get: function () { return __importDefault(Category_1).default; } });
var Color_1 = require("./Color");
Object.defineProperty(exports, "ColorModel", { enumerable: true, get: function () { return __importDefault(Color_1).default; } });
var User_1 = require("./User");
Object.defineProperty(exports, "UserModel", { enumerable: true, get: function () { return __importDefault(User_1).default; } });
var Order_1 = require("./Order");
Object.defineProperty(exports, "OrderModel", { enumerable: true, get: function () { return __importDefault(Order_1).default; } });
var FeaturedProduct_1 = require("./FeaturedProduct");
Object.defineProperty(exports, "FeaturedProductModel", { enumerable: true, get: function () { return __importDefault(FeaturedProduct_1).default; } });
var BestSellingProduct_1 = require("./BestSellingProduct");
Object.defineProperty(exports, "BestSellingProductModel", { enumerable: true, get: function () { return __importDefault(BestSellingProduct_1).default; } });
var HeroBanner_1 = require("./HeroBanner");
Object.defineProperty(exports, "HeroBannerModel", { enumerable: true, get: function () { return __importDefault(HeroBanner_1).default; } });
var PromoBanner_1 = require("./PromoBanner");
Object.defineProperty(exports, "PromoBannerModel", { enumerable: true, get: function () { return __importDefault(PromoBanner_1).default; } });
var FestivalBanner_1 = require("./FestivalBanner");
Object.defineProperty(exports, "FestivalBannerModel", { enumerable: true, get: function () { return __importDefault(FestivalBanner_1).default; } });
var ProductReview_1 = require("./ProductReview");
Object.defineProperty(exports, "ProductReviewModel", { enumerable: true, get: function () { return __importDefault(ProductReview_1).default; } });
