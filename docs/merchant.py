import asyncio
import json
import os
from datetime import datetime
from typing import Any, Dict, List, Optional

import aiohttp
from dotenv import load_dotenv
from collections import defaultdict

# Load environment variables
load_dotenv()


class PayEngineMerchantAPI:
    """Class to handle PayEngine API calls for merchant data"""

    def __init__(self, base_url: str, api_key: Optional[str] = None):
        """
        Initialize the PayEngine API client

        Args:
            base_url: The base URL of the PayEngine API
            api_key: Optional API key for authentication
        """
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.session = None

    async def __aenter__(self):
        """Async context manager entry"""
        # Handle PAYENGINE_BASE_URL that may or may not include protocol
        if not self.base_url.startswith("http"):
            self.base_url = f"https://{self.base_url}"

        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

        # Use Basic authentication like the existing code
        if self.api_key:
            headers["Authorization"] = f"Basic {self.api_key}"

        self.session = aiohttp.ClientSession(headers=headers)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()

    async def get_merchants(self) -> List[Dict[str, Any]]:
        """
        Get all merchants from the PayEngine API

        Returns:
            List of merchant data
        """
        url = f"{self.base_url}/api/merchant"

        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    # Expecting a dict with a 'data' key
                    if (
                        isinstance(data, dict)
                        and "data" in data
                        and isinstance(data["data"], list)
                    ):
                        print(
                            f"Successfully retrieved {len(data['data'])} merchants"
                        )
                        return data["data"]
                    else:
                        print(f"Unexpected response format: {data}")
                        return []
                else:
                    print(
                        f"Error getting merchants: {response.status} - {await response.text()}"
                    )
                    return []
        except Exception as e:
            print(f"Exception while getting merchants: {e}")
            return []

    async def get_merchant_details(self, merchant_id: str) -> Dict[str, Any]:
        """
        Get detailed information for a specific merchant

        Args:
            merchant_id: The merchant ID to get details for

        Returns:
            Merchant details data
        """
        url = f"{self.base_url}/api/merchant/{merchant_id}"

        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    print(
                        f"Successfully retrieved details for merchant {merchant_id}"
                    )
                    return data
                else:
                    print(
                        f"Error getting merchant {merchant_id} details: {response.status} - {await response.text()}"
                    )
                    return {
                        "error": f"HTTP {response.status}",
                        "merchant_id": merchant_id,
                    }
        except Exception as e:
            print(
                f"Exception while getting merchant {merchant_id} details: {e}"
            )
            return {"error": str(e), "merchant_id": merchant_id}

    async def get_merchant_documents(self, merchant_id: str) -> Dict[str, Any]:
        """
        Get document information for a specific merchant

        Args:
            merchant_id: The merchant ID to get documents for

        Returns:
            Merchant documents data
        """
        url = f"{self.base_url}/api/merchant/{merchant_id}/document"

        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    print(
                        f"Successfully retrieved documents for merchant {merchant_id}"
                    )
                    return data
                else:
                    print(
                        f"Error getting merchant {merchant_id} documents: {response.status} - {await response.text()}"
                    )
                    return {
                        "error": f"HTTP {response.status}",
                        "merchant_id": merchant_id,
                    }
        except Exception as e:
            print(
                f"Exception while getting merchant {merchant_id} documents: {e}"
            )
            return {"error": str(e), "merchant_id": merchant_id}

    async def get_merchant_bank_accounts(
        self, merchant_id: str
    ) -> Dict[str, Any]:
        """
        Get bank account information for a specific merchant

        Args:
            merchant_id: The merchant ID to get bank accounts for

        Returns:
            Merchant bank accounts data
        """
        url = f"{self.base_url}/api/v2/merchant/{merchant_id}/bank-accounts"

        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    print(
                        f"Successfully retrieved bank accounts for merchant {merchant_id}"
                    )
                    return data
                else:
                    print(
                        f"Error getting merchant {merchant_id} bank accounts: {response.status} - {await response.text()}"
                    )
                    return {
                        "error": f"HTTP {response.status}",
                        "merchant_id": merchant_id,
                    }
        except Exception as e:
            print(
                f"Exception while getting merchant {merchant_id} bank accounts: {e}"
            )
            return {"error": str(e), "merchant_id": merchant_id}

    async def get_merchant_devices(self, merchant_id: str) -> Dict[str, Any]:
        """
        Get devices information for a specific merchant

        Args:
            merchant_id: The merchant ID to get devices for

        Returns:
            Merchant devices data
        """
        url = f"{self.base_url}/api/merchant/{merchant_id}/devices"

        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    print(
                        f"Successfully retrieved devices for merchant {merchant_id}"
                    )
                    return data
                else:
                    print(
                        f"Error getting merchant {merchant_id} devices: {response.status} - {await response.text()}"
                    )
                    return {
                        "error": f"HTTP {response.status}",
                        "merchant_id": merchant_id,
                    }
        except Exception as e:
            print(
                f"Exception while getting merchant {merchant_id} devices: {e}"
            )
            return {"error": str(e), "merchant_id": merchant_id}

    async def get_merchant_payment_links(
        self, merchant_id: str
    ) -> Dict[str, Any]:
        """
        Get payment links information for a specific merchant

        Args:
            merchant_id: The merchant ID to get payment links for

        Returns:
            Merchant payment links data
        """
        url = f"{self.base_url}/api/merchant/{merchant_id}/payment-link"

        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    print(
                        f"Successfully retrieved payment links for merchant {merchant_id}"
                    )
                    return data
                else:
                    print(
                        f"Error getting merchant {merchant_id} payment links: {response.status} - {await response.text()}"
                    )
                    return {
                        "error": f"HTTP {response.status}",
                        "merchant_id": merchant_id,
                    }
        except Exception as e:
            print(
                f"Exception while getting merchant {merchant_id} payment links: {e}"
            )
            return {"error": str(e), "merchant_id": merchant_id}

    async def get_merchant_recurring_payment_plans(
        self, merchant_id: str
    ) -> Dict[str, Any]:
        """
        Get recurring payment plans information for a specific merchant

        Args:
            merchant_id: The merchant ID to get recurring payment plans for

        Returns:
            Merchant recurring payment plans data
        """
        url = f"{self.base_url}/api/merchant/{merchant_id}/recurring-payments/plans"

        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    print(
                        f"Successfully retrieved recurring payment plans for merchant {merchant_id}"
                    )
                    return data
                else:
                    print(
                        f"Error getting merchant {merchant_id} recurring payment plans: {response.status} - {await response.text()}"
                    )
                    return {
                        "error": f"HTTP {response.status}",
                        "merchant_id": merchant_id,
                    }
        except Exception as e:
            print(
                f"Exception while getting merchant {merchant_id} recurring payment plans: {e}"
            )
            return {"error": str(e), "merchant_id": merchant_id}

    async def get_merchant_gateways(self, merchant_id: str) -> Dict[str, Any]:
        """
        Get gateways information for a specific merchant

        Args:
            merchant_id: The merchant ID to get gateways for

        Returns:
            Merchant gateways data
        """
        url = f"{self.base_url}/api/merchant/{merchant_id}/gateways"

        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    print(
                        f"Successfully retrieved gateways for merchant {merchant_id}"
                    )
                    return data
                else:
                    print(
                        f"Error getting merchant {merchant_id} gateways: {response.status} - {await response.text()}"
                    )
                    return {
                        "error": f"HTTP {response.status}",
                        "merchant_id": merchant_id,
                    }
        except Exception as e:
            print(
                f"Exception while getting merchant {merchant_id} gateways: {e}"
            )
            return {"error": str(e), "merchant_id": merchant_id}

    async def get_merchant_transactions(
        self, merchant_id: str
    ) -> Dict[str, Any]:
        """
        Get transactions information for a specific merchant and process them

        Args:
            merchant_id: The merchant ID to get transactions for

        Returns:
            Merchant transactions data with monthly summaries
        """
        url = f"{self.base_url}/api/merchant/{merchant_id}/transaction"

        try:
            async with self.session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    print(
                        f"Successfully retrieved transactions for merchant {merchant_id}"
                    )
                    
                    # Process transactions to create monthly summaries
                    processed_data = self._process_transactions(data, merchant_id)
                    return processed_data
                else:
                    print(
                        f"Error getting merchant {merchant_id} transactions: {response.status} - {await response.text()}"
                    )
                    return {
                        "error": f"HTTP {response.status}",
                        "merchant_id": merchant_id,
                    }
        except Exception as e:
            print(
                f"Exception while getting merchant {merchant_id} transactions: {e}"
            )
            return {"error": str(e), "merchant_id": merchant_id}

    def _process_transactions(self, data: Dict[str, Any], merchant_id: str) -> Dict[str, Any]:
        """
        Process transactions to filter successful payments and create monthly summaries
        
        Args:
            data: Raw transaction data from API
            merchant_id: The merchant ID
            
        Returns:
            Processed transaction data with summaries (no raw data)
        """
        # Initialize result structure
        result = {
            "merchant_id": merchant_id,
            "successful_payments_summary": {
                "total_amount": 0.0,
                "total_fees": 0.0,
                "total_transactions": 0
            },
            "monthly_transactions": []
        }
        
        # Check if data has the expected structure
        if not isinstance(data, dict) or "data" not in data:
            print(f"Warning: Unexpected transaction data structure for merchant {merchant_id}")
            return result
        
        transactions = data.get("data", [])
        if not isinstance(transactions, list):
            print(f"Warning: Transactions data is not a list for merchant {merchant_id}")
            return result
        
        # Monthly data storage
        monthly_data = defaultdict(lambda: {"amount": 0.0, "fees": 0.0, "count": 0})
        
        # Process each transaction
        for transaction in transactions:
            if not isinstance(transaction, dict):
                continue
                
            # Check if transaction is a successful payment
            transaction_type = transaction.get("type", "").lower()
            status = transaction.get("status", "").lower()
            
            if transaction_type == "payment" and status == "succeeded":
                # Get amount and fee
                amount = float(transaction.get("amount", 0))
                fee = float(transaction.get("fee", 0))
                
                # Add to totals
                result["successful_payments_summary"]["total_amount"] += amount
                result["successful_payments_summary"]["total_fees"] += fee
                result["successful_payments_summary"]["total_transactions"] += 1
                
                # Get transaction date and create monthly key
                created_at = transaction.get("created_at")
                if created_at:
                    try:
                        # Parse the date (assuming ISO format)
                        date_obj = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                        month_key = f"{date_obj.month:02d}/{date_obj.year}"
                        
                        # Add to monthly totals
                        monthly_data[month_key]["amount"] += amount
                        monthly_data[month_key]["fees"] += fee
                        monthly_data[month_key]["count"] += 1
                    except (ValueError, AttributeError) as e:
                        print(f"Warning: Could not parse date {created_at} for merchant {merchant_id}: {e}")
        
        # Convert monthly data to list format
        for month, data in sorted(monthly_data.items()):
            result["monthly_transactions"].append({
                "month": month,
                "total_successful_volume": round(data["amount"], 2),
                "fees": round(data["fees"], 2),
                "transaction_count": data["count"]
            })
        
        # Round the summary totals
        result["successful_payments_summary"]["total_amount"] = round(
            result["successful_payments_summary"]["total_amount"], 2
        )
        result["successful_payments_summary"]["total_fees"] = round(
            result["successful_payments_summary"]["total_fees"], 2
        )
        
        print(f"Processed {result['successful_payments_summary']['total_transactions']} successful payments for merchant {merchant_id}")
        return result


