import React, { useState, useEffect } from 'react';
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Star,
  User,
  Building2,
  Calendar,
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { getAllAvisAdmin, deleteAvisAdmin, deleteAvisBatch } from '../../api/adminService';
import type { Avis } from '../../api/types';

interface AvisWithDetails extends Avis {
  auteur?: {
    publicId: string;
    nomComplet: string;
    photoProfile?: string;
  };
  lieuConcerne?: {
    publicId: string;
    nom: string;
  };
}

export default function AvisManagement() {
  const [avis, setAvis] = useState<AvisWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedAvis, setSelectedAvis] = useState<AvisWithDetails | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBatchDeleteModalOpen, setIsBatchDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const pageSize = 10;

  useEffect(() => {
    loadAvis();
  }, [currentPage, searchQuery]);

  const loadAvis = async () => {
    setLoading(true);
    const response = await getAllAvisAdmin(currentPage, pageSize, 'dateCreation', 'desc', searchQuery || undefined);
    if (response.success && response.data) {
      setAvis(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    loadAvis();
  };

  const handleDelete = async () => {
    if (!selectedAvis) return;
    
    setActionLoading(true);
    const response = await deleteAvisAdmin(selectedAvis.publicId);
    setActionLoading(false);

    if (response.success) {
      showMessage('success', 'Avis supprimé');
      setIsDeleteModalOpen(false);
      loadAvis();
    } else {
      showMessage('error', response.message || 'Erreur lors de la suppression');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    
    setActionLoading(true);
    const response = await deleteAvisBatch(selectedIds);
    setActionLoading(false);

    if (response.success) {
      showMessage('success', `${response.data?.deleted || 0} avis supprimé(s)`);
      setIsBatchDeleteModalOpen(false);
      setSelectedIds([]);
      loadAvis();
    } else {
      showMessage('error', response.message || 'Erreur lors de la suppression');
    }
  };

  const toggleSelectAvis = (avisId: string) => {
    setSelectedIds((prev) =>
      prev.includes(avisId) ? prev.filter((id) => id !== avisId) : [...prev, avisId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === avis.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(avis.map((a) => a.publicId));
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const renderStars = (note: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= note ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Modération des avis</h2>
          <p className="text-gray-600 mt-1">{totalElements} avis au total</p>
        </div>
        {selectedIds.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => setIsBatchDeleteModalOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer la sélection ({selectedIds.length})
          </Button>
        )}
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
                placeholder="Rechercher dans les avis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Rechercher</Button>
          </form>
        </CardContent>
      </Card>

      {/* Avis List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Chargement...</div>
          ) : avis.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Aucun avis trouvé</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {/* Select All */}
              <div className="px-6 py-3 bg-gray-50 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === avis.length && avis.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">Tout sélectionner</span>
              </div>

              {/* Avis Items */}
              {avis.map((item) => (
                <div
                  key={item.publicId}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    selectedIds.includes(item.publicId) ? 'bg-emerald-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.publicId)}
                      onChange={() => toggleSelectAvis(item.publicId)}
                      className="h-4 w-4 mt-1 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            {item.auteurPhoto ? (
                              <img
                                src={item.auteurPhoto}
                                alt=""
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-emerald-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.auteurName || 'Utilisateur'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Building2 className="h-3 w-3" />
                              <span>{item.lieuConcerne?.nom || 'Établissement inconnu'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {renderStars(item.note)}
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.dateCreation ? new Date(item.dateCreation).toLocaleDateString('fr-FR') : '-'}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 whitespace-pre-line">{item.message}</p>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <span className="text-sm text-gray-500">
                          {item.nombreFavoris || 0} j'aime
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAvis(item);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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

      {/* Delete Single Confirmation */}
      {isDeleteModalOpen && selectedAvis && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Supprimer l'avis</h3>
            </div>
            <p className="text-gray-600 mb-2">
              Voulez-vous vraiment supprimer cet avis ?
            </p>
            <div className="bg-gray-50 p-3 rounded-lg mb-6 text-sm text-gray-700 line-clamp-3">
              "{selectedAvis.message}"
            </div>
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

      {/* Batch Delete Confirmation */}
      {isBatchDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-semibold">Supprimer les avis sélectionnés</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Voulez-vous vraiment supprimer <strong>{selectedIds.length} avis</strong> ? 
              Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsBatchDeleteModalOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleBatchDelete} disabled={actionLoading}>
                {actionLoading ? 'Suppression...' : 'Supprimer tout'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
