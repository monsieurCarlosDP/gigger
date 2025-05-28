import {
  useQuery,
} from '@tanstack/react-query';
import { useServiceContext } from '../../../context/service-context/ServiceContext';
import dashboardQueryKeyFactory from './dashboardQueryKeysFactory';

export const useDashboard = () => {
  
  const { dashboardService } = useServiceContext();
  const {
    isLoading: isLoadingDashboard,
    data: dashboardData,
    error: dashboardError,
  } = useQuery(dashboardQueryKeyFactory.getDashboard(dashboardService));
   
  return {isLoadingDashboard, dashboardData, dashboardError}

}