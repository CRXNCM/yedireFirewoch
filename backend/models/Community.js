import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Community = sequelize.define('Community', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    region: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'communities',
    timestamps: false
  });

  // Instance methods
  Community.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Static methods
  Community.getAllCommunities = async function() {
    return await this.findAll({
      order: [['created_at', 'DESC']]
    });
  };

  Community.getCommunityById = async function(communityId) {
    return await this.findByPk(communityId);
  };

  Community.getCommunitiesByRegion = async function(region) {
    return await this.findAll({
      where: { region },
      order: [['name', 'ASC']]
    });
  };

  return Community;
};
