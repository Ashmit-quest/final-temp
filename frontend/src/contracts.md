# API Contracts & Data Models

This contract defines the API endpoints and MongoDB schemas for the Cadence Analytics Console.

## Data Models

### 1. Report
Represents a generated and scheduled analytics report.
```json
{
  "id": "string (UUID)",
  "title": "string",
  "type": "string",
  "owner": "string",
  "status": "string (Ready | Building | Failed)",
  "status_class": "string (ok | wait | fail)",
  "created_at": "string (ISO Date)"
}
```

### 2. Campaign
Represents a marketing and advertising campaign with spend and ROAS.
```json
{
  "id": "string (UUID)",
  "title": "string",
  "channel": "string",
  "spend": "string (formatted e.g. $12,400)",
  "roas": "string (formatted e.g. 4.8x)",
  "status_class": "string (ok | wait | fail)",
  "created_at": "string (ISO Date)"
}
```

### 3. Setting
Represents user preferences in the Analytics Console.
```json
{
  "id": "string (fixed 'user_settings')",
  "is_dark": "boolean",
  "selected_swatch": "string (hex color)",
  "live_stats": "boolean",
  "reduced_motion": "boolean",
  "compact_mode": "boolean",
  "updated_at": "string (ISO Date)"
}
```

### 4. Transaction
Represents a financial subscription transaction.
```json
{
  "id": "string (UUID)",
  "customer_name": "string",
  "plan": "string",
  "amount": "string",
  "status_class": "string (ok | wait | fail)",
  "status_text": "string (Paid | Pending | Failed)",
  "color": "string (hex or CSS var)",
  "created_at": "string (ISO Date)"
}
```

## API Endpoints

### Reports Endpoints
- `GET /api/reports`: Retrieve all reports.
- `POST /api/reports`: Create a new report.
  - Request body: `{ "title": "string", "type": "string", "owner": "string", "status": "string" }`

### Campaigns Endpoints
- `GET /api/campaigns`: Retrieve all campaigns.
- `POST /api/campaigns`: Create a new campaign.
  - Request body: `{ "title": "string", "channel": "string", "spend": "string", "roas": "string", "status_class": "string" }`

### Settings Endpoints
- `GET /api/settings`: Retrieve saved settings. Returns default settings if none saved.
- `POST /api/settings`: Save settings.
  - Request body: `{ "is_dark": "boolean", "selected_swatch": "string", "live_stats": "boolean", "reduced_motion": "boolean", "compact_mode": "boolean" }`

### Transactions Endpoints
- `GET /api/transactions`: Retrieve transactions. Optional filter query parameter `q`.
