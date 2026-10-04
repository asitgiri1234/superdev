# python

Private Python backend for local testing.

## Setup

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
```

## Run

```powershell
uvicorn app.main:app --reload
```

Health check: http://127.0.0.1:8000/health

## Test

```powershell
pytest
```
