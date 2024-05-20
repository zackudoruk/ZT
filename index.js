const express = require('express');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/convert', upload.single('ztFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const ztFilePath = req.file.path;
  const pdfFilePath = path.join('converted', `${req.file.originalname}.pdf`);

  const pdfDoc = new PDFDocument();

  pdfDoc.pipe(fs.createWriteStream(pdfFilePath));
  pdfDoc.text('This is a converted PDF.');

  pdfDoc.end();

  res.download(pdfFilePath, () => {
    fs.unlinkSync(ztFilePath); // Delete the uploaded .zt file
    fs.unlinkSync(pdfFilePath); // Delete the converted .pdf file
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
