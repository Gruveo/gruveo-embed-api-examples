#!/usr/bin/env bash
set -e

# Each deploy regenerates the nginx config, so the certificate must be reinstalled every time.
certbot -n --nginx --keep-until-expiring --redirect --agree-tos \
  -d api-demo.gruveo.com --email art@gruveo.com
