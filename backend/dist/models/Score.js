"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Score = void 0;
const mongoose_1 = require("mongoose");
const scoreSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    score: {
        type: Number,
        required: true,
    },
});
exports.Score = (0, mongoose_1.model)("Score", scoreSchema);
