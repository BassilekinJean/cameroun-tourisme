-- ================================================================
-- Script SQL: Données réelles des établissements du Cameroun
-- Base de données: cameroun_tour (MySQL)
-- ================================================================

-- Suppression des anciennes données
DELETE FROM etablissement_images;
DELETE FROM etablissement;

-- Réinitialisation de l'auto-increment
ALTER TABLE etablissement AUTO_INCREMENT = 1;

-- ================================================================
-- HÔTELS DU CAMEROUN
-- ================================================================

-- 1. Hilton Yaoundé
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Hilton  de Yaoundé',
    'Le Hilton Yaoundé est un hôtel 5 étoiles situé au cœur de la capitale camerounaise. Cet établissement de luxe offre une vue panoramique sur la ville, des chambres élégantes, un spa de classe mondiale.',
    'reservations@hiltonyaounde.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 222 23 36 46',
    'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT27tAuuFLmUzHEYwTLXuqxrfc4Vd20xLaaZ4CzAVeR8h-m_G47',
    'Boulevard du 20 Mai, Centre-ville',
    'Yaoundé',
    'HOTEL',
    245,
    3.8667,
    11.5167,
    NOW(),
    NOW()
);

SET @hilton_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@hilton_id, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@hilton_id, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@hilton_id, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800');

-- 2. Sawa Hotel Douala
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Sawa Hotel Douala',
    'Le Sawa Hotel est l''un des établissements les plus prestigieux de Douala. Situé au cœur de Bonanjo, cet hôtel 4 étoiles propose des chambres spacieuses avec vue sur la ville.',
    'contact@sawahotel.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 233 42 60 60',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.agoda.com%2Ffr-fr%2Fhotel-sawa%2Fhotel%2Fdouala-cm.html&ved=0CBUQjRxqFwoTCLje0sStyZEDFQAAAAAdAAAAABAI&opi=89978449',
    'Boulevard de la Liberté, Bonanjo',
    'Douala',
    'HOTEL',
    189,
    4.0500,
    9.7000,
    NOW(),
    NOW()
);

SET @sawa_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@sawa_id, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@sawa_id, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@sawa_id, 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800');

-- 3. Ilomba Hotel Kribi
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Ilomba Hotel Kribi',
    'Niché au bord des plages dorées de Kribi, l''Ilomba Hotel est un paradis tropical avec des bungalows vue océan, un accès direct à la plage et un restaurant de fruits de mer frais.',
    'reservations@ilombahotel.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 699 88 77 66',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.facebook.com%2FTheTouristG%2Fposts%2Fparadise-in-kribi-%25EF%25B8%258F%25EF%25B8%258Fh%25C3%25B4tel-ilomba-h%25C3%25B4tel-le-plus-raffin%25C3%25A9-de-la-ville-de-kribi-hote%2F798498868944098%2F&ved=0CBUQjRxqFwoTCLjluZGuyZEDFQAAAAAdAAAAABAI&opi=89978449',
    'Plage de Kribi, Route des Chutes',
    'Kribi',
    'HOTEL',
    312,
    2.9400,
    9.9100,
    NOW(),
    NOW()
);

SET @ilomba_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@ilomba_id, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@ilomba_id, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@ilomba_id, 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800');

-- 4. Mountain Hotel Buea
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Mountain Hotel Buea',
    'Situé au pied du majestueux Mont Cameroun, le Mountain Hotel offre une expérience unique pour les amoureux de la nature et les randonneurs avec vue sur la montagne.',
    'info@mountainhotelbuea.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 677 55 44 33',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fcamhebergement.com%2Freserver%3Fid%3D271&ved=0CBUQjRxqFwoTCKiIuryuyZEDFQAAAAAdAAAAABA-&opi=89978449',
    'Mile 17 Motor Park Road',
    'Buea',
    'HOTEL',
    167,
    4.1560,
    9.2400,
    NOW(),
    NOW()
);

SET @mountain_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@mountain_id, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@mountain_id, 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800');

-- 5. La Falaise Hotel Douala
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'La Falaise Hotel Douala',
    'La Falaise est un hôtel boutique de standing situé dans le quartier résidentiel de Bonapriso à Douala. Établissement élégant offrant des suites luxueuses et un service personnalisé.',
    'contact@lafalaisehotel.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 233 43 55 00',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.tripadvisor.fr%2FHotel_Review-g297392-d5961472-Reviews-Hotel_la_Falaise_de_Bonanjo-Douala_Littoral_Region.html&ved=0CBUQjRxqFwoTCICa8Y-vyZEDFQAAAAAdAAAAABAk&opi=89978449',
    'Rue Joss, Bonapriso',
    'Douala',
    'HOTEL',
    134,
    4.0300,
    9.6900,
    NOW(),
    NOW()
);

