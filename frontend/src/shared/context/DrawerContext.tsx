import { useSearchParams } from 'react-router-dom';

export type DrawerView = 'day' | 'event';

export function useDrawerNav() {
  const [searchParams, setSearchParams] = useSearchParams();

  const drawerType = searchParams.get('drawer') as DrawerView | null;

  return {
    drawerType,
    drawerDate: searchParams.get('date'),
    drawerEventId: searchParams.get('id'),
    openDayDrawer: (date: string) =>
      setSearchParams({ drawer: 'day', date }),
    openEventDrawer: (id: string) =>
      setSearchParams({ drawer: 'event', id }),
    closeDrawer: () => setSearchParams({}),
  };
}
