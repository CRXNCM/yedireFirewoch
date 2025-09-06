import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Sponsor = sequelize.define('Sponsor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo_path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    website_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'sponsors',
    timestamps: false
  });

  // Instance methods
  Sponsor.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Static methods
  Sponsor.getActiveSponsors = async function() {
    return await this.findAll({
      where: { is_active: true },
      order: [['created_at', 'DESC']]
    });
  };

  Sponsor.getSponsorById = async function(sponsorId) {
    return await this.findByPk(sponsorId);
  };

  return Sponsor;
};
