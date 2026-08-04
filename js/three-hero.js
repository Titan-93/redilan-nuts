/* =========================================================================
   THREE-HERO.JS  —  دیمەنی سێ-ڕەهەندی هیرۆ (Three.js hero background)
   =========================================================================
   کۆمەڵێک شێوازی سادەی وەک "گوێز" لە دەوری لۆگۆکە دەسوڕێنەوە، بە کارلێکی
   مووسکە. تەنها لە لاپەڕەی سەرەکیدا کاردەکات و تەنها ئەگەر بەکارهێنەر
   داوای کەمکردنەوەی جوڵە نەکردبێت و ئامێرەکە بەهێز بێت.

   A cluster of simple low-poly "nut" shapes gently orbit the hero, with
   subtle mouse parallax. Only runs on the home page, and only if the
   visitor hasn't asked for reduced motion.

   تێبینی / Note: this loads Three.js from a public CDN as an ES module.
   If you'd rather not depend on a CDN, download the module build of
   Three.js into js/vendor/three.module.js and change the import URL below.
   ========================================================================= */

const canvas = document.getElementById("heroCanvas");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// لابردنی دیمەنەکە بۆ ئامێری کەم-توانا یان کاتێک جوڵەی کەم داواکراوە
// Skip entirely on very small screens or when reduced motion is requested —
// the hero still looks complete without it, this is pure ambience.
if (!canvas || prefersReducedMotion || window.innerWidth < 480) {
  if (canvas) canvas.style.display = "none";
} else {
  initHeroScene(canvas);
}

async function initHeroScene(canvasEl) {
  let THREE;
  try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
  } catch (err) {
    // ئەگەر CDNـەکە نەگەیشت (بۆ نموونە بێ-ئینتەرنێت)، هیرۆ بەبێ ئەفێکت
    // بەردەوام دەبێت — هیچ شتێک ناشکێت.
    // If the CDN is unreachable (e.g. offline), the hero simply stays
    // without the effect — nothing else breaks.
    console.warn("Three.js hero skipped:", err);
    return;
  }

  const isSmall = window.innerWidth < 900;
  const particleCount = isSmall ? 8 : 14;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvasEl.clientWidth / canvasEl.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvasEl.clientWidth, canvasEl.clientHeight, false);

  // ڕووناکی / Lighting — warm, soft, matches the roasted-nut palette
  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  const keyLight = new THREE.DirectionalLight(0xffe4b0, 0.9);
  keyLight.position.set(4, 5, 6);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x2f6fed, 0.35);
  rimLight.position.set(-5, -3, -4);
  scene.add(rimLight);

  // گروپی "گوێزەکان" / The floating "nut" group
  const group = new THREE.Group();
  scene.add(group);

  const materials = [
    new THREE.MeshStandardMaterial({ color: 0xc8862e, roughness: 0.45, metalness: 0.15 }), // gold
    new THREE.MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.55, metalness: 0.1 }),   // walnut brown
    new THREE.MeshStandardMaterial({ color: 0x0b3e8c, roughness: 0.35, metalness: 0.25 }),  // brand blue
  ];

  const nuts = [];
  for (let i = 0; i < particleCount; i++) {
    const size = 0.28 + Math.random() * 0.4;
    const geometry = new THREE.IcosahedronGeometry(size, 0);
    const mesh = new THREE.Mesh(geometry, materials[i % materials.length]);

    const radius = 3.2 + Math.random() * 2.6;
    const angle = (i / particleCount) * Math.PI * 2;
    mesh.position.set(
      Math.cos(angle) * radius * (isSmall ? 0.75 : 1),
      (Math.random() - 0.5) * 4.2,
      Math.sin(angle) * radius * 0.4 - 1
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    mesh.userData.spinSpeed = 0.15 + Math.random() * 0.3;
    mesh.userData.floatOffset = Math.random() * Math.PI * 2;
    mesh.userData.floatSpeed = 0.4 + Math.random() * 0.4;
    mesh.userData.baseY = mesh.position.y;

    group.add(mesh);
    nuts.push(mesh);
  }

  // کارلێکی مووسکە (تەنها ئامێری خاڵی) / Mouse parallax (pointer devices only)
  let targetRotX = 0, targetRotY = 0;
  const canHover = window.matchMedia("(hover: hover)").matches;
  if (canHover) {
    window.addEventListener("mousemove", (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetRotY = nx * 0.25;
      targetRotX = ny * 0.15;
    });
  }

  // ڕاگرتنی ئانیمەیشن کاتێک هیرۆ لە دیمەندا نییە / Pause when hero is off-screen
  let isVisible = true;
  const observer = new IntersectionObserver(
    (entries) => { entries.forEach(entry => { isVisible = entry.isIntersecting; }); },
    { threshold: 0 }
  );
  observer.observe(canvasEl);

  const clock = new THREE.Clock();
  let rafId;

  function animate() {
    rafId = requestAnimationFrame(animate);
    if (!isVisible || document.hidden) return;

    const t = clock.getElapsedTime();

    nuts.forEach(mesh => {
      mesh.rotation.x += 0.003 * mesh.userData.spinSpeed;
      mesh.rotation.y += 0.004 * mesh.userData.spinSpeed;
      mesh.position.y = mesh.userData.baseY + Math.sin(t * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 0.35;
    });

    group.rotation.y += (targetRotY - group.rotation.y) * 0.04;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.04;

    renderer.render(scene, camera);
  }
  animate();

  // گونجاندن لەگەڵ گۆڕینی قەبارەی پەڕە / Resize handling
  function handleResize() {
    const width = canvasEl.clientWidth;
    const height = canvasEl.clientHeight;
    if (width === 0 || height === 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
  window.addEventListener("resize", handleResize);

  // پاکژکردنەوە ئەگەر پەڕەکە دابخرێت (بۆ خۆپاراستنی مێموری)
  // Clean up if the page unloads, to release GPU memory
  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(rafId);
    observer.disconnect();
    nuts.forEach(m => { m.geometry.dispose(); });
    materials.forEach(m => m.dispose());
    renderer.dispose();
  });
}
