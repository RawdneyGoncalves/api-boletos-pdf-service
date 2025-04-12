import express from 'express';
import path from 'path';

import 'reflect-metadata';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const outputDir = process.env.OUTPUT_DIR || './output';

app.use('/uploads', express.static(path.resolve(uploadDir)));
app.use('/output', express.static(path.resolve(outputDir)));



export default app;