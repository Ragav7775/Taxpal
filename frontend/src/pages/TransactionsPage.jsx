import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DeleteTransactionData, getAllTransactions } from "../api/TransactionApi";
import { FetchUserCategoryData } from "../api/SettingsApi";
import TransactionList from "../Components/transactions/TransactionList";
import EditTransactionModal from "../Components/ui/transactions/EditTransactionModal";
import DeleteConfirmationDialogBox from "../Components/ui/dialog-box/DeleteConfirmationDialogBox";



export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [deletingTransaction, setDeletingTransaction] = useState(null);
    const [categories, setCategories] = useState({ INCOME: [], EXPENSE: [] });
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Fetch all transactions
    const loadTransactions = async () => {
        setLoading(true);
        try {
            const data = await getAllTransactions();
            setTransactions(data || []);
        } catch (err) {
            console.error("❌ Failed to fetch transactions:", err);
            toast.error("Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories
    const loadCategories = async () => {
        setLoadingCategories(true);
        try {
            const data = await FetchUserCategoryData();
            setCategories({
                INCOME: data.incomeCategories.map(c => ({ value: c.category_name, label: c.category_name })),
                EXPENSE: data.expenseCategories.map(c => ({ value: c.category_name, label: c.category_name }))
            });
        } catch (error) {
            toast.error("Failed to fetch categories!");
            console.error("Failed to fetch categories:", error);
            setCategories({ INCOME: [], EXPENSE: [] });
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        loadTransactions();
        loadCategories();
    }, []);

  // Delete transaction
    const handleDeleteTransaction = async (transactionId) => {
        try {
            await DeleteTransactionData(transactionId);
            toast.success("Transaction deleted successfully");
            loadTransactions();
        } catch (err) {
            console.error("❌ Delete transaction error:", err);
            toast.error(err?.message || "Failed to delete transaction");
        } finally {
            setDeletingTransaction(null);
        }
    };

    return (
        <div className="p-8 mb-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl mb-2 text-black font-extrabold">
                    All Transactions
                </h1>
                <p className="text-base text-black mb-8 font-medium">
                    View, search, and filter your entire transaction history.
                </p>
            </div>

            {/* Transaction List */}
            <TransactionList
                transactions={transactions}
                loading={loading}
                onEdit={(transaction) => setEditingTransaction(transaction)}
                onDelete={(transaction) => setDeletingTransaction(transaction)}
            />

            {/* Edit Transaction Modal */}
            {editingTransaction && (
                <EditTransactionModal
                    transaction={editingTransaction}
                    categories={loadingCategories ? [] : categories}
                    onClose={() => setEditingTransaction(null)}
                    onSuccess={loadTransactions}
                />
            )}

            {/* Delete Transaction Confirmation */}
            {deletingTransaction && (
                <DeleteConfirmationDialogBox
                    title="Delete Transaction"
                    message="Are you sure you want to permanently delete this transaction? This action cannot be undone."
                    resourceName={deletingTransaction.description || "Transaction"}
                    onDelete={() => handleDeleteTransaction(deletingTransaction._id)}
                    onClose={() => setDeletingTransaction(null)}
                    onSuccess={loadTransactions}
                />
            )}
        </div>
    );
};
