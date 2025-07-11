import fs from 'fs';
import fetch from 'node-fetch';

const API_KEY = process.env.VITE_PAYENGINE_API_KEY;
const BASE_URL = process.env.VITE_PAYENGINE_BASE_URL || 'https://console.payengine.dev';
const LOG_FILE = 'payengine-merchant-request-log.json';

async function trackedFetch(url, options, logs, label) {
  const req = {
    label,
    url,
    method: options.method,
    headers: options.headers,
    body: options.body || null
  };
  let res = null, error = null;
  try {
    const response = await fetch(url, options);
    let data;
    try { data = await response.json(); } catch { data = null; }
    res = {
      status: response.status,
      statusText: response.statusText,
      body: data
    };
  } catch (err) {
    error = err.toString();
  }
  logs.push({ request: req, response: res, error });
  return res;
}

function sumTransactionVolumePerMonth(transactions) {
  const monthly = {};
  for (const tx of transactions) {
    if (!tx.amount || !tx.created_at) continue;
    const date = new Date(tx.created_at);
    if (isNaN(date)) continue;
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const amount = parseFloat(tx.amount);
    if (!monthly[month]) monthly[month] = 0;
    monthly[month] += isNaN(amount) ? 0 : amount;
  }
  return monthly;
}

async function fetchFeeSchedules(logs, headers) {
  const url = `${BASE_URL}/api/fee-schedules`;
  const res = await trackedFetch(url, { method: 'GET', headers }, logs, 'List All Fee Schedules');
  const schedules = res?.body?.data || [];
  console.log('Available Fee Schedules:');
  for (const sched of schedules) {
    console.log(`- ${sched.id}: ${sched.name}`);
  }
  return schedules;
}

async function tryCardTokenEndpoints(cardId, logs, headers) {
  const endpoints = [
    `/api/cards/${cardId}`,
    `/api/card/${cardId}`,
    `/api/cards/${cardId}/token`,
    `/api/token/${cardId}`
  ];
  for (const ep of endpoints) {
    const url = `${BASE_URL}${ep}`;
    const res = await trackedFetch(url, { method: 'GET', headers }, logs, `Try ${ep}`);
    console.log(`\n[${ep}] Status: ${res?.status}`);
    console.log(JSON.stringify(res?.body, null, 2));
  }
}

async function main() {
  const logs = [];
  const headers = {
    'Authorization': `Basic ${API_KEY}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-API-Version': '1.0',
    'User-Agent': 'Twill-Partner-Hub/1.0.0'
  };

  // Fetch and print all fee schedules
  await fetchFeeSchedules(logs, headers);

  // 1. List all merchants
  const merchantsRes = await trackedFetch(
    `${BASE_URL}/api/merchant`,
    { method: 'GET', headers },
    logs,
    'List All Merchants'
  );
  const merchants = merchantsRes?.body?.data || [];
  const activeMerchant = merchants.find(m => m.status === 'active');
  if (!activeMerchant) {
    logs.push({ error: 'No active merchant found.' });
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    return;
  }
  const merchantId = activeMerchant.id;

  // 2. Fetch transactions for the merchant
  const txRes = await trackedFetch(
    `${BASE_URL}/api/merchant/${merchantId}/transaction`,
    { method: 'GET', headers },
    logs,
    'Fetch Transactions for Merchant'
  );

  // Try to get card token from the first transaction if available
  const txs = txRes?.body?.data || [];
  if (txs.length > 0 && txs[0].card_id) {
    await tryCardTokenEndpoints(txs[0].card_id, logs, headers);
  }

  // 3. Fetch balance history for the merchant (USD)
  await trackedFetch(
    `${BASE_URL}/api/payouts/${merchantId}/USD/balancehistory`,
    { method: 'GET', headers },
    logs,
    'Fetch Balance History for Merchant'
  );

  // 4. Fetch payout info for the merchant (USD)
  await trackedFetch(
    `${BASE_URL}/api/payouts/${merchantId}/USD`,
    { method: 'GET', headers },
    logs,
    'Fetch Payout Info for Merchant'
  );

  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

main(); 