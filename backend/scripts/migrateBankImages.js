import { models, sequelize } from '../utils/sequelize.js';

const Bank = models.Bank;

async function migrateBankImages() {
  try {
    console.log('Starting bank image migration...');
    
    // Add new columns if they don't exist
    await sequelize.query(`
      ALTER TABLE bank_info 
      ADD COLUMN IF NOT EXISTS image_path VARCHAR(255),
      ADD COLUMN IF NOT EXISTS image_url VARCHAR(255)
    `);
    
    console.log('Added new image columns to bank_info table');
    
    // Get all banks with existing bank_image
    const banks = await Bank.findAll({
      where: {
        bank_image: {
          [sequelize.Sequelize.Op.ne]: null
        }
      }
    });
    
    console.log(`Found ${banks.length} banks with existing images`);
    
    // Migrate existing bank_image to new fields
    for (const bank of banks) {
      if (bank.bank_image) {
        // If it's a Supabase URL, extract the filename
        let imagePath = bank.bank_image;
        let imageUrl = null;
        
        if (bank.bank_image.includes('supabase.co')) {
          // Extract filename from Supabase URL
          const filename = bank.bank_image.split('/').pop();
          imagePath = `banks/${filename}`;
          imageUrl = `/uploads/banks/${filename}`;
        } else if (bank.bank_image.startsWith('/uploads/')) {
          // Already a proper path
          imagePath = bank.bank_image.replace('/uploads/', '');
          imageUrl = bank.bank_image;
        } else if (!bank.bank_image.startsWith('http')) {
          // Relative path, make it proper
          imagePath = bank.bank_image.startsWith('banks/') ? bank.bank_image : `banks/${bank.bank_image}`;
          imageUrl = `/uploads/${imagePath}`;
        }
        
        // Update the bank with new fields
        await bank.update({
          image_path: imagePath,
          image_url: imageUrl
        });
        
        console.log(`Migrated bank: ${bank.bank_name} - ${imagePath}`);
      }
    }
    
    console.log('Bank image migration completed successfully!');
    
  } catch (error) {
    console.error('Error during bank image migration:', error);
  } finally {
    await sequelize.close();
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateBankImages();
}

export default migrateBankImages;
