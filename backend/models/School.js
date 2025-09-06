import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const School = sequelize.define('School', {
    school_id: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    region: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    children_served: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'schools',
    timestamps: false
  });

  // Instance methods
  School.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Static methods
  School.getAllSchools = async function() {
    return await this.findAll({
      order: [['created_at', 'DESC']]
    });
  };

  School.getSchoolById = async function(schoolId) {
    return await this.findByPk(schoolId);
  };

  School.getSchoolsByRegion = async function(region) {
    return await this.findAll({
      where: { region },
      order: [['name', 'ASC']]
    });
  };

  return School;
};
