/**
 * Types TypeScript - Cohérents avec le Backend Java
 * Ces interfaces reflètent exactement les DTOs et entités du serveur
 */

// ==================== ENUMS ====================

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  ETABLISSEMENT = 'ETABLISSEMENT',
}

export enum TypeLieu {
  RESTAURATION = 'RESTAURATION',
  HOTEL = 'HOTEL',
  SITE_TOURISTIQUE = 'SITE_TOURISTIQUE',
}

// ==================== VOYAGEUR (USER) ====================

/**
 * Correspond à VoyageurResponse du backend (HATEOAS)
 */
export interface User {
  id: string; // UUID (publicId)
  nomComplet: string;
  email: string;
  paysOrigine?: string;
  photoProfile?: string;
  favorisIds: string[]; // Set<UUID> d'établissements
  role?: Role;
}

/**
 * Correspond à UtilisateurDto du backend
 */
export interface UtilisateurDto {
  publicId: string;
  nomComplet: string;
  email: string;
  paysOrigine: string;
  photoProfile?: string;
  favorisIds: string[];
}

/**
 * Correspond à UtilisateurRegistrationDto du backend
 */
export interface UserRegistrationData {
  nomComplet: string;
  email: string;
  paysOrigine?: string;
  photoProfile?: string;
  password: string;
  validatePassword: string;
}

/**
 * Correspond à UtilisateurLoginDto du backend
 */
export interface UserLoginData {
  email: string;
  password: string;
}

/**
 * Pour la mise à jour du profil - correspond à UtilisateurDto du backend
 */
export interface UserUpdateData {
  publicId?: string;
  nomComplet: string;
  email: string;
  paysOrigine: string;
  photoProfile?: string;
  favorisIds?: string[];
}

// ==================== ETABLISSEMENT ====================

/**
 * Localisation GPS pour Google Maps
 */
export interface Localisation {
  latitude: number;
  longitude: number;
}

/**
 * Correspond à l'entité Etablissement du backend
 */
export interface Etablissement {
  id: number;
  publicId: string; // UUID
  nom: string;
  description: string;
  email: string;
  telephone: string;
  photoProfile?: string;
  adresse?: string;
  ville: string;
  images: string[];
  categorie: TypeLieu;
  nombreAvis: number;
  dateInscription: string;
  // Localisation GPS
  latitude?: number;
  longitude?: number;
  // Champs calculés/additionnels pour le frontend
  rating?: number;
  price?: string;
  amenities?: string[];
  openingHours?: string;
  website?: string;
}

/**
 * Correspond à LieuRegistrationDto du backend
 */
export interface EtablissementRegistrationData {
  nom: string;
  description: string;
  email: string;
  password: string;
  validatePassword: string;
  telephone: string;
  photoProfile?: string;
  adresse?: string;
  ville: string;
  images: string[];
  categorie: TypeLieu;
  latitude?: number;
  longitude?: number;
}

/**
 * DTO simplifié pour affichage en liste
 */
export interface EtablissementListItem {
  publicId: string;
  nom: string;
  description: string;
  ville: string;
  photoProfile?: string;
  images?: string[];
  categorie: TypeLieu;
  nombreFavoris: number;
  nombreAvis: number;
  rating?: number;
}

// ==================== AVIS ====================

/**
 * Correspond à AvisDto du backend (HATEOAS)
 */
export interface Avis {
  publicId: string; // UUID
  message: string;
  auteurPhoto?: string;
  auteurName: string;
  dateCreation: string; // LocalDate ISO
  nombreFavoris: number;
  note: number; // 1-5
}

/**
 * Correspond à AvisCreationDto du backend
 */
export interface AvisCreationData {
  message: string;
  note: number; // 1-5
}

/**
 * Pour la mise à jour d'un avis
 */
export interface AvisUpdateData {
  message: string;
  note: number;
}

// ==================== MEDIA ====================

/**
 * Pour l'upload de photos
 */
export interface MediaUploadResponse {
  publicId: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

// ==================== PAGINATION ====================

/**
 * Correspond à Page<T> de Spring Data
 */
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}

// ==================== RECHERCHE ====================

export interface SearchParams {
  query?: string;
  categorie?: TypeLieu;
  ville?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface SearchResult {
  etablissements: EtablissementListItem[];
  totalResults: number;
  page: number;
  totalPages: number;
}

// ==================== RESERVATIONS (À implémenter) ====================

export enum ReservationType {
  HOTEL = 'HOTEL',
  RESTAURANT = 'RESTAURANT',
  ACTIVITY = 'ACTIVITY',
}

export interface ReservationBase {
  id?: string;
  etablissementId: string;
  etablissementNom?: string;
  voyageurId?: string;
  type: ReservationType;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  dateReservation?: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface HotelReservation extends ReservationBase {
  type: ReservationType.HOTEL;
  checkIn: string;
  checkOut: string;
  roomType: 'standard' | 'deluxe' | 'suite' | 'presidential';
  numberOfRooms: number;
  numberOfGuests: number;
}

export interface RestaurantReservation extends ReservationBase {
  type: ReservationType.RESTAURANT;
  date: string;
  time: string;
  numberOfGuests: number;
  specialRequests?: string;
}

export interface ActivityReservation extends ReservationBase {
  type: ReservationType.ACTIVITY;
  date: string;
  numberOfParticipants: number;
  timeSlot: 'morning' | 'afternoon' | 'evening';
}

export type Reservation = HotelReservation | RestaurantReservation | ActivityReservation;

// ==================== CONSEILS / TIPS ====================

export interface Tip {
  id: string;
  placeId: string;
  placeName: string;
  placeType: string;
  category: 'budget' | 'timing' | 'crowd' | 'general';
  content: string;
  userId: string;
  userName: string;
  date: string;
  helpful: number;
}

// ==================== RÉPONSES API ====================

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

// ==================== CONSTANTES ====================

export const REGIONS_CAMEROUN = [
  'Adamaoua',
  'Centre',
  'Est',
  'Extrême-Nord',
  'Littoral',
  'Nord',
  'Nord-Ouest',
  'Ouest',
  'Sud',
  'Sud-Ouest',
] as const;

export const VILLES_CAMEROUN = [
  'Yaoundé',
  'Douala',
  'Garoua',
  'Bamenda',
  'Maroua',
  'Bafoussam',
  'Ngaoundéré',
  'Bertoua',
  'Ebolowa',
  'Buea',
  'Kribi',
  'Limbé',
  'Dschang',
  'Foumban',
  'Edéa',
] as const;

export type RegionCameroun = typeof REGIONS_CAMEROUN[number];
export type VilleCameroun = typeof VILLES_CAMEROUN[number];
