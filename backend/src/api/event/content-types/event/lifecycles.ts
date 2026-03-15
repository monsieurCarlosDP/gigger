export default {
  async beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    validateBudgetAccepted(event.params.data);
  },

  async beforeUpdate(event: { params: { data: Record<string, unknown> } }) {
    validateBudgetAccepted(event.params.data);
  },
};

function validateBudgetAccepted(data: Record<string, unknown>) {
  const budget = data?.Budget;
  if (!Array.isArray(budget) || budget.length === 0) return;

  // Buscar si hay algún budget aceptado
  const acceptedIndex = budget.findIndex(
    (item: { Accepted?: boolean }) => item.Accepted === true
  );

  // Si hay un aceptado, poner todos los demás en false
  if (acceptedIndex !== -1) {
    budget.forEach((item: Record<string, unknown>, index: number) => {
      (item as { Accepted?: boolean }).Accepted = index === acceptedIndex;
    });
  }
}
