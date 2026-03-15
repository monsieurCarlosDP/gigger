import { useSearchParams } from 'react-router-dom';

export type DrawerView = 'day' | 'event' | 'budgets';
export type EventTab = 'info' | 'logistics' | 'budget' | 'chat';

const TAB_INDEX: Record<EventTab, number> = {
  info: 0,
  logistics: 1,
  budget: 2,
  chat: 3,
};

export function useDrawerNav() {
  const [searchParams, setSearchParams] = useSearchParams();

  const drawerType = searchParams.get('drawer') as DrawerView | null;
  const openTab = (searchParams.get('openTab') as EventTab | null) ?? 'info';

  return {
    drawerType,
    drawerDate: searchParams.get('date'),
    drawerEventId: searchParams.get('id'),
    tabIndex: TAB_INDEX[openTab] ?? 0,
    openDayDrawer: (date: string) =>
      setSearchParams({ drawer: 'day', date }),
    openEventDrawer: (id: string, tab?: EventTab) => {
      const params: Record<string, string> = { drawer: 'event', id };
      if (tab) params.openTab = tab;
      setSearchParams(params);
    },
    openBudgetsDrawer: (eventId: string) =>
      setSearchParams({ drawer: 'budgets', id: eventId }),
    closeDrawer: () => setSearchParams({}),
  };
}

export function useEventTabParam() {
  const [searchParams, setSearchParams] = useSearchParams();

  const openTab = (searchParams.get('openTab') as EventTab | null) ?? 'info';
  const tabIndex = TAB_INDEX[openTab] ?? 0;

  const setTab = (index: number) => {
    const tabName = (Object.keys(TAB_INDEX) as EventTab[]).find((k) => TAB_INDEX[k] === index) ?? 'info';
    const next = new URLSearchParams(searchParams);
    if (tabName === 'info') {
      next.delete('openTab');
    } else {
      next.set('openTab', tabName);
    }
    setSearchParams(next);
  };

  return { tabIndex, tabName: openTab, setTab };
}
