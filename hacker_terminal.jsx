import { useState, useEffect, useRef, useCallback } from "react";

const FONT = "'Courier New', 'Lucida Console', monospace";

const BOOT_SEQUENCE = [
  { text: "BIOS v2.31.4  Copyright (C) 2026 CoreSystems", delay: 0 },
  { text: "CPU: AMD Ryzen 9 7950X @ 4.5GHz  [OK]", delay: 300 },
  { text: "RAM: 64GB DDR5-6000  [OK]", delay: 500 },
  { text: "NET: eth0 → 192.168.1.42  [OK]", delay: 700 },
  { text: "", delay: 900 },
  { text: "Loading GHOST OS v0.9.7-phantom...", delay: 1000 },
  { text: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%", delay: 1400, animate: true },
  { text: "", delay: 1800 },
  { text: "  ██████╗ ██╗  ██╗ ██████╗ ███████╗████████╗", delay: 1900 },
  { text: " ██╔════╝ ██║  ██║██╔═══██╗██╔════╝╚══██╔══╝", delay: 2000 },
  { text: " ██║  ███╗███████║██║   ██║███████╗   ██║   ", delay: 2100 },
  { text: " ██║   ██║██╔══██║██║   ██║╚════██║   ██║   ", delay: 2200 },
  { text: " ╚██████╔╝██║  ██║╚██████╔╝███████║   ██║   ", delay: 2300 },
  { text: "  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝   ", delay: 2400 },
  { text: "", delay: 2500 },
  { text: "  ██████╗ ███████╗", delay: 2600 },
  { text: " ██╔═══██╗██╔════╝    GHOST OS v0.9.7", delay: 2700 },
  { text: " ██║   ██║███████╗    Kernel 6.8.0-phantom", delay: 2800 },
  { text: " ██║   ██║╚════██║    Type 'help' for commands", delay: 2900 },
  { text: " ╚██████╔╝███████║", delay: 3000 },
  { text: "  ╚═════╝ ╚══════╝", delay: 3100 },
  { text: "", delay: 3200 },
  { text: "Last login: Mon Jun 08 03:17:44 2026 from 10.0.0.1", delay: 3300 },
];

const COMMANDS = {
  help: () => [
    "┌─────────────────────────────────────────────┐",
    "│            GHOST OS — COMANDOS               │",
    "├─────────────────────────────────────────────┤",
    "│  nmap <host>     Escaneia portas             │",
    "│  scan <range>    Varre rede local            │",
    "│  crack <hash>    Tenta quebrar hash MD5      │",
    "│  sniff           Inicia packet sniffer       │",
    "│  exploit <id>    Executa módulo de exploit   │",
    "│  whoami          Mostra usuário atual        │",
    "│  ifconfig        Configurações de rede       │",
    "│  ping <host>     Testa conexão               │",
    "│  ls              Lista arquivos              │",
    "│  cat <file>      Lê arquivo                  │",
    "│  clear           Limpa terminal              │",
    "│  matrix          Modo matrix                 │",
    "│  exit            Fecha sessão                │",
    "└─────────────────────────────────────────────┘",
  ],

  whoami: () => ["ghost  (uid=0  gid=0  groups=0(root),1000(ghost))"],

  ifconfig: () => [
    "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500",
    "        inet 192.168.1.42  netmask 255.255.255.0  broadcast 192.168.1.255",
    "        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64",
    "        ether 08:00:27:4e:66:a1  txqueuelen 1000",
    "        RX packets 14823  bytes 18291847 (17.4 MiB)",
    "        TX packets 9341   bytes 1203847 (1.1 MiB)",
    "",
    "lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536",
    "        inet 127.0.0.1  netmask 255.0.0.0",
    "        inet6 ::1  prefixlen 128",
  ],

  ls: () => [
    "total 48",
    "drwxr-xr-x  2 ghost ghost 4096 Jun  8 03:17 \x1b[34m.\x1b[0m",
    "drwxr-xr-x 18 root  root  4096 Jun  7 22:00 \x1b[34m..\x1b[0m",
    "-rwxr-xr-x  1 ghost ghost 8192 Jun  8 01:33 \x1b[32mexploit.py\x1b[0m",
    "-rw-------  1 ghost ghost  512 Jun  8 02:11 \x1b[31m.creds\x1b[0m",
    "-rw-r--r--  1 ghost ghost 2048 Jun  7 18:45 \x1b[33mrecon_notes.txt\x1b[0m",
    "drwxr-xr-x  4 ghost ghost 4096 Jun  8 00:55 \x1b[34mtools\x1b[0m",
    "-rw-r--r--  1 ghost ghost 1024 Jun  5 10:22 \x1b[33mtargets.list\x1b[0m",
  ],

  matrix: () => ["__MATRIX__"],

  exit: () => ["Encerrando sessão...", "Conexão fechada."],
};

function typewriterText(text, speed = 18) {
  return { text, speed };
}

function fakeNmap(host) {
  const h = host || "192.168.1.1";
  const ports = [
    { port: 22, state: "open", service: "ssh" },
    { port: 80, state: "open", service: "http" },
    { port: 443, state: "open", service: "https" },
    { port: 8080, state: "filtered", service: "http-proxy" },
    { port: 3306, state: "closed", service: "mysql" },
    { port: 21, state: "open", service: "ftp" },
  ];
  const lines = [
    `Starting Nmap 7.94 ( https://nmap.org )`,
    `Nmap scan report for ${h}`,
    `Host is up (0.00082s latency).`,
    `Not shown: 994 closed tcp ports (reset)`,
    `PORT      STATE     SERVICE`,
    ...ports.map(
      (p) =>
        `${String(p.port + "/tcp").padEnd(10)}${p.state.padEnd(10)}${p.service}`
    ),
    ``,
    `Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds`,
  ];
  return lines;
}

function fakeScan(range) {
  const r = range || "192.168.1.0/24";
  return [
    `Iniciando varredura em ${r}...`,
    `[+] 192.168.1.1   — up  (router)`,
    `[+] 192.168.1.42  — up  (host local)`,
    `[+] 192.168.1.55  — up  (desconhecido)`,
    `[+] 192.168.1.101 — up  (impressora?)`,
    `[+] 192.168.1.200 — up  (câmera IP)`,
    `[-] 192.168.1.254 — down`,
    ``,
    `5 hosts ativos encontrados.`,
  ];
}

function fakeCrack(hash) {
  const h = hash || "5f4dcc3b5aa765d61d8327deb882cf99";
  const known = {
    "5f4dcc3b5aa765d61d8327deb882cf99": "password",
    "e10adc3949ba59abbe56e057f20f883e": "123456",
    "25f9e794323b453885f5181f1b624d0b": "123456789",
    "098f6bcd4621d373cade4e832627b4f6": "test",
  };
  const found = known[h];
  if (found) {
    return [
      `[*] Hash: ${h}`,
      `[*] Tipo: MD5`,
      `[*] Tentando wordlist rockyou.txt...`,
      `[*] Progresso: ████████████████ 100%`,
      `[+] CRACK ENCONTRADO: "${found}"`,
    ];
  }
  return [
    `[*] Hash: ${h}`,
    `[*] Tipo: MD5`,
    `[*] Tentando wordlist rockyou.txt...`,
    `[*] Progresso: ▓▓▓▓▓▓▓░░░░░░░░░ 43%`,
    `[-] Não encontrado na wordlist. Tentando rainbow table...`,
    `[-] Hash não encontrado. Tente: john, hashcat.`,
  ];
}

function fakeSniff() {
  return [
    "[*] Iniciando packet sniffer em eth0...",
    "[*] Modo promíscuo: ATIVO",
    "",
    "12:03:41.183  192.168.1.55  →  8.8.8.8       DNS  query: google.com",
    "12:03:41.201  8.8.8.8       →  192.168.1.55  DNS  reply: 142.250.79.46",
    "12:03:41.210  192.168.1.55  →  142.250.79.46 TCP  SYN :443",
    "12:03:41.234  142.250.79.46 →  192.168.1.55  TCP  SYN-ACK",
    "12:03:41.241  192.168.1.55  →  142.250.79.46 TLS  ClientHello",
    "12:03:41.289  192.168.1.200 →  192.168.1.1   TCP  heartbeat :554 (RTSP)",
    "",
    "[*] 8 pacotes capturados. Pressione Ctrl+C para parar.",
  ];
}

function fakePing(host) {
  const h = host || "8.8.8.8";
  return [
    `PING ${h} (${h}) 56(84) bytes of data.`,
    `64 bytes from ${h}: icmp_seq=1 ttl=118 time=12.4 ms`,
    `64 bytes from ${h}: icmp_seq=2 ttl=118 time=11.9 ms`,
    `64 bytes from ${h}: icmp_seq=3 ttl=118 time=13.1 ms`,
    `64 bytes from ${h}: icmp_seq=4 ttl=118 time=12.7 ms`,
    ``,
    `--- ${h} ping statistics ---`,
    `4 packets transmitted, 4 received, 0% packet loss`,
    `rtt min/avg/max/mdev = 11.9/12.5/13.1/0.4 ms`,
  ];
}

function fakeCat(file) {
  const files = {
    "recon_notes.txt": [
      "# Notas de Reconhecimento",
      "Alvo: 192.168.1.0/24",
      "Data: 08/06/2026",
      "",
      "- Router principal: 192.168.1.1 (porta 80 aberta, admin/admin?)",
      "- Câmera IP: 192.168.1.200 (RTSP stream sem auth)",
      "- Host misterioso .55 — investigar",
    ],
    "targets.list": [
      "# Targets",
      "192.168.1.1",
      "192.168.1.55",
      "192.168.1.200",
    ],
    ".creds": ["Acesso negado: permissão insuficiente"],
    "exploit.py": [
      "#!/usr/bin/env python3",
      "# Módulo de exploit — use com responsabilidade",
      "import socket, sys",
      "",
      "TARGET = sys.argv[1] if len(sys.argv) > 1 else '127.0.0.1'",
      "PORT   = 4444",
      "",
      "def connect():",
      "    s = socket.socket()",
      "    s.connect((TARGET, PORT))",
      "    return s",
    ],
  };
  const content = files[file];
  if (!content) return [`cat: ${file}: Arquivo não encontrado`];
  return content;
}

function fakeExploit(id) {
  const modules = {
    "ms17-010": [
      "[*] Carregando exploit/windows/smb/ms17_010_eternalblue",
      "[*] Verificando alvo 192.168.1.55:445...",
      "[+] Alvo parece vulnerável!",
      "[*] Enviando payload...",
      "[*] Aguardando conexão reversa...",
      "[+] SHELL OBTIDA! Sessão 1 aberta.",
      "Microsoft Windows [Version 10.0.19045.4529]",
      "C:\\Windows\\system32>",
    ],
    "cam-rtsp": [
      "[*] Testando câmera em 192.168.1.200...",
      "[*] Stream: rtsp://192.168.1.200:554/live",
      "[+] Sem autenticação detectada!",
      "[+] Conectado ao feed ao vivo.",
    ],
  };
  const mod = modules[id];
  if (!mod) return [`[-] Módulo '${id}' não encontrado. Use: ms17-010, cam-rtsp`];
  return mod;
}

function processCommand(input) {
  const parts = input.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const arg = parts[1];

  switch (cmd) {
    case "help": return COMMANDS.help();
    case "whoami": return COMMANDS.whoami();
    case "ifconfig": return COMMANDS.ifconfig();
    case "ls": return COMMANDS.ls();
    case "matrix": return COMMANDS.matrix();
    case "exit": return COMMANDS.exit();
    case "nmap": return fakeNmap(arg);
    case "scan": return fakeScan(arg);
    case "crack": return fakeCrack(arg);
    case "sniff": return fakeSniff();
    case "ping": return fakePing(arg);
    case "cat": return fakeCat(arg);
    case "exploit": return fakeExploit(arg);
    case "clear": return ["__CLEAR__"];
    case "": return [];
    default:
      return [`bash: ${cmd}: comando não encontrado. Digite 'help' para ver os comandos.`];
  }
}

const SCANLINES = `
  repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.08) 2px,
    rgba(0,0,0,0.08) 4px
  )
`;

export default function HackerTerminal() {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [matrix, setMatrix] = useState(false);
  const [matrixChars, setMatrixChars] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const matrixRef = useRef(null);

  // Boot sequence
  useEffect(() => {
    let timers = [];
    BOOT_SEQUENCE.forEach(({ text, delay }) => {
      timers.push(
        setTimeout(() => {
          setLines((prev) => [...prev, { text, type: "boot" }]);
        }, delay)
      );
    });
    timers.push(
      setTimeout(() => {
        setBooted(true);
        setLines((prev) => [...prev, { text: "", type: "boot" }]);
      }, 3500)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  useEffect(() => {
    if (booted) inputRef.current?.focus();
  }, [booted]);

  // Matrix rain
  useEffect(() => {
    if (!matrix) {
      if (matrixRef.current) clearInterval(matrixRef.current);
      return;
    }
    const cols = Math.floor(window.innerWidth / 16);
    const drops = Array(cols).fill(1);
    const chars = "ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF";
    const canvas = document.getElementById("matrix-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    matrixRef.current = setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff41";
      ctx.font = "14px monospace";
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 33);
    return () => clearInterval(matrixRef.current);
  }, [matrix]);

  const submit = useCallback(() => {
    if (!booted) return;
    const cmd = input.trim();
    const prompt = `ghost@phantom:~$ ${cmd}`;
    const result = processCommand(cmd);

    if (result[0] === "__CLEAR__") {
      setLines([]);
      setInput("");
      return;
    }

    if (result[0] === "__MATRIX__") {
      setMatrix(true);
      setLines((prev) => [...prev, { text: prompt, type: "cmd" }, { text: "[*] Iniciando matrix... Clique para sair.", type: "output" }]);
      setInput("");
      if (cmd) setHistory((h) => [cmd, ...h]);
      setHistIdx(-1);
      return;
    }

    setLines((prev) => [
      ...prev,
      { text: prompt, type: "cmd" },
      ...result.map((t) => ({ text: t, type: "output" })),
    ]);
    setInput("");
    if (cmd) setHistory((h) => [cmd, ...h]);
    setHistIdx(-1);
  }, [input, booted]);

  const onKeyDown = (e) => {
    if (e.key === "Enter") { submit(); return; }
    if (e.key === "ArrowUp") {
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] || "");
    }
    if (e.key === "ArrowDown") {
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : history[idx]);
    }
  };

  const renderLine = (line, i) => {
    const color =
      line.type === "cmd" ? "#00ff41" :
      line.text?.startsWith("[+]") ? "#39ff14" :
      line.text?.startsWith("[-]") ? "#ff4444" :
      line.text?.startsWith("[*]") ? "#00cfff" :
      line.text?.startsWith("│") || line.text?.startsWith("├") || line.text?.startsWith("└") || line.text?.startsWith("┌") ? "#00ff41" :
      "#b0ffb0";

    return (
      <div
        key={i}
        style={{
          color,
          fontFamily: FONT,
          fontSize: "13px",
          lineHeight: "1.55",
          whiteSpace: "pre",
          textShadow: color === "#00ff41" || color === "#39ff14" ? "0 0 6px currentColor" : "none",
          minHeight: "1.55em",
        }}
      >
        {line.text}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#050a05",
        overflow: "hidden",
        position: "relative",
        cursor: "text",
      }}
      onClick={() => {
        if (matrix) { setMatrix(false); return; }
        inputRef.current?.focus();
      }}
    >
      {/* Matrix overlay */}
      {matrix && (
        <canvas
          id="matrix-canvas"
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            zIndex: 10,
          }}
        />
      )}

      {/* Scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: SCANLINES,
          pointerEvents: "none",
          zIndex: 5,
          opacity: 0.4,
        }}
      />

      {/* CRT glow border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 80px rgba(0,255,65,0.07), inset 0 0 4px rgba(0,255,65,0.2)",
          borderRadius: "4px",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />

      {/* Terminal content */}
      <div
        style={{
          height: "100%",
          overflowY: "auto",
          padding: "16px 20px",
          boxSizing: "border-box",
          scrollbarWidth: "thin",
          scrollbarColor: "#003300 #050a05",
        }}
      >
        {lines.map(renderLine)}

        {/* Input line */}
        {booted && !matrix && (
          <div style={{ display: "flex", alignItems: "center", marginTop: "2px" }}>
            <span
              style={{
                color: "#00ff41",
                fontFamily: FONT,
                fontSize: "13px",
                whiteSpace: "pre",
                textShadow: "0 0 6px #00ff41",
              }}
            >
              ghost@phantom:~${" "}
            </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#00ff41",
                fontFamily: FONT,
                fontSize: "13px",
                caretColor: "#00ff41",
                flex: 1,
                textShadow: "0 0 6px #00ff41",
              }}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