SET @falaise_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@falaise_id, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@falaise_id, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800');

-- 6. Merina Hotel Yaoundé
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Merina Hotel Yaoundé',
    'Le Merina Hotel est un établissement moderne situé dans le quartier de Bastos à Yaoundé. Offrant un excellent rapport qualité-prix avec chambres climatisées et Wi-Fi gratuit.',
    'reservations@merinahotel.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 222 20 45 67',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.cameroun-plus.com%2Findex.php%3Fp_nid%3D64584&ved=0CBUQjRxqFwoTCPiRp7qxyZEDFQAAAAAdAAAAABBZ&opi=89978449',
    'Quartier Bastos',
    'Yaoundé',
    'HOTEL',
    98,
    3.8800,
    11.5000,
    NOW(),
    NOW()
);

SET @merina_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@merina_id, 'https://images.unsplash.com/photo-1587213811864-46e59f6873b1?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@merina_id, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800');

-- 7. Tou'Ngou Hotel Kribi
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Tou Ngou Hotel Kribi',
    'Le Tou Ngou Hotel est un complexe balnéaire haut de gamme situé sur la magnifique côte de Kribi avec des villas privées, un spa et des excursions vers les chutes de la Lobé.',
    'info@toungouhotel.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 699 55 11 22',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Ffr.hotels.com%2Fho398465%2Ftou-ngou-hotel-yaounde-cameroun%2F&ved=0CBUQjRxqFwoTCPjOlqiyyZEDFQAAAAAdAAAAABAk&opi=89978449',
    'Plage du Lobe',
    'Kribi',
    'HOTEL',
    276,
    2.8800,
    9.8900,
    NOW(),
    NOW()
);

SET @toungou_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@toungou_id, 'https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@toungou_id, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800');

-- 8. Ayaba Hotel Bamenda
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Ayaba Hotel Bamenda',
    'L''Ayaba Hotel est le plus grand établissement hôtelier de Bamenda, capitale de la région du Nord-Ouest. Vue panoramique sur les montagnes environnantes.',
    'reservations@ayabahotel.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 233 36 22 11',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Ffr.hotels.com%2Fho454542%2Fayaba-hotel-bamenda-cameroun%2F&ved=0CBUQjRxqFwoTCJiFw-y2yZEDFQAAAAAdAAAAABAI&opi=89978449',
    'Commercial Avenue',
    'Bamenda',
    'HOTEL',
    87,
    5.9500,
    10.1500,
    NOW(),
    NOW()
);

SET @ayaba_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@ayaba_id, 'https://images.unsplash.com/photo-1529290130-4ca3753253ae?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@ayaba_id, 'https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800');

-- ================================================================
-- RESTAURANTS DU CAMEROUN
-- ================================================================

-- 9. Le Boukarou Restaurant Yaoundé
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Le Boukarou Restaurant',
    'Le Boukarou est une institution gastronomique de Yaoundé, célèbre pour sa cuisine camerounaise authentique : Ndolé, Poulet DG, Eru et poisson braisé dans un cadre traditionnel.',
    'contact@leboukarou.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 699 12 34 56',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/77/2e/d4/restaurant.jpg?w=400&h=300&s=1',
    'Quartier Messa',
    'Yaoundé',
    'RESTAURATION',
    198,
    3.8600,
    11.4900,
    NOW(),
    NOW()
);

SET @boukarou_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@boukarou_id, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@boukarou_id, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800');

-- 10. Chez Wou Restaurant Douala
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Chez Wou Restaurant',
    'Chez Wou est le restaurant chinois le plus réputé de Douala, alliant saveurs asiatiques et influences camerounaises. Dim sum, nouilles sautées et canard laqué.',
    'chezwou@restaurant.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 233 42 88 99',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fvisit-yaounde.com%2Frestaurant-chez-wou-une-ode-a-la-gastronomie-camerounaise%2F&ved=0CBUQjRxqFwoTCIjblJu5yZEDFQAAAAAdAAAAABAI&opi=89978449',
    'Rue Bonanjo',
    'Douala',
    'RESTAURATION',
    156,
    4.0480,
    9.7050,
    NOW(),
    NOW()
);

SET @chezwou_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@chezwou_id, 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@chezwou_id, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800');

