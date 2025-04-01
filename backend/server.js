const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const path = require('path');


const app = express();
const port = 3000;
const saltRounds = 10;

require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT // Ajoute le port si nécessaire
});


db.connect(err => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.stack);
    return;
  }
  console.log('Connecté à la base de données MySQL avec l\'ID', db.threadId);
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// pour obtenir l'image afin de l'afficher dans sidebar
app.get('/admin', (req, res) => {
  const sql = 'SELECT nom_resp, image FROM responsable LIMIT 1';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du responsable:', err);
      return res.status(500).json({ message: 'Erreur lors de la récupération du responsable' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Responsable non trouvé' });
    }
    res.json(results[0]);
  });
});

//test au démarrage si la table responsable est vide
app.get('/check-responsable', (req, res) => {
  const sql = 'SELECT COUNT(*) AS count FROM responsable';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de la table responsable:', err);
      return res.status(500).json({ message: 'Erreur lors de la vérification de la table responsable' });
    }
    const isRegistered = results[0].count > 0;
    res.json({ isRegistered });
  });
});

//Configuration pour le stockage de l'image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});


// Configuration Nodemailer
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tantelyodilon8@gmail.com', // Votre adresse email Gmail
    pass: 'xpyc zdqt nezs tmcw' // Votre mot de passe d'application
  }
});

//pour envoyer mail
app.post('/send-email', (req, res) => {
  const { toEmail, subject, text } = req.body;

  let mailOptions = {
    from: 'tantelyodilon8@gmail.com', // Votre adresse email Gmail
    to: toEmail,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Échec de l\'envoi de l\'email. Erreur : ', error);
      res.status(500).json({ message: 'Échec de l\'envoi de l\'email. Veuillez réessayer.' });
    } else {
      console.log('Email envoyé: %s', info.messageId);
      res.status(200).json({ message: 'Email envoyé avec succès !' });
    }
  });
});

const upload = multer({ storage });

// insertion dans la table responsable
app.post('/register', upload.single('image'), async (req, res) => {
  const { nom_resp, nom_user, email_resp, tel_resp, mdp } = req.body;
  const image = req.file.filename;

  // Vérification que toutes les données nécessaires sont présentes
  if (!nom_resp || !nom_user || !email_resp || !tel_resp || !mdp || !image) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }

  // Génération du code_conf aléatoire à 5 chiffres
  const code_conf = Math.floor(10000 + Math.random() * 90000);

  try {
    // Hachage du mot de passe avec bcrypt
    const hashedPassword = await bcrypt.hash(mdp, saltRounds);

    const sql = 'INSERT INTO responsable (nom_resp, nom_user, email_resp, tel_resp, mdp, code_conf, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nom_resp, nom_user, email_resp, tel_resp, hashedPassword, code_conf, image], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion dans la table responsable:', err);
        return res.status(500).json({ message: 'Erreur lors de l\'enregistrement dans la base de données' });
      }

      // Vous pouvez renvoyer le résultat ou un message de succès
      res.json({ message: 'Enregistrement réussi dans la table responsable', id_resp: result.insertId });
    });
  } catch (error) {
    console.error('Erreur lors du hachage du mot de passe:', error);
    return res.status(500).json({ message: 'Erreur lors du traitement du mot de passe' });
  }
});

// Authentification
app.post('/login', (req, res) => {
  const { email_resp, mdp } = req.body;

  if (!email_resp || !mdp) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }

  const sql = 'SELECT * FROM responsable WHERE email_resp = ?';
  db.query(sql, [email_resp], async (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche de l\'utilisateur:', err);
      return res.status(500).json({ message: 'Erreur lors de la recherche de l\'utilisateur' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const user = results[0];
    const match = await bcrypt.compare(mdp, user.mdp);

    if (!match) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    res.json({ message: 'Authentification réussie' });
  });
});

//affichage des données du responsable dans paramètres
app.get('/parametres', (req, res) => {
  db.query('SELECT id_resp, nom_resp, nom_user, email_resp, tel_resp FROM responsable', (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des responsables:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des responsables' });
      return;
    }
    res.json(results);
  });
});

//mettre à jour les données du responsable y compris l'image
app.put('/responsables/:id', upload.single('image'), async (req, res) => {
  const { nom_resp, nom_user, email_resp, tel_resp } = req.body;
  const { id } = req.params;

  // Vérifiez si l'image a été envoyée
  let image = null;
  if (req.file) {
    image = req.file.filename;
  }

  // Vérification que toutes les données nécessaires sont présentes
  if (!nom_resp || !nom_user || !email_resp || !tel_resp) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
  }

  try {
    // Construction de la requête SQL en fonction de la présence ou non d'une nouvelle image
    let sql = '';
    let params = [];

    if (image) {
      sql = 'UPDATE responsable SET nom_resp = ?, nom_user = ?, email_resp = ?, tel_resp = ?, image = ? WHERE id_resp = ?';
      params = [nom_resp, nom_user, email_resp, tel_resp, image, id];
    } else {
      sql = 'UPDATE responsable SET nom_resp = ?, nom_user = ?, email_resp = ?, tel_resp = ? WHERE id_resp = ?';
      params = [nom_resp, nom_user, email_resp, tel_resp, id];
    }

    // Exécution de la requête SQL
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du responsable:', err);
        return res.status(500).json({ message: 'Erreur lors de la mise à jour du responsable' });
      }
      res.json({ id_resp: id, nom_resp, nom_user, email_resp, tel_resp, image });
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du responsable:', error);
    return res.status(500).json({ message: 'Erreur lors de la mise à jour du responsable' });
  }
});

