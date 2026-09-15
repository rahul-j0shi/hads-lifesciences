# Backend test suites

Reserved suite folders: [unit](unit/README.md), [integration](integration/README.md), [regression](regression/README.md). Test execution/reporting rules live in [delivery](../../rules/delivery.md).

First-slice matrix: welcome shape; liveness without Mongo; readiness success/timeout; generic errors without secrets; trusted/untrusted origin headers; application cleanup and partial startup cleanup; response conformance to OpenAPI. Integration checks use real disposable Mongo and must prove the HTTP readiness response changes when Mongo is unavailable. Browser smoke tests belong to the frontend.

No executable tests, automation or passing baseline exist in this planning change.
