import { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { getBanks, deleteBank, searchBanks } from '../../services/bankService';
import BankForm from './BankForm';
import Table from '../../components/Table';

const BankList = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBanks = async (query = '') => {
    try {
      setLoading(true);
      const data = await (query ? searchBanks(query) : getBanks());
      setBanks(data);
    } catch (error) {
      console.error('Error fetching banks:', error);
      toast.error('Failed to load banks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks(searchQuery);
  }, [searchQuery]);

  const handleAddClick = () => {
    setSelectedBank(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (bank) => {
    setSelectedBank(bank);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bank account?')) {
      try {
        await deleteBank(id);
        toast.success('Bank account deleted successfully');
        fetchBanks(searchQuery);
      } catch (error) {
        console.error('Error deleting bank:', error);
        toast.error('Failed to delete bank account');
      }
    }
  };

  const handleFormSubmit = () => {
    setIsModalOpen(false);
    fetchBanks(searchQuery);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bank Accounts</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Bank
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search banks..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <Table
          columns={[
            { header: 'Bank Name', accessor: 'bankName' },
            { header: 'Account Number', accessor: 'accountNumber' },
            { header: 'Holder Name', accessor: 'holderName' },
            {
              header: 'Balance',
              accessor: 'balance',
              render: (bank) => (
                new Intl.NumberFormat('en-KE', {
                  style: 'currency',
                  currency: bank.currency || 'KES',
                }).format(bank.balance)
              )
            }
          ]}
          data={banks}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={(bank) => handleDelete(bank.id)}
          emptyMessage="No bank accounts found"
        />
      </div>

      <BankForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bank={selectedBank}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default BankList;
