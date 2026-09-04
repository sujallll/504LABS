// Interactive Brutalist Generative Canvas
export class PlaygroundCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.mode = 'ascii'; // 'ascii', 'wireframe', 'matrix'
    this.mouse = { x: -1000, y: -1000, active: false, targetX: 0, targetY: 0 };
    this.time = 0;
    this.animId = null;
    this.charset = [' ', '.', '·', ':', '+', '*', '#', '%', '@', '5', '0', '4', 'X', '░', '▒', '▓'];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.active = true;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.active = false;
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    this.start();
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const width = parent.clientWidth || 800;
    const height = 450;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.scale(dpr, dpr);
    this.displayWidth = width;
    this.displayHeight = height;
  }

  setMode(newMode) {
    this.mode = newMode;
  }

  start() {
    const loop = () => {
      this.time += 0.03;
      this.render();
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  render() {
    const w = this.displayWidth;
    const h = this.displayHeight;
    if (!w || !h) return;

    // Dark clear
    this.ctx.fillStyle = '#050505';
    this.ctx.fillRect(0, 0, w, h);

    if (this.mode === 'ascii') {
      this.renderAscii(w, h);
    } else if (this.mode === 'wireframe') {
      this.renderWireframe(w, h);
    } else if (this.mode === 'matrix') {
      this.renderMatrix(w, h);
    }

    // Overlay boundary marks & HUD coordinates
    this.renderHUD(w, h);
  }

  renderAscii(w, h) {
    const cols = Math.floor(w / 14);
    const rows = Math.floor(h / 14);
    const cellW = w / cols;
    const cellH = h / rows;

    this.ctx.font = '11px "Space Mono", monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * cellW + cellW / 2;
        const y = j * cellH + cellH / 2;

        const dx = x - this.mouse.x;
        const dy = y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Sine wave calculations
        const wave1 = Math.sin(i * 0.15 + this.time);
        const wave2 = Math.cos(j * 0.15 - this.time * 0.8);
        const wave3 = Math.sin((i + j) * 0.1 + this.time * 0.5);

        let val = (wave1 + wave2 + wave3) / 3;

        // Mouse disturbance
        if (dist < 140) {
          const force = (1 - dist / 140) * 1.8;
          val += force * Math.sin(dist * 0.1 - this.time * 4);
        }

        const normalized = Math.max(0, Math.min(1, (val + 1) / 2));
        const charIdx = Math.floor(normalized * (this.charset.length - 1));
        const char = this.charset[charIdx];

        if (dist < 90) {
          this.ctx.fillStyle = '#E5B83B';
        } else if (normalized > 0.65) {
          this.ctx.fillStyle = '#FFFFFF';
        } else if (normalized > 0.35) {
          this.ctx.fillStyle = 'rgba(229, 184, 59, 0.45)';
        } else {
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        }

        this.ctx.fillText(char, x, y);
      }
    }
  }

  renderWireframe(w, h) {
    const cols = 28;
    const rows = 18;
    const startX = 40;
    const endX = w - 40;
    const startY = 40;
    const endY = h - 40;
    const stepX = (endX - startX) / (cols - 1);
    const stepY = (endY - startY) / (rows - 1);

    const points = [];

    for (let j = 0; j < rows; j++) {
      points[j] = [];
      for (let i = 0; i < cols; i++) {
        const x = startX + i * stepX;
        const y = startY + j * stepY;

        const dx = x - this.mouse.x;
        const dy = y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let z = Math.sin(i * 0.3 + this.time) * Math.cos(j * 0.3 + this.time * 0.7) * 20;
        if (dist < 160) {
          z -= (1 - dist / 160) * 45 * Math.cos(dist * 0.08 - this.time * 3);
        }

        points[j][i] = { x, y: y + z, z };
      }
    }

    // Draw horizontal lines
    this.ctx.lineWidth = 1;
    for (let j = 0; j < rows; j++) {
      this.ctx.beginPath();
      for (let i = 0; i < cols; i++) {
        const p = points[j][i];
        if (i === 0) this.ctx.moveTo(p.x, p.y);
        else this.ctx.lineTo(p.x, p.y);
      }
      this.ctx.strokeStyle = (j % 2 === 0) ? 'rgba(229, 184, 59, 0.75)' : 'rgba(255, 255, 255, 0.25)';
      this.ctx.stroke();
    }

    // Draw vertical lines
    for (let i = 0; i < cols; i++) {
      this.ctx.beginPath();
      for (let j = 0; j < rows; j++) {
        const p = points[j][i];
        if (j === 0) this.ctx.moveTo(p.x, p.y);
        else this.ctx.lineTo(p.x, p.y);
      }
      this.ctx.strokeStyle = (i % 3 === 0) ? 'rgba(229, 184, 59, 0.5)' : 'rgba(255, 255, 255, 0.15)';
      this.ctx.stroke();
    }

    // Draw nodes
    for (let j = 0; j < rows; j += 2) {
      for (let i = 0; i < cols; i += 2) {
        const p = points[j][i];
        this.ctx.fillStyle = '#E5B83B';
        this.ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      }
    }
  }

  renderMatrix(w, h) {
    const cols = Math.floor(w / 18);
    this.ctx.font = '12px "Space Mono", monospace';

    for (let i = 0; i < cols; i++) {
      const x = i * 18 + 9;
      const speed = ((i * 13) % 7 + 3) * 0.8;
      const offset = (this.time * speed * 25 + (i * 47)) % (h + 100);

      const rows = 12;
      for (let j = 0; j < rows; j++) {
        const y = offset - j * 16;
        if (y < 0 || y > h) continue;

        const charCode = 33 + Math.floor(((i * 7 + j * 13 + Math.floor(this.time * 5)) % 80));
        const char = String.fromCharCode(charCode);

        const dist = Math.abs(x - this.mouse.x);
        if (j === 0) {
          this.ctx.fillStyle = '#FFFFFF';
        } else if (dist < 80) {
          this.ctx.fillStyle = '#E5B83B';
        } else {
          const alpha = 1 - (j / rows);
          this.ctx.fillStyle = `rgba(229, 184, 59, ${alpha * 0.6})`;
        }

        this.ctx.fillText(char, x, y);
      }
    }
  }

  renderHUD(w, h) {
    this.ctx.font = '10px "Space Mono", monospace';
    this.ctx.fillStyle = 'rgba(229, 184, 59, 0.8)';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`SYS.MODE // ${this.mode.toUpperCase()}`, 16, 22);

    this.ctx.textAlign = 'right';
    const coords = this.mouse.active
      ? `CURSOR: [${Math.floor(this.mouse.x)}, ${Math.floor(this.mouse.y)}]`
      : `IDLE: [STANDBY]`;
    this.ctx.fillText(coords, w - 16, 22);

    // Crosshair corners
    this.ctx.strokeStyle = '#E5B83B';
    this.ctx.lineWidth = 1;

    const size = 8;
    // Top-left
    this.ctx.beginPath();
    this.ctx.moveTo(8, 8 + size);
    this.ctx.lineTo(8, 8);
    this.ctx.lineTo(8 + size, 8);
    this.ctx.stroke();

    // Top-right
    this.ctx.beginPath();
    this.ctx.moveTo(w - 8 - size, 8);
    this.ctx.lineTo(w - 8, 8);
    this.ctx.lineTo(w - 8, 8 + size);
    this.ctx.stroke();

    // Bottom-left
    this.ctx.beginPath();
    this.ctx.moveTo(8, h - 8 - size);
    this.ctx.lineTo(8, h - 8);
    this.ctx.lineTo(8 + size, h - 8);
    this.ctx.stroke();

    // Bottom-right
    this.ctx.beginPath();
    this.ctx.moveTo(w - 8 - size, h - 8);
    this.ctx.lineTo(w - 8, h - 8);
    this.ctx.lineTo(w - 8, h - 8 - size);
    this.ctx.stroke();
  }
}
