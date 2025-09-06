import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Bank = sequelize.define('Bank', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    bank_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    account_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    account_number: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    routing_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    swift_code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    bank_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bank_image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    payment_link: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'bank_info',
    timestamps: false
  });

  // Instance methods
  Bank.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Static methods
  Bank.getActiveBanks = async function() {
    return await this.findAll({
      where: { is_active: true },
      order: [['last_updated', 'DESC']]
    });
  };

  Bank.getBankById = async function(bankId) {
    return await this.findByPk(bankId);
  };

  return Bank;
};
