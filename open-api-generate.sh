!/bin/bash

cd /var/www/gigger/backend && npm run openapi:generate && cd /var/www/gigger/frontend && npm run openapi:types