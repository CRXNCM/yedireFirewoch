import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Volunteer = sequelize.define('Volunteer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    join_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'volunteers',
    timestamps: false
  });

  // Instance methods
  Volunteer.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Static methods
  Volunteer.getAllVolunteers = async function() {
    return await this.findAll({
      order: [['join_date', 'DESC']]
    });
  };

  Volunteer.getVolunteerById = async function(volunteerId) {
    return await this.findByPk(volunteerId);
  };

  Volunteer.getVolunteersByEmail = async function(email) {
    return await this.findAll({
      where: { email },
      order: [['join_date', 'DESC']]
    });
  };

  // Create a new volunteer
  Volunteer.createVolunteer = async function(volunteerData) {
    return await this.create(volunteerData);
  };

  // Update a volunteer
  Volunteer.updateVolunteer = async function(id, updateData) {
    const volunteer = await this.findByPk(id);
    if (!volunteer) {
      return null;
    }
    return await volunteer.update(updateData);
  };

  // Delete a volunteer
  Volunteer.deleteVolunteer = async function(id) {
    const volunteer = await this.findByPk(id);
    if (!volunteer) {
      return null;
    }
    return await volunteer.destroy();
  };

  return Volunteer;
};
