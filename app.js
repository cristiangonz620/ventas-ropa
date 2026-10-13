// ============================================================================
// LÓGICA PRINCIPAL DE LA APLICACIÓN (app.js) - FASE 2
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO GENERAL ---
    const state = {
        sales: [],
        cortes: [],
        activeCorte: null,
        corteScope: 'active', // 'active' | 'all' | 'archived'
        selectedCorteForDetail: null,
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
        tabDashboardText: document.getElementById('tab-dashboard-text'),
        tabEncargo: document.getElementById('tab-encargo'),
        tabAbonos: document.getElementById('tab-abonos'),
        tabCortes: document.getElementById('tab-cortes'),
        tabReportes: document.getElementById('tab-reportes'),
        contentDashboard: document.getElementById('content-dashboard'),
        contentEncargo: document.getElementById('content-encargo'),
        contentAbonos: document.getElementById('content-abonos'),
        contentCortes: document.getElementById('content-cortes'),
        contentReportes: document.getElementById('content-reportes'),
        
        // Banner de Corte Activo
        activeCorteBanner: document.getElementById('active-corte-banner'),
        noActiveCorteBanner: document.getElementById('no-active-corte-banner'),
        corteActiveTitle: document.getElementById('corte-active-title'),
        corteActiveDesc: document.getElementById('corte-active-desc'),
        corteActiveDateBadge: document.getElementById('corte-active-date-badge'),
        btnOpenCloseCorte: document.getElementById('btn-open-close-corte'),
        btnOpenNewCorteDashboard: document.getElementById('btn-open-new-corte-dashboard'),
        btnStartFirstCorte: document.getElementById('btn-start-first-corte'),
        btnGotoCortesHistory: document.getElementById('btn-goto-cortes-history'),
        corteScopeFilter: document.getElementById('corte-scope-filter'),
        dashboardTableTitle: document.getElementById('dashboard-table-title'),
        dashboardTableSubtitle: document.getElementById('dashboard-table-subtitle'),

        // Historial de Cortes
        btnToggleUnassignedSales: document.getElementById('btn-toggle-unassigned-sales'),
        btnNewCorteHistoryTab: document.getElementById('btn-new-corte-history-tab'),
        searchCortesInput: document.getElementById('search-cortes-input'),
        cortesCountBadge: document.getElementById('cortes-count-badge'),
        cortesGrid: document.getElementById('cortes-grid'),
        unassignedSalesSection: document.getElementById('unassigned-sales-section'),
        btnCloseUnassignedSales: document.getElementById('btn-close-unassigned-sales'),
        unassignedSalesTableBody: document.getElementById('unassigned-sales-table-body'),

        // Modales de Cortes
        newCorteModal: document.getElementById('new-corte-modal'),
        btnCloseNewCorte: document.getElementById('btn-close-new-corte'),
        btnCancelNewCorte: document.getElementById('btn-cancel-new-corte'),
        formNewCorte: document.getElementById('form-new-corte'),
        newCorteName: document.getElementById('new-corte-name'),
        newCorteDate: document.getElementById('new-corte-date'),
        newCorteDesc: document.getElementById('new-corte-desc'),
        newCortePendingSection: document.getElementById('new-corte-pending-section'),
        checkSelectAllPending: document.getElementById('check-select-all-pending'),
        newCortePendingList: document.getElementById('new-corte-pending-list'),

        closeCorteModal: document.getElementById('close-corte-modal'),
        btnCloseCloseCorte: document.getElementById('btn-close-close-corte'),
        btnCancelCloseCorte: document.getElementById('btn-cancel-close-corte'),
        btnConfirmCloseCorte: document.getElementById('btn-confirm-close-corte'),
        closeCorteTitle: document.getElementById('close-corte-title'),
        closeCorteTotalSales: document.getElementById('close-corte-total-sales'),
        closeCorteTotalCollected: document.getElementById('close-corte-total-collected'),
        closeCorteTotalPending: document.getElementById('close-corte-total-pending'),
        closeCorteHasPendingWarning: document.getElementById('close-corte-has-pending-warning'),
        closeCortePendingCount: document.getElementById('close-corte-pending-count'),
        closeCortePendingList: document.getElementById('close-corte-pending-list'),
        closeCorteCreateNext: document.getElementById('close-corte-create-next'),
        closeCorteNextFields: document.getElementById('close-corte-next-fields'),
        nextCorteNameInput: document.getElementById('next-corte-name-input'),
        nextCorteDateInput: document.getElementById('next-corte-date-input'),
        closeCorteCleanSuccess: document.getElementById('close-corte-clean-success'),

        corteDetailModal: document.getElementById('corte-detail-modal'),
        btnCloseCorteDetail: document.getElementById('btn-close-corte-detail'),
        btnCloseCorteDetailFooter: document.getElementById('btn-close-corte-detail-footer'),
        modalCorteDetailTitle: document.getElementById('modal-corte-detail-title'),
        modalCorteDetailBadge: document.getElementById('modal-corte-detail-badge'),
        modalCorteDetailDates: document.getElementById('modal-corte-detail-dates'),
        modalCorteKpiSales: document.getElementById('modal-corte-kpi-sales'),
        modalCorteKpiCollected: document.getElementById('modal-corte-kpi-collected'),
        modalCorteKpiCost: document.getElementById('modal-corte-kpi-cost'),
        modalCorteKpiProfit: document.getElementById('modal-corte-kpi-profit'),
        modalCorteKpiPending: document.getElementById('modal-corte-kpi-pending'),
        modalCorteTableBody: document.getElementById('modal-corte-table-body'),
        modalCorteOrdersCount: document.getElementById('modal-corte-orders-count'),
        btnReopenCorteFromModal: document.getElementById('btn-reopen-corte-from-modal'),
        
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

        // Modal Confirmación Custom
        confirmModal: document.getElementById('confirm-modal'),
        confirmModalTitle: document.getElementById('confirm-modal-title'),
        confirmModalMessage: document.getElementById('confirm-modal-message'),
        confirmModalIcon: document.getElementById('confirm-modal-icon'),
        confirmModalIconContainer: document.getElementById('confirm-modal-icon-container'),
        btnConfirmModalOk: document.getElementById('btn-confirm-modal-ok'),
        btnConfirmModalCancel: document.getElementById('btn-confirm-modal-cancel'),
        btnConfirmModalClose: document.getElementById('btn-confirm-modal-close'),

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
        addItemProfitContainer: document.getElementById('add-item-profit-container'),
        addItemProfitUsd: document.getElementById('add-item-profit-usd'),
        addItemProfitPercent: document.getElementById('add-item-profit-percent'),

        // Editar Prenda Modal
        editItemModal: document.getElementById('edit-item-modal'),
        btnCloseEditItem: document.getElementById('btn-close-edit-item'),
        btnCancelEditItem: document.getElementById('btn-cancel-edit-item'),
        formEditItem: document.getElementById('form-edit-item'),
        editItemProductId: document.getElementById('edit-item-product-id'),
        editItemSaleId: document.getElementById('edit-item-sale-id'),
        editItemDesc: document.getElementById('edit-item-desc'),
        editItemCost: document.getElementById('edit-item-cost'),
        editItemPrice: document.getElementById('edit-item-price'),
        editItemImg: document.getElementById('edit-item-img'),
        editItemProfitContainer: document.getElementById('edit-item-profit-container'),
        editItemProfitUsd: document.getElementById('edit-item-profit-usd'),
        editItemProfitPercent: document.getElementById('edit-item-profit-percent'),

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
        loginErrorAlert: document.getElementById('login-error-alert'),
        loginErrorText: document.getElementById('login-error-text'),
        btnLogout: document.getElementById('btn-logout'),

        // Recuperación de Contraseña
        btnForgotPasswordLink: document.getElementById('btn-forgot-password-link'),
        forgotPasswordModal: document.getElementById('forgot-password-modal'),
        btnCloseForgot: document.getElementById('btn-close-forgot'),
        btnCancelForgot: document.getElementById('btn-cancel-forgot'),
        formForgotPassword: document.getElementById('form-forgot-password'),
        forgotEmail: document.getElementById('forgot-email'),
        
        resetPasswordModal: document.getElementById('reset-password-modal'),
        formResetPassword: document.getElementById('form-reset-password'),
        resetPasswordNew: document.getElementById('reset-password-new'),

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
        salesCardsMobile: document.getElementById('sales-cards-mobile'),
        
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

            if (event === 'PASSWORD_RECOVERY') {
                // Mostrar modal de nueva contraseña
                el.loginOverlay.classList.add('hidden');
                el.resetPasswordModal.classList.remove('hidden');
                return;
            }

            if (session && session.user) {
                // Usuario autenticado
                el.loginOverlay.classList.add('hidden');
                el.btnLogout.classList.remove('hidden');
                if (el.loginErrorAlert) el.loginErrorAlert.classList.add('hidden');
                loadData();
            } else {
                // Usuario no autenticado
                el.loginOverlay.classList.remove('hidden');
                el.btnLogout.classList.add('hidden');
                if (el.loginErrorAlert) el.loginErrorAlert.classList.add('hidden');
                clearStateAndUI();
            }
        });
    }

    function clearStateAndUI() {
        state.sales = [];
        state.cortes = [];
        state.activeCorte = null;
        state.corteScope = 'active';
        if (el.activeCorteBanner) el.activeCorteBanner.classList.add('hidden');
        if (el.noActiveCorteBanner) el.noActiveCorteBanner.classList.remove('hidden');

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
        if (el.addItemProfitContainer) {
            el.addItemProfitContainer.classList.add('hidden');
        }
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

    // --- MODAL DE CONFIRMACIÓN INTEGRADO (Sustituye window.confirm) ---
    function showConfirmDialog({
        title = '¿Confirmar Acción?',
        message = '¿Estás seguro de continuar?',
        confirmText = 'Aceptar',
        cancelText = 'Cancelar',
        type = 'primary', // 'danger' | 'warning' | 'success' | 'primary'
        icon = null
    } = {}) {
        return new Promise((resolve) => {
            const modal = el.confirmModal;
            if (!modal) {
                resolve(window.confirm(`${title}\n\n${message}`));
                return;
            }

            el.confirmModalTitle.textContent = title;
            el.confirmModalMessage.textContent = message;
            el.btnConfirmModalOk.textContent = confirmText;
            el.btnConfirmModalCancel.textContent = cancelText;

            const iconContainer = el.confirmModalIconContainer;
            const okBtn = el.btnConfirmModalOk;

            // Reiniciar estilos de temas
            iconContainer.className = "p-3 rounded-2xl shrink-0";
            okBtn.className = "px-6 py-2.5 font-semibold rounded-xl text-xs transition-all shadow-lg flex items-center gap-2";

            let iconName = icon;

            if (type === 'danger') {
                iconName = icon || 'trash-2';
                iconContainer.classList.add('bg-rose-500/20', 'text-rose-400', 'border', 'border-rose-500/30');
                okBtn.classList.add('bg-rose-600', 'hover:bg-rose-500', 'active:bg-rose-700', 'text-white', 'shadow-rose-900/40');
            } else if (type === 'warning') {
                iconName = icon || 'alert-triangle';
                iconContainer.classList.add('bg-amber-500/20', 'text-amber-400', 'border', 'border-amber-500/30');
                okBtn.classList.add('bg-amber-600', 'hover:bg-amber-500', 'active:bg-amber-700', 'text-white', 'shadow-amber-900/40');
            } else if (type === 'success') {
                iconName = icon || 'check-circle-2';
                iconContainer.classList.add('bg-emerald-500/20', 'text-emerald-400', 'border', 'border-emerald-500/30');
                okBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-500', 'active:bg-emerald-700', 'text-white', 'shadow-emerald-900/40');
            } else {
                iconName = icon || 'help-circle';
                iconContainer.classList.add('bg-brand-500/20', 'text-brand-400', 'border', 'border-brand-500/30');
                okBtn.classList.add('bg-brand-600', 'hover:bg-brand-500', 'active:bg-brand-700', 'text-white', 'shadow-brand-900/40');
            }

            el.confirmModalIcon.setAttribute('data-lucide', iconName);
            lucide.createIcons();

            let isResolved = false;

            const cleanup = (result) => {
                if (isResolved) return;
                isResolved = true;
                modal.classList.add('hidden');
                document.removeEventListener('keydown', onKeyDown);
                resolve(result);
            };

            const onKeyDown = (e) => {
                if (e.key === 'Escape') cleanup(false);
                if (e.key === 'Enter') cleanup(true);
            };

            el.btnConfirmModalOk.onclick = () => cleanup(true);
            el.btnConfirmModalCancel.onclick = () => cleanup(false);
            if (el.btnConfirmModalClose) el.btnConfirmModalClose.onclick = () => cleanup(false);

            modal.onclick = (e) => {
                if (e.target === modal) cleanup(false);
            };

            document.addEventListener('keydown', onKeyDown);
            modal.classList.remove('hidden');
        });
    }

    // --- LOADER Y TOASTS ---
    function setLoader(show) {
        if (show) {
            el.globalLoader.classList.remove('hidden');
        } else {
            el.globalLoader.classList.add('hidden');
        }
    }

    // --- NOTIFICACIONES TOAST MEJORADAS ---
    function dismissToast(toast) {
        if (!toast || toast.dataset.dismissing === 'true') return;
        toast.dataset.dismissing = 'true';
        toast.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px) scale(0.95)';
        toast.style.maxHeight = '0px';
        toast.style.marginTop = '0px';
        toast.style.marginBottom = '0px';
        toast.style.paddingTop = '0px';
        toast.style.paddingBottom = '0px';
        toast.style.overflow = 'hidden';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 320);
    }

    function clearAllToasts() {
        if (!el.toastContainer) return;
        const all = el.toastContainer.querySelectorAll('.toast-card');
        all.forEach(t => dismissToast(t));
    }

    function showToast(title, message, type = 'success', duration = 4000) {
        if (!el.toastContainer) return;

        // Limitar a máximo 3 toasts simultáneos para no saturar la pantalla
        const activeToasts = el.toastContainer.querySelectorAll('.toast-card:not([data-dismissing="true"])');
        if (activeToasts.length >= 3) {
            dismissToast(activeToasts[0]);
        }

        const id = 'toast-' + Math.random().toString(36).substr(2, 9);
        const colorClasses = {
            success: 'bg-emerald-950/95 border-emerald-700/80 text-emerald-200 shadow-emerald-950/60',
            error: 'bg-rose-950/95 border-rose-700/80 text-rose-200 shadow-rose-950/60',
            warning: 'bg-amber-950/95 border-amber-700/80 text-amber-200 shadow-amber-950/60',
            info: 'bg-blue-950/95 border-blue-700/80 text-blue-200 shadow-blue-950/60'
        };

        const iconMap = {
            success: 'check-circle-2',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        const iconColor = {
            success: 'text-emerald-400',
            error: 'text-rose-400',
            warning: 'text-amber-400',
            info: 'text-blue-400'
        };

        // Traducir mensajes técnicos de Supabase al español comprensible
        let displayMessage = message;
        if (typeof message === 'string') {
            if (message.includes('Invalid login credentials')) {
                displayMessage = 'El correo electrónico o la contraseña ingresada son incorrectos.';
            } else if (message.includes('Email not confirmed')) {
                displayMessage = 'El correo electrónico no ha sido verificado aún.';
            } else if (message.includes('Rate limit exceeded')) {
                displayMessage = 'Demasiados intentos. Espera unos momentos antes de reintentar.';
            } else if (message.includes('User already registered')) {
                displayMessage = 'Ya existe una cuenta con este correo.';
            }
        }

        const toast = document.createElement('div');
        toast.id = id;
        toast.className = `toast-card flex items-start gap-3 p-4 rounded-2xl border ${colorClasses[type]} shadow-2xl backdrop-blur-md pointer-events-auto transition-all duration-300 opacity-0 -translate-y-2`;
        toast.innerHTML = `
            <i data-lucide="${iconMap[type]}" class="w-5 h-5 shrink-0 mt-0.5 ${iconColor[type]}"></i>
            <div class="flex-1 min-w-0 pr-1">
                <h4 class="text-xs font-bold font-outfit uppercase tracking-wider">${title}</h4>
                <p class="text-xs mt-1 text-slate-300 font-medium leading-relaxed">${displayMessage}</p>
            </div>
            <button type="button" class="btn-close-toast text-slate-400 hover:text-white transition-colors shrink-0 p-1 -mr-1 -mt-1 rounded-lg hover:bg-white/10">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        `;

        el.toastContainer.appendChild(toast);
        lucide.createIcons();

        // Animar entrada suave en el siguiente frame
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        // Temporizador de auto-cierre garantizado
        let timer = setTimeout(() => {
            dismissToast(toast);
        }, duration);

        // Si el usuario posiciona el cursor sobre el toast, pausar el timer para que pueda leerlo
        toast.addEventListener('mouseenter', () => {
            clearTimeout(timer);
        });
        toast.addEventListener('mouseleave', () => {
            timer = setTimeout(() => {
                dismissToast(toast);
            }, duration);
        });

        // Botón de cierre manual
        const btnClose = toast.querySelector('.btn-close-toast');
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                clearTimeout(timer);
                dismissToast(toast);
            });
        }
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
        el.tabCortes.addEventListener('click', () => switchTab('cortes'));
        el.tabReportes.addEventListener('click', () => switchTab('reportes'));

        // Eventos de Cortes
        if (el.btnOpenCloseCorte) {
            el.btnOpenCloseCorte.addEventListener('click', openCloseCorteModal);
        }
        if (el.btnOpenNewCorteDashboard) {
            el.btnOpenNewCorteDashboard.addEventListener('click', openNewCorteModal);
        }
        if (el.btnStartFirstCorte) {
            el.btnStartFirstCorte.addEventListener('click', openNewCorteModal);
        }
        if (el.btnGotoCortesHistory) {
            el.btnGotoCortesHistory.addEventListener('click', () => switchTab('cortes'));
        }
        if (el.btnNewCorteHistoryTab) {
            el.btnNewCorteHistoryTab.addEventListener('click', openNewCorteModal);
        }
        if (el.corteScopeFilter) {
            el.corteScopeFilter.addEventListener('change', (e) => {
                state.corteScope = e.target.value;
                renderMetrics();
                renderTable();
            });
        }
        if (el.btnToggleUnassignedSales) {
            el.btnToggleUnassignedSales.addEventListener('click', toggleUnassignedSalesSection);
        }
        if (el.btnCloseUnassignedSales) {
            el.btnCloseUnassignedSales.addEventListener('click', () => {
                el.unassignedSalesSection.classList.add('hidden');
            });
        }
        if (el.searchCortesInput) {
            el.searchCortesInput.addEventListener('input', renderCortesHistory);
        }

        // Modal Nuevo Corte listeners
        if (el.btnCloseNewCorte) el.btnCloseNewCorte.addEventListener('click', () => el.newCorteModal.classList.add('hidden'));
        if (el.btnCancelNewCorte) el.btnCancelNewCorte.addEventListener('click', () => el.newCorteModal.classList.add('hidden'));
        if (el.formNewCorte) el.formNewCorte.addEventListener('submit', handleCreateNewCorte);
        if (el.checkSelectAllPending) {
            el.checkSelectAllPending.addEventListener('change', (e) => {
                const checks = el.newCortePendingList.querySelectorAll('input[type="checkbox"]');
                checks.forEach(c => c.checked = e.target.checked);
            });
        }

        // Modal Cerrar Corte listeners
        if (el.btnCloseCloseCorte) el.btnCloseCloseCorte.addEventListener('click', () => el.closeCorteModal.classList.add('hidden'));
        if (el.btnCancelCloseCorte) el.btnCancelCloseCorte.addEventListener('click', () => el.closeCorteModal.classList.add('hidden'));
        if (el.btnConfirmCloseCorte) el.btnConfirmCloseCorte.addEventListener('click', handleConfirmCloseCorte);
        if (el.closeCorteCreateNext) {
            el.closeCorteCreateNext.addEventListener('change', (e) => {
                if (e.target.checked) {
                    el.closeCorteNextFields.classList.remove('hidden');
                } else {
                    el.closeCorteNextFields.classList.add('hidden');
                }
            });
        }

        // Modal Detalle Corte listeners
        if (el.btnCloseCorteDetail) el.btnCloseCorteDetail.addEventListener('click', () => el.corteDetailModal.classList.add('hidden'));
        if (el.btnCloseCorteDetailFooter) el.btnCloseCorteDetailFooter.addEventListener('click', () => el.corteDetailModal.classList.add('hidden'));
        if (el.btnReopenCorteFromModal) {
            el.btnReopenCorteFromModal.addEventListener('click', () => {
                if (state.selectedCorteForDetail) {
                    handleReopenCorte(state.selectedCorteForDetail.id);
                }
            });
        }

        // Modales
        el.btnOpenSettings.addEventListener('click', () => {
            const config = window.supabaseClient.getConfig();
            el.settingsUrl.value = config.url || '';
            el.settingsKey.value = config.key || '';
            el.settingsModal.classList.remove('hidden');
        });
        el.btnCloseSettings.addEventListener('click', () => el.settingsModal.classList.add('hidden'));
        
        // Limpiar configuración
        el.btnClearSettings.addEventListener('click', async () => {
            const ok = await showConfirmDialog({
                title: 'Eliminar Conexión Supabase',
                message: '¿Estás seguro de que deseas eliminar las credenciales de conexión guardadas en este dispositivo?',
                confirmText: 'Sí, Borrar Credenciales',
                cancelText: 'Cancelar',
                type: 'danger',
                icon: 'trash-2'
            });

            if (ok) {
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
            
            if (el.loginErrorAlert) el.loginErrorAlert.classList.add('hidden');

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
                clearAllToasts();
                showToast("Acceso Concedido", `¡Bienvenido, ${data.user.email}!`, "success");
            } catch (err) {
                console.error("Error al iniciar sesión:", err);
                const errorMsg = (err.message && err.message.includes('Invalid login credentials')) 
                    ? "Correo o contraseña incorrectos." 
                    : (err.message || "Usuario o contraseña incorrectos.");

                // Mostrar alerta directa en la pantalla de inicio de sesión
                if (el.loginErrorAlert && el.loginErrorText) {
                    el.loginErrorText.textContent = errorMsg;
                    el.loginErrorAlert.classList.remove('hidden');
                }

                showToast("Error de Acceso", errorMsg, "error");
            } finally {
                setLoader(false);
            }
        });

        // Ocultar mensaje de error cuando el usuario escribe en los campos
        if (el.loginEmail) {
            el.loginEmail.addEventListener('input', () => {
                if (el.loginErrorAlert) el.loginErrorAlert.classList.add('hidden');
            });
        }
        if (el.loginPassword) {
            el.loginPassword.addEventListener('input', () => {
                if (el.loginErrorAlert) el.loginErrorAlert.classList.add('hidden');
            });
        }

        // Abrir y cerrar modal de recuperar contraseña
        el.btnForgotPasswordLink.addEventListener('click', () => {
            el.forgotPasswordModal.classList.remove('hidden');
        });
        el.btnCloseForgot.addEventListener('click', () => el.forgotPasswordModal.classList.add('hidden'));
        el.btnCancelForgot.addEventListener('click', () => el.forgotPasswordModal.classList.add('hidden'));

        // Enviar enlace de recuperación
        el.formForgotPassword.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = el.forgotEmail.value.trim();
            
            if (!window.supabaseClient.isConfigured) {
                showToast("Error", "Supabase no está configurado en el sistema.", "error");
                return;
            }

            try {
                setLoader(true);
                const { error } = await window.supabaseClient.supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + window.location.pathname
                });
                if (error) throw error;
                
                showToast("Correo Enviado", "Revisa tu bandeja de entrada para restablecer la contraseña.", "success");
                el.forgotPasswordModal.classList.add('hidden');
                el.formForgotPassword.reset();
            } catch (err) {
                console.error("Error al recuperar:", err);
                showToast("Error", err.message || "No se pudo enviar el correo.", "error");
            } finally {
                setLoader(false);
            }
        });

        // Establecer nueva contraseña
        el.formResetPassword.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPassword = el.resetPasswordNew.value;
            
            try {
                setLoader(true);
                const { error } = await window.supabaseClient.supabase.auth.updateUser({
                    password: newPassword
                });
                
                if (error) throw error;
                
                showToast("Contraseña Actualizada", "Tu nueva contraseña ha sido guardada con éxito.", "success");
                el.resetPasswordModal.classList.add('hidden');
                el.formResetPassword.reset();
                
                // Redirigir al inicio normal (el listener onAuthStateChange ya debería haber logueado al usuario)
                loadData();
            } catch (err) {
                console.error("Error al actualizar contraseña:", err);
                showToast("Error", err.message || "No se pudo actualizar la contraseña.", "error");
            } finally {
                setLoader(false);
            }
        });

        // Cerrar Sesión
        el.btnLogout.addEventListener('click', async () => {
            const ok = await showConfirmDialog({
                title: 'Cerrar Sesión',
                message: '¿Estás seguro de que deseas salir del sistema?',
                confirmText: 'Cerrar Sesión',
                cancelText: 'Permanecer',
                type: 'warning',
                icon: 'log-out'
            });

            if (ok) {
                try {
                    setLoader(true);
                    clearAllToasts();
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

        // Calcular ganancia en "Agregar Prenda al Pedido"
        const calculateAddItemProfit = () => {
            const costo = parseFloat(el.addItemCost.value) || 0;
            const venta = parseFloat(el.addItemPrice.value) || 0;
            
            if (costo > 0 || venta > 0) {
                el.addItemProfitContainer.classList.remove('hidden');
                const ganancia = venta - costo;
                
                let porcentaje = 0;
                if (costo > 0) {
                    porcentaje = (ganancia / costo) * 100;
                } else if (venta > 0) {
                    porcentaje = 100;
                }
                
                el.addItemProfitUsd.textContent = fmt.usd(ganancia);
                el.addItemProfitPercent.textContent = `${porcentaje.toFixed(2)}%`;
                
                if (ganancia >= 0) {
                    el.addItemProfitUsd.className = "text-sm font-bold text-emerald-400";
                } else {
                    el.addItemProfitUsd.className = "text-sm font-bold text-rose-400";
                }
            } else {
                el.addItemProfitContainer.classList.add('hidden');
            }
        };

        el.addItemCost.addEventListener('input', calculateAddItemProfit);
        el.addItemPrice.addEventListener('input', calculateAddItemProfit);

        // Calcular ganancia en "Editar Prenda"
        const calculateEditItemProfit = () => {
            const costo = parseFloat(el.editItemCost.value) || 0;
            const venta = parseFloat(el.editItemPrice.value) || 0;
            
            if (costo > 0 || venta > 0) {
                el.editItemProfitContainer.classList.remove('hidden');
                const ganancia = venta - costo;
                
                let porcentaje = 0;
                if (costo > 0) {
                    porcentaje = (ganancia / costo) * 100;
                } else if (venta > 0) {
                    porcentaje = 100;
                }
                
                el.editItemProfitUsd.textContent = fmt.usd(ganancia);
                el.editItemProfitPercent.textContent = `${porcentaje.toFixed(2)}%`;
                
                if (ganancia >= 0) {
                    el.editItemProfitUsd.className = "text-sm font-bold text-emerald-400";
                } else {
                    el.editItemProfitUsd.className = "text-sm font-bold text-rose-400";
                }
            } else {
                el.editItemProfitContainer.classList.add('hidden');
            }
        };

        el.editItemCost.addEventListener('input', calculateEditItemProfit);
        el.editItemPrice.addEventListener('input', calculateEditItemProfit);

        // Ocultar modales secundarios Agregar Prenda
        el.btnCloseAddItem.addEventListener('click', () => el.addItemModal.classList.add('hidden'));
        el.btnCancelAddItem.addEventListener('click', () => el.addItemModal.classList.add('hidden'));
        
        // Registrar Agregar Prenda submit
        el.formAddItem.addEventListener('submit', handleAddItemSubmit);

        // Editar Prenda listeners
        el.btnCloseEditItem.addEventListener('click', () => el.editItemModal.classList.add('hidden'));
        el.btnCancelEditItem.addEventListener('click', () => el.editItemModal.classList.add('hidden'));
        el.formEditItem.addEventListener('submit', handleEditItemSubmit);

        // Agregar prenda a la lista de nuevo encargo
        el.btnAddToTempList.addEventListener('click', addGarmentToTempList);
        
        // Limpiar orden completa
        el.btnClearFullOrder.addEventListener('click', clearFullOrder);
    }

    // --- GESTIÓN DE CORTES (BLOQUES DE VENTA) ---
    async function fetchCortes() {
        if (!window.supabaseClient.isConfigured) return;
        const supabase = window.supabaseClient.supabase;

        try {
            const { data, error } = await supabase
                .from('cortes')
                .select('*')
                .order('fecha_inicio', { ascending: false });

            if (error) {
                console.warn("Tabla cortes no disponible en Supabase, usando almacenamiento local:", error.message);
                const localCortes = JSON.parse(localStorage.getItem('cortes_data') || '[]');
                state.cortes = localCortes;
            } else {
                state.cortes = data || [];
                localStorage.setItem('cortes_data', JSON.stringify(state.cortes));
            }
        } catch (err) {
            console.warn("Error consultando cortes, usando local:", err);
            const localCortes = JSON.parse(localStorage.getItem('cortes_data') || '[]');
            state.cortes = localCortes;
        }

        state.activeCorte = state.cortes.find(c => c.estado === 'activo') || null;
    }

    function renderActiveCorteBanner() {
        if (!el.activeCorteBanner || !el.noActiveCorteBanner) return;

        if (state.activeCorte) {
            el.activeCorteBanner.classList.remove('hidden');
            el.noActiveCorteBanner.classList.add('hidden');
            
            el.corteActiveTitle.textContent = state.activeCorte.nombre;
            el.corteActiveDesc.textContent = state.activeCorte.descripcion || "Compras y ventas del ciclo actual";
            el.corteActiveDateBadge.innerHTML = `<i data-lucide="calendar" class="w-3 h-3 text-slate-500"></i> Desde: ${fmt.dateOnly(state.activeCorte.fecha_inicio)} (${fmt.daysElapsed(state.activeCorte.fecha_inicio)})`;
            
            if (el.dashboardTableTitle) {
                if (state.corteScope === 'active') {
                    el.dashboardTableTitle.textContent = `Pedidos del ${state.activeCorte.nombre}`;
                    el.dashboardTableSubtitle.textContent = `Listado de encargos de este bloque de venta, cobros y entregas`;
                } else if (state.corteScope === 'all') {
                    el.dashboardTableTitle.textContent = `Todos los Pedidos (Histórico Completo)`;
                    el.dashboardTableSubtitle.textContent = `Listado consolidado de pedidos de todos los cortes y fechas`;
                } else {
                    el.dashboardTableTitle.textContent = `Ventas Previas (Sin Corte Asignado)`;
                    el.dashboardTableSubtitle.textContent = `Pedidos registrados antes del sistema de cortes`;
                }
            }
            if (el.tabDashboardText) {
                el.tabDashboardText.textContent = `${state.activeCorte.nombre}`;
            }
        } else {
            el.activeCorteBanner.classList.add('hidden');
            el.noActiveCorteBanner.classList.remove('hidden');
            
            if (el.dashboardTableTitle) {
                if (state.corteScope === 'all') {
                    el.dashboardTableTitle.textContent = `Todos los Pedidos (Histórico)`;
                    el.dashboardTableSubtitle.textContent = `Mostrando pedidos de todos los tiempos`;
                } else {
                    el.dashboardTableTitle.textContent = `Control de Pedidos`;
                    el.dashboardTableSubtitle.textContent = `No hay un corte activo. Inicia uno nuevo para comenzar este bloque de venta.`;
                }
            }
            if (el.tabDashboardText) {
                el.tabDashboardText.textContent = `Corte Activo & Pedidos`;
            }
        }
        lucide.createIcons();
    }

    function openNewCorteModal() {
        if (!el.newCorteModal) return;
        el.formNewCorte.reset();

        // Sugerir nombre y fecha actual
        const num = state.cortes.length + 1;
        const now = new Date();
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const month = monthNames[now.getMonth()];
        el.newCorteName.value = `Corte ${num} - ${month} ${now.getFullYear()}`;
        el.newCorteDate.value = now.toISOString().split('T')[0];

        // Buscar pedidos con deuda pendiente para traspasar
        const pendingSales = state.sales.filter(s => (parseFloat(s.saldo_pendiente_usd) || 0) > 0.01);

        if (pendingSales.length > 0) {
            el.newCortePendingSection.classList.remove('hidden');
            el.checkSelectAllPending.checked = true;
            el.newCortePendingList.innerHTML = "";

            pendingSales.forEach(sale => {
                const clientName = sale.clientes?.nombre || 'Desconocido';
                const productsList = sale.productos || [];
                const prodDesc = productsList.map(p => p.descripcion).join(", ") || 'Prenda';
                const pendingUsd = parseFloat(sale.saldo_pendiente_usd) || 0;
                const pendingBs = pendingUsd * state.bcvRate;

                const item = document.createElement('label');
                item.className = "flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 cursor-pointer text-xs";
                item.innerHTML = `
                    <div class="flex items-center gap-2.5 min-w-0 pr-2">
                        <input type="checkbox" name="transfer_sale" value="${sale.id}" checked 
                            class="rounded border-slate-700 text-brand-600 focus:ring-0 shrink-0">
                        <div class="truncate">
                            <span class="font-semibold text-white block truncate">${clientName}</span>
                            <span class="text-[11px] text-slate-400 block truncate">${prodDesc}</span>
                        </div>
                    </div>
                    <div class="text-right shrink-0">
                        <span class="font-bold text-rose-400 block">${fmt.usd(pendingUsd)}</span>
                        <span class="text-[10px] text-amber-400/90">${fmt.bs(pendingBs)}</span>
                    </div>
                `;
                el.newCortePendingList.appendChild(item);
            });
        } else {
            el.newCortePendingSection.classList.add('hidden');
            el.newCortePendingList.innerHTML = "";
        }

        el.newCorteModal.classList.remove('hidden');
    }

    async function handleCreateNewCorte(e) {
        e.preventDefault();
        const name = el.newCorteName.value.trim();
        const dateVal = el.newCorteDate.value;
        const desc = el.newCorteDesc.value.trim();

        if (!name || !dateVal) {
            showToast("Validación", "Nombre y fecha de inicio son requeridos.", "warning");
            return;
        }

        // Obtener IDs de ventas seleccionadas para transferir
        const checkedBoxes = el.newCortePendingList.querySelectorAll('input[type="checkbox"]:checked');
        const salesToTransfer = Array.from(checkedBoxes).map(cb => cb.value);

        setLoader(true);
        const supabase = window.supabaseClient.supabase;

        try {
            // 1. Cerrar cualquier corte que estuviese activo actualmente
            if (state.activeCorte) {
                if (window.supabaseClient.isConfigured) {
                    await supabase
                        .from('cortes')
                        .update({ estado: 'cerrado', fecha_cierre: new Date().toISOString() })
                        .eq('id', state.activeCorte.id);
                }
                state.activeCorte.estado = 'cerrado';
                state.activeCorte.fecha_cierre = new Date().toISOString();
            }

            // 2. Insertar nuevo corte
            let newCorteId = null;
            let createdCorte = null;

            if (window.supabaseClient.isConfigured) {
                const { data: newCorte, error: corteErr } = await supabase
                    .from('cortes')
                    .insert([{
                        nombre: name,
                        fecha_inicio: dateVal,
                        estado: 'activo',
                        descripcion: desc || null
                    }])
                    .select()
                    .single();

                if (corteErr) {
                    console.warn("Fallo insert en Supabase cortes, usando local fallback:", corteErr.message);
                } else {
                    createdCorte = newCorte;
                    newCorteId = newCorte.id;
                }
            }

            // Fallback local si no se pudo en Supabase
            if (!createdCorte) {
                newCorteId = 'local-corte-' + Date.now();
                createdCorte = {
                    id: newCorteId,
                    nombre: name,
                    fecha_inicio: dateVal,
                    fecha_cierre: null,
                    estado: 'activo',
                    descripcion: desc || null,
                    creado_en: new Date().toISOString()
                };
            }

            // 3. Traspasar las ventas pendientes seleccionadas al nuevo corte
            if (salesToTransfer.length > 0) {
                if (window.supabaseClient.isConfigured) {
                    try {
                        const { error: transferErr } = await supabase
                            .from('ventas')
                            .update({ corte_id: newCorteId })
                            .in('id', salesToTransfer);
                        if (transferErr) console.warn("Traspaso en BD:", transferErr.message);
                    } catch (tErr) {
                        console.warn("Error en traspaso:", tErr);
                    }
                }

                // Guardar mapping local
                const localMap = JSON.parse(localStorage.getItem('ventas_corte_map') || '{}');
                salesToTransfer.forEach(sId => localMap[sId] = newCorteId);
                localStorage.setItem('ventas_corte_map', JSON.stringify(localMap));
            }

            // Actualizar estado local
            const updatedCortes = state.cortes.map(c => ({
                ...c,
                estado: c.id === newCorteId ? 'activo' : 'cerrado'
            }));
            if (!updatedCortes.some(c => c.id === newCorteId)) {
                updatedCortes.unshift(createdCorte);
            }
            state.cortes = updatedCortes;
            localStorage.setItem('cortes_data', JSON.stringify(state.cortes));
            state.activeCorte = createdCorte;
            state.corteScope = 'active';

            el.newCorteModal.classList.add('hidden');
            showToast("Corte Iniciado", `Has iniciado "${name}" con éxito.${salesToTransfer.length > 0 ? ` Se traspasaron ${salesToTransfer.length} cuentas pendientes.` : ''}`, "success");
            
            await loadData();
            switchTab('dashboard');

        } catch (err) {
            console.error("Error al iniciar corte:", err);
            showToast("Error", "No se pudo iniciar el corte: " + err.message, "error");
        } finally {
            setLoader(false);
        }
    }

    function openCloseCorteModal() {
        if (!state.activeCorte) {
            showToast("Aviso", "No hay ningún corte activo para cerrar.", "info");
            return;
        }

        // Ventas de este corte
        const corteSales = state.sales.filter(s => s.corte_id === state.activeCorte.id);
        const totalSales = corteSales.reduce((acc, s) => acc + (parseFloat(s.monto_total_usd) || 0), 0);
        const totalPending = corteSales.reduce((acc, s) => acc + (parseFloat(s.saldo_pendiente_usd) || 0), 0);
        const totalCollected = Math.max(0, totalSales - totalPending);

        el.closeCorteTitle.textContent = `Cerrar: ${state.activeCorte.nombre}`;
        el.closeCorteTotalSales.textContent = fmt.usd(totalSales);
        el.closeCorteTotalCollected.textContent = fmt.usd(totalCollected);
        el.closeCorteTotalPending.textContent = fmt.usd(totalPending);

        const pendingSales = corteSales.filter(s => (parseFloat(s.saldo_pendiente_usd) || 0) > 0.01);

        if (pendingSales.length > 0) {
            el.closeCorteHasPendingWarning.classList.remove('hidden');
            el.closeCorteCleanSuccess.classList.add('hidden');
            el.closeCortePendingCount.textContent = pendingSales.length;

            el.closeCortePendingList.innerHTML = "";
            pendingSales.forEach(sale => {
                const clientName = sale.clientes?.nombre || 'Desconocido';
                const productsList = sale.productos || [];
                const prodDesc = productsList.map(p => p.descripcion).join(", ") || 'Prenda';
                const pendingUsd = parseFloat(sale.saldo_pendiente_usd) || 0;
                const pendingBs = pendingUsd * state.bcvRate;

                const item = document.createElement('div');
                item.className = "flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-900 text-xs";
                item.innerHTML = `
                    <div class="truncate pr-2">
                        <span class="font-semibold text-white block truncate">${clientName}</span>
                        <span class="text-[11px] text-slate-400 block truncate">${prodDesc}</span>
                    </div>
                    <div class="text-right shrink-0">
                        <span class="font-bold text-rose-400 block">${fmt.usd(pendingUsd)}</span>
                        <span class="text-[10px] text-amber-400">${fmt.bs(pendingBs)}</span>
                    </div>
                `;
                el.closeCortePendingList.appendChild(item);
            });

            // Prellenar nombre para siguiente corte
            const num = state.cortes.length + 1;
            el.nextCorteNameInput.value = `Corte ${num}`;
            el.nextCorteDateInput.value = new Date().toISOString().split('T')[0];
            el.closeCorteCreateNext.checked = true;
            el.closeCorteNextFields.classList.remove('hidden');
        } else {
            el.closeCorteHasPendingWarning.classList.add('hidden');
            el.closeCorteCleanSuccess.classList.remove('hidden');
        }

        el.closeCorteModal.classList.remove('hidden');
    }

    async function handleConfirmCloseCorte() {
        if (!state.activeCorte) return;

        const currentCorteId = state.activeCorte.id;
        const currentCorteName = state.activeCorte.nombre;
        const createNext = el.closeCorteCreateNext.checked && !el.closeCorteHasPendingWarning.classList.contains('hidden');
        const nextName = el.nextCorteNameInput.value.trim() || `Corte ${state.cortes.length + 1}`;
        const nextDate = el.nextCorteDateInput.value || new Date().toISOString().split('T')[0];

        // Ventas con saldo pendiente del corte actual
        const corteSales = state.sales.filter(s => s.corte_id === currentCorteId);
        const pendingSales = corteSales.filter(s => (parseFloat(s.saldo_pendiente_usd) || 0) > 0.01);
        const pendingSaleIds = pendingSales.map(s => s.id);

        setLoader(true);
        const supabase = window.supabaseClient.supabase;

        try {
            // 1. Marcar corte actual como cerrado
            const closeTimestamp = new Date().toISOString();
            if (window.supabaseClient.isConfigured) {
                await supabase
                    .from('cortes')
                    .update({ estado: 'cerrado', fecha_cierre: closeTimestamp })
                    .eq('id', currentCorteId);
            }

            state.activeCorte.estado = 'cerrado';
            state.activeCorte.fecha_cierre = closeTimestamp;

            // 2. Si se solicita crear el siguiente corte inmediatamente
            if (createNext) {
                let newCorteId = null;
                let newCorteObj = null;

                if (window.supabaseClient.isConfigured) {
                    const { data: created, error: crErr } = await supabase
                        .from('cortes')
                        .insert([{
                            nombre: nextName,
                            fecha_inicio: nextDate,
                            estado: 'activo',
                            descripcion: `Continuación de ${currentCorteName}`
                        }])
                        .select()
                        .single();

                    if (!crErr && created) {
                        newCorteId = created.id;
                        newCorteObj = created;
                    }
                }

                if (!newCorteObj) {
                    newCorteId = 'local-corte-' + Date.now();
                    newCorteObj = {
                        id: newCorteId,
                        nombre: nextName,
                        fecha_inicio: nextDate,
                        fecha_cierre: null,
                        estado: 'activo',
                        descripcion: `Continuación de ${currentCorteName}`,
                        creado_en: new Date().toISOString()
                    };
                }

                // Traspasar las ventas pendientes al nuevo corte
                if (pendingSaleIds.length > 0) {
                    if (window.supabaseClient.isConfigured) {
                        try {
                            await supabase
                                .from('ventas')
                                .update({ corte_id: newCorteId })
                                .in('id', pendingSaleIds);
                        } catch (tErr) {
                            console.warn("Traspaso BD:", tErr);
                        }
                    }

                    const localMap = JSON.parse(localStorage.getItem('ventas_corte_map') || '{}');
                    pendingSaleIds.forEach(sId => localMap[sId] = newCorteId);
                    localStorage.setItem('ventas_corte_map', JSON.stringify(localMap));
                }

                state.cortes.unshift(newCorteObj);
                state.activeCorte = newCorteObj;

                showToast("Corte Cerrado y Nuevo Abierto", `Se cerró "${currentCorteName}" y se inició "${nextName}" con ${pendingSaleIds.length} cuentas traspasadas.`, "success");
            } else {
                state.activeCorte = null;
                showToast("Corte Cerrado", `"${currentCorteName}" ha sido cerrado y guardado en el historial.`, "success");
            }

            // Sincronizar cortes locales
            localStorage.setItem('cortes_data', JSON.stringify(state.cortes));

            el.closeCorteModal.classList.add('hidden');
            await loadData();
            switchTab('dashboard');

        } catch (err) {
            console.error("Error al cerrar corte:", err);
            showToast("Error", "No se pudo cerrar el corte: " + err.message, "error");
        } finally {
            setLoader(false);
        }
    }

    function renderCortesHistory() {
        if (!el.cortesGrid) return;
        const query = (el.searchCortesInput?.value || "").toLowerCase().trim();
        const container = el.cortesGrid;
        container.innerHTML = "";

        const closedCortes = state.cortes.filter(c => c.estado === 'cerrado');
        const filtered = closedCortes.filter(c => {
            const name = (c.nombre || "").toLowerCase();
            const desc = (c.descripcion || "").toLowerCase();
            const date = fmt.dateOnly(c.fecha_inicio).toLowerCase();
            return name.includes(query) || desc.includes(query) || date.includes(query);
        });

        if (el.cortesCountBadge) {
            el.cortesCountBadge.textContent = `${closedCortes.length} corte${closedCortes.length === 1 ? '' : 's'} cerrado${closedCortes.length === 1 ? '' : 's'}`;
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-12 text-center text-slate-500 glass-panel rounded-2xl p-6">
                    <div class="flex flex-col items-center gap-3">
                        <i data-lucide="archive" class="w-10 h-10 text-slate-600"></i>
                        <span class="font-medium text-slate-400">No hay cortes cerrados en el historial.</span>
                        <p class="text-xs text-slate-500 max-w-sm">Cuando finalices un ciclo de ventas y presiones "Cerrar Este Corte", se guardará aquí con todas sus métricas y pedidos para consultarlo cuando quieras.</p>
                    </div>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        filtered.forEach(corte => {
            const corteSales = state.sales.filter(s => s.corte_id === corte.id);
            let totalSales = 0;
            let totalPending = 0;
            let totalCost = 0;

            corteSales.forEach(sale => {
                const sTotal = parseFloat(sale.monto_total_usd) || 0;
                const sPending = parseFloat(sale.saldo_pendiente_usd) || 0;
                const pList = sale.productos || [];
                const cost = pList.reduce((acc, p) => acc + (parseFloat(p.precio_costo_usd) || 0), 0);

                totalSales += sTotal;
                totalPending += sPending;
                totalCost += cost;
            });

            const totalCollected = Math.max(0, totalSales - totalPending);
            const profit = totalSales - totalCost;
            const markup = totalCost > 0 ? (profit / totalCost) * 100 : 0;

            const card = document.createElement('div');
            card.className = "glass-panel rounded-2xl p-5 border border-slate-800/80 hover:border-brand-500/40 transition-all flex flex-col justify-between gap-4 group";
            
            const startText = fmt.dateOnly(corte.fecha_inicio);
            const closeText = corte.fecha_cierre ? fmt.dateOnly(corte.fecha_cierre) : 'Sin fecha';

            card.innerHTML = `
                <div>
                    <div class="flex items-start justify-between gap-2 border-b border-slate-800/60 pb-3">
                        <div>
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-slate-400 border border-slate-800 mb-1">
                                Corte Archivado
                            </span>
                            <h3 class="text-base font-bold font-outfit text-white group-hover:text-brand-300 transition-colors">${corte.nombre}</h3>
                            <div class="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                                <i data-lucide="calendar" class="w-3 h-3"></i>
                                <span>${startText} - ${closeText}</span>
                            </div>
                        </div>
                        <div class="p-2 bg-slate-900 rounded-xl text-slate-400 border border-slate-800 shrink-0">
                            <i data-lucide="archive" class="w-5 h-5"></i>
                        </div>
                    </div>

                    ${corte.descripcion ? `<p class="text-xs text-slate-400 mt-2 line-clamp-2">${corte.descripcion}</p>` : ''}

                    <!-- Grid de Métricas del Corte -->
                    <div class="grid grid-cols-2 gap-2 mt-3.5 bg-slate-950/70 p-3 rounded-xl border border-slate-900 text-xs">
                        <div>
                            <span class="text-[10px] text-slate-500 uppercase block font-semibold">Total Vendido</span>
                            <span class="font-bold text-white">${fmt.usd(totalSales)}</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-slate-500 uppercase block font-semibold">Recaudado</span>
                            <span class="font-semibold text-emerald-400">${fmt.usd(totalCollected)}</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-slate-500 uppercase block font-semibold">Inversión Ropa</span>
                            <span class="font-medium text-amber-300">${fmt.usd(totalCost)}</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-slate-500 uppercase block font-semibold">Ganancia Neta</span>
                            <span class="font-black text-brand-400">${fmt.usd(profit)} <span class="text-[10px] text-slate-500 font-normal">(${markup.toFixed(0)}%)</span></span>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-900/80">
                    <span class="text-[11px] text-slate-500">${corteSales.length} pedido${corteSales.length === 1 ? '' : 's'}</span>
                    <div class="flex items-center gap-2">
                        <button class="btn-reopen-corte px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-medium border border-slate-800 transition-all"
                            data-corte-id="${corte.id}" title="Reabrir corte si se cerró por error">
                            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
                        </button>
                        <button class="btn-view-corte-detail px-3 py-1.5 bg-brand-600/30 hover:bg-brand-600/50 border border-brand-500/40 text-brand-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                            data-corte-id="${corte.id}">
                            <i data-lucide="eye" class="w-3.5 h-3.5"></i> Ver Pedidos
                        </button>
                    </div>
                </div>
            `;

            const btnDetail = card.querySelector('.btn-view-corte-detail');
            if (btnDetail) {
                btnDetail.addEventListener('click', () => openCorteDetailModal(corte.id));
            }

            const btnReopen = card.querySelector('.btn-reopen-corte');
            if (btnReopen) {
                btnReopen.addEventListener('click', () => handleReopenCorte(corte.id));
            }

            container.appendChild(card);
        });

        lucide.createIcons();
    }

    function openCorteDetailModal(corteId) {
        const corte = state.cortes.find(c => c.id === corteId);
        if (!corte) return;
        state.selectedCorteForDetail = corte;

        const corteSales = state.sales.filter(s => s.corte_id === corte.id);
        let totalSales = 0;
        let totalPending = 0;
        let totalCost = 0;

        corteSales.forEach(sale => {
            const sTotal = parseFloat(sale.monto_total_usd) || 0;
            const sPending = parseFloat(sale.saldo_pendiente_usd) || 0;
            const pList = sale.productos || [];
            const cost = pList.reduce((acc, p) => acc + (parseFloat(p.precio_costo_usd) || 0), 0);

            totalSales += sTotal;
            totalPending += sPending;
            totalCost += cost;
        });

        const totalCollected = Math.max(0, totalSales - totalPending);
        const profit = totalSales - totalCost;

        el.modalCorteDetailTitle.textContent = corte.nombre;
        el.modalCorteDetailDates.textContent = `Desde ${fmt.dateOnly(corte.fecha_inicio)} hasta ${corte.fecha_cierre ? fmt.dateOnly(corte.fecha_cierre) : 'Actualidad'}`;
        el.modalCorteDetailBadge.textContent = corte.estado === 'activo' ? 'Activo' : 'Cerrado';
        
        el.modalCorteKpiSales.textContent = fmt.usd(totalSales);
        el.modalCorteKpiCollected.textContent = fmt.usd(totalCollected);
        el.modalCorteKpiCost.textContent = fmt.usd(totalCost);
        el.modalCorteKpiProfit.textContent = fmt.usd(profit);
        el.modalCorteKpiPending.textContent = fmt.usd(totalPending);

        el.modalCorteOrdersCount.textContent = `${corteSales.length} pedido${corteSales.length === 1 ? '' : 's'} en este corte`;

        const tbody = el.modalCorteTableBody;
        tbody.innerHTML = "";

        if (corteSales.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-500">Este corte no tiene pedidos registrados.</td></tr>`;
        } else {
            corteSales.forEach(sale => {
                const client = sale.clientes || { nombre: 'Desconocido', telefono: '-' };
                const productsList = sale.productos || [];
                const prodDesc = productsList.map(p => p.descripcion).join(", ") || 'Prenda';
                const sTotal = parseFloat(sale.monto_total_usd) || 0;
                const sPending = parseFloat(sale.saldo_pendiente_usd) || 0;
                const sCollected = sTotal - sPending;
                const allDelivered = productsList.length > 0 && productsList.every(p => p.estado === 'entregado');

                let badgeClass = sale.estado_pago === 'completado' 
                    ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50"
                    : (sale.estado_pago === 'parcial' 
                        ? "bg-blue-950/60 text-blue-400 border border-blue-800/50" 
                        : "bg-rose-950/60 text-rose-400 border border-rose-800/50");

                const tr = document.createElement('tr');
                tr.className = "hover:bg-slate-900/30 border-b border-slate-900/60";
                tr.innerHTML = `
                    <td class="py-3 px-4 font-semibold text-white">${client.nombre}</td>
                    <td class="py-3 px-4 text-slate-300 max-w-xs truncate">${prodDesc}</td>
                    <td class="py-3 px-4 text-right font-medium text-slate-200">${fmt.usd(sTotal)}</td>
                    <td class="py-3 px-4 text-right font-medium text-emerald-400">${fmt.usd(sCollected)}</td>
                    <td class="py-3 px-4 text-right font-bold text-rose-400">${fmt.usd(sPending)}</td>
                    <td class="py-3 px-4 text-center">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeClass}">
                            ${sale.estado_pago}
                        </span>
                    </td>
                    <td class="py-3 px-4 text-center">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${allDelivered ? 'bg-slate-900 text-slate-400 border border-slate-800' : 'bg-brand-950 text-brand-400 border border-brand-800/40'}">
                            ${allDelivered ? 'Entregado' : 'Pendiente'}
                        </span>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        if (corte.estado === 'cerrado' && el.btnReopenCorteFromModal) {
            el.btnReopenCorteFromModal.classList.remove('hidden');
        } else if (el.btnReopenCorteFromModal) {
            el.btnReopenCorteFromModal.classList.add('hidden');
        }

        el.corteDetailModal.classList.remove('hidden');
        lucide.createIcons();
    }

    async function handleReopenCorte(corteId) {
        const corte = state.cortes.find(c => c.id === corteId);
        if (!corte) return;

        const ok = await showConfirmDialog({
            title: `Reabrir ${corte.nombre}`,
            message: `¿Estás seguro de que deseas REABRIR el "${corte.nombre}"?\n\nAl reabrirlo, volverá a mostrarse como el corte activo en la vista principal.`,
            confirmText: 'Sí, Reabrir Corte',
            cancelText: 'Cancelar',
            type: 'warning',
            icon: 'rotate-ccw'
        });

        if (!ok) return;

        setLoader(true);
        const supabase = window.supabaseClient.supabase;

        try {
            // Cerrar el que estuviese activo
            if (state.activeCorte && state.activeCorte.id !== corteId) {
                if (window.supabaseClient.isConfigured) {
                    await supabase.from('cortes').update({ estado: 'cerrado' }).eq('id', state.activeCorte.id);
                }
                state.activeCorte.estado = 'cerrado';
            }

            // Activar este corte
            if (window.supabaseClient.isConfigured) {
                await supabase.from('cortes').update({ estado: 'activo', fecha_cierre: null }).eq('id', corteId);
            }

            corte.estado = 'activo';
            corte.fecha_cierre = null;
            state.activeCorte = corte;
            state.corteScope = 'active';

            localStorage.setItem('cortes_data', JSON.stringify(state.cortes));

            if (el.corteDetailModal) el.corteDetailModal.classList.add('hidden');
            showToast("Corte Reabierto", `"${corte.nombre}" está nuevamente activo.`, "success");

            await loadData();
            switchTab('dashboard');

        } catch (err) {
            console.error("Error al reabrir corte:", err);
            showToast("Error", "No se pudo reabrir el corte: " + err.message, "error");
        } finally {
            setLoader(false);
        }
    }

    function toggleUnassignedSalesSection() {
        if (!el.unassignedSalesSection) return;
        const isHidden = el.unassignedSalesSection.classList.contains('hidden');
        if (isHidden) {
            renderUnassignedSalesTable();
            el.unassignedSalesSection.classList.remove('hidden');
            el.unassignedSalesSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            el.unassignedSalesSection.classList.add('hidden');
        }
    }

    function renderUnassignedSalesTable() {
        const tbody = el.unassignedSalesTableBody;
        if (!tbody) return;
        tbody.innerHTML = "";

        const unassigned = state.sales.filter(s => !s.corte_id);
        if (unassigned.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-500">No hay ventas registradas sin corte asignado.</td></tr>`;
            return;
        }

        unassigned.forEach(sale => {
            const client = sale.clientes || { nombre: 'Desconocido', telefono: '-' };
            const productsList = sale.productos || [];
            const prodDesc = productsList.map(p => p.descripcion).join(", ") || 'Prenda';
            const sTotal = parseFloat(sale.monto_total_usd) || 0;
            const sPending = parseFloat(sale.saldo_pendiente_usd) || 0;
            const sCollected = sTotal - sPending;

            const tr = document.createElement('tr');
            tr.className = "hover:bg-slate-900/30 border-b border-slate-900/60";
            tr.innerHTML = `
                <td class="py-2.5 px-4 font-semibold text-white">${client.nombre}</td>
                <td class="py-2.5 px-4 text-slate-300 max-w-xs truncate">${prodDesc}</td>
                <td class="py-2.5 px-4 text-right font-medium text-slate-200">${fmt.usd(sTotal)}</td>
                <td class="py-2.5 px-4 text-right font-medium text-emerald-400">${fmt.usd(sCollected)}</td>
                <td class="py-2.5 px-4 text-right font-bold text-rose-400">${fmt.usd(sPending)}</td>
                <td class="py-2.5 px-4 text-center"><span class="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-400 border border-slate-800">${sale.estado_pago}</span></td>
                <td class="py-2.5 px-4 text-center">
                    <button class="btn-assign-sale-to-active px-2.5 py-1 bg-brand-950 text-brand-300 hover:text-white rounded-lg border border-brand-900 text-[10px] font-medium transition-all"
                        data-sale-id="${sale.id}">
                        + Asignar a Corte Activo
                    </button>
                </td>
            `;

            const btnAssign = tr.querySelector('.btn-assign-sale-to-active');
            if (btnAssign) {
                btnAssign.addEventListener('click', async () => {
                    if (!state.activeCorte) {
                        showToast("Aviso", "No hay un corte activo abierto. Inicia un nuevo corte primero.", "warning");
                        return;
                    }
                    await assignSaleToCorte(sale.id, state.activeCorte.id);
                });
            }

            tbody.appendChild(tr);
        });

        lucide.createIcons();
    }

    async function assignSaleToCorte(saleId, corteId) {
        setLoader(true);
        try {
            if (window.supabaseClient.isConfigured) {
                await window.supabaseClient.supabase
                    .from('ventas')
                    .update({ corte_id: corteId })
                    .eq('id', saleId);
            }
            const localMap = JSON.parse(localStorage.getItem('ventas_corte_map') || '{}');
            localMap[saleId] = corteId;
            localStorage.setItem('ventas_corte_map', JSON.stringify(localMap));

            showToast("Venta Asignada", `La venta se vinculó al corte activo.`, "success");
            await loadData();
            renderUnassignedSalesTable();
        } catch (err) {
            console.error("Error al asignar venta:", err);
            showToast("Error", err.message, "error");
        } finally {
            setLoader(false);
        }
    }

    // --- CAMBIAR PESTAÑA ---
    function switchTab(tabId) {
        state.currentTab = tabId;
        
        // Modificar clases del botón activo
        const tabs = [
            { btn: el.tabDashboard, content: el.contentDashboard },
            { btn: el.tabEncargo, content: el.contentEncargo },
            { btn: el.tabAbonos, content: el.contentAbonos },
            { btn: el.tabCortes, content: el.contentCortes },
            { btn: el.tabReportes, content: el.contentReportes }
        ];

        tabs.forEach(t => {
            if (!t.btn || !t.content) return;
            if (t.btn.id === `tab-${tabId}`) {
                t.btn.className = "px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm border-b-2 border-brand-500 text-brand-400 flex items-center gap-2 hover:bg-slate-900/30 transition-all shrink-0";
                t.content.classList.remove('hidden');
            } else {
                t.btn.className = "px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-2 hover:bg-slate-900/30 transition-all shrink-0";
                t.content.classList.add('hidden');
            }
        });

        // Acciones específicas por pestaña
        if (tabId === 'dashboard') {
            renderActiveCorteBanner();
            renderMetrics();
            renderTable();
        } else if (tabId === 'abonos') {
            el.abonoTasaBcv.value = state.bcvRate.toFixed(2);
            calculateAbonoConversion();
        } else if (tabId === 'cortes') {
            renderCortesHistory();
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
            // 1. Cargar Cortes
            await fetchCortes();

            // 2. Cargar Ventas (con corte_id si está disponible)
            let salesData = null;
            try {
                const { data, error } = await supabase
                    .from('ventas')
                    .select(`
                        id,
                        corte_id,
                        monto_total_usd,
                        saldo_pendiente_usd,
                        estado_pago,
                        creado_en,
                        clientes (id, nombre, telefono),
                        productos (id, descripcion, precio_costo_usd, precio_venta_usd, estado, imagen_url)
                    `)
                    .order('creado_en', { ascending: false });

                if (error) throw error;
                salesData = data;
            } catch (errWithCorte) {
                console.warn("Consulta con corte_id falló, reintentando consulta estándar:", errWithCorte.message);
                const { data: stdData, error: stdError } = await supabase
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

                if (stdError) throw stdError;

                // Mapear con corte_id local si existe
                const localMap = JSON.parse(localStorage.getItem('ventas_corte_map') || '{}');
                salesData = (stdData || []).map(s => ({
                    ...s,
                    corte_id: localMap[s.id] || null
                }));
            }

            state.sales = salesData || [];
            
            // Renderizar la pantalla
            renderActiveCorteBanner();
            renderMetrics();
            renderTable();
            populateAbonoSelect();
            
            if (state.currentTab === 'cortes') {
                renderCortesHistory();
            } else if (state.currentTab === 'reportes') {
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
        let salesToCalculate = [];

        if (state.corteScope === 'active') {
            if (state.activeCorte) {
                salesToCalculate = state.sales.filter(s => s.corte_id === state.activeCorte.id);
            } else {
                salesToCalculate = [];
            }
        } else if (state.corteScope === 'archived') {
            salesToCalculate = state.sales.filter(s => !s.corte_id);
        } else {
            salesToCalculate = state.sales;
        }

        let totalSales = 0;
        let totalPending = 0;
        let totalCollected = 0;

        salesToCalculate.forEach(sale => {
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
        const mobileContainer = el.salesCardsMobile;
        
        tbody.innerHTML = "";
        if (mobileContainer) mobileContainer.innerHTML = "";

        // 1. Filtrar por ámbito de Corte
        let salesPool = state.sales;
        if (state.corteScope === 'active') {
            if (state.activeCorte) {
                salesPool = state.sales.filter(s => s.corte_id === state.activeCorte.id);
            } else {
                salesPool = [];
            }
        } else if (state.corteScope === 'archived') {
            salesPool = state.sales.filter(s => !s.corte_id);
        }

        // 2. Filtrar por búsqueda y estado de pago
        const filtered = salesPool.filter(sale => {
            const clientName = sale.clientes?.nombre?.toLowerCase() || "";
            const clientTel = sale.clientes?.telefono?.toLowerCase() || "";
            const productsList = sale.productos || [];
            const prodDesc = productsList.map(p => p.descripcion).join(" ").toLowerCase();
            
            const matchQuery = clientName.includes(query) || clientTel.includes(query) || prodDesc.includes(query);
            const matchStatus = status === 'all' || sale.estado_pago === status;

            return matchQuery && matchStatus;
        });

        if (filtered.length === 0) {
            let emptyText = "No se encontraron registros que coincidan con la búsqueda.";
            if (state.corteScope === 'active' && !state.activeCorte) {
                emptyText = "No hay un corte activo en este momento. Inicia un nuevo corte para comenzar este ciclo o selecciona 'Todos los Pedidos' en el filtro superior.";
            } else if (state.corteScope === 'active' && salesPool.length === 0) {
                emptyText = `El "${state.activeCorte.nombre}" no tiene pedidos registrados todavía. Ve a la pestaña 'Nuevo Encargo' para agregar el primer pedido a este corte.`;
            } else if (state.corteScope === 'archived' && salesPool.length === 0) {
                emptyText = "No tienes ventas archivadas previas sin corte asignado.";
            }

            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="py-12 text-center text-slate-500">
                        ${emptyText}
                    </td>
                </tr>
            `;
            if (mobileContainer) {
                mobileContainer.innerHTML = `
                    <div class="py-12 text-center text-slate-500 glass-panel rounded-2xl p-6">
                        ${emptyText}
                    </div>
                `;
            }
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

            // 1. RENDERIZAR FILA PARA TABLA DESKTOP
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
                        <span>${fmt.dateOnly(sale.creado_en)} (${fmt.daysElapsed(sale.creado_en)})</span>
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

                        <!-- Botón Eliminar Pedido -->
                        <button class="btn-delete-order p-1.5 bg-rose-950 border border-rose-900 hover:border-rose-500 hover:bg-rose-900/50 rounded-lg text-rose-400 hover:text-white transition-all" 
                            data-sale-id="${sale.id}" 
                            data-client-name="${client.nombre}"
                            title="Eliminar pedido completo">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            `;

            // Handlers para la tabla desktop
            const btnDetails = tr.querySelector('.btn-view-details');
            if (btnDetails) {
                btnDetails.addEventListener('click', (e) => {
                    const btn = e.currentTarget;
                    openOrderDetails(btn.dataset.saleId, btn.dataset.clientName, btn.dataset.clientPhone, btn.dataset.totalUsd, btn.dataset.pendingUsd);
                });
            }

            tr.querySelector('.btn-view-history').addEventListener('click', (e) => {
                const btn = e.currentTarget;
                openAbonosHistory(btn.dataset.saleId, btn.dataset.clientName, btn.dataset.productDesc, btn.dataset.totalUsd);
            });

            const btnAddItem = tr.querySelector('.btn-add-item-direct');
            if (btnAddItem) {
                btnAddItem.addEventListener('click', (e) => {
                    const btn = e.currentTarget;
                    openAddItemModal(btn.dataset.saleId, btn.dataset.clientName);
                });
            }

            const btnAbono = tr.querySelector('.btn-abono-direct');
            if (btnAbono) {
                btnAbono.addEventListener('click', (e) => {
                    const saleId = e.currentTarget.dataset.saleId;
                    switchTab('abonos');
                    el.abonoVentaSelect.value = saleId;
                    handleAbonoSelectionChange();
                });
            }

            const btnDeliver = tr.querySelector('.btn-mark-delivered');
            if (btnDeliver) {
                btnDeliver.addEventListener('click', async (e) => {
                    const saleId = e.currentTarget.dataset.saleId;
                    const desc = e.currentTarget.dataset.prenda;
                    const ok = await showConfirmDialog({
                        title: 'Marcar como Entregado',
                        message: `¿Estás seguro de que deseas marcar como entregadas las prendas: "${desc}"?`,
                        confirmText: 'Sí, Entregar',
                        cancelText: 'Cancelar',
                        type: 'success',
                        icon: 'package-check'
                    });
                    if (ok) {
                        handleMarkAsDelivered(saleId);
                    }
                });
            }

            const btnDelete = tr.querySelector('.btn-delete-order');
            if (btnDelete) {
                btnDelete.addEventListener('click', (e) => {
                    const btn = e.currentTarget;
                    handleDeleteOrder(btn.dataset.saleId, btn.dataset.clientName);
                });
            }

            tbody.appendChild(tr);

            // 2. RENDERIZAR TARJETA PARA DISPOSITIVOS MÓVILES (< md)
            if (mobileContainer) {
                const card = document.createElement('div');
                card.className = "glass-panel rounded-2xl p-4 flex flex-col gap-3 shadow-lg border border-slate-800/80";
                card.innerHTML = `
                    <!-- Encabezado Cliente y Estado -->
                    <div class="flex items-start justify-between gap-2 border-b border-slate-800/60 pb-3">
                        <div>
                            <div class="font-bold text-slate-100 font-outfit text-base">${client.nombre}</div>
                            <div class="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                                ${client.telefono ? `<span class="flex items-center gap-1"><i data-lucide="phone" class="w-3 h-3 text-slate-500"></i> ${client.telefono}</span>` : ''}
                                <span class="flex items-center gap-1 text-[11px] text-slate-500"><i data-lucide="calendar" class="w-3 h-3"></i> ${fmt.dateOnly(sale.creado_en)}</span>
                            </div>
                        </div>
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${badgeClass} shrink-0">
                            ${statusText}
                        </span>
                    </div>

                    <!-- Detalles del Producto -->
                    <div class="flex items-center gap-3">
                        <img class="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0" 
                            src="${imgUrl}" 
                            onerror="this.onerror=null;this.src='${DEFAULT_CLOTHING_IMAGE}'"
                            alt="Prenda">
                        <div class="flex-1 min-w-0">
                            <div class="text-slate-200 font-medium text-xs leading-snug line-clamp-2">${combinedDescription}</div>
                            <div class="mt-1">
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${deliverBadgeClass}">
                                    ${deliverText}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Resumen Financiero en Grid 2x2 -->
                    <div class="grid grid-cols-2 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-900 text-xs">
                        <div>
                            <span class="text-[10px] text-slate-500 block uppercase font-semibold">Total Venta</span>
                            <span class="font-semibold text-slate-200">${fmt.usd(ventaTotal)}</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-slate-500 block uppercase font-semibold">Abonado</span>
                            <span class="font-medium text-emerald-400">${fmt.usd(abonado)}</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-slate-500 block uppercase font-semibold">Resta ($)</span>
                            <span class="font-bold text-rose-400">${fmt.usd(saldoPendiente)}</span>
                        </div>
                        <div>
                            <span class="text-[10px] text-slate-500 block uppercase font-semibold">Resta (Bs.)</span>
                            <span class="font-black text-amber-400">${fmt.bs(saldoBs)}</span>
                        </div>
                    </div>

                    <!-- Botones de Acción Móvil -->
                    <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-900">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <button class="btn-card-details p-2 bg-slate-900 border border-slate-800 hover:border-violet-500/50 rounded-xl text-slate-300 hover:text-violet-400 text-xs font-medium flex items-center gap-1">
                                <i data-lucide="eye" class="w-3.5 h-3.5"></i> Detalle
                            </button>
                            <button class="btn-card-history p-2 bg-slate-900 border border-slate-800 hover:border-brand-500/50 rounded-xl text-slate-300 hover:text-brand-400 text-xs font-medium flex items-center gap-1">
                                <i data-lucide="scroll" class="w-3.5 h-3.5"></i> Abonos
                            </button>
                            <button class="btn-card-add p-2 bg-brand-950/80 border border-brand-900 hover:border-brand-500 rounded-xl text-brand-300 text-xs font-medium flex items-center gap-1">
                                <i data-lucide="plus" class="w-3.5 h-3.5"></i> Prenda
                            </button>
                        </div>
                        
                        <div class="flex items-center gap-1.5">
                            ${saldoPendiente > 0 ? `
                                <button class="btn-card-abono px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1 shadow-md shadow-emerald-900/30">
                                    <i data-lucide="hand-coins" class="w-3.5 h-3.5"></i> Abonar
                                </button>
                            ` : ''}
                            ${!allDelivered ? `
                                <button class="btn-card-deliver p-2 bg-brand-950 border border-brand-800 hover:border-brand-500 rounded-xl text-brand-400 text-xs"
                                    title="Marcar como entregado">
                                    <i data-lucide="package-check" class="w-3.5 h-3.5"></i>
                                </button>
                            ` : ''}
                            <button class="btn-card-delete p-2 bg-rose-950 border border-rose-800 hover:border-rose-500 rounded-xl text-rose-400 text-xs flex items-center justify-center"
                                title="Eliminar pedido completo">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                `;

                // Event handlers para los botones de la tarjeta móvil
                const mBtnDetails = card.querySelector('.btn-card-details');
                if (mBtnDetails) {
                    mBtnDetails.addEventListener('click', () => {
                        openOrderDetails(sale.id, client.nombre, client.telefono || 'Sin teléfono', fmt.usd(ventaTotal), fmt.usd(saldoPendiente));
                    });
                }

                const mBtnHistory = card.querySelector('.btn-card-history');
                if (mBtnHistory) {
                    mBtnHistory.addEventListener('click', () => {
                        openAbonosHistory(sale.id, client.nombre, combinedDescription, fmt.usd(abonado));
                    });
                }

                const mBtnAdd = card.querySelector('.btn-card-add');
                if (mBtnAdd) {
                    mBtnAdd.addEventListener('click', () => {
                        openAddItemModal(sale.id, client.nombre);
                    });
                }

                const mBtnAbono = card.querySelector('.btn-card-abono');
                if (mBtnAbono) {
                    mBtnAbono.addEventListener('click', () => {
                        switchTab('abonos');
                        el.abonoVentaSelect.value = sale.id;
                        handleAbonoSelectionChange();
                    });
                }

                const mBtnDeliver = card.querySelector('.btn-card-deliver');
                if (mBtnDeliver) {
                    mBtnDeliver.addEventListener('click', async () => {
                        const ok = await showConfirmDialog({
                            title: 'Marcar como Entregado',
                            message: `¿Estás seguro de que deseas marcar como entregadas las prendas: "${combinedDescription}"?`,
                            confirmText: 'Sí, Entregar',
                            cancelText: 'Cancelar',
                            type: 'success',
                            icon: 'package-check'
                        });
                        if (ok) {
                            handleMarkAsDelivered(sale.id);
                        }
                    });
                }

                const mBtnDelete = card.querySelector('.btn-card-delete');
                if (mBtnDelete) {
                    mBtnDelete.addEventListener('click', () => {
                        handleDeleteOrder(sale.id, client.nombre);
                    });
                }

                mobileContainer.appendChild(card);
            }
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

    // --- ACCIÓN ELIMINAR PEDIDO ---
    async function handleDeleteOrder(saleId, clientName) {
        if (!window.supabaseClient.isConfigured) return;

        const ok = await showConfirmDialog({
            title: `Eliminar Pedido de ${clientName}`,
            message: `¿Estás absolutamente seguro de que deseas ELIMINAR por completo el pedido de ${clientName}?\n\nEsta acción borrará la venta, las prendas y los abonos asociados. NO se puede deshacer.`,
            confirmText: 'Sí, Eliminar Pedido',
            cancelText: 'Cancelar',
            type: 'danger',
            icon: 'trash-2'
        });

        if (!ok) return;

        setLoader(true);
        const supabase = window.supabaseClient.supabase;

        try {
            const { error } = await supabase
                .from('ventas')
                .delete()
                .eq('id', saleId);

            if (error) throw error;

            showToast("Pedido Eliminado", `El pedido de ${clientName} ha sido eliminado con éxito.`, "success");
            await loadData();
        } catch (err) {
            console.error("Error al eliminar pedido:", err);
            showToast("Error de Operación", "No se pudo eliminar el pedido: " + err.message, "error");
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
            const activeCorteId = state.activeCorte ? state.activeCorte.id : null;
            let newSale = null;
            let insertSaleError = null;

            try {
                const res = await supabase
                    .from('ventas')
                    .insert([{
                        cliente_id: clientId,
                        corte_id: activeCorteId,
                        monto_total_usd: totalPrice,
                        saldo_pendiente_usd: totalPrice,
                        estado_pago: 'pendiente',
                        creado_en: orderDate
                    }])
                    .select('id')
                    .single();
                newSale = res.data;
                insertSaleError = res.error;
            } catch (errCol) {
                const res2 = await supabase
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
                newSale = res2.data;
                insertSaleError = res2.error;
            }

            if (insertSaleError) throw insertSaleError;
            const saleId = newSale.id;

            // Guardar local mapping si hay corte activo
            if (activeCorteId) {
                const localMap = JSON.parse(localStorage.getItem('ventas_corte_map') || '{}');
                localMap[saleId] = activeCorteId;
                localStorage.setItem('ventas_corte_map', JSON.stringify(localMap));
            }

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

            const corteNotice = state.activeCorte ? ` (Asignado al ${state.activeCorte.nombre})` : ' (Sin corte activo)';
            showToast("Encargo Guardado", `Se ha registrado el pedido con ${state.tempOrderItems.length} prendas para ${clientName}${corteNotice}.`, "success");
            
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
        const saleDateText = sale ? `${fmt.dateOnly(sale.creado_en)} (${fmt.daysElapsed(sale.creado_en)})` : '';
        
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
                    <!-- Botón Editar Prenda -->
                    <button class="btn-edit-single p-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
                        data-product-id="${item.id}"
                        data-sale-id="${ventaId}"
                        title="Editar detalles de la prenda">
                        <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                    </button>

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

            const btnEdit = card.querySelector('.btn-edit-single');
            if (btnEdit) {
                btnEdit.addEventListener('click', (e) => {
                    const btn = e.currentTarget;
                    openEditItemModal(btn.dataset.productId, btn.dataset.saleId);
                });
            }

            const btnDeliver = card.querySelector('.btn-deliver-single');
            if (btnDeliver) {
                btnDeliver.addEventListener('click', async (e) => {
                    const btn = e.currentTarget;
                    const ok = await showConfirmDialog({
                        title: 'Entregar Prenda',
                        message: `¿Marcar "${btn.dataset.prendaDesc}" como entregada?`,
                        confirmText: 'Sí, Entregar',
                        cancelText: 'Cancelar',
                        type: 'success',
                        icon: 'package-check'
                    });
                    if (ok) {
                        await handleMarkSingleAsDelivered(btn.dataset.productId, btn.dataset.prendaDesc);
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

    // --- RECALCULAR Y ACTUALIZAR TOTALES DE UNA VENTA ---
    async function updateSaleTotals(saleId) {
        const supabase = window.supabaseClient.supabase;
        
        // 1. Obtener todas las prendas de esa venta
        const { data: products, error: prodError } = await supabase
            .from('productos')
            .select('precio_venta_usd')
            .eq('venta_id', saleId);
            
        if (prodError) throw prodError;
        
        const newTotal = products.reduce((sum, p) => sum + parseFloat(p.precio_venta_usd), 0);
        
        // 2. Obtener todos los abonos de esa venta
        const { data: abonos, error: abonosError } = await supabase
            .from('abonos')
            .select('monto_usd')
            .eq('venta_id', saleId);
            
        if (abonosError) throw abonosError;
        
        const totalAbonado = abonos.reduce((sum, a) => sum + parseFloat(a.monto_usd), 0);
        const newPending = Math.max(0, newTotal - totalAbonado);
        
        let newEstadoPago = 'pendiente';
        if (newPending <= 0.009) {
            newEstadoPago = 'completado';
        } else if (newPending < newTotal - 0.009) {
            newEstadoPago = 'parcial';
        }
        
        // 3. Actualizar la venta en Supabase
        const { error: updateError } = await supabase
            .from('ventas')
            .update({
                monto_total_usd: newTotal,
                saldo_pendiente_usd: newPending,
                estado_pago: newEstadoPago
            })
            .eq('id', saleId);
            
        if (updateError) throw updateError;
    }

    // --- ABRIR MODAL EDITAR PRENDA ---
    function openEditItemModal(productId, saleId) {
        const sale = state.sales.find(s => s.id === saleId);
        if (!sale) return;
        const product = (sale.productos || []).find(p => p.id === productId);
        if (!product) return;

        el.editItemProductId.value = productId;
        el.editItemSaleId.value = saleId;
        el.editItemDesc.value = product.descripcion;
        el.editItemCost.value = product.precio_costo_usd;
        el.editItemPrice.value = product.precio_venta_usd;
        el.editItemImg.value = product.imagen_url || "";

        el.editItemCost.dispatchEvent(new Event('input'));

        el.editItemModal.classList.remove('hidden');
    }

    // --- ACCIÓN GUARDAR CAMBIOS DE PRENDA ---
    async function handleEditItemSubmit(e) {
        e.preventDefault();
        
        if (!window.supabaseClient.isConfigured) return;

        const productId = el.editItemProductId.value;
        const saleId = el.editItemSaleId.value;
        const desc = el.editItemDesc.value.trim();
        const costUsd = parseFloat(el.editItemCost.value) || 0;
        const priceUsd = parseFloat(el.editItemPrice.value) || 0;
        const imgUrl = el.editItemImg.value.trim() || null;

        if (!desc || priceUsd <= 0 || costUsd < 0) {
            showToast("Validación", "Por favor ingresa detalles válidos.", "warning");
            return;
        }

        setLoader(true);
        const supabase = window.supabaseClient.supabase;

        try {
            // 1. Actualizar el producto en Supabase
            const { error: updateProdError } = await supabase
                .from('productos')
                .update({
                    descripcion: desc,
                    precio_costo_usd: costUsd,
                    precio_venta_usd: priceUsd,
                    imagen_url: imgUrl
                })
                .eq('id', productId);

            if (updateProdError) throw updateProdError;

            // 2. Recalcular y actualizar totales de la venta
            await updateSaleTotals(saleId);

            showToast("Prenda Actualizada", `Se modificaron los datos de "${desc}" correctamente.`, "success");
            el.editItemModal.classList.add('hidden');
            el.orderDetailsModal.classList.add('hidden'); // Cerrar modal de detalles para forzar recarga visual

            await loadData();
        } catch (err) {
            console.error("Error al editar prenda:", err);
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
