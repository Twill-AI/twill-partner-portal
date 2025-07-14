import fs from 'fs';
import fetch from 'node-fetch';

/*
  Script: luqra-api-request.js
  Purpose:
    1. Harvest all merchant IDs (MIDs) via the one safe, read-only POST search
       endpoint `/api/v1/applications/boarded` (handles pagination).
    2. For each MID, perform **GET-only** Luqra reporting endpoints that depend
       on `mid__eq`.
    3. Log every request/response pair (or error) to `luqra-api-request-log.json`.
  Note: This file deliberately issues **one** POST request that acts like a
        read-only search to obtain MIDs; all subsequent calls are GET.
  Inspired by `docs/payengine-merchant-request.js`.
*/

// -------------------- CONFIG --------------------
// IMPORTANT: Set LUQRA_API_KEY in your environment (.env or process)
const API_KEY = process.env.LUQRA_API_KEY;
if (!API_KEY) {
  throw new Error('LUQRA_API_KEY is not set in the environment. Please add it to your .env file.');
}

const BASE_URL = 'https://api.luqra.com';

// Some Luqra GET endpoints require parameters (mid, statementId, etc.).
// Define them here or provide via env-vars.
// Date range for statements (ISO strings)
const STATEMENT_FROM = process.env.LUQRA_STATEMENT_FROM || '2019-01-01T00:00:00.000Z';
const STATEMENT_TO   = process.env.LUQRA_STATEMENT_TO   || new Date().toISOString();
// Number of results per page for MID harvest
const MID_PAGE_SIZE = parseInt(process.env.LUQRA_MID_PAGE_SIZE || '50', 10);

// Output log file
const LOG_FILE = 'luqra-api-request-log.json';

// -------------------- UTILITIES --------------------
async function trackedFetch(url, options, logs, label) {
  const req = { label, url, method: options.method, headers: options.headers };
  let resObj = null, error = null;

  try {
    const response = await fetch(url, options);
    let body;
    try {
      body = await response.json();
    } catch (_) {
      body = await response.text();
    }
    resObj = {
      status: response.status,
      statusText: response.statusText,
      body
    };
  } catch (err) {
    error = err.toString();
  }

  logs.push({ request: req, response: resObj, error });
  return resObj;
}

function buildQuery(params) {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

// -------------------- Helper: Harvest all MIDs --------------------
async function harvestMids(headers, logs) {
  const mids = new Set();
  let page = 1;
  while (true) {
    const label = `Harvest MIDs page ${page}`;
    const url = `${BASE_URL}/api/v1/applications/boarded?` +
      buildQuery({ page, count: MID_PAGE_SIZE });
    const body = {
      startDateTime: STATEMENT_FROM,
      endDateTime: STATEMENT_TO
    };
    const res = await trackedFetch(
      url,
      { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
      logs,
      label
    );
    const dataArr = res?.body?.data?.data || [];
    dataArr.forEach(item => item.mid && mids.add(item.mid));
    if (dataArr.length < MID_PAGE_SIZE) break; // last page reached
    page += 1;
  }
  return Array.from(mids);
}

// -------------------- MAIN --------------------
(async function main() {
  const logs = [];
  const headers = {
    'x-api-key': API_KEY,
    'Accept': 'application/json, text/plain, */*'
  };

  // 1. Get all MIDs
  const mids = await harvestMids(headers, logs);
  if (mids.length === 0) {
    console.error('No MIDs found – cannot proceed with report queries.');
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    return;
  }
  console.log(`Found ${mids.length} MID(s):`, mids.join(', '));

  // 2. For each MID, perform GET endpoints
  for (const mid of mids) {
    // 2.1 Statements list
    const stmtRes = await trackedFetch(
      `${BASE_URL}/api/v1/reports/statements?` +
        buildQuery({
          mid__eq: mid,
          statementDate__between: `${STATEMENT_FROM},${STATEMENT_TO}`
        }),
      { method: 'GET', headers },
      logs,
      `Statements List for ${mid}`
    );

    // 2.2 Statement view URL (first ID if available)
    const firstId = stmtRes?.body?.data?.[0]?.id;
    if (firstId) {
      await trackedFetch(
        `${BASE_URL}/api/v1/reports/statements/viewUrl?` +
          buildQuery({ mid__eq: mid, statementId__eq: firstId }),
        { method: 'GET', headers },
        logs,
        `Statement View URL for ${mid}`
      );
    }

    // 2.3 Batches list
    await trackedFetch(
      `${BASE_URL}/api/v1/reports/batches?` +
        buildQuery({ page: 1, count: 20, order_by: 'statementDate', mid__eq: mid }),
      { method: 'GET', headers },
      logs,
      `Batches for ${mid}`
    );

    // 2.4 Deposits total
    await trackedFetch(
      `${BASE_URL}/api/v1/reports/deposits/total?` +
        buildQuery({ page: 1, count: 50, order_by: 'depositDate', mid__eq: mid }),
      { method: 'GET', headers },
      logs,
      `Deposits Total for ${mid}`
    );

    // 2.5 Chargebacks
    await trackedFetch(
      `${BASE_URL}/api/v1/reports/chargebacks?` +
        buildQuery({ page: 1, count: 20, order_by: '-dateLoaded', mid__eq: mid }),
      { method: 'GET', headers },
      logs,
      `Chargebacks for ${mid}`
    );

    // 2.6 Transactions (single page, no pagination per user request)
    await trackedFetch(
      `${BASE_URL}/api/v1/reports/transactions?` +
        buildQuery({
          page: 1,
          count: 20,
          order_by: '-originalTransactionDate',
          mid__eq: mid
        }),
      { method: 'GET', headers },
      logs,
      `Transactions for ${mid}`
    );
  }

  // 3. Persist log
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  console.log(`Logged ${logs.length} request(s) to ${LOG_FILE}`);
})();
