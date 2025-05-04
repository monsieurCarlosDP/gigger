import { useQuery } from "@tanstack/react-query";
import { dashboardQueryKeysFactory } from "./dashboardQueryKeysFactory";
import { useServiceContext } from "@/src/context/service-context";

export const useDashboardService = () => {
    const { dashboardService } = useServiceContext();
        const {
            isLoading: isLoadingDashboard,
            data: dashboardData,
            error: dashboardError
        } = useQuery(dashboardQueryKeysFactory.getDashboard(dashboardService));
        
        return {isLoadingDashboard, dashboardData, dashboardError}



}