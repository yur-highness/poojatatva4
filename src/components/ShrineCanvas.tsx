import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ArtSvg } from './ArtSvg';

export interface ShrineController {
  toggleDiya: () => void;
  setProgress: (p: number) => void;
}

interface ShrineCanvasProps {
  interactive?: boolean;
  autolight?: boolean;
  scrollDriven?: boolean;
  backgroundMode?: boolean;
  fit?: number;
  targetY?: number;
  className?: string;
  onDiyaChange?: (lit: boolean) => void;
  onReady?: (ctrl: ShrineController) => void;
}

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export const ShrineCanvas: React.FC<ShrineCanvasProps> = ({
  interactive = false,
  autolight = false,
  scrollDriven = false,
  backgroundMode = false,
  fit = 1.16,
  targetY = 0.7,
  className = '',
  onDiyaChange,
  onReady,
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [fallback, setFallback] = useState(false);
  const onDiyaChangeRef = useRef(onDiyaChange);
  const onReadyRef = useRef(onReady);
  onDiyaChangeRef.current = onDiyaChange;
  onReadyRef.current = onReady;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setFallback(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.touchAction = interactive ? 'pan-y' : 'auto';
    canvas.style.cursor = interactive ? 'grab' : 'default';
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);

    // Studio environment reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const disposables: Array<{ dispose: () => void }> = [envRT];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    // Procedural textures
    const createRadialTexture = (stops: Array<[number, string]>, isColor = false) => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d')!;
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      stops.forEach(([offset, col]) => grad.addColorStop(offset, col));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      const tex = track(new THREE.CanvasTexture(c));
      if (isColor) tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const glowTex = createRadialTexture(
      [
        [0, 'rgba(255,255,255,0.92)'],
        [0.35, 'rgba(255,255,255,0.28)'],
        [1, 'rgba(255,255,255,0)'],
      ],
      true
    );
    const shadowTex = createRadialTexture([
      [0, 'rgba(0,0,0,0.75)'],
      [0.55, 'rgba(0,0,0,0.32)'],
      [1, 'rgba(0,0,0,0)'],
    ]);

    const flameTex = (() => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 256;
      const ctx = c.getContext('2d')!;
      for (let k = 0; k < 14; k++) {
        const t = k / 13;
        const s = 1 - t * 0.78;
        ctx.save();
        ctx.translate(64, 238);
        ctx.scale(s, s);
        ctx.beginPath();
        ctx.moveTo(0, -228);
        ctx.bezierCurveTo(30, -150, 62, -90, 40, -30);
        ctx.bezierCurveTo(30, 0, -30, 0, -40, -30);
        ctx.bezierCurveTo(-62, -90, -30, -150, 0, -228);
        ctx.restore();
        ctx.fillStyle = `rgba(255,${Math.round(100 + t * 140)},${Math.round(20 + t * 170)},${0.09 + t * 0.1})`;
        ctx.fill();
      }
      ctx.fillStyle = 'rgba(110,140,255,0.28)';
      ctx.beginPath();
      ctx.ellipse(64, 224, 14, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      const tex = track(new THREE.CanvasTexture(c));
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    })();

    // PBR Materials
    const brassMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xf19a36,
        metalness: 0.92,
        roughness: 0.22,
        anisotropy: 0.65,
        side: THREE.DoubleSide,
      })
    );
    const darkStoneMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x083339,
        metalness: 0.35,
        roughness: 0.52,
      })
    );
    const oilMat = track(
      new THREE.MeshStandardMaterial({
        color: 0xb82e1e,
        roughness: 0.14,
        emissive: 0xf7ca6b,
        emissiveIntensity: 0,
      })
    );
    const wickMat = track(
      new THREE.MeshStandardMaterial({
        color: 0x1d0d0b,
        roughness: 0.95,
      })
    );
    const ringMat = track(
      new THREE.MeshBasicMaterial({
        color: 0x1cc8be,
        transparent: true,
        opacity: 0.6,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      })
    );
    const poolMat = track(
      new THREE.MeshBasicMaterial({
        map: glowTex,
        color: 0xf7ca6b,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0,
      })
    );

    // Carved Plinth
    const discGeo = track(new THREE.CylinderGeometry(4.4, 4.6, 0.3, 96));
    const disc = new THREE.Mesh(discGeo, darkStoneMat);
    scene.add(disc);

    const torusGeo = track(new THREE.TorusGeometry(4.35, 0.03, 8, 160));
    const rg = new THREE.Mesh(torusGeo, brassMat);
    rg.rotation.x = Math.PI / 2;
    rg.position.y = 0.15;
    scene.add(rg);

    const innerRingGeo = track(new THREE.RingGeometry(2.9, 2.93, 128));
    const rg2 = new THREE.Mesh(innerRingGeo, ringMat);
    rg2.rotation.x = -Math.PI / 2;
    rg2.position.y = 0.165;
    scene.add(rg2);

    const poolGeo = track(new THREE.PlaneGeometry(12, 12));
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = 0.18;
    scene.add(pool);

    // Multi-part Brass Diyas
    const bowlProfile = [
      [0, 0],
      [0.6, 0],
      [0.64, 0.05],
      [0.5, 0.1],
      [0.2, 0.2],
      [0.17, 0.34],
      [0.45, 0.44],
      [0.9, 0.64],
      [1.12, 0.9],
      [1.14, 0.96],
      [1.06, 0.97],
      [0.9, 0.84],
      [0.5, 0.76],
      [0, 0.74],
    ].map(([x, y]) => new THREE.Vector2(x, y));

    const bowlGeo = track(new THREE.LatheGeometry(bowlProfile, 64));
    const oilGeo = track(new THREE.CircleGeometry(0.68, 40));
    const wickGeo = track(new THREE.CylinderGeometry(0.035, 0.045, 0.26, 8));
    const shadowGeo = track(new THREE.CircleGeometry(1, 48));
    const shadowMat = track(
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    );

    interface LampState {
      flame: THREE.Sprite;
      glow: THREE.Sprite;
      v: number;
      tgt: number;
      at: number;
      delay: number;
    }

    const lamps: LampState[] = [];
    const pickTargets: THREE.Object3D[] = [];

    const addDiya = (x: number, z: number, scale: number, delay: number) => {
      const group = new THREE.Group();
      group.position.set(x, 0.15, z);
      group.scale.setScalar(scale);
      scene.add(group);

      const bowl = new THREE.Mesh(bowlGeo, brassMat);
      const oil = new THREE.Mesh(oilGeo, oilMat);
      oil.rotation.x = -Math.PI / 2;
      oil.position.y = 0.8;
      const wick = new THREE.Mesh(wickGeo, wickMat);
      wick.position.y = 0.92;
      group.add(bowl, oil, wick);
      [bowl, oil, wick].forEach((m) => {
        m.userData.act = 'diya';
        pickTargets.push(m);
      });

      const sh = new THREE.Mesh(shadowGeo, shadowMat);
      sh.rotation.x = -Math.PI / 2;
      sh.position.set(x, 0.162, z);
      sh.scale.setScalar(scale * 2.6);
      scene.add(sh);

      const flameMat = track(
        new THREE.SpriteMaterial({
          map: flameTex,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          opacity: 0,
        })
      );
      const flame = new THREE.Sprite(flameMat);
      flame.center.set(0.5, 0.07);
      flame.position.y = 1;
      group.add(flame);

      const glowSpriteMat = track(
        new THREE.SpriteMaterial({
          map: glowTex,
          color: 0xf5b97a,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          opacity: 0,
        })
      );
      const glow = new THREE.Sprite(glowSpriteMat);
      glow.position.y = 1.5;
      glow.scale.setScalar(4.2);
      group.add(glow);

      lamps.push({ flame, glow, v: 0, tgt: 0, at: 0, delay });
    };

    addDiya(0, 0.4, 1.25, 0);
    addDiya(-2.7, -1.5, 0.7, 0.7);
    addDiya(2.7, -1.5, 0.7, 1.1);

    // Turquoise / Sunburst Amber / Espresso Lighting Rig
    const hemi = new THREE.HemisphereLight(0x1cc8be, 0x260c09, 0.34);
    const keyLight = new THREE.DirectionalLight(0xf7ca6b, 0.42);
    keyLight.position.set(-6, 9, 8);
    const flamePoint = new THREE.PointLight(0xffb85c, 0, 16, 1.5);
    flamePoint.position.set(0, 2.6, 1);
    scene.add(hemi, keyLight, flamePoint);

    // Rising Ember Motes
    const moteCount = 40;
    const mp = new Float32Array(moteCount * 3);
    const ml = new Float32Array(moteCount).fill(9);
    for (let i = 0; i < moteCount; i++) mp[i * 3 + 1] = -50;
    const moteGeo = track(new THREE.BufferGeometry());
    moteGeo.setAttribute('position', new THREE.BufferAttribute(mp, 3));
    const moteMat = track(
      new THREE.PointsMaterial({
        size: 0.14,
        map: glowTex,
        color: 0xf7ca6b,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    const motes = new THREE.Points(moteGeo, moteMat);
    motes.frustumCulled = false;
    scene.add(motes);

    // State & Controller
    const clock = new THREE.Clock();
    const targetVec = new THREE.Vector3(0, targetY, 0);
    const pointerVec = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const pointers = new Map<number, number>();

    let isLit = false;
    let intro = 0;
    let yawOffset = 0;
    let scrollProg = 0;
    let stage = -1;
    let autoLitDone = false;
    let visible = false;
    let frameId = 0;
    let movedDist = 0;
    let disposed = false;

    const setAll = (val: boolean) => {
      isLit = val;
      const t = clock.elapsedTime;
      lamps.forEach((lamp, idx) => {
        lamp.tgt = val ? 1 : 0;
        lamp.at = t + (val ? lamp.delay : (lamps.length - 1 - idx) * 0.15);
      });
      onDiyaChangeRef.current?.(val);
    };

    const setProgress = (p: number) => {
      scrollProg = Math.min(1, Math.max(0, p));
      if (backgroundMode) return;
      const s = scrollProg < 0.34 ? 0 : scrollProg < 0.68 ? 1 : 2;
      if (s === stage) return;
      stage = s;
      const t = clock.elapsedTime;
      lamps.forEach((lamp, i) => {
        const want = s === 0 ? 0 : s === 1 ? (i === 0 ? 1 : 0) : 1;
        lamp.tgt = want;
        lamp.at = t + (want ? lamp.delay : 0);
      });
    };

    onReadyRef.current?.({
      toggleDiya: () => setAll(!isLit),
      setProgress,
    });

    const hitTest = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointerVec.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1
      );
      raycaster.setFromCamera(pointerVec, camera);
      return raycaster.intersectObjects(pickTargets, false).length > 0;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, e.clientX);
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
      movedDist = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      const prevX = pointers.get(e.pointerId);
      if (prevX === undefined) {
        canvas.style.cursor = hitTest(e) ? 'pointer' : 'grab';
        return;
      }
      const dx = e.clientX - prevX;
      pointers.set(e.pointerId, e.clientX);
      movedDist += Math.abs(dx);
      yawOffset = Math.min(1.4, Math.max(-1.4, yawOffset - dx * 0.006));
    };

    const onPointerUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      canvas.style.cursor = 'grab';
      if (movedDist < 6 && hitTest(e)) setAll(!isLit);
    };

    const onPointerCancel = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      canvas.style.cursor = 'grab';
    };

    if (interactive) {
      canvas.addEventListener('pointerdown', onPointerDown);
      canvas.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerup', onPointerUp);
      canvas.addEventListener('pointercancel', onPointerCancel);
    }

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    if (!isSoftwareGl) {
      try {
        renderer.compile(scene, camera);
      } catch {
        // ignore shader prewarm failure
      }
    }

    const afterDraw = (cb: () => void) => {
      if (disposed) return;
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const frame = () => {
      if (!visible || disposed) {
        frameId = 0;
        return;
      }

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      lamps.forEach((lamp, i) => {
        if (t > lamp.at) {
          lamp.v += (lamp.tgt - lamp.v) * Math.min(1, dt * 2.4);
        }
        const k = t * 7 + i * 2.1;
        const fk = 1 + 0.05 * Math.sin(k) + 0.04 * Math.sin(k * 2.7) + 0.02 * Math.sin(k * 5.3);
        const v = Math.max(0.001, lamp.v);
        lamp.flame.material.opacity = lamp.v;
        lamp.flame.scale.set(0.85 * v * (1 + 0.03 * Math.sin(k * 1.3)), 1.7 * v * fk, 1);
        lamp.flame.position.x = 0.012 * Math.sin(k * 0.9);
        lamp.glow.material.opacity = lamp.v * (0.4 + 0.04 * Math.sin(k * 1.7));
      });

      const lit = lamps[0].v;
      const avg = lamps.reduce((acc, l) => acc + l.v, 0) / lamps.length;
      flamePoint.intensity = (lit * 1.8 + avg * 0.8) * (1 + 0.04 * Math.sin(t * 9) + 0.03 * Math.sin(t * 23));
      poolMat.opacity = avg * 0.55;
      oilMat.emissiveIntensity = avg * 0.9;
      hemi.intensity = 0.24 + avg * 0.12;
      keyLight.intensity = 0.3 + avg * 0.25;
      brassMat.envMapIntensity = 0.65 + avg * 0.55;
      darkStoneMat.envMapIntensity = 0.4 + avg * 0.3;

      for (let i = 0; i < moteCount; i++) {
        const k = i * 3;
        if (ml[i] >= 1) {
          if (lit > 0.5 && Math.random() < 0.03) {
            ml[i] = 0;
            mp[k] = (Math.random() - 0.5) * 0.5;
            mp[k + 1] = 1.9;
            mp[k + 2] = 0.4 + (Math.random() - 0.5) * 0.5;
          } else {
            mp[k + 1] = -50;
          }
        } else {
          ml[i] += dt * 0.12;
          mp[k + 1] += dt * 0.5;
          mp[k] += Math.sin(t + i) * dt * 0.12;
        }
      }
      moteGeo.attributes.position.needsUpdate = true;
      moteMat.opacity = lit * 0.55;

      intro = Math.min(1, intro + dt / (reduceMotion ? 0.01 : 3.2));
      const e = 1 - Math.pow(1 - intro, 3);
      if (!pointers.size) yawOffset -= yawOffset * dt * 0.5;

      const angle =
        (reduceMotion || scrollDriven
          ? 0
          : backgroundMode
          ? t * 0.14 + Math.sin(t * 0.28) * 0.35
          : Math.sin(t * 0.18) * 0.32) +
        yawOffset +
        (1 - e) * 0.9 +
        (scrollDriven ? -0.5 + scrollProg * 1.05 : backgroundMode ? scrollProg * 0.85 : 0);

      const asp = camera.aspect || 1;
      const isPortrait = asp < 1;
      // Pull camera back proportionally on narrow portrait viewports so the full 3-diya plinth
      // stays gracefully framed inside the mobile hero mandala halo without side clipping.
      const portraitZoom = isPortrait
        ? Math.min(2.35, (backgroundMode ? 1.08 : 0.96) / Math.max(asp, 0.4))
        : 1;
      const rad =
        13.5 *
        fit *
        portraitZoom *
        (1 + (1 - e) * 0.7) *
        (scrollDriven ? 1 - 0.18 * scrollProg : backgroundMode ? 1 - 0.12 * scrollProg : 1);

      const driftAmp = isPortrait ? 0.28 : 0.55;
      const bobY = !reduceMotion && backgroundMode ? Math.sin(t * 0.55) * (isPortrait ? 0.16 : 0.24) : 0;
      const driftX = !reduceMotion && backgroundMode ? Math.sin(t * 0.24) * driftAmp : 0;
      const baseTargetY = isPortrait && backgroundMode ? targetVec.y - 0.1 : targetVec.y;
      const liveTarget = new THREE.Vector3(driftX, baseTargetY + bobY, 0);

      camera.position.set(
        driftX + rad * Math.sin(1.2) * Math.sin(angle),
        baseTargetY + bobY + rad * Math.cos(1.2),
        rad * Math.sin(1.2) * Math.cos(angle)
      );
      camera.lookAt(liveTarget);

      if (autolight && !autoLitDone && intro > 0.45) {
        autoLitDone = true;
        setAll(true);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(frame);
      } else {
        frameId = requestAnimationFrame(frame);
      }
    };

    const intersectionObserver = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible && !frameId && !disposed) {
        clock.getDelta();
        frameId = requestAnimationFrame(frame);
      }
    });
    intersectionObserver.observe(host);

    if (reduceMotion && scrollDriven) {
      setProgress(1);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (interactive) {
        canvas.removeEventListener('pointerdown', onPointerDown);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerup', onPointerUp);
        canvas.removeEventListener('pointercancel', onPointerCancel);
      }
      disposables.forEach((d) => {
        try {
          d.dispose();
        } catch {
          // ignore
        }
      });
      renderer.dispose();
      if (canvas.parentElement === host) host.removeChild(canvas);
    };
  }, [interactive, autolight, scrollDriven, backgroundMode, fit, targetY]);

  if (fallback) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <ArtSvg name="diya" className="w-3/5 text-[#FDF2DA]" />
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      className={`shrine-host ${className}`}
      role="img"
      aria-label="Interactive 3D brass diya shrine"
    />
  );
};
