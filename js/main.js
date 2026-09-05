/* =========================================================
   Popozuda — Kit Lisinha + Clarinha
   ========================================================= */

/* -----------------------------------------------------------
   1. CONFIGURACAO DO BACKEND DE PAGAMENTO
   Troque pela URL pública do backend depois de publicá-lo no
   Railway (sem barra no final). Ex.: "https://popozuda-pinpay-api-production.up.railway.app"
   Enquanto começar com "INSERIR_", o botão de compra mostra um
   aviso pedindo para falar pelo WhatsApp em vez de tentar chamar
   uma API que ainda não existe.
   ----------------------------------------------------------- */
const API_BASE = "https://api-lisinha-e-clarinha-production.up.railway.app";

/* -----------------------------------------------------------
   2. DADOS DOS KITS (unica fonte de dados)
   ----------------------------------------------------------- */
const KITS = {
  kit1: {
    key: "kit1",
    badge: null,
    variant: "Kit 1 Lisinha + 1 Clarinha · 2 frascos no total",
    image: "assets/images/kit-1.png",
    imageAlt: "Kit Popozuda com 1 frasco de Lisinha e 1 frasco de Clarinha",
    ref: "R$ 179,80",
    promo: "R$ 59,90",
    save: "Economia de R$ 119,90",
    perDupla: null,
    ctaText: "COMPRAR KIT 1 + 1 POR R$ 59,90",
    buybarLabel: "Kit Inicial 1 + 1"
  },
  kit3: {
    key: "kit3",
    badge: "MAIS VENDIDO",
    variant: "Kit 3 Lisinha + 3 Clarinha · 6 frascos no total",
    image: "assets/images/kit-3.png",
    imageAlt: "Kit Popozuda com 3 frascos de Lisinha e 3 frascos de Clarinha",
    ref: "R$ 539,40",
    promo: "R$ 119,90",
    save: "Economia de R$ 419,50",
    perDupla: "R$ 39,97 por dupla Lisinha + Clarinha",
    ctaText: "COMPRAR KIT 3 + 3 POR R$ 119,90",
    buybarLabel: "Kit 3 + 3"
  },
  kit5: {
    key: "kit5",
    badge: "MAIOR ECONOMIA",
    variant: "Kit 5 Lisinha + 5 Clarinha · 10 frascos no total",
    image: "assets/images/kit-5.png",
    imageAlt: "Kit Popozuda com 5 frascos de Lisinha e 5 frascos de Clarinha",
    ref: "R$ 899,00",
    promo: "R$ 179,90",
    save: "Economia de R$ 719,10",
    perDupla: "R$ 35,98 por dupla Lisinha + Clarinha",
    ctaText: "COMPRAR KIT 5 + 5 POR R$ 179,90",
    buybarLabel: "Kit 5 + 5"
  }
};

const DEFAULT_KIT = "kit3";

/* -----------------------------------------------------------
   3. SELETOR DE KITS (galeria + cards, tudo no hero)
   ----------------------------------------------------------- */
