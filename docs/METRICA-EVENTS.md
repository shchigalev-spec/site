# Yandex Metrica events

Metrica loads only when `NEXT_PUBLIC_YANDEX_METRICA_ID` is configured. Event
properties must never include phone numbers, email addresses, message text,
filenames, or other personal data.

| Event | Trigger | Safe properties | Business question |
|---|---|---|---|
| `page_view` | Route render | `path` | Which routes attract attention? |
| `cta_diagnostic_click` | Diagnostic CTA | `location`, `text` | Which CTA context starts intent? |
| `noise_select` | Symptom choice | `noise_type` | Which symptoms dominate? |
| `acoustic_hotspot_open` | Path point opened | `hotspot` | Which transmission paths need explanation? |
| `diagnostic_start` | Wizard opened | `source` | Where do diagnostic starts originate? |
| `diagnostic_step_complete` | Next step | `step` | Where does the flow lose users? |
| `diagnostic_complete` | Server-confirmed success | `noise_type`, `stage` | Which profiles convert? |
| `file_upload_add` | Valid file selected | `file_type` | Is evidence upload used? |
| `form_start` | First contact input | `location` | How many visitors begin contact entry? |
| `form_submit_success` | Server-confirmed success | `location` | Which form context converts? |
| `form_submit_error` | Server or validation failure | `location`, `kind` | What blocks submission? |
| `phone_click` | Configured phone clicked | `location` | Where are calls initiated? |
| `email_click` | Configured email clicked | `location` | Where are emails initiated? |
| `case_open` | Case detail clicked | `case_slug` | Which proof is relevant? |
| `faq_open` | FAQ expanded | `question_id` | Which objections persist? |
| `scroll_50` | First 50% scroll | `path` | Does the narrative retain attention? |
| `scroll_90` | First 90% scroll | `path` | Does the final conversion section get seen? |

