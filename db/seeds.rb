# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

causes = [
  "environnement",
  "protection-de-l-enfance",
  "sante",
  "lutte-contre-la-précarité",
  "education",
  "protection-animale",
  "recherche",
  "arts-culture-patrimoine",
  "aide-internationale",
  "handicap",
  "justice-sociale",
  "religion",
  "autre"
]

causes.each do |cause|
  Cause.find_or_create_by!(name: cause)
end

keywords = [
  "solidarité inter-générationnelle",
  "droits des femmes",
  "lutte contre le sexisme",
  "lutte contre la violence faites aux femmes",
  "prévention du suicide",
  "lutte contre la précarité",
  "soutien aux jeunes",
  "accompagnement de la dépression",
  "soutien scolaire",
  "acceuil des personnes sans domicile fixe",
  "réinsertion professionnelle",
  "soutien aux ex-détenus",
  "lutte contre l'isolement social",
  "protection des droits des enfants",
  "aide aux réfugiés",
  "égalité des chances",
  "aide aux familles monoparentales",
  "soutien aux aidants familiaux",
  "insertion des personnes handicapées",
  "accompagnement des personnes âgées dépendantes",
  "lutte contre le racisme",
  "promotion de l'éducation des filles",
  "protection de la biodiversité",
  "sensibilisation au changement climatique",
  "promotion de l'agriculture durable",
  "accès à l'eau potable",
  "aide médicale humanitaire",
  "prévention des addictions",
  "promotion de l'économie circulaire",
  "soutien aux artistes locaux",
  "préservation des langues et cultures autochtones",
  "sensibilisation à la cybersécurité pour les jeunes",
  "altruisme",
  "donateurs",
  "plateform de dons",
  "web"
]

keywords.each do |keyword|
  Keyword.find_or_create_by!(name: keyword)
end

countries = [
  "Afghanistan",
  "Afrique du Sud",
  "Albanie",
  "Algérie",
  "Allemagne",
  "Andorre",
  "Angola",
  "Antigua-et-Barbuda",
  "Arabie Saoudite",
  "Argentine",
  "Arménie",
  "Australie",
  "Autriche",
  "Azerbaïdjan",
  "Bahamas",
  "Bahreïn",
  "Bangladesh",
  "Barbade",
  "Belgique",
  "Belize",
  "Bénin",
  "Bhoutan",
  "Biélorussie",
  "Birmanie (Myanmar)",
  "Bolivie",
  "Bosnie-Herzégovine",
  "Botswana",
  "Brésil",
  "Brunei",
  "Bulgarie",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodge",
  "Cameroun",
  "Canada",
  "Chili",
  "Chine",
  "Chypre",
  "Colombie",
  "Comores",
  "Congo (RDC)",
  "Congo (Brazzaville)",
  "Corée du Nord",
  "Corée du Sud",
  "Costa Rica",
  "Côte d'Ivoire",
  "Croatie",
  "Cuba",
  "Danemark",
  "Djibouti",
  "Dominique",
  "Égypte",
  "Émirats Arabes Unis",
  "Équateur",
  "Érythrée",
  "Espagne",
  "Estonie",
  "Eswatini",
  "États-Unis",
  "Éthiopie",
  "Fidji",
  "Finlande",
  "France",
  "Gabon",
  "Gambie",
  "Géorgie",
  "Ghana",
  "Grèce",
  "Grenade",
  "Guatemala",
  "Guinée",
  "Guinée-Bissau",
  "Guinée équatoriale",
  "Guyana",
  "Haïti",
  "Honduras",
  "Hongrie",
  "Inde",
  "Indonésie",
  "Irak",
  "Iran",
  "Irlande",
  "Islande",
  "Israël",
  "Italie",
  "Jamaïque",
  "Japon",
  "Jordanie",
  "Kazakhstan",
  "Kenya",
  "Kirghizistan",
  "Kiribati",
  "Kosovo* (selon reconnaissance internationale)",
  "Koweït",
  "Laos",
  "Lesotho",
  "Lettonie",
  "Liban",
  "Libéria",
  "Libye",
  "Liechtenstein",
  "Lituanie",
  "Luxembourg",
  "Macédoine du Nord",
  "Madagascar",
  "Malaisie",
  "Malawi",
  "Maldives",
  "Mali",
  "Malte",
  "Maroc",
  "Marshall (Îles)",
  "Mauritanie",
  "Maurice",
  "Mexique",
  "Micronésie",
  "Moldavie",
  "Monaco",
  "Mongolie",
  "Monténégro",
  "Mozambique",
  "Namibie",
  "Nauru",
  "Népal",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Norvège",
  "Nouvelle-Zélande",
  "Oman",
  "Ouganda",
  "Ouzbékistan",
  "Pakistan",
  "Palau",
  "Palestine*",
  "Panama",
  "Papouasie-Nouvelle-Guinée",
  "Paraguay",
  "Pays-Bas",
  "Pérou",
  "Philippines",
  "Pologne",
  "Portugal",
  "Qatar",
  "République Centrafricaine",
  "République Tchèque",
  "Roumanie",
  "Royaume-Uni",
  "Russie",
  "Rwanda",
  "Saint-Kitts-et-Nevis",
  "Saint-Marin",
  "Saint-Vincent-et-les-Grenadines",
  "Sainte-Lucie",
  "Salomon (Îles)",
  "Salvador",
  "Samoa",
  "São Tomé-et-Principe",
  "Sénégal",
  "Serbie",
  "Seychelles",
  "Sierra Leone",
  "Singapour",
  "Slovaquie",
  "Slovénie",
  "Somalie",
  "Soudan",
  "Soudan du Sud",
  "Sri Lanka",
  "Suède",
  "Suisse",
  "Suriname",
  "Syrie",
  "Tadjikistan",
  "Tanzanie",
  "Tchad",
  "Thaïlande",
  "Timor-Oriental",
  "Togo",
  "Tonga",
  "Trinité-et-Tobago",
  "Tunisie",
  "Turkménistan",
  "Turquie",
  "Tuvalu",
  "Ukraine",
  "Uruguay",
  "Vanuatu",
  "Vatican",
  "Venezuela",
  "Vietnam",
  "Yémen",
  "Zambie",
  "Zimbabwe"
]

