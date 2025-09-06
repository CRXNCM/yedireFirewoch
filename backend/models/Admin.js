import bcryptjs from 'bcryptjs';
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'super_admin'),
      allowNull: false,
      defaultValue: 'admin'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'admins',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Instance methods
  Admin.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password; // Don't send password in JSON responses
    return values;
  };

  // Hash password before saving
  Admin.beforeCreate(async (admin) => {
    if (admin.password) {
      const saltRounds = 10;
      admin.password = await bcryptjs.hash(admin.password, saltRounds);
    }
  });

  Admin.beforeUpdate(async (admin) => {
    if (admin.changed('password')) {
      const saltRounds = 10;
      admin.password = await bcryptjs.hash(admin.password, saltRounds);
    }
  });

  // Instance method to compare passwords
  Admin.prototype.comparePassword = async function(candidatePassword) {
    return await bcryptjs.compare(candidatePassword, this.password);
  };

  // Static methods
  Admin.findByUsername = async function(username) {
    return await this.findOne({
      where: { username }
    });
  };

  Admin.findByEmail = async function(email) {
    return await this.findOne({
      where: { email }
    });
  };

  Admin.getActiveAdmins = async function() {
    return await this.findAll({
      where: { is_active: true },
      order: [['created_at', 'DESC']]
    });
  };

  return Admin;
};
