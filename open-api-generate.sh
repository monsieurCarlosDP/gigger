!/bin/bash

cd /var/www/gigger/backend && npm run openapi:generate && cd /var/www/gigger/frontend && npm run openapi:types && cd /var/www/gigger/client-form && npm run openapi:types