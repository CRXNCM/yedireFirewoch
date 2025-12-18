import { useState, useEffect } from 'react';
import { createBank, updateBank } from '../../services/bankService';
import { toast } from 'react-hot-toast';
import Modal from '../../components/Modal';

const BankForm = ({ isOpen, onClose, bank: selectedBank, onSubmit }) => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    holderName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedBank) {
      setFormData({
        bankName: selectedBank.bankName || '',
        accountNumber: selectedBank.accountNumber || '',
        holderName: selectedBank.holderName || '',
      });
    } else {
      setFormData({
        bankName: '',
        accountNumber: '',
        holderName: '',
      });
    }
  }, [selectedBank]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedBank) {
        await updateBank(selectedBank.id, formData);
        toast.success('Bank account updated successfully');
      } else {
        await createBank(formData);
        toast.success('Bank account created successfully');
      }
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Error saving bank:', error);
      toast.error(`Failed to ${selectedBank ? 'update' : 'create'} bank account`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedBank ? 'Edit Bank Account' : 'Add New Bank Account'}
    >
      <div className="mt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bankName"
              id="bankName"
              required
              value={formData.bankName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g. Equity Bank"
            />
          </div>
          
          <div>
            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="accountNumber"
              id="accountNumber"
              required
              value={formData.accountNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g. 1234567890"
            />
          </div>
          
          <div>
            <label htmlFor="holderName" className="block text-sm font-medium text-gray-700">
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="holderName"
              id="holderName"
              required
              value={formData.holderName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g. John Doe"
            />
          </div>
          
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default BankForm;
