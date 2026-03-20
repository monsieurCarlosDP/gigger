export default {
  async beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    validateBudgetAccepted(event.params.data);
    handleCancelledDate(event.params.data);
    await assignBudgetNumbers(event.params.data);
  },

  async beforeUpdate(event: { params: { data: Record<string, unknown> } }) {
    validateBudgetAccepted(event.params.data);
    handleCancelledDate(event.params.data);
    await assignBudgetNumbers(event.params.data);
  },
};

function handleCancelledDate(data: Record<string, unknown>) {
  if (!('Status' in data)) return;
  if (data.Status === 'Cancelled') {
    if (!data.CancelledDate) {
      data.CancelledDate = new Date().toISOString().split('T')[0];
    }
  } else {
    data.CancelledDate = null;
  }
}

interface BudgetEntry {
  BudgetNumber?: string | null;
  [key: string]: unknown;
}

async function assignBudgetNumbers(data: Record<string, unknown>) {
  const budget = data?.Budget;
  if (!Array.isArray(budget) || budget.length === 0) return;

  const newBudgets = (budget as BudgetEntry[]).filter((b) => !b.BudgetNumber);
  if (newBudgets.length === 0) return;

  // Read current counter from Info single type
  const info = await strapi.documents('api::info.info').findFirst();
  if (!info) return; // Si no existe info, no actualizar contador

  let counter = Number(info.BudgetCounter) || 0;

  // Assign numbers to new budgets
  for (const b of newBudgets) {
    counter += 1;
    b.BudgetNumber = String(counter);
  }

  // Update counter
  await strapi.documents('api::info.info').update({
    documentId: info.documentId,
    data: { BudgetCounter: counter } as Record<string, unknown>,
  });
}

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
