const canvas = document.getElementById("solarCanvas");
const ctx = canvas.getContext("2d");
const viewportCard = canvas.parentElement;

const panelEmpty = document.getElementById("panelEmpty");
const panelContent = document.getElementById("panelContent");
const closePanelBtn = document.getElementById("closePanelBtn");
const helpBtn = document.getElementById("helpBtn");
const helpModal = document.getElementById("helpModal");
const closeHelpBtn = document.getElementById("closeHelpBtn");
const loadingScreen = document.getElementById("loadingScreen");
const loadingProgress = document.getElementById("loadingProgress");
const appShell = document.getElementById("appShell");
const floatingTip = document.getElementById("floatingTip");
const toggleLabelsBtn = document.getElementById("toggleLabelsBtn");
const toggleControlsBtn = document.getElementById("toggleControlsBtn");
const controlsBar = document.getElementById("controlsBar");
const controlsWrap = document.querySelector(".controls-wrap");
const tourToggleBtn = document.getElementById("tourToggleBtn");
const introTourModal = document.getElementById("introTourModal");
const startIntroTourBtn = document.getElementById("startIntroTourBtn");
const notNowIntroTourBtn = document.getElementById("notNowIntroTourBtn");
const tourCard = document.getElementById("tourCard");
const measureCard = document.getElementById("measureCard");
const measureToolbarBtn = document.getElementById("measureToolbarBtn");
const measureCloseBtn = document.getElementById("measureCloseBtn");
const measureUnitButtons = Array.from(document.querySelectorAll("#measureUnits .measure-unit"));
const measureLabel = document.getElementById("measureLabel");
const measureValue = document.getElementById("measureValue");
const speedCard = document.getElementById("speedCard");
const speedToolbarBtn = document.getElementById("speedToolbarBtn");
const speedCloseBtn = document.getElementById("speedCloseBtn");
const speedButtons = Array.from(document.querySelectorAll("#speedOptions .measure-unit"));
const speedValue = document.getElementById("speedValue");
const compareToolbarBtn = document.getElementById("compareToolbarBtn");
const compareBackdrop = document.getElementById("compareBackdrop");
const compareCard = document.getElementById("compareCard");
const compareCloseBtn = document.getElementById("compareCloseBtn");
const compareFirstSelect = document.getElementById("compareFirstSelect");
const compareSecondSelect = document.getElementById("compareSecondSelect");
const compareLaunchBtn = document.getElementById("compareLaunchBtn");
const comparisonOverlay = document.getElementById("comparisonOverlay");
const comparisonCloseBtn = document.getElementById("comparisonCloseBtn");
const comparisonTitle = document.getElementById("comparisonTitle");
const comparisonSummary = document.getElementById("comparisonSummary");
const comparisonNameA = document.getElementById("comparisonNameA");
const comparisonNameB = document.getElementById("comparisonNameB");
const comparisonSizeA = document.getElementById("comparisonSizeA");
const comparisonSizeB = document.getElementById("comparisonSizeB");
const comparisonVisualA = document.getElementById("comparisonVisualA");
const comparisonVisualB = document.getElementById("comparisonVisualB");
const comparisonStage = document.getElementById("comparisonStage");
const simulationClock = document.getElementById("simulationClock");
const simulationClockValue = document.getElementById("simulationClockValue");
const isMobileViewport = () => window.matchMedia("(max-width: 760px)").matches;

const details = {
  mark: document.getElementById("planetMark"),
  type: document.getElementById("planetType"),
  name: document.getElementById("planetName"),
  description: document.getElementById("planetDescription"),
  diameter: document.getElementById("planetDiameter"),
  distance: document.getElementById("planetDistance"),
  moons: document.getElementById("planetMoons"),
  atmosphere: document.getElementById("planetAtmosphere"),
  composition: document.getElementById("planetComposition"),
  temperature: document.getElementById("planetTemperature"),
  orbit: document.getElementById("planetOrbit"),
  fact: document.getElementById("planetFact")
};

const SUN_DATA = {
  name: "Sun",
  kind: "star",
  type: "G-Type Main-Sequence Star",
  color: "#ffbd59",
  glow: "rgba(255, 191, 102, 0.55)",
  radius: 26,
  description: "The Sun is the blazing star at the heart of our solar system, supplying the light, warmth, and energy that make life on Earth possible.",
  diameter: "1.39 million km",
  distanceFromSun: "0 km",
  moons: "0",
  atmosphere: "Photosphere, chromosphere, and corona made of superheated plasma",
  composition: "Mostly hydrogen and helium, with energy produced by nuclear fusion in its core.",
  temperature: "Surface about 5,500 C, core about 15 million C",
  orbitalPeriod: "The solar system orbits the Milky Way in about 225 million years",
  funFact: "More than 99.8% of the total mass of the solar system is contained in the Sun."
};

const panelMarkCtx = details.mark.getContext("2d");

const KM_PER_AU = 149597870.7;
const KM_PER_LIGHT_YEAR = 9.4607e12;
const KM_PER_MILE = 1.609344;
const REAL_TIME_DAYS_PER_SECOND = 1 / 86400;
const BASE_SIMULATION_DAYS_PER_SECOND = 1;
const ORBITAL_PERIOD_DAYS = {
  Mercury: 87.969,
  Venus: 224.701,
  Earth: 365.256,
  Moon: 27.321661,
  Mars: 686.98,
  Phobos: 0.31891,
  Deimos: 1.26244,
  Ceres: 1680.0,
  Jupiter: 4332.59,
  Io: 1.769,
  Europa: 3.551,
  Ganymede: 7.155,
  Callisto: 16.689,
  Saturn: 10759.22,
  Titan: 15.945,
  Enceladus: 1.370,
  Rhea: 4.518,
  Iapetus: 79.3215,
  Uranus: 30688.5,
  Titania: 8.706,
  Oberon: 13.463,
  Ariel: 2.520,
  Miranda: 1.413,
  Neptune: 60182,
  Triton: 5.877,
  Proteus: 1.122,
  Nereid: 360.13,
  Pluto: 90560,
  Charon: 6.387,
  Nix: 24.854,
  Haumea: 103774,
  Hiiaka: 49.12,
  Namaka: 18.28,
  Makemake: 111845,
  "MK 2": 12.0,
  Eris: 203830,
  Dysnomia: 15.79
};

function getSimulationDaysPerSecond() {
  if (state.speedPreset === "realtime") {
    return REAL_TIME_DAYS_PER_SECOND;
  }

  return BASE_SIMULATION_DAYS_PER_SECOND * Number(state.speedPreset);
}

function getSpeedPresetLabel() {
  return state.speedPreset === "realtime" ? "Real Time" : `${state.speedPreset}x`;
}

function getSpeedReadoutText() {
  if (state.speedPreset === "realtime") {
    return "Real-world time progression";
  }

  const simulatedDays = getSimulationDaysPerSecond();
  return `${simulatedDays.toLocaleString()} simulated Earth day${simulatedDays === 1 ? "" : "s"} per second`;
}

