import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Admin',
      email: 'admin@aysha-accessoires.com',
      password: bcrypt.hashSync('admin123'),
      isAdmin: true,
    },
  ],
  products: [
    // BOUCLES D'OREILLES
    {
      name: 'Créoles Dorées Élégantes',
      slug: 'creoles-dorees-elegantes',
      category: 'boucles-oreilles',
      image: '/images/1000035687.jpg',
      price: 45,
      brand: 'Aysha',
      rating: 4.8,
      numReviews: 24,
      description: 'Magnifiques créoles en plaqué or, parfaites pour sublimer votre quotidien avec élégance.',
      isFeatured: true,

      colors: [
        {
          name: 'Or',
          images: ['/images/1000035687.jpg'],
          sizes: [
            { name: 'Unique', countInStock: 15 },
          ],
        },
      ],
    },

    {
      name: 'Puces Minimalistes',
      slug: 'puces-minimalistes',
      category: 'boucles-oreilles',
      image: '/images/1000035688.jpg',
      price: 29,
      brand: 'Aysha',
      rating: 4.5,
      numReviews: 18,
      description: 'Puces délicates et raffinées, idéales pour un look discret et chic.',

      colors: [
        {
          name: 'Argent',
          images: ['/images/1000035688.jpg'],
          sizes: [
            { name: 'Unique', countInStock: 20 },
          ],
        },
      ],
    },

    {
      name: 'Boucles Pendantes Perles',
      slug: 'boucles-pendantes-perles',
      category: 'boucles-oreilles',
      image: '/images/1000035690.jpg',
      price: 52,
      brand: 'Aysha',
      rating: 4.7,
      numReviews: 21,
      description: 'Boucles d\'oreilles pendantes ornées de perles délicates, élégance et féminité.',

      colors: [
        {
          name: 'Blanc Nacré',
          images: ['/images/1000035690.jpg'],
          sizes: [
            { name: 'Unique', countInStock: 12 },
          ],
        },
      ],
    },

    {
      name: 'Studs Géométriques Or',
      slug: 'studs-geometriques-or',
      category: 'boucles-oreilles',
      image: '/images/1000035691.jpg',
      price: 38,
      brand: 'Aysha',
      rating: 4.6,
      numReviews: 16,
      description: 'Boucles d\'oreilles au design géométrique moderne en plaqué or.',

      colors: [
        {
          name: 'Or',
          images: ['/images/1000035691.jpg'],
          sizes: [
            { name: 'Unique', countInStock: 18 },
          ],
        },
      ],
    },

    {
      name: 'Créoles Larges Texturées',
      slug: 'creoles-larges-texturees',
      category: 'boucles-oreilles',
      image: '/images/1000035692.jpg',
      price: 48,
      brand: 'Aysha',
      rating: 4.9,
      numReviews: 27,
      description: 'Grandes créoles avec texture martelée, statement parfait pour vos tenues.',
      isFeatured: true,

      colors: [
        {
          name: 'Or',
          images: ['/images/1000035692.jpg'],
          sizes: [
            { name: 'Unique', countInStock: 10 },
          ],
        },
      ],
    },

    // COLLIERS
    {
      name: 'Collier Chaîne Fine Or',
      slug: 'collier-chaine-fine-or',
      category: 'colliers',
      image: '/images/1000035689.jpg',
      price: 65,
      brand: 'Aysha',
      rating: 4.9,
      numReviews: 31,
      description: 'Collier fin en plaqué or 18 carats, élégance intemporelle garantie.',
      isFeatured: true,

      colors: [
        {
          name: 'Or',
          images: ['/images/1000035689.jpg'],
          sizes: [
            { name: '40cm', countInStock: 10 },
            { name: '45cm', countInStock: 12 },
          ],
        },
      ],
    },

    {
      name: 'Collier Pendentif Cœur',
      slug: 'collier-pendentif-coeur',
      category: 'colliers',
      image: '/images/1000035690.jpg',
      price: 55,
      brand: 'Aysha',
      rating: 4.7,
      numReviews: 26,
      description: 'Joli collier avec pendentif en forme de cœur, parfait pour offrir ou se faire plaisir.',

      colors: [
        {
          name: 'Or Rose',
          images: ['/images/1000035690.jpg'],
          sizes: [
            { name: '42cm', countInStock: 8 },
          ],
        },
      ],
    },

    // CHOKERS
    {
      name: 'Choker Velours Noir',
      slug: 'choker-velours-noir',
      category: 'chokers',
      image: '/images/1000035691.jpg',
      price: 35,
      brand: 'Aysha',
      rating: 4.6,
      numReviews: 15,
      description: 'Choker en velours noir avec détail doré, style moderne et sophistiqué.',

      colors: [
        {
          name: 'Noir',
          images: ['/images/1000035691.jpg'],
          sizes: [
            { name: 'Unique', countInStock: 12 },
          ],
        },
      ],
    },

    // BRACELETS
    {
      name: 'Bracelet Jonc Doré',
      slug: 'bracelet-jonc-dore',
      category: 'bracelets',
      image: '/images/1000035692.jpg',
      price: 42,
      brand: 'Aysha',
      rating: 4.8,
      numReviews: 22,
      description: 'Bracelet jonc en acier inoxydable doré, finition parfaite et style intemporel.',

      colors: [
        {
          name: 'Or',
          images: ['/images/1000035692.jpg'],
          sizes: [
            { name: 'S', countInStock: 5 },
            { name: 'M', countInStock: 10 },
            { name: 'L', countInStock: 7 },
          ],
        },
      ],
    },

    {
      name: 'Bracelet Perles Fines',
      slug: 'bracelet-perles-fines',
      category: 'bracelets',
      image: '/images/1000035693.jpg',
      price: 38,
      brand: 'Aysha',
      rating: 4.5,
      numReviews: 19,
      description: 'Bracelet délicat orné de perles fines, élégance et féminité assurées.',

      colors: [
        {
          name: 'Beige',
          images: ['/images/1000035693.jpg'],
          sizes: [
            { name: 'Unique', countInStock: 14 },
          ],
        },
      ],
    },

    // GOURMETTES
    {
      name: 'Gourmette Personnalisable',
      slug: 'gourmette-personnalisable',
      category: 'gourmettes',
      image: '/images/1000035687.jpg',
      price: 58,
      brand: 'Aysha',
      rating: 4.9,
      numReviews: 35,
      description: 'Gourmette en argent 925, personnalisable avec gravure (prénom, initiales, date).',
      isFeatured: true,

      colors: [
        {
          name: 'Argent',
          images: ['/images/1000035687.jpg'],
          sizes: [
            { name: '17cm', countInStock: 8 },
            { name: '19cm', countInStock: 10 },
          ],
        },
      ],
    },

    // BAGUES
    {
      name: 'Bague Solitaire Brillant',
      slug: 'bague-solitaire-brillant',
      category: 'bagues',
      image: '/images/1000035688.jpg',
      price: 75,
      brand: 'Aysha',
      rating: 5.0,
      numReviews: 42,
      description: 'Bague solitaire avec pierre brillante, pièce d\'exception pour toutes les occasions.',

      colors: [
        {
          name: 'Or Blanc',
          images: ['/images/1000035688.jpg'],
          sizes: [
            { name: '50', countInStock: 4 },
            { name: '52', countInStock: 6 },
            { name: '54', countInStock: 5 },
            { name: '56', countInStock: 3 },
          ],
        },
      ],
    },

    {
      name: 'Bague Anneau Fin Doré',
      slug: 'bague-anneau-fin-dore',
      category: 'bagues',
      image: '/images/1000035689.jpg',
      price: 32,
      brand: 'Aysha',
      rating: 4.6,
      numReviews: 28,
      description: 'Anneau fin et discret, parfait pour créer un look stacking moderne.',

      colors: [
        {
          name: 'Or',
          images: ['/images/1000035689.jpg'],
          sizes: [
            { name: '50', countInStock: 8 },
            { name: '52', countInStock: 10 },
            { name: '54', countInStock: 9 },
          ],
        },
      ],
    },

    // SACS
    {
      name: 'Mini Sac à Main Beige',
      slug: 'mini-sac-main-beige',
      category: 'sacs',
      image: '/images/1000035690.jpg',
      price: 95,
      brand: 'Aysha',
      rating: 4.7,
      numReviews: 17,
      description: 'Petit sac à main élégant en similicuir beige, idéal pour vos soirées.',

      colors: [
        {
          name: 'Beige',
          images: ['/images/1000035690.jpg'],
          sizes: [
            { name: 'Unique', countInStock: 6 },
          ],
        },
      ],
    },

    // FOULARDS
    {
      name: 'Foulard Soie Motifs Dorés',
      slug: 'foulard-soie-motifs-dores',
      category: 'foulards',
      image: '/images/1000035691.jpg',
      price: 48,
      brand: 'Aysha',
      rating: 4.8,
      numReviews: 21,
      description: 'Foulard en soie avec motifs dorés, accessoire chic pour sublimer vos tenues.',

      colors: [
        {
          name: 'Beige et Or',
          images: ['/images/1000035691.jpg'],
          sizes: [
            { name: 'Unique', countInStock: 10 },
          ],
        },
      ],
    },

    // PARURES
    {
      name: 'Parure Complète Or',
      slug: 'parure-complete-or',
      category: 'parures',
      image: '/images/1000035692.jpg',
      price: 135,
      brand: 'Aysha',
      rating: 5.0,
      numReviews: 29,
      description: 'Ensemble complet : collier, boucles d\'oreilles et bracelet assortis en plaqué or.',
      isFeatured: true,

      colors: [
        {
          name: 'Or',
          images: ['/images/1000035692.jpg'],
          sizes: [
            { name: 'Unique', countInStock: 5 },
          ],
        },
      ],
    },

    // PORTEFEUILLES
    {
      name: 'Portefeuille Cuir Beige',
      slug: 'portefeuille-cuir-beige',
      category: 'portefeuilles',
      image: '/images/1000035693.jpg',
      price: 68,
      brand: 'Aysha',
      rating: 4.6,
      numReviews: 14,
      description: 'Portefeuille compact en cuir beige, élégant et pratique avec multiples rangements.',

      colors: [
        {
          name: 'Beige',
          images: ['/images/1000035693.jpg'],
          sizes: [
            { name: 'Unique', countInStock: 12 },
          ],
        },
      ],
    },

    // LUNETTES
    {
      name: 'Lunettes de Soleil Oversize',
      slug: 'lunettes-soleil-oversize',
      category: 'lunettes',
      image: '/images/1000035687.jpg',
      price: 85,
      brand: 'Aysha',
      rating: 4.7,
      numReviews: 23,
      description: 'Lunettes de soleil oversize avec protection UV400, style et protection garantis.',

      colors: [
        {
          name: 'Écaille',
          images: ['/images/1000035687.jpg'],
          sizes: [
            { name: 'Unique', countInStock: 8 },
          ],
        },
      ],
    },

    // BRACELETS DE CHEVILLE
    {
      name: 'Bracelet de Cheville Perles',
      slug: 'bracelet-cheville-perles',
      category: 'bracelets-cheville',
      image: '/images/1000035688.jpg',
      price: 28,
      brand: 'Aysha',
      rating: 4.5,
      numReviews: 16,
      description: 'Bracelet de cheville délicat avec petites perles dorées, parfait pour l\'été.',

      colors: [
        {
          name: 'Or',
          images: ['/images/1000035688.jpg'],
          sizes: [
            { name: 'Unique', countInStock: 18 },
          ],
        },
      ],
    },
  ],
};

export default data;
