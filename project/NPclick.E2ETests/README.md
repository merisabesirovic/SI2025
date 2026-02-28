# NPclick.E2ETests

This project now has two test groups:

- `Frontend/` Selenium browser tests against the React app.
- `Backend/` HTTP endpoint tests against the API.

## Run all tests

```powershell
dotnet test NPclick.E2ETests/NPclick.E2ETests.csproj
```

## Run by category (recommended)

```powershell
dotnet test NPclick.E2ETests/NPclick.E2ETests.csproj --filter "Category=Frontend"
dotnet test NPclick.E2ETests/NPclick.E2ETests.csproj --filter "Category=Backend"
dotnet test NPclick.E2ETests/NPclick.E2ETests.csproj --filter "Category=Smoke"
dotnet test NPclick.E2ETests/NPclick.E2ETests.csproj --filter "Category=Auth"
```

## Run frontend tests

1. Start frontend (default expected URL: `http://localhost:3000`).
2. Run:

```powershell
dotnet test NPclick.E2ETests/NPclick.E2ETests.csproj --filter "Category=Frontend"
```

Optional environment variables:

- `E2E_BASE_URL` (default: `http://localhost:3000`)
- `E2E_HEADLESS` (`false` to show browser)

## Run backend tests

1. Start API (default expected URL: `http://localhost:5241`).
2. Run:

```powershell
dotnet test NPclick.E2ETests/NPclick.E2ETests.csproj --filter "Category=Backend"
```

Optional environment variable:

- `E2E_API_BASE_URL` (default: `http://localhost:5241`)