function formatSimulationDate(date) {
  const pad = (value) => String(value).padStart(2, "0");
  const hours24 = date.getHours();
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(hours12)}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${suffix}`;
}

function updateSimulationClock() {
  const nextClockText = formatSimulationDate(new Date(state.simulationDateMs));
  if (nextClockText !== state.lastClockText) {
    state.lastClockText = nextClockText;
    simulationClockValue.textContent = nextClockText;
  }
}
function getAllBodies() {
  return [SUN_DATA, ...SOLAR_SYSTEM_PLANETS, ...SOLAR_SYSTEM_PLANETS.flatMap((planet) => planet.moonsData || [])];
}

function getBodyDiameterKm(body) {
  return BODY_DIAMETER_KM[body?.name] ?? 0;
}

function getBodyByName(name) {
  return getAllBodies().find((body) => body.name === name) ?? null;
}

function getCompareOptionLabel(body) {
  if (body.kind === "moon") {
    const parent = SOLAR_SYSTEM_PLANETS.find((planet) => (planet.moonsData || []).some((moon) => moon.name === body.name));
    return parent ? `${body.name} (${parent.name})` : body.name;
  }
  return body.name;
}

function populateCompareOptions() {
  const bodies = getAllBodies();
  const makeOptions = (selected) => bodies.map((body) => `<option value="${body.name}"${body.name === selected ? " selected" : ""}>${getCompareOptionLabel(body)}</option>`).join("");
  compareFirstSelect.innerHTML = makeOptions(state.compareFirst);
  compareSecondSelect.innerHTML = makeOptions(state.compareSecond);
}

function updateCompareUI() {
  const compareOpen = state.compareMenuOpen || state.comparisonOpen;
  compareBackdrop.classList.toggle("hidden", !compareOpen);
  compareCard.classList.toggle("hidden", !state.compareMenuOpen);
  compareToolbarBtn.classList.toggle("is-active", compareOpen);
  compareToolbarBtn.setAttribute("aria-pressed", String(compareOpen));
  comparisonOverlay.classList.toggle("hidden", !state.comparisonOpen);
  compareFirstSelect.value = state.compareFirst;
  compareSecondSelect.value = state.compareSecond;
}

function closeComparisonOverlay() {
  state.comparisonOpen = false;
  state.compareMenuOpen = false;
  updateCompareUI();
}

function renderComparisonPreview(canvasElement, body) {
  const drawCtx = canvasElement.getContext("2d");
  const previewSize = canvasElement.width;
  const center = { x: previewSize * 0.5, y: previewSize * 0.5 };
  const radius = body.kind === "moon" ? previewSize * 0.18 : body.kind === "star" ? previewSize * 0.25 : previewSize * 0.22;

  drawCtx.clearRect(0, 0, previewSize, previewSize);

  const halo = drawCtx.createRadialGradient(center.x, center.y, radius * 0.2, center.x, center.y, radius * 1.95);
  halo.addColorStop(0, rgbaWithAlpha(body.glow, 0.42));
  halo.addColorStop(0.52, rgbaWithAlpha(body.glow, 0.16));
  halo.addColorStop(1, rgbaWithAlpha(body.glow, 0));
  drawCtx.fillStyle = halo;
  drawCtx.beginPath();
  drawCtx.arc(center.x, center.y, radius * 1.95, 0, Math.PI * 2);
  drawCtx.fill();

  if (body.hasRings) {
    drawCtx.save();
    drawCtx.translate(center.x, center.y);
    drawCtx.rotate(-0.25);
    drawCtx.strokeStyle = "rgb(242, 223, 187)";
    drawCtx.lineWidth = Math.max(2, previewSize * 0.06);
    drawCtx.lineCap = "round";
    drawCtx.beginPath();
    drawCtx.ellipse(0, 0, radius * 1.72, radius * 0.68, 0, Math.PI - 0.05, Math.PI * 2 + 0.05);
    drawCtx.stroke();
    drawCtx.restore();
  }

  const fill = drawCtx.createRadialGradient(center.x - radius * 0.34, center.y - radius * 0.38, radius * 0.1, center.x, center.y, radius * 1.04);
  fill.addColorStop(0, shadeColor(body.color, 28));
  fill.addColorStop(0.54, body.color);
  fill.addColorStop(1, shadeColor(body.color, -22));
  drawCtx.fillStyle = fill;
  drawCtx.beginPath();
  drawCtx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  drawCtx.fill();

  drawSurfaceDetails(body, center, radius, drawCtx);

  const shadow = drawCtx.createRadialGradient(center.x + radius * 0.34, center.y + radius * 0.4, radius * 0.08, center.x + radius * 0.18, center.y + radius * 0.24, radius * 1.02);
  shadow.addColorStop(0, "rgba(0, 0, 0, 0)");
  shadow.addColorStop(0.68, "rgba(0, 0, 0, 0.06)");
  shadow.addColorStop(1, "rgba(0, 0, 0, 0.18)");
  drawCtx.fillStyle = shadow;
  drawCtx.beginPath();
  drawCtx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  drawCtx.fill();

  const highlight = drawCtx.createRadialGradient(center.x - radius * 0.42, center.y - radius * 0.42, 0, center.x - radius * 0.42, center.y - radius * 0.42, radius * 0.72);
  highlight.addColorStop(0, "rgba(255, 255, 255, 0.6)");
  highlight.addColorStop(0.24, "rgba(255, 255, 255, 0.24)");
  highlight.addColorStop(1, "rgba(255, 255, 255, 0)");
  drawCtx.fillStyle = highlight;
  drawCtx.beginPath();
  drawCtx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  drawCtx.fill();

  if (body.hasRings) {
    drawCtx.save();
    drawCtx.translate(center.x, center.y);
    drawCtx.rotate(-0.25);
    drawCtx.strokeStyle = "rgb(242, 223, 187)";
    drawCtx.lineWidth = Math.max(2, previewSize * 0.06);
    drawCtx.lineCap = "round";
    drawCtx.beginPath();
    drawCtx.ellipse(0, 0, radius * 1.72, radius * 0.68, 0, -0.05, Math.PI + 0.05);
    drawCtx.stroke();
    drawCtx.restore();
  }
}

function renderComparisonBody(element, body, diameterKm, maxDiameterKm, maxVisualSize) {
  const size = Math.max(8, maxVisualSize * (diameterKm / Math.max(maxDiameterKm, 1)));
  element.style.setProperty("--compare-size", `${size}px`);
  renderComparisonPreview(element, body);
}

function openComparisonOverlay() {
  const firstBody = getBodyByName(state.compareFirst);
  const secondBody = getBodyByName(state.compareSecond);
  if (!firstBody || !secondBody) {
    return;
  }

  const firstDiameter = getBodyDiameterKm(firstBody);
  const secondDiameter = getBodyDiameterKm(secondBody);
  const maxDiameter = Math.max(firstDiameter, secondDiameter, 1);
  const ratio = firstDiameter >= secondDiameter ? firstDiameter / Math.max(secondDiameter, 0.0001) : secondDiameter / Math.max(firstDiameter, 0.0001);
  const largerBody = firstDiameter >= secondDiameter ? firstBody : secondBody;
  const smallerBody = largerBody === firstBody ? secondBody : firstBody;
  const stageHeight = comparisonStage?.clientHeight || (isMobileViewport() ? 180 : 280);
  const maxVisualSize = Math.max(isMobileViewport() ? 80 : 120, Math.min(stageHeight * 0.72, isMobileViewport() ? 140 : 230));

  comparisonTitle.textContent = `${firstBody.name} vs ${secondBody.name}`;
  comparisonSummary.textContent = ratio < 1.01 ? `${firstBody.name} and ${secondBody.name} are nearly the same diameter.` : `${largerBody.name} is about ${ratio.toLocaleString(undefined, { maximumFractionDigits: ratio >= 10 ? 1 : 2 })}x wider than ${smallerBody.name}.`;
  comparisonNameA.textContent = firstBody.name;
  comparisonNameB.textContent = secondBody.name;
  comparisonSizeA.textContent = `${firstDiameter.toLocaleString()} km diameter`;
  comparisonSizeB.textContent = `${secondDiameter.toLocaleString()} km diameter`;
  renderComparisonBody(comparisonVisualA, firstBody, firstDiameter, maxDiameter, maxVisualSize);
  renderComparisonBody(comparisonVisualB, secondBody, secondDiameter, maxDiameter, maxVisualSize);

  state.comparisonOpen = true;
  state.compareMenuOpen = false;
  updateCompareUI();
}

function getOrbitDirection(body) {
  return body?.orbitSpeed != null && body.orbitSpeed < 0 ? -1 : 1;
}

function getOrbitalPeriodDays(body) {
  return ORBITAL_PERIOD_DAYS[body?.name] ?? 365.256;
}

function getOrbitalAngle(body, elapsedDays, seedMultiplier) {
  const periodDays = Math.max(getOrbitalPeriodDays(body), 0.0001);
  const direction = getOrbitDirection(body);
  const seededOffset = (body.orbitRadius || body.radius || 1) * seedMultiplier;
  return ((elapsedDays / periodDays) * Math.PI * 2 * direction) + seededOffset;
}

const BODY_DISTANCE_KM = {
  Sun: 0,
  Mercury: 57909227,
  Venus: 108209475,
  Earth: 149598023,
  Mars: 227943824,
  Ceres: 413700000,
  Jupiter: 778340821,
  Saturn: 1426666422,
  Uranus: 2870658186,
  Neptune: 4498396441,
  Pluto: 5906440628,
  Haumea: 6484000000,
  Makemake: 6850000000,
  Eris: 10100000000
};

const MOON_ORBIT_DISTANCE_KM = {
  Moon: 384400,
  Phobos: 9376,
  Deimos: 23463,
  Io: 421700,
  Europa: 671100,
  Ganymede: 1070400,
  Callisto: 1882700,
  Titan: 1221870,
  Enceladus: 237948,
  Rhea: 527108,
  Iapetus: 3560820,
  Titania: 435910,
  Oberon: 583520,
  Ariel: 190900,
  Miranda: 129390,
  Triton: 354759,
  Proteus: 117647,
  Nereid: 5513818,
  Charon: 19571,
  Nix: 48694,
  Hiiaka: 49880,
  Namaka: 25657,
  "MK 2": 21000,
  Dysnomia: 37350
};

const BODY_DIAMETER_KM = {
  Sun: 1392700,
  Mercury: 4879,
  Venus: 12104,
  Earth: 12742,
  Moon: 3475,
  Mars: 6779,
  Phobos: 22.5,
  Deimos: 12.4,
  Ceres: 939,
  Jupiter: 139820,
  Io: 3643,
  Europa: 3122,
  Ganymede: 5268,
  Callisto: 4821,
  Saturn: 116460,
  Titan: 5149,
  Enceladus: 504,
  Rhea: 1528,
  Iapetus: 1471,
  Uranus: 50724,
  Titania: 1578,
  Oberon: 1523,
  Ariel: 1158,
  Miranda: 472,
  Neptune: 49244,
  Triton: 2710,
  Proteus: 420,
  Nereid: 340,
  Pluto: 2377,
  Charon: 1212,
  Nix: 49,
  Haumea: 1960,
  Hiiaka: 320,
  Namaka: 170,
  Makemake: 1430,
  "MK 2": 175,
  Eris: 2326,
  Dysnomia: 700
};

const ORBIT_SCALE_POINTS = [
  { orbitRadius: 0, distanceKm: 0 },
  ...SOLAR_SYSTEM_PLANETS
    .filter((body) => body.kind !== "moon")
    .map((body) => ({ orbitRadius: body.orbitRadius, distanceKm: BODY_DISTANCE_KM[body.name] ?? 0 }))
    .sort((a, b) => a.orbitRadius - b.orbitRadius)
];

const state = {
  scale: 0.8,
  targetScale: 0.8,
  minScale: 0.22,
  maxScale: 2.8,
  offsetX: 0,
  offsetY: 0,
  targetOffsetX: 0,
  targetOffsetY: 0,
  wobbleX: 0,
  wobbleY: 0,
  targetWobbleX: 0,
  targetWobbleY: 0,
  dragging: false,
  activePointerId: null,
  touchPoints: {},
  pinching: false,
  pinchDistance: 0,
  pinchCenterX: 0,
  pinchCenterY: 0,
  dragMoved: false,
  lastPointerX: 0,
  lastPointerY: 0,
  hoverBody: null,
  selectedBody: null,
  width: 0,
  height: 0,
  starField: [],
  asteroidBelt: [],
  kuiperBelt: [],
  showLabels: true,
  controlsCollapsed: false,
  tourActive: false,
  tourIndex: -1,
  tourTimer: null,
  hasStartedTour: false,
  hasDismissedTip: false,
  measureActive: false,
  speedMenuOpen: false,
  compareMenuOpen: false,
  comparisonOpen: false,
  measureDragging: false,
  measureUnit: "km",
  measureStart: null,
  measureEnd: null,
  compareFirst: "Earth",
  compareSecond: "Jupiter",
  simulationTime: 0,
  simulationDays: 0,
  simulationDateMs: Date.now(),
  lastFrameTime: 0,
  speedPreset: "1",
  canvasRect: null,
  backgroundGradient: null,
  lastClockText: "",
  visibleBodies: []
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function getBodyDistanceKm(body) {
  return BODY_DISTANCE_KM[body?.name] ?? 0;
}

function getMoonOrbitDistanceKm(moon) {
  return MOON_ORBIT_DISTANCE_KM[moon?.name] ?? 0;
}

function getOrbitScalePoints() {
  return ORBIT_SCALE_POINTS;
}

function interpolateOrbitDistanceKm(worldRadius) {
  const orbitRadius = Math.max(0, worldRadius);
  const points = getOrbitScalePoints();

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    if (orbitRadius <= current.orbitRadius) {
      const progress = (orbitRadius - previous.orbitRadius) / Math.max(current.orbitRadius - previous.orbitRadius, 1);
      return lerp(previous.distanceKm, current.distanceKm, progress);
    }
  }

  const last = points[points.length - 1];
  const beforeLast = points[points.length - 2] ?? { orbitRadius: 0, distanceKm: 0 };
  const slope = (last.distanceKm - beforeLast.distanceKm) / Math.max(last.orbitRadius - beforeLast.orbitRadius, 1);
  return last.distanceKm + (orbitRadius - last.orbitRadius) * slope;
}

function worldToActualPoint(worldX, worldY) {
  const unsquashedY = worldY / 0.34;
  const angle = Math.atan2(unsquashedY, worldX);
  const worldRadius = Math.hypot(worldX, unsquashedY);
  const distanceKm = interpolateOrbitDistanceKm(worldRadius);

  return {
    x: Math.cos(angle) * distanceKm,
    y: Math.sin(angle) * distanceKm
  };
}

function getMeasurementPoint(clientX, clientY) {
  const snappedBody = findBodyAtPoint(clientX, clientY);
  if (snappedBody?.actualPosition) {
    return {
      screenX: snappedBody.screenX,
      screenY: snappedBody.screenY,
      worldX: snappedBody.currentPosition?.x ?? 0,
      worldY: snappedBody.currentPosition?.y ?? 0,
      actualX: snappedBody.actualPosition.x,
      actualY: snappedBody.actualPosition.y,
      body: snappedBody,
      exact: true,
      frozenCurrentPosition: snappedBody.currentPosition ? { ...snappedBody.currentPosition } : null,
      frozenActualPosition: { ...snappedBody.actualPosition }
    };
  }

  const rect = state.canvasRect || canvas.getBoundingClientRect();
  const screenX = clientX - rect.left;
  const screenY = clientY - rect.top;
  const worldX = (screenX - state.offsetX) / state.scale;
  const worldY = (screenY - state.offsetY) / state.scale;
  const actualPoint = worldToActualPoint(worldX, worldY);

  return {
    screenX,
    screenY,
    worldX,
    worldY,
    actualX: actualPoint.x,
    actualY: actualPoint.y,
    body: null,
    exact: false
  };
}

function getMeasuredDistanceKm() {
  if (!state.measureStart || !state.measureEnd) {
    return null;
  }

  return Math.hypot(state.measureEnd.actualX - state.measureStart.actualX, state.measureEnd.actualY - state.measureStart.actualY);
}

function formatMeasurementValue(distanceKm, unit) {
  if (distanceKm === null) {
    return "Enable the tool and drag between two points.";
  }

  if (unit === "mi") {
    const miles = distanceKm / KM_PER_MILE;
    return `${miles.toLocaleString(undefined, { maximumFractionDigits: miles >= 100 ? 0 : 2 })} mi`;
  }

  if (unit === "au") {
    const au = distanceKm / KM_PER_AU;
    return `${au.toLocaleString(undefined, { minimumFractionDigits: au < 10 ? 3 : 2, maximumFractionDigits: au < 10 ? 3 : 2 })} AU`;
  }

  if (unit === "ly") {
    const lightYears = distanceKm / KM_PER_LIGHT_YEAR;
    return `${lightYears.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })} ly`;
  }

  return `${distanceKm.toLocaleString(undefined, { maximumFractionDigits: distanceKm >= 100 ? 0 : 2 })} km`;
}

function getMeasurementScreenPoint(point) {
  if (!point) {
    return null;
  }
  return worldToScreen(point.worldX, point.worldY);
}

function getFrozenMeasurementPoint(body) {
  if (!body) {
    return null;
  }

  if (state.measureStart?.body && isSameBody(state.measureStart.body, body)) {
    return state.measureStart;
  }

  if (state.measureEnd?.body && isSameBody(state.measureEnd.body, body)) {
    return state.measureEnd;
  }

  return null;
}

function updateSpeedUI() {
  speedCard.classList.toggle("hidden", !state.speedMenuOpen);
  speedToolbarBtn.classList.toggle("is-active", state.speedMenuOpen || state.speedPreset !== "1");
  speedToolbarBtn.setAttribute("aria-pressed", String(state.speedMenuOpen));
  speedToolbarBtn.textContent = state.speedPreset === "realtime" ? "Real Time" : `Speed ${state.speedPreset}x`;
  speedValue.textContent = getSpeedReadoutText();
  speedButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.speed === state.speedPreset);
  });
}

function updateMeasureUI() {
  const distanceKm = getMeasuredDistanceKm();
  const isExact = !!(state.measureStart?.exact && state.measureEnd?.exact);
  measureCard.classList.toggle("hidden", !state.measureActive);
  measureToolbarBtn.classList.toggle("is-active", state.measureActive);
  measureToolbarBtn.setAttribute("aria-pressed", String(state.measureActive));
  measureUnitButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.unit === state.measureUnit);
  });

  if (distanceKm === null) {
    measureLabel.textContent = state.measureActive ? "Drag to start measuring" : "Ready to measure";
    measureValue.textContent = "Enable the tool and drag between two points.";
    return;
  }

  measureLabel.textContent = isExact ? "Exact body-to-body distance" : "Approximate distance through space";
  measureValue.textContent = formatMeasurementValue(distanceKm, state.measureUnit);
}

function clearMeasurement() {
  state.measureDragging = false;
  state.measureStart = null;
  state.measureEnd = null;
  updateMeasureUI();
}

function drawMeasurementOverlay() {
  if (!state.measureActive || !state.measureStart || !state.measureEnd) {
    return;
  }

  const startScreen = getMeasurementScreenPoint(state.measureStart);
  const endScreen = getMeasurementScreenPoint(state.measureEnd);
  if (!startScreen || !endScreen) {
    return;
  }

  ctx.save();
  ctx.lineWidth = 2.2;
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = "rgba(141, 216, 255, 0.95)";
  ctx.beginPath();
  ctx.moveTo(startScreen.x, startScreen.y);
  ctx.lineTo(endScreen.x, endScreen.y);
  ctx.stroke();
  ctx.setLineDash([]);

  [startScreen, endScreen].forEach((point) => {
    ctx.beginPath();
    ctx.fillStyle = "rgba(5, 11, 32, 0.92)";
    ctx.arc(point.x, point.y, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = "rgba(141, 216, 255, 0.96)";
    ctx.lineWidth = 2;
    ctx.arc(point.x, point.y, 8.5, 0, Math.PI * 2);
    ctx.stroke();
  });

  const midX = (startScreen.x + endScreen.x) * 0.5;
  const midY = (startScreen.y + endScreen.y) * 0.5;
  const label = formatMeasurementValue(getMeasuredDistanceKm(), state.measureUnit);
  ctx.font = "600 13px Space Grotesk";
  const textWidth = ctx.measureText(label).width;
  const badgeWidth = textWidth + 22;
  const badgeHeight = 30;
  ctx.fillStyle = "rgba(6, 12, 32, 0.92)";
  ctx.beginPath();
  ctx.roundRect(midX - badgeWidth * 0.5, midY - badgeHeight - 12, badgeWidth, badgeHeight, 14);
  ctx.fill();
  ctx.strokeStyle = "rgba(141, 216, 255, 0.28)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#edf4ff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, midX, midY - badgeHeight * 0.5 - 12);
  ctx.restore();
}
function resizeCanvas(preserveView = true) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const nextWidth = Math.round(rect.width);
  const nextHeight = Math.round(rect.height);

  if (!nextWidth || !nextHeight) {
    return;
  }

  if (state.width === nextWidth && state.height === nextHeight && canvas.width === Math.round(rect.width * dpr) && canvas.height === Math.round(rect.height * dpr)) {
    return;
  }

  const previousWidth = state.width;
  const previousHeight = state.height;

  state.width = nextWidth;
  state.height = nextHeight;
  state.canvasRect = rect;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  state.backgroundGradient = ctx.createRadialGradient(state.width * 0.5, state.height * 0.45, 30, state.width * 0.5, state.height * 0.45, state.width * 0.8);
  state.backgroundGradient.addColorStop(0, "rgba(30, 50, 110, 0.16)");
  state.backgroundGradient.addColorStop(1, "rgba(3, 5, 14, 0)");
  createStarField();
  createAsteroidBelt();
  createKuiperBelt();

  if (!preserveView || !previousWidth || !previousHeight) {
    resetView(false);
    return;
  }

  const widthRatio = state.width / previousWidth;
  const heightRatio = state.height / previousHeight;
  state.offsetX *= widthRatio;
  state.targetOffsetX *= widthRatio;
  state.offsetY *= heightRatio;
  state.targetOffsetY *= heightRatio;
}

function createStarField() {
  const count = Math.max(160, Math.floor((state.width * state.height) / 7000));
  state.starField = Array.from({ length: count }, () => ({
    x: Math.random() * state.width,
    y: Math.random() * state.height,
    size: Math.random() * 1.8 + 0.4,
    alpha: Math.random() * 0.55 + 0.2,
    drift: Math.random() * 0.18 + 0.02
  }));
}

function createAsteroidBelt() {
  const count = Math.max(160, Math.floor(state.width * 0.1));
  state.asteroidBelt = Array.from({ length: count }, () => ({
    orbitRadius: 248 + Math.random() * 42,
    angle: Math.random() * Math.PI * 2,
    size: Math.random() * 2.2 + 0.7,
    speed: Math.random() * 0.00008 + 0.00003,
    fill: rgbaWithAlpha(Math.random() > 0.55 ? "rgba(206, 188, 158, 1)" : "rgba(154, 164, 182, 1)", Math.random() * 0.28 + 0.18),
    tilt: 0.24 + Math.random() * 0.16
  }));
}
function createKuiperBelt() {
  const count = Math.max(220, Math.floor(state.width * 0.12));
  state.kuiperBelt = Array.from({ length: count }, () => ({
    orbitRadius: 610 + Math.random() * 170,
    angle: Math.random() * Math.PI * 2,
    size: Math.random() * 2 + 0.6,
    speed: Math.random() * 0.00003 + 0.000008,
    fill: rgbaWithAlpha(Math.random() > 0.5 ? "rgba(212, 220, 236, 1)" : "rgba(188, 164, 145, 1)", Math.random() * 0.22 + 0.12),
    tilt: 0.22 + Math.random() * 0.18
  }));
}
function getDefaultView() {
  const maxOrbit = Math.max(...SOLAR_SYSTEM_PLANETS.map((planet) => planet.orbitRadius + planet.radius + 24));
  const horizontalPadding = 72;
  const verticalPadding = 96;
  const fitWidth = (state.width - horizontalPadding * 2) / (maxOrbit * 2);
  const fitHeight = (state.height - verticalPadding * 2) / (maxOrbit * 0.68 * 2);
  const baseScale = clamp(Math.min(fitWidth, fitHeight), state.minScale, 0.95);

  return {
    scale: baseScale,
    offsetX: state.width * 0.5,
    offsetY: state.height * 0.5
  };
}

function resetView(smooth = true) {
  const defaultView = getDefaultView();
  state.targetScale = defaultView.scale;
  state.targetOffsetX = defaultView.offsetX;
  state.targetOffsetY = defaultView.offsetY;

  if (!smooth) {
    state.scale = defaultView.scale;
    state.offsetX = defaultView.offsetX;
    state.offsetY = defaultView.offsetY;
  }
}

function getRenderOffsetX() {
  return state.offsetX + state.wobbleX;
}

function getRenderOffsetY() {
  return state.offsetY + state.wobbleY;
}
function getTouchPointList() {
  return Object.values(state.touchPoints);
}

function getPinchMetrics() {
  const points = getTouchPointList();
  if (points.length < 2) {
    return null;
  }

  const [a, b] = points;
  return {
    distance: Math.hypot(b.x - a.x, b.y - a.y),
    centerX: (a.x + b.x) * 0.5,
    centerY: (a.y + b.y) * 0.5
  };
}

function beginPinchGesture() {
  const metrics = getPinchMetrics();
  if (!metrics) {
    return;
  }

  state.pinching = true;
  state.dragging = false;
  state.activePointerId = null;
  state.dragMoved = true;
  state.pinchDistance = metrics.distance;
  state.pinchCenterX = metrics.centerX;
  state.pinchCenterY = metrics.centerY;
}

function updatePinchGesture() {
  const metrics = getPinchMetrics();
  if (!metrics) {
    return;
  }

  if (!state.pinching) {
    beginPinchGesture();
    return;
  }

  if (state.pinchDistance > 0 && metrics.distance > 0) {
    zoomAtPoint(metrics.distance / state.pinchDistance, metrics.centerX, metrics.centerY);
  }

  state.targetOffsetX += metrics.centerX - state.pinchCenterX;
  state.targetOffsetY += metrics.centerY - state.pinchCenterY;
  state.targetWobbleX = clamp(state.targetWobbleX + (metrics.centerX - state.pinchCenterX) * 0.12, -18, 18);
  state.targetWobbleY = clamp(state.targetWobbleY + (metrics.centerY - state.pinchCenterY) * 0.12, -12, 12);
  state.pinchDistance = metrics.distance;
  state.pinchCenterX = metrics.centerX;
  state.pinchCenterY = metrics.centerY;
}

function endTouchPointer(pointerId) {
  delete state.touchPoints[pointerId];

  const remainingTouches = getTouchPointList();
  if (remainingTouches.length >= 2) {
    beginPinchGesture();
    return;
  }

  state.pinching = false;
  state.pinchDistance = 0;

  if (remainingTouches.length === 1) {
    const [touch] = remainingTouches;
    state.activePointerId = touch.pointerId;
    state.lastPointerX = touch.x;
    state.lastPointerY = touch.y;
    state.dragging = true;
    state.dragMoved = true;
    return;
  }

  state.activePointerId = null;
  state.dragging = false;
}
function worldToScreen(x, y) {
  return { x: x * state.scale + state.offsetX, y: y * state.scale + state.offsetY };
}

function getPlanetPosition(planet, elapsedDays) {
  const wobble = Math.sin((elapsedDays * Math.PI * 2) / 120 + planet.orbitRadius * 0.05) * 4;
  const angle = getOrbitalAngle(planet, elapsedDays, 0.035);
  return {
    x: Math.cos(angle) * planet.orbitRadius,
    y: Math.sin(angle) * (planet.orbitRadius * 0.34) + wobble,
    angle
  };
}

function getMoonPosition(planet, moon, elapsedDays) {
  const angle = getOrbitalAngle(moon, elapsedDays, 0.24);
  const tilt = moon.orbitRadius * 0.6;
  return {
    x: planet.currentPosition.x + Math.cos(angle) * moon.orbitRadius,
    y: planet.currentPosition.y + Math.sin(angle) * tilt,
    angle
  };
}

function drawBackground(elapsed) {
  ctx.fillStyle = state.backgroundGradient;
  ctx.fillRect(0, 0, state.width, state.height);

  for (const star of state.starField) {
    const twinkle = (Math.sin(elapsed * 0.001 * star.drift * 8 + star.x) + 1) * 0.18;
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${star.alpha + twinkle})`;
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function isScreenCircleVisible(x, y, radius, padding = 64) {
  return x + radius + padding >= 0 && x - radius - padding <= state.width && y + radius + padding >= 0 && y - radius - padding <= state.height;
}

