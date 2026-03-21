import type { BudgetItem } from '@/features/events/hooks/useEventForm';
import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { BudgetPDFDocument } from '@/shared/components/BudgetPDFDocument';

interface EventSummary {
  Name: string;
  Location?: string;
  StartDate?: string;
  GigType?: string;
  Distance?: number | string | null;
}

export async function generateBudgetPDF(
  event: EventSummary,
  budget: BudgetItem,
  budgetIndex: number,
  dj: number,
  equipment: number,
): Promise<{ base64: string; filename: string }> {
  const doc = React.createElement(BudgetPDFDocument, {
    event,
    budget,
    budgetIndex,
    dj,
    equipment,
  });

  const blob = await pdf(doc).toBlob();

  // Convert blob to base64 using a different approach
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binaryString = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binaryString += String.fromCharCode(uint8Array[i]);
  }
  const base64 = btoa(binaryString);
  const filename = `Presupuesto-${budgetIndex + 1}-${event.Name.replace(/\s+/g, '-')}.pdf`;

  return { base64, filename };
}
