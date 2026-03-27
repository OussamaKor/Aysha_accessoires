/**
 * Calcule le prix final d'un produit en tenant compte de la réduction
 * @param {number} price - Prix original du produit
 * @param {number} discount - Pourcentage de réduction (0-100)
 * @returns {number} - Prix final arrondi à 2 décimales
 */
export const calculateFinalPrice = (price, discount = 0) => {
  if (!discount || discount <= 0) return parseFloat(price);
  return parseFloat((price * (1 - discount / 100)).toFixed(2));
};

/**
 * Vérifie si un produit a une réduction active
 * @param {number} discount - Pourcentage de réduction
 * @returns {boolean}
 */
export const hasDiscount = (discount) => {
  const discountNum = Number(discount) || 0;
  return discountNum > 0;
};

/**
 * Calcule le montant économisé
 * @param {number} price - Prix original
 * @param {number} discount - Pourcentage de réduction
 * @returns {number} - Montant économisé
 */
export const calculateSavings = (price, discount = 0) => {
  if (!discount || discount <= 0) return 0;
  return parseFloat((price * (discount / 100)).toFixed(2));
};