function isSameBody(a, b) {
  return !!a && !!b && a.name === b.name && a.kind === b.kind;
}

function hasFocusedSelection() {
  return !!state.selectedBody;
}

function updateBodyPositions(elapsed) {
  const sunScreen = worldToScreen(0, 0);
  SUN_DATA.currentPosition = { x: 0, y: 0 };
  SUN_DATA.actualPosition = { x: 0, y: 0 };
  SUN_DATA.screenX = sunScreen.x;
  SUN_DATA.screenY = sunScreen.y;

  SOLAR_SYSTEM_PLANETS.forEach((planet) => {
    planet.kind = "planet";
    const frozenPlanetPoint = state.measureActive ? getFrozenMeasurementPoint(planet) : null;
    const position = frozenPlanetPoint?.frozenCurrentPosition ?? getPlanetPosition(planet, elapsed);
    const screen = worldToScreen(position.x, position.y);
    const planetDistanceKm = getBodyDistanceKm(planet);
    planet.currentPosition = position;
    planet.actualPosition = frozenPlanetPoint?.frozenActualPosition ?? {
      x: Math.cos(position.angle) * planetDistanceKm,
      y: Math.sin(position.angle) * planetDistanceKm
    };
    planet.screenX = screen.x;
    planet.screenY = screen.y;

    (planet.moonsData || []).forEach((moon) => {
      moon.kind = "moon";
      moon.hostPlanet = planet.name;
      const frozenMoonPoint = state.measureActive ? getFrozenMeasurementPoint(moon) : null;
      const moonPosition = frozenMoonPoint?.frozenCurrentPosition ?? getMoonPosition(planet, moon, elapsed);
      const moonScreen = worldToScreen(moonPosition.x, moonPosition.y);
      const moonDistanceKm = getMoonOrbitDistanceKm(moon);
      moon.currentPosition = moonPosition;
      moon.actualPosition = frozenMoonPoint?.frozenActualPosition ?? {
        x: planet.actualPosition.x + Math.cos(moonPosition.angle) * moonDistanceKm,
        y: planet.actualPosition.y + Math.sin(moonPosition.angle) * moonDistanceKm
      };
      moon.screenX = moonScreen.x;
      moon.screenY = moonScreen.y;
    });
  });
}

