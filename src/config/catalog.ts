import type { CatalogCategory } from '../types/catalog'

export const catalogCategories: readonly CatalogCategory[] = [
  {
    "id": "salados",
    "label": "Salados",
    "collection": "cocktail",
    "items": [
      {
        "id": "salados-1",
        "name": "Mini tapadito",
        "description": "Un pequeño clásico para compartir.",
        "image": "images/catalog/salados-1-original.webp",
        "price": 400,
        "imageWidth": 561,
        "imageHeight": 449,
        "imageBounds": {
          "x": 46,
          "y": 62,
          "width": 460,
          "height": 358
        }
      },
      {
        "id": "salados-2",
        "name": "Canapé",
        "description": "Bocados para abrir la celebración.",
        "image": "images/catalog/salados-2-v2.webp",
        "price": 400,
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageBounds": {
          "x": 63,
          "y": 229,
          "width": 1034,
          "height": 805
        },
        "imageSmall": "images/catalog/salados-2-v2-600.webp",
        "imageSmallWidth": 600
      },
      {
        "id": "salados-3",
        "name": "Crostini",
        "description": "Una base crocante para empezar.",
        "image": "images/catalog/salados-3-original.webp",
        "price": 400,
        "imageWidth": 512,
        "imageHeight": 768,
        "imageBounds": {
          "x": 21,
          "y": 270,
          "width": 475,
          "height": 326
        }
      },
      {
        "id": "salados-4",
        "name": "Ceviche de jurel",
        "description": "Fresco, cítrico y marino.",
        "image": "images/catalog/salados-4-original.webp",
        "price": 400,
        "imageWidth": 701,
        "imageHeight": 561,
        "imageBounds": {
          "x": 77,
          "y": 63,
          "width": 541,
          "height": 454
        }
      },
      {
        "id": "salados-5",
        "name": "Pincho",
        "description": "Tomate, queso, aceituna y jamón.",
        "image": "images/catalog/salados-5-original.webp",
        "price": 400,
        "imageWidth": 580,
        "imageHeight": 435,
        "imageBounds": {
          "x": 58,
          "y": 51,
          "width": 460,
          "height": 359
        }
      }
    ]
  },
  {
    "id": "dulces",
    "label": "Dulces",
    "collection": "cocktail",
    "items": [
      {
        "id": "dulces-1",
        "name": "Cupcake",
        "description": "Dulzura en formato pequeño.",
        "image": "images/catalog/dulces-1-original.webp",
        "price": 400,
        "imageWidth": 580,
        "imageHeight": 435,
        "imageBounds": {
          "x": 70,
          "y": 13,
          "width": 446,
          "height": 409
        }
      },
      {
        "id": "dulces-2",
        "name": "Brocheta de fruta",
        "description": "Frutas de temporada.",
        "image": "images/catalog/dulces-2-original.webp",
        "price": 400,
        "imageWidth": 580,
        "imageHeight": 435,
        "imageBounds": {
          "x": 58,
          "y": 49,
          "width": 462,
          "height": 374
        }
      },
      {
        "id": "dulces-3",
        "name": "Vasito de postre",
        "description": "Un dulce servido individualmente.",
        "image": "images/catalog/dulces-3-original.webp",
        "price": 400,
        "imageWidth": 580,
        "imageHeight": 435,
        "imageBounds": {
          "x": 58,
          "y": 38,
          "width": 463,
          "height": 383
        }
      },
      {
        "id": "dulces-4",
        "name": "Tartaleta",
        "description": "Un pequeño final para compartir.",
        "image": "images/catalog/dulces-4-original.webp",
        "price": 400,
        "imageWidth": 580,
        "imageHeight": 435,
        "imageBounds": {
          "x": 72,
          "y": 20,
          "width": 436,
          "height": 407
        }
      },
      {
        "id": "dulces-5",
        "name": "Pie de limón",
        "description": "El encuentro del cítrico y el merengue.",
        "image": "images/catalog/dulces-5-original.webp",
        "price": 400,
        "imageWidth": 580,
        "imageHeight": 435,
        "imageBounds": {
          "x": 72,
          "y": 19,
          "width": 434,
          "height": 407
        }
      }
    ]
  },
  {
    "id": "extras",
    "label": "Extras",
    "collection": "cocktail",
    "items": [
      {
        "id": "extras-1",
        "name": "Brocheta de carne o pollo",
        "description": "Una alternativa para complementar el cóctel.",
        "image": "images/catalog/extras-1-original.webp",
        "price": 600,
        "imageWidth": 580,
        "imageHeight": 435,
        "imageBounds": {
          "x": 82,
          "y": 6,
          "width": 414,
          "height": 415
        }
      },
      {
        "id": "extras-2",
        "name": "Empanaditas",
        "description": "Un clásico que siempre acompaña.",
        "image": "images/catalog/extras-2-original.webp",
        "price": 600,
        "imageWidth": 561,
        "imageHeight": 701,
        "imageBounds": {
          "x": 38,
          "y": 306,
          "width": 486,
          "height": 287
        }
      }
    ]
  },
  {
    "id": "aperitivos",
    "label": "Aperitivos",
    "collection": "drinks",
    "items": [
      {
        "id": "aperitivos-1",
        "name": "Mango sour",
        "description": "Mango tropical y pisco.",
        "image": "images/catalog/banquet/aperitivos-1.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/aperitivos-1-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 265,
          "y": 114,
          "width": 677,
          "height": 1010
        }
      },
      {
        "id": "aperitivos-2",
        "name": "Pisco sour",
        "description": "Pisco, limón y espuma.",
        "image": "images/catalog/banquet/aperitivos-2.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/aperitivos-2-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 271,
          "y": 83,
          "width": 643,
          "height": 1066
        }
      },
      {
        "id": "aperitivos-3",
        "name": "Champagne",
        "description": "Burbujas para celebrar.",
        "image": "images/catalog/banquet/aperitivos-3.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/aperitivos-3-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 436,
          "y": 67,
          "width": 319,
          "height": 1072
        }
      },
      {
        "id": "aperitivos-4",
        "name": "Cazuela de champagne",
        "description": "Espumante y frutas.",
        "image": "images/catalog/banquet/aperitivos-4-v2.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/aperitivos-4-v2-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 242,
          "y": 50,
          "width": 711,
          "height": 1104
        }
      },
      {
        "id": "aperitivos-5",
        "name": "Primavera",
        "description": "Cóctel fresco y frutal.",
        "image": "images/catalog/banquet/aperitivos-5.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/aperitivos-5-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 377,
          "y": 61,
          "width": 446,
          "height": 1080
        }
      },
      {
        "id": "aperitivos-6",
        "name": "Limonada",
        "description": "Cítrica y refrescante.",
        "image": "images/catalog/banquet/aperitivos-6.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/aperitivos-6-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 325,
          "y": 79,
          "width": 550,
          "height": 1052
        }
      },
      {
        "id": "aperitivos-7",
        "name": "Jugo natural",
        "description": "Fruta de estación.",
        "image": "images/catalog/banquet/aperitivos-7.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/aperitivos-7-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 287,
          "y": 111,
          "width": 617,
          "height": 995
        }
      },
      {
        "id": "aperitivos-8",
        "name": "Bebida",
        "description": "Variedades disponibles.",
        "image": "images/catalog/banquet/aperitivos-8.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/aperitivos-8-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 265,
          "y": 90,
          "width": 661,
          "height": 1012
        }
      },
      {
        "id": "aperitivos-9",
        "name": "Vaina",
        "description": "Cremosa y especiada.",
        "image": "images/catalog/banquet/aperitivos-9.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/aperitivos-9-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 252,
          "y": 77,
          "width": 687,
          "height": 1073
        }
      }
    ]
  },
  {
    "id": "entradas",
    "label": "Entradas",
    "collection": "banquet",
    "items": [
      {
        "id": "entradas-1",
        "name": "Palta camarón",
        "description": "Palta y camarones.",
        "image": "images/catalog/banquet/entradas-1.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/entradas-1-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 66,
          "y": 280,
          "width": 1053,
          "height": 765
        }
      },
      {
        "id": "entradas-2",
        "name": "Palta reina",
        "description": "Palta rellena clásica.",
        "image": "images/catalog/banquet/entradas-2.webp",
        "imageWidth": 1200,
        "imageHeight": 1097,
        "imageSmall": "images/catalog/banquet/entradas-2-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 93,
          "y": 214,
          "width": 994,
          "height": 792
        }
      },
      {
        "id": "entradas-3",
        "name": "Jamón relleno",
        "description": "Relleno cremoso y suave.",
        "image": "images/catalog/banquet/entradas-3.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/entradas-3-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 39,
          "y": 280,
          "width": 1090,
          "height": 752
        }
      },
      {
        "id": "entradas-4",
        "name": "Machas",
        "description": "Frescura de la costa.",
        "image": "images/catalog/banquet/entradas-4.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/entradas-4-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 12,
          "y": 101,
          "width": 1173,
          "height": 1038
        }
      },
      {
        "id": "entradas-5",
        "name": "Ceviche",
        "description": "Cítrico, fresco y marino.",
        "image": "images/catalog/banquet/entradas-5.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/entradas-5-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 73,
          "y": 218,
          "width": 1043,
          "height": 766
        }
      },
      {
        "id": "entradas-6",
        "name": "Alcachofa rellena",
        "description": "Corazón suave y cremoso.",
        "image": "images/catalog/banquet/entradas-6.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/entradas-6-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 93,
          "y": 255,
          "width": 1004,
          "height": 781
        }
      },
      {
        "id": "entradas-7",
        "name": "Tomate relleno",
        "description": "Fresco y jugoso.",
        "image": "images/catalog/banquet/entradas-7.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/entradas-7-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 104,
          "y": 257,
          "width": 988,
          "height": 756
        }
      },
      {
        "id": "entradas-8",
        "name": "Loco mayonesa",
        "description": "Suave y costero.",
        "image": "images/catalog/banquet/entradas-8.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/entradas-8-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 36,
          "y": 218,
          "width": 1119,
          "height": 854
        }
      },
      {
        "id": "entradas-9",
        "name": "Salmón en salsa",
        "description": "Elegante y suave.",
        "image": "images/catalog/banquet/entradas-9.webp",
        "imageWidth": 1200,
        "imageHeight": 800,
        "imageSmall": "images/catalog/banquet/entradas-9-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 82,
          "y": 100,
          "width": 1027,
          "height": 631
        }
      }
    ]
  },
  {
    "id": "principales",
    "label": "Principales",
    "collection": "banquet",
    "items": [
      {
        "id": "principales-1",
        "name": "Medallón de res",
        "description": "Sellado y jugoso.",
        "image": "images/catalog/banquet/principales-1.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/principales-1-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 66,
          "y": 234,
          "width": 1030,
          "height": 801
        }
      },
      {
        "id": "principales-2",
        "name": "Lomo de cerdo",
        "description": "Tierno y dorado.",
        "image": "images/catalog/banquet/principales-2.webp",
        "imageWidth": 1200,
        "imageHeight": 800,
        "imageSmall": "images/catalog/banquet/principales-2-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 80,
          "y": 83,
          "width": 1027,
          "height": 661
        }
      },
      {
        "id": "principales-3",
        "name": "Pulpa de cerdo",
        "description": "Suave y laminada.",
        "image": "images/catalog/banquet/principales-3.webp",
        "imageWidth": 1200,
        "imageHeight": 800,
        "imageSmall": "images/catalog/banquet/principales-3-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 96,
          "y": 127,
          "width": 971,
          "height": 606
        }
      },
      {
        "id": "principales-4",
        "name": "Cordón bleu",
        "description": "Relleno y crocante.",
        "image": "images/catalog/banquet/principales-4.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/principales-4-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 45,
          "y": 245,
          "width": 1109,
          "height": 768
        }
      },
      {
        "id": "principales-5",
        "name": "Medallón de pavo",
        "description": "Magro y sellado.",
        "image": "images/catalog/banquet/principales-5.webp",
        "imageWidth": 1200,
        "imageHeight": 1097,
        "imageSmall": "images/catalog/banquet/principales-5-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 61,
          "y": 218,
          "width": 1051,
          "height": 740
        }
      },
      {
        "id": "principales-6",
        "name": "Salmón a la plancha",
        "description": "Suave y elegante.",
        "image": "images/catalog/banquet/principales-6.webp",
        "imageWidth": 1200,
        "imageHeight": 800,
        "imageSmall": "images/catalog/banquet/principales-6-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 114,
          "y": 138,
          "width": 947,
          "height": 591
        }
      },
      {
        "id": "principales-7",
        "name": "Vacuno mechada",
        "description": "Cocción lenta y sabrosa.",
        "image": "images/catalog/banquet/principales-7.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/principales-7-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 53,
          "y": 245,
          "width": 1065,
          "height": 762
        }
      },
      {
        "id": "principales-8",
        "name": "Pechuga de pollo",
        "description": "Dorada a la plancha.",
        "image": "images/catalog/banquet/principales-8.webp",
        "imageWidth": 1200,
        "imageHeight": 800,
        "imageSmall": "images/catalog/banquet/principales-8-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 74,
          "y": 76,
          "width": 1025,
          "height": 691
        }
      },
      {
        "id": "principales-9",
        "name": "Lomo liso",
        "description": "Parrillado y jugoso.",
        "image": "images/catalog/banquet/principales-9.webp",
        "imageWidth": 1200,
        "imageHeight": 800,
        "imageSmall": "images/catalog/banquet/principales-9-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 136,
          "y": 114,
          "width": 900,
          "height": 625
        }
      }
    ]
  },
  {
    "id": "guarniciones",
    "label": "Guarniciones",
    "collection": "banquet",
    "items": [
      {
        "id": "guarniciones-1",
        "name": "Papas rústicas",
        "description": "Doradas y sazonadas.",
        "image": "images/catalog/banquet/guarniciones-1.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/guarniciones-1-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 53,
          "y": 250,
          "width": 1066,
          "height": 765
        }
      },
      {
        "id": "guarniciones-2",
        "name": "Papas al perejil",
        "description": "Suaves y herbales.",
        "image": "images/catalog/banquet/guarniciones-2.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/guarniciones-2-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 62,
          "y": 280,
          "width": 1039,
          "height": 744
        }
      },
      {
        "id": "guarniciones-3",
        "name": "Papas mayo",
        "description": "Cremosas y frescas.",
        "image": "images/catalog/banquet/guarniciones-3.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/guarniciones-3-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 77,
          "y": 175,
          "width": 1026,
          "height": 874
        }
      },
      {
        "id": "guarniciones-4",
        "name": "Verduras salteadas",
        "description": "Coloridas y salteadas.",
        "image": "images/catalog/banquet/guarniciones-4.webp",
        "imageWidth": 1200,
        "imageHeight": 800,
        "imageSmall": "images/catalog/banquet/guarniciones-4-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 90,
          "y": 123,
          "width": 967,
          "height": 615
        }
      },
      {
        "id": "guarniciones-5",
        "name": "Arroz primavera",
        "description": "Fresco y con verduras.",
        "image": "images/catalog/banquet/guarniciones-5.webp",
        "imageWidth": 1200,
        "imageHeight": 800,
        "imageSmall": "images/catalog/banquet/guarniciones-5-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 111,
          "y": 121,
          "width": 955,
          "height": 585
        }
      },
      {
        "id": "guarniciones-6",
        "name": "Papas duquesas",
        "description": "Doradas y delicadas.",
        "image": "images/catalog/banquet/guarniciones-6.webp",
        "imageWidth": 1200,
        "imageHeight": 800,
        "imageSmall": "images/catalog/banquet/guarniciones-6-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 85,
          "y": 67,
          "width": 995,
          "height": 672
        }
      },
      {
        "id": "guarniciones-7",
        "name": "Papas doradas",
        "description": "Crujientes por fuera.",
        "image": "images/catalog/banquet/guarniciones-7.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/guarniciones-7-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 88,
          "y": 335,
          "width": 1010,
          "height": 672
        }
      },
      {
        "id": "guarniciones-8",
        "name": "Puré de color",
        "description": "Cremoso y suave.",
        "image": "images/catalog/banquet/guarniciones-8.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/guarniciones-8-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 90,
          "y": 261,
          "width": 993,
          "height": 739
        }
      },
      {
        "id": "guarniciones-9",
        "name": "Arroz al curry",
        "description": "Aromático y especiado.",
        "image": "images/catalog/banquet/guarniciones-9.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/guarniciones-9-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 83,
          "y": 301,
          "width": 1009,
          "height": 699
        }
      }
    ]
  },
  {
    "id": "salsas",
    "label": "Salsas",
    "collection": "banquet",
    "items": [
      {
        "id": "salsas-1",
        "name": "Salsa de carne",
        "description": "Intensa y sabrosa.",
        "image": "images/catalog/banquet/salsas-1.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/salsas-1-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 99,
          "y": 144,
          "width": 992,
          "height": 939
        }
      },
      {
        "id": "salsas-2",
        "name": "Salsa blanca",
        "description": "Suave y cremosa.",
        "image": "images/catalog/banquet/salsas-2.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/salsas-2-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 134,
          "y": 210,
          "width": 907,
          "height": 866
        }
      },
      {
        "id": "salsas-3",
        "name": "Salsa de verduras",
        "description": "Ligera y aromática.",
        "image": "images/catalog/banquet/salsas-3.webp",
        "imageWidth": 1200,
        "imageHeight": 1097,
        "imageSmall": "images/catalog/banquet/salsas-3-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 176,
          "y": 172,
          "width": 821,
          "height": 794
        }
      },
      {
        "id": "salsas-4",
        "name": "Salsa de champiñón",
        "description": "Cremosa con champiñones.",
        "image": "images/catalog/banquet/salsas-4.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/salsas-4-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 123,
          "y": 169,
          "width": 931,
          "height": 902
        }
      },
      {
        "id": "salsas-5",
        "name": "Salsa de maní",
        "description": "Tostada y cremosa.",
        "image": "images/catalog/banquet/salsas-5.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/salsas-5-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 155,
          "y": 215,
          "width": 855,
          "height": 822
        }
      },
      {
        "id": "salsas-6",
        "name": "Salsa de almendras",
        "description": "Suave y delicada.",
        "image": "images/catalog/banquet/salsas-6.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/salsas-6-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 157,
          "y": 211,
          "width": 862,
          "height": 836
        }
      },
      {
        "id": "salsas-7",
        "name": "Salsa de nueces",
        "description": "Cremosa e intensa.",
        "image": "images/catalog/banquet/salsas-7.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/salsas-7-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 172,
          "y": 221,
          "width": 827,
          "height": 822
        }
      },
      {
        "id": "salsas-8",
        "name": "Salsa de cilantro",
        "description": "Fresca y herbal.",
        "image": "images/catalog/banquet/salsas-8.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/salsas-8-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 160,
          "y": 207,
          "width": 838,
          "height": 828
        }
      },
      {
        "id": "salsas-9",
        "name": "Salsa de choclo",
        "description": "Sabrosa y cremosa.",
        "image": "images/catalog/banquet/salsas-9.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/salsas-9-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 130,
          "y": 207,
          "width": 900,
          "height": 876
        }
      }
    ]
  },
  {
    "id": "postres",
    "label": "Postres",
    "collection": "banquet",
    "items": [
      {
        "id": "postres-1",
        "name": "Tiramisú",
        "description": "Café, cacao y crema.",
        "image": "images/catalog/banquet/postres-1.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/postres-1-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 47,
          "y": 232,
          "width": 1097,
          "height": 797
        }
      },
      {
        "id": "postres-2",
        "name": "Mousse",
        "description": "Fresa dulce y cremosa.",
        "image": "images/catalog/banquet/postres-2.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/postres-2-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 229,
          "y": 74,
          "width": 732,
          "height": 1045
        }
      },
      {
        "id": "postres-3",
        "name": "Carlota",
        "description": "Capas suaves y cremosas.",
        "image": "images/catalog/banquet/postres-3.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/postres-3-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 43,
          "y": 247,
          "width": 1112,
          "height": 773
        }
      },
      {
        "id": "postres-4",
        "name": "Leche asada",
        "description": "Caramelo intenso.",
        "image": "images/catalog/banquet/postres-4.webp",
        "imageWidth": 1200,
        "imageHeight": 1097,
        "imageSmall": "images/catalog/banquet/postres-4-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 79,
          "y": 212,
          "width": 1026,
          "height": 723
        }
      },
      {
        "id": "postres-5",
        "name": "Suspiro limeño",
        "description": "Merengue cítrico.",
        "image": "images/catalog/banquet/postres-5.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/postres-5-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 230,
          "y": 64,
          "width": 739,
          "height": 1079
        }
      },
      {
        "id": "postres-6",
        "name": "Macedonia",
        "description": "Frutas frescas y helado.",
        "image": "images/catalog/banquet/postres-6.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/postres-6-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 130,
          "y": 95,
          "width": 933,
          "height": 1035
        }
      },
      {
        "id": "postres-7",
        "name": "Tulipa de frutas",
        "description": "Canasta crocante y fruta.",
        "image": "images/catalog/banquet/postres-7.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/postres-7-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 83,
          "y": 123,
          "width": 1017,
          "height": 962
        }
      },
      {
        "id": "postres-8",
        "name": "Helado galleta",
        "description": "Helado, salsa y galleta.",
        "image": "images/catalog/banquet/postres-8.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/postres-8-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 181,
          "y": 62,
          "width": 838,
          "height": 1088
        }
      },
      {
        "id": "postres-9",
        "name": "Pie de limón",
        "description": "Cítrico y crocante.",
        "image": "images/catalog/banquet/postres-9.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/postres-9-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 52,
          "y": 183,
          "width": 1091,
          "height": 870
        }
      }
    ]
  },
  {
    "id": "bajativos",
    "label": "Bajativos",
    "collection": "drinks",
    "items": [
      {
        "id": "bajativos-1",
        "name": "Menta",
        "description": "Fresca e intensa.",
        "image": "images/catalog/banquet/bajativos-1.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/bajativos-1-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 360,
          "y": 125,
          "width": 480,
          "height": 994
        }
      },
      {
        "id": "bajativos-2",
        "name": "Manzanilla",
        "description": "Suave y delicada.",
        "image": "images/catalog/banquet/bajativos-2.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/bajativos-2-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 359,
          "y": 90,
          "width": 470,
          "height": 1034
        }
      },
      {
        "id": "bajativos-3",
        "name": "Anís",
        "description": "Aromático y dulce.",
        "image": "images/catalog/banquet/bajativos-3.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/bajativos-3-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 310,
          "y": 85,
          "width": 558,
          "height": 1069
        }
      },
      {
        "id": "bajativos-4",
        "name": "Bitter",
        "description": "Intenso y amargo.",
        "image": "images/catalog/banquet/bajativos-4.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/bajativos-4-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 377,
          "y": 89,
          "width": 440,
          "height": 1042
        }
      },
      {
        "id": "bajativos-5",
        "name": "Amaretto",
        "description": "Almendras y dulzor.",
        "image": "images/catalog/banquet/bajativos-5.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/bajativos-5-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 333,
          "y": 69,
          "width": 534,
          "height": 1063
        }
      },
      {
        "id": "bajativos-6",
        "name": "Cherry",
        "description": "Frutal e intenso.",
        "image": "images/catalog/banquet/bajativos-6.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/bajativos-6-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 349,
          "y": 93,
          "width": 501,
          "height": 1022
        }
      }
    ]
  },
  {
    "id": "nocturnos",
    "label": "Nocturnos",
    "collection": "banquet",
    "items": [
      {
        "id": "nocturnos-1",
        "name": "Consomé de carne",
        "description": "Vacuno cálido.",
        "image": "images/catalog/banquet/nocturnos-1.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/nocturnos-1-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 104,
          "y": 208,
          "width": 965,
          "height": 793
        }
      },
      {
        "id": "nocturnos-2",
        "name": "Consomé de ave",
        "description": "Cálido y reconfortante.",
        "image": "images/catalog/banquet/nocturnos-2.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/nocturnos-2-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 89,
          "y": 185,
          "width": 998,
          "height": 865
        }
      },
      {
        "id": "nocturnos-3",
        "name": "Crema de marisco",
        "description": "Cremosa y marina.",
        "image": "images/catalog/banquet/nocturnos-3.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/nocturnos-3-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 77,
          "y": 238,
          "width": 1046,
          "height": 795
        }
      },
      {
        "id": "nocturnos-4",
        "name": "Caldillo de congrio",
        "description": "Tradicional e intenso.",
        "image": "images/catalog/banquet/nocturnos-4.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/nocturnos-4-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 14,
          "y": 187,
          "width": 1172,
          "height": 849
        }
      }
    ]
  },
  {
    "id": "bar",
    "label": "Bar",
    "collection": "drinks",
    "items": [
      {
        "id": "bar-1",
        "name": "Ron",
        "description": "Dulce y cálido.",
        "image": "images/catalog/banquet/bar-1.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/bar-1-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 204,
          "y": 98,
          "width": 790,
          "height": 1002
        }
      },
      {
        "id": "bar-2",
        "name": "Pisco",
        "description": "Tradición nacional.",
        "image": "images/catalog/banquet/bar-2.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/bar-2-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 213,
          "y": 103,
          "width": 771,
          "height": 991
        }
      },
      {
        "id": "bar-3",
        "name": "Whisky",
        "description": "Robusto y elegante.",
        "image": "images/catalog/banquet/bar-3.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/bar-3-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 218,
          "y": 134,
          "width": 758,
          "height": 966
        }
      },
      {
        "id": "bar-4",
        "name": "Mojito",
        "description": "Lima, menta y frescura.",
        "image": "images/catalog/banquet/bar-4.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/bar-4-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 359,
          "y": 61,
          "width": 496,
          "height": 1086
        }
      },
      {
        "id": "bar-5",
        "name": "Cerveza",
        "description": "Fría y refrescante.",
        "image": "images/catalog/banquet/bar-5.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/bar-5-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 373,
          "y": 67,
          "width": 455,
          "height": 1090
        }
      },
      {
        "id": "bar-6",
        "name": "Vodka",
        "description": "Intenso y limpio.",
        "image": "images/catalog/banquet/bar-6.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/bar-6-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 250,
          "y": 166,
          "width": 691,
          "height": 908
        }
      },
      {
        "id": "bar-7",
        "name": "Piña colada",
        "description": "Piña suave.",
        "image": "images/catalog/banquet/bar-7.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/bar-7-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 375,
          "y": 28,
          "width": 524,
          "height": 1139
        }
      },
      {
        "id": "bar-8",
        "name": "Vino",
        "description": "Selección de la casa.",
        "image": "images/catalog/banquet/bar-8.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/bar-8-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 351,
          "y": 67,
          "width": 498,
          "height": 1072
        }
      },
      {
        "id": "bar-9",
        "name": "Tequila",
        "description": "Intenso y clásico.",
        "image": "images/catalog/banquet/bar-9.webp",
        "imageWidth": 1200,
        "imageHeight": 1200,
        "imageSmall": "images/catalog/banquet/bar-9-600.webp",
        "imageSmallWidth": 600,
        "imageBounds": {
          "x": 329,
          "y": 142,
          "width": 541,
          "height": 920
        }
      }
    ]
  }
]