countries.each do |country|
  InterventionArea.find_or_create_by!(name: country)
end

french_regions = [
  "Auvergne-Rhône-Alpes",
  "Bourgogne-Franche-Comté",
  "Bretagne",
  "Centre-Val de Loire",
  "Corse",
  "Grand Est",
  "Hauts-de-France",
  "Île-de-France",
  "Normandie",
  "Nouvelle-Aquitaine",
  "Occitanie",
  "Pays de la Loire",
  "Provence-Alpes-Côte d'Azur",
  "Guadeloupe",
  "Guyane",
  "La Réunion",
  "Martinique",
  "Mayotte"
]

french_regions.each do |region|
  InterventionArea.find_or_create_by!(name: region)
end

french_departements = [
  "Ain (01)",
  "Aisne (02)",
  "Allier (03)",
  "Alpes-de-Haute-Provence (04)",
  "Hautes-Alpes (05)",
  "Alpes-Maritimes (06)",
  "Ardèche (07)",
  "Ardennes (08)",
  "Ariège (09)",
  "Aube (10)",
  "Aude (11)",
  "Aveyron (12)",
  "Bouches-du-Rhône (13)",
  "Calvados (14)",
  "Cantal (15)",
  "Charente (16)",
  "Charente-Maritime (17)",
  "Cher (18)",
  "Corrèze (19)",
  "Corse-du-Sud (2A)",
  "Haute-Corse (2B)",
  "Côte-d'Or (21)",
  "Côtes-d'Armor (22)",
  "Creuse (23)",
  "Dordogne (24)",
  "Doubs (25)",
  "Drôme (26)",
  "Eure (27)",
  "Eure-et-Loir (28)",
  "Finistère (29)",
  "Gard (30)",
  "Haute-Garonne (31)",
  "Gers (32)",
  "Gironde (33)",
  "Hérault (34)",
  "Ille-et-Vilaine (35)",
  "Indre (36)",
  "Indre-et-Loire (37)",
  "Isère (38)",
  "Jura (39)",
  "Landes (40)",
  "Loir-et-Cher (41)",
  "Loire (42)",
  "Haute-Loire (43)",
  "Loire-Atlantique (44)",
  "Loiret (45)",
  "Lot (46)",
  "Lot-et-Garonne (47)",
  "Lozère (48)",
  "Maine-et-Loire (49)",
  "Manche (50)",
  "Marne (51)",
  "Haute-Marne (52)",
  "Mayenne (53)",
  "Meurthe-et-Moselle (54)",
  "Meuse (55)",
  "Morbihan (56)",
  "Moselle (57)",
  "Nièvre (58)",
  "Nord (59)",
  "Oise (60)",
  "Orne (61)",
  "Pas-de-Calais (62)",
  "Puy-de-Dôme (63)",
  "Pyrénées-Atlantiques (64)",
  "Hautes-Pyrénées (65)",
  "Pyrénées-Orientales (66)",
  "Bas-Rhin (67)",
  "Haut-Rhin (68)",
  "Rhône (69)",
  "Haute-Saône (70)",
  "Saône-et-Loire (71)",
  "Sarthe (72)",
  "Savoie (73)",
  "Haute-Savoie (74)",
  "Paris (75)",
  "Seine-Maritime (76)",
  "Seine-et-Marne (77)",
  "Yvelines (78)",
  "Deux-Sèvres (79)",
  "Somme (80)",
  "Tarn (81)",
  "Tarn-et-Garonne (82)",
  "Var (83)",
  "Vaucluse (84)",
  "Vendée (85)",
  "Vienne (86)",
  "Haute-Vienne (87)",
  "Vosges (88)",
  "Yonne (89)",
  "Territoire de Belfort (90)",
  "Essonne (91)",
  "Hauts-de-Seine (92)",
  "Seine-Saint-Denis (93)",
  "Val-de-Marne (94)",
  "Val-d'Oise (95)",
  "Guadeloupe (971)",
  "Martinique (972)",
  "Guyane (973)",
  "La Réunion (974)",
  "Mayotte (976)"
]

