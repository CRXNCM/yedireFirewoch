import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const SchoolImage = sequelize.define('SchoolImage', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    school_id: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    image_path: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    upload_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'school_images',
    timestamps: false
  });

  SchoolImage.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  return SchoolImage;
};


