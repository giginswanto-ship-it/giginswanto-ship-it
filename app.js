/**
 * SISTEM PENCATATAN KEUANGAN & STOK TBS - POOL TBS KARYA MAJU
 * Dokumen: SOP-TBS-2026/01
 * Core Logic & State Management
 */

// Global State
let state = {
  settings: {
    peronName: "POOL TBS KARYA MAJU",
    pksPartner: "PT. Sawit Makmur Perkasa",
    dokumenId: "SOP-TBS-2026/01",
    alamat: "Jl. Poros Perkebunan Sawit KM 14, Riau",
    telepon: "0812-7654-3210",
    defaultHargaBeli: 2450,
    defaultHargaDO: 2780,
    pphRate: 0.0025,
    targetSusutMax: 2.5
  },
  farmers: [],
  purchases: [],
  sales: [],
  cashJournals: [],
  kasbonLogs: []
};

// Initial SOP Demo Data (Exact match with SOP-TBS-2026/01)
const SOP_DEFAULT_DATA = {
  settings: {
    peronName: "POOL TBS KARYA MAJU",
    pksPartner: "PT. Sawit Makmur Perkasa",
    dokumenId: "SOP-TBS-2026/01",
    alamat: "Jl. Poros Perkebunan Sawit KM 14, Riau",
    telepon: "0812-7654-3210",
    defaultHargaBeli: 2450,
    defaultHargaDO: 2780,
    pphRate: 0.0025,
    targetSusutMax: 2.5
  },
  farmers: [
    { id: "F-001", name: "Pak Budi", phone: "0813-1122-3344", location: "Blok A Sawit Rejo", kasbon: 0, totalKasbonHistory: 500000 },
    { id: "F-002", name: "Poktan Jaya", phone: "0821-4455-6677", location: "Desa Karya Maju (Kelompok Tani)", kasbon: 0, totalKasbonHistory: 0 },
    { id: "F-003", name: "Pak Syamsul", phone: "0852-9988-7766", location: "Simpang Kiri KM 8", kasbon: 1300000, totalKasbonHistory: 1500000 },
    { id: "F-004", name: "Pak Joko", phone: "0812-7711-2233", location: "Blok C Perkebunan", kasbon: 250000, totalKasbonHistory: 250000 }
  ],
  purchases: [
    {
      id: "BUY-20261120-001",
      date: "2026-11-20",
      farmerId: "F-001",
      farmerName: "Pak Budi",
      vehicleNo: "BM 9876 AA",
      bruto: 3450,
      tara: 1950,
      netto: 1500,
      potPercent: 3.0,
      nBayar: 1455,
      hargaBeli: 2450,
      total: 3564750,
      potKasbon: 500000,
      bayarBersih: 3064750,
      catatan: "TBS Matang 95%, tangkai pendek"
    },
    {
      id: "BUY-20261120-002",
      date: "2026-11-20",
      farmerId: "F-002",
      farmerName: "Poktan Jaya",
      vehicleNo: "BM 8890 CD",
      bruto: 8200,
      tara: 2400,
      netto: 5800,
      potPercent: 2.0,
      nBayar: 5684,
      hargaBeli: 2470,
      total: 14039480,
      potKasbon: 0,
      bayarBersih: 14039480,
      catatan: "Kualitas super, buah besar"
    },
    {
      id: "BUY-20261120-003",
      date: "2026-11-20",
      farmerId: "F-003",
      farmerName: "Pak Syamsul",
      vehicleNo: "BM 7721 KL",
      bruto: 2980,
      tara: 1880,
      netto: 1100,
      potPercent: 4.0,
      nBayar: 1056,
      hargaBeli: 2450,
      total: 2587200,
      potKasbon: 200000,
      bayarBersih: 2387200,
      catatan: "Ada tangkai panjang sedikit"
    }
  ],
  sales: [
    {
      id: "SALE-20261120-001",
      date: "2026-11-20",
      ticketNo: "PKS-08911",
      policeNo: "BM 8123 XX",
      driverName: "Anto",
      nettoLapak: 8500,
      nettoPKS: 8350,
      refraksiPercent: 2.0,
      nCair: 8183,
      hargaDO: 2780,
      gross: 22748740,
      pph22: 56872,
      netCair: 22691868,
      status: "Cair",
      cairDate: "2026-11-20",
      pksDestination: "PT. Sawit Makmur Perkasa"
    },
    {
      id: "SALE-20261120-002",
      date: "2026-11-20",
      ticketNo: "PKS-08945",
      policeNo: "BK 9044 YZ",
      driverName: "Herman",
      nettoLapak: 9300,
      nettoPKS: 9120,
      refraksiPercent: 2.5,
      nCair: 8892,
      hargaDO: 2780,
      gross: 24719760,
      pph22: 61799,
      netCair: 24657961,
      status: "Pending",
      cairDate: null,
      pksDestination: "PT. Sawit Makmur Perkasa"
    }
  ],
  cashJournals: [
    {
      id: "JRN-20261120-001",
      date: "2026-11-20",
      description: "Saldo Awal Kas Lapak & Bank",
      category: "Modal Kerja",
      account: "Kas Lapak & Bank",
      inflow: 50000000,
      outflow: 0,
      lapakInflow: 25000000,
      lapakOutflow: 0,
      bankInflow: 25000000,
      bankOutflow: 0,
      refId: "INIT"
    },
    {
      id: "JRN-20261120-002",
      date: "2026-11-20",
      description: "Pembelian TBS Pak Budi (Nettelah Kasbon)",
      category: "Pembelian TBS",
      account: "Kas Laci Lapak",
      inflow: 0,
      outflow: 3064750,
      lapakInflow: 0,
      lapakOutflow: 3064750,
      bankInflow: 0,
      bankOutflow: 0,
      refId: "BUY-20261120-001"
    },
    {
      id: "JRN-20261120-003",
      date: "2026-11-20",
      description: "Uang Jalan Sopir & Muat Truk BM 8123 XX",
      category: "Biaya Angkut",
      account: "Kas Laci Lapak",
      inflow: 0,
      outflow: 750000,
      lapakInflow: 0,
      lapakOutflow: 750000,
      bankInflow: 0,
      bankOutflow: 0,
      refId: "EXP-TRUCK-001"
    },
    {
      id: "JRN-20261120-004",
      date: "2026-11-20",
      description: "Pencairan Tiket PKS-08911 (Net PPh 22)",
      category: "Penjualan PKS",
      account: "Kas Bank PKS",
      inflow: 22691868,
      outflow: 0,
      lapakInflow: 0,
      lapakOutflow: 0,
      bankInflow: 22691868,
      bankOutflow: 0,
      refId: "SALE-20261120-001"
    }
  ],
  kasbonLogs: [
    {
      id: "KB-20261110-001",
      date: "2026-11-10",
      farmerId: "F-001",
      farmerName: "Pak Budi",
      type: "Pinjaman",
      amount: 500000,
      notes: "Kasbon beli pupuk NPK"
    },
    {
      id: "KB-20261115-001",
      date: "2026-11-15",
      farmerId: "F-003",
      farmerName: "Pak Syamsul",
      type: "Pinjaman",
      amount: 1500000,
      notes: "Pinjaman operasional panen & dodos"
    },
    {
      id: "KB-20261120-001",
      date: "2026-11-20",
      farmerId: "F-001",
      farmerName: "Pak Budi",
      type: "Potongan Timbang",
      amount: 500000,
      notes: "Potong timbang BUY-20261120-001 (Lunas)"
    },
    {
      id: "KB-20261120-002",
      date: "2026-11-20",
      farmerId: "F-003",
      farmerName: "Pak Syamsul",
      type: "Potongan Timbang",
      amount: 200000,
      notes: "Potong timbang BUY-20261120-003 (Sisa Rp 1.300.000)"
    }
  ]
};