french_departements.each do |departement|
  InterventionArea.find_or_create_by!(name: departement)
end

biggest_french_cities = [
  "Paris",
  "Marseille",
  "Lyon",
  "Toulouse",
  "Nice",
  "Nantes",
  "Montpellier",
  "Strasbourg",
  "Bordeaux",
  "Lille",
  "Rennes",
  "Toulon",
  "Reims",
  "Saint-Étienne",
  "Le Havre",
  "Dijon",
  "Grenoble",
  "Angers",
  "Villeurbanne",
  "Saint-Denis",
  "Nîmes",
  "Aix-en-Provence",
  "Clermont-Ferrand",
  "Le Mans",
  "Brest",
  "Tours",
  "Amiens",
  "Annecy",
  "Limoges",
  "Metz",
  "Boulogne-Billancourt",
  "Perpignan",
  "Besançon",
  "Orléans",
  "Rouen",
  "Saint-Denis",
  "Montreuil",
  "Caen",
  "Argenteuil",
  "Mulhouse",
  "Saint-Paul",
  "Nancy",
  "Tourcoing",
  "Roubaix",
  "Nanterre",
  "Vitry-sur-Seine",
  "Créteil",
  "Avignon",
  "Poitiers",
  "Aubervilliers",
  "Asnières-sur-Seine",
  "Colombes",
  "Dunkerque",
  "Aulnay-sous-Bois",
  "Saint-Pierre",
  "Versailles",
  "Le Tampon",
  "Courbevoie",
  "Béziers",
  "La Rochelle",
  "Rueil-Malmaison",
  "Cherbourg-en-Cotentin",
  "Champigny-sur-Marne",
  "Pau",
  "Mérignac",
  "Saint-Maur-des-Fossés",
  "Antibes",
  "Fort-de-France",
  "Ajaccio",
  "Cannes",
  "Saint-Nazaire",
  "Drancy",
  "Colmar",
  "Bourges",
  "Issy-les-Moulineaux",
  "Levallois-Perret",
  "Quimper",
  "Noisy-le-Grand",
  "La Seyne-sur-Mer",
  "Cergy",
  "Niort",
  "Vénissieux",
  "Clichy",
  "Troyes",
  "Pessac",
  "Ivry-sur-Seine",
  "Antibes",
  "Lorient",
  "Chambéry",
  "Saint-Quentin",
  "Villejuif",
  "Hyères"
]

biggest_french_cities.each do |city|
  InterventionArea.find_or_create_by!(name: city)
end

continental_scales = [
  "Europe",
  "Afrique",
  "Asie",
  "Amérique du Nord",
  "Amérique du Sud",
  "Océanie",
  "Antarctique"
]

continental_scales.each do |scale|
  InterventionArea.find_or_create_by!(name: scale)
end

