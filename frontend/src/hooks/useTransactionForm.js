import { useState, useCallback } from "react";
import { useBudget } from "../context/BudgetContext";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  KEYWORD_MAPPINGS,
} from "../constants";

const INITIAL_FORM_DATA = {
  description: "",
  amount: "",
  category: "Food",
  type: "expense",
  date: new Date().toISOString().split("T")[0],
};

/**
 * Manages the add-transaction form: state, keyword auto-detection, submission, and reset.
 */
export function useTransactionForm(onClose) {
  const { addTransaction } = useBudget();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const currentCategories =
    formData.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const resetForm = useCallback(() => {
    setFormData({
      ...INITIAL_FORM_DATA,
      date: new Date().toISOString().split("T")[0],
    });
  }, []);

  const handleFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleTypeChange = useCallback((type) => {
    const defaultCategory =
      type === "expense" ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0];
    setFormData((prev) => ({ ...prev, type, category: defaultCategory }));
  }, []);

  const handleDescriptionChange = useCallback(
    (desc) => {
      const descLower = desc.toLowerCase();
      let suggestedCategory = formData.category;
      const mappings = KEYWORD_MAPPINGS[formData.type];

      if (mappings) {
        for (const [category, keywords] of Object.entries(mappings)) {
          if (keywords.some((keyword) => descLower.includes(keyword))) {
            suggestedCategory = category;
            break;
          }
        }
      }

      setFormData((prev) => ({
        ...prev,
        description: desc,
        category: suggestedCategory,
      }));
    },
    [formData.type, formData.category]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      addTransaction(formData);
      onClose();
      resetForm();
    },
    [formData, addTransaction, onClose, resetForm]
  );

  return {
    formData,
    currentCategories,
    handleFieldChange,
    handleTypeChange,
    handleDescriptionChange,
    handleSubmit,
    resetForm,
  };
}
