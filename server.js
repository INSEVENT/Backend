// const response = require('./response.js');
// const multer = require('multer');
const express = require('express');
const mysql = require('mysql');
const server = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger/apidocs.json');

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'inforsau_admin',
    password: "O]z4#,5Y[p}Q",
    database: 'inforsau_INFORSA'
});

const authDataMap = new Map();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../public_html/uploads');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
//   }
// });

// const upload = multer({ storage: storage });

//Web INSEVENT

server.get('/', (req, res) => {
    res.send('Welcome to INFORSA API');
});

server.get('/api/getAcc', (req, res) => {
  db.connect((err) => {
    const sqlSelect = "SELECT * FROM admin";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
  })
});

server.post('/api/auth', (req, res) => {
  db.connect((err) => {
    const { userId, userToken } = req.body;
    authDataMap.set(userToken,{ userId, userToken });
    console.log('login auth',authDataMap);
    const responseData = {
      status: 'success',
      message: 'Autentikasi berhasil!',
      userId: userId,
      userToken:userToken
    };
    res.json(responseData);
  })
});

//insert data
// server.post('/api/event', upload.none(), (req, res) => {
//   db.connect((err) => {
//     const { Title, CardTitle, CardSubTitle, Isi } = req.body;
//     const sqlInsert = `INSERT INTO events (Title, CardTitle, CardSubTitle, Isi) VALUES (?, ?, ?, ?)`;
//     const values = [Title, CardTitle, CardSubTitle, Isi];
//     db.query(sqlInsert, values, (err, fields) => {
//       if (err) {
//         console.error('Error = ',err);
//         res.status(500).send('Gagal menyimpan data.');
//       } else {
//         if (fields.affectedRows) {
//           response(200, "INI INSERT", "BERHASIL", res);
//         } else {
//           console.log("Gagal menyimpan data.");
//         }
//         console.log(fields);
//       }
//     });
//   })
// });

server.get('/insevent/get', (req, res) => {
    db.connect((err) => {
        const sqlSelect = "SELECT * FROM insevent ORDER BY Start_Date ASC";
        db.query(sqlSelect, (err, result) => {
            if (err) {
                console.error('Query error: ' + err.stack);
                return;
            }
            console.log('Berhasil mendapatkan data dari database');
            res.send(result);
        });
    });
});

server.get('/insevent/get/lomba', (req, res) => {
    db.connect((err) => {
        const sqlSelect = "SELECT * FROM insevent WHERE Jenis_Event = Lomba ORDER BY Start_Date ASC";
        db.query(sqlSelect, (err, result) => {
            if (err) {
                console.error('Query error: ' + err.stack);
                return;
            }
            console.log('Berhasil mendapatkan data dari database');
            res.send(result);
        });
    });
});

server.get('/insevent/get/peserta', (req, res) => {
    db.connect((err) => {
        const sqlSelect = "SELECT p.Email, p.Nama_Lengkap, e.Nama_Event, p.Asal_Instansi FROM peserta_insevent p JOIN insevent e ON p.ID_Event = e.ID_Event ORDER BY p.ID_Event ASC";
        db.query(sqlSelect, (err, result) => {
            if (err) {
                console.error('Query error: ' + err.stack);
                return;
            }
            console.log('Berhasil mendapatkan data dari database');
            res.send(result);
        });
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server berjalan pada port ${port}`);
});
