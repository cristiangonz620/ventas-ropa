// ============================================================================
// CONFIGURACIÓN DEL CLIENTE DE SUPABASE
// ============================================================================

// Puedes editar estas variables con tus credenciales de Supabase
const SUPABASE_URL_DEFAULT = "https://amtzjxwwytztlpzrtgqn.supabase.co"; // Coloca aquí tu Supabase URL
const SUPABASE_ANON_KEY_DEFAULT = "sb_publishable_Clcf5sBPeFRwEzHIfCpH5A_xCpV5rfT"; // Coloca aquí tu Supabase Anon Key

// Obtener las credenciales por defecto (mapeadas en código)
const getSupabaseConfig = () => {
    return { url: SUPABASE_URL_DEFAULT, key: SUPABASE_ANON_KEY_DEFAULT };
};

const config = getSupabaseConfig();

let supabaseInstance = null;

// Inicializar el cliente si las credenciales existen
if (config.url && config.key) {
    try {
        // window.supabase es el objeto cargado por el CDN
        supabaseInstance = window.supabase.createClient(config.url, config.key);
        console.log("Supabase inicializado correctamente.");
    } catch (error) {
        console.error("Error al inicializar Supabase:", error);
    }
} else {
    console.warn("Faltan las credenciales de Supabase. Configúralas en supabaseClient.js o a través de la UI.");
}

// Función para actualizar las credenciales y guardar en localStorage
function updateSupabaseCredentials(url, key) {
    if (!url || !key) {
        throw new Error("La URL y la Key de Supabase son obligatorias.");
    }
    
    localStorage.setItem('supabase_url', url);
    localStorage.setItem('supabase_anon_key', key);
    
    // Reinicializar
    try {
        supabaseInstance = window.supabase.createClient(url, key);
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
