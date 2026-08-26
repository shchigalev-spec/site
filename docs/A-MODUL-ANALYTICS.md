# A‑Modul analytics contract

## Runtime configuration

Yandex Metrica is initialized only when `PUBLIC_YANDEX_METRICA_ID` contains a real numeric identifier. The optional call-tracking loader is initialized only when `PUBLIC_CALLTRACKING_SCRIPT_URL` is configured. No placeholder identifier or remote script is shipped by default.

## Attribution

The browser session preserves first-touch `landing_variant` and `referrer`, campaign values `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, and `yclid`, plus current `route`, `region`, and `type`. The full form forwards only these non-personal attribution values to the CRM adapter.

## Event allowlist

`page_view`, `hero_brief_start`, `hero_brief_complete`, `object_type_select`, `capacity_select`, `region_select`, `commissioning_date_select`, `configurator_start`, `configurator_complete`, `case_filter_change`, `case_open`, `logistics_map_start`, `logistics_mode_change`, `logistics_route_complete`, `bim_interaction_start`, `bim_interaction_complete`, `production_sequence_start`, `production_sequence_complete`, `lower_object_stage_change`, `price_scope_open`, `leasing_click`, `tender_start`, `final_cta_start`, `tender_submit_success`, `form_start`, `file_attach`, `form_validation_error`, `form_submit_success`, `form_submit_error`, `phone_click`, `email_click`, `scroll_50`, `scroll_90`.

The Milestone C browser suite exercises and asserts every event above against real UI interactions.

## Privacy boundary

Event payload keys matching name, phone, email, company, filename, or comment are rejected by the analytics helper. UI instrumentation sends only route/mode/selected taxonomy/count/status metadata. Phone and email click events never include the contact value. File events contain only a count; filenames are excluded.
