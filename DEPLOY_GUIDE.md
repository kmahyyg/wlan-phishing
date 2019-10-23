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

Config file: `/etc/hostapd/hostapd.conf`

- Dnsmasq

Config file: `/etc/dnsmasq.conf`

Hosts file: `/etc/hosts`

Upstream DNS config: `/etc/resolv.conf` and `chattr +i`, Remove `nameserver 10.172.0.1` if necessary.

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

Since Raspberry Pi 4 has multiple internet interfaces, as for I need to maintain several different internet enviornment with corresponding interface, I install NetworkManager as my laptop does.

This network topology is working like this: `WAN/Manager LAN(eth0/wlan1) <--(br0)--> Fake AP(wlan0) <-> Victims`

To build a network bridge controlled by NetworkManager, make sure you've installed related dependencies like `dnsmasq`, `dhcpcd`.

Run the following command to build a bridge and add wlan0 as bridge slave. (Set stp==no to prevent broadcasting bridge)

```bash
$ nmcli c add type bridge ifname br0 stp no 
$ nmcli c add type bridge-slave ifname wlan0 master br0
$ sudo ln -sf /dev/null /etc/udev/rules.d/80-net-setup-link.rules
```

Then configure it to uuse a static IP address:

```bash
$ nmcli c edit bridge-br0
> set ipv6.method disabled
> set ipv4.method manual
> set ipv4.dns 10.172.0.1
> set ipv4.addresses 10.172.0.1/24
> set ipv4.gateway 10.172.0.1
> set connection.autoconnect yes
> verify
> save persistent
> quit 
```

Finally, bring it online:

```bash
$ nmcli c up bridge-br0
```
 

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