function drawSun(mode = "all") {
  const sunScreen = { x: SUN_DATA.screenX, y: SUN_DATA.screenY };
  const radius = SUN_DATA.radius * state.scale;
  const isHovered = isSameBody(state.hoverBody, SUN_DATA);
  const isSelected = isSameBody(state.selectedBody, SUN_DATA);
  const hasFocus = hasFocusedSelection();
  const shouldDraw = mode === "all" || (mode === "background" && (!isSelected || !hasFocus)) || (mode === "selected" && isSelected);

  if (!shouldDraw) {
    return;
  }

  ctx.save();
  if (hasFocus && !isSelected) {
    ctx.globalAlpha = 0.22;
  }

  const glowRadius = radius * (isSelected ? 4.2 : 3.3);
  const glow = ctx.createRadialGradient(sunScreen.x, sunScreen.y, radius * 0.3, sunScreen.x, sunScreen.y, glowRadius);
  glow.addColorStop(0, "rgba(255, 231, 150, 0.96)");
  glow.addColorStop(0.4, "rgba(255, 180, 72, 0.48)");
  glow.addColorStop(1, "rgba(255, 140, 43, 0)");
  ctx.beginPath();
  ctx.fillStyle = glow;
  ctx.arc(sunScreen.x, sunScreen.y, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  const core = ctx.createRadialGradient(sunScreen.x - radius * 0.25, sunScreen.y - radius * 0.35, radius * 0.2, sunScreen.x, sunScreen.y, radius);
  core.addColorStop(0, "#fff8d4");
  core.addColorStop(0.5, "#ffcd67");
  core.addColorStop(1, "#e67f25");
  ctx.beginPath();
  ctx.fillStyle = core;
  ctx.arc(sunScreen.x, sunScreen.y, radius * (isHovered ? 1.04 : 1), 0, Math.PI * 2);
  ctx.fill();

  if (isSelected) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 231, 150, 0.95)";
    ctx.lineWidth = 2.4;
    ctx.arc(sunScreen.x, sunScreen.y, radius + 10, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (state.showLabels && (state.scale > 0.52 || isHovered || isSelected)) {
    ctx.font = `700 ${clamp(12 * state.scale, 12, 16)}px Space Grotesk`;
    ctx.textAlign = "center";
    ctx.fillStyle = isSelected ? "#ffffff" : "rgba(255, 248, 214, 0.94)";
    ctx.fillText("Sun", sunScreen.x, sunScreen.y + radius + 22);
  }

  ctx.restore();
}

function drawOrbits(mode = "all") {
  const hasFocus = hasFocusedSelection();
  ctx.save();
  if (mode === "background" && hasFocus) {
    ctx.globalAlpha = 0.22;
  }
  if (mode === "selected" && hasFocus) {
    ctx.globalAlpha = 0;
  }
  ctx.translate(getRenderOffsetX(), getRenderOffsetY());
  ctx.scale(state.scale, state.scale);

  SOLAR_SYSTEM_PLANETS.forEach((planet, index) => {
    ctx.beginPath();
    ctx.strokeStyle = index % 2 === 0 ? "rgba(141, 216, 255, 0.12)" : "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1 / state.scale;
    ctx.ellipse(0, 0, planet.orbitRadius, planet.orbitRadius * 0.34, 0, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.restore();
}

function drawAsteroidBelt(elapsed, mode = "all") {
  const hasFocus = hasFocusedSelection();
  ctx.save();
  if (mode === "background" && hasFocus) {
    ctx.globalAlpha = 0.18;
  }
  if (mode === "selected" && hasFocus) {
    ctx.globalAlpha = 0;
  }
  ctx.translate(getRenderOffsetX(), getRenderOffsetY());
  ctx.scale(state.scale, state.scale);

  for (const asteroid of state.asteroidBelt) {
    const angle = asteroid.angle + elapsed * asteroid.speed;
    const x = Math.cos(angle) * asteroid.orbitRadius;
    const y = Math.sin(angle) * (asteroid.orbitRadius * asteroid.tilt);
    const size = asteroid.size / state.scale;
    const screen = worldToScreen(x, y);

    if (!isScreenCircleVisible(screen.x, screen.y, Math.max(size * state.scale, 2), 36)) {
      continue;
    }

    ctx.beginPath();
    ctx.fillStyle = asteroid.fill;
    ctx.ellipse(x, y, size, size * (0.72 + Math.sin(angle * 3.1) * 0.08), angle * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
function drawKuiperBelt(elapsed, mode = "all") {
  const hasFocus = hasFocusedSelection();
  ctx.save();
  if (mode === "background" && hasFocus) {
    ctx.globalAlpha = 0.16;
  }
  if (mode === "selected" && hasFocus) {
    ctx.globalAlpha = 0;
  }
  ctx.translate(getRenderOffsetX(), getRenderOffsetY());
  ctx.scale(state.scale, state.scale);

  for (const body of state.kuiperBelt) {
    const angle = body.angle + elapsed * body.speed;
    const x = Math.cos(angle) * body.orbitRadius;
    const y = Math.sin(angle) * (body.orbitRadius * body.tilt);
    const size = body.size / state.scale;
    const screen = worldToScreen(x, y);

    if (!isScreenCircleVisible(screen.x, screen.y, Math.max(size * state.scale, 2), 42)) {
      continue;
    }

    ctx.beginPath();
    ctx.fillStyle = body.fill;
    ctx.ellipse(x, y, size, size * 0.72, angle * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
function shadeColor(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const r = clamp((num >> 16) + amt, 0, 255);
  const g = clamp(((num >> 8) & 255) + amt, 0, 255);
  const b = clamp((num & 255) + amt, 0, 255);
  return `rgb(${r}, ${g}, ${b})`;
}
function rgbaWithAlpha(color, alpha) {
  const match = color.match(/^rgba?\(([^)]+)\)$/i);
  if (!match) {
    return color;
  }

  const parts = match[1].split(",").map((part) => part.trim());
  if (parts.length < 3) {
    return color;
  }

  return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
}

function drawDetailBlob(drawCtx, screen, radius, xFactor, yFactor, widthFactor, heightFactor, rotation, color, alpha) {
  drawCtx.save();
  drawCtx.translate(screen.x + radius * xFactor, screen.y + radius * yFactor);
  drawCtx.rotate(rotation);
  drawCtx.fillStyle = rgbaWithAlpha(color, alpha);
  drawCtx.beginPath();
  drawCtx.ellipse(0, 0, radius * widthFactor, radius * heightFactor, 0, 0, Math.PI * 2);
  drawCtx.fill();
  drawCtx.restore();
}

function drawDetailBand(drawCtx, screen, radius, yFactor, widthFactor, heightFactor, color, alpha) {
  drawCtx.fillStyle = rgbaWithAlpha(color, alpha);
  drawCtx.beginPath();
  drawCtx.ellipse(screen.x, screen.y + radius * yFactor, radius * widthFactor, radius * heightFactor, 0, 0, Math.PI * 2);
  drawCtx.fill();
}

function drawDetailStroke(drawCtx, screen, radius, xFactor, yFactor, widthFactor, heightFactor, rotation, color, alpha, lineWidthFactor = 0.08) {
  drawCtx.save();
  drawCtx.translate(screen.x + radius * xFactor, screen.y + radius * yFactor);
  drawCtx.rotate(rotation);
  drawCtx.strokeStyle = rgbaWithAlpha(color, alpha);
  drawCtx.lineWidth = Math.max(1, radius * lineWidthFactor);
  drawCtx.beginPath();
  drawCtx.ellipse(0, 0, radius * widthFactor, radius * heightFactor, 0, 0, Math.PI * 2);
  drawCtx.stroke();
  drawCtx.restore();
}

function drawSurfaceDetails(body, screen, radius, drawCtx = ctx) {
  drawCtx.save();
  drawCtx.beginPath();
  drawCtx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
  drawCtx.clip();

  switch (body.name) {
    case "Mercury":
      drawDetailBlob(drawCtx, screen, radius, -0.22, -0.08, 0.22, 0.18, 0.4, "rgb(132, 126, 119)", 0.28);
      drawDetailBlob(drawCtx, screen, radius, 0.18, 0.2, 0.15, 0.11, -0.2, "rgb(202, 194, 182)", 0.18);
      drawDetailBlob(drawCtx, screen, radius, 0.06, -0.28, 0.14, 0.1, 0, "rgb(116, 110, 103)", 0.22);
      drawDetailStroke(drawCtx, screen, radius, -0.1, 0.05, 0.3, 0.16, -0.25, "rgb(240, 230, 214)", 0.12, 0.05);
      break;
    case "Venus":
      drawDetailBand(drawCtx, screen, radius, -0.24, 0.98, 0.16, "rgb(248, 221, 176)", 0.26);
      drawDetailBand(drawCtx, screen, radius, -0.02, 0.9, 0.13, "rgb(214, 162, 111)", 0.2);
      drawDetailBand(drawCtx, screen, radius, 0.18, 0.84, 0.11, "rgb(241, 197, 144)", 0.18);
      drawDetailStroke(drawCtx, screen, radius, -0.08, 0.04, 0.48, 0.16, 0.18, "rgb(255, 239, 205)", 0.12, 0.045);
      break;
    case "Earth":
      drawDetailBlob(drawCtx, screen, radius, -0.2, -0.04, 0.3, 0.22, -0.45, "rgb(95, 178, 93)", 0.95);
      drawDetailBlob(drawCtx, screen, radius, 0.1, 0.06, 0.13, 0.08, 0.15, "rgb(78, 154, 78)", 0.88);
      drawDetailBlob(drawCtx, screen, radius, 0.18, 0.2, 0.24, 0.13, 0.42, "rgb(94, 170, 90)", 0.9);
      drawDetailBlob(drawCtx, screen, radius, 0.32, -0.1, 0.11, 0.08, -0.55, "rgb(125, 196, 122)", 0.78);
      drawDetailStroke(drawCtx, screen, radius, -0.14, -0.02, 0.34, 0.18, -0.35, "rgb(61, 124, 61)", 0.22, 0.04);
      drawDetailBand(drawCtx, screen, radius, -0.32, 0.92, 0.08, "rgb(255, 255, 255)", 0.18);
      drawDetailBand(drawCtx, screen, radius, 0.24, 0.78, 0.06, "rgb(255, 255, 255)", 0.14);
      drawDetailBlob(drawCtx, screen, radius, -0.28, -0.16, 0.26, 0.11, -0.2, "rgb(255, 255, 255)", 0.11);
      drawDetailBlob(drawCtx, screen, radius, 0.08, 0.28, 0.22, 0.08, 0.1, "rgb(255, 255, 255)", 0.09);
      break;
    case "Mars":
      drawDetailBlob(drawCtx, screen, radius, -0.12, -0.04, 0.42, 0.23, -0.2, "rgb(171, 90, 64)", 0.32);
      drawDetailBlob(drawCtx, screen, radius, 0.22, 0.18, 0.18, 0.11, 0.3, "rgb(235, 196, 170)", 0.2);
      drawDetailBand(drawCtx, screen, radius, -0.38, 0.46, 0.08, "rgb(247, 236, 227)", 0.34);
      drawDetailStroke(drawCtx, screen, radius, 0.06, 0.04, 0.42, 0.16, 0.12, "rgb(122, 62, 42)", 0.18, 0.04);
      break;
    case "Jupiter":
      drawDetailBand(drawCtx, screen, radius, -0.42, 1.04, 0.11, "rgb(245, 224, 199)", 0.66);
      drawDetailBand(drawCtx, screen, radius, -0.22, 1.08, 0.12, "rgb(196, 144, 106)", 0.48);
      drawDetailBand(drawCtx, screen, radius, -0.02, 1.1, 0.11, "rgb(230, 205, 178)", 0.58);
      drawDetailBand(drawCtx, screen, radius, 0.18, 1.06, 0.12, "rgb(176, 119, 88)", 0.42);
      drawDetailBand(drawCtx, screen, radius, 0.38, 0.98, 0.1, "rgb(228, 190, 151)", 0.42);
      drawDetailStroke(drawCtx, screen, radius, -0.04, 0.08, 0.94, 0.18, 0.04, "rgb(255, 240, 221)", 0.1, 0.03);
      drawDetailBlob(drawCtx, screen, radius, 0.28, 0.08, 0.18, 0.1, -0.12, "rgb(194, 107, 74)", 0.8);
      break;
    case "Saturn":
      drawDetailBand(drawCtx, screen, radius, -0.32, 1.02, 0.1, "rgb(246, 234, 190)", 0.5);
      drawDetailBand(drawCtx, screen, radius, -0.12, 1.02, 0.09, "rgb(211, 187, 123)", 0.34);
      drawDetailBand(drawCtx, screen, radius, 0.08, 0.98, 0.09, "rgb(240, 218, 156)", 0.4);
      drawDetailBand(drawCtx, screen, radius, 0.28, 0.94, 0.08, "rgb(190, 162, 101)", 0.26);
      drawDetailStroke(drawCtx, screen, radius, 0, 0.02, 0.84, 0.2, 0, "rgb(255, 245, 214)", 0.08, 0.03);
      break;
    case "Uranus":
      drawDetailBand(drawCtx, screen, radius, -0.16, 0.96, 0.08, "rgb(204, 247, 249)", 0.24);
      drawDetailBand(drawCtx, screen, radius, 0.08, 0.92, 0.07, "rgb(128, 212, 223)", 0.16);
      drawDetailBand(drawCtx, screen, radius, 0.28, 0.84, 0.05, "rgb(223, 252, 255)", 0.1);
      break;
    case "Neptune":
      drawDetailBand(drawCtx, screen, radius, -0.18, 0.98, 0.09, "rgb(98, 136, 255)", 0.3);
      drawDetailBand(drawCtx, screen, radius, 0.08, 0.94, 0.08, "rgb(60, 96, 226)", 0.24);
      drawDetailBand(drawCtx, screen, radius, 0.28, 0.86, 0.05, "rgb(126, 161, 255)", 0.14);
      drawDetailBlob(drawCtx, screen, radius, 0.26, 0.04, 0.16, 0.08, -0.2, "rgb(83, 114, 236)", 0.22);
      break;
    case "Moon":
    case "Phobos":
    case "Deimos":
    case "Callisto":
    case "Rhea":
    case "Iapetus":
    case "Titania":
    case "Oberon":
    case "Proteus":
    case "Nereid":
      drawDetailBlob(drawCtx, screen, radius, -0.18, -0.08, 0.18, 0.16, 0.2, "rgb(118, 118, 118)", 0.18);
      drawDetailBlob(drawCtx, screen, radius, 0.16, 0.2, 0.11, 0.09, -0.1, "rgb(240, 240, 240)", 0.08);
      drawDetailStroke(drawCtx, screen, radius, -0.04, 0.04, 0.34, 0.18, -0.2, "rgb(90, 90, 90)", 0.08, 0.03);
      break;
    case "Europa":
    case "Enceladus":
      drawDetailBand(drawCtx, screen, radius, -0.08, 0.88, 0.05, "rgb(162, 188, 222)", 0.16);
      drawDetailBand(drawCtx, screen, radius, 0.12, 0.82, 0.04, "rgb(222, 234, 246)", 0.14);
      break;
    case "Ganymede":
    case "Titan":
    case "Triton":
      drawDetailBand(drawCtx, screen, radius, -0.1, 0.86, 0.06, shadeColor(body.color, -12), 0.18);
      drawDetailBlob(drawCtx, screen, radius, 0.1, 0.14, 0.18, 0.1, 0.2, shadeColor(body.color, 14), 0.14);
      break;
    case "Io":
      drawDetailBlob(drawCtx, screen, radius, -0.18, -0.02, 0.22, 0.14, 0.2, "rgb(201, 130, 48)", 0.24);
      drawDetailBlob(drawCtx, screen, radius, 0.18, 0.14, 0.18, 0.12, -0.3, "rgb(247, 224, 122)", 0.18);
      break;
    default:
      if (body.kind === "moon") {
        drawDetailBlob(drawCtx, screen, radius, -0.12, -0.08, 0.18, 0.14, 0.2, shadeColor(body.color, -16), 0.12);
      }
      break;
  }

  drawCtx.restore();
}

function renderPanelPreview(body) {
  const previewSize = details.mark.width;
  const center = { x: previewSize * 0.5, y: previewSize * 0.5 };
  const radius = body.kind === "moon" ? previewSize * 0.21 : body.kind === "star" ? previewSize * 0.31 : previewSize * 0.28;

  panelMarkCtx.clearRect(0, 0, previewSize, previewSize);

  const halo = panelMarkCtx.createRadialGradient(center.x, center.y, radius * 0.2, center.x, center.y, radius * 1.95);
  halo.addColorStop(0, rgbaWithAlpha(body.glow, 0.42));
  halo.addColorStop(0.52, rgbaWithAlpha(body.glow, 0.16));
  halo.addColorStop(1, rgbaWithAlpha(body.glow, 0));
  panelMarkCtx.fillStyle = halo;
  panelMarkCtx.beginPath();
  panelMarkCtx.arc(center.x, center.y, radius * 1.95, 0, Math.PI * 2);
  panelMarkCtx.fill();

  if (body.hasRings) {
    panelMarkCtx.save();
    panelMarkCtx.translate(center.x, center.y);
    panelMarkCtx.rotate(-0.25);
    panelMarkCtx.strokeStyle = "rgb(242, 223, 187)";
    panelMarkCtx.lineWidth = Math.max(2, previewSize * 0.06);
    panelMarkCtx.lineCap = "round";
    panelMarkCtx.beginPath();
    panelMarkCtx.ellipse(0, 0, radius * 1.72, radius * 0.68, 0, Math.PI - 0.05, Math.PI * 2 + 0.05);
    panelMarkCtx.stroke();
    panelMarkCtx.restore();
  }

  const fill = panelMarkCtx.createRadialGradient(center.x - radius * 0.34, center.y - radius * 0.38, radius * 0.1, center.x, center.y, radius * 1.04);
  fill.addColorStop(0, shadeColor(body.color, 28));
  fill.addColorStop(0.54, body.color);
  fill.addColorStop(1, shadeColor(body.color, -22));
  panelMarkCtx.fillStyle = fill;
  panelMarkCtx.beginPath();
  panelMarkCtx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  panelMarkCtx.fill();

  drawSurfaceDetails(body, center, radius, panelMarkCtx);

  const shadow = panelMarkCtx.createRadialGradient(center.x + radius * 0.34, center.y + radius * 0.4, radius * 0.08, center.x + radius * 0.18, center.y + radius * 0.24, radius * 1.02);
  shadow.addColorStop(0, "rgba(0, 0, 0, 0)");
  shadow.addColorStop(0.68, "rgba(0, 0, 0, 0.06)");
  shadow.addColorStop(1, "rgba(0, 0, 0, 0.18)");
  panelMarkCtx.fillStyle = shadow;
  panelMarkCtx.beginPath();
  panelMarkCtx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  panelMarkCtx.fill();

  const highlight = panelMarkCtx.createRadialGradient(center.x - radius * 0.42, center.y - radius * 0.42, 0, center.x - radius * 0.42, center.y - radius * 0.42, radius * 0.72);
  highlight.addColorStop(0, "rgba(255, 255, 255, 0.6)");
  highlight.addColorStop(0.24, "rgba(255, 255, 255, 0.24)");
  highlight.addColorStop(1, "rgba(255, 255, 255, 0)");
  panelMarkCtx.fillStyle = highlight;
  panelMarkCtx.beginPath();
  panelMarkCtx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  panelMarkCtx.fill();

  panelMarkCtx.beginPath();
  panelMarkCtx.strokeStyle = rgbaWithAlpha(body.glow, body.kind === "moon" ? 0.18 : 0.24);
  panelMarkCtx.lineWidth = Math.max(1.4, previewSize * 0.022);
  panelMarkCtx.arc(center.x, center.y, radius - panelMarkCtx.lineWidth * 0.5, 0, Math.PI * 2);
  panelMarkCtx.stroke();

  if (body.hasRings) {
    panelMarkCtx.save();
    panelMarkCtx.translate(center.x, center.y);
    panelMarkCtx.rotate(-0.25);
    panelMarkCtx.strokeStyle = "rgb(242, 223, 187)";
    panelMarkCtx.lineWidth = Math.max(2, previewSize * 0.06);
    panelMarkCtx.lineCap = "round";
    panelMarkCtx.beginPath();
    panelMarkCtx.ellipse(0, 0, radius * 1.72, radius * 0.68, 0, -0.05, Math.PI + 0.05);
    panelMarkCtx.stroke();
    panelMarkCtx.restore();
  }
}
function drawBody(body, screen, radius, isHovered, isSelected, showLabel) {
  const glowRadius = radius * (isSelected ? 2.9 : isHovered ? 2.35 : 2.1);
  const glow = ctx.createRadialGradient(screen.x, screen.y, radius * 0.2, screen.x, screen.y, glowRadius);
  glow.addColorStop(0, rgbaWithAlpha(body.glow, isSelected ? 0.42 : isHovered ? 0.32 : 0.24));
  glow.addColorStop(0.45, rgbaWithAlpha(body.glow, isSelected ? 0.18 : isHovered ? 0.12 : 0.09));
  glow.addColorStop(1, rgbaWithAlpha(body.glow, 0));
  ctx.beginPath();
  ctx.fillStyle = glow;
  ctx.arc(screen.x, screen.y, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  const fill = ctx.createRadialGradient(
    screen.x - radius * 0.32,
    screen.y - radius * 0.36,
    radius * 0.12,
    screen.x,
    screen.y,
    radius * 1.02
  );
  fill.addColorStop(0, shadeColor(body.color, 24));
  fill.addColorStop(0.52, body.color);
  fill.addColorStop(1, shadeColor(body.color, -20));
  ctx.beginPath();
  ctx.fillStyle = fill;
  ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
  ctx.fill();

  const highlight = ctx.createRadialGradient(
    screen.x - radius * 0.34,
    screen.y - radius * 0.38,
    0,
    screen.x - radius * 0.34,
    screen.y - radius * 0.38,
    radius * 0.58
  );
  highlight.addColorStop(0, "rgba(255, 255, 255, 0.56)");
  highlight.addColorStop(0.26, "rgba(255, 255, 255, 0.2)");
  highlight.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.beginPath();
  ctx.fillStyle = highlight;
  ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
  ctx.fill();

  if (radius >= (body.kind === "moon" ? 7 : 10)) {
    drawSurfaceDetails(body, screen, radius);
  }

  const shadow = ctx.createRadialGradient(
    screen.x + radius * 0.34,
    screen.y + radius * 0.4,
    radius * 0.12,
    screen.x + radius * 0.18,
    screen.y + radius * 0.24,
    radius * 1.02
  );
  shadow.addColorStop(0, "rgba(0, 0, 0, 0)");
  shadow.addColorStop(0.68, "rgba(0, 0, 0, 0.06)");
  shadow.addColorStop(1, "rgba(0, 0, 0, 0.2)");
  ctx.beginPath();
  ctx.fillStyle = shadow;
  ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = rgbaWithAlpha(body.glow, body.kind === "moon" ? 0.16 : 0.22);
  ctx.lineWidth = Math.max(1, radius * 0.06);
  ctx.arc(screen.x, screen.y, radius - ctx.lineWidth * 0.5, 0, Math.PI * 2);
  ctx.stroke();

  if (isSelected) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(141, 216, 255, 0.9)";
    ctx.lineWidth = body.kind === "moon" ? 1.5 : 2;
    ctx.arc(screen.x, screen.y, radius + (body.kind === "moon" ? 4 : 7), 0, Math.PI * 2);
    ctx.stroke();
  }

  if (showLabel) {
    ctx.font = `600 ${clamp((body.kind === "moon" ? 9 : 11) * state.scale, body.kind === "moon" ? 9 : 11, body.kind === "moon" ? 12 : 15)}px Space Grotesk`;
    ctx.textAlign = "center";
    ctx.fillStyle = isSelected ? "#ffffff" : isHovered ? "rgba(255,255,255,0.96)" : "rgba(237, 244, 255, 0.78)";
    ctx.fillText(body.name, screen.x, screen.y + radius + (body.kind === "moon" ? 12 : 18));
  }
}

function drawMoonOrbits(planet, mode = "all") {
  if (!planet.moonsData || !planet.moonsData.length) {
    return;
  }

  const hasFocus = hasFocusedSelection();
  const hostSelected = isSameBody(state.selectedBody, planet);
  const shouldDraw = mode === "all" || (mode === "background" && (!hostSelected || !hasFocus)) || (mode === "selected" && hostSelected);
  if (!shouldDraw || !isScreenCircleVisible(planet.screenX, planet.screenY, planet.radius * state.scale, 72)) {
    return;
  }

  ctx.save();
  if (hasFocus && !hostSelected) {
    ctx.globalAlpha = 0.2;
  }
  ctx.translate(getRenderOffsetX(), getRenderOffsetY());
  ctx.scale(state.scale, state.scale);
  ctx.translate(planet.currentPosition.x, planet.currentPosition.y);

  planet.moonsData.forEach((moon, index) => {
    ctx.beginPath();
    ctx.strokeStyle = index % 2 === 0 ? "rgba(255, 255, 255, 0.09)" : "rgba(141, 216, 255, 0.08)";
    ctx.lineWidth = 0.8 / state.scale;
    ctx.ellipse(0, 0, moon.orbitRadius, moon.orbitRadius * 0.6, 0, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.restore();
}

function drawPlanetRing(planet, screen, radius, isSelected, layer = "front") {
  if (!planet.hasRings) {
    return;
  }

  const hasFocus = hasFocusedSelection();
  ctx.save();
  if (hasFocus && !isSelected) {
    ctx.globalAlpha = 0.22;
  }
  ctx.translate(screen.x, screen.y);
  ctx.rotate(-0.25);
  ctx.strokeStyle = "rgb(242, 223, 187)";
  ctx.lineWidth = Math.max(1.3, 3 * state.scale);
  ctx.lineCap = "round";
  const seamOverlap = 0.06;
  ctx.beginPath();
  if (layer === "back") {
    ctx.ellipse(0, 0, radius * 1.8, radius * 0.75, 0, Math.PI - seamOverlap, Math.PI * 2 + seamOverlap);
  } else {
    ctx.ellipse(0, 0, radius * 1.8, radius * 0.75, 0, -seamOverlap, Math.PI + seamOverlap);
  }
  ctx.stroke();
  ctx.restore();
}

function drawBodies(mode = "all") {
  const hasFocus = hasFocusedSelection();

  SOLAR_SYSTEM_PLANETS.forEach((planet) => {
    const isHovered = isSameBody(state.hoverBody, planet);
    const isSelected = isSameBody(state.selectedBody, planet);
    const radius = planet.radius * state.scale * (isHovered ? 1.08 : 1);
    const shouldDrawPlanet = mode === "all" || (mode === "background" && (!isSelected || !hasFocus)) || (mode === "selected" && isSelected);
    const planetVisible = isScreenCircleVisible(planet.screenX, planet.screenY, radius, 96);

    if (shouldDrawPlanet && planetVisible) {
      state.visibleBodies.push(planet);
      drawPlanetRing(planet, { x: planet.screenX, y: planet.screenY }, radius, isSelected, "back");
      ctx.save();
      if (hasFocus && !isSelected) {
        ctx.globalAlpha = 0.22;
      }
      drawBody(planet, { x: planet.screenX, y: planet.screenY }, radius, isHovered, isSelected, state.showLabels && (state.scale > 0.58 || isHovered || isSelected));
      ctx.restore();
      drawPlanetRing(planet, { x: planet.screenX, y: planet.screenY }, radius, isSelected, "front");
    }

    drawMoonOrbits(planet, mode);

    (planet.moonsData || []).forEach((moon) => {
      const isMoonHovered = isSameBody(state.hoverBody, moon);
      const isMoonSelected = isSameBody(state.selectedBody, moon);
      const moonRadius = Math.max(moon.radius * state.scale, 2.2) * (isMoonHovered ? 1.15 : 1);
      const shouldDrawMoon = mode === "all" || (mode === "background" && (!isMoonSelected || !hasFocus)) || (mode === "selected" && isMoonSelected);
      const moonVisible = isScreenCircleVisible(moon.screenX, moon.screenY, moonRadius, 56);

      if (!shouldDrawMoon || !moonVisible) {
        return;
      }

      state.visibleBodies.push(moon);
      ctx.save();
      if (hasFocus && !isMoonSelected) {
        ctx.globalAlpha = 0.18;
      }
      drawBody(moon, { x: moon.screenX, y: moon.screenY }, moonRadius, isMoonHovered, isMoonSelected, state.showLabels && (state.scale > 1.05 || isMoonHovered || isMoonSelected));
      ctx.restore();
    });
  });
}

function findBodyAtPoint(clientX, clientY) {
  const rect = state.canvasRect || canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const sunRadius = SUN_DATA.radius * state.scale;
  if (Math.hypot(x - SUN_DATA.screenX, y - SUN_DATA.screenY) <= sunRadius + 10) {
    return SUN_DATA;
  }

  for (let index = state.visibleBodies.length - 1; index >= 0; index -= 1) {
    const body = state.visibleBodies[index];
    const radius = Math.max(body.radius * state.scale, body.kind === "moon" ? 8 : 10);
    const distance = Math.hypot(x - body.screenX, y - body.screenY);
    if (distance <= radius + (body.kind === "moon" ? 3 : 4)) {
      return body;
    }
  }

  return null;
}

function hideTourCard() {
  tourCard.classList.add("hidden");
}

function showTourCard() {
  if (!state.hasStartedTour) {
    tourCard.classList.remove("hidden");
  }
}
function closeIntroTourModal() {
  introTourModal.classList.add("hidden");
}

function openIntroTourModal() {
  introTourModal.classList.remove("hidden");
}
const TOUR_SEQUENCE = [SUN_DATA, ...SOLAR_SYSTEM_PLANETS];
const TOUR_STEP_MS = 3000;

function syncTourButton() {
  tourToggleBtn.textContent = state.tourActive ? "Stop Tour" : "Start Tour";
  tourToggleBtn.classList.toggle("is-active", state.tourActive);
  tourToggleBtn.setAttribute("aria-pressed", String(state.tourActive));
}

function stopTour(clearSelection = false) {
  if (state.tourTimer) {
    clearTimeout(state.tourTimer);
    state.tourTimer = null;
  }
  state.tourActive = false;
  state.tourIndex = -1;
  if (clearSelection) {
    state.selectedBody = null;
    updateInfoPanel(null);
  }
  syncTourButton();
}

function queueNextTourStep() {
  if (!state.tourActive) {
    return;
  }

  state.tourTimer = setTimeout(() => {
    if (!state.tourActive) {
      return;
    }

    state.tourIndex += 1;
    if (state.tourIndex >= TOUR_SEQUENCE.length) {
      stopTour(true);
      return;
    }

    focusBody(TOUR_SEQUENCE[state.tourIndex]);
    queueNextTourStep();
  }, TOUR_STEP_MS);
}

function startTour() {
  closeIntroTourModal();
  state.hasStartedTour = true;
  hideTourCard();
  stopTour();
  state.tourActive = true;
  state.tourIndex = 0;
  syncTourButton();
  focusBody(TOUR_SEQUENCE[0]);
  queueNextTourStep();
}

function cancelTourOnInteraction() {
  if (state.tourActive) {
    stopTour();
  }
}
function updateInfoPanel(body) {
  if (!body) {
    closePanelBtn.classList.add("hidden");
    panelContent.classList.add("hidden");
    panelEmpty.classList.remove("hidden");
    floatingTip.classList.toggle("hidden", state.hasDismissedTip);
    simulationClock.classList.toggle("hidden", !state.hasDismissedTip);
    return;
  }

  closePanelBtn.classList.remove("hidden");
  panelEmpty.classList.add("hidden");
  panelContent.classList.remove("hidden");
  state.hasDismissedTip = true;
  floatingTip.classList.add("hidden");
  simulationClock.classList.remove("hidden");
  renderPanelPreview(body);
  details.type.textContent = body.type;
  details.name.textContent = body.name;
  details.name.classList.remove("is-medium-name", "is-long-name");
  if (body.name.length >= 8) {
    details.name.classList.add(body.name.length >= 10 ? "is-long-name" : "is-medium-name");
  }
  details.description.textContent = body.description;
  details.diameter.textContent = body.diameter;
  details.distance.textContent = body.distanceFromSun;
  details.moons.textContent = body.moons;
  details.atmosphere.textContent = body.atmosphere;
  details.composition.textContent = body.composition;
  details.temperature.textContent = body.temperature;
  details.orbit.textContent = body.orbitalPeriod;
  details.fact.textContent = body.funFact;
}

function focusBody(body) {
  if (!body || !body.currentPosition) {
    return;
  }

  state.selectedBody = body;
  const minimumScale = body.kind === "moon" ? 1.45 : body.kind === "star" ? 0.9 : 1.18;
  state.targetScale = clamp(Math.max(state.targetScale, minimumScale), state.minScale, state.maxScale);
  state.targetOffsetX = state.width * 0.5 - body.currentPosition.x * state.targetScale;
  state.targetOffsetY = state.height * 0.5 - body.currentPosition.y * state.targetScale;
  updateInfoPanel(body);
}

function zoomAtPoint(delta, clientX, clientY) {
  const rect = state.canvasRect || canvas.getBoundingClientRect();
  const pointerX = clientX - rect.left;
  const pointerY = clientY - rect.top;
  const worldBefore = {
    x: (pointerX - state.targetOffsetX) / state.targetScale,
    y: (pointerY - state.targetOffsetY) / state.targetScale
  };
  const nextScale = clamp(state.targetScale * delta, state.minScale, state.maxScale);
  state.targetScale = nextScale;
  state.targetOffsetX = pointerX - worldBefore.x * nextScale;
  state.targetOffsetY = pointerY - worldBefore.y * nextScale;
}

function drawFocusOverlay() {
  if (!hasFocusedSelection()) {
    return;
  }

  const gradient = ctx.createRadialGradient(
    state.selectedBody.screenX,
    state.selectedBody.screenY,
    18,
    state.selectedBody.screenX,
    state.selectedBody.screenY,
    Math.max(state.width, state.height) * 0.52
  );
  gradient.addColorStop(0, "rgba(3, 7, 22, 0)");
  gradient.addColorStop(0.55, "rgba(3, 7, 22, 0.05)");
  gradient.addColorStop(1, "rgba(3, 7, 22, 0.18)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, state.width, state.height);
}

function animate(timestamp) {
  if (!state.lastFrameTime) {
    state.lastFrameTime = timestamp;
  }
  const delta = Math.min(timestamp - state.lastFrameTime, 32);
  state.lastFrameTime = timestamp;
  state.simulationTime += delta * getSimulationDaysPerSecond();
  state.simulationDays += (delta / 1000) * getSimulationDaysPerSecond();
  if (state.speedPreset === "realtime") {
    state.simulationDateMs = Date.now();
  } else {
    state.simulationDateMs += delta * getSimulationDaysPerSecond() * 86400;
  }
  updateSimulationClock();

  ctx.clearRect(0, 0, state.width, state.height);
  drawBackground(timestamp);
  state.scale = lerp(state.scale, state.targetScale, 0.08);
  state.offsetX = lerp(state.offsetX, state.targetOffsetX, 0.08);
  state.offsetY = lerp(state.offsetY, state.targetOffsetY, 0.08);
  state.wobbleX = lerp(state.wobbleX, state.targetWobbleX, 0.14);
  state.wobbleY = lerp(state.wobbleY, state.targetWobbleY, 0.14);
  state.targetWobbleX = lerp(state.targetWobbleX, 0, state.dragging ? 0.08 : 0.18);
  state.targetWobbleY = lerp(state.targetWobbleY, 0, state.dragging ? 0.08 : 0.18);
  updateBodyPositions(state.simulationDays);
  state.visibleBodies.length = 0;

  if (hasFocusedSelection()) {
    drawOrbits("background");
    drawAsteroidBelt(state.simulationTime, "background");
    drawKuiperBelt(state.simulationTime, "background");
    drawSun("background");
    drawBodies("background");
    drawFocusOverlay();
    drawSun("selected");
    drawBodies("selected");
    drawMeasurementOverlay();
  } else {
    drawOrbits("all");
    drawAsteroidBelt(state.simulationTime, "all");
    drawKuiperBelt(state.simulationTime, "all");
    drawSun("all");
    drawBodies("all");
    drawMeasurementOverlay();
  }

  requestAnimationFrame(animate);
}

function simulateLoading() {
  const checkpoints = [14, 29, 48, 67, 82, 96, 100];
  let index = 0;
  const step = () => {
    loadingProgress.style.width = `${checkpoints[index]}%`;
    index += 1;
    if (index < checkpoints.length) {
      setTimeout(step, index === checkpoints.length - 1 ? 280 : 220);
      return;
    }
    loadingScreen.classList.add("fade-out");
    appShell.classList.add("ready");
    requestAnimationFrame(() => resizeCanvas(true));
    setTimeout(() => openIntroTourModal(), 420);
  };
  step();
}

function bindEvents() {
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    cancelTourOnInteraction();
    zoomAtPoint(event.deltaY < 0 ? 1.12 : 0.9, event.clientX, event.clientY);
  }, { passive: false });

  canvas.addEventListener("pointerdown", (event) => {
    cancelTourOnInteraction();

    if (state.measureActive) {
      state.measureDragging = true;
      state.measureStart = getMeasurementPoint(event.clientX, event.clientY);
      state.measureEnd = state.measureStart;
      updateMeasureUI();
      canvas.setPointerCapture?.(event.pointerId);
      canvas.style.cursor = "crosshair";
      return;
    }

    if (isMobileViewport() && event.pointerType === "touch") {
      state.touchPoints[event.pointerId] = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
      canvas.setPointerCapture?.(event.pointerId);

      if (getTouchPointList().length >= 2) {
        beginPinchGesture();
        return;
      }

      state.pinching = false;
      state.dragging = true;
      state.activePointerId = event.pointerId;
      state.dragMoved = false;
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;
      return;
    }

    if (!event.isPrimary) {
      return;
    }

    state.pinching = false;
    state.dragging = true;
    state.activePointerId = event.pointerId;
    state.dragMoved = false;
    state.lastPointerX = event.clientX;
    state.lastPointerY = event.clientY;
    canvas.setPointerCapture?.(event.pointerId);
  });

  window.addEventListener("pointermove", (event) => {
    if (state.measureActive && state.measureDragging) {
      state.measureEnd = getMeasurementPoint(event.clientX, event.clientY);
      updateMeasureUI();
      canvas.style.cursor = "crosshair";
      return;
    }

    if (event.pointerType === "touch" && state.touchPoints[event.pointerId]) {
      state.touchPoints[event.pointerId] = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
      if (getTouchPointList().length >= 2) {
        updatePinchGesture();
        state.hoverBody = null;
        canvas.style.cursor = "grabbing";
        return;
      }
    }

    if (state.dragging && event.pointerId === state.activePointerId && !state.pinching) {
      const dx = event.clientX - state.lastPointerX;
      const dy = event.clientY - state.lastPointerY;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        state.dragMoved = true;
      }
      state.targetOffsetX += dx;
      state.targetOffsetY += dy;
      state.targetWobbleX = clamp(state.targetWobbleX + dx * 0.16, -18, 18);
      state.targetWobbleY = clamp(state.targetWobbleY + dy * 0.16, -12, 12);
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;
    }

    if (!isMobileViewport() && event.pointerType !== "touch") {
      state.hoverBody = findBodyAtPoint(event.clientX, event.clientY);
    } else if (!state.dragging && !state.pinching) {
      state.hoverBody = null;
    }
    canvas.style.cursor = state.dragging || state.pinching ? "grabbing" : state.hoverBody ? "pointer" : "grab";
  });

  window.addEventListener("pointerup", (event) => {
    if (state.measureActive && state.measureDragging) {
      state.measureEnd = getMeasurementPoint(event.clientX, event.clientY);
      state.measureDragging = false;
      updateMeasureUI();
      canvas.style.cursor = "crosshair";
      return;
    }

    const wasPinching = state.pinching;
    const wasDragging = state.dragging;
    const wasDragMoved = state.dragMoved;
    const releasedActivePointerId = state.activePointerId;

    if (event.pointerType === "touch") {
      endTouchPointer(event.pointerId);
      if (wasPinching) {
        canvas.style.cursor = "grabbing";
        return;
      }
    }

    if (releasedActivePointerId !== null && event.pointerId !== releasedActivePointerId) {
      return;
    }
    const clickedBody = findBodyAtPoint(event.clientX, event.clientY);
    if (wasDragging && !wasDragMoved && clickedBody) {
      cancelTourOnInteraction();
      focusBody(clickedBody);
    } else if (wasDragging && !wasDragMoved && !clickedBody) {
      state.selectedBody = null;
      updateInfoPanel(null);
    }
    state.dragging = false;
    state.activePointerId = null;
    canvas.style.cursor = state.hoverBody ? "pointer" : "grab";
  });

  window.addEventListener("pointercancel", (event) => {
    if (state.measureActive) {
      state.measureDragging = false;
      canvas.style.cursor = "crosshair";
      return;
    }

    if (event.pointerType === "touch") {
      endTouchPointer(event.pointerId);
      if (state.pinching) {
        canvas.style.cursor = "grabbing";
        return;
      }
    }
    if (state.activePointerId !== null && event.pointerId !== state.activePointerId) {
      return;
    }
    state.dragging = false;
    state.activePointerId = null;
    state.hoverBody = null;
    canvas.style.cursor = "grab";
  });

  window.addEventListener("resize", () => resizeCanvas(true));

  if (typeof ResizeObserver === "function") {
    const observer = new ResizeObserver(() => resizeCanvas(true));
    observer.observe(viewportCard);
  }

  document.getElementById("zoomInBtn").addEventListener("click", () => {
    cancelTourOnInteraction();
    zoomAtPoint(1.18, state.width * 0.5, state.height * 0.5);
  });
  document.getElementById("zoomOutBtn").addEventListener("click", () => {
    cancelTourOnInteraction();
    zoomAtPoint(0.84, state.width * 0.5, state.height * 0.5);
  });
  document.getElementById("resetViewBtn").addEventListener("click", () => {
    cancelTourOnInteraction();
    state.selectedBody = null;
    resetView(true);
    updateInfoPanel(null);
  });
  measureToolbarBtn.addEventListener("click", () => {
    state.measureActive = !state.measureActive;
    state.speedMenuOpen = false;
    state.compareMenuOpen = false;
    closeComparisonOverlay();
    if (!state.measureActive) {
      clearMeasurement();
      canvas.style.cursor = state.hoverBody ? "pointer" : "grab";
    } else {
      state.measureDragging = false;
      updateMeasureUI();
      canvas.style.cursor = "crosshair";
    }
    updateSpeedUI();
  });
  measureCloseBtn.addEventListener("click", () => {
    state.measureActive = false;
    clearMeasurement();
    canvas.style.cursor = state.hoverBody ? "pointer" : "grab";
    updateMeasureUI();
  });
  speedToolbarBtn.addEventListener("click", () => {
    state.speedMenuOpen = !state.speedMenuOpen;
    state.compareMenuOpen = false;
    closeComparisonOverlay();
    if (state.speedMenuOpen) {
      state.measureActive = false;
      clearMeasurement();
      canvas.style.cursor = state.hoverBody ? "pointer" : "grab";
    }
    updateMeasureUI();
    updateSpeedUI();
  });
  speedCloseBtn.addEventListener("click", () => {
    state.speedMenuOpen = false;
    updateSpeedUI();
  });
  speedButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.speedPreset = button.dataset.speed;
      state.speedMenuOpen = false;
      updateSpeedUI();
    });
  });
  compareToolbarBtn.addEventListener("click", () => {
    state.compareMenuOpen = !state.compareMenuOpen;
    state.measureActive = false;
    state.speedMenuOpen = false;
    state.comparisonOpen = false;
    clearMeasurement();
    canvas.style.cursor = state.hoverBody ? "pointer" : "grab";
    updateMeasureUI();
    updateSpeedUI();
    updateCompareUI();
  });
  compareCloseBtn.addEventListener("click", () => {
    state.compareMenuOpen = false;
    state.comparisonOpen = false;
    updateCompareUI();
  });
  compareFirstSelect.addEventListener("change", () => {
    state.compareFirst = compareFirstSelect.value;
  });
  compareSecondSelect.addEventListener("change", () => {
    state.compareSecond = compareSecondSelect.value;
  });
  compareLaunchBtn.addEventListener("click", () => {
    state.compareFirst = compareFirstSelect.value;
    state.compareSecond = compareSecondSelect.value;
    openComparisonOverlay();
  });
  comparisonCloseBtn.addEventListener("click", () => {
    closeComparisonOverlay();
  });
  compareBackdrop.addEventListener("click", () => {
    closeComparisonOverlay();
  });
  measureUnitButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.measureUnit = button.dataset.unit;
      updateMeasureUI();
    });
  });
  tourToggleBtn.addEventListener("click", () => {
    if (state.tourActive) {
      stopTour(true);
      return;
    }
    startTour();
  });
  toggleLabelsBtn.addEventListener("click", () => {
    state.showLabels = !state.showLabels;
    toggleLabelsBtn.classList.toggle("is-active", state.showLabels);
    toggleLabelsBtn.textContent = state.showLabels ? "Labels On" : "Labels Off";
    toggleLabelsBtn.setAttribute("aria-pressed", String(state.showLabels));
  });
  toggleControlsBtn.addEventListener("click", () => {
    state.controlsCollapsed = !state.controlsCollapsed;
    controlsBar.classList.toggle("is-collapsed", state.controlsCollapsed);
    controlsWrap.classList.toggle("is-collapsed", state.controlsCollapsed);
    toggleControlsBtn.classList.toggle("is-collapsed", state.controlsCollapsed);
    toggleControlsBtn.innerHTML = state.controlsCollapsed ? '&#10095;' : '&#10094;';
    toggleControlsBtn.setAttribute("aria-expanded", String(!state.controlsCollapsed));
    toggleControlsBtn.setAttribute("aria-label", state.controlsCollapsed ? "Expand controls" : "Collapse controls");
  });
  closePanelBtn.addEventListener("click", () => {
    cancelTourOnInteraction();
    state.selectedBody = null;
    updateInfoPanel(null);
  });
  startIntroTourBtn.addEventListener("click", () => startTour());
  notNowIntroTourBtn.addEventListener("click", () => {
    closeIntroTourModal();
    showTourCard();
  });
  introTourModal.addEventListener("click", (event) => {
    if (event.target === introTourModal) {
      closeIntroTourModal();
      showTourCard();
    }
  });
  helpBtn.addEventListener("click", () => {
    cancelTourOnInteraction();
    helpModal.classList.remove("hidden");
  });
  closeHelpBtn.addEventListener("click", () => helpModal.classList.add("hidden"));
  helpModal.addEventListener("click", (event) => {
    if (event.target === helpModal) {
      helpModal.classList.add("hidden");
    }
  });
}
function init() {
  resizeCanvas(false);
  bindEvents();
  syncTourButton();
  updateInfoPanel(null);
  populateCompareOptions();
  updateMeasureUI();
  updateSpeedUI();
  updateCompareUI();
  updateSimulationClock();
  requestAnimationFrame(animate);

  if (document.fonts && typeof document.fonts.ready?.then === "function") {
    document.fonts.ready.then(() => resizeCanvas(true));
  }

  simulateLoading();
}

window.addEventListener("load", init);














































































































