(function initProduct(){
  const el = (id) => document.getElementById(id);

  const heroImage   = el("heroImage");
  const heroBadge   = el("heroBadge");
  const heroVariant = el("heroVariant");
  const heroRef     = el("heroRef");
  const heroPromo   = el("heroPromo");
  const heroSave    = el("heroSave");
  const heroDupla   = el("heroDupla");

  const buyBtn      = el("buyBtn");
  const buybar      = el("buybar");
  const buybarBtn   = el("buybarBtn");
  const buybarLabel = el("buybarLabel");
  const buybarPromo = el("buybarPromo");
  const buybarRef   = el("buybarRef");

  const cards  = Array.from(document.querySelectorAll(".kit-card"));
  const thumbs = Array.from(document.querySelectorAll(".product__thumb"));

  if (!buyBtn || (!cards.length && !thumbs.length)) return;

  let currentKey = DEFAULT_KIT;

  function applyKit(key){
    const kit = KITS[key];
    if (!kit) return;
    currentKey = key;

    /* cards */
    cards.forEach(c => {
      const active = c.dataset.kit === key;
      c.classList.toggle("is-selected", active);
      const input = c.querySelector("input");
      if (input){ input.checked = active; input.setAttribute("aria-checked", String(active)); }
    });

    /* miniaturas */
    thumbs.forEach(t => {
      const active = t.dataset.kit === key;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
    });

    /* imagem principal */
    if (heroImage){ heroImage.src = kit.image; heroImage.alt = kit.imageAlt; }

    /* selo */
    if (heroBadge){
      heroBadge.textContent = kit.badge || "";
      heroBadge.hidden = !kit.badge;
      heroBadge.classList.toggle("product__badge--save", kit.badge === "MAIOR ECONOMIA");
    }

    /* nome / variante */
    if (heroVariant) heroVariant.textContent = kit.variant;

    /* preco */
    if (heroRef)   heroRef.textContent   = kit.ref;
    if (heroPromo) heroPromo.textContent = kit.promo;
    if (heroSave)  heroSave.textContent  = kit.save;
    if (heroDupla){
      heroDupla.textContent = kit.perDupla || "";
      heroDupla.hidden = !kit.perDupla;
    }

    /* botao de compra */
    buyBtn.textContent = kit.ctaText;

    /* barra fixa (mobile) */
    if (buybar){
      buybarLabel.textContent = kit.buybarLabel;
      buybarPromo.textContent = kit.promo;
      buybarRef.textContent = kit.ref;
    }
  }

  /* selecao por card */
  cards.forEach(c => {
    c.addEventListener("click", e => {
      if (e.target.tagName !== "INPUT") applyKit(c.dataset.kit);
    });
    const input = c.querySelector("input");
    if (input) input.addEventListener("change", () => applyKit(c.dataset.kit));
  });

  /* selecao por miniatura */
  thumbs.forEach(t => t.addEventListener("click", () => applyKit(t.dataset.kit)));

  /* navegacao por setas no radiogroup */
  const group = document.querySelector(".kit-cards");
  if (group){
    group.addEventListener("keydown", e => {
      if (!["ArrowDown","ArrowRight","ArrowUp","ArrowLeft"].includes(e.key)) return;
      e.preventDefault();
      const idx = cards.findIndex(c => c.dataset.kit === currentKey);
      const dir = (e.key === "ArrowDown" || e.key === "ArrowRight") ? 1 : -1;
      const next = cards[(idx + dir + cards.length) % cards.length];
      applyKit(next.dataset.kit);
      const ni = next.querySelector("input");
      if (ni) ni.focus();
    });
  }

  applyKit(DEFAULT_KIT);

  /* -------- barra fixa: mostrar depois do hero, esconder perto do rodape -------- */
  if (buybar){
    const product = document.querySelector(".product");
    const footer = document.querySelector(".site-footer");
    function toggleBuybar(){
      if (window.innerWidth >= 960){ buybar.hidden = true; return; }
      const y = window.scrollY;
      const pastHero = product ? y > (product.offsetTop + product.offsetHeight - 120) : y > 500;
      const nearFooter = footer ? (y + window.innerHeight > footer.offsetTop + 30) : false;
      buybar.hidden = !(pastHero && !nearFooter);
    }
    window.addEventListener("scroll", toggleBuybar, { passive: true });
    window.addEventListener("resize", toggleBuybar);
    toggleBuybar();
  }
})();

/* -----------------------------------------------------------
   4. CHECKOUT PIX (PinPay) — modal com formulário + QR code
   Único ponto de contato com o backend: POST {API_BASE}/api/pix
   e GET {API_BASE}/api/pix/:id/status. Nenhum valor é decidido
   aqui — o preço cobrado é sempre o que o servidor define para
   o kit escolhido.
   ----------------------------------------------------------- */
