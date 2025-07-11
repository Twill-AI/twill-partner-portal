import fs from 'fs';
import fetch from 'node-fetch';

const API_KEY = process.env.VITE_PAYENGINE_API_KEY;
const BASE_URL = process.env.VITE_PAYENGINE_BASE_URL || 'https://console.payengine.dev';
const LOG_FILE = 'create-merchant-log.json';

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
  } catch (e) {
    error = e.toString();
  }
  logs.push({ request: req, response: res, error });
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  return res;
}

async function main() {
  const logs = [];
  const url = `${BASE_URL}/api/merchant`;
  const body = {
    name: 'Test Merchant',
    email: 'testmerchant@example.com',
    external_id: 'test_external_id',
    country: 'US',
    feeschedule_id: 'default', // Replace with a real feeschedule_id if required
    business_details: {
      legal_name: 'Test Merchant LLC',
      dba_name: 'Test Merchant',
      address: {
        line1: '123 Test St',
        city: 'Testville',
        state: 'CA',
        postal_code: '90001',
        country: 'US'
      },
      phone: '+1234567890',
      website: 'https://testmerchant.com',
      tax_id: '12-3456789',
      business_type: 'corporation'
    },
    owner_officers: [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'owner@example.com',
        phone: '+1234567890',
        address: {
          line1: '123 Test St',
          city: 'Testville',
          state: 'CA',
          postal_code: '90001',
          country: 'US'
        },
        dob: '1980-01-01',
        ssn_last4: '1234',
        title: 'CEO',
        ownership: 100
      }
    ]
  };

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${API_KEY}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-API-Version': '1.0',
      'User-Agent': 'Twill-Partner-Hub/1.0.0'
    },
    body: JSON.stringify(body)
  };

  await trackedFetch(url, options, logs, 'Create Merchant');
}

main(); 