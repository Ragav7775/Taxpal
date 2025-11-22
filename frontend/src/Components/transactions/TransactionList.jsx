import { useState, useMemo } from "react";
import Select from "react-select";
import { FormatAmount } from '../../utils/FormatAmount';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TransactionList = ({ transactions = [], onEdit, onDelete, loading = false }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const currencySymbol = localStorage.getItem("CurrencySymbol");
    const countryName = localStorage.getItem("Country");

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(transaction => {
                if (filterType === 'all') return true;
                return transaction.type.toLowerCase() === filterType;
            })
            .filter(transaction => {
                return transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
            });
    }, [transactions, searchTerm, filterType]);

    const filterOptions = [
        { value: 'all', label: 'All Types' },
        { value: 'income', label: 'Income' },
        { value: 'expense', label: 'Expense' },
    ];

    // Show loading screen
    if (loading) {
        return (
            <div className="text-center p-8 text-gray-500 text-lg">
                Loading transactions...
            </div>
        );
    }

    return (
        <>
            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by description..."
                    className="flex-grow px-4 py-3 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="min-w-[150px]">
                    <Select
                        options={filterOptions}
                        defaultValue={filterOptions[0]}
                        onChange={(selected) => setFilterType(selected.value)}
                        className="text-base"
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderRadius: '0.5rem',
                                borderColor: '#d1d5db',
                                padding: '0.25rem',
                                minHeight: '48px',
                                cursor: "pointer"
                            }),
                            option: (base) => ({ ...base, cursor: "pointer" }),
                            menu: (base) => ({ ...base, borderRadius: '0.5rem', zIndex: 20 }),
                        }}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-customShadow overflow-x-auto p-4">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="px-4 py-4 text-center border-b border-gray-200 font-semibold text-gray-800 text-sm capitalize">Date</th>
                            <th className="px-4 py-4 text-center border-b border-gray-200 font-semibold text-gray-800 text-sm capitalize">Description</th>
                            <th className="px-4 py-4 text-center border-b border-gray-200 font-semibold text-gray-800 text-sm capitalize">Category</th>
                            <th className="px-4 py-4 text-center border-b border-gray-200 font-semibold text-gray-800 text-sm capitalize">Amount</th>
                            <th className="px-4 py-4 text-center border-b border-gray-200 font-semibold text-gray-800 text-sm capitalize">Type</th>
                            <th className="px-4 py-4 text-center border-b border-gray-200 font-semibold text-gray-800 text-sm capitalize">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((tx) => (
                                <tr key={tx._id}>
                                    <td className="px-4 py-4 text-center border-t border-gray-200">{tx.date}</td>
                                    <td className="px-4 py-4 text-center border-t border-gray-200">{tx.description}</td>
                                    <td className="px-4 py-4 text-center border-t border-gray-200">{tx.category}</td>
                                    <td className="px-4 py-4 text-center border-t border-gray-200">
                                        {currencySymbol}{FormatAmount(tx.amount, countryName)}
                                    </td>
                                    <td className="px-4 py-4 text-center border-t border-gray-200">
                                        <span className={`px-3 py-1 rounded-xl font-semibold text-xs text-white ${tx.type.toLowerCase() === 'income' ? 'bg-[#54c947]' : 'bg-[#f64949]'}`}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 flex justify-around border-t text-center border-gray-200">
                                        <button onClick={() => onEdit(tx)} className="text-customBlue font-bold hover:text-blue-600 cursor-pointer">
                                            <FaEdit size={16}/>
                                        </button>
                                        <button onClick={() => onDelete(tx)} className="text-customRed font-bold hover:text-red-600 cursor-pointer">
                                            <FaTrash size={16}/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-8 text-gray-500 text-lg">
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default TransactionList;
