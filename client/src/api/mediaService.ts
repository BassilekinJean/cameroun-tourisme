import supabase from './supabaseClient';

const BUCKET_UTILISATEUR = 'utilisateur_image';
const BUCKET_ETABLISSEMENT = 'etablissement_image';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const validateImage = (file: File) => {
  if (!file) throw new Error('Aucun fichier fourni');
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Type de fichier non supporté');
  if (file.size > MAX_FILE_SIZE) throw new Error('Fichier trop volumineux (max 5MB)');
};

const uploadToSupabase = async (file: File, bucket: string, filename: string): Promise<string> => {
  validateImage(file);

  if (!filename) {
    const fileExt = file.name.split('.').pop();
    filename = `${crypto.randomUUID()}.${fileExt}`;
  }

  if (!supabase) throw new Error('Supabase client non initialisé');

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, file, { upsert: true });

  if (error) {
    console.error('Erreur lors de l\'upload:', error);
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);

  if (!publicUrlData?.publicUrl) {
    throw new Error('Impossible de récupérer l\'URL publique');
  }

  return publicUrlData.publicUrl;
};

export const mediaService = {
  uploadUserPhoto: async (file: File, userId: string): Promise<string> => {
    validateImage(file);
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    return uploadToSupabase(file, BUCKET_UTILISATEUR, fileName);
  },

  uploadEtablissementImage: async (file: File, etablissementId: string): Promise<string> => {
    validateImage(file);
    const fileExt = file.name.split('.').pop();
    const fileName = `${etablissementId}_${Date.now()}.${fileExt}`;
    return uploadToSupabase(file, BUCKET_ETABLISSEMENT, fileName);
  }
};