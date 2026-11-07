// --- 1. ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ ДЛЯ ГЛАВНОГО ЭКРАНА ---
const mainText = "> Initializing system...\n> Loading modules: Web, Pwn, Crypto, Rev...\n> Access Granted.\n> Welcome to Dr@ng3's Cyber Range.\n> Select a section above to begin.";
const typewriterElement = document.getElementById('typewriter');
let i = 0;

function typeWriter() {
    if (typewriterElement && i < mainText.length) {
        typewriterElement.innerHTML += mainText.charAt(i);
        i++;
        setTimeout(typeWriter, 40);
    }
}

// --- 2. ФОНОВЫЙ ЖИВОЙ ТЕРМИНАЛ (HACKER LOGS) ---
const bgCanvas = document.createElement('div');
bgCanvas.id = 'bg-terminal';
document.body.prepend(bgCanvas);

const commands = [
    "nmap -sV -p- 10.10.10.1",
    "sudo su -",
    "hydra -l admin -P rockyou.txt ssh://192.168.1.1",
    "msfconsole -q",
    "gobuster dir -u http://target.com -w common.txt",
    "cat /etc/shadow",
    "python3 exploit.py --target 10.10.10.5",
    "sqlmap -u 'http://site.com/?id=1' --dbs",
    "chmod +x reverse_shell.sh",
    "./reverse_shell.sh",
    "echo 'Access Granted'",
    "rm -rf /var/log/syslog"
];

const outputs = [
    "[+] Port 22/tcp open ssh",
    "[+] Port 80/tcp open http",
    "[-] Access denied. Retrying...",
    "[!] WARNING: Intrusion detected",
    "root@target:~#",
    "[*] Bypassing firewall...",
    "[+] Hash cracked: password123",
    "[-] Connection timed out",
    "[+] Shell obtained! uid=0(root)",
    "Segmentation fault (core dumped)"
];

let bgText = "";

function generateLog() {
    const isCommand = Math.random() > 0.4;
    let line = "";
    
    if (isCommand) {
        line = `<span style="color:#fff">root@drang3:~#</span> <span style="color:#00ffcc">${commands[Math.floor(Math.random() * commands.length)]}</span>\n`;
    } else {
        line = `<span style="color:#888">${outputs[Math.floor(Math.random() * outputs.length)]}</span>\n`;
    }
    
    bgText += line;
    
    // Ограничиваем количество строк на экране
    const lines = bgText.split('\n');
    if (lines.length > 30) {
        bgText = lines.slice(lines.length - 30).join('\n');
    }
    
    bgCanvas.innerHTML = bgText + '<span class="blinking-cursor">_</span>';
    
    // Случайная скорость появления строк
    setTimeout(generateLog, Math.random() * 1000 + 200);
}

// --- 3. ЭФФЕКТ ГЛИТЧА НА ЭКРАНЕ (Случайно) ---
function triggerGlitch() {
    document.body.classList.add('glitch-active');
    setTimeout(() => {
        document.body.classList.remove('glitch-active');
    }, Math.random() * 200 + 50);
    
    // Следующий глитч через случайное время
    setTimeout(triggerGlitch, Math.random() * 8000 + 2000);
}

// Запуск всего при загрузке
window.onload = () => {
    typeWriter();
    generateLog();
    setTimeout(triggerGlitch, 3000);
};
