import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import { BudgetProvider } from "../../context/BudgetContext";

/**
 * Composes all application-level providers in the correct dependency order.
 * AuthProvider must wrap BudgetProvider since BudgetContext depends on useAuth.
 */
export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <BudgetProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </BudgetProvider>
    </AuthProvider>
  );
}
