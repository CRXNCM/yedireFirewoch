// Mock data for bank accounts
const mockBanks = [
  {
    id: 1,
    bankName: 'Equity Bank',
    accountNumber: '1234567890',
    holderName: 'John Doe',
    balance: 50000.00,
    currency: 'KSH'
  },
  {
    id: 2,
    bankName: 'KCB Bank',
    accountNumber: '9876543210',
    holderName: 'Jane Smith',
    balance: 125000.50,
    currency: 'KSH'
  },
  {
    id: 3,
    bankName: 'Cooperative Bank',
    accountNumber: '4567890123',
    holderName: 'Alice Johnson',
    balance: 75000.75,
    currency: 'KSH'
  }
];

// Simulate API calls with timeouts
const simulateApiCall = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 500);
  });
};

export const getBanks = async () => {
  return simulateApiCall([...mockBanks]);
};

export const getBankById = async (id) => {
  const bank = mockBanks.find(bank => bank.id === id);
  return simulateApiCall(bank ? { ...bank } : null);
};

export const createBank = async (bankData) => {
  const newBank = {
    id: Math.max(...mockBanks.map(b => b.id), 0) + 1,
    ...bankData,
    balance: 0,
    currency: 'KSH'
  };
  mockBanks.push(newBank);
  return simulateApiCall({ ...newBank });
};

export const updateBank = async (id, bankData) => {
  const index = mockBanks.findIndex(bank => bank.id === id);
  if (index === -1) {
    throw new Error('Bank not found');
  }
  
  const updatedBank = {
    ...mockBanks[index],
    ...bankData,
    id // Ensure ID remains the same
  };
  
  mockBanks[index] = updatedBank;
  return simulateApiCall({ ...updatedBank });
};

export const deleteBank = async (id) => {
  const index = mockBanks.findIndex(bank => bank.id === id);
  if (index === -1) {
    throw new Error('Bank not found');
  }
  
  const [deletedBank] = mockBanks.splice(index, 1);
  return simulateApiCall({ ...deletedBank });
};

export const searchBanks = async (query) => {
  if (!query) return getBanks();
  
  const lowerQuery = query.toLowerCase();
  const filteredBanks = mockBanks.filter(bank => 
    bank.bankName.toLowerCase().includes(lowerQuery) ||
    bank.accountNumber.includes(query) ||
    bank.holderName.toLowerCase().includes(lowerQuery)
  );
  
  return simulateApiCall([...filteredBanks]);
};
