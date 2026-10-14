// ============================================================================
// CONFIGURACIÓN DEL CLIENTE DE SUPABASE
// ============================================================================

// Puedes editar estas variables con tus credenciales de Supabase
const SUPABASE_URL_DEFAULT = "https://amtzjxwwytztlpzrtgqn.supabase.co"; // Coloca aquí tu Supabase URL
const SUPABASE_ANON_KEY_DEFAULT = "sb_publishable_Clcf5sBPeFRwEzHIfCpH5A_xCpV5rfT"; // Coloca aquí tu Supabase Anon Key

// Intentar obtener las credenciales de localStorage o usar los valores por defecto
const getSupabaseConfig = () => {
    let url = localStorage.getItem('supabase_url');
    let key = localStorage.getItem('supabase_anon_key');
    
    // Si están vacíos, usar los valores por defecto
    url = (url && url.trim() !== "") ? url.trim() : SUPABASE_URL_DEFAULT;
    key = (key && key.trim() !== "") ? key.trim() : SUPABASE_ANON_KEY_DEFAULT;
    
    return { url, key };
};

const config = getSupabaseConfig();

let supabaseInstance = null;

// Función de seguridad: Verifica que NO se use la clave privada (service_role)
function isServiceRoleKey(key) {
    if (!key || typeof key !== 'string') return false;
    if (key.toLowerCase().includes('service_role')) return true;
    try {
        const parts = key.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            if (payload && payload.role === 'service_role') return true;
        }
    } catch (_) {
        // Formato no JWT (p. ej. sb_publishable_...), seguro continuar
    }
    return false;
}

// Validar y sanear credenciales iniciales
if (isServiceRoleKey(config.key)) {
    console.error("ALERTA DE SEGURIDAD: Se detectó una clave de service_role. Bloqueando por seguridad.");
    config.key = null;
}

// Inicializar el cliente si las credenciales existen y son seguras
if (config.url && config.key && config.url.startsWith('https://')) {
    try {
        // window.supabase es el objeto cargado por el CDN
        supabaseInstance = window.supabase.createClient(config.url, config.key);
        console.log("Supabase inicializado correctamente.");
    } catch (error) {
        console.error("Error al inicializar Supabase:", error);
    }
} else {
    console.warn("Faltan credenciales seguras de Supabase. Configúralas en la UI o supabaseClient.js.");
}

// Función para actualizar las credenciales y guardar en localStorage con validación estricta
function updateSupabaseCredentials(url, key) {
    if (!url || !key) {
        throw new Error("La URL y la Key de Supabase son obligatorias.");
    }
    
    const cleanUrl = url.trim();
    const cleanKey = key.trim();

    // 1. Enforzar protocolo HTTPS
    if (!cleanUrl.startsWith('https://')) {
        throw new Error("La URL de Supabase debe comenzar obligatoriamente con 'https://' por seguridad.");
    }

    // 2. Prohibir service_role key en frontend
    if (isServiceRoleKey(cleanKey)) {
        throw new Error("¡VIOLACIÓN DE SEGURIDAD! Has ingresado una clave 'service_role'. Está terminantemente prohibido usar esta clave en el cliente ya que otorga acceso total sin restricciones RLS. Utiliza únicamente la clave pública 'anon key'.");
    }
    
    localStorage.setItem('supabase_url', cleanUrl);
    localStorage.setItem('supabase_anon_key', cleanKey);
    
    // Reinicializar
    try {
        supabaseInstance = window.supabase.createClient(cleanUrl, cleanKey);
        console.log("Supabase actualizado e inicializado correctamente.");
        return true;
    } catch (error) {
        console.error("Error al inicializar con nuevas credenciales:", error);
        throw error;
    }
}

// Exponer las variables y funciones globalmente
window.supabaseClient = {
    get supabase() { return supabaseInstance; },
    get isConfigured() { return !!supabaseInstance; },
    getConfig: getSupabaseConfig,
    updateCredentials: updateSupabaseCredentials
};
