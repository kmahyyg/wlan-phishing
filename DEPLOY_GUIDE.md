# Deploy Guide

## Hardware

- Raspberry Pi 4B Rev 1.1 with Arch Linux ARM correctly installed before you start, DC-5V&3A power supply is minimum requirement.
- Wired Connection for initial configuration and monitoring
- Extra WiFi Adapter (Optional, for optimizing and controlling purposes)

### About Wireless Adapter Driver

Considering the wide spread of 5Ghz Wi-Fi, the traditional 2.4Ghz solution might not work in most practical situation. You can choose to buy `Wi-Fi PineApple (Customized and Not General Linux Platform)` or another dual-band wireless network adapter to solve this problem.

First, please install `linux-firmware linux linux-headers` packages before you continue. 

**IF YOU ARE USING Raspberry Pi, PLEASE DON'T INSTALL `linux` PACKAGE, THAT MUST BRICK YOUR DEVICE. And consider change `linux-headers` to `linux-raspberrypi{4}-headers`.**

#### Realtek

If you have bought Realtek-based third-party wireless card (mostly RTL81xxU), it will neither be supported by Linux kernel nor manufacturer officials. Please find the proper driver and kernel module by yourself. Only Kali Linux has OffSec designed DKMS module to support, but it is not actively maintained. Try it at your own risk by `apt update; apt install dkms realtek-rtl88xxau-dkms -y`. Realtek itself doesn't offer Linux support.

#### Mediatek