// recuperer les données de tous les personnels pour l'affichage ensuite
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM personnel';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des personnels:', err);
      return res.status(500).json({ message: 'Erreur lors de la récupération des personnels' });
    }
    res.json(results);
  });
});

// insérer un nouveau personnel
app.post('/', (req, res) => {
  const newUser = req.body;
  const sql = 'INSERT INTO personnel SET ?';
  db.query(sql, newUser, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion d\'un nouveau personnel:', err);
      return res.status(500).json({ message: 'Erreur lors de l\'enregistrement d\'un nouveau personnel' });
    }
    res.json({ id_pers: result.insertId, ...newUser });
  });
});

// mettre à jour un personnel par ID
app.put('/:id', (req, res) => {
  const updatedUser = req.body;
  const { id } = req.params;
  const sql = 'UPDATE personnel SET ? WHERE id_pers = ?';

  db.query('SELECT * FROM personnel WHERE id_pers = ?', [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche du personnel à mettre à jour:', err);
      return res.status(500).json({ message: 'Erreur lors de la recherche du personnel à mettre à jour' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Personnel non trouvé' });
    }

    db.query(sql, [updatedUser, id], (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du personnel:', err);
        return res.status(500).json({ message: 'Erreur lors de la mise à jour du personnel' });
      }
      res.json({ id_pers: id, ...updatedUser });
    });
  });
});

// supprimer un personnel par ID
app.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM personnel WHERE id_pers = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression du personnel:', err);
      return res.status(500).json({ message: 'Erreur lors de la suppression du personnel' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Personnel non trouvé' });
    }
    res.json({ message: 'Personnel supprimé avec succès' });
  });
});

// récupérer tous les responsables avec leurs ID et noms
app.get('/responsables', (req, res) => {
  const sql = 'SELECT id_resp FROM responsable';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des responsables:', err);
      return res.status(500).json({ message: 'Erreur lors de la récupération des responsables' });
    }
    res.json(results);
  });
});

// récupérer tous les personnels avec leurs ID et noms
app.get('/personnels', (req, res) => {
  const sql = 'SELECT id_pers FROM personnel';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des personnels:', err);
      return res.status(500).json({ message: 'Erreur lors de la récupération des personnels' });
    }
    res.json(results);
  });
});

// Récupérer toutes les indemnités
app.get('/indemnites', (req, res) => {
  db.query('SELECT id_ind, id_pers, type, montant, date_attr, cause FROM indemnite', (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des indemnités:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des indemnités' });
      return;
    }
    res.json(results);
  });
});

// Ajouter une indemnité
app.post('/indemnites', (req, res) => {
  const indemnite = req.body;
  db.query('INSERT INTO indemnite SET ?', indemnite, (error, result) => {
    if (error) {
      console.error('Erreur lors de l\'ajout de l\'indemnité:', error);
      res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'indemnité' });
      return;
    }
    indemnite.id_ind = result.insertId;
    res.status(201).json(indemnite);
  });
});

// mettre à jour une indemnité par ID
app.put('/indemnites/:id', (req, res) => {
  const idIndemnite = req.params.id;
  const updatedIndemnite = req.body;

  const sql = 'UPDATE indemnite SET ? WHERE id_ind = ?';

  db.query(sql, [updatedIndemnite, idIndemnite], (error, result) => {
    if (error) {
      console.error('Erreur lors de la mise à jour de l\'indemnité:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'indemnité' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Indemnité non trouvée' });
      return;
    }
    res.json({ id_ind: idIndemnite, ...updatedIndemnite });
  });
});

// supprimer une indemnité par ID
app.delete('/indemnites/:id', (req, res) => {
  const idIndemnite = req.params.id;

  const sql = 'DELETE FROM indemnite WHERE id_ind = ?';

  db.query(sql, [idIndemnite], (error, result) => {
    if (error) {
      console.error('Erreur lors de la suppression de l\'indemnité:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'indemnité' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Indemnité non trouvée' });
      return;
    }
    res.json({ message: 'Indemnité supprimée avec succès' });
  });
});