// Formatting Utilities
function formatRp(num) {
  if (num === undefined || num === null || isNaN(num)) return "Rp 0";
  return "Rp " + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatKg(num) {
  if (num === undefined || num === null || isNaN(num)) return "0 kg";
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " kg";
}

function formatNumber(num) {
  if (num === undefined || num === null || isNaN(num)) return "0";
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDateDisplay(dStr) {
  if (!dStr) return "-";
  const parts = dStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0].slice(-2)}`;
  }
  return dStr;
}

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === "success" ? "✅" : type === "error" ? "❌" : "⚠️"}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

// Data Persistence (Server API + LocalStorage fallback)
async function loadData() {
  try {
    const res = await fetch("/api/data");
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        state = json.data;
        document.getElementById("syncStatusText").textContent = "Tersinkron (Server)";
        renderAll();
        return;
      }
    }
  } catch (err) {
    console.log("Server API not reachable, checking localStorage...");
  }

  // LocalStorage fallback
  const local = localStorage.getItem("POOL_TBS_DATA");
  if (local) {
    try {
      state = JSON.parse(local);
      document.getElementById("syncStatusText").textContent = "Tersinkron (Lokal)";
    } catch (e) {
      state = JSON.parse(JSON.stringify(SOP_DEFAULT_DATA));
    }
  } else {
    state = JSON.parse(JSON.stringify(SOP_DEFAULT_DATA));
  }
  renderAll();
}

async function saveData() {
  // Save to localStorage immediately
  localStorage.setItem("POOL_TBS_DATA", JSON.stringify(state));

  // Attempt server save
  try {
    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    });
    if (res.ok) {
      document.getElementById("syncStatusText").textContent = "Tersinkron (Server)";
      return true;
    }
  } catch (err) {
    document.getElementById("syncStatusText").textContent = "Tersinkron (Lokal)";
  }
  return true;
}

// Navigation Tabs
function initTabs() {
  const tabs = document.querySelectorAll(".nav-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");
      switchTab(targetId);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

  const targetTab = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
  const targetPane = document.getElementById(tabId);
  if (targetTab) targetTab.classList.add("active");
  if (targetPane) targetPane.classList.add("active");

  if (tabId === "tab-dashboard" || tabId === "tab-analisis") {
    renderCharts();
  }
}

// Modal Handlers
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("active");

  const today = new Date().toISOString().split("T")[0];

  // Specific initializations
  if (id === "modalPembelian") {
    document.getElementById("buyDate").value = today;
    document.getElementById("buyNota").value = `TB-${today.replace(/-/g, "")}-${String(state.purchases.length + 1).padStart(3, "0")}`;
    document.getElementById("buyHargaBeli").value = state.settings.defaultHargaBeli || 2450;
    populateFarmerSelect("buyFarmerSelect");
    calcPurchaseLive();
  } else if (id === "modalPenjualan") {
    document.getElementById("saleDate").value = today;
    document.getElementById("saleTicketNo").value = `PKS-${String(Math.floor(Math.random() * 90000) + 10000)}`;
    document.getElementById("saleDestination").value = state.settings.pksPartner || "PT. Sawit Makmur Perkasa";
    document.getElementById("saleHargaDO").value = state.settings.defaultHargaDO || 2780;
    calcSaleLive();
  } else if (id === "modalBiaya") {
    document.getElementById("expDate").value = today;
  } else if (id === "modalMutasiKas") {
    document.getElementById("mutDate").value = today;
  } else if (id === "modalPinjamKasbon") {
    document.getElementById("loanDate").value = today;
    populateFarmerSelect("loanFarmerSelect");
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("active");
}

function populateFarmerSelect(selectId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">-- Pilih Petani / Kelompok Tani --</option>';
  state.farmers.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = `${f.name} (Kasbon: ${formatRp(f.kasbon)})`;
    sel.appendChild(opt);
  });
}

function onSelectFarmer() {
  const farmerId = document.getElementById("buyFarmerSelect").value;
  const farmer = state.farmers.find(f => f.id === farmerId);
  const kasbonEl = document.getElementById("liveFarmerKasbon");
  const potInput = document.getElementById("buyPotKasbon");
  if (farmer) {
    kasbonEl.textContent = formatRp(farmer.kasbon);
    if (farmer.kasbon > 0) {
      potInput.value = farmer.kasbon;
    } else {
      potInput.value = 0;
    }
  } else {
    kasbonEl.textContent = "Rp 0";
    potInput.value = 0;
  }
  calcPurchaseLive();
}

// Live Calculations for Modul 1 (Pembelian)
function calcPurchaseLive() {
  const bruto = parseFloat(document.getElementById("buyBruto").value) || 0;
  const tara = parseFloat(document.getElementById("buyTara").value) || 0;
  const netto = Math.max(0, bruto - tara);
  document.getElementById("buyNetto").value = netto;

  const potPercent = parseFloat(document.getElementById("buyPotPercent").value) || 0;
  const potKg = Math.round(netto * (potPercent / 100));
  const nBayar = Math.max(0, netto - potKg);
  document.getElementById("buyNBayar").value = nBayar;

  const hargaBeli = parseFloat(document.getElementById("buyHargaBeli").value) || 0;
  const total = Math.round(nBayar * hargaBeli);
  document.getElementById("liveBuyTotal").textContent = formatRp(total);

  // Potongan Kasbon
  const farmerId = document.getElementById("buyFarmerSelect").value;
  const farmer = state.farmers.find(f => f.id === farmerId);
  const maxKasbon = farmer ? farmer.kasbon : 0;
  let potKasbon = parseFloat(document.getElementById("buyPotKasbon").value) || 0;

  // Auto-cap pot kasbon so it cannot exceed remaining debt or total purchase
  if (potKasbon > maxKasbon && maxKasbon > 0) {
    potKasbon = maxKasbon;
    document.getElementById("buyPotKasbon").value = potKasbon;
  }
  if (potKasbon > total) {
    potKasbon = total;
    document.getElementById("buyPotKasbon").value = potKasbon;
  }

  const bayarBersih = Math.max(0, total - potKasbon);
  document.getElementById("liveBayarBersih").textContent = formatRp(bayarBersih);
}

// Live Calculations for Modul 2 (Penjualan PKS)
function calcSaleLive() {
  const nettoPks = parseFloat(document.getElementById("saleNettoPks").value) || 0;
  const refraksi = parseFloat(document.getElementById("saleRefraksi").value) || 0;
  const refraksiKg = Math.round(nettoPks * (refraksi / 100));
  const nCair = Math.max(0, nettoPks - refraksiKg);
  document.getElementById("saleNCair").value = nCair;

  const hargaDO = parseFloat(document.getElementById("saleHargaDO").value) || 0;
  const gross = Math.round(nCair * hargaDO);
  document.getElementById("liveSaleGross").textContent = formatRp(gross);

  const pphRate = state.settings.pphRate || 0.0025;
  const pph22 = Math.round(gross * pphRate);
  document.getElementById("liveSalePph").textContent = formatRp(pph22);

  const netCair = Math.max(0, gross - pph22);
  document.getElementById("liveSaleNetCair").textContent = formatRp(netCair);
}

// Save Purchase (Modul 1)
function savePurchase(e) {
  e.preventDefault();
  const date = document.getElementById("buyDate").value;
  const nota = document.getElementById("buyNota").value;
  const farmerId = document.getElementById("buyFarmerSelect").value;
  const farmer = state.farmers.find(f => f.id === farmerId);
  if (!farmer) {
    alert("Pilih petani terlebih dahulu!");
    return;
  }

  const vehicleNo = document.getElementById("buyVehicle").value || "-";
  const bruto = parseFloat(document.getElementById("buyBruto").value) || 0;
  const tara = parseFloat(document.getElementById("buyTara").value) || 0;
  const netto = Math.max(0, bruto - tara);
  const potPercent = parseFloat(document.getElementById("buyPotPercent").value) || 0;
  const potKg = Math.round(netto * (potPercent / 100));
  const nBayar = Math.max(0, netto - potKg);
  const hargaBeli = parseFloat(document.getElementById("buyHargaBeli").value) || 0;
  const total = Math.round(nBayar * hargaBeli);
  let potKasbon = parseFloat(document.getElementById("buyPotKasbon").value) || 0;
  if (potKasbon > farmer.kasbon) potKasbon = farmer.kasbon;
  if (potKasbon > total) potKasbon = total;
  const bayarBersih = total - potKasbon;
  const catatan = document.getElementById("buyCatatan").value || "Kualitas baik";

  const purchaseItem = {
    id: `BUY-${date.replace(/-/g, "")}-${String(Date.now()).slice(-4)}`,
    date,
    nota,
    farmerId: farmer.id,
    farmerName: farmer.name,
    vehicleNo,
    bruto,
    tara,
    netto,
    potPercent,
    nBayar,
    hargaBeli,
    total,
    potKasbon,
    bayarBersih,
    catatan
  };

  state.purchases.push(purchaseItem);

  // Update Farmer's Kasbon Debt
  if (potKasbon > 0) {
    farmer.kasbon = Math.max(0, farmer.kasbon - potKasbon);
    state.kasbonLogs.push({
      id: `KB-${date.replace(/-/g, "")}-${String(Date.now()).slice(-4)}`,
      date,
      farmerId: farmer.id,
      farmerName: farmer.name,
      type: "Potongan Timbang",
      amount: potKasbon,
      notes: `Potongan timbang nota ${nota} (Sisa Kasbon: ${formatRp(farmer.kasbon)})`
    });
  }

  // Automatic Cash Journal Outflow (Kas Laci Lapak - Bayar Tunai)
  state.cashJournals.push({
    id: `JRN-${date.replace(/-/g, "")}-${String(Date.now()).slice(-4)}`,
    date,
    description: `Pembelian TBS ${farmer.name} (Net ${potKasbon > 0 ? "setelah Kasbon" : "Tunai"})`,
    category: "Pembelian TBS",
    account: "Kas Laci Lapak",
    inflow: 0,
    outflow: bayarBersih,
    lapakInflow: 0,
    lapakOutflow: bayarBersih,
    bankInflow: 0,
    bankOutflow: 0,
    refId: purchaseItem.id
  });

  closeModal("modalPembelian");
  saveData();
  renderAll();
  showToast(`Pembelian ${farmer.name} berhasil disimpan!`);

  // Prompt to print slip
  printSlip(purchaseItem.id);
}

// Save Sale to PKS (Modul 2)
function saveSale(e) {
  e.preventDefault();
  const date = document.getElementById("saleDate").value;
  const ticketNo = document.getElementById("saleTicketNo").value.trim();
  const policeNo = document.getElementById("salePoliceNo").value.trim();
  const driverName = document.getElementById("saleDriver").value.trim() || "-";
  const pksDestination = document.getElementById("saleDestination").value.trim() || state.settings.pksPartner;
  const nettoLapak = parseFloat(document.getElementById("saleNettoLapak").value) || 0;
  const nettoPKS = parseFloat(document.getElementById("saleNettoPks").value) || 0;
  const refraksiPercent = parseFloat(document.getElementById("saleRefraksi").value) || 0;
  const refraksiKg = Math.round(nettoPKS * (refraksiPercent / 100));
  const nCair = Math.max(0, nettoPKS - refraksiKg);
  const hargaDO = parseFloat(document.getElementById("saleHargaDO").value) || 0;
  const gross = Math.round(nCair * hargaDO);
  const pphRate = state.settings.pphRate || 0.0025;
  const pph22 = Math.round(gross * pphRate);
  const netCair = gross - pph22;
  const status = document.getElementById("saleStatus").value;

  const saleItem = {
    id: `SALE-${date.replace(/-/g, "")}-${String(Date.now()).slice(-4)}`,
    date,
    ticketNo,
    policeNo,
    driverName,
    pksDestination,
    nettoLapak,
    nettoPKS,
    refraksiPercent,
    nCair,
    hargaDO,
    gross,
    pph22,
    netCair,
    status,
    cairDate: status === "Cair" ? date : null
  };

  state.sales.push(saleItem);

  // If status Cair, automatically record Cash Inflow into Kas Bank PKS
  if (status === "Cair") {
    state.cashJournals.push({
      id: `JRN-${date.replace(/-/g, "")}-${String(Date.now()).slice(-4)}`,
      date,
      description: `Pencairan Tiket ${ticketNo} (Net PPh 22)`,
      category: "Penjualan PKS",
      account: "Kas Bank PKS",
      inflow: netCair,
      outflow: 0,
      lapakInflow: 0,
      lapakOutflow: 0,
      bankInflow: netCair,
      bankOutflow: 0,
      refId: saleItem.id
    });
  }

  closeModal("modalPenjualan");
  saveData();
  renderAll();
  showToast(`Tiket PKS ${ticketNo} berhasil disimpan!`);
}

// Mark Sale as Cair (Cairkan Piutang PKS)
function markSaleCair(saleId) {
  const sale = state.sales.find(s => s.id === saleId);
  if (!sale) return;

  const today = new Date().toISOString().split("T")[0];
  sale.status = "Cair";
  sale.cairDate = today;

  // Record cash inflow to Bank PKS
  state.cashJournals.push({
    id: `JRN-${today.replace(/-/g, "")}-${String(Date.now()).slice(-4)}`,
    date: today,
    description: `Pencairan Tiket ${sale.ticketNo} (Net PPh 22)`,
    category: "Penjualan PKS",
    account: "Kas Bank PKS",
    inflow: sale.netCair,
    outflow: 0,
    lapakInflow: 0,
    lapakOutflow: 0,
    bankInflow: sale.netCair,
    bankOutflow: 0,
    refId: sale.id
  });

  saveData();
  renderAll();
  showToast(`Tiket ${sale.ticketNo} dicairkan ke Kas Bank: ${formatRp(sale.netCair)}!`);
}

// Save Operational Expense (Modul 3)
function saveExpense(e) {
  e.preventDefault();
  const date = document.getElementById("expDate").value;
  const category = document.getElementById("expCategory").value;
  const description = document.getElementById("expDesc").value.trim();
  const account = document.getElementById("expAccount").value;
  const amount = parseFloat(document.getElementById("expAmount").value) || 0;

  const isLapak = account === "Kas Laci Lapak";

  state.cashJournals.push({
    id: `JRN-${date.replace(/-/g, "")}-${String(Date.now()).slice(-4)}`,
    date,
    description,
    category,
    account,
    inflow: 0,
    outflow: amount,
    lapakInflow: 0,
    lapakOutflow: isLapak ? amount : 0,
    bankInflow: 0,
    bankOutflow: !isLapak ? amount : 0,
    refId: `EXP-${Date.now()}`
  });

  closeModal("modalBiaya");
  saveData();
  renderAll();
  showToast(`Pengeluaran ${category} sebesar ${formatRp(amount)} dicatat!`);
}

// Save Mutasi Kas (Tarik Bank -> Laci Lapak)
function saveTransfer(e) {
  e.preventDefault();
  const date = document.getElementById("mutDate").value;
  const amount = parseFloat(document.getElementById("mutAmount").value) || 0;
  const desc = document.getElementById("mutDesc").value.trim() || "Tarik Bank untuk Kas Laci Lapak";

  // Check bank balance
  const balances = calculateCurrentBalances();
  if (amount > balances.bank) {
    if (!confirm(`Peringatan: Saldo Kas Bank saat ini (${formatRp(balances.bank)}) lebih kecil dari jumlah penarikan (${formatRp(amount)}). Tetap lanjutkan?`)) {
      return;
    }
  }

  // Double entry or consolidated transfer entry:
  // Bank decreases, Lapak increases. Total liquidity remains identical.
  state.cashJournals.push({
    id: `JRN-${date.replace(/-/g, "")}-${String(Date.now()).slice(-4)}`,
    date,
    description: desc,
    category: "Mutasi Kas",
    account: "Kas Laci & Bank",
    inflow: amount,
    outflow: amount,
    lapakInflow: amount,
    lapakOutflow: 0,
    bankInflow: 0,
    bankOutflow: amount,
    refId: `MUT-${Date.now()}`
  });

  closeModal("modalMutasiKas");
  saveData();
  renderAll();
  showToast(`Mutasi berhasil: ${formatRp(amount)} ditarik ke Kas Laci Lapak!`);
}

// Save New Farmer Loan (Kasbon Baru)
function saveFarmerLoan(e) {
  e.preventDefault();
  const date = document.getElementById("loanDate").value;
  const farmerId = document.getElementById("loanFarmerSelect").value;
  const farmer = state.farmers.find(f => f.id === farmerId);
  if (!farmer) return;

  const amount = parseFloat(document.getElementById("loanAmount").value) || 0;
  const notes = document.getElementById("loanNotes").value.trim();

  // Increase farmer debt
  farmer.kasbon += amount;
  farmer.totalKasbonHistory = (farmer.totalKasbonHistory || 0) + amount;

  // Record Kasbon Log
  state.kasbonLogs.push({
    id: `KB-${date.replace(/-/g, "")}-${String(Date.now()).slice(-4)}`,
    date,
    farmerId: farmer.id,
    farmerName: farmer.name,
    type: "Pinjaman",
    amount,
    notes
  });

  // Automatically record Cash Outflow from Kas Laci Lapak
  state.cashJournals.push({
    id: `JRN-${date.replace(/-/g, "")}-${String(Date.now()).slice(-4)}`,
    date,
    description: `Pemberian Pinjaman Kasbon Petani: ${farmer.name}`,
    category: "Kasbon Petani",
    account: "Kas Laci Lapak",
    inflow: 0,
    outflow: amount,
    lapakInflow: 0,
    lapakOutflow: amount,
    bankInflow: 0,
    bankOutflow: 0,
    refId: `LOAN-${farmer.id}`
  });

  closeModal("modalPinjamKasbon");
  saveData();
  renderAll();
  showToast(`Pinjaman kasbon ${farmer.name} sebesar ${formatRp(amount)} berhasil dicatat!`);
}

// Save New Farmer
function saveNewFarmer(e) {
  e.preventDefault();
  const name = document.getElementById("newFarmerName").value.trim();
  const phone = document.getElementById("newFarmerPhone").value.trim() || "-";
  const location = document.getElementById("newFarmerLocation").value.trim() || "-";
  const initDebt = parseFloat(document.getElementById("newFarmerInitDebt").value) || 0;

  const newId = `F-${String(state.farmers.length + 1).padStart(3, "0")}`;
  const farmer = {
    id: newId,
    name,
    phone,
    location,
    kasbon: initDebt,
    totalKasbonHistory: initDebt
  };

  state.farmers.push(farmer);

  if (initDebt > 0) {
    const today = new Date().toISOString().split("T")[0];
    state.kasbonLogs.push({
      id: `KB-${today.replace(/-/g, "")}-${String(Date.now()).slice(-4)}`,
      date: today,
      farmerId: newId,
      farmerName: name,
      type: "Pinjaman",
      amount: initDebt,
      notes: "Saldo kasbon awal terdaftar"
    });
  }

  closeModal("modalTambahPetani");
  saveData();
  renderAll();
  showToast(`Petani ${name} berhasil didaftarkan!`);
}

// Calculate Running Balances
function calculateCurrentBalances() {
  let lapakBal = 0;
  let bankBal = 0;

  state.cashJournals.forEach(j => {
    // If specific fields exist
    if (j.lapakInflow !== undefined) {
      lapakBal += (j.lapakInflow - j.lapakOutflow);
      bankBal += (j.bankInflow - j.bankOutflow);
    } else {
      // Legacy fallback
      if (j.account === "Kas Laci Lapak") {
        lapakBal += (j.inflow - j.outflow);
      } else if (j.account === "Kas Bank PKS") {
        bankBal += (j.inflow - j.outflow);
      } else {
        // Shared or initial
        lapakBal += (j.inflow * 0.4 - j.outflow * 0.4);
        bankBal += (j.inflow * 0.6 - j.outflow * 0.6);
      }
    }
  });

  return {
    lapak: lapakBal,
    bank: bankBal,
    total: lapakBal + bankBal
  };
}

// Calculate Susut & Key Metrics According to SOP Formula
function calculateMetrics() {
  const totalNettoBayarPetani = state.purchases.reduce((sum, p) => sum + (p.nBayar || 0), 0);
  const totalBeliRp = state.purchases.reduce((sum, p) => sum + (p.total || 0), 0);
  const totalPotKasbon = state.purchases.reduce((sum, p) => sum + (p.potKasbon || 0), 0);
  const totalBayarBersih = state.purchases.reduce((sum, p) => sum + (p.bayarBersih || 0), 0);

  const totalNettoLapakKirim = state.sales.reduce((sum, s) => sum + (s.nettoLapak || s.nettoPKS || 0), 0);
  const totalNettoPks = state.sales.reduce((sum, s) => sum + (s.nettoPKS || 0), 0);
  const totalNCairPks = state.sales.reduce((sum, s) => sum + (s.nCair || 0), 0);
  const totalGrossPks = state.sales.reduce((sum, s) => sum + (s.gross || 0), 0);
  const totalPph22 = state.sales.reduce((sum, s) => sum + (s.pph22 || 0), 0);
  const totalNetCairPks = state.sales.reduce((sum, s) => sum + (s.netCair || 0), 0);

  // Biaya Muat & Uang Jalan
  const totalBiayaAngkut = state.cashJournals
    .filter(j => j.category === "Biaya Angkut" || j.category === "Upah Muat")
    .reduce((sum, j) => sum + (j.outflow || 0), 0);

  // Operasional Lapak
  const totalOperasionalLapak = state.cashJournals
    .filter(j => j.category === "Solar & Genset" || j.category === "Gaji & Operasional" || j.category === "Konsumsi & ATK" || j.category === "Perawatan Lapak" || j.category === "Operasional Lain")
    .reduce((sum, j) => sum + (j.outflow || 0), 0);

  // Formula 1: Susut Tonase Pengangkutan Sesuai SOP Dokumen:
  // Susut (%) = [ ( Total Netto Muat/Bayar Lapak − Total Netto Dibayar PKS ) ÷ Total Netto Muat/Bayar Lapak ] × 100%
  // Batas aman toleransi susut jalan + refraksi PKS adalah maksimal 1,5% – 2,5%.
  let susutPercent = 0;
  let susutKg = 0;
  let susutRp = 0;
  const avgBeli = totalNettoBayarPetani > 0 ? (totalBeliRp / totalNettoBayarPetani) : (state.settings.defaultHargaBeli || 2450);

  if (totalNettoLapakKirim > 0) {
    susutKg = Math.max(0, totalNettoLapakKirim - totalNettoPks);
    susutPercent = (susutKg / totalNettoLapakKirim) * 100;
    susutRp = susutKg * avgBeli;
  } else if (totalNettoBayarPetani > 0 && totalNCairPks > 0) {
    susutKg = Math.max(0, totalNettoBayarPetani - totalNCairPks);
    susutPercent = (susutKg / totalNettoBayarPetani) * 100;
    susutRp = susutKg * avgBeli;
  }

  // Formula 2: Laba Bersih Peron Harian (Rp) = Total Netto Cair PKS (Rp) − Total Pembelian Petani (Rp) − Biaya Muat & Angkut − Operasional Lapak
  const labaBersih = totalNetCairPks - totalBeliRp - totalBiayaAngkut - totalOperasionalLapak;

  // Margin per kg
  let avgHargaJual = totalNCairPks > 0 ? (totalGrossPks / totalNCairPks) : (state.settings.defaultHargaDO || 2780);
  let avgHargaBeli = totalNettoBayarPetani > 0 ? (totalBeliRp / totalNettoBayarPetani) : (state.settings.defaultHargaBeli || 2450);
  let spreadMargin = avgHargaJual - avgHargaBeli;

  // Sisa Stok TBS Restan di Lapak (kg)
  const restanKg = Math.max(0, totalNettoBayarPetani - totalNettoLapakKirim);

  return {
    totalNettoBayarPetani,
    totalBeliRp,
    totalPotKasbon,
    totalBayarBersih,
    totalNettoLapakKirim,
    totalNettoPks,
    totalNCairPks,
    totalGrossPks,
    totalPph22,
    totalNetCairPks,
    totalBiayaAngkut,
    totalOperasionalLapak,
    susutKg,
    susutPercent,
    susutRp,
    labaBersih,
    avgHargaJual,
    avgHargaBeli,
    spreadMargin,
    restanKg
  };
}

// Master Render All Components
function renderAll() {
  // Update header titles & SOP badges
  document.getElementById("headerPeronName").textContent = state.settings.peronName || "POOL TBS KARYA MAJU";
  document.getElementById("headerDocId").textContent = state.settings.dokumenId || "SOP-TBS-2026/01";

  const balances = calculateCurrentBalances();
  const metrics = calculateMetrics();

  // Top header stat boxes
  document.getElementById("headerKasLapak").textContent = formatRp(balances.lapak);
  document.getElementById("headerKasBank").textContent = formatRp(balances.bank);
  document.getElementById("headerRestan").textContent = formatKg(metrics.restanKg);

  // Render individual tabs
  renderDashboard(balances, metrics);
  renderPurchasesTable();
  renderSalesTable();
  renderJournalTable(balances);
  renderAnalysis(metrics);
  renderKasbonTable();
  renderReportTab(metrics);
  populateSettingsForm();
}

// 1. Dashboard Tab
function renderDashboard(balances, metrics) {
  document.getElementById("dashTotalTonasePetani").textContent = formatKg(metrics.totalNettoBayarPetani);
  document.getElementById("dashTotalBeliRp").textContent = `Total: ${formatRp(metrics.totalBeliRp)}`;

  document.getElementById("dashTotalTonasePks").textContent = formatKg(metrics.totalNCairPks);
  document.getElementById("dashTotalJualNetRp").textContent = `Net Transfer: ${formatRp(metrics.totalNetCairPks)}`;

  document.getElementById("dashKasLapak").textContent = formatRp(balances.lapak);
  document.getElementById("dashKasBank").textContent = formatRp(balances.bank);

  // Susut Card Styling according to SOP tolerance
  const susutCard = document.getElementById("dashSusutCard");
  const susutPercentEl = document.getElementById("dashSusutPercent");
  const susutBadgeEl = document.getElementById("dashSusutBadge");

  susutPercentEl.textContent = `${metrics.susutPercent.toFixed(2)}%`;
  susutCard.classList.remove("emerald", "gold", "danger");

  if (metrics.susutPercent <= 1.5) {
    susutCard.classList.add("emerald");
    susutBadgeEl.innerHTML = `<span class="badge badge-alert-green">🟢 AMAN (Sesuai SOP)</span>`;
  } else if (metrics.susutPercent <= 2.5) {
    susutCard.classList.add("gold");
    susutBadgeEl.innerHTML = `<span class="badge badge-alert-yellow">🟡 WASPADA (Batas Toleransi)</span>`;
  } else {
    susutCard.classList.add("danger");
    susutBadgeEl.innerHTML = `<span class="badge badge-alert-red">🔴 BAHAYA! Di Atas 2.5%</span>`;
  }

  // Laba Bersih
  const labaEl = document.getElementById("dashLabaBersih");
  labaEl.textContent = formatRp(metrics.labaBersih);
  if (metrics.labaBersih < 0) {
    labaEl.style.color = "#dc2626";
  } else {
    labaEl.style.color = "#059669";
  }
  document.getElementById("dashMarginPerKg").textContent = `Margin Spread: Rp ${Math.round(metrics.spreadMargin)} / kg`;

  // Mini recent purchases
  const tbody = document.getElementById("tbodyRecentPurchases");
  tbody.innerHTML = "";
  const recents = [...state.purchases].reverse().slice(0, 5);
  if (recents.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="text-center" style="padding:20px; color:#94a3b8;">Belum ada transaksi timbang hari ini.</td></tr>`;
  } else {
    recents.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${formatDateDisplay(p.date)}</td>
        <td><code>${p.nota || p.id}</code></td>
        <td><strong>${p.farmerName}</strong></td>
        <td class="text-right">${formatNumber(p.bruto)}</td>
        <td class="text-right">${formatNumber(p.tara)}</td>
        <td class="text-right font-bold">${formatNumber(p.netto)}</td>
        <td class="text-center">${p.potPercent}%</td>
        <td class="text-right" style="color:#047857; font-weight:700;">${formatNumber(p.nBayar)}</td>
        <td class="text-right">${formatNumber(p.hargaBeli)}</td>
        <td class="text-right">${formatRp(p.total)}</td>
        <td class="text-right" style="font-weight:700; color:#065f46;">${formatRp(p.bayarBersih)}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

// 2. Modul 1: Buku Pembelian TBS Petani Table
function renderPurchasesTable() {
  const tbody = document.getElementById("tbodyPurchases");
  const query = (document.getElementById("searchPembelian")?.value || "").toLowerCase();

  tbody.innerHTML = "";

  let ftBruto = 0, ftTara = 0, ftNetto = 0, ftNBayar = 0, ftTotal = 0, ftPotKasbon = 0, ftBayarBersih = 0;

  const filtered = state.purchases.filter(p => {
    return p.farmerName.toLowerCase().includes(query) || (p.nota && p.nota.toLowerCase().includes(query)) || p.id.toLowerCase().includes(query);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="13" class="text-center" style="padding:30px; color:#94a3b8;">Tidak ada data transaksi pembelian ditemukan.</td></tr>`;
  } else {
    filtered.forEach(p => {
      ftBruto += (p.bruto || 0);
      ftTara += (p.tara || 0);
      ftNetto += (p.netto || 0);
      ftNBayar += (p.nBayar || 0);
      ftTotal += (p.total || 0);
      ftPotKasbon += (p.potKasbon || 0);
      ftBayarBersih += (p.bayarBersih || 0);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${formatDateDisplay(p.date)}</td>
        <td><code>${p.nota || p.id}</code></td>
        <td><strong>${p.farmerName}</strong></td>
        <td class="text-right">${formatNumber(p.bruto)}</td>
        <td class="text-right">${formatNumber(p.tara)}</td>
        <td class="text-right" style="font-weight:700;">${formatNumber(p.netto)}</td>
        <td class="text-center"><span class="badge" style="background:#fef3c7; color:#92400e;">${p.potPercent}%</span></td>
        <td class="text-right" style="font-weight:800; color:#047857;">${formatNumber(p.nBayar)}</td>
        <td class="text-right">${formatNumber(p.hargaBeli)}</td>
        <td class="text-right font-bold">${formatRp(p.total)}</td>
        <td class="text-right" style="color:#d97706; font-weight:700;">${p.potKasbon > 0 ? formatRp(p.potKasbon) : "0"}</td>
        <td class="text-right" style="font-weight:800; color:#065f46;">${formatRp(p.bayarBersih)}</td>
        <td class="text-center" style="white-space:nowrap;">
          <button class="btn-action-icon" onclick="printSlip('${p.id}')" title="Cetak Nota Timbang">🖨️</button>
          <button class="btn-action-icon delete" onclick="deletePurchase('${p.id}')" title="Hapus Transaksi">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Update Footer totals
  document.getElementById("ftBruto").textContent = formatNumber(ftBruto);
  document.getElementById("ftTara").textContent = formatNumber(ftTara);
  document.getElementById("ftNetto").textContent = formatNumber(ftNetto);
  document.getElementById("ftNBayar").textContent = formatNumber(ftNBayar);
  document.getElementById("ftTotal").textContent = formatRp(ftTotal);
  document.getElementById("ftPotKasbon").textContent = formatRp(ftPotKasbon);
  document.getElementById("ftBayarBersih").textContent = formatRp(ftBayarBersih);
}

function deletePurchase(id) {
  if (!confirm("Apakah Anda yakin ingin menghapus transaksi pembelian ini? Saldo kas dan stok akan disesuaikan.")) return;
  const idx = state.purchases.findIndex(p => p.id === id);
  if (idx !== -1) {
    const p = state.purchases[idx];
    // Revert Kasbon if applicable
    if (p.potKasbon > 0) {
      const farmer = state.farmers.find(f => f.id === p.farmerId);
      if (farmer) {
        farmer.kasbon += p.potKasbon;
      }
    }
    // Remove related Cash Journal
    state.cashJournals = state.cashJournals.filter(j => j.refId !== id);
    state.purchases.splice(idx, 1);
    saveData();
    renderAll();
    showToast("Transaksi pembelian berhasil dihapus.");
  }
}

// 3. Modul 2: Buku Penjualan & Pengiriman PKS Table
function renderSalesTable() {
  const tbody = document.getElementById("tbodySales");
  const query = (document.getElementById("searchPenjualan")?.value || "").toLowerCase();
  const filterStatus = document.getElementById("filterStatusPenjualan")?.value || "ALL";

  tbody.innerHTML = "";

  let ftNettoPks = 0, ftNCair = 0, ftGross = 0, ftPph = 0, ftNetCair = 0;

  const filtered = state.sales.filter(s => {
    const matchQuery = s.ticketNo.toLowerCase().includes(query) || s.policeNo.toLowerCase().includes(query);
    const matchStatus = filterStatus === "ALL" || s.status === filterStatus;
    return matchQuery && matchStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12" class="text-center" style="padding:30px; color:#94a3b8;">Tidak ada data penjualan tiket PKS ditemukan.</td></tr>`;
  } else {
    filtered.forEach(s => {
      ftNettoPks += (s.nettoPKS || 0);
      ftNCair += (s.nCair || 0);
      ftGross += (s.gross || 0);
      ftPph += (s.pph22 || 0);
      ftNetCair += (s.netCair || 0);

      const tr = document.createElement("tr");
      const isCair = s.status === "Cair";

      tr.innerHTML = `
        <td>${formatDateDisplay(s.date)}</td>
        <td><code>${s.ticketNo}</code></td>
        <td><strong>${s.policeNo}</strong> <span style="font-size:11px; color:#64748b;">(${s.driverName || "-"})</span></td>
        <td class="text-right" style="font-weight:700;">${formatNumber(s.nettoPKS)}</td>
        <td class="text-center">${s.refraksiPercent}%</td>
        <td class="text-right" style="font-weight:800; color:#0369a1;">${formatNumber(s.nCair)}</td>
        <td class="text-right">${formatNumber(s.hargaDO)}</td>
        <td class="text-right font-bold">${formatRp(s.gross)}</td>
        <td class="text-right" style="color:#dc2626;">${formatRp(s.pph22)}</td>
        <td class="text-right" style="font-weight:800; color:#065f46;">${formatRp(s.netCair)}</td>
        <td class="text-center">
          <span class="badge ${isCair ? "badge-cair" : "badge-pending"}">${isCair ? "✅ Cair" : "⏳ Pending"}</span>
        </td>
        <td class="text-center" style="white-space:nowrap;">
          ${!isCair ? `<button class="btn-primary" style="padding:4px 8px; font-size:11px;" onclick="markSaleCair('${s.id}')">Cairkan ➔</button>` : `<span style="font-size:11px; color:#059669;">Lunas Bank</span>`}
          <button class="btn-action-icon delete" onclick="deleteSale('${s.id}')" title="Hapus Tiket PKS">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Footer totals
  document.getElementById("ftNettoPks").textContent = formatNumber(ftNettoPks);
  document.getElementById("ftNCair").textContent = formatNumber(ftNCair);
  document.getElementById("ftGross").textContent = formatRp(ftGross);
  document.getElementById("ftPph").textContent = formatRp(ftPph);
  document.getElementById("ftNetCair").textContent = formatRp(ftNetCair);
}

function deleteSale(id) {
  if (!confirm("Hapus tiket PKS ini? Jurnal penerimaan kas terkait juga akan dihapus.")) return;
  state.sales = state.sales.filter(s => s.id !== id);
  state.cashJournals = state.cashJournals.filter(j => j.refId !== id);
  saveData();
  renderAll();
  showToast("Tiket PKS berhasil dihapus.");
}

// 4. Modul 3: Jurnal Kas & Operasional Table
function renderJournalTable(balances) {
  const tbody = document.getElementById("tbodyJournal");
  const filterAkun = document.getElementById("filterAkunJurnal")?.value || "ALL";

  tbody.innerHTML = "";

  document.getElementById("jurnalSaldoLapak").textContent = formatRp(balances.lapak);
  document.getElementById("jurnalSaldoBank").textContent = formatRp(balances.bank);
  document.getElementById("jurnalSaldoTotal").textContent = formatRp(balances.total);

  let runningSaldo = 0;
  let ftIn = 0, ftOut = 0;

  state.cashJournals.forEach(j => {
    // Determine filter match
    let match = true;
    if (filterAkun !== "ALL") {
      if (j.account !== filterAkun && j.account !== "Kas Lapak & Bank" && j.account !== "Kas Laci & Bank") {
        match = false;
      }
    }

    // Running balance across all or filtered
    const netFlow = (j.inflow || 0) - (j.outflow || 0);
    runningSaldo += netFlow;

    if (match) {
      ftIn += (j.inflow || 0);
      ftOut += (j.outflow || 0);

      const isLapak = j.account.includes("Lapak") || j.account.includes("Laci");
      const isBank = j.account.includes("Bank");

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${formatDateDisplay(j.date)}</td>
        <td><strong>${j.description}</strong></td>
        <td><span class="badge" style="background:#f1f5f9; color:#475569;">${j.category}</span></td>
        <td>
          <span class="badge ${isLapak && !isBank ? "badge-kas-lapak" : isBank && !isLapak ? "badge-kas-bank" : "badge-cair"}">
            ${j.account}
          </span>
        </td>
        <td class="text-right font-bold" style="color:#059669;">${j.inflow > 0 ? formatRp(j.inflow) : "0"}</td>
        <td class="text-right font-bold" style="color:#dc2626;">${j.outflow > 0 ? formatRp(j.outflow) : "0"}</td>
        <td class="text-right" style="font-weight:800; color:#0f172a;">${formatRp(runningSaldo)}</td>
        <td class="text-center">
          ${j.category !== "Modal Kerja" && !j.refId.startsWith("BUY-") && !j.refId.startsWith("SALE-") ? `
            <button class="btn-action-icon delete" onclick="deleteJournal('${j.id}')" title="Hapus Jurnal">🗑️</button>
          ` : `<span style="font-size:11px; color:#94a3b8;">Sistem</span>`}
        </td>
      `;
      tbody.appendChild(tr);
    }
  });

  document.getElementById("ftTotalMasuk").textContent = formatRp(ftIn);
  document.getElementById("ftTotalKeluar").textContent = formatRp(ftOut);
  document.getElementById("ftSaldoAkhir").textContent = formatRp(runningSaldo);
}

function deleteJournal(id) {
  if (!confirm("Hapus baris jurnal ini?")) return;
  state.cashJournals = state.cashJournals.filter(j => j.id !== id);
  saveData();
  renderAll();
  showToast("Baris jurnal dihapus.");
}

// 5. Evaluasi Susut & Margin (Formula SOP)
function renderAnalysis(metrics) {
  // Susut Formula 1
  document.getElementById("evalSusutVal").textContent = `${metrics.susutPercent.toFixed(2)}%`;
  document.getElementById("evalNettoPetani").textContent = formatKg(metrics.totalNettoLapakKirim || metrics.totalNettoBayarPetani);
  document.getElementById("evalNettoPks").textContent = formatKg(metrics.totalNettoPks);
  document.getElementById("evalSusutKg").textContent = formatKg(metrics.susutKg);
  document.getElementById("evalSusutRp").textContent = formatRp(metrics.susutRp);

  const evalBadge = document.getElementById("evalSusutBadge");
  if (metrics.susutPercent <= 1.5) {
    evalBadge.className = "gauge-status badge-alert-green";
    evalBadge.textContent = "🟢 AMAN (Sangat Efisien <= 1.5%)";
  } else if (metrics.susutPercent <= 2.5) {
    evalBadge.className = "gauge-status badge-alert-yellow";
    evalBadge.textContent = "🟡 WASPADA (Batas Toleransi Normal 1.5% - 2.5%)";
  } else {
    evalBadge.className = "gauge-status badge-alert-red";
    evalBadge.textContent = "🔴 BAHAYA KEBOCORAN TONASE! (> 2.5%)";
  }

  // Laba Bersih Formula 2
  document.getElementById("plPenjualanPks").textContent = formatRp(metrics.totalNetCairPks);
  document.getElementById("plPembelianPetani").textContent = formatRp(metrics.totalBeliRp);
  document.getElementById("plBiayaAngkut").textContent = formatRp(metrics.totalBiayaAngkut);
  document.getElementById("plOperasionalLapak").textContent = formatRp(metrics.totalOperasionalLapak);

  const plLaba = document.getElementById("plLabaBersih");
  plLaba.textContent = formatRp(metrics.labaBersih);
  plLaba.style.color = metrics.labaBersih >= 0 ? "#059669" : "#dc2626";

  // Margins
  document.getElementById("avgHargaJual").textContent = `Rp ${Math.round(metrics.avgHargaJual).toLocaleString("id-ID")} / kg`;
  document.getElementById("avgHargaBeli").textContent = `Rp ${Math.round(metrics.avgHargaBeli).toLocaleString("id-ID")} / kg`;
  document.getElementById("spreadMargin").textContent = `Rp ${Math.round(metrics.spreadMargin).toLocaleString("id-ID")} / kg`;

  // Audit Truk Table
  const tbody = document.getElementById("tbodyTruckAudit");
  tbody.innerHTML = "";
  if (state.sales.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="text-center" style="padding:20px; color:#94a3b8;">Belum ada pengiriman truk tercatat.</td></tr>`;
  } else {
    state.sales.forEach(s => {
      const timbangLapak = s.nettoLapak || s.nettoPKS;
      const nettoPks = s.nettoPKS;
      const susutJalanKg = Math.max(0, timbangLapak - nettoPks);
      const susutJalanPct = timbangLapak > 0 ? (susutJalanKg / timbangLapak) * 100 : 0;

      const isSafe = susutJalanPct <= 1.5;
      const isWarn = susutJalanPct > 1.5 && susutJalanPct <= 2.5;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><code>${s.ticketNo}</code></td>
        <td><strong>${s.policeNo}</strong></td>
        <td>${s.driverName || "-"}</td>
        <td class="text-right">${formatNumber(timbangLapak)}</td>
        <td class="text-right font-bold">${formatNumber(nettoPks)}</td>
        <td class="text-right" style="color:#dc2626;">${formatNumber(susutJalanKg)}</td>
        <td class="text-center font-bold" style="color:${isSafe ? "#15803d" : isWarn ? "#b45309" : "#b91c1c"};">
          ${susutJalanPct.toFixed(2)}%
        </td>
        <td class="text-center">${s.refraksiPercent}%</td>
        <td class="text-right" style="font-weight:800; color:#0369a1;">${formatNumber(s.nCair)}</td>
        <td class="text-center">
          <span class="badge ${isSafe ? "badge-alert-green" : isWarn ? "badge-alert-yellow" : "badge-alert-red"}">
            ${isSafe ? "🟢 Aman" : isWarn ? "🟡 Waspada" : "🔴 Bahaya"}
          </span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
}

// 6. Modul Pengendalian Kasbon Petani
function renderKasbonTable() {
  const tbody = document.getElementById("tbodyFarmers");
  const query = (document.getElementById("searchKasbon")?.value || "").toLowerCase();

  tbody.innerHTML = "";
  let totalKasbonSemua = 0;

  const filtered = state.farmers.filter(f => f.name.toLowerCase().includes(query) || f.id.toLowerCase().includes(query));

  filtered.forEach(f => {
    totalKasbonSemua += (f.kasbon || 0);
    const tr = document.createElement("tr");
    const hasDebt = f.kasbon > 0;

    tr.innerHTML = `
      <td><code>${f.id}</code></td>
      <td><strong>${f.name}</strong></td>
      <td>${f.phone || "-"}</td>
      <td>${f.location || "-"}</td>
      <td class="text-right">${formatRp(f.totalKasbonHistory || f.kasbon)}</td>
      <td class="text-right font-bold" style="color:${hasDebt ? "#b91c1c" : "#059669"}; font-size:14px;">
        ${formatRp(f.kasbon)}
      </td>
      <td class="text-center">
        <span class="badge ${hasDebt ? "badge-pending" : "badge-cair"}">
          ${hasDebt ? "Belum Lunas" : "Lunas / Bersih"}
        </span>
      </td>
      <td class="text-center" style="white-space:nowrap;">
        <button class="btn-primary" style="padding:4px 10px; font-size:11px;" onclick="quickLoan('${f.id}')">➕ Kasbon Baru</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("ftTotalKasbonPetani").textContent = formatRp(totalKasbonSemua);

  // Render Kasbon Logs
  const logTbody = document.getElementById("tbodyKasbonLogs");
  logTbody.innerHTML = "";
  const recentLogs = [...state.kasbonLogs].reverse();
  if (recentLogs.length === 0) {
    logTbody.innerHTML = `<tr><td colspan="5" class="text-center" style="padding:20px; color:#94a3b8;">Belum ada riwayat mutasi kasbon.</td></tr>`;
  } else {
    recentLogs.forEach(l => {
      const isLoan = l.type === "Pinjaman";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${formatDateDisplay(l.date)}</td>
        <td><strong>${l.farmerName}</strong></td>
        <td>
          <span class="badge ${isLoan ? "badge-pending" : "badge-cair"}">
            ${isLoan ? "➕ Pinjaman Baru" : "➖ Potong Timbang"}
          </span>
        </td>
        <td class="text-right font-bold" style="color:${isLoan ? "#dc2626" : "#059669"};">
          ${formatRp(l.amount)}
        </td>
        <td>${l.notes || "-"}</td>
      `;
      logTbody.appendChild(tr);
    });
  }
}

function quickLoan(farmerId) {
  openModal("modalPinjamKasbon");
  const sel = document.getElementById("loanFarmerSelect");
  if (sel) sel.value = farmerId;
}

// 7. Laporan & SOP Executive Report
function renderReportTab(metrics) {
  document.getElementById("repPeronName").textContent = state.settings.peronName || "POOL TBS KARYA MAJU";
  document.getElementById("repPeronAddress").textContent = state.settings.alamat || "Jl. Poros Perkebunan Sawit KM 14, Riau";
  document.getElementById("repPeronContact").textContent = `Telp: ${state.settings.telepon || "0812-7654-3210"}`;
  document.getElementById("repDocId").textContent = state.settings.dokumenId || "SOP-TBS-2026/01";
  document.getElementById("repPksPartner").textContent = state.settings.pksPartner || "PT. Sawit Makmur Perkasa";

  const today = new Date();
  document.getElementById("repPrintDate").textContent = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`;

  document.getElementById("repTonaseBeli").textContent = formatKg(metrics.totalNettoBayarPetani);
  document.getElementById("repTotalBeli").textContent = formatRp(metrics.totalBeliRp);
  document.getElementById("repPotKasbon").textContent = formatRp(metrics.totalPotKasbon);
  document.getElementById("repBayarBersih").textContent = formatRp(metrics.totalBayarBersih);

  document.getElementById("repTonasePks").textContent = formatKg(metrics.totalNCairPks);
  document.getElementById("repGrossPks").textContent = formatRp(metrics.totalGrossPks);
  document.getElementById("repPph22").textContent = formatRp(metrics.totalPph22);
  document.getElementById("repNetCair").textContent = formatRp(metrics.totalNetCairPks);
  document.getElementById("repBiayaAngkut").textContent = formatRp(metrics.totalBiayaAngkut);
  document.getElementById("repLabaBersih").textContent = formatRp(metrics.labaBersih);

  document.getElementById("repSusutPercent").textContent = `${metrics.susutPercent.toFixed(2)}%`;
  const repStatus = document.getElementById("repSusutStatus");
  if (metrics.susutPercent <= 1.5) {
    repStatus.textContent = "SANGAT AMAN (<= 1.5%)";
    repStatus.style.color = "#059669";
  } else if (metrics.susutPercent <= 2.5) {
    repStatus.textContent = "WASPADA (Toleransi Normal)";
    repStatus.style.color = "#d97706";
  } else {
    repStatus.textContent = "BAHAYA (Kebocoran Tonase > 2.5%)";
    repStatus.style.color = "#dc2626";
  }
}

function setPeriodFilter(type, btn) {
  document.querySelectorAll("#tab-laporan .filter-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  showToast(`Menampilkan data periode: ${type === "TODAY" ? "Hari Ini" : "Semua Periode"}`);
}

// 8. Settings Form
function populateSettingsForm() {
  document.getElementById("cfgPeronName").value = state.settings.peronName || "";
  document.getElementById("cfgDocId").value = state.settings.dokumenId || "";
  document.getElementById("cfgPksPartner").value = state.settings.pksPartner || "";
  document.getElementById("cfgTelepon").value = state.settings.telepon || "";
  document.getElementById("cfgAlamat").value = state.settings.alamat || "";
  document.getElementById("cfgHargaBeli").value = state.settings.defaultHargaBeli || 2450;
  document.getElementById("cfgHargaDO").value = state.settings.defaultHargaDO || 2780;
  document.getElementById("cfgPphRate").value = (state.settings.pphRate ? state.settings.pphRate * 100 : 0.25).toFixed(2);
  document.getElementById("cfgSusutMax").value = state.settings.targetSusutMax || 2.5;
}

function saveSettings(e) {
  e.preventDefault();
  state.settings.peronName = document.getElementById("cfgPeronName").value.trim();
  state.settings.dokumenId = document.getElementById("cfgDocId").value.trim();
  state.settings.pksPartner = document.getElementById("cfgPksPartner").value.trim();
  state.settings.telepon = document.getElementById("cfgTelepon").value.trim();
  state.settings.alamat = document.getElementById("cfgAlamat").value.trim();
  state.settings.defaultHargaBeli = parseFloat(document.getElementById("cfgHargaBeli").value) || 2450;
  state.settings.defaultHargaDO = parseFloat(document.getElementById("cfgHargaDO").value) || 2780;
  state.settings.pphRate = (parseFloat(document.getElementById("cfgPphRate").value) || 0.25) / 100;
  state.settings.targetSusutMax = parseFloat(document.getElementById("cfgSusutMax").value) || 2.5;

  saveData();
  renderAll();
  showToast("Pengaturan profil berhasil diperbarui!");
}

function resetToSOPData() {
  if (!confirm("Apakah Anda yakin ingin memuat ulang data standar SOP (20/11/2026)? Seluruh data saat ini akan disesuaikan dengan dokumen SOP.")) return;
  state = JSON.parse(JSON.stringify(SOP_DEFAULT_DATA));
  saveData();
  renderAll();
  showToast("Data standar SOP-TBS-2026/01 berhasil dimuat!");
}

// Backup & Restore
function backupDatabase() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement("a");
  const filename = `backup-tbs-${new Date().toISOString().slice(0, 10)}.json`;
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast(`Cadangan database diunduh (${filename})`);
}

function restoreDatabase(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const parsed = JSON.parse(evt.target.result);
      if (parsed.settings && parsed.purchases) {
        state = parsed;
        saveData();
        renderAll();
        showToast("Database berhasil dipulihkan dari file JSON!");
      } else {
        alert("Format file cadangan tidak valid.");
      }
    } catch (err) {
      alert("Gagal membaca file JSON: " + err.message);
    }
  };
  reader.readAsText(file);
}

// Native Canvas Charts (Zero External Dependency)
function renderCharts() {
  renderChartTonase();
  renderChartKeuangan();
}

function renderChartTonase() {
  const canvas = document.getElementById("chartTonase");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = canvas.parentElement.clientWidth || 400;
  const h = canvas.height = canvas.parentElement.clientHeight || 240;

  ctx.clearRect(0, 0, w, h);

  const metrics = calculateMetrics();
  const data = [
    { label: "Netto Lapak (Masuk)", val: metrics.totalNettoBayarPetani, color: "#10b981" },
    { label: "Netto PKS (Pabrik)", val: metrics.totalNettoPks, color: "#0284c7" },
    { label: "Netto Cair PKS", val: metrics.totalNCairPks, color: "#065f46" },
    { label: "Susut Tonase", val: Math.max(0, metrics.susutKg), color: "#ef4444" }
  ];

  const maxVal = Math.max(...data.map(d => d.val), 1000) * 1.25;
  const barWidth = Math.min(50, (w - 100) / data.length);
  const gap = (w - (barWidth * data.length)) / (data.length + 1);

  // Baseline
  const baseH = h - 45;
  ctx.strokeStyle = "#cbd5e1";
  ctx.beginPath();
  ctx.moveTo(30, baseH);
  ctx.lineTo(w - 20, baseH);
  ctx.stroke();

  data.forEach((d, i) => {
    const x = gap + i * (barWidth + gap);
    const barH = (d.val / maxVal) * (baseH - 30);
    const y = baseH - barH;

    // Draw Bar
    ctx.fillStyle = d.color;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
    ctx.fill();

    // Value on top
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${formatNumber(d.val)} kg`, x + barWidth / 2, y - 6);

    // Label below
    ctx.fillStyle = "#64748b";
    ctx.font = "10px sans-serif";
    ctx.fillText(d.label, x + barWidth / 2, baseH + 18);
  });
}

function renderChartKeuangan() {
  const canvas = document.getElementById("chartKeuangan");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width = canvas.parentElement.clientWidth || 400;
  const h = canvas.height = canvas.parentElement.clientHeight || 240;

  ctx.clearRect(0, 0, w, h);

  const metrics = calculateMetrics();
  const data = [
    { label: "Beli TBS Petani", val: metrics.totalBeliRp, color: "#dc2626" },
    { label: "Biaya Angkut/Jalan", val: metrics.totalBiayaAngkut, color: "#f59e0b" },
    { label: "Hasil Cair PKS", val: metrics.totalNetCairPks, color: "#0284c7" },
    { label: "Laba Bersih Peron", val: Math.max(0, metrics.labaBersih), color: "#10b981" }
  ];

  const maxVal = Math.max(...data.map(d => d.val), 1000000) * 1.25;
  const barWidth = Math.min(50, (w - 100) / data.length);
  const gap = (w - (barWidth * data.length)) / (data.length + 1);

  const baseH = h - 45;
  ctx.strokeStyle = "#cbd5e1";
  ctx.beginPath();
  ctx.moveTo(30, baseH);
  ctx.lineTo(w - 20, baseH);
  ctx.stroke();

  data.forEach((d, i) => {
    const x = gap + i * (barWidth + gap);
    const barH = (d.val / maxVal) * (baseH - 30);
    const y = baseH - barH;

    ctx.fillStyle = d.color;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
    ctx.fill();

    // Value on top (in millions / thousands)
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    const shortVal = (d.val / 1000000).toFixed(1) + " Jt";
    ctx.fillText(shortVal, x + barWidth / 2, y - 6);

    ctx.fillStyle = "#64748b";
    ctx.font = "10px sans-serif";
    ctx.fillText(d.label, x + barWidth / 2, baseH + 18);
  });
}

// Polyfill for roundRect on older canvas
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    this.rect(x, y, w, h);
  };
}

// Printing Slip Functionality
function printSlip(purchaseId) {
  const p = state.purchases.find(item => item.id === purchaseId);
  if (!p) return;

  const farmer = state.farmers.find(f => f.id === p.farmerId);
  const sisaKasbon = farmer ? farmer.kasbon : 0;

  const slipContainer = document.getElementById("slipContent");
  slipContainer.innerHTML = `
    <div class="slip-header">
      <h2>${state.settings.peronName || "POOL TBS KARYA MAJU"}</h2>
      <p>${state.settings.alamat || "Riau - Indonesia"}</p>
      <p>Telp: ${state.settings.telepon || "-"}</p>
      <div style="margin-top:6px; font-weight:bold; font-size:13px;">SLIP TIMBANG TBS SAWIT</div>
      <div style="font-size:11px;">Nota: ${p.nota || p.id} | ${formatDateDisplay(p.date)}</div>
    </div>

    <div class="slip-row"><span>Nama Petani:</span><strong>${p.farmerName}</strong></div>
    <div class="slip-row"><span>No. Kendaraan:</span><span>${p.vehicleNo || "-"}</span></div>
    <div class="slip-row"><span>Jam Timbang:</span><span>${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</span></div>
    
    <div class="slip-divider"></div>

    <div class="slip-row"><span>Bruto (Timbangan Masuk):</span><strong>${formatNumber(p.bruto)} kg</strong></div>
    <div class="slip-row"><span>Tara (Timbangan Kosong):</span><strong>${formatNumber(p.tara)} kg</strong></div>
    <div class="slip-row" style="font-weight:bold;"><span>Netto Kotor Lapak:</span><strong>${formatNumber(p.netto)} kg</strong></div>
    <div class="slip-row"><span>Potongan Mutu / Sortasi:</span><span>${p.potPercent}% (${formatNumber(p.netto - p.nBayar)} kg)</span></div>
    <div class="slip-row" style="font-size:13px; font-weight:bold; color:#065f46;">
      <span>NETTO BAYAR LAPAK:</span><strong>${formatNumber(p.nBayar)} kg</strong>
    </div>

    <div class="slip-divider"></div>

    <div class="slip-row"><span>Harga Satuan:</span><span>${formatRp(p.hargaBeli)} / kg</span></div>
    <div class="slip-row"><span>Total Nilai TBS:</span><strong>${formatRp(p.total)}</strong></div>
    <div class="slip-row" style="color:#d97706;"><span>Potongan Angsuran Kasbon:</span><strong>-${formatRp(p.potKasbon)}</strong></div>
    
    <div class="slip-divider"></div>

    <div class="slip-row" style="font-size:14px; font-weight:bold; color:#000;">
      <span>DIBAYAR TUNAI:</span><strong>${formatRp(p.bayarBersih)}</strong>
    </div>
    <div class="slip-row" style="font-size:11px; margin-top:4px; color:#475569;">
      <span>Sisa Saldo Kasbon Petani:</span><span>${formatRp(sisaKasbon)}</span>
    </div>

    <div class="slip-footer">
      <p>Catatan Mutu: ${p.catatan || "Buah Matang Standar"}</p>
      <div style="display:flex; justify-content:space-between; margin-top:20px; font-size:10px;">
        <div>Petani,<br><br><br>( ${p.farmerName} )</div>
        <div>Petugas Lapak,<br><br><br>( Kasir / Timbang )</div>
      </div>
      <p style="margin-top:14px; font-size:9px;">Terima kasih atas kerja samanya. Harap simpan bukti timbang ini.</p>
    </div>
  `;

  openModal("modalPrintSlip");
}

function printReceiptDirect() {
  const content = document.getElementById("slipContent").innerHTML;
  const printArea = document.getElementById("printableArea");
  printArea.innerHTML = content;
  printArea.style.display = "block";
  window.print();
  printArea.style.display = "none";
}

// Report Printing
function printFullSOPReport() {
  const content = document.querySelector("#tab-laporan > div:last-child").innerHTML;
  const printArea = document.getElementById("printableArea");
  printArea.innerHTML = content;
  printArea.style.display = "block";
  window.print();
  printArea.style.display = "none";
}

function printPurchasesReport() {
  const table = document.getElementById("tablePembelian").outerHTML;
  const printArea = document.getElementById("printableArea");
  printArea.innerHTML = `
    <div style="font-family:sans-serif; padding:20px;">
      <h2 style="margin-bottom:4px;">${state.settings.peronName} - BUKU PEMBELIAN TBS PETANI</h2>
      <p style="font-size:12px; margin-bottom:16px;">Dokumen: ${state.settings.dokumenId} | Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}</p>
      ${table}
    </div>
  `;
  printArea.style.display = "block";
  window.print();
  printArea.style.display = "none";
}

function printSalesReport() {
  const table = document.getElementById("tablePenjualan").outerHTML;
  const printArea = document.getElementById("printableArea");
  printArea.innerHTML = `
    <div style="font-family:sans-serif; padding:20px;">
      <h2 style="margin-bottom:4px;">${state.settings.peronName} - BUKU PENJUALAN & PENGIRIMAN PKS</h2>
      <p style="font-size:12px; margin-bottom:16px;">Dokumen: ${state.settings.dokumenId} | Pabrik: ${state.settings.pksPartner}</p>
      ${table}
    </div>
  `;
  printArea.style.display = "block";
  window.print();
  printArea.style.display = "none";
}

function printJournalReport() {
  const table = document.getElementById("tableJurnal").outerHTML;
  const printArea = document.getElementById("printableArea");
  printArea.innerHTML = `
    <div style="font-family:sans-serif; padding:20px;">
      <h2 style="margin-bottom:4px;">${state.settings.peronName} - JURNAL ARUS KAS & OPERASIONAL</h2>
      <p style="font-size:12px; margin-bottom:16px;">Dokumen: ${state.settings.dokumenId} | Aturan: Kas Laci Lapak vs Kas Bank PKS</p>
      ${table}
    </div>
  `;
  printArea.style.display = "block";
  window.print();
  printArea.style.display = "none";
}

function printKasbonReport() {
  const table = document.querySelector("#tab-kasbon .data-table").outerHTML;
  const printArea = document.getElementById("printableArea");
  printArea.innerHTML = `
    <div style="font-family:sans-serif; padding:20px;">
      <h2 style="margin-bottom:4px;">${state.settings.peronName} - BUKU PENGENDALIAN KASBON PETANI</h2>
      <p style="font-size:12px; margin-bottom:16px;">Dokumen: ${state.settings.dokumenId}</p>
      ${table}
    </div>
  `;
  printArea.style.display = "block";
  window.print();
  printArea.style.display = "none";
}

// Export to CSV Functionality
function exportTableToCSV(moduleType) {
  let filename = `export-${moduleType}-${new Date().toISOString().slice(0, 10)}.csv`;
  let csvContent = "";

  if (moduleType === "pembelian") {
    csvContent = "Tanggal,Nota,Petani,Bruto(kg),Tara(kg),Netto(kg),Pot(%),N.Bayar(kg),Harga(Rp),Total(Rp),PotKasbon(Rp),BayarBersih(Rp),Catatan\n";
    state.purchases.forEach(p => {
      csvContent += `"${p.date}","${p.nota || p.id}","${p.farmerName}",${p.bruto},${p.tara},${p.netto},${p.potPercent},${p.nBayar},${p.hargaBeli},${p.total},${p.potKasbon},${p.bayarBersih},"${p.catatan || ""}"\n`;
    });
  } else if (moduleType === "penjualan") {
    csvContent = "Tanggal,NoTiketPKS,NoPolisi,Supir,PKS,NettoPKS(kg),Refraksi(%),NCair(kg),HargaDO(Rp),Gross(Rp),PPh22(Rp),NetCair(Rp),Status\n";
    state.sales.forEach(s => {
      csvContent += `"${s.date}","${s.ticketNo}","${s.policeNo}","${s.driverName || ""}","${s.pksDestination || ""}",${s.nettoPKS},${s.refraksiPercent},${s.nCair},${s.hargaDO},${s.gross},${s.pph22},${s.netCair},"${s.status}"\n`;
    });
  } else if (moduleType === "jurnal") {
    csvContent = "Tanggal,NoJurnal,Keterangan,Kategori,Akun,Masuk(Rp),Keluar(Rp)\n";
    state.cashJournals.forEach(j => {
      csvContent += `"${j.date}","${j.id}","${j.description}","${j.category}","${j.account}",${j.inflow || 0},${j.outflow || 0}\n`;
    });
  }

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  showToast(`Berhasil mengekspor ${filename}`);
}

// Sync Button Action
document.getElementById("btnSyncServer")?.addEventListener("click", () => {
  saveData().then(() => {
    loadData();
    showToast("Data berhasil disinkronkan!");
  });
});

// Auto Window Resize Listener for Charts
window.addEventListener("resize", () => {
  renderCharts();
});

// Document Initialization
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  loadData();
});
