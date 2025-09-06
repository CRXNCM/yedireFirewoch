import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const UrgentMessage = sequelize.define('UrgentMessage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    urgency_level: {
      type: DataTypes.ENUM('Urgent', 'Important', 'Normal'),
      allowNull: false,
      defaultValue: 'Normal'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'inactive'
    },
    action_link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    action_text: {
      type: DataTypes.STRING(100),
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
    tableName: 'urgent_messages',
    timestamps: false
  });

  // Instance methods
  UrgentMessage.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Static methods
  UrgentMessage.getActiveMessages = async function() {
    return await this.findAll({
      where: { status: 'active' },
      order: [
        ['urgency_level', 'ASC'], // Urgent first, then Important, then Normal
        ['created_at', 'DESC']
      ]
    });
  };

  UrgentMessage.getMessageById = async function(messageId) {
    return await this.findByPk(messageId);
  };

  UrgentMessage.getUrgentMessages = async function() {
    return await this.findAll({
      where: { 
        status: 'active',
        urgency_level: 'Urgent'
      },
      order: [['created_at', 'DESC']]
    });
  };

  return UrgentMessage;
};
