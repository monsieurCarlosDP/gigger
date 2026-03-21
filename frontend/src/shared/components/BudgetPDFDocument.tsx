import type { BudgetItem } from '@/features/events/hooks/useEventForm';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface EventSummary {
  Name: string;
  Location?: string;
  StartDate?: string;
  GigType?: string;
  Distance?: number | string | null;
}

interface BudgetPDFDocumentProps {
  event: EventSummary;
  budget: BudgetItem;
  budgetIndex: number;
  dj: number;
  equipment: number;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subheader: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  section: {
    marginBottom: 12,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: '#666',
    flex: 1,
  },
  value: {
    fontWeight: 'bold',
    textAlign: 'right',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 8,
  },
  totalRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export function BudgetPDFDocument({
  event,
  budget,
  budgetIndex,
  dj,
  equipment,
}: BudgetPDFDocumentProps) {
  const total = (budget.Base ?? 0) + (budget.Dietas ?? 0) + (budget.DJ ? dj : 0) + (budget.Equipment ? equipment : 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.header}>Presupuesto {budgetIndex + 1}</Text>
          <Text style={styles.subheader}>{event.Name}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Event info */}
        <View style={styles.section}>
          {event.StartDate && (
            <View style={styles.row}>
              <Text style={styles.label}>Fecha</Text>
              <Text style={styles.value}>
                {new Date(event.StartDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          )}
          {event.Location && (
            <View style={styles.row}>
              <Text style={styles.label}>Ubicación</Text>
              <Text style={styles.value}>{event.Location}</Text>
            </View>
          )}
          {event.Distance != null && Number(event.Distance) > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Distancia</Text>
              <Text style={styles.value}>{event.Distance} km</Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Budget breakdown */}
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Desglose</Text>

          {budget.Base != null && (
            <View style={styles.row}>
              <Text style={styles.label}>🎸 Efectivishow</Text>
              <Text style={styles.value}>{budget.Base} €</Text>
            </View>
          )}

          {budget.Dietas != null && (
            <View style={styles.row}>
              <Text style={styles.label}>🚐 Dietas y transporte</Text>
              <Text style={styles.value}>{budget.Dietas} €</Text>
            </View>
          )}

          {budget.DJ && (
            <View style={styles.row}>
              <Text style={styles.label}>🎧 EfectiviDJs</Text>
              <Text style={styles.value}>{dj} €</Text>
            </View>
          )}

          {budget.Equipment && (
            <View style={styles.row}>
              <Text style={styles.label}>🔊 Equipo</Text>
              <Text style={styles.value}>{equipment} €</Text>
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Total */}
          <View style={styles.totalRow}>
            <Text>Total</Text>
            <Text>{total} €</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
