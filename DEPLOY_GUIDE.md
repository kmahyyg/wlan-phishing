# Deploy guide

## Hardware

- Raspberry Pi 4B Rev 1.1 with Raspbian correctly installed before
- Extra WiFi Adapter
- Wired Connection for initial configuration and monitoring

## Software

- Latest Raspbian
- Python3, Flask, SQLite3, SQLAlchemy
- Caddy WebServer
- Make sure your raspberry pi is in a security-hardened status to prevent from being hacked by others

## Configuration File

- Hostapd
- Dnsmasq
- Caddy
- Gunicorn UWSGI

## SQLITE SCHEMA

```sql
create table webuser
(
	id INTEGER
		constraint webuser_pk
			primary key autoincrement,
	username VARCHAR(50) not null,
	password VARCHAR(50) not null,
	timest TIMESTAMP default CURRENT_TIMESTAMP not null,
	legal BOOLEAN
);
```

