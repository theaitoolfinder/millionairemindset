#!/usr/bin/env python3
"""
sync_subscribers.py — Millionaire Mindset
─────────────────────────────────────────────────────────────────────────────
Fetches all active contacts from Brevo LIST 4, SHA-256 hashes their emails,
and maintains two output files:

  data/subscribers_db.json
      Accumulative internal DB — hashes are ONLY EVER ADDED, never removed.
      Survives Brevo list purges, unsubscribes, and account issues.

  data/subscribers.json
      Derived gate file — the same hashes in the format the subscriber
      gate JS uses to verify access.

Required env var: BREVO_API_KEY
"""
import os, json, hashlib, datetime
import urllib.request, urllib.error

BREVO_API_KEY = os.environ.get("BREVO_API_KEY", "").strip()
BREVO_LIST_ID = 4           # Millionaire Mindset list in Brevo
DB_FILE       = "data/subscribers_db.json"
OUT_FILE      = "data/subscribers.json"


def sha256(email: str) -> str:
    return hashlib.sha256(email.strip().lower().encode()).hexdigest()


def _now() -> str:
    return datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")


def load_db() -> dict:
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r") as f:
                data = json.load(f)
            if isinstance(data, dict) and "hashes" in data:
                return data
        except Exception:
            pass
    return {"v": 1, "hashes": [], "first_created": _now(), "last_updated": _now(), "count": 0}


def fetch_list_contacts() -> list:
    """Fetch all active contacts from the Brevo account (all lists)."""
    if not BREVO_API_KEY:
        print("BREVO_API_KEY not set — no contacts fetched.")
        return []

    all_contacts = []
    offset = 0
    limit = 500

    while True:
        url = (
            f"https://api.brevo.com/v3/contacts/lists/{BREVO_LIST_ID}/contacts"
            f"?limit={limit}&offset={offset}"
        )
        req = urllib.request.Request(
            url,
            headers={"api-key": BREVO_API_KEY, "accept": "application/json"},
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:300]
            print(f"Brevo API error {e.code}: {body}")
            raise

        contacts = data.get("contacts", [])
        if not contacts:
            break

        all_contacts.extend(contacts)
        total = data.get("count", 0)
        offset += len(contacts)
        if offset >= total:
            break

    return all_contacts


def main():
    os.makedirs("data", exist_ok=True)

    db = load_db()
    existing_hashes: set = set(db.get("hashes", []))
    before_count = len(existing_hashes)

    contacts = fetch_list_contacts()
    active   = [c for c in contacts if not c.get("emailBlacklisted", False) and c.get("email")]
    print(f"[Brevo] {len(active)} active contacts fetched ({len(contacts)} total incl. unsubscribed).")

    active_hashes = {sha256(c["email"]) for c in active}
    new_hashes    = active_hashes - existing_hashes
    if new_hashes:
        existing_hashes.update(new_hashes)
        print(f"[DB] {len(new_hashes)} new subscriber(s) added.")
    else:
        print(f"[DB] No new subscribers.")

    all_hashes = sorted(existing_hashes)
    db["_readme"]      = "Hashes only — emails are stored privately in Brevo, not in this file."
    db["hashes"]       = all_hashes
    db["count"]        = len(all_hashes)
    db["last_updated"] = _now()
    db["brevo_active"] = len(active)

    with open(DB_FILE, "w") as f:
        json.dump(db, f, indent=2)
    print(f"[DB] {len(all_hashes)} hashes written to {DB_FILE}")

    gate = {"hashes": all_hashes, "count": len(all_hashes), "updated": _now()}
    with open(OUT_FILE, "w") as f:
        json.dump(gate, f, separators=(",", ":"))
    print(f"[Gate] {len(all_hashes)} hashes written to {OUT_FILE}")

    added = len(all_hashes) - before_count
    print(f"Sync complete — {added} new this run. {len(all_hashes)} total records.")


if __name__ == "__main__":
    main()