-- 11. Le Marin Restaurant Kribi
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Le Marin Restaurant',
    'Le Marin est un restaurant de fruits de mer exceptionnel en bord de plage à Kribi. Poissons et crustacés fraîchement pêchés, grillades et vue imprenable sur l''océan.',
    'lemarin@kribi.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 677 88 99 00',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Ffr.businesslist.co.cm%2Fcompany%2F136220%2Frestaurant-marina-de-kribi&ved=0CBUQjRxqGAoTCJiyi8e5yZEDFQAAAAAdAAAAABCPAQ&opi=89978449',
    'Plage de Kribi Centre',
    'Kribi',
    'RESTAURATION',
    234,
    2.9380,
    9.9080,
    NOW(),
    NOW()
);

SET @lemarin_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@lemarin_id, 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@lemarin_id, 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800');

-- 12. La Terrasse Restaurant Yaoundé
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'La Terrasse Restaurant',
    'La Terrasse est un restaurant franco-camerounais chic situé au Mont Fébé avec vue panoramique sur Yaoundé. Cuisine raffinée et terrasse romantique.',
    'laterrasse@yaounde.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 222 21 33 44',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fvisit-yaounde.com%2Fdecouvrez-la-terrasse-a-yaounde-une-evasion-culinaire-inoubliable%2F&ved=0CBUQjRxqFwoTCIiv-Ze6yZEDFQAAAAAdAAAAABB4&opi=89978449',
    'Mont Fébé',
    'Yaoundé',
    'RESTAURATION',
    178,
    3.8900,
    11.5100,
    NOW(),
    NOW()
);

SET @laterrasse_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@laterrasse_id, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@laterrasse_id, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800');

-- 13. Mami Nyanga Restaurant Douala
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Mami Nyanga Restaurant',
    'Mami Nyanga est un restaurant traditionnel camerounais authentique à Douala. Cuisine familiale : Koki, Mbongo Tchobi, Ndomba et Sanga avec accueil typiquement camerounais.',
    'maminyanga@resto.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 699 77 88 99',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.instagram.com%2Fp%2FC8caXhXKiVV%2F&ved=0CBUQjRxqGAoTCJCcssC7yZEDFQAAAAAdAAAAABCuAQ&opi=89978449',
    'Quartier Akwa',
    'Douala',
    'RESTAURATION',
    145,
    4.0550,
    9.7100,
    NOW(),
    NOW()
);

SET @maminyanga_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@maminyanga_id, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@maminyanga_id, 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800');

-- 14. Le Safari Restaurant Limbé
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Le Safari Restaurant',
    'Le Safari est un restaurant pittoresque en bord de mer à Limbé, au pied du Mont Cameroun. Cuisine internationale et locale avec vue sur les plages volcaniques noires.',
    'safari@limbe.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 677 11 22 33',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsuA0KJORDFiQG0gnisCtjcuw4eZrQ3LtAAQ&s',
    'Down Beach',
    'Limbé',
    'RESTAURATION',
    112,
    4.0200,
    9.2000,
    NOW(),
    NOW()
);

SET @safari_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@safari_id, 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@safari_id, 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=800');

-- 15. Iya Restaurant Bafoussam
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Iya Restaurant',
    'Iya Restaurant célèbre la richesse culinaire de l''Ouest Cameroun. Spécialités Bamiléké : Nkui, Taro pilé, Kondré dans un cadre rustique authentique.',
    'iyaresto@bafoussam.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 699 44 55 66',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fyomboa.com%2Fplace%2Fiya-buea%2F&ved=0CBUQjRxqFwoTCICh8YC9yZEDFQAAAAAdAAAAABAI&opi=89978449',
    'Marché A',
    'Bafoussam',
    'RESTAURATION',
    89,
    5.4700,
    10.4200,
    NOW(),
    NOW()
);

SET @iya_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@iya_id, 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@iya_id, 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800');

-- ================================================================
-- SITES TOURISTIQUES DU CAMEROUN
-- ================================================================

-- 16. Chutes de la Lobé Kribi
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Chutes de la Lobé',
    'Les Chutes de la Lobé sont un phénomène naturel unique au monde : la rivière se jette directement dans l''océan. Baignade sous les chutes et rencontre avec les Pygmées Bagyéli.',
    'contact@chuteslobe.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 699 00 11 22',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.facebook.com%2F100079855070507%2Fposts%2F%25EF%25B8%258Fd%25C3%25A9couvrez-les-chutes-de-la-lob%25C3%25A9-qui-se-trouvent-au-sud-du-cameroun-%25C3%25A0-7-kilom%25C3%25A8tr%2F116156007529258%2F&ved=0CBUQjRxqFwoTCJjg_6u9yZEDFQAAAAAdAAAAABAk&opi=89978449',
    'Route de Campo, 8km de Kribi',
    'Kribi',
    'SITE_TOURISTIQUE',
    456,
    2.8700,
    9.8800,
    NOW(),
    NOW()
);

