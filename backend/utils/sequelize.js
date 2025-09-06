import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'yedire_frewoch',
  process.env.DB_USER || 'root', 
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+00:00',
    define: {
      timestamps: false, // We'll handle timestamps manually to match your schema
      underscored: true,  // Use snake_case for column names
      freezeTableName: true, // Don't pluralize table names
    }
  }
);

// Import models
import Admin from '../models/Admin.js';
import School from '../models/School.js';
import Bank from '../models/Bank.js';
import Community from '../models/Community.js';
import Testimonial from '../models/Testimonial.js';
import Sponsor from '../models/Sponsor.js';
import UrgentMessage from '../models/UrgentMessage.js';
import Volunteer from '../models/Volunteer.js';
import SocialLink from '../models/SocialLink.js';
import SchoolImage from '../models/SchoolImage.js';

// Initialize models
const models = {
  Admin: Admin(sequelize),
  School: School(sequelize),
  Bank: Bank(sequelize),
  Community: Community(sequelize),
  Testimonial: Testimonial(sequelize),
  Sponsor: Sponsor(sequelize),
  UrgentMessage: UrgentMessage(sequelize),
  Volunteer: Volunteer(sequelize),
  SocialLink: SocialLink(sequelize),
  SchoolImage: SchoolImage(sequelize)
};

// Set up associations
const setupAssociations = () => {
  // School <-> SchoolImage associations
  if (models.School && models.SchoolImage) {
    models.School.hasMany(models.SchoolImage, {
      foreignKey: 'school_id',
      sourceKey: 'school_id',
      as: 'images'
    });

    models.SchoolImage.belongsTo(models.School, {
      foreignKey: 'school_id',
      targetKey: 'school_id',
      as: 'school'
    });
  }
};

// Initialize models and associations
const initializeModels = async () => {
  try {
    // Initialize all models - await each sync operation
    for (const model of Object.values(models)) {
      if (model && typeof model.sync === 'function') {
        try {
          await model.sync({ alter: false }); // Don't alter tables, just sync
          console.log(`✅ Model ${model.name || 'Unknown'} synced successfully`);
        } catch (syncError) {
          console.warn(`⚠️ Warning: Could not sync model ${model.name || 'Unknown'}:`, syncError.message);
        }
      }
    }

    // Set up associations
    setupAssociations();

    console.log('✅ All models initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing models:', error);
    throw error;
  }
};

// Test connection function
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Database connected successfully via Sequelize');
    
    // Initialize models after successful connection
    await initializeModels();
  } catch (error) {
    console.error('❌ Sequelize Database connection failed:', error.message);
    throw error;
  }
};

export { sequelize, testConnection, models };
export default sequelize;
