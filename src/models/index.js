import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Sequelize from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Import database config properly
const dbConfig = await import(`${__dirname}/../config/database.js`);
const config = dbConfig.default[env];

const db = {};

let sequelize;
// Check if config exists and has required properties
if (config && config.database) {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
} else {
  console.error('Database configuration not found for environment:', env);
  process.exit(1);
}

const modelFiles = fs
  .readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js',
  );

for (const file of modelFiles) {
  const module = await import(path.join(__dirname, file));
  const model = module.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