(function initCheckout(){
  const modal      = document.getElementById("checkoutModal");
  const form       = document.getElementById("checkoutForm");
  const result     = document.getElementById("checkoutResult");
  const kitImageEl = document.getElementById("checkoutKitImage");
  const kitNameEl  = document.getElementById("checkoutKitName");
  const kitPriceEl = document.getElementById("checkoutKitPrice");
  const errorEl    = document.getElementById("checkoutError");
  const submitBtn  = document.getElementById("checkoutSubmit");
  const statusEl   = document.getElementById("checkoutStatus");
  const pixCodeEl  = document.getElementById("checkoutPixCode");
  const amountEl   = document.getElementById("checkoutResultAmount");
  const qrImg      = document.getElementById("checkoutQrImg");
  const qrBox      = document.querySelector(".checkout-result__qrbox");
  const copyBtn    = document.getElementById("checkoutCopyBtn");
  const retryBtn   = document.getElementById("checkoutRetryBtn");
  const buyBtn     = document.getElementById("buyBtn");
  const buybarBtn  = document.getElementById("buybarBtn");

  if (!modal || !form) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const POLL_MS = 4000;
  const MAX_POLLS = 450; // ~30 min, cobre a validade padrão do PIX (expires_in: 3600s) com folga de sobra

  let pollTimer = null;
  let pollCount = 0;
  let currentPixCode = "";
  let lastFocus = null;

  const isApiConfigured = () => API_BASE && API_BASE.indexOf("INSERIR_") !== 0;

  // Formata centavos (inteiros, sempre exatos, sem arredondamento) no mesmo
  // padrão usado na landing page. O valor exibido aqui vem sempre da resposta
  // do backend — a mesma fonte que decide quanto é cobrado de verdade.
  function formatBRL(cents){
    const value = (Number(cents) || 0) / 100;
    return "R$ " + value.toFixed(2).replace(".", ",");
  }

  function getCurrentKit(){
    const active = document.querySelector(".kit-card.is-selected");
    return (active && active.dataset.kit) || DEFAULT_KIT;
  }

  function showError(message){
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function stopPolling(){
    if (pollTimer){ clearInterval(pollTimer); pollTimer = null; }
    pollCount = 0;
  }

  function setStatus(text, kind){
    statusEl.textContent = text;
    statusEl.classList.remove("is-paid", "is-failed");
    if (kind) statusEl.classList.add(kind);
  }

  function resetToForm(){
    form.reset();
    form.hidden = false;
    result.hidden = true;
    errorEl.hidden = true;
    errorEl.textContent = "";
    submitBtn.disabled = false;
    submitBtn.textContent = "Gerar PIX e finalizar compra";
    retryBtn.hidden = true;
    qrImg.removeAttribute("src");
    if (qrBox) qrBox.open = false;
    pixCodeEl.textContent = "";
    currentPixCode = "";
    stopPolling();
  }

  function openModal(){
    const kit = KITS[getCurrentKit()];
    lastFocus = document.activeElement;
    if (kitImageEl){ kitImageEl.src = kit.image; kitImageEl.alt = kit.imageAlt; }
    kitNameEl.textContent = kit.variant;
    kitPriceEl.textContent = kit.promo;
    amountEl.textContent = kit.promo;
    resetToForm();
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const firstField = form.querySelector("input");
    if (firstField) firstField.focus();
  }

  function closeModal(){
    modal.hidden = true;
    document.body.style.overflow = "";
    stopPolling();
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  async function pollStatus(orderId){
    pollCount += 1;
    if (pollCount > MAX_POLLS){
      stopPolling();
      return;
    }
    try{
      const res = await fetch(`${API_BASE}/api/pix/${orderId}/status`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "paid"){
        setStatus("Pagamento confirmado! Obrigada pela compra. 💛", "is-paid");
        stopPolling();
      } else if (["failed", "expired", "cancelled", "refunded"].includes(data.status)){
        setStatus("Esse PIX não foi concluído. Gere um novo código para continuar.", "is-failed");
        stopPolling();
        retryBtn.hidden = false;
      }
    }catch(e){
      /* rede instável: tenta de novo no próximo ciclo, sem travar a tela */
    }
  }

  function startPolling(orderId){
    stopPolling();
    pollTimer = setInterval(() => pollStatus(orderId), POLL_MS);
  }

  async function submitOrder(e){
    e.preventDefault();
    errorEl.hidden = true;

    if (!isApiConfigured()){
      showError("Pagamento online ainda não está disponível. Fale com a gente pelo WhatsApp (link no rodapé) para finalizar sua compra.");
      return;
    }

    const fd = new FormData(form);
    const payload = {
      kit: getCurrentKit(),
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      document: String(fd.get("document") || "").replace(/\D/g, ""),
      phone: String(fd.get("phone") || "").replace(/\D/g, "")
    };

    if (payload.name.length < 3) return showError("Informe seu nome completo.");
    if (!EMAIL_RE.test(payload.email)) return showError("Informe um e-mail válido.");
    if (!/^\d{11}$/.test(payload.document)) return showError("Informe um CPF válido (11 números, sem pontos ou traço).");

    submitBtn.disabled = true;
    submitBtn.textContent = "Gerando PIX...";

    let res, data;
    try{
      res = await fetch(`${API_BASE}/api/pix`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      data = await res.json().catch(() => ({}));
    }catch(err){
      submitBtn.disabled = false;
      submitBtn.textContent = "Gerar PIX";
      showError("Não foi possível conectar ao servidor de pagamento. Verifique sua internet e tente de novo.");
      return;
    }

    if (!res.ok){
      submitBtn.disabled = false;
      submitBtn.textContent = "Gerar PIX";
      showError(data.message || "Não foi possível gerar o PIX agora. Tente novamente em instantes.");
      return;
    }

    form.hidden = true;
    result.hidden = false;
    currentPixCode = data.qr_code || "";
    pixCodeEl.textContent = currentPixCode;
    if (data.qr_code_url) qrImg.src = data.qr_code_url;
    // O valor exibido aqui vem sempre do backend (fonte oficial do preço
    // cobrado), nunca recalculado no navegador — garante que o cliente vê
    // exatamente o mesmo valor que será debitado, sem arredondamento.
    if (typeof data.amount === "number") amountEl.textContent = formatBRL(data.amount);
    setStatus("Aguardando pagamento…", null);
    startPolling(data.order_id);
  }

  if (copyBtn){
    copyBtn.addEventListener("click", async () => {
      if (!currentPixCode) return;
      try{
        await navigator.clipboard.writeText(currentPixCode);
        const original = copyBtn.textContent;
        copyBtn.textContent = "Copiado!";
        setTimeout(() => { copyBtn.textContent = original; }, 2000);
      }catch(e){
        /* clipboard indisponível (permissão, HTTP sem TLS etc.) — o QR continua visível */
      }
    });
  }

  if (retryBtn) retryBtn.addEventListener("click", resetToForm);
  form.addEventListener("submit", submitOrder);
  modal.querySelectorAll("[data-close]").forEach(elx => elx.addEventListener("click", closeModal));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  if (buyBtn) buyBtn.addEventListener("click", openModal);
  if (buybarBtn) buybarBtn.addEventListener("click", openModal);
})();

/* -----------------------------------------------------------
   5. ROLAGEM SUAVE PARA LINKS INTERNOS
   ----------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const id = link.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", id);
  });
});

/* -----------------------------------------------------------
   6. LAZY-LOAD de reforco (imagens abaixo da dobra)
   ----------------------------------------------------------- */
document.querySelectorAll('img:not([loading])').forEach(img => {
  if (!img.hasAttribute("fetchpriority")) img.loading = "lazy";
});
