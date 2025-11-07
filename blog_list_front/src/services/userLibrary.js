import axios from 'axios';
// Importar el repositorio local de libros para poder resolver metadatos cuando usamos el fallback local
import { librosRepo } from './pages/librosRepo';

// Toggle verbose debug logs for this module
const DEBUG = false;

// Usar proxy relativo en producción pero fallback a backend absoluto en desarrollo
const devBackend = 'http://localhost:3003';
const baseApi = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) ? devBackend + '/api' : '/api';
const baseUrl = `${baseApi}/user/books`;

let token = null;

export const setToken = newToken => {
  // Añadir logs para depuración: comprobar qué valor se está recibiendo
  try {
    if (DEBUG) console.log('userLibrary.setToken called with:', newToken, 'type:', typeof newToken);
  } catch (e) {
    // no-op
  }
  // Evitar prefijar si ya viene con 'Bearer '
  if (typeof newToken === 'string' && newToken.toLowerCase().startsWith('bearer ')) {
    token = newToken;
  } else if (typeof newToken === 'string') {
    token = `Bearer ${newToken}`;
  } else {
    // Si recibimos un valor extraño (booleano, objeto), eliminar token y avisar
    console.warn('userLibrary.setToken: token no es una string válida, limpiando token.');
    token = null;
  }
};

export const saveBookToLibrary = async ({ userId, bookId }) => {
  // Si no se proporciona userId, intentar extraerlo del token JWT (payload.id)
  const decodeJwt = (t) => {
    try {
      const parts = t.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      // atob en browsers, replace url-safe chars
      const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(Array.prototype.map.call(atob(b64), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  };

  let computedUserId = userId;
  if (!computedUserId && token) {
    const raw = token.startsWith('Bearer ') ? token.slice(7) : token;
    const payload = decodeJwt(raw);
    if (payload && (payload.id || payload.userId)) {
      computedUserId = payload.id || payload.userId;
    }
  }

  if (DEBUG) console.log('saveBookToLibrary ->', { userId: computedUserId, bookId, token: !!token, url: baseUrl });
  const config = {
    headers: { 
      Authorization: token,
      'Content-Type': 'application/json'
    },
  };
  // Mostrar la cabecera Authorization para verificar su contenido real (útil para depuración)
  try {
    if (DEBUG) console.log('saveBookToLibrary Authorization header will be:', config.headers.Authorization, 'typeof:', typeof config.headers.Authorization);
  } catch (e) {
    // ignore
  }

  try {
    const response = await axios.post(baseUrl, { userId: computedUserId, bookId }, config);
    return response.data;
  } catch (err) {
    // Mejor manejo de errores para depuración
    if (err.response) {
      // Respuesta del servidor (status 4xx/5xx)
      const status = err.response.status;
      const data = err.response.data;
      console.error('saveBookToLibrary server error', status, data);
      // Si el error es 401 (token inválido) o 403, hacer fallback a almacenamiento local para permitir que
      // el usuario guarde libros localmente aunque el backend rechace la autorización.
      if (status === 401 || status === 403) {
        try {
          const key = computedUserId ? `local_user_library_${computedUserId}` : 'local_user_library_guest';
          const existingJson = window.localStorage.getItem(key);
          const existing = existingJson ? JSON.parse(existingJson) : [];
          // Evitar duplicados
          if (!existing.find(e => e.bookId === bookId)) {
            existing.push({ id: Date.now(), userId: computedUserId || null, bookId, createdAt: new Date().toISOString(), local: true });
            window.localStorage.setItem(key, JSON.stringify(existing));
            console.warn('saveBookToLibrary: backend auth failed, saved locally under', key);
            return existing[existing.length - 1];
          }
          return existing.find(e => e.bookId === bookId);
        } catch (storageErr) {
          console.error('saveBookToLibrary local fallback failed', storageErr);
          throw new Error(`Error del servidor ${status}: ${data && data.error ? data.error : JSON.stringify(data)}`);
        }
      }
      throw new Error(`Error del servidor ${status}: ${data && data.error ? data.error : JSON.stringify(data)}`);
    } else if (err.request) {
      // La petición fue hecha pero no hubo respuesta -> fallback a almacenamiento local
      console.error('saveBookToLibrary no response, request sent', err.request);
      try {
        const key = computedUserId ? `local_user_library_${computedUserId}` : 'local_user_library_guest';
        const existingJson = window.localStorage.getItem(key);
        const existing = existingJson ? JSON.parse(existingJson) : [];
        if (!existing.find(e => e.bookId === bookId)) {
          existing.push({ id: Date.now(), userId: computedUserId || null, bookId, createdAt: new Date().toISOString(), local: true });
          window.localStorage.setItem(key, JSON.stringify(existing));
          console.warn('saveBookToLibrary: backend no response, saved locally under', key);
          return existing[existing.length - 1];
        }
        return existing.find(e => e.bookId === bookId);
      } catch (storageErr) {
        console.error('saveBookToLibrary local fallback failed', storageErr);
        throw new Error('No se recibió respuesta del servidor. ¿Está el backend levantado en http://localhost:3003 ?');
      }
    } else {
      console.error('saveBookToLibrary error', err.message);
      throw err;
    }
  }
};

export const getUserLibrary = async (userId) => {
  const config = {
    headers: { Authorization: token },
  };
  try {
    const response = await axios.get(`${baseUrl}/${userId}`, config);
    // Mergear con la librería local en caso de que existan entradas guardadas localmente (por fallback)
    const remote = Array.isArray(response.data) ? response.data : [];
    try {
      const key = `local_user_library_${userId}`;
      const existingJson = window.localStorage.getItem(key);
      const existing = existingJson ? JSON.parse(existingJson) : [];
        if (existing && existing.length > 0) {
        // Convertir entradas locales en objetos de libro usando datos de librosRepo cuando esté disponible
        const localBooks = existing.map(e => {
          const found = Array.isArray(librosRepo) ? librosRepo.find(b => Number(b.id) === Number(e.bookId)) : null;
          if (found) return { ...found, local: true };
          return { id: e.bookId, titulo: `Libro guardado (local) #${e.bookId}`, portada: '', sinopsis: '', local: true };
        });
        // Evitar duplicados por id
        const ids = new Set(remote.map(r => r.id));
        const merged = [...remote, ...localBooks.filter(lb => !ids.has(lb.id))];
        return merged;
      }
    } catch (mergeErr) {
      console.warn('getUserLibrary: error merging local fallback', mergeErr);
    }
    return remote;
  } catch (err) {
    // Si falla la petición remota, intentar devolver la librería local
    console.error('getUserLibrary failed, falling back to local storage', err && err.message ? err.message : err);
    try {
      const key = `local_user_library_${userId}`;
      const existingJson = window.localStorage.getItem(key);
      const existing = existingJson ? JSON.parse(existingJson) : [];
      const localBooks = existing.map(e => {
        const found = Array.isArray(librosRepo) ? librosRepo.find(b => Number(b.id) === Number(e.bookId)) : null;
        if (found) return { ...found, local: true };
        return { id: e.bookId, titulo: `Libro guardado (local) #${e.bookId}`, portada: '', sinopsis: '', local: true };
      });
      return localBooks;
    } catch (storageErr) {
      console.error('getUserLibrary local fallback failed', storageErr);
      if (err.response) {
        throw new Error(`Error del servidor ${err.response.status}`);
      } else if (err.request) {
        throw new Error('No se recibió respuesta del servidor. ¿Está el backend levantado en http://localhost:3003 ?');
      } else {
        throw err;
      }
    }
  }
};
