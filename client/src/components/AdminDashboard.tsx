import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  Hotel,
  UtensilsCrossed,
  MapPin,
  TrendingUp,
  Menu,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { getAdminStats } from '../api/adminService';
import type { AdminStats, User } from '../api/types';
import UserManagement from './admin/UserManagement';
import EtablissementManagement from './admin/EtablissementManagement';
import AvisManagement from './admin/AvisManagement';

interface AdminDashboardProps {
  currentUser: User;
  onBack: () => void;
}

type AdminSection = 'overview' | 'users' | 'etablissements' | 'avis' | 'settings';

export default function AdminDashboard({ currentUser, onBack }: AdminDashboardProps) {
  const [currentSection, setCurrentSection] = useState<AdminSection>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const response = await getAdminStats();
    if (response.success && response.data) {
      setStats(response.data);
    }
    setLoading(false);
  };

  const navigation = [
    { id: 'overview' as AdminSection, name: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'users' as AdminSection, name: 'Utilisateurs', icon: Users },
    { id: 'etablissements' as AdminSection, name: 'Établissements', icon: Building2 },
    { id: 'avis' as AdminSection, name: 'Avis', icon: MessageSquare },
    { id: 'settings' as AdminSection, name: 'Paramètres', icon: Settings },
  ];

  const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: React.ElementType; color: string }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{loading ? '...' : value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h2>
        <p className="text-gray-600 mt-1">Statistiques globales de la plateforme</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Utilisateurs"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="text-blue-500"
        />
        <StatCard
          title="Établissements"
          value={stats?.totalEtablissements || 0}
          icon={Building2}
          color="text-green-500"
        />
        <StatCard
          title="Avis"
          value={stats?.totalAvis || 0}
          icon={MessageSquare}
          color="text-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Hôtels"
          value={stats?.totalHotels || 0}
          icon={Hotel}
          color="text-orange-500"
        />
        <StatCard
          title="Restaurants"
          value={stats?.totalRestaurants || 0}
          icon={UtensilsCrossed}
          color="text-red-500"
        />
        <StatCard
          title="Sites touristiques"
          value={stats?.totalSitesTouristiques || 0}
          icon={MapPin}
          color="text-teal-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setCurrentSection('users')}
            >
              <Users className="mr-2 h-4 w-4" />
              Gérer les utilisateurs
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setCurrentSection('etablissements')}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Ajouter un établissement
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setCurrentSection('avis')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Modérer les avis
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Ajouter un lieu</h4>
              <p className="text-sm text-blue-700 mt-1">
                Pour ajouter un nouveau lieu touristique, utilisez la section "Établissements" 
                et cliquez sur "Ajouter".
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <h4 className="font-medium text-amber-900">Modération</h4>
              <p className="text-sm text-amber-700 mt-1">
                Consultez régulièrement les avis pour maintenir la qualité du contenu.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'overview':
        return renderOverview();
      case 'users':
        return <UserManagement />;
      case 'etablissements':
        return <EtablissementManagement />;
      case 'avis':
        return <AvisManagement />;
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
            <Card>
              <CardContent className="py-6">
                <p className="text-gray-600">Les paramètres seront disponibles prochainement.</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <h1 className="font-semibold text-lg">Administration</h1>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            lg:transform-none
          `}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <Button variant="ghost" size="sm" onClick={onBack} className="hidden lg:flex">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">{currentUser.nomComplet}</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                    ${currentSection === item.id
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Connecté en tant qu'administrateur</p>
                <p className="text-sm font-medium text-gray-700 truncate">{currentUser.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
