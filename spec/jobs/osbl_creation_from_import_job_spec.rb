require "rails_helper"

RSpec.describe OsblCreationFromImportJob, type: :job do
  describe "#perform" do
    let(:extracted_data) do
      {
        "logo" => "https://www.restosducoeur.org/wp-content/uploads/2016/04/cropped-logo.png",
        "name" => "Les Restos du Cœur",
        "website" => "https://www.restosducoeur.org",
        "osbl_type" => "association",
        "description" => "Les Restos du Cœur luttent contre la pauvreté et l'exclusion en fournissant une aide alimentaire et un accompagnement social aux personnes en difficulté.",
        "creation_year" => 1985,
        "tax_reduction" => "aide_aux_personnes_en_difficulté",
        "public_utility" => true,
        "geographical_scale" => "national",
        "locations_attributes" => [
          {
            "name" => "Siège des Restos du Cœur",
            "type" => "Siège social",
            "website" => "https://www.restosducoeur.org",
            "description" => "Siège social de l'association.",
            "address_attributes" => {
              "city" => "Paris",
              "postal_code" => "75000",
              "street_name" => "Rue des Restos",
              "street_number" => "10",
              "additional_info" => ""
            }
          },
          {
            "name" => "Les Restos du Cœur",
            "type" => "Siège social",
            "website" => "https://www.restosducoeur.org",
            "description" => "Aide alimentaire et soutien aux personnes en difficulté.",
            "address_attributes" => {
              "city" => "Paris",
              "postal_code" => "",
              "street_name" => "",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "Restos du Cœur",
            "type" => "Siège social",
            "website" => "https://www.restosducoeur.org",
            "description" => "Siège social des Restos du Cœur.",
            "address_attributes" => {
              "city" => "Paris",
              "postal_code" => "",
              "street_name" => "",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "Siège des Restos du Cœur",
            "type" => "Siège social",
            "website" => "https://www.restosducoeur.org",
            "description" => "Siège social de l'organisation.",
            "address_attributes" => {
              "city" => "Paris",
              "postal_code" => "",
              "street_name" => "",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "Les Restos du Cœur",
            "type" => "Siège social",
            "website" => "https://www.restosducoeur.org",
            "description" => "Organisation caritative française qui lutte contre la précarité.",
            "address_attributes" => {
              "city" => "Paris",
              "postal_code" => "",
              "street_name" => "",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "Siège des Restos du Cœur",
            "type" => "Siège social",
            "website" => "https://www.restosducoeur.org",
            "description" => "Siège social de l'organisation.",
            "address_attributes" => {
              "city" => "Paris",
              "postal_code" => "75000",
              "street_name" => "Rue des Restos",
              "street_number" => "1",
              "additional_info" => ""
            }
          },
          {
            "name" => "LES RESTOS DU CŒUR DE L'AIN",
            "type" => "Siège social",
            "website" => "https://ad01.restosducoeur.org",
            "description" => "Association œuvrant pour la lutte contre la précarité et l'accès aux droits sociaux.",
            "address_attributes" => {
              "city" => "Péronnas",
              "postal_code" => "01960",
              "street_name" => "avenue de Lyon",
              "street_number" => "346"
            }
          },
          {
            "name" => "Les Restos du Cœur 94 A2EF",
            "type" => "Siège social",
            "website" => "",
            "description" => "",
            "address_attributes" => {
              "city" => "Rungis",
              "postal_code" => "94150",
              "street_name" => "Place de la Logistique / Bat B15",
              "street_number" => "1"
            }
          },
          {
            "name" => "Les Restos du Cœur",
            "type" => "Siège social",
            "website" => "https://www.restosducoeur.org",
            "description" => "Association caritative française qui lutte contre la précarité en fournissant des denrées alimentaires et des produits de première nécessité.",
            "address_attributes" => {
              "city" => "Paris",
              "postal_code" => "",
              "street_name" => "",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "LES RESTOS DU CŒUR 38 Val d'Akor",
            "type" => "Siège social",
            "website" => "",
            "description" => "",
            "address_attributes" => {
              "city" => "CHATEL EN TRIEVES",
              "postal_code" => "38710",
              "street_name" => "Le Val d'Akor",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "Restos du Cœur",
            "type" => "Siège social",
            "website" => "https://www.restosducoeur.org",
            "description" => "Siège social des Restos du Cœur",
            "address_attributes" => {
              "city" => "Paris",
              "postal_code" => "",
              "street_name" => "",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "LES RESTOS DU CŒUR DES BOUCHES DU RHONE",
            "type" => "Siège social",
            "website" => "https://ad13.restosducoeur.org",
            "description" => "",
            "address_attributes" => {
              "city" => "Marseille",
              "postal_code" => "13002",
              "street_name" => "Rue d'anthoine",
              "street_number" => "14"
            }
          },
          {
            "name" => "Les Restos du Cœur de la Creuse",
            "type" => "Siège social",
            "website" => "https://www.restosducoeur.org/associations-departementales/les-restos-du-coeur-de-la-creuse",
            "description" => "Aide alimentaire et accès à la culture pour les personnes en difficulté.",
            "address_attributes" => {
              "city" => "ST SULPICE LE GUERETOIS",
              "postal_code" => "23000",
              "street_name" => "Route de Bénévent Le Maupuy",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "LES RESTOS DU CŒUR DU FINISTERE",
            "type" => "Siège social",
            "website" => "https://ad29.restosducoeur.org",
            "description" => "",
            "address_attributes" => {
              "city" => "SAINT SEGAL",
              "postal_code" => "29590",
              "street_name" => "rue de la Mairie",
              "street_number" => "27"
            }
          },
          {
            "name" => "Siège Départemental des Restaurants du Cœur de l'Essonne",
            "type" => "Siège social",
            "website" => "https://ad91.restosducoeur.org",
            "description" => "",
            "address_attributes" => {
              "city" => "EVRY-COURCOURONNES",
              "postal_code" => "91080",
              "street_name" => "Avenue de l'Orme",
              "street_number" => "5",
              "additional_info" => ""
            }
          },
          {
            "name" => "Les Restos du Cœur",
            "type" => "Siège social",
            "website" => "https://www.restosducoeur.org",
            "description" => "Association d'aide alimentaire et d'insertion sociale.",
            "address_attributes" => {
              "city" => "Paris",
              "postal_code" => "",
              "street_name" => "",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "Siège des Restos du Cœur",
            "type" => "Siège social",
            "website" => "https://www.restosducoeur.org",
            "description" => "Siège social de l'association.",
            "address_attributes" => {
              "city" => "Paris",
              "postal_code" => "75000",
              "street_name" => "Rue des Restos",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "LES RESTOS DU CŒUR DE HAUTE-SAVOIE",
            "type" => "Siège social",
            "website" => "https://ad74.restosducoeur.org",
            "description" => "Association œuvrant pour l'aide alimentaire et l'accompagnement social des personnes en difficulté.",
            "address_attributes" => {
              "city" => "Annecy",
              "postal_code" => "74370",
              "street_name" => "Route des Vernes",
              "street_number" => "324",
              "additional_info" => ""
            }
          },
          {
            "name" => "LES RESTOS DU CŒUR 74 MAISON COLUCHE",
            "type" => "Siège social",
            "website" => "",
            "description" => "",
            "address_attributes" => {
              "city" => "Ambilly",
              "postal_code" => "74100",
              "street_name" => "Rue Ernest Renan",
              "street_number" => "3"
            }
          },
          {
            "name" => "LES RESTOS DU CŒUR DE LA HAUTE-SAONE",
            "type" => "Siège social",
            "website" => "https://ad70.restosducoeur.org",
            "description" => "",
            "address_attributes" => {
              "city" => "VESOUL",
              "postal_code" => "70000",
              "street_name" => "Rue du Petit Chanois",
              "street_number" => "",
              "additional_info" => "BP 60114"
            }
          },
          {
            "name" => "LES RESTOS DU CŒUR DU PUY-DE-DOME",
            "type" => "Siège social",
            "website" => "https://ad63.restosducoeur.org",
            "description" => "",
            "address_attributes" => {
              "city" => "Clermont-Ferrand",
              "postal_code" => "63000",
              "street_name" => "Rue Cuvier",
              "street_number" => "2"
            }
          },
          {
            "name" => "Restos du Cœur",
            "type" => "Siège social",
            "website" => "https://www.restosducoeur.org",
            "description" => "Organisation d'aide alimentaire",
            "address_attributes" => {
              "city" => "Paris",
              "postal_code" => "",
              "street_name" => "",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "Restos du Cœur",
            "type" => "Siège social",
            "website" => "",
            "description" => "Siège de l'organisation",
            "address_attributes" => {
              "city" => "Paris",
              "postal_code" => "",
              "street_name" => "",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "Siège des Restos du Cœur",
            "type" => "Siège social",
            "website" => "",
            "description" => "Siège social de l'organisation.",
            "address_attributes" => {
              "city" => "Paris",
              "postal_code" => "",
              "street_name" => "",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "LES RESTOS DU CŒUR DU CANTAL",
            "type" => "Siège social",
            "website" => "https://ad15.restosducoeur.org",
            "description" => "Siège départemental des Restos du Cœur du Cantal.",
            "address_attributes" => {
              "city" => "Aurillac",
              "postal_code" => "15000",
              "street_name" => "Rue du Prince",
              "street_number" => "8"
            }
          },
          {
            "name" => "Restos du Coeur",
            "type" => "Siège social",
            "website" => "https://www.restosducoeur.org",
            "description" => "Siège social des Restos du Coeur",
            "address_attributes" => {
              "city" => "Paris",
              "postal_code" => "",
              "street_name" => "",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "Restos du Cœur",
            "type" => "Siège social",
            "website" => "https://www.restosducoeur.org",
            "description" => "Aide aux personnes en précarité",
            "address_attributes" => {
              "city" => "France",
              "postal_code" => "",
              "street_name" => "",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "Restos du Cœur",
            "type" => "Siège social",
            "website" => "https://www.restosducoeur.org",
            "description" => "Siège de l'association",
            "address_attributes" => {
              "city" => "Paris",
              "postal_code" => "",
              "street_name" => "",
              "street_number" => "",
              "additional_info" => ""
            }
          },
          {
            "name" => "LES RESTOS DU CŒUR DU GARD",
            "type" => "Siège social",
            "website" => "https://ad30.restosducoeur.org",
            "description" => "Aide alimentaire et accompagnement social pour les personnes en difficulté.",
            "address_attributes" => {
              "city" => "Nîmes",
              "postal_code" => "30000",
              "street_name" => "chemin du Mas de Teste",
              "street_number" => "170"
            }
          }
        ],
        "osbls_causes_attributes" => [
          {
            "name" => "Lutte contre la précarité"
          },
          {
            "name" => "Aide internationale"
          }
        ],
        "osbls_labels_attributes" => [
          {
            "name" => "Don en Confiance"
          },
          {
            "name" => "Label IDEAS"
          }
        ],
        "osbls_keywords_attributes" => [
          {
            "name" => "aide alimentaire"
          },
          {
            "name" => "bénévolat"
          },
          {
            "name" => "solidarité"
          },
          {
            "name" => "prévention de la pauvreté"
          },
          {
            "name" => "inclusion sociale"
          },
          {
            "name" => "Aide alimentaire"
          },
          {
            "name" => "Familles en difficulté"
          },
          {
            "name" => "Observatoire des Restos"
          },
          {
            "name" => "campagne"
          },
          {
            "name" => "précarité"
          },
          {
            "name" => "Bénévolat"
          },
          {
            "name" => "Solidarité"
          },
          {
            "name" => "Précarité"
          },
          {
            "name" => "Dons"
          },
          {
            "name" => "Alimentation"
          },
          {
            "name" => "Accès aux droits"
          },
          {
            "name" => "Emploi"
          },
          {
            "name" => "Culture"
          },
          {
            "name" => "denrées alimentaires"
          },
          {
            "name" => "produits de première nécessité"
          },
          {
            "name" => "collecte"
          },
          {
            "name" => "Accès à la culture"
          },
          {
            "name" => "Loisirs"
          },
          {
            "name" => "Label IDEAS"
          },
          {
            "name" => "Transparence"
          },
          {
            "name" => "Engagement sociétal"
          },
          {
            "name" => "Gouvernance"
          },
          {
            "name" => "Amélioration continue"
          },
          {
            "name" => "Logement"
          },
          {
            "name" => "Inclusion numérique"
          },
          {
            "name" => "Accompagnement au budget"
          },
          {
            "name" => "Estime de soi"
          },
          {
            "name" => "Accompagnement social"
          },
          {
            "name" => "Insertion professionnelle"
          },
          {
            "name" => "lutte contre la pauvreté"
          },
          {
            "name" => "insertion sociale"
          },
          {
            "name" => "enfants"
          },
          {
            "name" => "plan européen"
          },
          {
            "name" => "Petite enfance"
          },
          {
            "name" => "Insertion"
          },
          {
            "name" => "Accès aux droits sociaux"
          },
          {
            "name" => "Accompagnement budgétaire"
          },
          {
            "name" => "Ateliers de français"
          },
          {
            "name" => "personnes en difficulté"
          },
          {
            "name" => "observatoire"
          },
          {
            "name" => "accueil"
          },
          {
            "name" => "Hébergement d'urgence"
          },
          {
            "name" => "Aides au logement"
          },
          {
            "name" => "Chantiers d'insertion"
          },
          {
            "name" => "Gestion financière"
          },
          {
            "name" => "Contrôle interne"
          },
          {
            "name" => "Rapport annuel"
          },
          {
            "name" => "Accompagnement scolaire"
          },
          {
            "name" => "Microcrédit"
          },
          {
            "name" => "Accès à la justice"
          },
          {
            "name" => "Accès à la santé"
          },
          {
            "name" => "vaccination"
          },
          {
            "name" => "bénévoles"
          },
          {
            "name" => "hygiène"
          },
          {
            "name" => "prévention"
          },
          {
            "name" => "familles monoparentales"
          }
        ],
        "annual_finances_attributes" => [
          {
            "year" => 2021,
            "budget" => 10000000,
            "treasury" => 5000000,
            "certified" => true,
            "employees_count" => 200,
            "fund_sources_attributes" =>
           [
             {
               "type" => "Dons",
               "amount" => 6600000,
               "percent" => 66
             },
             {
               "type" => "Aides publiques",
               "amount" => 2000000,
               "percent" => 20
             },
             {
               "type" => "Revenus d'activités",
               "amount" => 1400000,
               "percent" => 14
             },
             {
               "type" => "Dons",
               "amount" => nil,
               "percent" => 70
             },
             {
               "type" => "Aides publiques",
               "amount" => nil,
               "percent" => 30
             },
             {
               "type" => "Dons",
               "amount" => nil,
               "percent" => 66
             },
             {
               "type" => "Aides publiques",
               "amount" => nil,
               "percent" => 34
             },
             {
               "type" => "Dons",
               "amount" => nil,
               "percent" => nil
             },
             {
               "type" => "Aides publiques",
               "amount" => nil,
               "percent" => nil
             }
           ],
            "fund_allocations_attributes" =>
           [
             {
               "type" => "Missions sociales",
               "amount" => 7000000,
               "percent" => 70
             },
             {
               "type" => "Frais de fonctionnement",
               "amount" => 2000000,
               "percent" => 20
             },
             {
               "type" => "Frais de recherche de fonds",
               "amount" => 1000000,
               "percent" => 10
             },
             {
               "type" => "Missions sociales",
               "amount" => nil,
               "percent" => 70
             },
             {
               "type" => "Frais de fonctionnement",
               "amount" => nil,
               "percent" => 30
             },
             {
               "type" => "Missions sociales",
               "amount" => nil,
               "percent" => 80
             },
             {
               "type" => "Frais de fonctionnement",
               "amount" => nil,
               "percent" => 20
             },
             {
               "type" => "Missions sociales",
               "amount" => nil,
               "percent" => nil
             },
             {
               "type" => "Frais de fonctionnement",
               "amount" => nil,
               "percent" => nil
             }
           ]
          },
          {
            "year" => 2022,
            "budget" => 12000000,
            "treasury" => 6000000,
            "certified" => true,
            "employees_count" => 220,
            "fund_sources_attributes" =>
           [
             {
               "type" => "Dons",
               "amount" => 7800000,
               "percent" => 65
             },
             {
               "type" => "Aides publiques",
               "amount" => 3000000,
               "percent" => 25
             },
             {
               "type" => "Revenus d'activités",
               "amount" => 1200000,
               "percent" => 10
             },
             {
               "type" => "Dons",
               "amount" => nil,
               "percent" => 65
             },
             {
               "type" => "Aides publiques",
               "amount" => nil,
               "percent" => 35
             },
             {
               "type" => "Dons",
               "amount" => nil,
               "percent" => 70
             },
             {
               "type" => "Aides publiques",
               "amount" => nil,
               "percent" => 30
             },
             {
               "type" => "Dons",
               "amount" => nil,
               "percent" => nil
             },
             {
               "type" => "Aides publiques",
               "amount" => nil,
               "percent" => nil
             }
           ],
            "fund_allocations_attributes" =>
           [
             {
               "type" => "Missions sociales",
               "amount" => 9000000,
               "percent" => 75
             },
             {
               "type" => "Frais de fonctionnement",
               "amount" => 1800000,
               "percent" => 15
             },
             {
               "type" => "Frais de recherche de fonds",
               "amount" => 1200000,
               "percent" => 10
             },
             {
               "type" => "Missions sociales",
               "amount" => nil,
               "percent" => 75
             },
             {
               "type" => "Frais de fonctionnement",
               "amount" => nil,
               "percent" => 25
             },
             {
               "type" => "Missions sociales",
               "amount" => nil,
               "percent" => nil
             },
             {
               "type" => "Frais de fonctionnement",
               "amount" => nil,
               "percent" => nil
             }
           ]
          },
          {
            "year" => 2023,
            "budget" => 13000000,
            "treasury" => 6500000,
            "certified" => true,
            "employees_count" => 230,
            "fund_sources_attributes" =>
           [
             {
               "type" => "Dons",
               "amount" => 9100000,
               "percent" => 70
             },
             {
               "type" => "Aides publiques",
               "amount" => 2600000,
               "percent" => 20
             },
             {
               "type" => "Revenus d'activités",
               "amount" => 1300000,
               "percent" => 10
             },
             {
               "type" => "Dons",
               "amount" => nil,
               "percent" => 66
             },
             {
               "type" => "Aides publiques",
               "amount" => nil,
               "percent" => 34
             },
             {
               "type" => "Dons",
               "amount" => nil,
               "percent" => nil
             },
             {
               "type" => "Aides publiques",
               "amount" => nil,
               "percent" => nil
             }
           ],
            "fund_allocations_attributes" =>
           [
             {
               "type" => "Missions sociales",
               "amount" => 10400000,
               "percent" => 80
             },
             {
               "type" => "Frais de fonctionnement",
               "amount" => 1950000,
               "percent" => 15
             },
             {
               "type" => "Frais de recherche de fonds",
               "amount" => 650000,
               "percent" => 5
             },
             {
               "type" => "Missions sociales",
               "amount" => nil,
               "percent" => 80
             },
             {
               "type" => "Frais de fonctionnement",
               "amount" => nil,
               "percent" => 20
             },
             {
               "type" => "Missions sociales",
               "amount" => nil,
               "percent" => nil
             },
             {
               "type" => "Frais de fonctionnement",
               "amount" => nil,
               "percent" => nil
             }
           ]
          },
          {
            "year" => 2020,
            "budget" => 4500000,
            "treasury" => 1600000,
            "certified" => true,
            "employees_count" => 120,
            "fund_sources_attributes" =>
           [
             {
               "type" => "Dons",
               "amount" => nil,
               "percent" => 65
             },
             {
               "type" => "Aides publiques",
               "amount" => nil,
               "percent" => 35
             },
             {
               "type" => "Dons",
               "amount" => 2790000,
               "percent" => 62
             },
             {
               "type" => "Aides publiques",
               "amount" => 1260000,
               "percent" => 28
             },
             {
               "type" => "Revenus d'activités",
               "amount" => 450000,
               "percent" => 10
             },
             {
               "type" => "Dons",
               "amount" => nil,
               "percent" => nil
             },
             {
               "type" => "Aides publiques",
               "amount" => nil,
               "percent" => nil
             }
           ],
            "fund_allocations_attributes" =>
           [
             {
               "type" => "Missions sociales",
               "amount" => nil,
               "percent" => 75
             },
             {
               "type" => "Frais de fonctionnement",
               "amount" => nil,
               "percent" => 25
             },
             {
               "type" => "Missions sociales",
               "amount" => 2835000,
               "percent" => 63
             },
             {
               "type" => "Frais de fonctionnement",
               "amount" => 1215000,
               "percent" => 27
             },
             {
               "type" => "Frais de recherche de fonds",
               "amount" => 450000,
               "percent" => 10
             },
             {
               "type" => "Missions sociales",
               "amount" => nil,
               "percent" => nil
             },
             {
               "type" => "Frais de fonctionnement",
               "amount" => nil,
               "percent" => nil
             }
           ]
          },
          {
            "year" => 2023,
            "budget" => 5000000,
            "treasury" => 2000000,
            "certified" => true,
            "employees_count" => 150,
            "fund_sources_attributes" => [
              {
                "type" => "Dons",
                "amount" => 3300000,
                "percent" => 66
              },
              {
                "type" => "Aides publiques",
                "amount" => 1000000,
                "percent" => 20
              },
              {
                "type" => "Revenus d'activités",
                "amount" => 700000,
                "percent" => 14
              }
            ],
            "fund_allocations_attributes" => [
              {
                "type" => "Missions sociales",
                "amount" => 3500000,
                "percent" => 70
              },
              {
                "type" => "Frais de fonctionnement",
                "amount" => 1000000,
                "percent" => 20
              },
              {
                "type" => "Frais de recherche de fonds",
                "amount" => 500000,
                "percent" => 10
              }
            ]
          },
          {
            "year" => 2022,
            "budget" => 4800000,
            "treasury" => 1800000,
            "certified" => true,
            "employees_count" => 140,
            "fund_sources_attributes" => [
              {
                "type" => "Dons",
                "amount" => 3120000,
                "percent" => 65
              },
              {
                "type" => "Aides publiques",
                "amount" => 1200000,
                "percent" => 25
              },
              {
                "type" => "Revenus d'activités",
                "amount" => 480000,
                "percent" => 10
              }
            ],
            "fund_allocations_attributes" => [
              {
                "type" => "Missions sociales",
                "amount" => 3264000,
                "percent" => 68
              },
              {
                "type" => "Frais de fonctionnement",
                "amount" => 1056000,
                "percent" => 22
              },
              {
                "type" => "Frais de recherche de fonds",
                "amount" => 480000,
                "percent" => 10
              }
            ]
          },
          {
            "year" => 2021,
            "budget" => 4600000,
            "treasury" => 1700000,
            "certified" => true,
            "employees_count" => 130,
            "fund_sources_attributes" => [
              {
                "type" => "Dons",
                "amount" => 2760000,
                "percent" => 60
              },
              {
                "type" => "Aides publiques",
                "amount" => 1380000,
                "percent" => 30
              },
              {
                "type" => "Revenus d'activités",
                "amount" => 460000,
                "percent" => 10
              }
            ],
            "fund_allocations_attributes" => [
              {
                "type" => "Missions sociales",
                "amount" => 2990000,
                "percent" => 65
              },
              {
                "type" => "Frais de fonctionnement",
                "amount" => 1150000,
                "percent" => 25
              },
              {
                "type" => "Frais de recherche de fonds",
                "amount" => 460000,
                "percent" => 10
              }
            ]
          },
          {
            "year" => 2019,
            "budget" => 4400000,
            "treasury" => 1500000,
            "certified" => true,
            "employees_count" => 110,
            "fund_sources_attributes" =>
           [
             {
               "type" => "Dons",
               "amount" => 2684000,
               "percent" => 61
             },
             {
               "type" => "Aides publiques",
               "amount" => 1276000,
               "percent" => 29
             },
             {
               "type" => "Revenus d'activités",
               "amount" => 440000,
               "percent" => 10
             },
             {
               "type" => "Dons",
               "amount" => nil,
               "percent" => nil
             },
             {
               "type" => "Aides publiques",
               "amount" => nil,
               "percent" => nil
             }
           ],
            "fund_allocations_attributes" =>
           [
             {
               "type" => "Missions sociales",
               "amount" => 2640000,
               "percent" => 60
             },
             {
               "type" => "Frais de fonctionnement",
               "amount" => 1320000,
               "percent" => 30
             },
             {
               "type" => "Frais de recherche de fonds",
               "amount" => 440000,
               "percent" => 10
             },
             {
               "type" => "Missions sociales",
               "amount" => nil,
               "percent" => nil
             },
             {
               "type" => "Frais de fonctionnement",
               "amount" => nil,
               "percent" => nil
             }
           ]
          },
          {
            "year" => 2021,
            "budget" => 1000000,
            "treasury" => 500000,
            "certified" => true,
            "employees_count" => 200,
            "fund_sources_attributes" => [
              {
                "type" => "Dons",
                "amount" => 700000,
                "percent" => 70
              },
              {
                "type" => "Aides publiques",
                "amount" => 300000,
                "percent" => 30
              }
            ],
            "fund_allocations_attributes" => [
              {
                "type" => "Missions sociales",
                "amount" => 800000,
                "percent" => 80
              },
              {
                "type" => "Frais de fonctionnement",
                "amount" => 200000,
                "percent" => 20
              }
            ]
          },
          {
            "year" => 2022,
            "budget" => 1200000,
            "treasury" => 600000,
            "certified" => true,
            "employees_count" => 220,
            "fund_sources_attributes" => [
              {
                "type" => "Dons",
                "amount" => 900000,
                "percent" => 75
              },
              {
                "type" => "Aides publiques",
                "amount" => 300000,
                "percent" => 25
              }
            ],
            "fund_allocations_attributes" => [
              {
                "type" => "Missions sociales",
                "amount" => 1020000,
                "percent" => 85
              },
              {
                "type" => "Frais de fonctionnement",
                "amount" => 180000,
                "percent" => 15
              }
            ]
          },
          {
            "year" => 2023,
            "budget" => 1300000,
            "treasury" => 650000,
            "certified" => true,
            "employees_count" => 230,
            "fund_sources_attributes" => [
              {
                "type" => "Dons",
                "amount" => 1040000,
                "percent" => 80
              },
              {
                "type" => "Aides publiques",
                "amount" => 260000,
                "percent" => 20
              }
            ],
            "fund_allocations_attributes" => [
              {
                "type" => "Missions sociales",
                "amount" => 1170000,
                "percent" => 90
              },
              {
                "type" => "Frais de fonctionnement",
                "amount" => 130000,
                "percent" => 10
              }
            ]
          }
        ],
        "document_attachments_attributes" => [
          {
            "document_attributes" => {
              "file" => "https://www.restosducoeur.org/rapport-activite-2022.pdf",
              "name" => "Rapport d'activité 2022",
              "type" => "Rapport d'activité",
              "year" => 2022,
              "description" => "Rapport détaillant les activités de l'année 2022."
            }
          },
          {
            "document_attributes" => {
              "file" => "https://www.restosducoeur.org/rapport-financier-2022.pdf",
              "name" => "Rapport financier 2022",
              "type" => "Rapport financier",
              "year" => 2022,
              "description" => "Rapport financier de l'année 2022."
            }
          },
          {
            "document_attributes" =>
           {
             "file" => "https://www.restosducoeur.org/wp-content/uploads/2019/11/infographie_personnes_familles_accueillies.pdf",
             "name" => "Les personnes et les familles accueillies à l'aide alimentaire en 2018/2019",
             "type" => "Rapport d'activité",
             "year" => 2019,
             "description" => "Données de l'Observatoire des Restos"
           }
          },
          {
            "document_attributes" =>
           {
             "file" => "https://www.restosducoeur.org/wp-content/uploads/2016/04/dp_restos_c40.pdf",
             "name" => "Dossier de presse – Lancement de la 40e campagne des Restos du Cœur",
             "type" => "Dossier de presse",
             "year" => 2025,
             "description" => "Dossier de presse pour le lancement de la 40e campagne des Restos du Cœur."
           }
          },
          {
            "document_attributes" => {
              "file" => "https://www.restosducoeur.org/wp-content/uploads/2021/11/affiche_chiffres_cles_2020-2021_vdef.pdf",
              "name" => "Chiffres clés 2020-2021",
              "type" => "Rapport d'activité",
              "year" => 2021,
              "description" => "Rapport sur les chiffres clés de l'année 2020-2021."
            }
          },
          {
            "document_attributes" => {
              "file" => "https://www.restosducoeur.org/wp-content/uploads/2021/11/affiche_chiffres_cles_2020-2021_vdef.pdf",
              "name" => "Rapport financier 2020-2021",
              "type" => "Rapport financier",
              "year" => 2021,
              "description" => "Détails financiers de l'année 2020-2021."
            }
          },
          {
            "document_attributes" => {
              "file" => "https://www.restosducoeur.org/wp-content/uploads/2016/04/affiche_chiffres_cles_c38.pdf",
              "name" => "Chiffres clés 2021-2022",
              "type" => "Rapport d'activité",
              "year" => 2021,
              "description" => "Rapport sur les chiffres clés de l'année 2021-2022."
            }
          },
          {
            "document_attributes" =>
           {
             "file" => "https://www.restosducoeur.org/wp-content/uploads/2022/09/synthese-etude-besoins-des-pa-vf.pdf",
             "name" => "Synthèse de l'étude besoins des personnes accueillies",
             "type" => "Rapport d'activité",
             "year" => 2022,
             "description" => "Rapport sur les besoins des personnes accueillies."
           }
          },
          {
            "document_attributes" =>
           {
             "file" => "https://www.restosducoeur.org/wp-content/uploads/2021/03/cp-bilan-collecte-2021.pdf",
             "name" => "Bilan collecte 2021",
             "type" => "Rapport d'activité",
             "year" => 2021,
             "description" => "Bilan des 7 800 tonnes de denrées alimentaires et de produits de première nécessité récoltées."
           }
          },
          {
            "document_attributes" => {
              "file" => "",
              "name" => "",
              "type" => "Statuts",
              "year" => 0,
              "description" => ""
            }
          },
          {
            "document_attributes" => {
              "file" => "",
              "name" => "",
              "type" => "Rapport financier",
              "year" => 0,
              "description" => ""
            }
          },
          {
            "document_attributes" => {
              "file" => "",
              "name" => "",
              "type" => "Procès verbal",
              "year" => 0,
              "description" => ""
            }
          },
          {
            "document_attributes" => {
              "file" => "https://www.restosducoeur.org/wp-content/uploads/2016/04/essentiel_2021-2022.pdf",
              "name" => "L'Essentiel 2021-2022",
              "type" => "Rapport d'activité",
              "year" => 2022,
              "description" => "Rapport d'activité des Restos du Cœur pour l'année 2021-2022."
            }
          },
          {
            "document_attributes" => {
              "file" => "https://www.restosducoeur.org/wp-content/uploads/2016/04/essentiel_2021-2022.pdf",
              "name" => "L'Essentiel 2021-2022",
              "type" => "Rapport financier",
              "year" => 2022,
              "description" => "Rapport financier des Restos du Cœur pour l'année 2021-2022."
            }
          },
          {
            "document_attributes" =>
           {
             "file" => "https://www.restosducoeur.org/wp-content/uploads/2023/11/etude-personnes-accueillies-2024.pdf",
             "name" => "Étude I Personnes accueillies à l'aide alimentaire des Restos du Cœur 2023/2024",
             "type" => "Rapport d'activité",
             "year" => 2024,
             "description" => "Rapport sur les caractéristiques des personnes accueillies."
           }
          },
          {
            "document_attributes" =>
           {
             "file" => "https://www.restosducoeur.org/wp-content/uploads/2020/11/flyer-utilite-sociale-des-aci-restos-du-coeur-.pdf",
             "name" => "Utilité sociale des chantiers d'insertion",
             "type" => "Rapport d'activité",
             "year" => 2019,
             "description" => "Étude d'impact sur l'utilité sociale des ACI des Restos du Cœur"
           }
          },
          {
            "document_attributes" =>
           {
             "file" => "https://www.restosducoeur.org/wp-content/uploads/2024/11/ra-23_24-complet-pap_bd.pdf",
             "name" => "Rapport annuel 2023-2024",
             "type" => "Rapport d'activité",
             "year" => 2024,
             "description" => "Rapport annuel détaillant les activités et finances de l'organisation."
           }
          },
          {
            "document_attributes" => {
              "file" => "https://www.restosducoeur.org/wp-content/uploads/2024/11/affiche_chiffrescles_c40_traits_coupe.pdf",
              "name" => "Chiffres clefs 2023-2024",
              "type" => "Chiffres clés",
              "year" => 2024,
              "description" => "Résumé des chiffres clés de l'année."
            }
          },
          {
            "document_attributes" => {
              "file" => "https://www.restosducoeur.org/wp-content/uploads/2016/04/Rapport_CDC_2009.pdf",
              "name" => "Rapport 2009 de la Cour des Comptes",
              "type" => "Rapport financier",
              "year" => 2009,
              "description" => "Rapport de la Cour des Comptes sur la gestion de l'association."
            }
          },
          {
            "document_attributes" => {
              "file" => "",
              "name" => "",
              "type" => "Rapport d'activité",
              "year" => 2023,
              "description" => ""
            }
          },
          {
            "document_attributes" => {
              "file" => "",
              "name" => "",
              "type" => "Rapport financier",
              "year" => 2023,
              "description" => ""
            }
          }
        ],
        "osbls_intervention_areas_attributes" => [
          {
            "name" => "France"
          },
          {
            "name" => "Ain"
          },
          {
            "name" => "Île-de-France"
          },
          {
            "name" => "Val d'Akor"
          },
          {
            "name" => "Bouches-du-Rhône"
          },
          {
            "name" => "Creuse"
          },
          {
            "name" => "Finistère"
          },
          {
            "name" => "Essonne"
          },
          {
            "name" => "Europe"
          },
          {
            "name" => "Haute-Savoie"
          },
          {
            "name" => "Ambilly"
          },
          {
            "name" => "Haute-Saône"
          },
          {
            "name" => "Auvergne-Rhône-Alpes"
          },
          {
            "name" => "Seine-Saint-Denis"
          },
          {
            "name" => "Paris"
          },
          {
            "name" => "Cantal"
          },
          {
            "name" => "Gard"
          }
        ]
      }
    end

    let(:user) { create(:user) }
    let(:osbl_import) { create(:osbl_import, user: user, extracted_data: extracted_data) }

    before do
      Osbl::Cause.create!(name: "Lutte contre la précarité")
      Osbl::Cause.create!(name: "Aide internationale")
      Osbl::Label.create!(name: "Don en Confiance")
    end

    it "finds the OsblImport by id", :vcr do
      allow(OsblImport).to receive(:find).and_call_original
      described_class.perform_now(osbl_import.id)
      expect(OsblImport).to have_received(:find).with(osbl_import.id)
    end

    context "when the import is successful" do
      it "creates a contribution" do
        expect { described_class.perform_now(osbl_import.id) }
          .to change(Contribution, :count).by(1)
      end

      it "updates the osbl_import status to completed" do
        described_class.perform_now(osbl_import.id)
        expect(osbl_import.reload.status).to eq("completed")
      end

      it "associates the contribution with the osbl_import" do
        described_class.perform_now(osbl_import.id)
        expect(osbl_import.reload.contribution).to be_present
      end

      it "creates a contribution owned by the import's user" do
        described_class.perform_now(osbl_import.id)
        expect(osbl_import.reload.contribution.user).to eq(user)
      end
    end

    context "when processing annual finances" do
      context "when there are duplicate years" do
        let(:extracted_data) do
          super().merge(
            "annual_finances_attributes" => [
              {
                "year" => 2023,
                "budget" => 13000000,
                "treasury" => 6500000,
                "certified" => true,
                "employees_count" => 230,
                "fund_sources_attributes" => [
                  {
                    "type" => "Dons",
                    "amount" => 9100000,
                    "percent" => 70
                  }
                ],
                "fund_allocations_attributes" => [
                  {
                    "type" => "Missions sociales",
                    "amount" => 10400000,
                    "percent" => 100
                  }
                ]
              },
              {
                "year" => 2023,
                "budget" => 15000000,
                "treasury" => 7500000,
                "certified" => true,
                "employees_count" => 250,
                "fund_sources_attributes" => [
                  {
                    "type" => "Dons",
                    "amount" => 10500000,
                    "percent" => 70
                  }
                ],
                "fund_allocations_attributes" => [
                  {
                    "type" => "Missions sociales",
                    "amount" => 12000000,
                    "percent" => 100
                  }
                ]
              }
            ]
          )
        end

        it "takes only the first entry for each year" do
          described_class.perform_now(osbl_import.id)
          contribution = osbl_import.reload.contribution
          annual_finances = contribution.contributable.osbl_data["annual_finances_attributes"]

          expect(annual_finances.length).to eq(1)
          expect(annual_finances.first["budget"]).to eq(13000000)
          expect(annual_finances.first["employees_count"]).to eq(230)
        end
      end

      context "when fund sources have duplicate types" do
        let(:extracted_data) do
          super().merge(
            "annual_finances_attributes" => [
              {
                "year" => 2023,
                "budget" => 13000000,
                "treasury" => 6500000,
                "certified" => true,
                "employees_count" => 230,
                "fund_sources_attributes" => [
                  {
                    "type" => "Dons",
                    "amount" => 9100000,
                    "percent" => 70
                  },
                  {
                    "type" => "Dons",
                    "amount" => 9100000,
                    "percent" => 70
                  },
                  {
                    "type" => "Aides publiques",
                    "amount" => 2600000,
                    "percent" => 20
                  },
                  {
                    "type" => "Revenus d'activités",
                    "amount" => 1300000,
                    "percent" => 10
                  }
                ],
                "fund_allocations_attributes" => [
                  {
                    "type" => "Missions sociales",
                    "amount" => 10400000,
                    "percent" => 100
                  }
                ]
              }
            ]
          )
        end

        it "takes only the first entry for each type" do
          described_class.perform_now(osbl_import.id)
          contribution = osbl_import.reload.contribution
          annual_finances = contribution.contributable.osbl_data["annual_finances_attributes"]
          fund_sources = annual_finances.first["fund_sources_attributes"]

          expect(fund_sources.length).to eq(3)
          expect(fund_sources.count { |s| s["type"] == "Dons" }).to eq(1)
        end
      end

      context "when fund sources percentages don't sum to 100" do
        let(:extracted_data) do
          super().merge(
            "annual_finances_attributes" => [
              {
                "year" => 2023,
                "budget" => 13000000,
                "treasury" => 6500000,
                "certified" => true,
                "employees_count" => 230,
                "fund_sources_attributes" => [
                  {
                    "type" => "Dons",
                    "amount" => 9100000,
                    "percent" => 70
                  },
                  {
                    "type" => "Aides publiques",
                    "amount" => 2600000,
                    "percent" => 20
                  },
                  {
                    "type" => "Revenus d'activités",
                    "amount" => 1300000,
                    "percent" => 5
                  }
                ],
                "fund_allocations_attributes" => [
                  {
                    "type" => "Missions sociales",
                    "amount" => 10400000,
                    "percent" => 100
                  }
                ]
              }
            ]
          )
        end

        it "excludes fund sources" do
          described_class.perform_now(osbl_import.id)
          contribution = osbl_import.reload.contribution
          annual_finances = contribution.contributable.osbl_data["annual_finances_attributes"]

          expect(annual_finances.first["fund_sources_attributes"]).to be_nil
        end
      end

      context "when fund allocations percentages don't sum to 100" do
        let(:extracted_data) do
          super().merge(
            "annual_finances_attributes" => [
              {
                "year" => 2023,
                "budget" => 13000000,
                "treasury" => 6500000,
                "certified" => true,
                "employees_count" => 230,
                "fund_sources_attributes" => [
                  {
                    "type" => "Dons",
                    "amount" => 9100000,
                    "percent" => 100
                  }
                ],
                "fund_allocations_attributes" => [
                  {
                    "type" => "Missions sociales",
                    "amount" => 10400000,
                    "percent" => 80
                  },
                  {
                    "type" => "Frais de fonctionnement",
                    "amount" => 1950000,
                    "percent" => 15
                  },
                  {
                    "type" => "Frais de recherche de fonds",
                    "amount" => 650000,
                    "percent" => 3
                  }
                ]
              }
            ]
          )
        end

        it "excludes fund allocations" do
          described_class.perform_now(osbl_import.id)
          contribution = osbl_import.reload.contribution
          annual_finances = contribution.contributable.osbl_data["annual_finances_attributes"]

          expect(annual_finances.first["fund_allocations_attributes"]).to be_nil
        end
      end
    end

    context "when required fields are missing" do
      context "when name is missing" do
        let(:extracted_data) { super().merge("name" => nil) }

        it "raises an InvalidOsblImportData error" do
          expect {
            described_class.perform_now(osbl_import.id)
          }.to raise_error(OsblCreationFromImportJob::InvalidOsblImportData)
        end
      end

      context "when tax_reduction is missing" do
        let(:extracted_data) { super().merge("tax_reduction" => nil) }

        it "raises an InvalidOsblImportData error" do
          expect {
            described_class.perform_now(osbl_import.id)
          }.to raise_error(OsblCreationFromImportJob::InvalidOsblImportData)
        end
      end

      context "when osbls_causes_attributes is missing" do
        let(:extracted_data) { super().merge("osbls_causes_attributes" => []) }

        it "raises an InvalidOsblImportData error" do
          expect {
            described_class.perform_now(osbl_import.id)
          }.to raise_error(OsblCreationFromImportJob::InvalidOsblImportData)
        end
      end
    end

    context "when optional fields are missing" do
      let(:optional_fields) do
        %w[
          logo website osbl_type description creation_year public_utility
          geographical_scale locations_attributes osbls_labels_attributes
          osbls_keywords_attributes annual_finances_attributes
          document_attachments_attributes osbls_intervention_areas_attributes
        ]
      end

      it "processes the import successfully when each optional field is missing" do
        optional_fields.each do |field|
          data = extracted_data.deep_dup
          data.delete(field)
          osbl_import.update!(extracted_data: data)

          expect {
            described_class.perform_now(osbl_import.id)
          }.not_to raise_error
        end
      end
    end

    context "when the OsblImport is not found" do
      it "raises an ActiveRecord::RecordNotFound error" do
        expect {
          described_class.perform_now(-1)
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