SET @chutes_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@chutes_id, 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@chutes_id, 'https://images.unsplash.com/photo-1475070929565-c985b496cb9f?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@chutes_id, 'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=800');

-- 17. Mont Cameroun
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Mont Cameroun',
    'Le Mont Cameroun, "Char des Dieux", est le plus haut sommet d''Afrique de l''Ouest (4 095m). Volcan actif offrant une expérience de trekking exceptionnelle à travers différents écosystèmes.',
    'montcameroun@tourisme.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 677 33 44 55',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fcameroon.panda.org%2Ffr%2Flieux_et_paysages%2Fprogramme_forets_cotieres%2Fle_parc_national_du_mont_cameroun_%2F&ved=0CBUQjRxqGAoTCNitnfS9yZEDFQAAAAAdAAAAABCHAQ&opi=89978449',
    'Buea',
    'Buea',
    'SITE_TOURISTIQUE',
    389,
    4.2030,
    9.1710,
    NOW(),
    NOW()
);

SET @mont_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@mont_id, 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@mont_id, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@mont_id, 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800');

-- 18. Parc National de Waza
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Parc National de Waza',
    'Le Parc National de Waza est la réserve animalière la plus célèbre du Cameroun. 1 700 km² abritant éléphants, lions, girafes, antilopes et plus de 379 espèces d''oiseaux.',
    'parcwaza@cameroun.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 699 88 77 66',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.cameroun-plus.com%2Findex.php%3Fp_nid%3D65394&ved=0CBUQjRxqFwoTCODjwuO-yZEDFQAAAAAdAAAAABAI&opi=89978449',
    'Route de Waza',
    'Maroua',
    'SITE_TOURISTIQUE',
    298,
    11.3300,
    14.6700,
    NOW(),
    NOW()
);

SET @waza_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@waza_id, 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@waza_id, 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@waza_id, 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=800');

-- 19. Jardin Botanique de Limbé
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Jardin Botanique de Limbé',
    'Fondé en 1892, le Jardin Botanique de Limbé est l''un des plus anciens d''Afrique. 48 hectares avec plus de 1 500 espèces de plantes tropicales et vue sur le Mont Cameroun.',
    'jardinlimbe@tourisme.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 677 22 33 44',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Flimbe.cm%2Fdans-le-jardin-botanique-de-limbe.html&ved=0CBUQjRxqFwoTCPjisIS_yZEDFQAAAAAdAAAAABAI&opi=89978449',
    'Milefour Road',
    'Limbé',
    'SITE_TOURISTIQUE',
    267,
    4.0280,
    9.2100,
    NOW(),
    NOW()
);

SET @jardin_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@jardin_id, 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@jardin_id, 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@jardin_id, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800');

-- 20. Musée National du Cameroun Yaoundé
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Musée National du Cameroun',
    'Le Musée National du Cameroun dans l''ancien palais présidentiel. Collections d''art traditionnel des 240 ethnies : masques rituels, sculptures, objets royaux Bamiléké et Bamoun.',
    'museenat@cameroun.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 222 23 45 67',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Ffr.tripinafrica.com%2Fattractions%2Fyaounde%2Fmusee-national-du-cameroun&ved=0CBUQjRxqFwoTCOiIobS_yZEDFQAAAAAdAAAAABAI&opi=899784498',
    'Quartier du Lac',
    'Yaoundé',
    'SITE_TOURISTIQUE',
    234,
    3.8750,
    11.5200,
    NOW(),
    NOW()
);

SET @musee_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@musee_id, 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@musee_id, 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?w=800');

-- 21. Lac Nyos
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Lac Nyos',
    'Le Lac Nyos est un lac de cratère d''une beauté saisissante dans la région du Nord-Ouest. Eaux turquoise entourées de collines verdoyantes. Site de mémoire et de beauté naturelle.',
    'lacnyos@tourisme.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 677 99 88 77',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.camer.be%2Famp%2F54049%2F11%3A1%2Fil-y-a-30-ans-jour-pour-jour-le-cameroun-etait-frappe-par-la-pire-catastrophe-naturelle-de-son-histoire-cameroon.html&ved=0CBUQjRxqFwoTCNiBkebAyZEDFQAAAAAdAAAAABAI&opi=89978449',
    'Route de Wum',
    'Wum',
    'SITE_TOURISTIQUE',
    156,
    6.4380,
    10.2980,
    NOW(),
    NOW()
);

