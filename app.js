// ============================================================================
// LÓGICA PRINCIPAL DE LA APLICACIÓN (app.js) - FASE 2
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO GENERAL ---
    const state = {
        sales: [],
        bcvRate: parseFloat(localStorage.getItem('global_bcv_rate')) || 45.50,
        currentTab: 'dashboard',
        selectedSaleForAbono: null,
        abonoCurrency: 'Bs', // 'Bs' o 'USD' (Bs por defecto)
        tempOrderItems: [], // Lista temporal de prendas para el nuevo pedido
        charts: {
            finances: null,
            products: null
        }
    };

    // Imagen por defecto para prendas que no posean URL propia
    const DEFAULT_CLOTHING_IMAGE = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=150&q=80";

    // --- ELEMENTOS DEL DOM ---
    const el = {
        // Navegación
        tabDashboard: document.getElementById('tab-dashboard'),
        tabEncargo: document.getElementById('tab-encargo'),
        tabAbonos: document.getElementById('tab-abonos'),
        tabReportes: document.getElementById('tab-reportes'),
        contentDashboard: document.getElementById('content-dashboard'),
        contentEncargo: document.getElementById('content-encargo'),
        contentAbonos: document.getElementById('content-abonos'),
        contentReportes: document.getElementById('content-reportes'),
        
        // Configuración y Avisos
        setupWarning: document.getElementById('setup-warning'),
        globalLoader: document.getElementById('global-loader'),
        toastContainer: document.getElementById('toast-container'),
        globalBcvRate: document.getElementById('global-bcv-rate'),
        btnUpdateAllBcv: document.getElementById('btn-update-all-bcv'),
        
        // Modales
        settingsModal: document.getElementById('settings-modal'),
        btnOpenSettings: document.getElementById('btn-open-settings'),
        btnCloseSettings: document.getElementById('btn-close-settings'),
        btnClearSettings: document.getElementById('btn-clear-settings'),
        formSettings: document.getElementById('form-settings'),
        settingsUrl: document.getElementById('settings-url'),
        settingsKey: document.getElementById('settings-key'),

        // Agregar Prenda Modal
        addItemModal: document.getElementById('add-item-modal'),
        btnCloseAddItem: document.getElementById('btn-close-add-item'),
        btnCancelAddItem: document.getElementById('btn-cancel-add-item'),
        formAddItem: document.getElementById('form-add-item'),
        addItemSaleId: document.getElementById('add-item-sale-id'),
        addItemClientSubtitle: document.getElementById('add-item-client-subtitle'),
        addItemDesc: document.getElementById('add-item-desc'),
        addItemCost: document.getElementById('add-item-cost'),
        addItemPrice: document.getElementById('add-item-price'),
        addItemImg: document.getElementById('add-item-img'),

        // Lote de Prendas (Nuevo Encargo)
        btnAddToTempList: document.getElementById('btn-add-to-temp-list'),
        tempItemsSection: document.getElementById('temp-items-section'),
        tempItemsBody: document.getElementById('temp-items-body'),
        tempTotalCost: document.getElementById('temp-total-cost'),
        tempTotalPrice: document.getElementById('temp-total-price'),
        btnClearFullOrder: document.getElementById('btn-clear-full-order'),
        btnSubmitFullOrder: document.getElementById('btn-submit-full-order'),

        // Login
        loginOverlay: document.getElementById('login-overlay'),
        loginTitle: document.getElementById('login-title'),
        formLogin: document.getElementById('form-login'),
        loginEmail: document.getElementById('login-email'),
        loginPassword: document.getElementById('login-password'),
        btnLogout: document.getElementById('btn-logout'),

        historyModal: document.getElementById('history-modal'),
        btnCloseHistory: document.getElementById('btn-close-history'),
        btnCloseHistoryFooter: document.getElementById('btn-close-history-footer'),
        historyClientTitle: document.getElementById('history-client-title'),
        historyProductTitle: document.getElementById('history-product-title'),
        historyTableBody: document.getElementById('history-table-body'),
        historyTotalUsd: document.getElementById('history-total-usd'),

        // Detalle de Pedido Modal
        orderDetailsModal: document.getElementById('order-details-modal'),
        btnCloseOrderDetails: document.getElementById('btn-close-order-details'),
        btnCloseOrderDetailsFooter: document.getElementById('btn-close-order-details-footer'),
        detailsClientTitle: document.getElementById('details-client-title'),
        detailsClientPhone: document.getElementById('details-client-phone'),
        detailsItemsContainer: document.getElementById('details-items-container'),
        detailsTotalUsd: document.getElementById('details-total-usd'),
        detailsPendingUsd: document.getElementById('details-pending-usd'),
        
        // Métricas
        metricTotalSales: document.getElementById('metric-total-sales'),
        metricTotalCollected: document.getElementById('metric-total-collected'),
        metricTotalPending: document.getElementById('metric-total-pending'),
        metricTotalPendingBs: document.getElementById('metric-total-pending-bs'),
        
        // Filtros y Tabla
        searchFilter: document.getElementById('search-filter'),
        statusFilter: document.getElementById('status-filter'),
        btnRefreshData: document.getElementById('btn-refresh-data'),
        salesTableBody: document.getElementById('sales-table-body'),
        
        // Formulario Encargos
        formEncargo: document.getElementById('form-encargo'),
        clienteNombre: document.getElementById('cliente-nombre'),
        clienteTelefono: document.getElementById('cliente-telefono'),
        ventaFecha: document.getElementById('venta-fecha'),
        prendaDescripcion: document.getElementById('prenda-descripcion'),
        prendaImagenUrl: document.getElementById('prenda-imagen-url'),
        prendaPreview: document.getElementById('prenda-preview'),
        prendaPreviewPlaceholder: document.getElementById('prenda-preview-placeholder'),
        precioCosto: document.getElementById('precio-costo'),
        precioVenta: document.getElementById('precio-venta'),
        
        // Formulario Abonos
        formAbono: document.getElementById('form-abono'),
        abonoVentaSelect: document.getElementById('abono-venta-select'),
        abonoMontoInput: document.getElementById('abono-monto-input'),
        abonoTasaBcv: document.getElementById('abono-tasa-bcv'),
        abonoConversionResult: document.getElementById('abono-conversion-result'),
        abonoCurrentBalanceUsd: document.getElementById('abono-current-balance-usd'),
        abonoCurrentBalanceBs: document.getElementById('abono-current-balance-bs'),
        abonoProjectedBalanceUsd: document.getElementById('abono-projected-balance-usd'),
        abonoProjectedBalanceBs: document.getElementById('abono-projected-balance-bs'),
        abonoMaxInfo: document.getElementById('abono-max-info'),
        abonoMetodo: document.getElementById('abono-metodo'),
        abonoFecha: document.getElementById('abono-fecha'),
        btnCancelAbono: document.getElementById('btn-cancel-abono'),
        btnCurrencyBs: document.getElementById('btn-currency-bs'),
        btnCurrencyUsd: document.getElementById('btn-currency-usd'),
        labelAbonoMonto: document.getElementById('label-abono-monto'),
        symbolAbonoMonto: document.getElementById('symbol-abono-monto'),
        labelAbonoConversion: document.getElementById('label-abono-conversion'),
        
        // Elementos de la Pestaña Reportes
        reportesFechaInicio: document.getElementById('reportes-fecha-inicio'),
        reportesFechaFin: document.getElementById('reportes-fecha-fin'),
        kpiVentasTotales: document.getElementById('kpi-ventas-totales'),
        kpiInversionTotal: document.getElementById('kpi-inversion-total'),
        kpiGananciaTotal: document.getElementById('kpi-ganancia-total'),
        kpiRentabilidadPercent: document.getElementById('kpi-rentabilidad-percent'),
        kpiRetornoPercent: document.getElementById('kpi-retorno-percent'),
        kpiAbonosTotal: document.getElementById('kpi-abonos-total'),
        kpiCobroPercent: document.getElementById('kpi-cobro-percent'),
        kpiDeudaActiva: document.getElementById('kpi-deuda-activa'),
        kpiDiagnosticoTexto: document.getElementById('kpi-diagnostico-texto'),
        kpiDiagnosticoContainer: document.getElementById('kpi-diagnostico-container')
    };

    // --- INICIALIZACIÓN ---
    function init() {
        lucide.createIcons();
        checkSupabaseConfig();
        
        // Cargar tasa de cambio por defecto
        el.globalBcvRate.value = state.bcvRate.toFixed(2);
        el.abonoTasaBcv.value = state.bcvRate.toFixed(2);
        
        // Establecer fecha por defecto en formulario de abonos (hoy local)
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        el.abonoFecha.value = now.toISOString().slice(0, 16);

        // Establecer fecha por defecto en formulario de nuevo encargo (hoy local)
        el.ventaFecha.value = now.toISOString().split('T')[0];
        
        // Establecer fechas por defecto en Reportes (los últimos 30 días)
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        el.reportesFechaInicio.value = thirtyDaysAgo.toISOString().split('T')[0];
        el.reportesFechaFin.value = today.toISOString().split('T')[0];
        
        setupEventListeners();
        
        // Consultar tasa oficial de forma asíncrona al iniciar
        fetchBcvRate();
        
        // Escuchar cambios de autenticación
        setupAuthListener();
    }

    // --- CONSULTAR TASA BCV DESDE API PÚBLICA ---
    async function fetchBcvRate(isManual = false) {
        try {
            console.log("Consultando tasa oficial del BCV...");
            if (isManual) setLoader(true);
            const response = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
            if (!response.ok) throw new Error("Error en la respuesta de la API");
            const data = await response.json();
            
            if (data && data.promedio) {
                const rate = parseFloat(data.promedio);
                state.bcvRate = rate;
                localStorage.setItem('global_bcv_rate', rate);
                el.globalBcvRate.value = rate.toFixed(2);
                el.abonoTasaBcv.value = rate.toFixed(2);
                
                // Recalcular métricas y tablas
                renderMetrics();
                renderTable();
                calculateAbonoConversion();
                if (state.currentTab === 'reportes') renderCharts();
                
                showToast("Tasa BCV cargada", `Tasa oficial: Bs. ${rate.toFixed(2)} (Actualizado: ${fmt.date(data.fechaActualizacion)})`, "success");
            }
        } catch (err) {
            console.warn("No se pudo cargar la tasa desde la API. Usando local:", err);
            if (isManual) {
                showToast("Error de conexión", "No se pudo actualizar la tasa desde el servidor. Usando valor local.", "error");
            } else {
                showToast("Tasa Local", "Usando la tasa configurada localmente.", "info");
            }
        } finally {
            if (isManual) setLoader(false);
        }
    }

    // --- CONTROL DE ACCESO (AUTENTICACIÓN) ---
    function setupAuthListener() {
        if (!window.supabaseClient.isConfigured) {
            el.loginOverlay.classList.remove('hidden');
            return;
        }

        const supabase = window.supabaseClient.supabase;

        // Escuchar cambios en la sesión de Supabase
        supabase.auth.onAuthStateChange((event, session) => {
            console.log("Cambio de autenticación:", event, session);
            if (session && session.user) {
                // Usuario autenticado
                el.loginOverlay.classList.add('hidden');
                el.btnLogout.classList.remove('hidden');
                loadData();
            } else {
                // Usuario no autenticado
                el.loginOverlay.classList.remove('hidden');
                el.btnLogout.classList.add('hidden');
                clearStateAndUI();
            }
        });
    }

    function clearStateAndUI() {
        state.sales = [];
        // Limpiar tablas
        el.salesTableBody.innerHTML = '<tr><td colspan="6" class="py-8 text-center text-slate-500">Inicia sesión para ver los pedidos</td></tr>';
        el.abonoVentaSelect.innerHTML = '<option value="" disabled selected>Inicia sesión primero...</option>';
        
        // Limpiar KPIs
        el.metricTotalSales.textContent = "$0.00";
        el.metricTotalCollected.textContent = "$0.00";
        el.metricTotalPending.textContent = "$0.00";
        el.metricTotalPendingBs.textContent = "Bs. 0,00";
        el.kpiCobroPercent.textContent = "0%";
        el.kpiDeudaActiva.textContent = "0";
        el.kpiDiagnosticoTexto.textContent = "Inicia sesión para ver el estado financiero";
        
        // Si hay gráficos, destruirlos
        if (state.charts.finances) {
            state.charts.finances.destroy();
            state.charts.finances = null;
        }
        if (state.charts.products) {
            state.charts.products.destroy();
            state.charts.products = null;
        }
    }

    // --- AGREGAR PRENDAS A PEDIDOS EXISTENTES ---
    function openAddItemModal(saleId, clientName) {
        el.addItemSaleId.value = saleId;
        el.addItemClientSubtitle.textContent = `Cliente: ${clientName}`;
        el.formAddItem.reset();
        el.addItemModal.classList.remove('hidden');
    }

    async function handleAddItemSubmit(e) {
        e.preventDefault();
        
        if (!window.supabaseClient.isConfigured) {
            showToast("Acción bloqueada", "Debes configurar Supabase primero.", "error");
            return;
        }

        const saleId = el.addItemSaleId.value;
        const desc = el.addItemDesc.value.trim();
        const costUsd = parseFloat(el.addItemCost.value) || 0;
        const priceUsd = parseFloat(el.addItemPrice.value) || 0;
        const imgUrl = el.addItemImg.value.trim() || null;

        if (priceUsd <= 0 || costUsd < 0) {
            showToast("Validación", "Los montos de dinero deben ser válidos.", "warning");
            return;
        }

        setLoader(true);
        const supabase = window.supabaseClient.supabase;

        try {
            // 1. Insertar el nuevo producto asociado a la venta (pedido)
            const { error: insertProductError } = await supabase
                .from('productos')
                .insert([{
                    venta_id: saleId,
                    descripcion: desc,
                    precio_costo_usd: costUsd,
                    precio_venta_usd: priceUsd,
                    estado: 'encargado',
                    imagen_url: imgUrl
                }]);

            if (insertProductError) throw insertProductError;

            // 2. Obtener la venta actual para actualizar sus totales
            const { data: saleData, error: fetchSaleError } = await supabase
                .from('ventas')
                .select('monto_total_usd, saldo_pendiente_usd')
                .eq('id', saleId)
                .single();

            if (fetchSaleError) throw fetchSaleError;

            const currentTotal = parseFloat(saleData.monto_total_usd) || 0;
            const currentPending = parseFloat(saleData.saldo_pendiente_usd) || 0;

            const newTotal = currentTotal + priceUsd;
            const newPending = currentPending + priceUsd;

            // 3. Actualizar la venta en Supabase
            let newEstadoPago = 'pendiente';
            const abonado = newTotal - newPending;
            if (newPending === 0) {
                newEstadoPago = 'completado';
            } else if (abonado > 0) {
                newEstadoPago = 'parcial';
            }

            const { error: updateSaleError } = await supabase
                .from('ventas')
                .update({
                    monto_total_usd: newTotal,
                    saldo_pendiente_usd: newPending,
                    estado_pago: newEstadoPago
                })
                .eq('id', saleId);

            if (updateSaleError) throw updateSaleError;

            showToast("Prenda Agregada", `Se agregó "${desc}" al pedido de este cliente.`, "success");
            el.addItemModal.classList.add('hidden');
            await loadData();
        } catch (err) {
            console.error("Error al agregar prenda:", err);
            showToast("Error de Operación", "No se pudo agregar la prenda: " + err.message, "error");
        } finally {
            setLoader(false);
        }
    }

    // --- CONTROL DE CONFIGURACIÓN ---
    function checkSupabaseConfig() {
        const isConfigured = window.supabaseClient.isConfigured;
        if (isConfigured) {
            el.setupWarning.classList.add('hidden');
        } else {
            el.setupWarning.classList.remove('hidden');
            // Cargar credenciales si hay en localStorage en el form modal
            const config = window.supabaseClient.getConfig();
            el.settingsUrl.value = config.url || '';
            el.settingsKey.value = config.key || '';
        }
    }

    // --- LOADER Y TOASTS ---
    function setLoader(show) {
        if (show) {
            el.globalLoader.classList.remove('hidden');
        } else {
            el.globalLoader.classList.add('hidden');
        }
    }

    function showToast(title, message, type = 'success') {
        const id = 'toast-' + Math.random().toString(36).substr(2, 9);
        const colorClasses = {
            success: 'bg-emerald-950/90 border-emerald-800 text-emerald-200',
            error: 'bg-rose-950/90 border-rose-800 text-rose-200',
            warning: 'bg-amber-950/90 border-amber-800 text-amber-200',
            info: 'bg-blue-950/90 border-blue-800 text-blue-200'
        };

        const iconMap = {
            success: 'check-circle-2',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        const html = `
            <div id="${id}" class="flex items-start gap-3 p-4 rounded-2xl border ${colorClasses[type]} shadow-2xl backdrop-blur-md pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300">
                <i data-lucide="${iconMap[type]}" class="w-5 h-5 shrink-0 mt-0.5"></i>
                <div class="flex-1">
                    <h4 class="text-xs font-bold font-outfit uppercase tracking-wider">${title}</h4>
                    <p class="text-xs mt-1 text-slate-300 font-medium">${message}</p>
                </div>
                <button onclick="document.getElementById('${id}').remove()" class="text-slate-400 hover:text-white transition-colors shrink-0">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        
        el.toastContainer.insertAdjacentHTML('beforeend', html);
        lucide.createIcons();

        // Autocerrado
        setTimeout(() => {
            const toast = document.getElementById(id);
            if (toast) {
                toast.classList.add('animate-out', 'fade-out', 'slide-out-to-top-4', 'duration-300');
                toast.addEventListener('animationend', () => toast.remove());
            }
        }, 5000);
    }

    // --- FORMATEADORES ---
    const fmt = {
        usd: (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val),
        bs: (val) => 'Bs. ' + new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val),
        date: (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        },
        dateOnly: (dateStr) => {
            if (!dateStr) return "";
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        },
        daysElapsed: (dateStr) => {
            if (!dateStr) return "";
            const created = new Date(dateStr);
            const now = new Date();
            created.setHours(0,0,0,0);
            now.setHours(0,0,0,0);
            const diffTime = now - created;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 0) return "Hoy";
            if (diffDays === 1) return "Ayer";
            return `Hace ${diffDays} días`;
        }
    };

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        // Activar selector de fecha al hacer click en el input
        document.querySelectorAll('input[type="date"], input[type="datetime-local"]').forEach(input => {
            input.addEventListener('click', (e) => {
                try {
                    e.target.showPicker();
                } catch (err) {
                    console.warn("showPicker no soportado", err);
                }
            });
        });

        // Cambio de Pestañas (Tabs)
        el.tabDashboard.addEventListener('click', () => switchTab('dashboard'));
        el.tabEncargo.addEventListener('click', () => switchTab('encargo'));
        el.tabAbonos.addEventListener('click', () => switchTab('abonos'));
        el.tabReportes.addEventListener('click', () => switchTab('reportes'));

        // Modales
        el.btnOpenSettings.addEventListener('click', () => {
            const config = window.supabaseClient.getConfig();
            el.settingsUrl.value = config.url || '';
            el.settingsKey.value = config.key || '';
            el.settingsModal.classList.remove('hidden');
        });
        el.btnCloseSettings.addEventListener('click', () => el.settingsModal.classList.add('hidden'));
        
        // Limpiar configuración
        el.btnClearSettings.addEventListener('click', () => {
            if (confirm("¿Estás seguro de que deseas eliminar las credenciales de conexión?")) {
                localStorage.removeItem('supabase_url');
                localStorage.removeItem('supabase_anon_key');
                location.reload();
            }
        });

        // Guardar configuración
        el.formSettings.addEventListener('submit', (e) => {
            e.preventDefault();
            const url = el.settingsUrl.value.trim();
            const key = el.settingsKey.value.trim();
            
            try {
                window.supabaseClient.updateCredentials(url, key);
                showToast("Conectado", "Credenciales de Supabase actualizadas con éxito.", "success");
                el.settingsModal.classList.add('hidden');
                checkSupabaseConfig();
                loadData();
            } catch (err) {
                showToast("Error de conexión", "Asegúrate de que la URL y la Key sean correctas.", "error");
            }
        });

        // Doble click secreto en título de login abre configuración (para re-configurar en caso de borrar caché)
        if (el.loginTitle) {
            el.loginTitle.addEventListener('dblclick', () => {
                const config = window.supabaseClient.getConfig();
                el.settingsUrl.value = config.url || '';
                el.settingsKey.value = config.key || '';
                el.settingsModal.classList.remove('hidden');
            });
        }

        // Iniciar Sesión
        el.formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = el.loginEmail.value.trim();
            const password = el.loginPassword.value;
            
            if (!window.supabaseClient.isConfigured) {
                showToast("Error", "Supabase no está configurado en el sistema.", "error");
                return;
            }

            try {
                setLoader(true);
                const { data, error } = await window.supabaseClient.supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) throw error;
                showToast("Acceso Concedido", `¡Bienvenido, ${data.user.email}!`, "success");
            } catch (err) {
                console.error("Error al iniciar sesión:", err);
                showToast("Error de acceso", err.message || "Usuario o contraseña incorrectos.", "error");
            } finally {
                setLoader(false);
            }
        });

        // Cerrar Sesión
        el.btnLogout.addEventListener('click', async () => {
            if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                try {
                    setLoader(true);
                    const { error } = await window.supabaseClient.supabase.auth.signOut();
                    if (error) throw error;
                    showToast("Sesión Cerrada", "Has cerrado sesión correctamente.", "success");
                } catch (err) {
                    console.error("Error al cerrar sesión:", err);
                    showToast("Error", "No se pudo cerrar la sesión.", "error");
                } finally {
                    setLoader(false);
                }
            }
        });

        // Modificar tasa BCV global
        el.globalBcvRate.addEventListener('change', () => {
            const newRate = parseFloat(el.globalBcvRate.value);
            if (newRate > 0) {
                state.bcvRate = newRate;
                localStorage.setItem('global_bcv_rate', newRate);
                el.abonoTasaBcv.value = newRate.toFixed(2);
                renderMetrics();
                renderTable();
                showToast("Tasa actualizada", `La tasa general cambió a Bs. ${newRate.toFixed(2)}`, "info");
            } else {
                el.globalBcvRate.value = state.bcvRate.toFixed(2);
            }
        });

        el.btnUpdateAllBcv.addEventListener('click', () => {
            fetchBcvRate(true);
        });

        // Filtros de búsqueda
        el.searchFilter.addEventListener('input', renderTable);
        el.statusFilter.addEventListener('change', renderTable);
        el.btnRefreshData.addEventListener('click', loadData);

        // Registro de Encargo
        el.formEncargo.addEventListener('submit', handleNewOrder);
        
        // Manejar previsualización de imagen en vivo
        el.prendaImagenUrl.addEventListener('input', () => {
            const url = el.prendaImagenUrl.value.trim();
            if (url) {
                el.prendaPreview.src = url;
                el.prendaPreview.classList.remove('hidden');
                el.prendaPreviewPlaceholder.classList.add('hidden');
            } else {
                el.prendaPreview.src = "";
                el.prendaPreview.classList.add('hidden');
                el.prendaPreviewPlaceholder.classList.remove('hidden');
            }
        });
        
        el.prendaPreview.addEventListener('error', () => {
            el.prendaPreview.classList.add('hidden');
            el.prendaPreviewPlaceholder.classList.remove('hidden');
        });

        // Registro de Abono (Cálculo dinámico en el formulario)
        el.abonoVentaSelect.addEventListener('change', handleAbonoSelectionChange);
        el.abonoMontoInput.addEventListener('input', calculateAbonoConversion);
        el.abonoTasaBcv.addEventListener('input', calculateAbonoConversion);
        
        // Controladores de selección de moneda para el Abono
        el.btnCurrencyBs.addEventListener('click', () => {
            if (state.abonoCurrency === 'Bs') return;
            state.abonoCurrency = 'Bs';
            
            // Cambiar estilos visuales
            el.btnCurrencyBs.className = "flex-1 h-full rounded-lg text-xs font-semibold bg-brand-600 text-white transition-all";
            el.btnCurrencyUsd.className = "flex-1 h-full rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all";
            
            // Cambiar etiquetas y símbolos
            el.labelAbonoMonto.textContent = "Monto a Abonar (Bs.)";
            el.symbolAbonoMonto.textContent = "Bs.";
            el.labelAbonoConversion.textContent = "Equivalente en Dólares ($)";
            
            handleAbonoSelectionChange(); // Recalcular sugerencia de pago completo
        });

        el.btnCurrencyUsd.addEventListener('click', () => {
            if (state.abonoCurrency === 'USD') return;
            state.abonoCurrency = 'USD';
            
            // Cambiar estilos visuales
            el.btnCurrencyUsd.className = "flex-1 h-full rounded-lg text-xs font-semibold bg-brand-600 text-white transition-all";
            el.btnCurrencyBs.className = "flex-1 h-full rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-all";
            
            // Cambiar etiquetas y símbolos
            el.labelAbonoMonto.textContent = "Monto a Abonar ($ USD)";
            el.symbolAbonoMonto.textContent = "$";
            el.labelAbonoConversion.textContent = "Equivalente en Bolívares (Bs.)";
            
            handleAbonoSelectionChange(); // Recalcular sugerencia de pago completo
        });

        el.formAbono.addEventListener('submit', handleNewAbono);
        el.btnCancelAbono.addEventListener('click', () => {
            el.formAbono.reset();
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            el.abonoFecha.value = now.toISOString().slice(0, 16);

            el.abonoVentaSelect.value = "";
            // Resetear a moneda por defecto (Bs)
            el.btnCurrencyBs.click();
            handleAbonoSelectionChange();
            switchTab('dashboard');
        });

        // Historial Modal
        el.btnCloseHistory.addEventListener('click', () => el.historyModal.classList.add('hidden'));
        el.btnCloseHistoryFooter.addEventListener('click', () => el.historyModal.classList.add('hidden'));

        // Detalle de Pedido Modal Close
        el.btnCloseOrderDetails.addEventListener('click', () => el.orderDetailsModal.classList.add('hidden'));
        el.btnCloseOrderDetailsFooter.addEventListener('click', () => el.orderDetailsModal.classList.add('hidden'));

        // Filtros de fecha en Reportes
        el.reportesFechaInicio.addEventListener('change', renderCharts);
        el.reportesFechaFin.addEventListener('change', renderCharts);

        // Calcular ganancia y margen en tiempo real en "Nuevo Encargo"
        const calculateProfit = () => {
            const costo = parseFloat(el.precioCosto.value) || 0;
            const venta = parseFloat(el.precioVenta.value) || 0;
            
            const profitContainer = document.getElementById('encargo-profit-container');
            const profitUsd = document.getElementById('encargo-profit-usd');
            const profitPercent = document.getElementById('encargo-profit-percent');
            
            if (costo > 0 || venta > 0) {
                profitContainer.classList.remove('hidden');
                const ganancia = venta - costo;
                
                let porcentaje = 0;
                if (costo > 0) {
                    porcentaje = (ganancia / costo) * 100;
                } else if (venta > 0) {
                    porcentaje = 100;
                }
                
                profitUsd.textContent = fmt.usd(ganancia);
                profitPercent.textContent = `${porcentaje.toFixed(2)}%`;
                
                if (ganancia >= 0) {
                    profitUsd.className = "text-sm font-bold text-emerald-400";
                } else {
                    profitUsd.className = "text-sm font-bold text-rose-400";
                }
            } else {
                profitContainer.classList.add('hidden');
            }
        };

        el.precioCosto.addEventListener('input', calculateProfit);
        el.precioVenta.addEventListener('input', calculateProfit);

        // Cancelar / Cerrar Agregar Prenda
        el.btnCloseAddItem.addEventListener('click', () => el.addItemModal.classList.add('hidden'));
        el.btnCancelAddItem.addEventListener('click', () => el.addItemModal.classList.add('hidden'));
        
        // Registrar Agregar Prenda submit
        el.formAddItem.addEventListener('submit', handleAddItemSubmit);

        // Agregar prenda a la lista de nuevo encargo
        el.btnAddToTempList.addEventListener('click', addGarmentToTempList);
        
        // Limpiar orden completa
        el.btnClearFullOrder.addEventListener('click', clearFullOrder);
    }

    // --- CAMBIAR PESTAÑA ---
    function switchTab(tabId) {
        state.currentTab = tabId;
        
        // Modificar clases del botón activo
        const tabs = [
            { btn: el.tabDashboard, content: el.contentDashboard },
            { btn: el.tabEncargo, content: el.contentEncargo },
            { btn: el.tabAbonos, content: el.contentAbonos },
            { btn: el.tabReportes, content: el.contentReportes }
        ];

        tabs.forEach(t => {
            if (t.btn.id === `tab-${tabId}`) {
                t.btn.className = "px-6 py-3 font-semibold text-sm border-b-2 border-brand-500 text-brand-400 flex items-center gap-2 hover:bg-slate-900/30 transition-all";
                t.content.classList.remove('hidden');
            } else {
                t.btn.className = "px-6 py-3 font-semibold text-sm border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-2 hover:bg-slate-900/30 transition-all";
                t.content.classList.add('hidden');
            }
        });

        // Acciones específicas por pestaña
        if (tabId === 'abonos') {
            el.abonoTasaBcv.value = state.bcvRate.toFixed(2);
            calculateAbonoConversion();
        } else if (tabId === 'reportes') {
            renderCharts();
        }
    }

    // --- LEER DATOS DESDE SUPABASE ---
    async function loadData() {
        if (!window.supabaseClient.isConfigured) {
            return;
        }

        setLoader(true);
        const supabase = window.supabaseClient.supabase;

        try {
            // Hacemos un join de ventas, clientes y productos (con la nueva columna imagen_url)
            const { data, error } = await supabase
                .from('ventas')
                .select(`
                    id,
                    monto_total_usd,
                    saldo_pendiente_usd,
                    estado_pago,
                    creado_en,
                    clientes (id, nombre, telefono),
                    productos (id, descripcion, precio_costo_usd, precio_venta_usd, estado, imagen_url)
                `)
                .order('creado_en', { ascending: false });

            if (error) throw error;

            state.sales = data || [];
            
            // Renderizar la pantalla
            renderMetrics();
            renderTable();
            populateAbonoSelect();
            
            if (state.currentTab === 'reportes') {
                renderCharts();
            }
            
        } catch (err) {
            console.error("Error al cargar datos:", err);
            showToast("Error de Datos", "No se pudieron obtener los datos de la base de datos: " + err.message, "error");
        } finally {
            setLoader(false);
        }
    }

    // --- CALCULAR Y RENDERIZAR MÉTRICAS ---
    function renderMetrics() {
        let totalSales = 0;
        let totalPending = 0;
        let totalCollected = 0;

        state.sales.forEach(sale => {
            const saleTotal = parseFloat(sale.monto_total_usd) || 0;
            const salePending = parseFloat(sale.saldo_pendiente_usd) || 0;
            const saleCollected = saleTotal - salePending;

            totalSales += saleTotal;
            totalPending += salePending;
            totalCollected += saleCollected;
        });

        const totalPendingBs = totalPending * state.bcvRate;

        // Renderizar
        el.metricTotalSales.textContent = fmt.usd(totalSales);
        el.metricTotalCollected.textContent = fmt.usd(totalCollected);
        el.metricTotalPending.textContent = fmt.usd(totalPending);
        el.metricTotalPendingBs.textContent = fmt.bs(totalPendingBs);
    }

    // --- RENDERIZAR TABLA RESUMEN ---
    function renderTable() {
        const query = el.searchFilter.value.toLowerCase().trim();
        const status = el.statusFilter.value;
        const tbody = el.salesTableBody;
        
        tbody.innerHTML = "";

        // Filtrar datos
        const filtered = state.sales.filter(sale => {
            const clientName = sale.clientes?.nombre?.toLowerCase() || "";
            const clientTel = sale.clientes?.telefono?.toLowerCase() || "";
            const productsList = sale.productos || [];
            const prodDesc = productsList.map(p => p.descripcion).join(" ").toLowerCase();
            
            const matchQuery = clientName.includes(query) || clientTel.includes(query) || prodDesc.includes(query);
            const matchStatus = status === 'all' || sale.estado_pago === status;

            return matchQuery && matchStatus;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="py-12 text-center text-slate-500">
                        No se encontraron registros que coincidan con la búsqueda.
                    </td>
                </tr>
            `;
            return;
        }

        filtered.forEach(sale => {
            const client = sale.clientes || { nombre: 'Desconocido', telefono: '-' };
            const productsList = sale.productos || [];
            const firstProduct = productsList[0] || { descripcion: 'Prenda no identificada', precio_venta_usd: 0, estado: 'encargado', imagen_url: null };
            
            const combinedDescription = productsList.map(p => p.descripcion).join(", ") || 'Prenda no identificada';
            const imgUrl = firstProduct.imagen_url || DEFAULT_CLOTHING_IMAGE;
            
            const ventaTotal = parseFloat(sale.monto_total_usd) || 0;
            const saldoPendiente = parseFloat(sale.saldo_pendiente_usd) || 0;
            const abonado = ventaTotal - saldoPendiente;
            const saldoBs = saldoPendiente * state.bcvRate;

            // Clases de estado de pago
            let badgeClass = "";
            let statusText = "";
            if (sale.estado_pago === 'completado') {
                badgeClass = "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50";
                statusText = "Completado";
            } else if (sale.estado_pago === 'parcial') {
                badgeClass = "bg-blue-950/60 text-blue-400 border border-blue-800/50";
                statusText = "Abono Parcial";
            } else {
                badgeClass = "bg-rose-950/60 text-rose-400 border border-rose-800/50";
                statusText = "Pendiente";
            }

            // Badge de entrega de producto
            const allDelivered = productsList.length > 0 && productsList.every(p => p.estado === 'entregado');
            let deliverBadgeClass = "";
            let deliverText = "";
            if (allDelivered) {
                deliverBadgeClass = "bg-slate-900 text-slate-400 border border-slate-800";
                deliverText = "Entregado";
            } else if (sale.estado_pago === 'completado') {
                deliverBadgeClass = "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40";
                deliverText = "Elegible para Entrega";
            } else {
                deliverBadgeClass = "bg-brand-950/50 text-brand-400 border border-brand-800/30";
                deliverText = "Pendiente (Por Entregar)";
            }

            const tr = document.createElement('tr');
            tr.className = "hover:bg-slate-900/35 transition-colors border-b border-slate-900";
            tr.innerHTML = `
                <td class="py-4 px-6">
                    <div class="font-bold text-slate-100 font-outfit text-sm">${client.nombre}</div>
                    ${client.telefono ? `
                        <div class="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <i data-lucide="phone" class="w-3 h-3 text-slate-500"></i> ${client.telefono}
                        </div>
                    ` : ''}
                    <div class="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                        <i data-lucide="calendar" class="w-3 h-3 text-slate-500"></i> 
                        <span>${fmt.dateOnly(sale.fecha_venta)} (${fmt.daysElapsed(sale.fecha_venta)})</span>
                    </div>
                </td>
                <td class="py-4 px-6 max-w-xs">
                    <div class="flex items-center gap-3">
                        <img class="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0" 
                            src="${imgUrl}" 
                            onerror="this.onerror=null;this.src='${DEFAULT_CLOTHING_IMAGE}'"
                            alt="Prenda">
                        <div class="truncate">
                            <div class="text-slate-200 font-medium">${combinedDescription}</div>
                            <div class="mt-1 flex items-center gap-1.5">
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${deliverBadgeClass}">
                                    ${deliverText}
                                </span>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-6 text-right font-semibold text-slate-300">
                    ${fmt.usd(ventaTotal)}
                </td>
                <td class="py-4 px-6 text-right font-medium text-emerald-500">
                    ${fmt.usd(abonado)}
                </td>
                <td class="py-4 px-6 text-right font-bold text-rose-400">
                    ${fmt.usd(saldoPendiente)}
                </td>
                <td class="py-4 px-6 text-right font-black text-amber-400">
                    ${fmt.bs(saldoBs)}
                </td>
                <td class="py-4 px-6 text-center">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClass}">
                        ${statusText}
                    </span>
                </td>
                <td class="py-4 px-6 text-center">
                    <div class="flex items-center justify-center gap-2">
                        <!-- Botón Ver Detalles del Pedido -->
                        <button class="btn-view-details p-1.5 bg-slate-900 border border-slate-800 hover:border-violet-500/50 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-violet-400 transition-all" 
                            data-sale-id="${sale.id}" 
                            data-client-name="${client.nombre}" 
                            data-client-phone="${client.telefono || 'Sin teléfono'}"
                            data-total-usd="${fmt.usd(ventaTotal)}"
                            data-pending-usd="${fmt.usd(saldoPendiente)}"
                            title="Ver detalle del pedido / prendas">
                            <i data-lucide="eye" class="w-4 h-4"></i>
                        </button>

                        <button class="btn-view-history p-1.5 bg-slate-900 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-brand-400 transition-all" 
                            data-sale-id="${sale.id}" 
                            data-client-name="${client.nombre}" 
                            data-product-desc="${combinedDescription}" 
                            data-total-usd="${fmt.usd(abonado)}"
                            title="Ver Historial de Abonos">
                            <i data-lucide="scroll" class="w-4 h-4"></i>
                        </button>
                        
                        <!-- Botón Agregar Prenda -->
                        <button class="btn-add-item-direct p-1.5 bg-brand-950 border border-brand-900 hover:border-brand-500 hover:bg-brand-900/50 rounded-lg text-brand-400 hover:text-white transition-all" 
                            data-sale-id="${sale.id}" 
                            data-client-name="${client.nombre}"
                            title="Agregar prenda a este pedido">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                        </button>

                        ${saldoPendiente > 0 ? `
                            <button class="btn-abono-direct p-1.5 bg-emerald-950 border border-emerald-900 hover:border-emerald-500 hover:bg-emerald-900/50 rounded-lg text-emerald-400 hover:text-white transition-all" 
                                data-sale-id="${sale.id}" 
                                title="Abonar a esta deuda">
                                <i data-lucide="hand-coins" class="w-4 h-4"></i>
                            </button>
                        ` : ''}
                        
                        ${!allDelivered ? `
                            <button class="btn-mark-delivered p-1.5 bg-brand-950 border border-brand-900 hover:border-brand-500 hover:bg-brand-900/50 rounded-lg text-brand-400 hover:text-white transition-all" 
                                data-sale-id="${sale.id}" 
                                data-prenda="${combinedDescription}"
                                title="Marcar todas las prendas como Entregadas">
                                <i data-lucide="package-check" class="w-4 h-4"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            `;

            // Event handler para ver detalles
            const btnDetails = tr.querySelector('.btn-view-details');
            if (btnDetails) {
                btnDetails.addEventListener('click', (e) => {
                    const btn = e.currentTarget;
                    openOrderDetails(btn.dataset.saleId, btn.dataset.clientName, btn.dataset.clientPhone, btn.dataset.totalUsd, btn.dataset.pendingUsd);
                });
            }

            // Event handler para ver historial
            tr.querySelector('.btn-view-history').addEventListener('click', (e) => {
                const btn = e.currentTarget;
                openAbonosHistory(btn.dataset.saleId, btn.dataset.clientName, btn.dataset.productDesc, btn.dataset.totalUsd);
            });

            // Event handler para agregar prenda
            const btnAddItem = tr.querySelector('.btn-add-item-direct');
            if (btnAddItem) {
                btnAddItem.addEventListener('click', (e) => {
                    const btn = e.currentTarget;
                    openAddItemModal(btn.dataset.saleId, btn.dataset.clientName);
                });
            }

            // Event handler para abonar directo
            const btnAbono = tr.querySelector('.btn-abono-direct');
            if (btnAbono) {
                btnAbono.addEventListener('click', (e) => {
                    const saleId = e.currentTarget.dataset.saleId;
                    switchTab('abonos');
                    el.abonoVentaSelect.value = saleId;
                    handleAbonoSelectionChange();
                });
            }

            // Event handler para marcar como entregado
            const btnDeliver = tr.querySelector('.btn-mark-delivered');
            if (btnDeliver) {
                btnDeliver.addEventListener('click', (e) => {
                    const saleId = e.currentTarget.dataset.saleId;
                    const desc = e.currentTarget.dataset.prenda;
                    if (confirm(`¿Estás seguro de que deseas marcar como entregadas las prendas: "${desc}"?`)) {
                        handleMarkAsDelivered(saleId);
                    }
                });
            }

            tbody.appendChild(tr);
        });

        lucide.createIcons();
    }

    // --- ACCIÓN MARCAR COMO ENTREGADO ---
    async function handleMarkAsDelivered(saleId) {
        if (!window.supabaseClient.isConfigured) return;

        setLoader(true);
        const supabase = window.supabaseClient.supabase;

        try {
            const { error } = await supabase
                .from('productos')
                .update({ estado: 'entregado' })
                .eq('venta_id', saleId);

            if (error) throw error;

            showToast("Pedido Entregado", "Todas las prendas del pedido han sido cambiadas a 'Entregado'.", "success");
            await loadData();
        } catch (err) {
            console.error("Error al entregar pedido:", err);
            showToast("Error de Operación", "No se pudo actualizar el estado de entrega: " + err.message, "error");
        } finally {
            setLoader(false);
        }
    }

    // --- CARGAR DROPDOWN DE VENTAS ACTIVAS ---
    function populateAbonoSelect() {
        const select = el.abonoVentaSelect;
        select.innerHTML = '<option value="" disabled selected>Selecciona un pedido pendiente...</option>';

        const activeSales = state.sales.filter(sale => (parseFloat(sale.saldo_pendiente_usd) || 0) > 0);

        if (activeSales.length === 0) {
            select.innerHTML = '<option value="" disabled>No hay ventas con saldo pendiente</option>';
            return;
        }

        activeSales.forEach(sale => {
            const clientName = sale.clientes?.nombre || 'Desconocido';
            const productsList = sale.productos || [];
            const productDesc = productsList.map(p => p.descripcion).join(", ") || 'Prenda';
            const pending = parseFloat(sale.saldo_pendiente_usd) || 0;

            const option = document.createElement('option');
            option.value = sale.id;
            option.textContent = `${clientName} - ${productDesc} (Pendiente: ${fmt.usd(pending)})`;
            select.appendChild(option);
        });
    }

    // --- ACCIÓN SELECCIÓN DE ENCARGO EN ABONO ---
    function handleAbonoSelectionChange() {
        const saleId = el.abonoVentaSelect.value;
        const sale = state.sales.find(s => s.id === saleId);
        const rate = parseFloat(el.abonoTasaBcv.value) || state.bcvRate || 1;
        
        if (!sale) {
            state.selectedSaleForAbono = null;
            el.abonoCurrentBalanceUsd.textContent = "$0.00";
            el.abonoCurrentBalanceBs.textContent = "Bs. 0,00";
            el.abonoProjectedBalanceUsd.textContent = "$0.00";
            el.abonoProjectedBalanceBs.textContent = "Bs. 0,00";
            el.abonoMaxInfo.textContent = "Máx: Bs. 0.00";
            el.abonoMontoInput.value = "";
            calculateAbonoConversion();
            return;
        }

        state.selectedSaleForAbono = sale;
        const pendingUsd = parseFloat(sale.saldo_pendiente_usd) || 0;
        const pendingBs = pendingUsd * rate;
        
        el.abonoCurrentBalanceUsd.textContent = fmt.usd(pendingUsd);
        el.abonoCurrentBalanceBs.textContent = fmt.bs(pendingBs);
        
        if (state.abonoCurrency === 'Bs') {
            el.abonoMaxInfo.textContent = `Máx: ${fmt.bs(pendingBs)}`;
            el.abonoMontoInput.value = pendingBs.toFixed(2); // Sugerir abono completo en Bs
        } else {
            el.abonoMaxInfo.textContent = `Máx: ${fmt.usd(pendingUsd)}`;
            el.abonoMontoInput.value = pendingUsd.toFixed(2); // Sugerir abono completo en USD
        }
        
        calculateAbonoConversion();
    }

    // --- CALCULO DE CONVERSIÓN EN TIEMPO REAL ---
    function calculateAbonoConversion() {
        const montoInput = parseFloat(el.abonoMontoInput.value) || 0;
        const tasaBcv = parseFloat(el.abonoTasaBcv.value) || 1;
        
        let calculatedUsd = 0;
        let calculatedBs = 0;

        if (state.abonoCurrency === 'Bs') {
            calculatedBs = montoInput;
            calculatedUsd = montoInput / tasaBcv;
            el.abonoConversionResult.textContent = fmt.usd(calculatedUsd);
        } else {
            calculatedUsd = montoInput;
            calculatedBs = montoInput * tasaBcv;
            el.abonoConversionResult.textContent = fmt.bs(calculatedBs);
        }

        if (state.selectedSaleForAbono) {
            const currentPendingUsd = parseFloat(state.selectedSaleForAbono.saldo_pendiente_usd) || 0;
            const currentPendingBs = currentPendingUsd * tasaBcv;

            // Mostrar deuda actual actualizada
            el.abonoCurrentBalanceUsd.textContent = fmt.usd(currentPendingUsd);
            el.abonoCurrentBalanceBs.textContent = fmt.bs(currentPendingBs);

            // Proyectar remanentes
            const projectedRemainingUsd = Math.max(0, currentPendingUsd - calculatedUsd);
            const projectedRemainingBs = projectedRemainingUsd * tasaBcv;

            el.abonoProjectedBalanceUsd.textContent = fmt.usd(projectedRemainingUsd);
            el.abonoProjectedBalanceBs.textContent = fmt.bs(projectedRemainingBs);
            
            // Validar límites
            const isExceeded = (state.abonoCurrency === 'Bs') ? (montoInput > currentPendingBs + 0.05) : (montoInput > currentPendingUsd + 0.005);
            
            if (isExceeded) {
                el.abonoMontoInput.classList.add('border-rose-500', 'text-rose-400');
                el.abonoMontoInput.classList.remove('border-slate-800');
            } else {
                el.abonoMontoInput.classList.remove('border-rose-500', 'text-rose-400');
                el.abonoMontoInput.classList.add('border-slate-800');
            }
        } else {
            el.abonoProjectedBalanceUsd.textContent = "$0.00";
            el.abonoProjectedBalanceBs.textContent = "Bs. 0,00";
        }
    }

    // --- MANEJO DE PRENDAS TEMPORALES EN NUEVO ENCARGO ---
    function addGarmentToTempList() {
        const desc = el.prendaDescripcion.value.trim();
        const costUsd = parseFloat(el.precioCosto.value) || 0;
        const priceUsd = parseFloat(el.precioVenta.value) || 0;
        const imgUrl = el.prendaImagenUrl.value.trim() || null;

        if (!desc) {
            showToast("Validación", "Por favor ingresa la descripción de la prenda.", "warning");
            el.prendaDescripcion.focus();
            return;
        }

        if (priceUsd <= 0 || costUsd < 0) {
            showToast("Validación", "Por favor ingresa montos válidos para los precios.", "warning");
            return;
        }

        // Agregar prenda a la lista temporal
        state.tempOrderItems.push({
            descripcion: desc,
            precio_costo_usd: costUsd,
            precio_venta_usd: priceUsd,
            estado: 'encargado',
            imagen_url: imgUrl
        });

        // Limpiar inputs de la prenda
        el.prendaDescripcion.value = "";
        el.precioCosto.value = "";
        el.precioVenta.value = "";
        el.prendaImagenUrl.value = "";
        el.prendaPreview.src = "";
        el.prendaPreview.classList.add('hidden');
        el.prendaPreviewPlaceholder.classList.remove('hidden');
        
        // Ocultar indicador de ganancia individual
        document.getElementById('encargo-profit-container').classList.add('hidden');

        // Renderizar lista temporal
        renderTempItems();
        showToast("Prenda Añadida", `"${desc}" se agregó a la lista del pedido.`, "info");
    }

    function renderTempItems() {
        const tbody = el.tempItemsBody;
        tbody.innerHTML = "";

        if (state.tempOrderItems.length === 0) {
            el.tempItemsSection.classList.add('hidden');
            return;
        }

        el.tempItemsSection.classList.remove('hidden');

        let totalCost = 0;
        let totalPrice = 0;

        state.tempOrderItems.forEach((item, index) => {
            totalCost += item.precio_costo_usd;
            totalPrice += item.precio_venta_usd;

            const tr = document.createElement('tr');
            tr.className = "border-b border-slate-900/40 text-xs";
            tr.innerHTML = `
                <td class="py-2 px-4 text-slate-200 font-medium truncate max-w-[200px]">${item.descripcion}</td>
                <td class="py-2 px-4 text-right text-slate-400">${fmt.usd(item.precio_costo_usd)}</td>
                <td class="py-2 px-4 text-right text-emerald-400 font-semibold">${fmt.usd(item.precio_venta_usd)}</td>
                <td class="py-2 px-4 text-center">
                    <button type="button" class="btn-remove-temp p-1 hover:text-rose-400 transition-colors" data-index="${index}">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </td>
            `;

            tr.querySelector('.btn-remove-temp').addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.index);
                removeTempItem(idx);
            });

            tbody.appendChild(tr);
        });

        el.tempTotalCost.textContent = fmt.usd(totalCost);
        el.tempTotalPrice.textContent = fmt.usd(totalPrice);
        
        lucide.createIcons();
    }

    function removeTempItem(index) {
        state.tempOrderItems.splice(index, 1);
        renderTempItems();
    }

    function clearFullOrder() {
        state.tempOrderItems = [];
        el.formEncargo.reset();
        el.ventaFecha.value = new Date().toISOString().split('T')[0];
        el.prendaPreview.src = "";
        el.prendaPreview.classList.add('hidden');
        el.prendaPreviewPlaceholder.classList.remove('hidden');
        document.getElementById('encargo-profit-container').classList.add('hidden');
        renderTempItems();
        showToast("Formulario Limpiado", "Se reiniciaron todos los campos.", "info");
    }

    // --- GUARDAR NUEVO ENCARGO (CLIENTE, PRODUCTO, VENTA) ---
    async function handleNewOrder(e) {
        e.preventDefault();

        if (!window.supabaseClient.isConfigured) {
            showToast("Acción bloqueada", "Debes configurar Supabase primero.", "error");
            return;
        }

        const clientName = el.clienteNombre.value.trim();
        const clientPhone = el.clienteTelefono.value.trim();
        const orderDateVal = el.ventaFecha.value;
        const orderDate = orderDateVal ? new Date(orderDateVal).toISOString() : new Date().toISOString();

        if (!clientName) {
            showToast("Validación", "Por favor ingresa el nombre del cliente.", "warning");
            el.clienteNombre.focus();
            return;
        }

        // Si el usuario tenía una prenda escrita a medio llenar y la lista temporal está vacía,
        // la agregamos de forma automática al presionar "Guardar Encargo Completo".
        const currentDesc = el.prendaDescripcion.value.trim();
        if (currentDesc) {
            const costUsd = parseFloat(el.precioCosto.value) || 0;
            const priceUsd = parseFloat(el.precioVenta.value) || 0;
            const imgUrl = el.prendaImagenUrl.value.trim() || null;
            if (priceUsd > 0) {
                state.tempOrderItems.push({
                    descripcion: currentDesc,
                    precio_costo_usd: costUsd,
                    precio_venta_usd: priceUsd,
                    estado: 'encargado',
                    imagen_url: imgUrl
                });
            }
        }

        // Validar que tengamos al menos una prenda agregada
        if (state.tempOrderItems.length === 0) {
            showToast("Validación", "Debes agregar al menos una prenda al pedido para poder guardarlo.", "warning");
            return;
        }

        setLoader(true);
        const supabase = window.supabaseClient.supabase;

        try {
            // 1. Crear o buscar cliente
            let clientId = null;
            
            const { data: existingClients, error: searchError } = await supabase
                .from('clientes')
                .select('id')
                .eq('nombre', clientName)
                .limit(1);

            if (searchError) throw searchError;

            if (existingClients && existingClients.length > 0) {
                clientId = existingClients[0].id;
            } else {
                // Registrar nuevo cliente
                const { data: newClient, error: insertClientError } = await supabase
                    .from('clientes')
                    .insert([{ nombre: clientName, telefono: clientPhone }])
                    .select('id')
                    .single();

                if (insertClientError) throw insertClientError;
                clientId = newClient.id;
            }

            // Calcular totales de los items en el lote
            const totalCost = state.tempOrderItems.reduce((acc, item) => acc + item.precio_costo_usd, 0);
            const totalPrice = state.tempOrderItems.reduce((acc, item) => acc + item.precio_venta_usd, 0);

            // 2. Registrar la Venta (monto acumulativo de todo el lote)
            const { data: newSale, error: insertSaleError } = await supabase
                .from('ventas')
                .insert([{
                    cliente_id: clientId,
                    monto_total_usd: totalPrice,
                    saldo_pendiente_usd: totalPrice,
                    estado_pago: 'pendiente',
                    creado_en: orderDate
                }])
                .select('id')
                .single();

            if (insertSaleError) throw insertSaleError;
            const saleId = newSale.id;

            // 3. Registrar todos los Productos del lote asociados a la venta
            const { error: insertProductsError } = await supabase
                .from('productos')
                .insert(state.tempOrderItems.map(item => ({
                    venta_id: saleId,
                    descripcion: item.descripcion,
                    precio_costo_usd: item.precio_costo_usd,
                    precio_venta_usd: item.precio_venta_usd,
                    estado: 'encargado',
                    imagen_url: item.imagen_url
                })));

            if (insertProductsError) throw insertProductsError;

            showToast("Encargo Guardado", `Se ha registrado el pedido con ${state.tempOrderItems.length} prendas para ${clientName}.`, "success");
            
            // Reiniciar variables de estado y UI
            state.tempOrderItems = [];
            el.formEncargo.reset();
            el.ventaFecha.value = new Date().toISOString().split('T')[0];
            el.prendaPreview.src = "";
            el.prendaPreview.classList.add('hidden');
            el.prendaPreviewPlaceholder.classList.remove('hidden');
            renderTempItems();
            
            await loadData();
            switchTab('dashboard');

        } catch (err) {
            console.error("Error al registrar el encargo:", err);
            showToast("Error de Inserción", "No se pudo registrar el pedido: " + err.message, "error");
        } finally {
            setLoader(false);
        }
    }

    // --- GUARDAR NUEVO ABONO Y ACTUALIZAR VENTA ---
    async function handleNewAbono(e) {
        e.preventDefault();

        if (!window.supabaseClient.isConfigured) {
            showToast("Acción bloqueada", "Debes configurar Supabase primero.", "error");
            return;
        }

        const ventaId = el.abonoVentaSelect.value;
        const montoInput = parseFloat(el.abonoMontoInput.value) || 0;
        const tasaBcv = parseFloat(el.abonoTasaBcv.value) || 0;
        const metodoPago = el.abonoMetodo.value;
        const fechaPago = el.abonoFecha.value;

        if (!ventaId || montoInput <= 0 || tasaBcv <= 0 || !metodoPago) {
            showToast("Validación", "Por favor completa todos los campos del abono correctamente.", "warning");
            return;
        }

        const sale = state.sales.find(s => s.id === ventaId);
        if (!sale) {
            showToast("Error de Venta", "La venta seleccionada no es válida.", "error");
            return;
        }

        const saldoPendienteUsd = parseFloat(sale.saldo_pendiente_usd) || 0;
        
        // Calcular montos finales en ambas monedas
        let montoAbonoUsd = 0;
        let montoAbonoBs = 0;

        if (state.abonoCurrency === 'Bs') {
            montoAbonoBs = montoInput;
            montoAbonoUsd = montoInput / tasaBcv;
        } else {
            montoAbonoUsd = montoInput;
            montoAbonoBs = montoInput * tasaBcv;
        }

        // Validar límite con margen de tolerancia de centavos por redondeos
        if (montoAbonoUsd > saldoPendienteUsd + 0.05) {
            showToast("Límite superado", `El abono de $${montoAbonoUsd.toFixed(2)} supera el saldo pendiente de $${saldoPendienteUsd.toFixed(2)}.`, "error");
            return;
        }

        setLoader(true);
        const supabase = window.supabaseClient.supabase;

        try {
            // Asegurar que el monto en USD no sea mayor que el pendiente para evitar saldos negativos
            const montoAbonoUsdFinal = Math.min(saldoPendienteUsd, montoAbonoUsd);

            // 1. Insertar abono
            const { error: insertAbonoError } = await supabase
                .from('abonos')
                .insert([{
                    venta_id: ventaId,
                    monto_usd: montoAbonoUsdFinal,
                    tasa_bcv_dia: tasaBcv,
                    monto_bs: montoAbonoBs,
                    metodo_pago: metodoPago,
                    fecha: new Date(fechaPago).toISOString()
                }]);

            if (insertAbonoError) throw insertAbonoError;

            // 2. Calcular nuevo saldo y estado de pago
            let nuevoSaldoPendiente = Math.max(0, saldoPendienteUsd - montoAbonoUsdFinal);
            
            // Redondear a dos decimales para evitar problemas de coma flotante por conversión de monedas
            nuevoSaldoPendiente = Math.round(nuevoSaldoPendiente * 100) / 100;
            
            let nuevoEstadoPago = 'pendiente';
            
            if (nuevoSaldoPendiente <= 0.009) { // Tolerancia para menos de 1 centavo
                nuevoSaldoPendiente = 0;
                nuevoEstadoPago = 'completado';
            } else if (nuevoSaldoPendiente < parseFloat(sale.monto_total_usd) - 0.009) {
                nuevoEstadoPago = 'parcial';
            }

            // 3. Modificar la venta
            const { error: updateSaleError } = await supabase
                .from('ventas')
                .update({
                    saldo_pendiente_usd: nuevoSaldoPendiente,
                    estado_pago: nuevoEstadoPago
                })
                .eq('id', ventaId);

            if (updateSaleError) throw updateSaleError;

            showToast("Abono Registrado", `Abono de ${state.abonoCurrency === 'Bs' ? fmt.bs(montoAbonoBs) : fmt.usd(montoAbonoUsdFinal)} registrado con éxito.`, "success");
            
            el.formAbono.reset();
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            el.abonoFecha.value = now.toISOString().slice(0, 16);

            el.abonoVentaSelect.value = "";
            el.btnCurrencyBs.click(); // Resetear a moneda por defecto
            handleAbonoSelectionChange();

            await loadData();
            switchTab('dashboard');

        } catch (err) {
            console.error("Error al registrar abono:", err);
            showToast("Error de Operación", "No se pudo registrar el abono: " + err.message, "error");
        } finally {
            setLoader(false);
        }
    }

    // --- ABRIR DETALLE DE PRENDAS DEL PEDIDO ---
    function openOrderDetails(ventaId, clientName, clientPhone, totalUsd, pendingUsd) {
        const sale = state.sales.find(s => s.id === ventaId);
        const saleDateText = sale ? `${fmt.dateOnly(sale.fecha_venta)} (${fmt.daysElapsed(sale.fecha_venta)})` : '';
        
        el.detailsClientTitle.textContent = `Pedido de ${clientName}`;
        el.detailsClientPhone.textContent = `Teléfono: ${clientPhone} | Fecha: ${saleDateText}`;
        el.detailsTotalUsd.textContent = totalUsd;
        el.detailsPendingUsd.textContent = pendingUsd;

        const container = el.detailsItemsContainer;
        container.innerHTML = `
            <div class="flex items-center justify-center py-8 text-slate-500 gap-2">
                <div class="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Cargando prendas...</span>
            </div>
        `;
        el.orderDetailsModal.classList.remove('hidden');

        // Buscar la venta en el estado local para obtener las prendas asociadas
        if (!sale) {
            container.innerHTML = `<div class="py-8 text-center text-rose-400">No se encontró la información del pedido.</div>`;
            return;
        }

        const items = sale.productos || [];
        if (items.length === 0) {
            container.innerHTML = `<div class="py-8 text-center text-slate-500">Este pedido no tiene prendas registradas.</div>`;
            return;
        }

        container.innerHTML = "";
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = "flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/60 gap-4 transition-all hover:bg-slate-900/60";
            
            const itemImg = item.imagen_url || DEFAULT_CLOTHING_IMAGE;
            
            card.innerHTML = `
                <div class="flex items-center gap-3.5 min-w-0">
                    <img class="w-12 h-12 rounded-xl object-cover bg-slate-950 border border-slate-800 shrink-0" 
                        src="${itemImg}" 
                        onerror="this.onerror=null;this.src='${DEFAULT_CLOTHING_IMAGE}'"
                        alt="${item.descripcion}">
                    <div class="min-w-0">
                        <h4 class="text-sm font-semibold text-slate-200 truncate pr-2" title="${item.descripcion}">${item.descripcion}</h4>
                        <p class="text-[11px] text-slate-500 mt-1">
                            Costo: <span class="font-medium text-slate-400">${fmt.usd(item.precio_costo_usd)}</span> | 
                            Venta: <span class="font-medium text-brand-400">${fmt.usd(item.precio_venta_usd)}</span>
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2.5 shrink-0">
                    ${item.estado === 'entregado' ? `
                        <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-950 text-slate-500 border border-slate-800/80">
                            Entregado
                        </span>
                    ` : `
                        <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-brand-950/60 text-brand-400 border border-brand-800/30">
                            Pendiente
                        </span>
                        <button class="btn-deliver-single px-3 py-1.5 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-bold rounded-lg text-[10px] transition-all flex items-center gap-1 shadow-sm"
                            data-product-id="${item.id}" data-prenda-desc="${item.descripcion}">
                            <i data-lucide="package-check" class="w-3.5 h-3.5"></i> Entregar
                        </button>
                    `}
                </div>
            `;

            const btnDeliver = card.querySelector('.btn-deliver-single');
            if (btnDeliver) {
                btnDeliver.addEventListener('click', async (e) => {
                    const btn = e.currentTarget;
                    if (confirm(`¿Marcar "${btn.dataset.prendaDesc}" como entregado?`)) {
                        await handleMarkSingleAsDelivered(btn.dataset.productId, btn.dataset.prendaDesc);
                        // Cerrar modal
                        el.orderDetailsModal.classList.add('hidden');
                    }
                });
            }

            container.appendChild(card);
        });

        lucide.createIcons();
    }

    // --- ACCIÓN ENTREGAR UNA PRENDA INDIVIDUAL ---
    async function handleMarkSingleAsDelivered(productId, desc) {
        if (!window.supabaseClient.isConfigured) return;

        setLoader(true);
        const supabase = window.supabaseClient.supabase;

        try {
            const { error } = await supabase
                .from('productos')
                .update({ estado: 'entregado' })
                .eq('id', productId);

            if (error) throw error;

            showToast("Prenda Entregada", `"${desc}" ha sido marcada como entregada.`, "success");
            await loadData();

        } catch (err) {
            console.error("Error al entregar prenda:", err);
            showToast("Error", err.message, "error");
        } finally {
            setLoader(false);
        }
    }

    // --- ABRIR HISTORIAL DE ABONOS DE UNA VENTA ---
    async function openAbonosHistory(ventaId, clientName, productDesc, totalAbonado) {
        if (!window.supabaseClient.isConfigured) return;

        el.historyClientTitle.textContent = `Abonos de ${clientName}`;
        el.historyProductTitle.textContent = `Prenda: ${productDesc}`;
        el.historyTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="py-8 text-center text-slate-500">
                    <div class="flex items-center justify-center gap-2">
                        <div class="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Cargando abonos...</span>
                    </div>
                </td>
            </tr>
        `;
        el.historyTotalUsd.textContent = totalAbonado;
        el.historyModal.classList.remove('hidden');

        const supabase = window.supabaseClient.supabase;

        try {
            const { data: abonos, error } = await supabase
                .from('abonos')
                .select('*')
                .eq('venta_id', ventaId)
                .order('fecha', { ascending: false });

            if (error) throw error;

            const tbody = el.historyTableBody;
            tbody.innerHTML = "";

            if (!abonos || abonos.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="py-6 text-center text-slate-500">
                            No se han registrado abonos para este pedido.
                        </td>
                    </tr>
                `;
                return;
            }

            let sumUsd = 0;

            abonos.forEach(abono => {
                const rowTotalUsd = parseFloat(abono.monto_usd) || 0;
                sumUsd += rowTotalUsd;

                const tr = document.createElement('tr');
                tr.className = "border-b border-slate-900/60 hover:bg-slate-900/20";
                tr.innerHTML = `
                    <td class="py-3 px-4 text-slate-400">${fmt.date(abono.fecha)}</td>
                    <td class="py-3 px-4 text-right font-semibold text-emerald-400">${fmt.usd(rowTotalUsd)}</td>
                    <td class="py-3 px-4 text-right text-slate-400">Bs. ${parseFloat(abono.tasa_bcv_dia).toFixed(2)}</td>
                    <td class="py-3 px-4 text-right text-amber-400 font-bold">${fmt.bs(parseFloat(abono.monto_bs))}</td>
                    <td class="py-3 px-4 text-slate-300"><span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">${abono.metodo_pago}</span></td>
                `;
                tbody.appendChild(tr);
            });

            el.historyTotalUsd.textContent = fmt.usd(sumUsd);

        } catch (err) {
            console.error("Error al obtener historial de abonos:", err);
            el.historyTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="py-6 text-center text-rose-400">
                        Error al cargar los pagos: ${err.message}
                    </td>
                </tr>
            `;
        }
    }

    // --- RENDERIZAR GRÁFICOS Y METRICAS CON CHART.JS ---
    function renderCharts() {
        if (!window.supabaseClient.isConfigured || typeof Chart === 'undefined') return;

        const dateInicioStr = el.reportesFechaInicio.value;
        const dateFinStr = el.reportesFechaFin.value;

        if (!dateInicioStr || !dateFinStr) return;

        // Parsear rango de fechas (desde las 00:00:00 del primer día hasta las 23:59:59 del final)
        const startDate = new Date(dateInicioStr + "T00:00:00");
        const endDate = new Date(dateFinStr + "T23:59:59");

        // --- 1. Filtrar Ventas en el Rango ---
        const periodSales = state.sales.filter(sale => {
            const saleDate = new Date(sale.creado_en);
            return saleDate >= startDate && saleDate <= endDate;
        });

        // --- 2. Calcular KPIs del Período ---
        let totalVentas = 0;
        let totalInversion = 0;
        let totalDeuda = 0;
        
        // Mapa para contar volumen de venta por descripción de prenda
        const productSalesCount = {};

        periodSales.forEach(sale => {
            const total = parseFloat(sale.monto_total_usd) || 0;
            const pending = parseFloat(sale.saldo_pendiente_usd) || 0;
            
            const productsList = sale.productos || [];
            const cost = productsList.reduce((acc, p) => acc + (parseFloat(p.precio_costo_usd) || 0), 0);

            totalVentas += total;
            totalDeuda += pending;
            totalInversion += cost;

            // Popularidad de productos
            productsList.forEach(p => {
                const desc = p.descripcion || "Desconocido";
                productSalesCount[desc] = (productSalesCount[desc] || 0) + 1;
            });
        });

        const totalAbonos = Math.max(0, totalVentas - totalDeuda);
        const gananciaBruta = totalVentas - totalInversion;
        const rentabilidad = totalInversion > 0 ? (gananciaBruta / totalInversion) * 100 : 0;
        const retornoCostosPercent = totalInversion > 0 ? (totalAbonos / totalInversion) * 100 : 0;
        const cobroPercent = totalVentas > 0 ? (totalAbonos / totalVentas) * 100 : 0;

        // Escribir KPIs en pantalla
        el.kpiVentasTotales.textContent = fmt.usd(totalVentas);
        el.kpiInversionTotal.textContent = fmt.usd(totalInversion);
        el.kpiGananciaTotal.textContent = fmt.usd(gananciaBruta);
        el.kpiRentabilidadPercent.textContent = `${rentabilidad.toFixed(0)}%`;
        el.kpiRetornoPercent.textContent = `${retornoCostosPercent.toFixed(0)}%`;
        el.kpiAbonosTotal.textContent = fmt.usd(totalAbonos);
        el.kpiCobroPercent.textContent = `${cobroPercent.toFixed(0)}%`;
        el.kpiDeudaActiva.textContent = fmt.usd(totalDeuda);

        // Estilos dinámicos para el KPI de Cobro
        if (cobroPercent >= 80) {
            el.kpiCobroPercent.className = "text-base font-black text-emerald-400 mt-1";
        } else if (cobroPercent >= 50) {
            el.kpiCobroPercent.className = "text-base font-black text-sky-400 mt-1";
        } else {
            el.kpiCobroPercent.className = "text-base font-black text-rose-400 mt-1";
        }

        // Estilos dinámicos para el KPI de Retorno de Costos
        if (retornoCostosPercent >= 100) {
            el.kpiRetornoPercent.className = "text-base font-black text-emerald-400 mt-1";
        } else if (retornoCostosPercent >= 75) {
            el.kpiRetornoPercent.className = "text-base font-black text-sky-400 mt-1";
        } else {
            el.kpiRetornoPercent.className = "text-base font-black text-amber-400 mt-1";
        }

        // --- 3. Diagnóstico de Salud Financiera Automatizado ---
        let diagnostico = "";
        let alertBgClass = "p-4 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs flex gap-3 items-start";
        let alertIconColor = "p-1.5 rounded-xl bg-brand-500/20 text-brand-400 shrink-0 mt-0.5 animate-pulse";

        if (periodSales.length === 0) {
            diagnostico = "No se registraron ventas en este rango de fechas. Ingresa nuevos encargos en la pestaña de 'Nuevo Encargo' para iniciar el análisis del negocio.";
        } else {
            // Rentabilidad (Markup)
            let analysisMarkup = "";
            if (rentabilidad >= 50) {
                analysisMarkup = `Tu rentabilidad promedio es excelente (${rentabilidad.toFixed(0)}% de margen sobre costo). Tus precios de venta tienen un colchón de ganancia ideal para el retail de ropa. `;
            } else if (rentabilidad >= 25) {
                analysisMarkup = `Tu rentabilidad del ${rentabilidad.toFixed(0)}% es saludable y se mantiene en el promedio estándar comercial. `;
            } else {
                analysisMarkup = `⚠️ CUIDADO CON EL MARGEN: Tu rentabilidad es baja (${rentabilidad.toFixed(0)}%). Intenta reducir tus costos de adquisición de ropa o aumentar ligeramente tus precios de venta para no arriesgar la viabilidad del negocio. `;
            }

            // Liquidez (Cobro %)
            let analysisLiquidity = "";
            if (cobroPercent >= 80) {
                analysisLiquidity = `¡Tu cobranza está excelente! Has recaudado el ${cobroPercent.toFixed(0)}% de la facturación. No tienes dinero retenido en deudas de clientes, garantizando alta liquidez. `;
            } else if (cobroPercent >= 50) {
                analysisLiquidity = `Tu índice de cobro es moderado (${cobroPercent.toFixed(0)}%). Mantienes ${fmt.usd(totalDeuda)} de crédito en la calle. Para mejorar esto, exige siempre un pago inicial del 50% al encargar prendas. `;
                alertBgClass = "p-4 rounded-2xl bg-sky-950/20 border border-sky-900/40 text-xs flex gap-3 items-start";
                alertIconColor = "p-1.5 rounded-xl bg-sky-500/20 text-sky-400 shrink-0 mt-0.5";
            } else {
                analysisLiquidity = `🚨 ALERTA DE CAJA: Has cobrado solo el ${cobroPercent.toFixed(0)}% del dinero vendido. Tienes ${fmt.usd(totalDeuda)} pendientes por cobrar. Estás actuando como financista de tus clientes y arriesgas quedarte sin efectivo para comprar nueva mercancía. No entregues prendas sin pago completo. `;
                alertBgClass = "p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40 text-xs flex gap-3 items-start";
                alertIconColor = "p-1.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5";
            }

            // Punto de Equilibrio (Retorno %)
            let analysisRoi = "";
            if (retornoCostosPercent >= 100) {
                analysisRoi = `🎉 ¡PUNTO DE EQUILIBRIO ALCANZADO! Los abonos de tus clientes ya recobraron el ${retornoCostosPercent.toFixed(0)}% de la inversión de compra del período. Ya recuperaste tu capital inicial y operas en ganancias líquidas.`;
                alertBgClass = "p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 text-xs flex gap-3 items-start";
                alertIconColor = "p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5";
            } else {
                analysisRoi = `Aún debes recuperar el ${(100 - retornoCostosPercent).toFixed(0)}% de la inversión realizada en ropa (${fmt.usd(totalInversion - totalAbonos)} restantes para recuperar costos). Concéntrate en cobrar la deuda para liberar tu inversión inicial.`;
            }

            diagnostico = `${analysisMarkup}${analysisLiquidity}${analysisRoi}`;
        }

        el.kpiDiagnosticoTexto.textContent = diagnostico;
        el.kpiDiagnosticoContainer.className = alertBgClass;
        el.kpiDiagnosticoContainer.querySelector('div').className = alertIconColor;

        // --- 4. Gráfica 1: Resumen de Balance ($) ---
        const ctxFinances = document.getElementById('chart-finances').getContext('2d');
        
        if (state.charts.finances) {
            state.charts.finances.destroy();
        }

        state.charts.finances = new Chart(ctxFinances, {
            type: 'doughnut',
            data: {
                labels: ['Cobrado (Recaudado)', 'Por Cobrar (Pendiente)'],
                datasets: [{
                    data: [totalAbonos, totalDeuda],
                    backgroundColor: ['#10b981', '#f43f5e'],
                    borderColor: ['#065f46', '#9f1239'],
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#e2e8f0',
                            font: { family: 'Inter', size: 11 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: $${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });

        // --- 5. Gráfica 2: Rotación de Prendas (Cantidades Vendidas) ---
        const sortedProducts = Object.keys(productSalesCount).map(key => ({
            name: key,
            count: productSalesCount[key]
        })).sort((a, b) => a.count - b.count); // Orden ascendente: prendas que se venden MENOS primero

        const chartProdData = sortedProducts.slice(0, 7);

        const ctxProducts = document.getElementById('chart-products').getContext('2d');
        
        if (state.charts.products) {
            state.charts.products.destroy();
        }

        state.charts.products = new Chart(ctxProducts, {
            type: 'bar',
            data: {
                labels: chartProdData.map(p => p.name),
                datasets: [{
                    label: 'Unidades Vendidas',
                    data: chartProdData.map(p => p.count),
                    backgroundColor: 'rgba(139, 92, 246, 0.55)',
                    borderColor: '#8b5cf6',
                    borderWidth: 1.5,
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#94a3b8',
                            stepSize: 1,
                            font: { family: 'Inter' }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#cbd5e1',
                            font: { family: 'Inter', size: 10 }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Iniciar la app
    init();
});
