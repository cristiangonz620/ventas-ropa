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

        historyModal: document.getElementById('history-modal'),
        btnCloseHistory: document.getElementById('btn-close-history'),
        btnCloseHistoryFooter: document.getElementById('btn-close-history-footer'),
        historyClientTitle: document.getElementById('history-client-title'),
        historyProductTitle: document.getElementById('history-product-title'),
        historyTableBody: document.getElementById('history-table-body'),
        historyTotalUsd: document.getElementById('history-total-usd'),
        
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
        
        // Establecer fechas por defecto en Reportes (los últimos 30 días)
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        el.reportesFechaInicio.value = thirtyDaysAgo.toISOString().split('T')[0];
        el.reportesFechaFin.value = today.toISOString().split('T')[0];
        
        setupEventListeners();
        
        // Consultar tasa oficial de forma asíncrona al iniciar
        fetchBcvRate();
        
        if (window.supabaseClient.isConfigured) {
            loadData();
        }
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
        }
    };

    // --- EVENT LISTENERS ---
    function setupEventListeners() {
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
            el.abonoVentaSelect.value = "";
            // Resetear a moneda por defecto (Bs)
            el.btnCurrencyBs.click();
            handleAbonoSelectionChange();
            switchTab('dashboard');
        });

        // Historial Modal
        el.btnCloseHistory.addEventListener('click', () => el.historyModal.classList.add('hidden'));
        el.btnCloseHistoryFooter.addEventListener('click', () => el.historyModal.classList.add('hidden'));

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
            const prodDesc = sale.productos?.descripcion?.toLowerCase() || "";
            
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
            const product = sale.productos || { descripcion: 'Prenda no identificada', precio_venta_usd: 0, estado: 'encargado', imagen_url: null };
            
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

            // Imagen del producto (con fallback)
            const imgUrl = product.imagen_url || DEFAULT_CLOTHING_IMAGE;

            // Badge de entrega de producto
            let deliverBadgeClass = "";
            let deliverText = "";
            if (product.estado === 'entregado') {
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
                    <div class="font-semibold text-white">${client.nombre}</div>
                    <div class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <i data-lucide="phone" class="w-3 h-3"></i> ${client.telefono || 'Sin teléfono'}
                    </div>
                </td>
                <td class="py-4 px-6 max-w-xs">
                    <div class="flex items-center gap-3">
                        <img class="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0" 
                            src="${imgUrl}" 
                            onerror="this.onerror=null;this.src='${DEFAULT_CLOTHING_IMAGE}'"
                            alt="Prenda">
                        <div class="truncate">
                            <div class="text-slate-200 font-medium">${product.descripcion}</div>
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
                        <button class="btn-view-history p-1.5 bg-slate-900 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-800/80 rounded-lg text-slate-400 hover:text-brand-400 transition-all" 
                            data-sale-id="${sale.id}" 
                            data-client-name="${client.nombre}" 
                            data-product-desc="${product.descripcion}" 
                            data-total-usd="${fmt.usd(abonado)}"
                            title="Ver Historial de Abonos">
                            <i data-lucide="scroll" class="w-4 h-4"></i>
                        </button>
                        
                        ${saldoPendiente > 0 ? `
                            <button class="btn-abono-direct p-1.5 bg-emerald-950 border border-emerald-900 hover:border-emerald-500 hover:bg-emerald-900/50 rounded-lg text-emerald-400 hover:text-white transition-all" 
                                data-sale-id="${sale.id}" 
                                title="Abonar a esta deuda">
                                <i data-lucide="hand-coins" class="w-4 h-4"></i>
                            </button>
                        ` : ''}
                        
                        ${product.estado !== 'entregado' ? `
                            <button class="btn-mark-delivered p-1.5 bg-brand-950 border border-brand-900 hover:border-brand-500 hover:bg-brand-900/50 rounded-lg text-brand-400 hover:text-white transition-all" 
                                data-product-id="${product.id}" 
                                data-prenda="${product.descripcion}"
                                title="Marcar como Entregado al Cliente">
                                <i data-lucide="package-check" class="w-4 h-4"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            `;

            // Event handler para ver historial
            tr.querySelector('.btn-view-history').addEventListener('click', (e) => {
                const btn = e.currentTarget;
                openAbonosHistory(btn.dataset.saleId, btn.dataset.clientName, btn.dataset.productDesc, btn.dataset.totalUsd);
            });

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
                    const prodId = e.currentTarget.dataset.productId;
                    const desc = e.currentTarget.dataset.prenda;
                    if (confirm(`¿Estás seguro de que deseas marcar "${desc}" como entregado?`)) {
                        handleMarkAsDelivered(prodId);
                    }
                });
            }

            tbody.appendChild(tr);
        });

        lucide.createIcons();
    }

    // --- ACCIÓN MARCAR COMO ENTREGADO ---
    async function handleMarkAsDelivered(productId) {
        if (!window.supabaseClient.isConfigured) return;

        setLoader(true);
        const supabase = window.supabaseClient.supabase;

        try {
            const { error } = await supabase
                .from('productos')
                .update({ estado: 'entregado' })
                .eq('id', productId);

            if (error) throw error;

            showToast("Producto Entregado", "El estado del producto ha sido cambiado a 'Entregado'.", "success");
            await loadData();
        } catch (err) {
            console.error("Error al entregar producto:", err);
            showToast("Error de Operación", "No se pudo actualizar el estado del producto: " + err.message, "error");
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
            const productDesc = sale.productos?.descripcion || 'Prenda';
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

    // --- GUARDAR NUEVO ENCARGO (CLIENTE, PRODUCTO, VENTA) ---
    async function handleNewOrder(e) {
        e.preventDefault();

        if (!window.supabaseClient.isConfigured) {
            showToast("Acción bloqueada", "Debes configurar Supabase primero.", "error");
            return;
        }

        const clientName = el.clienteNombre.value.trim();
        const clientPhone = el.clienteTelefono.value.trim();
        const productDesc = el.prendaDescripcion.value.trim();
        const productImgUrl = el.prendaImagenUrl.value.trim() || null;
        const costUsd = parseFloat(el.precioCosto.value) || 0;
        const priceUsd = parseFloat(el.precioVenta.value) || 0;

        if (priceUsd <= 0 || costUsd < 0) {
            showToast("Validación", "Los montos de dinero deben ser válidos.", "warning");
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

            // 2. Registrar el Producto (con el nuevo campo imagen_url)
            const { data: newProduct, error: insertProductError } = await supabase
                .from('productos')
                .insert([{
                    descripcion: productDesc,
                    precio_costo_usd: costUsd,
                    precio_venta_usd: priceUsd,
                    estado: 'encargado',
                    imagen_url: productImgUrl
                }])
                .select('id')
                .single();

            if (insertProductError) throw insertProductError;
            const productId = newProduct.id;

            // 3. Registrar la Venta
            const { error: insertSaleError } = await supabase
                .from('ventas')
                .insert([{
                    cliente_id: clientId,
                    producto_id: productId,
                    monto_total_usd: priceUsd,
                    saldo_pendiente_usd: priceUsd,
                    estado_pago: 'pendiente'
                }]);

            if (insertSaleError) throw insertSaleError;

            showToast("Encargo Guardado", `Se ha registrado el pedido de "${productDesc}" para ${clientName}.`, "success");
            
            // Reiniciar formulario y vista previa
            el.formEncargo.reset();
            el.prendaPreview.src = "";
            el.prendaPreview.classList.add('hidden');
            el.prendaPreviewPlaceholder.classList.remove('hidden');
            
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
            const cost = parseFloat(sale.productos?.precio_costo_usd) || 0;

            totalVentas += total;
            totalDeuda += pending;
            totalInversion += cost;

            // Popularidad de productos
            const desc = sale.productos?.descripcion || "Desconocido";
            productSalesCount[desc] = (productSalesCount[desc] || 0) + 1;
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
