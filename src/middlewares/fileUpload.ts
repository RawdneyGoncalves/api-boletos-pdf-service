import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';


const setupDirectories = (): void => {
  const uploadDir = process.env.UPLOAD_DIR || './uploads';
  const outputDir = process.env.OUTPUT_DIR || './output';
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
};

setupDirectories();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});


const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimetypes = {
    csv: ['text/csv', 'application/csv', 'text/plain'],
    pdf: ['application/pdf']
  };
  
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (fileExtension === '.csv' && allowedMimetypes.csv.includes(file.mimetype)) {
    cb(null, true);
  } else if (fileExtension === '.pdf' && allowedMimetypes.pdf.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file format. Use only ${Object.keys(allowedMimetypes).join(' or ')}.`));
  }
};


export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export const uploadCsv = (req: Request, res: Response, next: NextFunction) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file provided' });
    }
    
    if (!req.file.originalname.toLowerCase().endsWith('.csv')) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'File must be a CSV' });
    }
    
    next();
  });
};


export const uploadPdf = (req: Request, res: Response, next: NextFunction) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }
    
    if (!req.file.originalname.toLowerCase().endsWith('.pdf')) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'File must be a PDF' });
    }
    
    next();
  });
};