import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import normalizeText from '@/lib/normalizeText';

function canShowInvoice(status) {
 const s = normalizeText(String(status || ''));
 return s.includes('kargo') || s.includes('teslim');
}

function buildInvoiceHtml({ order, userName }) {
 const orderId = order.orderId || '-';
 const orderDate = order.date ? new Date(order.date).toLocaleString('tr-TR') : '-';
 const total = Number(order.total || 0).toFixed(2);
 const shipping = order.shippingAddress || {};
 const billing = order.billingAddress || order.shippingAddress || {};
 const shippingName = shipping.fullName || [shipping.firstName, shipping.lastName].filter(Boolean).join(' ') || userName || 'Müşteri';
 const shippingAddr = [shipping.address, shipping.district, shipping.city].filter(Boolean).join(', ') || order.addressSummary || '-';
 const shippingPhone = shipping.phone || '-';
 const billingName = billing.fullName || [billing.firstName, billing.lastName].filter(Boolean).join(' ') || shippingName;
 const billingAddr = [billing.address, billing.district, billing.city].filter(Boolean).join(', ') || shippingAddr;
 const billingPhone = billing.phone || shippingPhone;
 const billingSameAsShipping = billingName === shippingName && billingAddr === shippingAddr;

 const items = Array.isArray(order.items) ? order.items : [];
 const rows = items.map((it, i) => {
  const qty = Number(it.quantity || 1) || 1;
  const price = Number(it.price || 0);
  const lineTotal = (price * qty).toFixed(2);
  const rowClass = i % 2 === 0 ? 'row-even' : 'row-odd';
  return `
      <tr class="${rowClass}">
        <td class="cell-product">${escapeHtml(it.name || 'Ürün')}</td>
        <td class="cell-qty">${qty}</td>
        <td class="cell-price">${price.toFixed(2)} ₺</td>
        <td class="cell-total">${lineTotal} ₺</td>
      </tr>`;
 }).join('');

 return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Fatura - ${escapeHtml(orderId)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --brand: #4f46e5;
      --brand-dark: #4338ca;
      --text: #1f2937;
      --text-muted: #6b7280;
      --border: #e5e7eb;
      --bg: #f9fafb;
      --card: #ffffff;
      --accent: #eef2ff;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      max-width: 960px;
      margin: 0 auto;
      padding: 32px 24px;
      color: var(--text);
      background: var(--bg);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    .no-print {
      display: flex;
      gap: 10px;
      margin-bottom: 28px;
    }
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 10px;
      font-family: inherit;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .btn-primary { background: var(--brand); color: #fff; }
    .btn-primary:hover { background: var(--brand-dark); }
    .btn-secondary { background: #fff; color: var(--text-muted); border: 1px solid var(--border); }
    .btn-secondary:hover { background: var(--bg); }
    .invoice-card {
      background: var(--card);
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      overflow: hidden;
    }
    .invoice-header {
      background: linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%);
      color: #fff;
      padding: 28px 32px;
    }
    .invoice-header h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .invoice-header .meta {
      margin-top: 8px;
      font-size: 0.9rem;
      opacity: 0.95;
    }
    .invoice-body { padding: 28px 32px; }
    .two-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 28px;
    }
    @media (max-width: 520px) { .two-cols { grid-template-columns: 1fr; } }
    .block label {
      display: block;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      margin-bottom: 6px;
    }
    .block p { margin: 0; font-size: 0.95rem; color: var(--text); }
    .block p strong { font-weight: 600; }
    .table-wrap {
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }
    .invoice-table thead {
      background: var(--accent);
    }
    .invoice-table th {
      padding: 14px 16px;
      text-align: left;
      font-weight: 600;
      color: var(--text);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .invoice-table th:nth-child(2) { text-align: center; }
    .invoice-table th:nth-child(3), .invoice-table th:nth-child(4) { text-align: right; }
    .invoice-table td { padding: 14px 16px; border-top: 1px solid var(--border); }
    .invoice-table .row-odd { background: #fafafa; }
    .invoice-table .cell-product { font-weight: 500; }
    .invoice-table .cell-qty { text-align: center; color: var(--text-muted); }
    .invoice-table .cell-price, .invoice-table .cell-total { text-align: right; font-variant-numeric: tabular-nums; }
    .invoice-table tfoot td {
      background: var(--accent);
      border-top: 2px solid var(--border);
      padding: 16px;
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--text);
    }
    .invoice-table tfoot td:first-of-type { text-align: right; }
    .invoice-footer {
      padding: 20px 32px;
      background: var(--bg);
      border-top: 1px solid var(--border);
      font-size: 0.8rem;
      color: var(--text-muted);
      text-align: center;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .no-print { display: none !important; }
      .invoice-card { box-shadow: none; border: 1px solid #e5e7eb; }
      .invoice-header { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button type="button" class="btn btn-primary" onclick="window.print()">Yazdır</button>
    <button type="button" class="btn btn-secondary" onclick="window.close()">Kapat</button>
  </div>
  <div class="invoice-card">
    <div class="invoice-header">
      <h1>FATURA</h1>
      <div class="meta">Sipariş No: ${escapeHtml(orderId)} · ${escapeHtml(orderDate)}</div>
    </div>
    <div class="invoice-body">
      <div class="two-cols">
        <div class="block">
          <label>Alıcı / Teslimat adresi</label>
          <p><strong>${escapeHtml(shippingName)}</strong><br>${escapeHtml(shippingAddr)}<br>Tel: ${escapeHtml(shippingPhone)}</p>
        </div>
        <div class="block">
          <label>Fatura adresi</label>
          <p><strong>${escapeHtml(billingName)}</strong><br>${escapeHtml(billingAddr)}<br>Tel: ${escapeHtml(billingPhone)}${billingSameAsShipping ? '<br><span style="font-size:0.85rem;color:var(--text-muted);">Teslimat adresi ile aynı</span>' : ''}</p>
        </div>
      </div>
      <div class="table-wrap">
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Adet</th>
              <th>Birim Fiyat</th>
              <th>Toplam</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr>
              <td colspan="3">Genel Toplam</td>
              <td>${total} ₺</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <div class="invoice-footer">
      Bu belge elektronik fatura yerine geçmez. Yazıcı Ticaret · Tüm hakları saklıdır.
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str) {
 if (str == null) return '';
 const s = String(str);
 return s
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
}

export async function GET(request, { params }) {
 try {
  await dbConnect();
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('user-session');
  if (!sessionCookie?.value) {
   return new NextResponse('<html><body><p>Oturum bulunamadı. Lütfen giriş yapın.</p></body></html>', {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
   });
  }
  let session;
  try {
   session = JSON.parse(sessionCookie.value);
  } catch {
   return new NextResponse('<html><body><p>Oturum hatası.</p></body></html>', {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
   });
  }
  if (!session?.id) {
   return new NextResponse('<html><body><p>Yetkisiz.</p></body></html>', {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
   });
  }

  const resolvedParams = await params;
  const orderId = resolvedParams.orderId;
  if (!orderId) {
   return new NextResponse('<html><body><p>Sipariş bulunamadı.</p></body></html>', {
    status: 400,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
   });
  }

  const user = await User.findById(session.id);
  if (!user) {
   return new NextResponse('<html><body><p>Kullanıcı bulunamadı.</p></body></html>', {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
   });
  }

  const order = (user.orders || []).find((o) => o.orderId === String(orderId));
  if (!order) {
   return new NextResponse('<html><body><p>Sipariş bulunamadı.</p></body></html>', {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
   });
  }

  if (!canShowInvoice(order.status)) {
   return new NextResponse('<html><body><p>Bu sipariş için fatura henüz görüntülenemez. Sipariş durumu Kargoya Verildi veya Teslim Edildi olduğunda fatura açılır.</p></body></html>', {
    status: 403,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
   });
  }

  const html = buildInvoiceHtml({ order, userName: user.name });
  return new NextResponse(html, {
   status: 200,
   headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
 } catch (error) {
  return new NextResponse('<html><body><p>Fatura yüklenirken hata oluştu.</p></body></html>', {
   status: 500,
   headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
 }
}
