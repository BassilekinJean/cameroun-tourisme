import React, { useState, useEffect } from 'react';
import {
  Search,
  Trash2,
  Edit2,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  X,
  MapPin,
  Hotel,
  UtensilsCrossed,
  Building2,
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  getAllEtablissementsAdmin,
  createEtablissement,
  updateEtablissement,
  deleteEtablissement,
} from '../../api/adminService';
import type { EtablissementListItem, TypeLieu, AdminCreateEtablissementData, AdminUpdateEtablissementData } from '../../api/types';
import { VILLES_CAMEROUN } from '../../api/types';

export default function EtablissementManagement() {
  const [etablissements, setEtablissements] = useState<EtablissementListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedEtablissement, setSelectedEtablissement] = useState<EtablissementListItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const pageSize = 10;

  useEffect(() => {
    loadEtablissements();
  }, [currentPage, searchQuery]);

  const loadEtablissements = async () => {
    setLoading(true);
    const response = await getAllEtablissementsAdmin(currentPage, pageSize, 'createdAt', 'desc', searchQuery || undefined);
    if (response.success && response.data) {
      setEtablissements(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    loadEtablissements();
  };

  const handleCreate = async (data: AdminCreateEtablissementData) => {
    setActionLoading(true);
    const response = await createEtablissement(data);
    setActionLoading(false);

    if (response.success) {
      showMessage('success', 'Établissement créé avec succès');
      setIsCreateModalOpen(false);
      loadEtablissements();
    } else {
      showMessage('error', response.message || 'Erreur lors de la création');
    }
  };

  const handleEdit = async (data: AdminUpdateEtablissementData) => {
    if (!selectedEtablissement) return;
    
    setActionLoading(true);
    const response = await updateEtablissement(selectedEtablissement.publicId, data);
    setActionLoading(false);

    if (response.success) {
      showMessage('success', 'Établissement mis à jour');
      setIsEditModalOpen(false);
      loadEtablissements();
    } else {
      showMessage('error', response.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    if (!selectedEtablissement) return;
    
    setActionLoading(true);
    const response = await deleteEtablissement(selectedEtablissement.publicId);
    setActionLoading(false);

    if (response.success) {
      showMessage('success', 'Établissement supprimé');
      setIsDeleteModalOpen(false);
      loadEtablissements();
    } else {
      showMessage('error', response.message || 'Erreur lors de la suppression');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const getCategorieIcon = (categorie: TypeLieu) => {
    switch (categorie) {
      case 'HOTEL':
        return <Hotel className="h-4 w-4" />;
      case 'RESTAURATION':
        return <UtensilsCrossed className="h-4 w-4" />;
      case 'SITE_TOURISTIQUE':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getCategorieBadgeColor = (categorie: TypeLieu) => {
    switch (categorie) {
      case 'HOTEL':
        return 'bg-blue-100 text-blue-800';
      case 'RESTAURATION':
        return 'bg-orange-100 text-orange-800';
      case 'SITE_TOURISTIQUE':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategorieLabel = (categorie: TypeLieu) => {
    switch (categorie) {
      case 'HOTEL':
        return 'Hôtel';
      case 'RESTAURATION':
        return 'Restaurant';
      case 'SITE_TOURISTIQUE':
        return 'Site touristique';
      default:
        return categorie;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des établissements</h2>
          <p className="text-gray-600 mt-1">{totalElements} établissement(s) au total</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un lieu
        </Button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          {message.text}
        </div>
      )}

      {/* Search */}
      <Card>
        <CardContent className="py-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par nom, ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Rechercher</Button>
          </form>
        </CardContent>
      </Card>

      {/* Etablissements Grid */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">Chargement...</div>
      ) : etablissements.length === 0 ? (
        <div className="p-8 text-center text-gray-500">Aucun établissement trouvé</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {etablissements.map((etab) => (
            <Card key={etab.publicId} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40 bg-gray-200">
                {etab.photoProfile || (etab.images && etab.images[0]) ? (
                  <img
                    src={etab.photoProfile || etab.images?.[0]}
                    alt={etab.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getCategorieIcon(etab.categorie)}
                  </div>
                )}
                <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${getCategorieBadgeColor(etab.categorie)}`}>
                  {getCategorieLabel(etab.categorie)}
                </span>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{etab.nom}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {etab.ville}
                </p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{etab.description}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    {etab.nombreFavoris || 0} favoris
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEtablissement(etab);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEtablissement(etab);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {currentPage + 1} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <EtablissementFormModal
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreate}
          loading={actionLoading}
          mode="create"
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedEtablissement && (
        <EtablissementFormModal
          etablissement={selectedEtablissement}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEdit}
          loading={actionLoading}
          mode="edit"
        />
      )}

      {/* Delete Confirmation */}
      {isDeleteModalOpen && selectedEtablissement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer <strong>{selectedEtablissement.nom}</strong> ? 
              Cette action supprimera également tous les avis associés.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
                {actionLoading ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface EtablissementFormModalProps {
  etablissement?: EtablissementListItem;
  onClose: () => void;
  onSave: (data: any) => void;
  loading: boolean;
  mode: 'create' | 'edit';
}

function EtablissementFormModal({ etablissement, onClose, onSave, loading, mode }: EtablissementFormModalProps) {
  const [formData, setFormData] = useState({
    nom: etablissement?.nom || '',
    description: etablissement?.description || '',
    email: '',
    password: '',
    telephone: '',
    photoProfile: etablissement?.photoProfile || '',
    adresse: '',
    ville: etablissement?.ville || '',
    images: etablissement?.images?.join(', ') || '',
    categorie: etablissement?.categorie || 'SITE_TOURISTIQUE' as TypeLieu,
    latitude: '',
    longitude: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
    };

    if (mode === 'edit') {
      // Don't send email/password for edit
      const { email, password, ...editData } = data;
      onSave(editData);
    } else {
      onSave(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            {mode === 'create' ? 'Ajouter un établissement' : 'Modifier l\'établissement'}
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <Input
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select
                value={formData.categorie}
                onChange={(e) => setFormData({ ...formData, categorie: e.target.value as TypeLieu })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="HOTEL">Hôtel</option>
                <option value="RESTAURATION">Restaurant</option>
                <option value="SITE_TOURISTIQUE">Site touristique</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {mode === 'create' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone {mode === 'create' && '*'}</label>
              <Input
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                required={mode === 'create'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville {mode === 'create' && '*'}</label>
              <select
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                required={mode === 'create'}
              >
                <option value="">Sélectionner une ville</option>
                {VILLES_CAMEROUN.map((ville) => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <Input
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo de profil (URL)</label>
            <Input
              value={formData.photoProfile}
              onChange={(e) => setFormData({ ...formData, photoProfile: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images (URLs séparées par des virgules) {mode === 'create' && '*'}
            </label>
            <textarea
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              placeholder="https://image1.jpg, https://image2.jpg"
              required={mode === 'create'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <Input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="Ex: 3.8480"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <Input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="Ex: 11.5021"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Enregistrement...' : mode === 'create' ? 'Créer' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
