import { useEffect, useRef, useState } from "react";

type Cell = { x: number; y: number };
type Dir = { x: number; y: number };

/* The snake runs in two modes and they want different cadences. Attract mode
   ambles along on its own beside the hero copy; play mode wants the classic
   Nokia responsiveness. Either way the field is one big button, so a reader
   can take the controls whenever they like. */
const TICK_ATTRACT_MS = 235;
const TICK_PLAY_MS = 145;
/* Classic snake tightens as you grow. Caps out so it stays steerable. */
const TICK_PLAY_MIN_MS = 95;
const TICK_PLAY_RAMP_MS = 2.5;
const SUN = "#ffd02f";

const FOOD_SKIN = "#e23b2f";
const FOOD_EDGE = "#7a1f18";
const FOOD_SHINE = "#ffe3d6";
const FOOD_LEAF = "#0fa20b";
const FOOD_STEM = "#5c3a1b";
const FOOD_SCALE = 1.15;
const FOOD_PULSE = 0.07;

const FOOD_SPRITE = [
  "...t....",
  "...tll..",
  ".oooooo.",
  "osfffffo",
  "osfffffo",
  "offffffo",
  ".offffo.",
  "..oooo..",
];

const FOOD_PIXELS: Record<string, string> = {
  t: FOOD_STEM,
  l: FOOD_LEAF,
  o: FOOD_EDGE,
  f: FOOD_SKIN,
  s: FOOD_SHINE,
};

/* Grows through the page's own tints — ink, then the sky, leaf, sun and coral
   the "what drives me" pills are edged in — instead of the electric blue and
   magenta it had, which came from nowhere else on the site. */
const BODY_TIERS = ["#171717", "#0892c4", "#369e4e", "#bd9a2a", "#d15d51"];

const BODY_TIER_AT = [1, 6, 11, 17, 24];

const bodyTier = (rank: number) => {
  let tier = 0;
  for (let i = 1; i < BODY_TIER_AT.length; i += 1) {
    if (rank >= BODY_TIER_AT[i]) tier = i;
  }
  return BODY_TIERS[tier];
};

/** Where an apple was eaten, in viewport coordinates. */
export type EatPoint = { x: number; y: number };

type PixelSnakeProps = {
  onEat?: (score: number, at: EatPoint) => void;
};

