import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Testimonial = sequelize.define('Testimonial', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: 5
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
    tableName: 'testimonials',
    timestamps: false
  });

  // Instance methods
  Testimonial.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    return values;
  };

  // Static methods
  Testimonial.getActiveTestimonials = async function() {
    return await this.findAll({
      where: { is_active: true },
      order: [['created_at', 'DESC']]
    });
  };

  Testimonial.getTestimonialById = async function(testimonialId) {
    return await this.findByPk(testimonialId);
  };

  Testimonial.getFeaturedTestimonials = async function() {
    return await this.findAll({
      where: { is_active: true, rating: 5 },
      order: [['created_at', 'DESC']],
      limit: 5
    });
  };

  return Testimonial;
};
