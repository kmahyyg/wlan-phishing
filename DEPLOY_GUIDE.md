# Deploy guide

## Hardware

- Raspberry Pi 4B Rev 1.1 with Raspbian correctly installed before
- Extra WiFi Adapter
- Wired Connection for initial configuration and monitoring

## Software

- Latest Raspbian
- Python3, Flask, SQLite3, SQLAlchemy
- Nginx WebServer
- Knockd
- NoDogSplash
- Make sure your raspberry pi is in a security-hardened status to prevent from being hacked by others
- Daemonized by systemd service and tmux

## Configuration File

- Hostapd

TODO

- Dnsmasq

Config file: `/etc/dnsmasq.conf`

Hosts file: `/etc/hosts`

Upstream DNS config: `/etc/resolv.conf` and `chattr +i`

- Nginx

TODO

- Knockd

Custom as whatever you want, here for controlling sshd by using port knocking.
Don't forget to change the sequence ports.

All files under `./etc/` naming start with `knockd`.

- NoDogSplash

TODO

- Gunicorn UWSGI

Copy `./pybackend/userdata.db.init` to `./pybackend/userdata.db` to initialize the sqlite3 user database.

Under `pybackend` folder: `gunicorn -b 127.0.0.1:58088 -w 1 --reload --preload --threads 2 -D main:app`

- Kernel Tweak by using `sysctl`

All files under `./etc/sysctl.d`

- Static IP config

Config file: `./etc/dhcpcd.conf`

- 

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

## License

 wlan-phishing-ynu
 Copyright (C) 2019  kmahyyg
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.
 
 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

