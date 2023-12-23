import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'SECRET_KEY';

/**
 * Vérifie si l'utilisateur est autorisé en analysant le token JWT de la requête.
 * @param {express.Request} req - L'objet requête d'Express.
 * @returns {Promise<boolean>} - Retourne true si l'utilisateur est autorisé, sinon false.
 */
export async function isAuthorized(req: any): Promise<boolean> {
    try {
        const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
        if (!token) return false;

        const decoded = jwt.verify(token, SECRET_KEY);

        return !!decoded;
    } catch (error) {
        console.error('Error in isAuthorized:', error);
        return false;
    }
}