//requete entre deux dates pour le rapport
app.get('/rapports', async (req, res) => {
  const { startDate, endDate } = req.query;
  
  try {
    // Requête pour récupérer les données des rapports
    const sqlReports = `
      SELECT personnel.nom_pers, indemnite.type, indemnite.montant, indemnite.date_attr, indemnite.cause
      FROM indemnite
      INNER JOIN personnel ON indemnite.id_pers = personnel.id_pers
      WHERE indemnite.date_attr BETWEEN ? AND ?
    `;
  
    // Requête pour calculer le montant total
    const sqlTotalAmount = `
      SELECT SUM(indemnite.montant) AS totalAmount
      FROM indemnite
      WHERE indemnite.date_attr BETWEEN ? AND ?
    `;
  
    // Exécution des deux requêtes en parallèle
    const [results, totalAmountResults] = await Promise.all([
      new Promise((resolve, reject) => {
        db.query(sqlReports, [startDate, endDate], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      }),
      new Promise((resolve, reject) => {
        db.query(sqlTotalAmount, [startDate, endDate], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0].totalAmount);
          }
        });
      })
    ]);
  
    // Envoyer les résultats au client
    res.json({ results, totalAmount: totalAmountResults });
  
  } catch (error) {
    console.error('Erreur lors de la récupération des rapports:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des rapports' });
  }
});

// recuperation des données pour le tableau de bord
app.get('/dashboard', async (req, res) => {
  try {
    const totalPersonnelsQuery = 'SELECT COUNT(*) AS totalPersonnels FROM personnel';
    const totalIndemnitiesQuery = 'SELECT COUNT(*) AS totalIndemnities FROM indemnite';
    const totalIndemnityTypesQuery = 'SELECT COUNT(DISTINCT type) AS totalIndemnityTypes FROM indemnite';
    const totalAmountQuery = 'SELECT SUM(montant) AS totalAmount FROM indemnite';
    
    const [totalPersonnelsResult, totalIndemnitiesResult, totalIndemnityTypesResult, totalAmountResult] = await Promise.all([
      new Promise((resolve, reject) => db.query(totalPersonnelsQuery, (err, result) => err ? reject(err) : resolve(result))),
      new Promise((resolve, reject) => db.query(totalIndemnitiesQuery, (err, result) => err ? reject(err) : resolve(result))),
      new Promise((resolve, reject) => db.query(totalIndemnityTypesQuery, (err, result) => err ? reject(err) : resolve(result))),
      new Promise((resolve, reject) => db.query(totalAmountQuery, (err, result) => err ? reject(err) : resolve(result))),
    ]);

    res.json({
      totalPersonnels: totalPersonnelsResult[0].totalPersonnels,
      totalIndemnities: totalIndemnitiesResult[0].totalIndemnities,
      totalIndemnityTypes: totalIndemnityTypesResult[0].totalIndemnityTypes,
      totalAmount: totalAmountResult[0].totalAmount
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
});

// recuperation du nombre de type d'indemnité par personnel
app.get('/indemnity-types-per-personnel', (req, res) => {
  const sql = `
    SELECT personnel.nom_pers AS name, COUNT(indemnite.type) AS indemnityCount
    FROM indemnite
    INNER JOIN personnel ON indemnite.id_pers = personnel.id_pers
    GROUP BY personnel.id_pers
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching indemnity types per personnel:', err);
      res.status(500).json({ error: 'Error fetching indemnity types per personnel' });
      return;
    }
    res.json(results);
  });
});

// sert pour la modification de mot de passe du responsable
app.post('/password', (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Récupérer l'ID et le mot de passe existant depuis la base de données
  db.query('SELECT id_resp, mdp FROM responsable LIMIT 1', (err, results) => {
    if (err) {
      console.error('Error fetching password from database:', err);
      res.status(500).json({ message: 'Une erreur est survenue lors de la récupération du mot de passe.' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Responsable non trouvé.' });
      return;
    }

    const userId = results[0].id_resp;
    const hashedPassword = results[0].mdp;

    // Vérifier si l'ancien mot de passe correspond
    bcrypt.compare(oldPassword, hashedPassword, (bcryptErr, isMatch) => {
      if (bcryptErr) {
        console.error('Error comparing passwords:', bcryptErr);
        res.status(500).json({ message: 'Une erreur est survenue lors de la comparaison des mots de passe.' });
        return;
      }

      if (!isMatch) {
        res.status(400).json({ message: 'Le mot de passe actuel est incorrect.' });
        return;
      }

      // Hasher le nouveau mot de passe
      bcrypt.hash(newPassword, 10, (hashErr, hashedNewPassword) => {
        if (hashErr) {
          console.error('Error hashing new password:', hashErr);
          res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour du mot de passe.' });
          return;
        }

        // Mettre à jour le mot de passe dans la base de données
        db.query('UPDATE responsable SET mdp = ? WHERE id_resp = ?', [hashedNewPassword, userId], (updateErr) => {
          if (updateErr) {
            console.error('Error updating password in database:', updateErr);
            res.status(500).json({ message: 'Une erreur est survenue lors de la mise à jour du mot de passe.' });
            return;
          }

          res.status(200).json({ message: 'Le mot de passe a été mis à jour avec succès.' });
        });
      });
    });
  });
});


app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
