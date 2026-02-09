const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4100;
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const DATA_DIR = path.join(__dirname, 'data');
const BOOKS_PATH = path.join(DATA_DIR, 'books.json');
const UPLOAD_DIR = path.join(__dirname, 'upload');

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(BOOKS_PATH)) {
    const seed = [
      {
        id: 1,
        title: 'Giáo trình Tin học cơ bản',
        price: 260000,
        description: 'Nội dung của cuốn: Tin Học Cơ Bản Windows XP gồm có 7 chương...',
        coverImage: 'THCB.jpg',
        updatedAt: '2014-10-25T00:00:00.000Z',
        quantity: 120,
        categoryId: 7,
        publisherId: 1,
        createdAt: '2014-10-25T00:00:00.000Z'
      }
    ];
    fs.writeFileSync(BOOKS_PATH, JSON.stringify(seed, null, 2));
  }
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

ensureDataFile();

const readBooks = () => {
  const raw = fs.readFileSync(BOOKS_PATH, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
};

const writeBooks = (books) => {
  fs.writeFileSync(BOOKS_PATH, JSON.stringify(books, null, 2));
};

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeBookPayload = (payload, existing = null) => {
  const now = new Date().toISOString();
  const base = existing || {
    createdAt: now,
  };

  return {
    ...base,
    title: payload.title?.trim() || base.title || '',
    price: toNumber(payload.price, base.price || 0),
    description: payload.description?.trim() || base.description || '',
    coverImage: payload.coverImage || base.coverImage || '',
    updatedAt: now,
    quantity: toNumber(payload.quantity, base.quantity || 0),
    categoryId: toNumber(payload.categoryId, base.categoryId || 0),
    publisherId: toNumber(payload.publisherId, base.publisherId || 0)
  };
};

const saveUpload = (imageFile) => {
  const safeName = `${Date.now()}_${imageFile.name}`.replace(/\s+/g, '_');
  const targetPath = path.join(UPLOAD_DIR, safeName);
  imageFile.mv(targetPath);
  return safeName;
};

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: {
      fileSize: 10000000,
    },
    abortOnLimit: true,
  })
);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/image/:id', (req, res) => {
  const id = req.params['id'];
  res.sendFile(path.join(UPLOAD_DIR, id));
});

app.post('/upload', (req, res) => {
  const image = req.files?.image;
  if (!image) return res.status(400).send('No file uploaded.');
  const fileName = saveUpload(image);
  res.status(200).send(fileName);
});

app.get('/api/books', (req, res) => {
  const books = readBooks();
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const id = toNumber(req.params.id, -1);
  const books = readBooks();
  const book = books.find((item) => item.id === id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }
  res.json(book);
});

app.post('/api/books', (req, res) => {
  const books = readBooks();
  const nextId = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;

  const imageFile = req.files?.image || req.files?.imageFile;
  const coverImage = imageFile ? saveUpload(imageFile) : req.body.coverImage;

  const payload = normalizeBookPayload({
    ...req.body,
    coverImage,
  });

  const newBook = {
    id: nextId,
    ...payload,
  };
  books.push(newBook);
  writeBooks(books);
  res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const id = toNumber(req.params.id, -1);
  const books = readBooks();
  const index = books.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  const imageFile = req.files?.image || req.files?.imageFile;
  const coverImage = imageFile ? saveUpload(imageFile) : req.body.coverImage;

  const updated = normalizeBookPayload(
    {
      ...req.body,
      coverImage,
    },
    books[index]
  );

  books[index] = {
    ...books[index],
    ...updated,
  };
  writeBooks(books);
  res.json(books[index]);
});

app.delete('/api/books/:id', (req, res) => {
  const id = toNumber(req.params.id, -1);
  const books = readBooks();
  const index = books.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Book not found.' });
  }
  const removed = books.splice(index, 1)[0];
  writeBooks(books);
  res.json({ message: 'Deleted', book: removed });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
