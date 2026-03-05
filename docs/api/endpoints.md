# API Documentation

## Secure Password Generator

This document describes the API endpoints and usage for Secure Password Generator.

## Overview

- **Base URL:** Varies by deployment
- **Format:** JSON
- **Authentication:** None (public)

## Endpoints

### GET /
Returns the main application.

**Response:**
- Type: HTML
- Content: Single Page Application

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Error Handling

All errors follow standard HTTP status codes:

- `200` - Success
- `404` - Not Found
- `500` - Server Error

## Rate Limiting

No rate limiting applied for static hosting.

## Examples

```bash
# Health check
curl https://36-tool-react-password-generator.vercel.app/api/health

# Get main app
curl https://36-tool-react-password-generator.vercel.app/
```
