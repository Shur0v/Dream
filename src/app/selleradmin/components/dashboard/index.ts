/**
 * Dashboard Components Export
 * 
 * @description Centralized export for all dashboard components
 * Maintains proper component hierarchy:
 * - Layer 1: DashboardLayout (Parent)
 * - Layer 2: Sidebar, DashboardHeader, DashboardContent
 * - Layer 3: WelcomeSection, StatsCards, RecentCustomerInfoTable
 */

export { DashboardLayout, default as DashboardLayoutDefault } from './DashboardLayout';
export { Sidebar, default as SidebarDefault } from './Sidebar';
export { DashboardHeader, default as DashboardHeaderDefault } from './DashboardHeader';
export { WelcomeSection, default as WelcomeSectionDefault } from './WelcomeSection';
export { StatsCard, default as StatsCardDefault } from './StatsCard';
export { StatsCards, default as StatsCardsDefault } from './StatsCards';
export { RecentCustomerInfoTable, default as RecentCustomerInfoTableDefault } from './RecentCustomerInfoTable';