If you have bought Mediatek/Ralink-based third-party wireless card, it will only work for kernel 4.19+ since `mt76` kernel module is introduced from 4.19, and currently, the most used chip is `MT7612U` in the market.
So you might need to upgrade to kernel 5.3+ to have fully support or you just have `monitor` or `managed` mode working (kernel 4.19 ~ 5.2). The recommended hardware is `EDUP EP-AC1616`, can be bought from [JD.com](https://item.jd.com/4386824.html). Mediatek has its own drivers but designed for 2.6.x kernels, which is considered as outdated now.

As for these hardwares contains a partition and running in USB-CDROM mode to offer "driverless support" by including driver in itself, you need to install `usb_modeswitch` and write udev rule to make sure it works as wireless card instead of CDROM. Find the USB Device VID and PID by `lsusb` and try to write a udev rule like this (For example, MT7612U, saved as `/etc/udev/rules.d/99-wireless7612.rules`): 

```
ACTION=="add", SUBSYSTEMS=="usb", ATTRS{idVendor}=="0e8d", ATTRS{idProduct}=="2870", RUN+="/usr/bin/usb_modeswitch -K -W -v 0e8d -p 2870"
```

If you are interesting for this, please consider read the related pages in Arch Linux Wiki.

#### Else

If neither above, please STFW or try `aircrack-ng` suite for driver support.

## Software

- Latest Arch Linux
- Python3, Flask, SQLite3, SQLAlchemy
- Caddy WebServer, Gunicorn
- Knockd
- NoDogSplash
- HostAPd
- DNSmasq
- resolv.conf and resolvconf
- Daemonized by systemd

## Configuration

- Default Config

  - Contains commmon captive portal URLs
  - This network topology is working like this: `WAN/Manager LAN(eth0/wlan1) <--(br0)--> Fake AP(wlan0) <-> Victims`
  - The WLAN IP Address of hotspot router is static configured as `10.172.0.1` with `iptables` enabled.
  - The DNS Poisoning, DNS Server and DHCP Server are offered by `dnsmasq`.
  - `hostapd` take controls of the whole communication between hardware and OS during the connecting progress.
  - Force Redirection and Wi-Fi Authentication are offered by `nodogsplash` and `iptables`.
  - `resolvconf` and `resolv.conf` is used for DNS server config as usual, but it might be overrided by NetworkManager.
  - The predictable network interface name can be disabled by: `ln -sf /dev/null /etc/udev/rules.d/80-net-setup-link.rules`.
  - Default DHCP client used by `NetworkManager` should be configured as `dhcpcd`.
  - All commands below should be run under root identity.
  - Config file in this repository is offered "as-is" and maintained its original file(folder) structure.
  - Assume you are currently in the root folder of the copy of the clone of this repo.

- Initial Config

Make sure your raspberry pi is hardened and secure, otherwise, it might be hacked by some users. Change your default SSH port, enable KeyPair-Only login and start Port-Knocking. Switch to `root` before you continue.

Install `libmicrohttpd python python-flask python-sqlalchemy gunicorn dnsmasq hostapd knockd networkmanager dhcpcd iptables nm-connection-editor` in Arch Official repository and also `flask-cors` via `pip3 install --user`.

Follow the procedure inside Arch Linux Wiki to configure your network access correctly(Except `wlan0`, the interface you wanna use for hotspot): https://wiki.archlinux.org/index.php/NetworkManager .

Clone the whole repo via `git clone --recursive git@github.com:kmahyyg/wlan-phishing.git` to your local storage. Or you can clone the repo and initialize git submodules by yourself.

**REMEMBER: DISABLE `systemd-networkd` and `systemd-resolved` AFTER YOU INSTALLED ALL THE PACKAGES ABOVE. THEY ARE JUST A TOY INSTEAD OF READY-FOR-PRODUCTION-USAGE PRODUCT.**

After installation, configure internet access properly using `NetworkManager` before you continue and make sure you've enabled and started related `NetworkManager-wait-online.service` and `NetworkManager.service`.

- Caddy

Since you're using Arch Linux, there's no reason not to use zstd compression, `tar xvf caddy-bin-rpi.tar.zst` to unarchive and copy to `/usr/local/bin`.

`chmod +x` and then `setcap 'cap_net_bind_service=+ep' /usr/local/bin/caddy`, Copy config file to corresponding location: `/etc/Caddyfile`.

- iptables

Copy the predefined rules from `./etc/iptables/iptables.rules` to corresponding location and merge firewall rules by yourself.

Since Arch Linux doesn't help you enable you by default: `systemctl enable --now iptables` and reboot your device.

- Hostapd

Copy config file to corresponding location: `/etc/hostapd/hostapd.conf` and enable service: `systemctl enable hostapd`

- Dnsmasq

Copy config file to corresponding location: `/etc/dnsmasq.conf` and enable service: `systemctl enable dnsmasq`.

Copy and merge Hosts file by yourself: `/etc/hosts`

Upstream DNS config: `/etc/resolv.conf` and then `chattr +i` to avoid override from `NetworkManager`, Remove `nameserver 10.172.0.1` if necessary. For taking control back from `NetworkManager`, check the section below.

- Knockd

Custom as whatever you want, here for controlling sshd by using port knocking.
Don't forget to change the sequence ports.

All files under `./etc/` naming start with `knockd`. The default service only listens on `eth0`, others should be enabled and started on demand. Service files are under `./etc/systemd/system`.

Copy the config files `./etc/knockd*.conf` to `/etc`, `./etc/systemd/system/knockd*.service` to  `/etc/systemd/system`. Execute `systemctl daemon-reload` to refresh services list.

Enable and start services on demand.

> Note: `knockd` doesn't support listen on multiple interfaces or `0.0.0.0` till now. It requires a configured IP address and network link to work before you start service each time.

- NoDogSplash

Copy the config file to corresponding location: `/etc/nodogsplash/nodogsplash.conf`.

Don't forget to change `BlockedMACList` and `TrustedMACList` before you start.

The corresponding systemd service is `./etc/systemd/system/nodogsplash.service`, copy to corresponding location, execute `systemctl daemon-reload` to refresh services list, enable and start on demand.

- Gunicorn UWSGI

Copy `./pybackend/userdata.db.init` to `./pybackend/userdata.db` to initialize the SQLite3 user database.

Rename `./pybackend/apikey.eg.py` to `./pybackend/apikey.py` for setting database connection string correctly.

Manually way: Start `tmux` and in `pybackend` folder: `bash ./run_as_serv.sh`.

More elegant way:

  - `mkdir -p /usr/local/wlanphishing-backend`
  - Copy all datas inside `pybackend` to `/usr/local/wlanphishing-backend/`
  - Copy coresponding systemd service file from `./etc/systemd/system/wlan-phishing-gunicorn.service` to corresponding location.
  - Execute `systemctl daemon-reload` to refresh services list, enable and start on demand.

- Kernel Tweak by using `sysctl`

All files under `./etc/sysctl.d`, copy to correspondling location and restart your device to take effect.

- Static IP config

Since Raspberry Pi 4 has multiple internet interfaces, as for I need to maintain several different Internet enviornments with corresponding interface, I've installed NetworkManager.

This network topology is working like this: `WAN/Manager LAN(eth0/wlan1) <--(br0)--> Fake AP(wlan0) <----> Victims`

First, set hotspot interface to `unmanaged` by editing : `/etc/NetworkManager/NetworkManager.conf` 

```
[keyfile]
unmanaged-devices=mac:aa:bb:cc:dd:ee:ff
```

Then, disable automatic update of `resolv.conf` by adding the following lines to `/etc/NetworkManager/NetworkManager.conf`:

```
[main]
dns=none
```

and finally restart service: `systemctl restart NetworkManager`.

If not work, you may also need to disable `resolvconf`: `systemctl disable --now resolvconf.service`.


To build a network bridge controlled by NetworkManager, make sure you've installed related dependencies like `dnsmasq`, `dhcpcd`.

Run the following command to build a bridge and add wlan0 as bridge slave. (Set `stp=no` to prevent broadcasting bridge)

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

- Systemd service files

Already described above, Review `./etc/systemd/system` for files.

To enable a service for autostart: `systemctl enable xxxx.service` (If service support).
To start a service: `systemctl start xxxx.service` .
To stop a service: `systemctl stop xxxx.service` .
To restart a service: `systemctl restart xxxx.service` .
To check a service status: `systemctl status -l xxxx.service`.
To refresh services list: `systemctl daemon-reload`.

## SQLite3 DB Schema

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
create table uniquser
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

## Reference

- https://wiki.archlinux.org
- Arch Linux Chinese Community on Telegram.

## TODO: Enhancement

- Trying to intercept and change user's default DNS if user doesn't use the DNS we offered.
- Trying to locate the problem of hostapd re-association when a client reconnect twice in a very short period of time.
- Implement an automated validating Python script to check if user input is correct. *(But that will finally result in forced requirement of internet access all the time and I need to implement automated CAPTCHA solver.) 

## License

 wlan-phishing-ynu
 Copyright (C) 2019 kmahyyg
 
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