labels = [
  {
    name: "Don en confiance",
    description: <<~DESC,
      Don en Confiance, créé en 1989, est un organisme à but non lucratif qui labellise et contrôle les associations et
      fondations faisant appel à la générosité du public. Son label garantit le respect de principes déontologiques tels
      que la transparence financière, l'efficacité de l'action, la probité et le respect des donateurs. Les organisations
      labellisées s'engagent à publier annuellement "L'Essentiel", un document synthétique informant les donateurs sur
      l'utilisation des fonds collectés.
    DESC
    website: "https://www.donenconfiance.org"
  },
  {
    name: "Label IDEAS",
    description: <<~DESC,
      Le Label IDEAS, créé en 2010, est une certification indépendante pour les organismes à but non lucratif en France.
      Il atteste de bonnes pratiques en matière de gouvernance, de gestion financière et d'évaluation de l'action.
      L'obtention du label implique une démarche d'amélioration continue basée sur le Guide IDEAS des Bonnes Pratiques,
      comprenant 14 objectifs et plus de 120 indicateurs. Le processus de labellisation dure en moyenne 18 mois et le
      label est valable 3 ans. Il constitue un gage de confiance pour les partenaires et financeurs, renforçant la
      crédibilité des organisations labellisées.
    DESC
    website: "https://ideas.asso.fr/"
  }
]

labels.each do |label|
  Label.find_or_create_by!(name: label[:name]) do |l|
    l.description = label[:description]
    l.website = label[:website]
  end
end

benefactorum_params = {
  "name" => "Benefactorum",
  "website" => "https://benefactorum.org/",
  # "logo" =>
  # {
  #   "tempfile" => "#<File:0x00007836ee3e6f50>",
  #   "content_type" => "image/png",
  #   "original_filename" => "Benefactorum-Logo.png",
  #   "headers" => "Content-Disposition: form-data; name=\"logo\"; filename=\"Benefactorum-Logo.png\"\r\nContent-Type: image/png\r\n"
  # },
  "description" =>
  "Benefactorum est la première plateforme de dons\r\ncollaborative et à but non-lucratif,\r\nqui vous permet de découvrir et de soutenir facilement\r\ntoutes les causes qui vous tiennent à coeur !",
  "osbls_causes_attributes" => {
    "0" => {
      "cause_id" => "13"
    }
  },
  "tax_reduction" => "intérêt_général",
  "osbls_keywords_attributes" => {
    "0" => {
      "keyword_id" => "36" # altruisme
    },
    "1" => {
      "keyword_id" => "37" # donateurs
    },
    "2" => {
      "keyword_id" => "38" # plateforme de dons
    },
    "3" => {
      "keyword_id" => "39" # web
    }
  },
  "geographical_scale" => "national",
  "osbl_type" => "association",
  "creation_year" => "2023",
  # "document_attachments_attributes" =>
  # {
  #   "0" =>
  #   {
  #     "document_attributes" =>
  #     {
  #       "type" => "Statuts",
  #        "file" =>
  #        {
  #          "tempfile" => "#<File:0x00007836eea1e8f0>",
  #          "content_type" => "application/pdf",
  #          "original_filename" => "Statuts Benefactorum.pdf",
  #          "headers" => "Content-Disposition: form-data; name=\"document_attachments_attributes[0][document_attributes][file]\"; filename=\"Statuts Benefactorum.pdf\"\r\nContent-Type: application/pdf\r\n"
  #        },
  #       "name" => "Statuts de l'association",
  #       "year" => "2023"
  #     }
  #   },
  #   "1" =>
  #   {
  #     "document_attributes" =>
  #     {
  #       "type" => "Statuts",
  #        "file" =>
  #        {
  #          "tempfile" => "#<File:0x00007836eea10c28>",
  #          "content_type" => "application/pdf",
  #          "original_filename" => "Statuts - Fonds Benefactorum.pdf",
  #          "headers" =>
  #          "Content-Disposition: form-data; name=\"document_attachments_attributes[1][document_attributes][file]\"; filename=\"Statuts - Fonds Benefactorum.pdf\"\r\nContent-Type: application/pdf\r\n"
  #        },
  #       "name" => "Statuts du fonds de dotation",
  #       "year" => "2023"
  #     }
  #   }
  # },
  "locations_attributes" =>
  {
    "0" =>
    {
      "type" => "Siège social",
      "address_attributes" => {
        "street_number" => "12",
        "street_name" => "Rue du moulin",
        "postal_code" => "44260",
        "city" => "La Chapelle-Launay",
        "latitude" => "47.371354",
        "longitude" => "-1.969269"
      }
    }
  }
}

Osbl.find_or_create_by!(name: benefactorum_params["name"]) do |osbl|
  osbl.assign_attributes(benefactorum_params)
end