async def fetch_all_merchant_data(
    base_url: str, api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Fetch all merchant data including details for each merchant

    Args:
        base_url: The base URL of the PayEngine API
        api_key: Optional API key for authentication

    Returns:
        Dictionary containing all merchant data with nested structure
    """
    print("Starting merchant data extraction...")

    async with PayEngineMerchantAPI(base_url, api_key) as api:
        # Get all merchants
        merchants = await api.get_merchants()

        if not merchants:
            return {
                "extraction_time": datetime.now().isoformat(),
                "status": "error",
                "message": "No merchants found or error occurred",
                "merchants": [],
                "total_merchants": 0,
            }

        # Create the main data structure
        result = {
            "extraction_time": datetime.now().isoformat(),
            "status": "success",
            "message": f"Successfully extracted data for {len(merchants)} merchants",
            "total_merchants": len(merchants),
            "merchants": [],
        }

        # Process each merchant
        for i, merchant in enumerate(merchants, 1):
            print(
                f"Processing merchant {i}/{len(merchants)}: {merchant.get('id', 'Unknown ID')}"
            )
            # Save all merchant fields in the output dictionary
            merchant_row = {
                "merchant_id": merchant.get("id"),
                "merchant_data": merchant,  # All fields from the merchant list
                "details": None,  # Placeholder for future merchant-specific data
                "documents": None,  # Will be populated with document API call
                "bank_accounts": None,  # Will be populated with bank accounts API call
                "devices": None,  # Will be populated with devices API call
                "payment_links": None,  # Will be populated with payment links API call
                "recurring_payment_plans": None,  # Will be populated with recurring payment plans API call
                "gateways": None,  # Will be populated with gateways API call
                "transactions": None,  # Will be populated with transactions API call
            }
            
            # Get document information for this merchant
            if merchant.get("id"):
                documents = await api.get_merchant_documents(merchant["id"])
                merchant_row["documents"] = documents
            
            # Get bank account information for this merchant
            if merchant.get("id"):
                bank_accounts = await api.get_merchant_bank_accounts(
                    merchant["id"]
                )
                merchant_row["bank_accounts"] = bank_accounts
            
            # Get devices information for this merchant
            if merchant.get("id"):
                devices = await api.get_merchant_devices(merchant["id"])
                merchant_row["devices"] = devices
            
            # Get payment links information for this merchant
            if merchant.get("id"):
                payment_links = await api.get_merchant_payment_links(
                    merchant["id"]
                )
                merchant_row["payment_links"] = payment_links
            
            # Get recurring payment plans information for this merchant
            if merchant.get("id"):
                recurring_payment_plans = await api.get_merchant_recurring_payment_plans(
                    merchant["id"]
                )
                merchant_row["recurring_payment_plans"] = recurring_payment_plans
            
            # Get gateways information for this merchant
            if merchant.get("id"):
                gateways = await api.get_merchant_gateways(merchant["id"])
                merchant_row["gateways"] = gateways
            
            # Get transactions information for this merchant
            if merchant.get("id"):
                transactions = await api.get_merchant_transactions(merchant["id"])
                merchant_row["transactions"] = transactions
            
            # Get detailed information for this merchant
            if merchant.get('id'):
                details = await api.get_merchant_details(merchant['id'])
                merchant_row["details"] = details
            
            result["merchants"].append(merchant_row)

        print(f"Completed data extraction for {len(merchants)} merchants")
        return result


async def save_merchant_data_to_json(
    data: Dict[str, Any], filename: str = "merchant_data.json"
):
    """
    Save merchant data to a JSON file

    Args:
        data: The merchant data to save
        filename: The filename to save the data to
    """
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False, default=str)
        print(f"Data saved successfully to {filename}")
    except Exception as e:
        print(f"Error saving data to {filename}: {e}")


async def main():
    """
    Main function to run the merchant data extraction
    """
    # Delete previous output file if it exists
    output_filename = "merchant_data.json"
    if os.path.exists(output_filename):
        try:
            os.remove(output_filename)
            print(f"Deleted previous output file: {output_filename}")
        except Exception as e:
            print(f"Could not delete previous output file: {e}")
    # Get configuration from environment variables
    payengine_host = os.getenv("PAYENGINE_BASE_URL")
    api_key = os.getenv("PAYENGINE_PRIVATE_KEY")  # Use existing env var name

    if not payengine_host:
        print("Error: PAYENGINE_BASE_URL environment variable is required")
        print("Please set PAYENGINE_BASE_URL in your .env file or environment")
        return

    print("=" * 60)
    print("PAYENGINE MERCHANT DATA EXTRACTION")
    print("=" * 60)
    print(f"PayEngine Host: {payengine_host}")
    print(f"API Key provided: {'Yes' if api_key else 'No'}")
    print("=" * 60)

    try:
        # Fetch all merchant data
        merchant_data = await fetch_all_merchant_data(payengine_host, api_key)

        # Save to JSON file
        output_filename = "merchant_data.json"
        await save_merchant_data_to_json(merchant_data, output_filename)

        # Print summary
        print("\n" + "=" * 60)
        print("EXTRACTION SUMMARY")
        print("=" * 60)
        print(f"Status: {merchant_data.get('status', 'unknown')}")
        print(f"Message: {merchant_data.get('message', 'No message')}")
        print(f"Total Merchants: {merchant_data.get('total_merchants', 0)}")
        print(f"Output File: {output_filename}")

        # Show sample of extracted data
        if merchant_data.get("merchants"):
            print("\nSample merchant structure:")
            sample_merchant = merchant_data["merchants"][0]
            print(f"  Merchant ID: {sample_merchant.get('merchant_id')}")
            print(
                f"  Has merchant data: {'Yes' if sample_merchant.get('merchant_data') else 'No'}"
            )
            print(
                f"  Has details: {'Yes' if sample_merchant.get('details') else 'No'}"
            )
            print(
                f"  Has documents: {'Yes' if sample_merchant.get('documents') else 'No'}"
            )
            print(
                f"  Has bank accounts: {'Yes' if sample_merchant.get('bank_accounts') else 'No'}"
            )
            print(
                f"  Has devices: {'Yes' if sample_merchant.get('devices') else 'No'}"
            )
            print(
                f"  Has payment links: {'Yes' if sample_merchant.get('payment_links') else 'No'}"
            )
            print(
                f"  Has recurring payment plans: {'Yes' if sample_merchant.get('recurring_payment_plans') else 'No'}"
            )
            print(
                f"  Has gateways: {'Yes' if sample_merchant.get('gateways') else 'No'}"
            )
            print(
                f"  Has transactions: {'Yes' if sample_merchant.get('transactions') else 'No'}"
            )

            if sample_merchant.get("merchant_data"):
                merchant_keys = list(sample_merchant["merchant_data"].keys())[
                    :5
                ]
                print(f"  Merchant data keys: {merchant_keys}")

            if sample_merchant.get("details") and not sample_merchant[
                "details"
            ].get("error"):
                detail_keys = list(sample_merchant["details"].keys())[:5]
                print(f"  Detail keys: {detail_keys}")

            if sample_merchant.get("documents") and not sample_merchant[
                "documents"
            ].get("error"):
                document_keys = list(sample_merchant["documents"].keys())[:5]
                print(f"  Document keys: {document_keys}")

            if sample_merchant.get("bank_accounts") and not sample_merchant[
                "bank_accounts"
            ].get("error"):
                bank_account_keys = list(
                    sample_merchant["bank_accounts"].keys()
                )[:5]
                print(f"  Bank Account keys: {bank_account_keys}")

            if sample_merchant.get("devices") and not sample_merchant[
                "devices"
            ].get("error"):
                device_keys = list(sample_merchant["devices"].keys())[:5]
                print(f"  Device keys: {device_keys}")

            if sample_merchant.get("payment_links") and not sample_merchant[
                "payment_links"
            ].get("error"):
                payment_link_keys = list(
                    sample_merchant["payment_links"].keys()
                )[:5]
                print(f"  Payment Link keys: {payment_link_keys}")

            if sample_merchant.get(
                "recurring_payment_plans"
            ) and not sample_merchant["recurring_payment_plans"].get("error"):
                recurring_payment_plan_keys = list(
                    sample_merchant["recurring_payment_plans"].keys()
                )[:5]
                print(
                    f"  Recurring Payment Plan keys: {recurring_payment_plan_keys}"
                )

            if sample_merchant.get("gateways") and not sample_merchant[
                "gateways"
            ].get("error"):
                gateway_keys = list(sample_merchant["gateways"].keys())[:5]
                print(f"  Gateway keys: {gateway_keys}")

            if sample_merchant.get("transactions") and not sample_merchant[
                "transactions"
            ].get("error"):
                transaction_keys = list(
                    sample_merchant["transactions"].keys()
                )[:5]
                print(f"  Transaction keys: {transaction_keys}")

        return merchant_data

    except Exception as e:
        print(f"Fatal error in main execution: {e}")
        return {"error": str(e)}


# Function to be called from other modules
async def extract_merchant_data(
    base_url: str = None, api_key: str = None
) -> Dict[str, Any]:
    """
    Extract merchant data - can be called from other modules

    Args:
        base_url: Optional base URL (will use environment variable if not provided)
        api_key: Optional API key (will use environment variable if not provided)

    Returns:
        Dictionary containing merchant data
    """
    if not base_url:
        base_url = os.getenv("PAYENGINE_BASE_URL")
        if not base_url:
            raise ValueError("PAYENGINE_BASE_URL environment variable is required")

    if not api_key:
        api_key = os.getenv(
            "PAYENGINE_PRIVATE_KEY"
        )  # Use existing env var name

    return await fetch_all_merchant_data(base_url, api_key)


if __name__ == "__main__":
    # Run the async main function
    results = asyncio.run(main())

    if results and not results.get("error"):
        print("\nMerchant data extraction completed successfully!")
    else:
        print("\nMerchant data extraction failed!")
        if results and results.get("error"):
            print(f"Error: {results['error']}")