SET @lacnyos_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@lacnyos_id, 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@lacnyos_id, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800');

-- 22. Palais Royal des Bamoun - Foumban
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Palais Royal des Bamoun',
    'Le Palais Royal des Bamoun à Foumban, résidence du Sultan depuis le 14ème siècle. Musée avec trésors royaux, armes anciennes et costumes traditionnels. Artisanat célèbre.',
    'palaisfoumban@culture.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 699 11 22 33',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Ffr.wikipedia.org%2Fwiki%2FPalais_des_sultans_bamouns&ved=0CBUQjRxqFwoTCJiD2oDFyZEDFQAAAAAdAAAAABA-&opi=89978449',
    'Place du Palais',
    'Foumban',
    'SITE_TOURISTIQUE',
    345,
    5.7270,
    10.8980,
    NOW(),
    NOW()
);

SET @palais_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@palais_id, 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@palais_id, 'https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@palais_id, 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800');

-- 23. Plages de Kribi
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Plages de Kribi',
    'Les plages de Kribi parmi les plus belles d''Afrique centrale. Sable doré, eaux turquoise, cocotiers. Baignade, sports nautiques, pêche sportive et excursions en pirogue.',
    'plages@kribi.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 699 33 44 55',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.facebook.com%2FTourismoCameroun%2Fposts%2Fla-plus-belle-plage-de-kribi-se-trouve-%25C3%25A0-lhotel-ilomba-un-lieu-paisible-situ%25C3%25A9-%25C3%25A0-%2F733474822145863%2F&ved=0CBUQjRxqFwoTCJDt1OHFyZEDFQAAAAAdAAAAABB0&opi=89978449',
    'Corniche de Kribi',
    'Kribi',
    'SITE_TOURISTIQUE',
    423,
    2.9420,
    9.9100,
    NOW(),
    NOW()
);

SET @plages_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@plages_id, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@plages_id, 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@plages_id, 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800');

-- 24. Chefferie de Bafut
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Chefferie de Bafut',
    'La Chefferie de Bafut, l''un des royaumes traditionnels les plus importants du Cameroun anglophone. Palais classé UNESCO avec architecture Grassfields unique et danses rituelles.',
    'chefferie@bafut.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 677 66 55 44',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.facebook.com%2Fvisiterlecamerounavecmoi%2Fposts%2Fchefferie-de-bafutbafut-est-un-village-traditionnel-r%25C3%25A9git-par-des-coutumes-ances%2F994232112846630%2F&ved=0CBUQjRxqFwoTCMCusrfGyZEDFQAAAAAdAAAAABAI&opi=89978449',
    'Bafut Palace',
    'Bafut',
    'SITE_TOURISTIQUE',
    178,
    6.0830,
    10.1070,
    NOW(),
    NOW()
);

SET @bafut_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@bafut_id, 'https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@bafut_id, 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800');

-- 25. Réserve de Dja
INSERT INTO etablissement (public_id, nom, description, email, password, telephone, photo_profile, adresse, ville, categorie, nombre_favoris, latitude, longitude, created_at, updated_at)
VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),
    'Réserve de Biosphère du Dja',
    'La Réserve du Dja, Patrimoine Mondial UNESCO. 526 000 hectares de forêt tropicale avec gorilles, chimpanzés, éléphants de forêt et les Pygmées Baka. Écotourisme responsable.',
    'reservedja@unesco.cm',
    '$2a$10$YQGh8XXWyerwENuwIqJFi.F.bdOLoH.f2g/9FFmCLdvQrcNZydmI6',
    '+237 699 55 66 77',
    'https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Findexcameroun.com%2Freserve-de-faune-du-dja%2F&ved=0CBUQjRxqFwoTCKCy6tjGyZEDFQAAAAAdAAAAABBA&opi=89978449',
    'Somalomo',
    'Sangmélima',
    'SITE_TOURISTIQUE',
    312,
    3.2000,
    12.8500,
    NOW(),
    NOW()
);

SET @dja_id = LAST_INSERT_ID();
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@dja_id, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@dja_id, 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800');
INSERT INTO etablissement_images (etablissement_id, images) VALUES (@dja_id, 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?w=800');

-- ================================================================
-- FIN DU SCRIPT
-- ================================================================

SELECT CONCAT('Insertion terminée: ', COUNT(*), ' établissements créés') AS resultat FROM etablissement;
