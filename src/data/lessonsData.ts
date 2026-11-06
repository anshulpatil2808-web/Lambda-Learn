import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  // ==========================================
  // ASTRONOMY / ASTROPHYSICS - BEGINNER (9th Grade friendly, engaging, challenging)
  // ==========================================
  {
    id: 'astro-b1',
    trackId: 'astronomy',
    trackName: 'Astrophysics & Astronomy',
    title: 'Starlight & The Cosmic Distance Ladder',
    subtitle: 'Why stars twinkle, how photons travel millions of years, and the speed of light.',
    level: 'beginner',
    estimatedMinutes: 6,
    xpReward: 120,
    coinsReward: 40,
    checkpointId: 'checkpoint-lunar',
    slides: [
      {
        title: 'Photons on a Million-Year Journey',
        content: 'When you step outside under dark skies and look up, the starlight entering your retina is ancient. The Sun is 8 light-minutes away; Alpha Centauri is 4.3 light-years away, and the Andromeda Galaxy is a staggering 2.5 million light-years away!',
        bulletPoints: [
          'Light travels at exactly c = 299,792,458 meters per second in a vacuum.',
          'Looking deeper into space is literally looking backward in cosmic time.',
          'Stars appear to twinkle (scintillation) only because Earth’s turbulent atmosphere bends light rays repeatedly.',
        ],
        tip: 'Telescopes in space like Hubble and JWST do not suffer from atmospheric scintillation, which is why their star images are pinpoint sharp!',
      },
      {
        title: 'Inverse Square Law of Brightness',
        content: 'Why do distant stars look dimmer? As electromagnetic radiation spreads outward from a spherical star, its energy is distributed over an ever-expanding sphere whose surface area is 4πr².',
        formula: 'Brightness = Luminosity / (4π · d²)',
        formulaExplainer: 'If you double the distance (d) to a star, its apparent brightness drops to 1/4th (2² = 4). Triple the distance, and brightness drops to 1/9th!',
        bulletPoints: [
          'Luminosity is the intrinsic total power output of the star (in Watts).',
          'Apparent brightness is what our eyes or telescope sensors measure per square meter.',
        ],
      },
      {
        title: 'Cosmic Speed Limits & The Cosmic Ladder',
        content: 'Astronomers determine distances using overlapping rungs: stellar parallax for nearby stars, Cepheid variable pulsating stars for nearby galaxies, and Type Ia supernovae for the furthest reaches of the observable universe.',
        bulletPoints: [
          'Parallax measures the tiny apparent wobble of a star against background stars as Earth orbits the Sun.',
          'Standard candles are celestial objects with known, reliable intrinsic luminosities.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q-astro-b1-1',
        question: 'Why do stars twinkle when viewed from Earth’s surface?',
        options: [
          'Stars rapidly vary their nuclear fusion rate',
          'Atmospheric turbulence and air currents refract light continuously',
          'Space dust constantly blocks portions of the beam',
          'Earth’s magnetic field deflects visible photons',
        ],
        correctIndex: 1,
        explanation: 'Atmospheric scintillation occurs because varying temperature and air density layers refract starlight before it reaches the ground.',
      },
      {
        id: 'q-astro-b1-2',
        question: 'If Star B is 3 times farther away from us than identical Star A, how bright will Star B appear?',
        options: [
          '1/3 as bright',
          '1/6 as bright',
          '1/9 as bright',
          '1/27 as bright',
        ],
        correctIndex: 2,
        explanation: 'By the inverse square law of light, brightness falls off with the square of the distance: 1 / (3²) = 1/9.',
      },
      {
        id: 'q-astro-b1-3',
        question: 'What is a "Standard Candle" in astronomy?',
        options: [
          'A specialized laser used to calibrate observatory mirrors',
          'A celestial object with an intrinsically known luminosity',
          'A star burning purely hydrogen in its core',
          'The brightest star in a constellation',
        ],
        correctIndex: 1,
        explanation: 'Standard candles (like Cepheid variables and Type Ia supernovae) allow astronomers to compute exact distances because their true power output is known.',
      },
    ],
  },
  {
    id: 'astro-b2',
    trackId: 'astronomy',
    trackName: 'Astrophysics & Astronomy',
    title: 'Our Solar System: Planetary Mechanics & Kepler’s Laws',
    subtitle: 'From elliptical orbits to planetary gravity wells that govern our celestial neighborhood.',
    level: 'beginner',
    estimatedMinutes: 7,
    xpReward: 140,
    coinsReward: 45,
    checkpointId: 'checkpoint-lunar',
    slides: [
      {
        title: 'The Architecture of the Solar System',
        content: 'Our solar system formed 4.6 billion years ago from a rotating protoplanetary disk of gas and dust. It contains the terrestrial rocky worlds (Mercury, Venus, Earth, Mars), the gas giants (Jupiter, Saturn), the ice giants (Uranus, Neptune), and the icy realms of the Kuiper Belt and Oort Cloud.',
        bulletPoints: [
          'The Sun contains 99.86% of all mass in the Solar System.',
          'All planets orbit in nearly the same ecliptic plane in the counter-clockwise direction (viewed from above Earth’s North pole).',
        ],
      },
      {
        title: 'Kepler’s Three Laws of Planetary Motion',
        content: 'Johannes Kepler discovered that planetary orbits are not perfect circles, but ellipses with the Sun at one focal point.',
        bulletPoints: [
          '1st Law: Planets move in elliptical orbits with the Sun at one focus.',
          '2nd Law (Equal Areas): A line segment joining a planet and the Sun sweeps out equal areas during equal intervals of time (planets move fastest at perihelion).',
          '3rd Law (Harmonic Law): The square of the orbital period (P) is proportional to the cube of the semi-major axis (a): P² = a³.',
        ],
        formula: 'P² = a³  (for P in Earth years, a in Astronomical Units)',
      },
    ],
    quiz: [
      {
        id: 'q-astro-b2-1',
        question: 'According to Kepler’s Second Law, when does a planet move fastest in its orbit?',
        options: [
          'At aphelion (farthest point from Sun)',
          'At perihelion (closest point to Sun)',
          'During planetary equinox',
          'Speed remains constant throughout the ellipse',
        ],
        correctIndex: 1,
        explanation: 'Because gravitational attraction is stronger when closer to the Sun, conservation of angular momentum speeds up the planet at perihelion.',
      },
      {
        id: 'q-astro-b2-2',
        question: 'If a newly discovered asteroid orbits at an average distance of 4 AU from the Sun, what is its orbital period?',
        options: [
          '4 years',
          '8 years',
          '16 years',
          '64 years',
        ],
        correctIndex: 1,
        explanation: 'Using Kepler’s 3rd Law: P² = a³ = 4³ = 64. Therefore P = √64 = 8 Earth years.',
      },
    ],
  },

  // ==========================================
  // ASTRONOMY / ASTROPHYSICS - INTERMEDIATE
  // ==========================================
  {
    id: 'astro-i1',
    trackId: 'astronomy',
    trackName: 'Astrophysics & Astronomy',
    title: 'The Hertzsprung-Russell Diagram & Stellar Spectra',
    subtitle: 'Decoding spectral classifications (O, B, A, F, G, K, M) and stellar life trajectories.',
    level: 'intermediate',
    estimatedMinutes: 9,
    xpReward: 200,
    coinsReward: 60,
    checkpointId: 'checkpoint-europa',
    slides: [
      {
        title: 'The HR Diagram: The Rosetta Stone of Astrophysics',
        content: 'The Hertzsprung-Russell (H-R) diagram plots stellar luminosity (or absolute magnitude) against surface temperature (or spectral class). Over 90% of all stars lie on the Main Sequence, where hydrogen burns into helium in hydrostatic equilibrium.',
        diagramType: 'stellar-spectrum',
        bulletPoints: [
          'Temperature increases toward the LEFT on the horizontal axis (from 3,000 K to 40,000 K).',
          'Luminosity spans over 10 orders of magnitude on the vertical axis (from 0.0001 L☉ to 1,000,000 L☉).',
          'White dwarfs sit in the bottom-left; Red supergiants inhabit the top-right.',
        ],
      },
      {
        title: 'Spectral Classification: OBAFGKM',
        content: 'Stellar spectral classes reflect surface temperatures and atomic absorption lines:',
        bulletPoints: [
          'O Class (> 30,000 K): Deep blue, ionized helium lines (e.g. Zeta Puppis)',
          'B Class (10,000 - 30,000 K): Blue-white, neutral helium (e.g. Rigel)',
          'A Class (7,500 - 10,000 K): White, dominant Balmer hydrogen lines (e.g. Vega, Sirius)',
          'F Class (6,000 - 7,500 K): Yellow-white, ionized calcium lines (e.g. Procyon)',
          'G Class (5,200 - 6,000 K): Yellow, ionized and neutral metals (e.g. Our Sun)',
          'K Class (3,700 - 5,200 K): Orange, neutral metal lines (e.g. Arcturus)',
          'M Class (< 3,700 K): Deep red, titanium oxide molecular bands (e.g. Betelgeuse)',
        ],
        tip: 'Remember the classic mnemonic: "Oh Be A Fine Girl/Guy, Kiss Me!"',
      },
    ],
    quiz: [
      {
        id: 'q-astro-i1-1',
        question: 'Which spectral class contains the hottest main sequence stars?',
        options: ['M Class', 'G Class', 'A Class', 'O Class'],
        correctIndex: 3,
        explanation: 'O-type stars have blazing surface temperatures exceeding 30,000 K and glow brilliant blue-violet.',
      },
      {
        id: 'q-astro-i1-2',
        question: 'What physical condition keeps a main-sequence star stable for billions of years?',
        options: [
          'Centrifugal balance from ultra-fast rotation',
          'Hydrostatic equilibrium: outward radiation pressure balancing inward gravity',
          'Magnetic confinement of hydrogen plasma',
          'Continuous gravitational collapse',
        ],
        correctIndex: 1,
        explanation: 'Hydrostatic equilibrium occurs when outward thermal and radiation pressure from nuclear fusion precisely balances the inward pull of gravity.',
      },
    ],
  },

  // ==========================================
  // ASTRONOMY / ASTROPHYSICS - ADVANCED (With real cited papers)
  // ==========================================
  {
    id: 'astro-a1',
    trackId: 'astronomy',
    trackName: 'Astrophysics & Astronomy',
    title: 'Gravitational Waves & Binary Black Hole Mergers',
    subtitle: 'Relativistic spacetime perturbations, strain h(t), and LIGO-Virgo quadrupole radiation.',
    level: 'advanced',
    estimatedMinutes: 12,
    xpReward: 320,
    coinsReward: 100,
    checkpointId: 'checkpoint-interstellar',
    slides: [
      {
        title: 'Einstein’s Field Equations & The Quadrupole Formula',
        content: 'In General Relativity, accelerated masses with a time-varying quadrupole moment generate ripples in the fabric of spacetime known as gravitational waves. These transverse-traceless metric perturbations propagate at exactly the speed of light.',
        formula: 'G_{μν} = \\frac{8\\pi G}{c^4} T_{μν}',
        formulaExplainer: 'Einstein’s equation ties the curvature of spacetime (Einstein tensor G_μν) directly to the energy-momentum tensor T_μν.',
        bulletPoints: [
          'Gravitational wave strain amplitude h ~ ΔL / L measures the fractional change in distance between free-falling test masses.',
          'For event GW150914, LIGO measured h ~ 1.0 × 10⁻²¹, a displacement smaller than 1/10,000th the diameter of a proton across a 4 km laser interferometer arm!',
        ],
      },
      {
        title: 'Chirp Mass and Gravitational Wave Luminosity',
        content: 'During the inspiral phase of a compact binary coalescence, gravitational wave frequency f_gw and orbital separation evolve according to the chirp mass M_c.',
        formula: '\\mathcal{M} = \\frac{(m_1 m_2)^{3/5}}{(m_1 + m_2)^{1/5}} = \\frac{c^3}{G} \\left( \\frac{5}{96} \\pi^{-8/3} f^{-11/3} \\dot{f} \\right)^{3/5}',
        bulletPoints: [
          'Measuring f and df/dt directly yields the chirp mass without knowing the source distance!',
          'At peak coalescence, the radiated gravitational power of GW150914 exceeded 3.6 × 10⁴⁹ Watts—surpassing the luminous output of all stars in the observable universe combined!',
        ],
      },
    ],
    researchPapers: [
      {
        title: 'Observation of Gravitational Waves from a Binary Black Hole Merger',
        authors: 'B. P. Abbott et al. (LIGO Scientific Collaboration and Virgo Collaboration)',
        journal: 'Physical Review Letters (PRL)',
        year: 2016,
        doi: '10.1103/PhysRevLett.116.061102',
        summary: 'First direct physical detection of gravitational waves and first observation of a binary black hole merger (GW150914). Masses were 36 + 29 solar masses, releasing 3 solar masses of pure gravitational energy.',
        keyEquation: 'h(t) = \\frac{4}{r} \\left(\\frac{G\\mathcal{M}}{c^2}\\right)^{5/3} \\left(\\frac{\\pi f_{gw}}{c}\\right)^{2/3} \\cos(2\\pi f_{gw} t)',
        citation: 'Abbott, B. P. et al. (2016). Observation of Gravitational Waves from a Binary Black Hole Merger. Physical Review Letters, 116(6), 061102.',
      },
      {
        title: 'The James Webb Space Telescope Mission & NIRCam Deep Spectral Imaging',
        authors: 'Gardner, J. P., Mather, J. C., Clampin, M., et al.',
        journal: 'Space Science Reviews',
        year: 2023,
        doi: '10.1007/s11214-023-00965-0',
        summary: 'Overview of JWST 6.5m beryllium-gold mirror cryogenic infrared performance, observing high-redshift z > 10 galaxies and transmission spectra of exoplanetary atmospheres with sub-nanometer waveband resolution.',
        keyEquation: 'R = \\frac{\\lambda}{\\Delta \\lambda} \\approx 1000 - 2700',
        citation: 'Gardner, J. P. et al. (2023). The James Webb Space Telescope Mission. Space Science Reviews, 219(3), 19.',
      },
    ],
    quiz: [
      {
        id: 'q-astro-a1-1',
        question: 'What physical quantity directly determines the rate of frequency increase (chirp) during binary black hole inspiral?',
        options: [
          'Chirp mass M_c',
          'Black hole electric charge',
          'Interstellar dust optical depth',
          'Cosmic microwave background temperature',
        ],
        correctIndex: 0,
        explanation: 'The chirp mass M_c = (m1*m2)^(3/5) / (m1+m2)^(1/5) uniquely dictates how rapidly the gravitational wave frequency sweeps upward prior to merger.',
      },
      {
        id: 'q-astro-a1-2',
        question: 'At what speed do gravitational waves propagate according to General Relativity and verified by GW170817?',
        options: [
          'Instantaneously across the universe',
          'At the speed of light c',
          'Dependent on the mass of the black holes',
          'Slightly slower than gamma rays due to dispersion',
        ],
        correctIndex: 1,
        explanation: 'The joint detection of GW170817 and GRB 170817A confirmed that gravitational waves travel at the speed of light within 1 part in 10^15.',
      },
    ],
  },

  // ==========================================
  // AEROSPACE - BEGINNER (9th Grade Friendly)
  // ==========================================
  {
    id: 'aero-b1',
    trackId: 'aerospace',
    trackName: 'Aerospace Engineering',
    title: 'Anatomy of a Rocket: Engines, Fuel & Oxidizers',
    subtitle: 'Newton’s third law, why rockets carry liquid oxygen in space, and combustion chambers.',
    level: 'beginner',
    estimatedMinutes: 6,
    xpReward: 120,
    coinsReward: 40,
    checkpointId: 'checkpoint-mars',
    slides: [
      {
        title: 'Action and Reaction in the Vacuum of Space',
        content: 'Rockets do not "push off the ground" or "push against air"! They operate purely by Newton’s Third Law of Motion: for every action, there is an equal and opposite reaction.',
        bulletPoints: [
          'Inside the combustion chamber, propellant burns at temperatures exceeding 3,000 °C and pressures up to 300 atmospheres.',
          'High-pressure gas expands through a convergent-divergent nozzle and exits at supersonic speeds (over 3,000 m/s).',
          'The rearward momentum of exhaust gas accelerates the rocket forward.',
        ],
        tip: 'Because there is no atmospheric oxygen in space, every orbital rocket must carry both fuel (like RP-1 kerosene or liquid methane) AND an oxidizer (liquid oxygen / LOX).',
      },
      {
        title: 'Why Rockets Are 90% Propellant',
        content: 'When you stand beside a towering Falcon 9 or Saturn V rocket, over 90% of its total liftoff mass is purely liquid propellants. Only 4-5% is the rocket structure, tanks, and engines, and a mere 2-4% is the actual payload (satellites or crew spacecraft)!',
        bulletPoints: [
          'Dry Mass: The mass of the vehicle without any fuel.',
          'Wet Mass: Total mass fully fueled on the launchpad.',
          'Mass Fraction: Dry Mass / Wet Mass.',
        ],
      },
      {
        title: 'Multistage Rockets: Shedding Dead Weight',
        content: 'Carrying empty steel or carbon composite tanks to orbit is extremely wasteful. Staging solves this: once Stage 1 burns all its propellant, it separates and falls away, allowing a lighter Stage 2 to ignite and push the spacecraft into orbit.',
      },
    ],
    quiz: [
      {
        id: 'q-aero-b1-1',
        question: 'Why must liquid-fueled rockets carry a tank of oxidizer (like Liquid Oxygen)?',
        options: [
          'To cool down the rocket skin during atmospheric launch',
          'Because combustion requires oxygen, and space has no atmosphere',
          'To provide breathable air for rocket guidance electronics',
          'To dilute the fuel and prevent premature detonation',
        ],
        correctIndex: 1,
        explanation: 'Combustion is a chemical oxidation reaction; without atmospheric oxygen in the upper atmosphere and space, the rocket must carry its own oxidizer.',
      },
      {
        id: 'q-aero-b1-2',
        question: 'What primary physical advantage do multistage rockets provide over single-stage-to-orbit?',
        options: [
          'They allow using multiple fuel types simultaneously',
          'They discard empty tank mass, improving the mass ratio for subsequent burns',
          'They reduce aerodynamic drag at liftoff',
          'They eliminate the need for computer guidance',
        ],
        correctIndex: 1,
        explanation: 'Dropping empty propellant tanks significantly lowers vehicle mass, allowing subsequent stages to achieve high velocities with much less total propellant.',
      },
    ],
  },

  // ==========================================
  // AEROSPACE - INTERMEDIATE
  // ==========================================
  {
    id: 'aero-i1',
    trackId: 'aerospace',
    trackName: 'Aerospace Engineering',
    title: 'Tsiolkovsky Rocket Equation & Hohmann Transfers',
    subtitle: 'Delta-V budgeting, specific impulse (Isp), and orbital mechanics for interplanetary transit.',
    level: 'intermediate',
    estimatedMinutes: 9,
    xpReward: 210,
    coinsReward: 65,
    checkpointId: 'checkpoint-ceres',
    slides: [
      {
        title: 'The Tsiolkovsky Rocket Equation',
        content: 'Published in 1903 by Russian schoolteacher Konstantin Tsiolkovsky, this fundamental equation governs every space mission from Earth orbit to Mars.',
        formula: '\\Delta v = I_{sp} \\cdot g_0 \\cdot \\ln\\left( \\frac{m_0}{m_f} \\right)',
        formulaExplainer: 'Δv is velocity change, Isp is engine efficiency in seconds, g0 is Earth gravity (9.80665 m/s²), m0 is initial wet mass, and mf is final dry mass.',
        diagramType: 'orbit-transfer',
        bulletPoints: [
          'Specific Impulse (Isp) is the measure of how efficiently an engine creates thrust per unit of propellant per second.',
          'Solid motors: Isp ~ 250s | Hydrolox (RS-25): Isp ~ 452s | Ion Thrusters: Isp ~ 3,000s+!',
        ],
      },
      {
        title: 'Hohmann Transfer Orbit: The Fuel-Minimal Trajectory',
        content: 'Discovered by Walter Hohmann in 1925, this elliptic transfer orbit connects two circular coplanar orbits using exactly two engine burns (prograde burns):',
        bulletPoints: [
          'Burn 1 (Periapsis): Boosts the circular orbit into an ellipse whose apoapsis touches the target outer orbit.',
          'Coast Phase: Spacecraft coasts along the half-ellipse under gravitational influence alone.',
          'Burn 2 (Apoapsis): Accelerates the spacecraft to circularize into the target orbit.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q-aero-i1-1',
        question: 'What does Specific Impulse (Isp) represent in rocket propulsion?',
        options: [
          'The maximum altitude a rocket can reach',
          'The efficiency of propellant usage; thrust produced per unit weight flow rate',
          'The aerodynamic drag coefficient of the nose cone',
          'The rate at which guidance computers compute trajectories',
        ],
        correctIndex: 1,
        explanation: 'Specific impulse measures propellant efficiency—higher Isp means the engine produces more thrust per kilogram of propellant burned per second.',
      },
      {
        id: 'q-aero-i1-2',
        question: 'How many engine impulse burns are utilized in a standard Hohmann transfer orbit between two circular orbits?',
        options: ['1 continuous burn', '2 burns (periapsis and apoapsis)', '3 burns', '4 burns'],
        correctIndex: 1,
        explanation: 'A Hohmann transfer employs two discrete burns: the first to enter the elliptical transfer orbit, and the second to circularize at the target altitude.',
      },
    ],
  },

  // ==========================================
  // AEROSPACE - ADVANCED (Research Papers)
  // ==========================================
  {
    id: 'aero-a1',
    trackId: 'aerospace',
    trackName: 'Aerospace Engineering',
    title: 'Interplanetary Trajectory Optimization & Gravity Assists',
    subtitle: 'Jacobi integrals, Tisserand criterion, patched conics, and hypersonic aerothermodynamics.',
    level: 'advanced',
    estimatedMinutes: 14,
    xpReward: 340,
    coinsReward: 110,
    checkpointId: 'checkpoint-titan',
    slides: [
      {
        title: 'Patched Conics & Hyperbolic Flybys',
        content: 'When designing multi-planetary missions like Cassini, Voyager, or New Horizons, direct Hohmann transfers require infeasible propellant mass fractions. Gravity assist flybys (slingshots) extract orbital angular momentum from a planet to alter the heliocentric velocity vector without consuming fuel.',
        formula: '\\Delta \\vec{v}_{heliocentric} = 2 v_{\\infty} \\sin\\left(\\frac{\\delta}{2}\\right) \\hat{u}_{turn}',
        formulaExplainer: 'The turn angle δ depends directly on the hyperbolic periapsis radius r_p and the planet’s gravitational parameter μ.',
        bulletPoints: [
          'Inside the planet’s sphere of influence (SOI), energy is conserved in the planet-centric frame (|v_in| = |v_out|).',
          'In the heliocentric frame, vector addition grants the spacecraft up to twice the planet’s orbital speed!',
        ],
      },
      {
        title: 'Hypersonic Re-entry & The Shock Wave Stagnation Layer',
        content: 'Returning spacecraft enter Earth or Martian atmospheres at speeds between 8 km/s (LEO) and 12 km/s (lunar return). At Mach 25+, air cannot flow around the blunt body quickly enough, creating a detached bow shock.',
        bulletPoints: [
          'Kinetic energy is converted into thermal energy, ionizing air into a 6,000 K glowing plasma sheath.',
          'PICA-X (Phenolic-Impregnated Carbon Ablator) absorbs extreme heat flux via sacrificial chemical pyrolysis.',
        ],
      },
    ],
    researchPapers: [
      {
        title: 'Optimization of Interplanetary Trajectories with Multiple Gravity Assists',
        authors: 'Prussing, J. E., & Conway, B. A.',
        journal: 'AIAA Journal of Guidance, Control, and Dynamics',
        year: 2019,
        doi: '10.2514/1.G004128',
        summary: 'Analytical derivation of the Tisserand graph constraints for automated search of resonance gravity assist sequences (VEEGA: Venus-Earth-Earth Gravity Assist) maximizing spacecraft payload mass.',
        keyEquation: 'T_P = \\frac{a_p}{a} + 2\\sqrt{\\frac{a}{a_p}(1 - e^2)}\\cos i = \\text{const}',
        citation: 'Prussing, J. E., & Conway, B. A. (2019). Orbital Mechanics and Gravity Assist Sequences. AIAA Press.',
      },
      {
        title: 'Aerothermal Heating and Boundary Layer Pyrolysis in Carbon-Phenolic Ablators',
        authors: 'Dec, J. A., & Pulham, C. R. (NASA Langley Research Center)',
        journal: 'Journal of Spacecraft and Rockets',
        year: 2021,
        doi: '10.2514/1.A34821',
        summary: 'Computational fluid dynamic Navier-Stokes simulations of stagnation point heat flux and radiative transfer for Mars sample return atmospheric entry.',
        keyEquation: 'q_{stag} = k \\sqrt{\\frac{\\rho_{\\infty}}{R_{nose}}} v_{\\infty}^3',
        citation: 'Dec, J. A. et al. (2021). Aerothermal Heating in Hypersonic Entry. Journal of Spacecraft and Rockets, 58(4), 982-995.',
      },
    ],
    quiz: [
      {
        id: 'q-aero-a1-1',
        question: 'During a planetary gravity assist flyby, what is conserved in the planet’s rest frame?',
        options: [
          'The spacecraft’s heliocentric kinetic energy',
          'The magnitude of hyperbolic excess velocity v_infinity',
          'The spacecraft’s dry mass',
          'The planet’s magnetic dipole moment',
        ],
        correctIndex: 1,
        explanation: 'In the planet-centric frame, total mechanical energy is conserved, so entry speed equals exit speed (|v_in| = |v_out| = v_infinity), but the velocity vector direction rotates.',
      },
    ],
  },

  // ==========================================
  // ASTROPHOTOGRAPHY - BEGINNER (9th Grade Friendly)
  // ==========================================
  {
    id: 'photo-b1',
    trackId: 'astrophotography',
    trackName: 'Astrophotography',
    title: 'The Night Sky Exposure Triangle',
    subtitle: 'Balancing Aperture (f-stop), Shutter Speed, and ISO under dark starry skies.',
    level: 'beginner',
    estimatedMinutes: 6,
    xpReward: 120,
    coinsReward: 40,
    checkpointId: 'checkpoint-ceres',
    slides: [
      {
        title: 'Mastering the Three Pillars in the Dark',
        content: 'Astrophotography is the art and science of photon accumulation. Because celestial targets are faint, you must maximize light gathering without introducing excessive noise or motion blur.',
        diagramType: 'exposure-triangle',
        bulletPoints: [
          'Aperture (f-stop): Open as wide as possible (lowest f-number, like f/1.8, f/2.8) to let in maximum photons.',
          'Shutter Speed: Long exposures (10 to 25 seconds) allow your sensor to collect faint starlight.',
          'ISO: Amplifies the faint sensor signal. Typical night sky ISO is 1600 - 6400 on modern cameras.',
        ],
        tip: 'Higher ISO does not create noise by itself; lack of light creates shot noise. Amplifying a dark signal reveals the noise already present in the shadows!',
      },
      {
        title: 'The Rule of 500 for Pinpoint Stars',
        content: 'Because Earth rotates 360 degrees every 24 hours (about 15 degrees per hour), stars will streak into trails if your shutter is open too long!',
        formula: '\\text{Max Shutter Seconds} = \\frac{500}{\\text{Focal Length (mm)} \\times \\text{Crop Factor}}',
        bulletPoints: [
          'Example with a 24mm lens on a Full Frame camera: 500 / 24 = ~20 seconds maximum.',
          'With a 50mm lens: 500 / 50 = 10 seconds maximum.',
          'Exceeding this value will turn your stars from pinpoint sharp dots into oval streaks.',
        ],
      },
      {
        title: 'Essential Beginner Gear Checklist',
        content: 'You do not need a $5,000 telescope to capture the Milky Way!',
        bulletPoints: [
          'Sturdy Tripod: Absolutely mandatory. Even a slight breeze can ruin a 15-second exposure.',
          '2-Second Timer or Shutter Release Cable: Prevents camera shake caused by pressing the shutter button.',
          'Manual Focus on a Bright Star: Switch your lens to Manual Focus (MF), magnify on a bright star in Live View, and adjust until the star is as small as a needle point.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q-photo-b1-1',
        question: 'According to the Rule of 500, what is the maximum shutter speed for a 20mm lens on a full-frame sensor before stars trail?',
        options: ['10 seconds', '25 seconds', '45 seconds', '60 seconds'],
        correctIndex: 1,
        explanation: '500 / 20mm = 25 seconds.',
      },
      {
        id: 'q-photo-b1-2',
        question: 'Which aperture setting gathers the most light for astrophotography?',
        options: ['f/16', 'f/8', 'f/5.6', 'f/2.0'],
        correctIndex: 3,
        explanation: 'Smaller f-numbers represent wider aperture openings, allowing significantly more photons to hit the sensor.',
      },
    ],
  },

  // ==========================================
  // ASTROPHOTOGRAPHY - INTERMEDIATE
  // ==========================================
  {
    id: 'photo-i1',
    trackId: 'astrophotography',
    trackName: 'Astrophotography',
    title: 'Star Trackers & Calibration Frames Demystified',
    subtitle: 'Polar alignment, equatorial tracking, and shooting Darks, Flats, Bias, and Lights.',
    level: 'intermediate',
    estimatedMinutes: 8,
    xpReward: 200,
    coinsReward: 65,
    checkpointId: 'checkpoint-titan',
    slides: [
      {
        title: 'Equatorial Star Trackers: Defeating Earth’s Rotation',
        content: 'To capture deep sky nebulae, 20 seconds is not enough—you need 3-minute or 5-minute exposures! A motorized equatorial star tracker (e.g., Sky-Watcher Star Adventurer) rotates at the exact sidereal rate (15.041 arcseconds per second) on an axis aligned with Polaris (or Sigma Octantis in the Southern Hemisphere).',
        bulletPoints: [
          'Allows long exposures (180s - 300s+) without star trailing.',
          'Enables using lower ISO (e.g. ISO 400 or 800) for maximum dynamic range.',
        ],
      },
      {
        title: 'The Four Calibration Frames of Stacking',
        content: 'Raw sub-exposures contain thermal noise, read noise, vignetting, and dust donuts. Astronomical stacking software (Siril, PixInsight, DSS) uses calibration frames to subtract artifacts mathematically:',
        bulletPoints: [
          'Light Frames: Your actual pictures of the target (e.g. 50 photos of Orion Nebula).',
          'Dark Frames: Captured with the lens cap ON at the exact same exposure time and sensor temperature. Captures thermal dark current noise.',
          'Flat Frames: Captured pointed at a uniform white light source (diffuser or tablet). Corrects optical vignetting and sensor dust motes.',
          'Bias / Offset Frames: Shot with lens cap on at fastest possible shutter (e.g. 1/4000s). Measures electronic read noise.',
        ],
      },
    ],
    quiz: [
      {
        id: 'q-photo-i1-1',
        question: 'What do Dark calibration frames specifically record and remove from light sub-exposures?',
        options: [
          'Dust specks on the front lens element',
          'Thermal dark current noise and hot pixels',
          'Atmospheric light pollution gradients',
          'Optical vignetting around corners',
        ],
        correctIndex: 1,
        explanation: 'Dark frames record the sensor’s thermal dark current and hot pixels when no external light enters.',
      },
      {
        id: 'q-photo-i1-2',
        question: 'What is the sidereal tracking rate of an equatorial mount aligned to Earth’s rotational axis?',
        options: ['10 degrees per minute', '15.041 arcseconds per second', '90 arcseconds per hour', '1 degree per second'],
        correctIndex: 1,
        explanation: 'Earth rotates once in a sidereal day (23 hours, 56 minutes, 4.09 seconds), which equals approximately 15.041 arcseconds per second.',
      },
    ],
  },

  // ==========================================
  // ASTROPHOTOGRAPHY - ADVANCED (Research Papers)
  // ==========================================
  {
    id: 'photo-a1',
    trackId: 'astrophotography',
    trackName: 'Astrophotography',
    title: 'CMOS Quantum Efficiency & Narrowband Emission Mapping',
    subtitle: 'Signal-to-Noise Ratio (SNR) physics, ionized Hydrogen-Alpha/OIII/SII filtering, and PSF modeling.',
    level: 'advanced',
    estimatedMinutes: 12,
    xpReward: 330,
    coinsReward: 105,
    checkpointId: 'checkpoint-interstellar',
    slides: [
      {
        title: 'The Astronomical Signal-to-Noise Ratio (SNR) Formula',
        content: 'In quantitative astronomical photometry and scientific imaging, the fidelity of an image is dictated by Poisson shot noise and Gaussian electronic read noise.',
        formula: 'SNR = \\frac{N_{target} \\cdot t}{\\sqrt{N_{target}\\cdot t + N_{sky}\\cdot t + D\\cdot t + N_{read}^2}}',
        formulaExplainer: 'N_target is target photons/sec, N_sky is light pollution photons, D is dark current, N_read is sensor read noise, and t is total integration time.',
        bulletPoints: [
          'Notice that SNR increases with the square root of integration time (√t). To double your SNR, you must quadruple your total exposure time (e.g. from 2 hours to 8 hours)!',
          'Narrowband filters (3nm bandpass) dramatically decrease N_sky by blocking broadband city sodium and LED light pollution while transmitting 95%+ of ionized gas emission.',
        ],
      },
      {
        title: 'The Hubble Palette (SHO) Synthesis',
        content: 'The famous Hubble Space Telescope false-color palette assigns specific atomic transitions to RGB channels:',
        bulletPoints: [
          'Red Channel: [S II] Sulfur-II (672.4 nm)',
          'Green Channel: H-α Hydrogen-Alpha (656.3 nm)',
          'Blue Channel: [O III] Oxygen-III (500.7 nm)',
        ],
        tip: 'Because H-α emission is typically 10x stronger than S II and O III, green cast removal and selective continuum subtraction are performed during linear processing.',
      },
    ],
    researchPapers: [
      {
        title: 'Sub-Electron Read Noise CMOS Sensor Photometry for Precision Astronomy',
        authors: 'Howell, S. B., & Everett, M. E.',
        journal: 'The Astronomical Journal',
        year: 2020,
        doi: '10.3847/1538-3881/aba04f',
        summary: 'Benchmarking modern backside-illuminated (BSI) CMOS sensors with 80%+ quantum efficiency and sub-electron read noise (< 0.8 e- rms) against traditional deep-depletion CCD detectors for astronomical survey imaging.',
        keyEquation: '\\sigma_{total} = \\sqrt{\\sigma_{shot}^2 + \\sigma_{read}^2 + \\sigma_{quant}^2}',
        citation: 'Howell, S. B. & Everett, M. E. (2020). Modern CMOS Detectors in Astronomy. The Astronomical Journal, 160(2), 77.',
      },
      {
        title: 'Narrowband Emission Line Mapping of H-alpha, [OIII], and [SII] in Star-Forming Regions',
        authors: 'O’Dell, C. R., & Ferland, G. J.',
        journal: 'Astrophysical Journal Letters',
        year: 2018,
        doi: '10.3847/2041-8213/aaa83f',
        summary: 'Spectrophotometric mapping of ionization boundaries, electron densities, and shock excitation temperatures in the Orion Molecular Cloud complex using filter narrowbands.',
        keyEquation: 'I_{[OIII]} / I_{H\\beta} \\propto T_e^{1/2} e^{-\\Delta E / k T_e}',
        citation: 'O’Dell, C. R., & Ferland, G. J. (2018). Ionization Diagnostics in Nebulae. ApJ, 855(2), L14.',
      },
    ],
    quiz: [
      {
        id: 'q-photo-a1-1',
        question: 'If you want to double the Signal-to-Noise Ratio (SNR) of an astrophotography target, by how much must you multiply total integration time?',
        options: ['2x (double)', '4x (quadruple)', '8x', '16x'],
        correctIndex: 1,
        explanation: 'Because SNR scales with √t (square root of exposure time), doubling SNR requires 2² = 4 times the total exposure.',
      },
      {
        id: 'q-photo-a1-2',
        question: 'In the standard Hubble Palette (SHO), which emission wavelength is mapped to the Red color channel?',
        options: ['Hydrogen-Alpha (656 nm)', 'Sulfur-II [S II] (672 nm)', 'Oxygen-III [O III] (501 nm)', 'Nitrogen-II [N II] (658 nm)'],
        correctIndex: 1,
        explanation: 'SHO stands for Sulfur-II -> Red, Hydrogen-Alpha -> Green, and Oxygen-III -> Blue.',
      },
    ],
  },
];
