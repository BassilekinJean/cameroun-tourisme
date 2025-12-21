import React, { useState, useEffect } from 'react';
import {
  Building2,
  MessageSquare,
  Heart,
  Star,
  Edit2,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BarChart3,
  Image,
  User as UserIcon,
  Flag,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  getMyEtablissement,
  getEtablissementStats,
  updateMyEtablissement,
  getMyEtablissementAvis,
  reportAvis,
} from '../api/etablissementPanelService';
import type { User, Etablissement, Avis, EtablissementPanelStats, EtablissementUpdateData } from '../api/types';
import { mediaService } from '../api/mediaService';
import { Plus, Trash2 } from 'lucide-react';

interface EtablissementPanelProps {
  currentUser: User;
  onBack: () => void;
}

type PanelSection = 'overview' | 'edit' | 'avis';

export default function EtablissementPanel({ currentUser, onBack }: EtablissementPanelProps) {
  const [currentSection, setCurrentSection] = useState<PanelSection>('overview');
  const [etablissement, setEtablissement] = useState<Etablissement | null>(null);
  const [stats, setStats] = useState<EtablissementPanelStats | null>(null);
  const [avis, setAvis] = useState<Avis[]>([]);
  const [loading, setLoading] = useState(true);
  const [avisLoading, setAvisLoading] = useState(false);
  const [avisPage, setAvisPage] = useState(0);
  const [avisTotalPages, setAvisTotalPages] = useState(0);
  const [editLoading, setEditLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<EtablissementUpdateData>({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (currentSection === 'avis') {
      loadAvis();
    }
  }, [currentSection, avisPage]);

  const loadData = async () => {
    setLoading(true);
    
    // Load etablissement info
    const etabResponse = await getMyEtablissement();
    if (etabResponse.success && etabResponse.data) {
      setEtablissement(etabResponse.data);
      setEditFormData({
        description: etabResponse.data.description,
        telephone: etabResponse.data.telephone,
        adresse: etabResponse.data.adresse,
        photoProfile: etabResponse.data.photoProfile,
        images: etabResponse.data.images,
        latitude: etabResponse.data.latitude,
        longitude: etabResponse.data.longitude,
      });
    }

    // Load stats
    const statsResponse = await getEtablissementStats();
    if (statsResponse.success && statsResponse.data) {
      setStats(statsResponse.data);
    }

    setLoading(false);
  };

  const loadAvis = async () => {
    setAvisLoading(true);
    const response = await getMyEtablissementAvis(avisPage, 10, 'dateCreation', 'desc');
    if (response.success && response.data) {
      setAvis(response.data.content || []);
      setAvisTotalPages(response.data.totalPages || 0);
    }
    setAvisLoading(false);
  };

  const handleUpdateEtablissement = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    
    const response = await updateMyEtablissement(editFormData);
    
    if (response.success) {
      showMessage('success', 'Informations mises à jour avec succès');
      setEditMode(false);
      loadData();
    } else {
      showMessage('error', response.message || 'Erreur lors de la mise à jour');
    }
    
    setEditLoading(false);
  };

  const handleReportAvis = async (avisPublicId: string) => {
    const response = await reportAvis(avisPublicId, 'Signalé par le gestionnaire');
    if (response.success) {
      showMessage('success', 'Avis signalé pour modération');
    } else {
      showMessage('error', response.message || 'Erreur lors du signalement');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!etablissement) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucun établissement trouvé</h2>
            <p className="text-gray-600 mb-6">
              Votre compte n'est pas associé à un établissement. 
              Contactez l'administrateur pour créer votre établissement.
            </p>
            <Button onClick={onBack}>Retour à l'accueil</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const navigation = [
    { id: 'overview' as PanelSection, name: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'edit' as PanelSection, name: 'Modifier', icon: Edit2 },
    { id: 'avis' as PanelSection, name: 'Avis', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ChevronLeft className="h-5 w-5 mr-1" />
              Retour
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-emerald-600" />
              <h1 className="text-lg font-semibold">{etablissement.nom}</h1>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Connecté en tant que gestionnaire
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-4">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors
                  ${currentSection === item.id
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            {message.text}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentSection === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avis reçus</CardTitle>
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.totalAvis || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Favoris</CardTitle>
                  <Heart className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.nombreFavoris || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Note moyenne</CardTitle>
                  <Star className="h-5 w-5 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.noteMoyenne?.toFixed(1) || '-'}</div>
                </CardContent>
              </Card>
            </div>

            {/* Etablissement Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'établissement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 h-48 bg-gray-200 rounded-lg overflow-hidden">
                    {etablissement.photoProfile || (etablissement.images && etablissement.images[0]) ? (
                      <img
                        src={etablissement.photoProfile || etablissement.images?.[0]}
                        alt={etablissement.nom}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">{etablissement.ville}</p>
                        <p className="text-sm text-gray-600">{etablissement.adresse || 'Adresse non renseignée'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span>{etablissement.telephone || 'Non renseigné'}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span>{etablissement.email}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600">{etablissement.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentSection === 'edit' && (
          <Card>
            <CardHeader>
              <CardTitle>Modifier les informations</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateEtablissement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editFormData.description || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <Input
                      value={editFormData.telephone || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, telephone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                    <Input
                      value={editFormData.adresse || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, adresse: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo de profil</label>
                  <div className="flex items-center gap-4">
                    {editFormData.photoProfile && (
                      <img src={editFormData.photoProfile} alt="Preview" className="w-16 h-16 rounded-md object-cover" />
                    )}
                    <label className="cursor-pointer bg-white px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500">
                      <span>Changer la photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                             if (file.size > 5 * 1024 * 1024) {
                                showMessage('error', 'L\'image est trop volumineuse (max 5 Mo)');
                                return;
                             }
                             try {
                                setEditLoading(true);
                                const url = await mediaService.uploadEtablissementImage(file, etablissement.id);
                                setEditFormData({ ...editFormData, photoProfile: url });
                             } catch (err) {
                                showMessage('error', 'Erreur lors de l\'upload');
                             } finally {
                                setEditLoading(false);
                             }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <Input
                      type="number"
                      step="any"
                      value={editFormData.latitude || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, latitude: parseFloat(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <Input
                      type="number"
                      step="any"
                      value={editFormData.longitude || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, longitude: parseFloat(e.target.value) || undefined })}
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Galerie Photos</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      {editFormData.images?.map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                           <img src={img} alt={`Galerie ${idx}`} className="w-full h-full object-cover" />
                           <button
                              type="button"
                              onClick={() => {
                                 const newImages = [...(editFormData.images || [])];
                                 newImages.splice(idx, 1);
                                 setEditFormData({ ...editFormData, images: newImages });
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      ))}
                      <label className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 aspect-square transition-colors">
                         <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Plus className="w-8 h-8 text-gray-400" />
                            <span className="text-xs text-gray-500 mt-1">Ajouter</span>
                         </div>
                         <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={async (e) => {
                               const files = Array.from(e.target.files || []);
                               if (files.length === 0) return;
                               
                               try {
                                  setEditLoading(true);
                                  const uploadedUrls: string[] = [];
                                  
                                  for (const file of files) {
                                     if (file.size > 5 * 1024 * 1024) continue; // Skip huge files
                                     const url = await mediaService.uploadEtablissementImage(file, etablissement.id);
                                     uploadedUrls.push(url);
                                  }
                                  
                                  setEditFormData({
                                     ...editFormData,
                                     images: [...(editFormData.images || []), ...uploadedUrls]
                                  });
                               } catch (err) {
                                  showMessage('error', 'Erreur lors de l\'upload des images');
                               } finally {
                                  setEditLoading(false);
                               }
                            }}
                         />
                      </label>
                   </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-4">
                    <strong>Note:</strong> Pour modifier le nom, la catégorie ou l'email de votre établissement, 
                    veuillez contacter l'administrateur.
                  </p>
                  <Button type="submit" disabled={editLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {editLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {currentSection === 'avis' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Avis de vos clients ({stats?.totalAvis || 0})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {avisLoading ? (
                  <div className="p-8 text-center text-gray-500">Chargement...</div>
                ) : avis.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">Aucun avis pour le moment</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {avis.map((item) => (
                      <div key={item.publicId} className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              {item.auteurPhoto ? (
                                <img
                                  src={item.auteurPhoto}
                                  alt=""
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <UserIcon className="h-5 w-5 text-emerald-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{item.auteurName || 'Client'}</div>
                              <div className="flex items-center gap-2">
                                {renderStars(item.note)}
                                <span className="text-sm text-gray-500">
                                  {item.dateCreation ? new Date(item.dateCreation).toLocaleDateString('fr-FR') : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReportAvis(item.publicId)}
                            title="Signaler cet avis"
                            className="text-amber-600 hover:text-amber-800"
                          >
                            <Flag className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-gray-700">{item.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {avisTotalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Page {avisPage + 1} sur {avisTotalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAvisPage((p) => Math.max(0, p - 1))}
                    disabled={avisPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAvisPage((p) => Math.min(avisTotalPages - 1, p + 1))}
                    disabled={avisPage === avisTotalPages - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
