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


- Dnsmasq


- Nginx


- Knockd

Custom as whatever you want, here for controlling sshd by using port knocking.
Don't forget to change the sequence ports.

```conf
[options]
        logfile = /var/log/knockd-wireless.log
        interface = wlan0

[openSSH]
        sequence    = 123,456,789
        seq_timeout = 5
        command     = /bin/systemctl start ssh
        tcpflags    = syn

[closeSSH]
        sequence    = 789,456,321
        seq_timeout = 5
        command     = /bin/systemctl stop ssh
        tcpflags    = syn
```

- NoDogSplash

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