export function PixelSnake({ onEat }: PixelSnakeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const playingRef = useRef(false);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  const onEatRef = useRef(onEat);
  useEffect(() => {
    onEatRef.current = onEat;
  }, [onEat]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const head = new Image();
    head.src = "/assets/icon-sun.png";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let cell = 28;
    let cols = 12;
    let rows = 6;
    let snake: Cell[] = [];
    let dir: Dir = { x: 1, y: 0 };
    let queued: Dir | null = null;
    let food: Cell = { x: 0, y: 0 };
    let last = 0;
    let acc = 0;
    let raf = 0;
    let flash = 0;
    let scoreValue = 0;

    const wrapCell = (c: Cell): Cell => ({
      x: (c.x + cols) % cols,
      y: (c.y + rows) % rows,
    });

    const hits = (c: Cell, body: Cell[]) =>
      body.some((s) => s.x === c.x && s.y === c.y);

    const gridOffset = () => ({
      x: (canvas.clientWidth - cols * cell) / 2,
      y: (canvas.clientHeight - rows * cell) / 2,
    });

    const cellCenter = (c: Cell) => {
      const rect = canvas.getBoundingClientRect();
      const off = gridOffset();
      return {
        x: rect.left + off.x + c.x * cell + cell / 2,
        y: rect.top + off.y + c.y * cell + cell / 2,
      };
    };

    const placeFood = () => {
      let spot: Cell;
      let guard = 0;
      do {
        spot = {
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows),
        };
        guard += 1;
      } while (hits(spot, snake) && guard < 200);
      food = spot;
    };

    const reset = () => {
      const midY = Math.floor(rows / 2);
      snake = [
        { x: 3, y: midY },
        { x: 2, y: midY },
        { x: 1, y: midY },
      ];
      dir = { x: 1, y: 0 };
      queued = null;
      scoreValue = 0;
      setScore(0);
      placeFood();
    };

    const resize = () => {
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      if (!width || !height) return;

      cell = Math.max(22, Math.min(38, Math.round(width / 34)));
      cols = Math.max(8, Math.floor(width / cell));
      rows = Math.max(4, Math.floor(height / cell));

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!snake.length || snake.some((s) => s.x >= cols || s.y >= rows)) {
        reset();
      }
    };

    // Attract mode: greedily steer toward food without eating itself.
    const autoSteer = () => {
      const options: Dir[] = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ];
      const current = snake[0];
      const scored = options
        .filter((o) => !(o.x === -dir.x && o.y === -dir.y))
        .map((o) => {
          const next = wrapCell({ x: current.x + o.x, y: current.y + o.y });
          const safe = !hits(next, snake.slice(0, -1));
          const dx = Math.min(
            Math.abs(next.x - food.x),
            cols - Math.abs(next.x - food.x),
          );
          const dy = Math.min(
            Math.abs(next.y - food.y),
            rows - Math.abs(next.y - food.y),
          );
          return { dir: o, safe, dist: dx + dy };
        })
        .filter((o) => o.safe)
        .sort((a, b) => a.dist - b.dist);

      if (scored.length) dir = scored[0].dir;
    };

    const step = () => {
      if (playingRef.current) {
        if (queued) {
          dir = queued;
          queued = null;
        }
      } else {
        autoSteer();
      }

      const next = wrapCell({ x: snake[0].x + dir.x, y: snake[0].y + dir.y });

      if (hits(next, snake.slice(0, -1))) {
        flash = 10;
        setBest((b) => Math.max(b, scoreValue));
        reset();
        return;
      }

      snake.unshift(next);

      if (next.x === food.x && next.y === food.y) {
        scoreValue += 1;
        setScore(scoreValue);
        onEatRef.current?.(scoreValue, cellCenter(food));
        placeFood();
      } else {
        snake.pop();
      }
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const { x: offsetX, y: offsetY } = gridOffset();

      ctx.clearRect(0, 0, width, height);

      if (flash > 0) {
        ctx.fillStyle = `rgba(23, 23, 23, ${flash / 90})`;
        ctx.fillRect(0, 0, width, height);
        flash -= 1;
      }

      // food
      const pulse = reducedMotion.matches
        ? 0
        : Math.sin(Date.now() / 260) * FOOD_PULSE;
      const fSize = cell * (FOOD_SCALE + pulse);
      const fUnit = fSize / FOOD_SPRITE.length;
      const fx = offsetX + food.x * cell + (cell - fSize) / 2;
      const fy = offsetY + food.y * cell + (cell - fSize) / 2;
      for (let r = 0; r < FOOD_SPRITE.length; r += 1) {
        const row = FOOD_SPRITE[r];
        for (let c = 0; c < row.length; c += 1) {
          const paint = FOOD_PIXELS[row[c]];
          if (!paint) continue;
          ctx.fillStyle = paint;
          ctx.fillRect(
            fx + c * fUnit,
            fy + r * fUnit,
            fUnit + 0.5,
            fUnit + 0.5,
          );
        }
      }

      // body: a gentle taper toward the tail, corners softened so the run
      // reads as beads rather than a stack of hard squares
      for (let i = snake.length - 1; i >= 1; i -= 1) {
        const seg = snake[i];
        const t = i / snake.length;
        const size = cell * (0.8 - t * 0.2);
        const x = offsetX + seg.x * cell + (cell - size) / 2;
        const y = offsetY + seg.y * cell + (cell - size) / 2;

        ctx.fillStyle = bodyTier(snake.length - i);
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, size * 0.24);
        ctx.fill();
      }

      // head
      const h = snake[0];
      const hSize = cell * 1.5;
      const hx = offsetX + h.x * cell + (cell - hSize) / 2;
      const hy = offsetY + h.y * cell + (cell - hSize) / 2;
      if (head.complete && head.naturalWidth) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(head, hx, hy, hSize, hSize);
      } else {
        ctx.fillStyle = SUN;
        ctx.fillRect(hx, hy, hSize, hSize);
      }
    };

    const tickMs = () => {
      if (!playingRef.current) return TICK_ATTRACT_MS;
      return Math.max(
        TICK_PLAY_MIN_MS,
        TICK_PLAY_MS - scoreValue * TICK_PLAY_RAMP_MS,
      );
    };

    const loop = (t: number) => {
      if (!last) last = t;
      acc += t - last;
      last = t;

      /* Reduced motion: hold the idle loop still rather than crawling behind
         the copy. Pressing Play still runs the game, because that motion is
         asked for rather than ambient. */
      if (reducedMotion.matches && !playingRef.current) {
        acc = 0;
        draw();
        raf = requestAnimationFrame(loop);
        return;
      }

      const tick = tickMs();
      /* A long stall (backgrounded tab, or crossing a mode change) shouldn't
         pay itself back as a burst of steps. */
      if (acc > tick * 3) acc = tick;

      while (acc >= tick) {
        step();
        acc -= tick;
      }

      draw();
      raf = requestAnimationFrame(loop);
    };

    const KEYS: Record<string, Dir> = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      d: { x: 1, y: 0 },
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && playingRef.current) {
        setPlaying(false);
        return;
      }

      const want = KEYS[e.key];
      if (!want) return;
      if (!playingRef.current) return;

      // Arrow keys scroll the page now, so hold it while steering.
      e.preventDefault();
      e.stopPropagation();

      if (want.x === -dir.x && want.y === -dir.y) return;
      queued = want;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    window.addEventListener("keydown", onKeyDown, { capture: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, []);

  return (
    <div className="snake" data-playing={playing ? "true" : "false"}>
      <div className="snake-hud">
        <span className="snake-score">
          {score} {best > 0 ? `· best ${best}` : ""}
        </span>
        {/* Starting is the field's job now, so the HUD only offers the way out. */}
        {playing ? (
          <button
            className="snake-toggle"
            type="button"
            onClick={() => setPlaying(false)}
          >
            Stop
          </button>
        ) : null}
      </div>

      <div className="snake-field" ref={wrapRef}>
        <canvas className="snake-canvas" ref={canvasRef} />

        {/* The whole field is the control; the caption just says so. A big pill
            in the middle turned an ambient board into a demand, and covered
            the snake it was inviting you to play with. */}
        {playing ? null : (
          <button
            className="snake-start"
            type="button"
            onClick={() => setPlaying(true)}
          >
            <span className="snake-start-label">(Click anywhere to play)</span>
          </button>
        )}
      </div>
    </div>
  );
}
