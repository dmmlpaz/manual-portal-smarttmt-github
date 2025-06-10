// src/pages/api/tina/auth/credentials.ts
import { compare } from "bcryptjs"; // Para comparar contraseñas hasheadas

export const post = async ({ request }: { request: Request }) => {
  const { username, password } = await request.json();

  // 1. Verifica el usuario en tu DB (ejemplo con un usuario hardcodeado)
  const user = { id: "1", username: "admin", password: "$2a$10$hashedPassword..." }; // Reemplaza con tu lógica real

  if (!user) {
    return new Response(JSON.stringify({ error: "Usuario no encontrado" }), {
      status: 401,
    });
  }

  // 2. Compara la contraseña (si está hasheada)
  const isValid = await compare(password, user.password);

  if (!isValid) {
    return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), {
      status: 401,
    });
  }

  // 3. Retorna el usuario autenticado (Tina espera este formato)
  return new Response(JSON.stringify({
    user: {
      id: user.id,
      username: user.username,
      roles: ["admin"], // Asegúrate de incluir roles si usas permisos
    },
  }), { status: 200 });
};