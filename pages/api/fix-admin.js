import db from '../../utils/db';
import User from '../../models/User';

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    await db.connect();

    // Mettre à jour l'utilisateur admin
    const result = await User.updateOne(
      { email: 'admin@aysha-accessoires.com' },
      { $set: { isAdmin: true } }
    );

    // Vérifier si l'utilisateur existe
    const adminUser = await User.findOne({ email: 'admin@aysha-accessoires.com' });

    await db.disconnect();

    if (!adminUser) {
      return res.status(404).json({ 
        message: 'Utilisateur admin non trouvé. Veuillez appeler /api/seed d\'abord.' 
      });
    }

    return res.status(200).json({
      message: 'Utilisateur admin mis à jour avec succès',
      updated: result.modifiedCount > 0,
      admin: {
        name: adminUser.name,
        email: adminUser.email,
        isAdmin: adminUser.isAdmin,
      },
    });
  } catch (error) {
    await db.disconnect();
    return res.status(500).json({ message: error.message });
  }
};

export default handler;
