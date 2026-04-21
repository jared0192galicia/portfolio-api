/**
 * Función que determina si una contraseña es segura.
 *
 * Requisitos de seguridad:
 * - Mínimo 8 caracteres
 * - Al menos 1 letra mayúscula
 * - Al menos 1 letra minúscula
 * - Al menos 1 dígito
 * - Al menos 1 carácter especial (!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?)
 *
 * @param password Un string como contraseña
 * @returns {boolean} `true` si la contraseña es segura, `false` en caso contrario
 */
export default function isPasswordSecure(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  );
}
