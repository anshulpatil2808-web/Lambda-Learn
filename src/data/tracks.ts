export interface Check {
  q: string;
  options: string[];
  answer: number;
  why: string;
}
export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  lambda: string; // mascot's one-line takeaway
  simple: string[];
  deep: string[];
  formula?: { expr: string; note: string };
  fact: string;
  sim?: string;
  check: Check[];
}
export interface Track {
  id: string;
  num: string;
  title: string;
  short: string;
  blurb: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export const TRACKS: Track[] = [
  /* ------------------------------------------------------------------ */
  {
    id: "astrophysics",
    num: "01",
    title: "Astrophysics & Cosmology",
    short: "Astrophysics",
    blurb: "Gravity, light, stars, black holes and the expanding universe — from intuition to the equations researchers use.",
    icon: "🌌",
    color: "var(--violet)",
    lessons: [
      {
        id: "gravity",
        title: "Gravity: the universe's glue",
        minutes: 8,
        summary: "Why apples fall, planets orbit and galaxies hold together.",
        lambda: "Everything with mass pulls on everything else — bigger and closer means a stronger pull!",
        simple: [
          "Drop a ball and it falls. That pull is **gravity**, and it isn't just an Earth thing. Every object with mass — you, your cat, the Moon, the Sun — pulls on every other object.",
          "Two things decide how strong the pull is: **how much stuff** (mass) the objects have, and **how far apart** they are. The Sun is huge, so it can hold planets billions of kilometres away. You have a tiny mass, so your pull on a pencil is too small to notice.",
          "Distance matters a lot. If you move twice as far away, gravity gets **four times weaker**. Three times farther? Nine times weaker. That's why astronauts far from Earth feel almost no pull from home.",
          "Gravity is why the Moon circles Earth, why Earth circles the Sun, and why stars cluster into galaxies. It's the glue of the universe.",
        ],
        deep: [
          "Newton's law of universal gravitation says the force between two point masses is proportional to the product of their masses and inversely proportional to the square of their separation. The constant G ≈ 6.674 × 10⁻¹¹ N·m²/kg² is famously weak — gravity dominates only because mass never cancels the way positive and negative charge does.",
          "The inverse-square law falls out of geometry: a field spreading from a point covers a sphere of area 4πr², so its strength per unit area drops as 1/r². The same law governs light intensity, which is why it reappears throughout astronomy.",
          "Combining Newton's gravity with F = ma gives Kepler's third law, P² = 4π²a³/(GM). Measure an orbit's period and size and you can weigh the central body — this is how we know the mass of the Sun, of exoplanet host stars, and of the 4-million-solar-mass black hole at the Milky Way's centre.",
          "Einstein's general relativity (1915) reframes gravity as curvature of spacetime: mass-energy tells spacetime how to curve, and curved spacetime tells matter how to move. It predicts Mercury's perihelion precession, gravitational lensing and gravitational waves, all since confirmed. Newton remains an excellent approximation when fields are weak and speeds are much less than c.",
        ],
        formula: { expr: "F = G · m₁ · m₂ / r²", note: "G = 6.674 × 10⁻¹¹ N·m²/kg², r = distance between centres" },
        fact: "You weigh about 0.17× as much on the Moon — the Moon has 1.2% of Earth's mass but you'd also be much closer to its centre.",
        sim: "kepler",
        check: [
          { q: "If you double the distance between two objects, the gravitational force becomes…", options: ["Twice as strong", "Half as strong", "A quarter as strong", "Unchanged"], answer: 2, why: "Inverse-square: (1/2)² = 1/4." },
          { q: "Which pair pulls on each other the hardest at the same distance?", options: ["Two marbles", "Two bowling balls", "A marble and a feather", "Two feathers"], answer: 1, why: "Force grows with the product of the masses." },
          { q: "In general relativity, gravity is described as…", options: ["A magnetic effect", "Curvature of spacetime", "Air pressure", "A type of light"], answer: 1, why: "Mass-energy curves spacetime; objects follow that curvature." },
        ],
      },
      {
        id: "light",
        title: "Light: the cosmic messenger",
        minutes: 9,
        summary: "How starlight tells us temperature, chemistry and motion.",
        lambda: "A star's colour is a thermometer — blue stars are hotter than red ones!",
        simple: [
          "Almost everything we know about stars comes from their **light**. We can't visit them, but light travels to us and carries clues.",
          "Light is a wave, and the distance between wave peaks is its **wavelength**. Our eyes see only a thin slice called visible light — red has long waves, violet has short ones. Beyond that are radio, microwaves, infrared, ultraviolet, X-rays and gamma rays. Together they make the **electromagnetic spectrum**.",
          "Here's a surprise: **hot things glow**, and their colour shows how hot they are. A stove ring glows dull red, then orange as it heats. Stars work the same way. Red stars like Betelgeuse are 'cool' (about 3,500 °C), our Sun is yellow-white, and blue stars like Rigel are scorching.",
          "If you spread starlight through a prism you get a rainbow with thin dark lines in it. Each chemical element makes its own pattern of lines, like a barcode. That's how we know the Sun is mostly hydrogen and helium — without ever touching it!",
        ],
        deep: [
          "All electromagnetic waves travel at c = 299,792,458 m/s in vacuum and obey c = λf. Each photon carries energy E = hf, with Planck's constant h = 6.626 × 10⁻³⁴ J·s — so gamma rays carry vastly more energy per photon than radio waves.",
          "Stars radiate approximately as blackbodies. Wien's displacement law gives the peak wavelength λ_max = b/T with b ≈ 2.898 × 10⁻³ m·K; the Sun at 5,772 K peaks near 500 nm. The Stefan–Boltzmann law gives total power per area σT⁴, so luminosity L = 4πR²σT⁴ — double the temperature and each square metre emits 16× more.",
          "Spectroscopy reveals composition through absorption lines (Kirchhoff's laws). Cecilia Payne-Gaposchkin's 1925 thesis used line strengths and Saha ionisation theory to show stars are mostly hydrogen and helium.",
          "Line positions also shift with motion: the Doppler effect gives Δλ/λ ≈ v/c for v ≪ c. Redshifts reveal receding galaxies, binary orbits and exoplanets tugging their stars.",
        ],
        formula: { expr: "λ_max = 2.898 × 10⁻³ m·K / T", note: "Wien's law — hotter objects peak at shorter (bluer) wavelengths" },
        fact: "The light from the Sun that reaches you left its surface about 8 minutes 20 seconds ago.",
        sim: "wien",
        check: [
          { q: "Which star is hottest?", options: ["A red star", "An orange star", "A yellow star", "A blue-white star"], answer: 3, why: "Shorter peak wavelength (bluer) means higher temperature." },
          { q: "Dark lines in a star's spectrum tell us…", options: ["Its age only", "Which elements are present", "How far away it is", "Nothing useful"], answer: 1, why: "Each element absorbs a unique set of wavelengths." },
          { q: "If a star's surface temperature doubles, energy emitted per square metre increases by…", options: ["2×", "4×", "8×", "16×"], answer: 3, why: "Stefan–Boltzmann: power ∝ T⁴, and 2⁴ = 16." },
        ],
      },
      {
        id: "stars",
        title: "The life and death of stars",
        minutes: 10,
        summary: "Nuclear fusion, red giants, white dwarfs and supernovae.",
        lambda: "Stars are giant fusion reactors — and the atoms in you were cooked inside them!",
        simple: [
          "A star is a giant ball of gas squeezed by its own gravity. In the core it's so hot and crushed that **hydrogen atoms smash together and fuse into helium**. That fusion releases enormous energy — that's starlight.",
          "Two forces fight inside a star: gravity squeezing in, and hot gas pushing out. When they balance, the star shines steadily for millions or billions of years. Our Sun has been doing this for about 4.6 billion years.",
          "Big stars burn through fuel **much faster** than small ones. A star ten times heavier than the Sun lives only a few tens of millions of years. Tiny red dwarfs can last trillions of years!",
          "When the fuel runs low, the ending depends on the star's size. Sun-like stars puff up into **red giants** and leave behind a small hot **white dwarf**. Giant stars explode as **supernovae**, leaving a **neutron star** or a **black hole** — and scattering elements like carbon, oxygen and iron into space. Those elements later formed planets… and you.",
        ],
        deep: [
          "Main-sequence stars sit in hydrostatic equilibrium: the pressure gradient balances gravity, dP/dr = −Gm(r)ρ/r². Energy comes from fusing four protons into helium-4, either through the proton–proton chain (dominant in the Sun) or the CNO cycle (dominant above ~1.3 M☉). About 0.7% of the rest mass is converted to energy via E = mc² — the Sun converts roughly 4 million tonnes of mass into energy every second.",
          "Because luminosity scales steeply with mass (L ∝ M^3.5 roughly), lifetime scales as t ∝ M/L ∝ M^−2.5. The Sun's main-sequence life is ~10 billion years; a 10 M☉ star lasts ~20–30 million.",
          "After core hydrogen exhaustion the core contracts and the envelope expands into a red giant. Stars below ~8 M☉ shed their envelopes as planetary nebulae and leave carbon–oxygen white dwarfs supported by electron degeneracy pressure, which fails above the Chandrasekhar limit of ~1.4 M☉.",
          "Massive stars fuse successively heavier elements up to iron, whose fusion absorbs rather than releases energy. The iron core collapses in under a second, rebounds and drives a core-collapse supernova. The remnant is a neutron star (supported by neutron degeneracy and nuclear forces) or, above roughly 2–3 M☉ remnant mass, a black hole. Elements heavier than iron form via the s-process in giants and the r-process in supernovae and neutron-star mergers.",
        ],
        formula: { expr: "E = m · c²", note: "A tiny mass m becomes enormous energy because c² ≈ 9 × 10¹⁶ m²/s²" },
        fact: "A teaspoon of neutron-star material would weigh roughly a billion tonnes on Earth.",
        check: [
          { q: "What powers a star like the Sun?", options: ["Burning coal", "Nuclear fusion of hydrogen", "Electricity", "Radioactive decay of uranium"], answer: 1, why: "Hydrogen nuclei fuse into helium in the core." },
          { q: "Which star lives longest?", options: ["A 20 M☉ blue giant", "The Sun", "A 0.2 M☉ red dwarf", "They all live equally long"], answer: 2, why: "Lifetime ∝ M^−2.5: small stars sip fuel slowly." },
          { q: "What will the Sun eventually become?", options: ["A black hole", "A neutron star", "A white dwarf", "A supernova"], answer: 2, why: "It's well below the mass needed for a core-collapse supernova." },
        ],
      },
      {
        id: "black-holes",
        title: "Black holes",
        minutes: 9,
        summary: "Event horizons, spaghettification and how we photographed one.",
        lambda: "A black hole isn't a cosmic vacuum cleaner — it's just matter squeezed so tight that light can't escape.",
        simple: [
          "Squeeze enough mass into a small enough space and gravity becomes so strong that **not even light can escape**. That's a black hole.",
          "The boundary around it is called the **event horizon** — a point of no return. Outside it, you could still fly away with a powerful enough rocket. Inside it, every path leads inward.",
          "Black holes don't suck everything in. If the Sun magically became a black hole of the same mass, Earth would keep orbiting just as before — it would only get dark and cold!",
          "We can't see black holes directly, but we see what they do: stars whipping around them, glowing hot gas swirling into them, and ripples in space called **gravitational waves** when two of them collide. In 2019 the Event Horizon Telescope released the first image of a black hole's shadow, in galaxy M87.",
        ],
        deep: [
          "For a non-rotating mass, the event horizon lies at the Schwarzschild radius r_s = 2GM/c². For the Sun that's ~2.95 km; for Earth about 9 mm. Rotating (Kerr) black holes have a smaller horizon and an ergosphere where spacetime itself is dragged around.",
          "Tidal forces scale as ~2GMΔr/r³. Near a stellar-mass black hole they stretch infalling objects ('spaghettification') well outside the horizon; near a supermassive one they can be gentle at the horizon because r_s grows with M while the tidal gradient at r_s falls as 1/M².",
          "Observational evidence spans many methods: X-ray binaries such as Cygnus X-1; two decades of stellar orbits around Sagittarius A* (2020 Nobel Prize, Genzel and Ghez); gravitational waves from merging black holes first detected by LIGO on 14 September 2015 (GW150914); and Event Horizon Telescope images of M87* (2019) and Sgr A* (2022).",
          "Hawking (1974) showed black holes should emit thermal radiation with T ∝ 1/M — utterly negligible for astrophysical black holes but central to open questions about quantum gravity and the information paradox.",
        ],
        formula: { expr: "r_s = 2 G M / c²", note: "Schwarzschild radius — about 3 km per solar mass" },
        fact: "The black hole in M87 is about 6.5 billion times the Sun's mass; its event horizon would swallow our whole solar system.",
        sim: "schwarzschild",
        check: [
          { q: "If the Sun became a black hole with the same mass, Earth would…", options: ["Get sucked in", "Keep orbiting the same way", "Fly off into space", "Explode"], answer: 1, why: "Gravity at Earth's distance depends only on the mass, which is unchanged." },
          { q: "Roughly how big would Earth's Schwarzschild radius be?", options: ["9 mm", "9 m", "9 km", "900 km"], answer: 0, why: "r_s = 2GM/c² ≈ 8.9 mm for Earth's mass." },
          { q: "LIGO first detected black holes by observing…", options: ["Visible light", "Gravitational waves", "Sound waves", "Radio pulses"], answer: 1, why: "GW150914 was the first direct detection of gravitational waves." },
        ],
      },
      {
        id: "expanding-universe",
        title: "The expanding universe",
        minutes: 10,
        summary: "Hubble's law, the Big Bang and how we measure cosmic distances.",
        lambda: "Galaxies aren't flying through space away from us — space itself is stretching!",
        simple: [
          "About a hundred years ago astronomers noticed something odd: almost every galaxy is **moving away** from us, and the farther away it is, the faster it's going.",
          "Imagine dots drawn on a balloon. Blow it up and every dot moves away from every other dot. No dot is the centre — the **rubber is stretching**. Our universe is like that: space itself is expanding.",
          "Run the movie backwards and everything was once squeezed together, incredibly hot and dense. That starting point is the **Big Bang**, about 13.8 billion years ago. It wasn't an explosion *in* space — it was the beginning of space expanding.",
          "We can still see the Big Bang's afterglow! It's a faint microwave glow from every direction in the sky, called the **cosmic microwave background**.",
        ],
        deep: [
          "Hubble's law, v = H₀d, relates recession velocity to proper distance for nearby galaxies. Cosmological redshift z = (λ_obs − λ_emit)/λ_emit reflects the scale factor: 1 + z = a(now)/a(then).",
          "Distances come from a ladder: parallax for nearby stars; Cepheid variables, whose period–luminosity relation Henrietta Leavitt discovered in 1912; the tip of the red giant branch; then Type Ia supernovae as standardisable candles to billions of light-years.",
          "Two precision approaches disagree: the early-universe value from the CMB (Planck: H₀ ≈ 67.4 km/s/Mpc) and the local distance-ladder value (SH0ES: ≈ 73 km/s/Mpc). This 'Hubble tension' may hint at new physics or unrecognised systematics — an active research frontier.",
          "The CMB, discovered by Penzias and Wilson in 1965, is a 2.725 K blackbody released ~380,000 years after the Big Bang when the universe became transparent. In 1998 two teams found the expansion is accelerating, attributed to dark energy, which together with dark matter makes up about 95% of the universe's energy budget in the ΛCDM model.",
        ],
        formula: { expr: "v = H₀ · d", note: "H₀ ≈ 67–73 km/s per megaparsec (1 Mpc ≈ 3.26 million light-years)" },
        fact: "The 'Λ' in ΛCDM — the standard model of cosmology — is the cosmological constant. Lambda Learn's namesake!",
        sim: "hubble",
        check: [
          { q: "In Hubble's law, a galaxy twice as far away recedes…", options: ["Half as fast", "Equally fast", "Twice as fast", "Four times as fast"], answer: 2, why: "v = H₀d is linear in distance." },
          { q: "The cosmic microwave background is…", options: ["Radio noise from phones", "Afterglow of the early hot universe", "Light from the Sun", "Emission from black holes"], answer: 1, why: "It was released ~380,000 years after the Big Bang." },
          { q: "Who discovered the Cepheid period–luminosity relation?", options: ["Edwin Hubble", "Henrietta Leavitt", "Albert Einstein", "Vera Rubin"], answer: 1, why: "Leavitt's 1912 work made Cepheids into standard candles." },
        ],
      },
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    id: "astronomy",
    num: "02",
    title: "Observational Astronomy",
    short: "Astronomy",
    blurb: "Read the night sky, understand the Moon and planets, choose a telescope and hunt for exoplanets.",
    icon: "🔭",
    color: "var(--accent)",
    lessons: [
      {
        id: "night-sky",
        title: "Reading the night sky",
        minutes: 8,
        summary: "Constellations, the celestial sphere and finding Polaris.",
        lambda: "The stars aren't moving across the sky — we're spinning underneath them!",
        simple: [
          "On a clear night the sky looks like a giant dome sprinkled with stars. Astronomers imagine it as a huge ball around Earth called the **celestial sphere**.",
          "People grouped stars into pictures called **constellations** — Orion the hunter, Scorpius the scorpion, the Big Dipper (part of Ursa Major). Today astronomers divide the whole sky into **88 official constellations**, like countries on a map.",
          "Stars seem to rise in the east and set in the west, but that's because **Earth spins** once a day. In the northern hemisphere, one star barely moves: **Polaris**, the North Star, sits almost exactly above Earth's north pole. Find the Big Dipper, follow the two stars at the end of its 'cup' upward, and you'll reach Polaris.",
          "Different constellations show up in different seasons because Earth travels around the Sun — at night we face a different direction in space each month.",
        ],
        deep: [
          "Positions on the celestial sphere use equatorial coordinates: right ascension (RA, measured in hours east along the celestial equator from the March equinox point) and declination (Dec, degrees north or south of the celestial equator). Local horizon coordinates are altitude and azimuth.",
          "Polaris lies within ~0.7° of the north celestial pole, so its altitude above the horizon equals the observer's latitude — the basis of centuries of celestial navigation. Earth's axis precesses with a period of ~26,000 years, so the pole star changes over millennia (Vega in about 12,000 years).",
          "A sidereal day — one rotation relative to the stars — is 23 h 56 m 4 s, about 4 minutes shorter than the solar day. Stars therefore rise ~4 minutes earlier each night, cycling the visible constellations through the year.",
          "Stellar brightness uses the magnitude scale: a difference of 5 magnitudes equals a factor of 100 in flux, and smaller numbers are brighter. Sirius is about −1.46; the faintest stars visible from a truly dark site are near magnitude 6.5.",
        ],
        formula: { expr: "Altitude of Polaris ≈ your latitude", note: "At 40° N, Polaris sits about 40° above the northern horizon" },
        fact: "From very dark sites you can see roughly 4,500 stars with the naked eye across the whole sky — from a big city, often fewer than 50.",
        check: [
          { q: "How many official constellations are there?", options: ["12", "48", "88", "365"], answer: 2, why: "The IAU defined 88 constellation boundaries in 1922–1930." },
          { q: "Why do stars appear to move across the sky during the night?", options: ["Stars orbit Earth", "Earth rotates", "The Moon pulls them", "Wind in the atmosphere"], answer: 1, why: "Earth spins once per sidereal day." },
          { q: "At latitude 30° N, Polaris appears about how high?", options: ["0°", "30°", "60°", "90°"], answer: 1, why: "Polaris's altitude ≈ observer's latitude." },
        ],
      },
      {
        id: "moon",
        title: "Moon phases & eclipses",
        minutes: 7,
        summary: "Why the Moon changes shape, and why eclipses are rare.",
        lambda: "Moon phases aren't Earth's shadow — we're just seeing different amounts of the Moon's sunny side!",
        simple: [
          "The Moon doesn't make its own light. **Half of it is always lit by the Sun**, just like half of Earth is always in daytime.",
          "As the Moon circles Earth about once a month, we see different amounts of that sunny half. When the Moon is between us and the Sun, the lit side faces away — that's a **new moon**. When it's on the far side of Earth, we see the whole lit face — a **full moon**. In between are crescents, quarters and gibbous phases.",
          "A common myth says phases are caused by Earth's shadow. Nope! Earth's shadow only touches the Moon during a **lunar eclipse**.",
          "So why isn't there an eclipse every month? The Moon's orbit is tilted a little compared with Earth's orbit around the Sun, so usually the Moon passes just above or below the shadow. Only when everything lines up perfectly do we get an eclipse.",
        ],
        deep: [
          "The synodic month (new moon to new moon) is 29.53 days, longer than the sidereal month of 27.32 days because Earth moves along its orbit, so the Moon must travel extra to realign with the Sun.",
          "The illuminated fraction is k = (1 − cos θ)/2, where θ is the Sun–Moon elongation as seen from Earth. Waxing phases appear in the evening sky; waning phases in the morning.",
          "The Moon's orbit is inclined about 5.1° to the ecliptic. Eclipses occur only when a new or full moon falls near a node, during eclipse seasons roughly every 173 days. Whether a solar eclipse is total or annular depends on the Moon's distance, since its apparent size varies about 14% between perigee and apogee.",
          "The Moon is tidally locked: its rotation period equals its orbital period, so we always see the same face. Libration lets us glimpse about 59% of its surface over time. Tidal interaction moves the Moon away from Earth by about 3.8 cm per year, measured with laser reflectors left by Apollo.",
        ],
        formula: { expr: "Illuminated fraction = (1 − cos θ) / 2", note: "θ = angle between Sun and Moon as seen from Earth" },
        fact: "The next total solar eclipse visible across southern Spain, North Africa and Egypt is on 2 August 2027 — over 6 minutes of totality near Luxor.",
        sim: "moon",
        check: [
          { q: "What causes Moon phases?", options: ["Earth's shadow", "Clouds", "Our changing view of the Moon's sunlit half", "The Moon shrinking"], answer: 2, why: "Half the Moon is always lit; we see varying portions of it." },
          { q: "A full moon happens when the Moon is…", options: ["Between Earth and Sun", "On the opposite side of Earth from the Sun", "Behind the Sun", "Closest to Earth"], answer: 1, why: "Then its fully lit face points at us." },
          { q: "Why don't eclipses happen every month?", options: ["The Moon's orbit is tilted ~5°", "The Sun is too far", "The Moon spins too fast", "They do happen monthly"], answer: 0, why: "Alignment is needed near the orbital nodes." },
        ],
      },
      {
        id: "solar-system",
        title: "Our solar system to scale",
        minutes: 9,
        summary: "Planets, astronomical units and Kepler's laws.",
        lambda: "Space is mostly… space! If the Sun were a beach ball, Earth would be a peppercorn 64 metres away.",
        simple: [
          "Our solar system has the Sun, **eight planets**, dwarf planets like Pluto, moons, asteroids and comets. The four inner planets — Mercury, Venus, Earth, Mars — are small and rocky. The four outer ones — Jupiter, Saturn, Uranus, Neptune — are giants made mostly of gas and ice.",
          "Distances are so big that astronomers invented a special ruler: the **astronomical unit (AU)**, the distance from Earth to the Sun, about 150 million km. Mars is about 1.5 AU from the Sun, Jupiter about 5.2 AU, and Neptune about 30 AU.",
          "Planets closer to the Sun move faster and have shorter years. Mercury zips around in 88 days. Neptune takes about 165 years!",
          "Books often draw the planets close together, but the real solar system is mostly empty. If the Sun were a 60 cm beach ball, Earth would be a peppercorn about 64 metres away, and Neptune would be nearly 2 km away.",
        ],
        deep: [
          "Kepler's laws (1609–1619): (1) orbits are ellipses with the Sun at one focus; (2) a line from Sun to planet sweeps equal areas in equal times, so planets move fastest at perihelion; (3) P² ∝ a³. In units of years and AU for bodies orbiting the Sun, P² = a³.",
          "Newton showed Kepler's third law generalises to P² = 4π²a³ / G(M + m), letting us weigh any system with an orbiting companion — from binary stars to exoplanet hosts.",
          "The AU is defined exactly as 149,597,870,700 m (IAU 2012). Light crosses 1 AU in ~499 seconds. The ecliptic plane reflects the solar system's origin in a flattened protoplanetary disc about 4.6 billion years ago.",
          "The 2006 IAU definition of a planet requires orbiting the Sun, being massive enough to be nearly round, and clearing its orbital neighbourhood. Pluto fails the third test and is classified as a dwarf planet, alongside Ceres, Eris, Haumea and Makemake.",
        ],
        formula: { expr: "P² = a³", note: "P in years, a (semi-major axis) in AU — for anything orbiting the Sun" },
        fact: "Jupiter is more than twice as massive as all the other planets combined.",
        sim: "kepler",
        check: [
          { q: "1 AU is approximately…", options: ["150 thousand km", "150 million km", "150 billion km", "1 light-year"], answer: 1, why: "≈ 149.6 million km, the mean Earth–Sun distance." },
          { q: "A planet at 4 AU from the Sun has a year lasting…", options: ["2 years", "4 years", "8 years", "16 years"], answer: 2, why: "P² = a³ = 64 → P = 8 years." },
          { q: "By Kepler's second law, a planet moves fastest when it is…", options: ["Farthest from the Sun", "Closest to the Sun", "Always the same speed", "Behind the Sun"], answer: 1, why: "Equal areas in equal times means faster near perihelion." },
        ],
      },
      {
        id: "telescopes",
        title: "Choosing and using a telescope",
        minutes: 9,
        summary: "Aperture, focal length, magnification and resolution.",
        lambda: "The most important number on a telescope isn't magnification — it's aperture!",
        simple: [
          "A telescope is a **light bucket**. Its main job is to collect more light than your eye can, so faint things become visible.",
          "There are two classic kinds. **Refractors** use lenses (like a long spyglass). **Reflectors** use curved mirrors (Isaac Newton invented a famous design). Many modern telescopes, called catadioptrics, use both.",
          "The width of the main lens or mirror is the **aperture**. Bigger aperture = more light and sharper detail. Doubling the aperture collects **four times** as much light.",
          "Magnification is easy to change with different eyepieces, so don't trust boxes that brag about '600× power!'. Beginners often get the most joy from a simple Dobsonian reflector — big aperture for the price, and easy to point.",
        ],
        deep: [
          "Light-gathering power scales with collecting area, ∝ D². Compared with a dark-adapted 7 mm pupil, a 200 mm telescope gathers (200/7)² ≈ 816× more light, reaching stars around magnitude 14.",
          "Magnification M = f_objective / f_eyepiece. Exit pupil = D / M; keeping it between ~0.5 and 7 mm gives practical limits, with a common rule of thumb of maximum useful magnification ≈ 2× aperture in mm (in excellent seeing).",
          "Angular resolution is diffraction-limited: Rayleigh criterion θ ≈ 1.22 λ/D, or empirically Dawes' limit ≈ 116/D(mm) arcseconds for close double stars. In practice atmospheric seeing usually limits ground-based resolution to ~1–2 arcseconds, which is why adaptive optics and space telescopes matter.",
          "Focal ratio N = f/D governs field of view and image brightness for extended objects on a sensor: fast systems (f/4) suit wide deep-sky imaging; slow systems (f/10 and above) suit high-magnification planetary work.",
        ],
        formula: { expr: "Magnification = f_telescope / f_eyepiece", note: "e.g. 1200 mm telescope with a 25 mm eyepiece → 48×" },
        fact: "The James Webb Space Telescope's 6.5 m mirror is made of 18 gold-coated beryllium segments.",
        sim: "telescope",
        check: [
          { q: "Doubling a telescope's aperture collects how much more light?", options: ["2×", "4×", "8×", "No difference"], answer: 1, why: "Light ∝ area ∝ D²." },
          { q: "A 1000 mm telescope with a 10 mm eyepiece gives…", options: ["10×", "100×", "1000×", "10,000×"], answer: 1, why: "M = 1000 / 10 = 100×." },
          { q: "Which spec most determines how faint you can see?", options: ["Magnification", "Tube colour", "Aperture", "Eyepiece brand"], answer: 2, why: "Aperture sets light-gathering power." },
        ],
      },
      {
        id: "exoplanets",
        title: "Hunting exoplanets",
        minutes: 8,
        summary: "Transits, wobbles and the search for habitable worlds.",
        lambda: "When a planet crosses its star, the star dims a tiny bit — that little dip is how we find new worlds!",
        simple: [
          "Planets around other stars are called **exoplanets**. They're too faint and too close to their bright stars to photograph easily, so astronomers use clever tricks.",
          "**The transit method:** if a planet passes in front of its star, the star dims slightly — like a moth flying in front of a streetlight. Space telescopes like Kepler and TESS watched hundreds of thousands of stars for these tiny dips.",
          "**The wobble method:** a planet's gravity tugs its star in a small circle. That wobble shifts the star's light slightly bluer and redder, which sensitive instruments can measure.",
          "We've now confirmed **more than 6,000 exoplanets**. Some orbit in the **habitable zone**, where it's not too hot and not too cold for liquid water on the surface.",
        ],
        deep: [
          "Transit depth ≈ (R_p / R_★)². An Earth-sized planet across a Sun-like star dims it by only ~84 parts per million; a Jupiter by ~1%. Transit timing gives the period; combined with stellar mass and Kepler's third law, the orbital radius follows.",
          "Radial-velocity amplitude K scales as m_p sin i · P^(−1/3) M_★^(−2/3). Jupiter induces ~12.5 m/s in the Sun; Earth only ~0.09 m/s. Combining transits (radius) with radial velocity (mass) yields density and hints at composition.",
          "Transmission spectroscopy analyses starlight filtered through a planet's atmosphere during transit. JWST has detected CO₂, H₂O and SO₂ in exoplanet atmospheres, opening comparative planetology beyond the solar system.",
          "The first exoplanet around a Sun-like star, 51 Pegasi b, was announced by Mayor and Queloz in 1995 (2019 Nobel Prize). Other methods include direct imaging, gravitational microlensing and astrometry (e.g. Gaia).",
        ],
        formula: { expr: "Transit depth ≈ (R_planet / R_star)²", note: "Earth/Sun ≈ (6,371 / 696,000)² ≈ 0.0084%" },
        fact: "Some exoplanets orbit so close to their stars that a 'year' lasts less than one Earth day.",
        sim: "transit",
        check: [
          { q: "The transit method detects planets by measuring…", options: ["Radio signals", "A dip in the star's brightness", "The planet's colour", "Sound"], answer: 1, why: "The planet blocks a small fraction of starlight." },
          { q: "A planet with half the star's radius would dim it by about…", options: ["50%", "25%", "10%", "1%"], answer: 1, why: "(1/2)² = 1/4 = 25%." },
          { q: "The 'habitable zone' is where…", options: ["Aliens are known to live", "Liquid surface water could exist", "Planets are largest", "Stars are youngest"], answer: 1, why: "It's defined by temperatures allowing liquid water." },
        ],
      },
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    id: "aerospace",
    num: "03",
    title: "Rocket Science & Aerospace",
    short: "Rocket Science",
    blurb: "How wings and rockets work, the rocket equation, orbits, Hohmann transfers and surviving re-entry.",
    icon: "🚀",
    color: "var(--coral)",
    lessons: [
      {
        id: "how-rockets-work",
        title: "How rockets work",
        minutes: 7,
        summary: "Newton's third law, thrust and why rockets work in a vacuum.",
        lambda: "Rockets don't push on air — they push on their own exhaust!",
        simple: [
          "Blow up a balloon and let it go without tying it. Air rushes out the back and the balloon zooms forward. **Rockets do exactly the same thing**, just with super-fast, super-hot gas.",
          "This is **Newton's third law**: for every action, there's an equal and opposite reaction. The rocket pushes gas backward; the gas pushes the rocket forward.",
          "A common question: how can a rocket work in space where there's no air to push against? It doesn't need air! It pushes against the gas it throws out. In fact rockets work *better* in a vacuum.",
          "Rocket engines burn fuel with an **oxidiser** (because there's no oxygen in space) in a combustion chamber, then squeeze the hot gas through a bell-shaped **nozzle** that speeds it up even more.",
        ],
        deep: [
          "Thrust is F = ṁ·vₑ + (pₑ − pₐ)Aₑ: mass flow rate times effective exhaust velocity, plus a pressure term at the nozzle exit. In vacuum pₐ = 0, so thrust rises — the Merlin 1D produces ~845 kN at sea level and noticeably more in vacuum.",
          "The converging–diverging (de Laval) nozzle accelerates combustion gases to supersonic speeds: subsonic flow speeds up in the converging section, chokes at Mach 1 in the throat, then continues accelerating as it expands in the diverging bell.",
          "Specific impulse, I_sp = vₑ / g₀, measures efficiency in seconds. Typical values: solid motors ~250–290 s, kerosene/LOX ~310–350 s, hydrogen/LOX ~450 s, ion thrusters 1,500–5,000 s (at tiny thrust).",
          "Thrust-to-weight ratio must exceed 1 to lift off. Saturn V produced ~35 MN at launch against a ~2,900-tonne liftoff mass — T/W ≈ 1.2.",
        ],
        formula: { expr: "F = ṁ · vₑ", note: "Thrust = mass flow rate × exhaust velocity (ignoring the pressure term)" },
        fact: "The Saturn V's five F-1 engines together burned about 13 tonnes of propellant every second at liftoff.",
        sim: "thruster",
        check: [
          { q: "Rockets move forward because…", options: ["They push against air", "They push exhaust backward and get pushed forward", "Gravity pulls them up", "Of magnets"], answer: 1, why: "Newton's third law." },
          { q: "Why do rockets carry an oxidiser?", options: ["For colour", "There's no oxygen in space for burning", "To cool the engine", "To reduce weight"], answer: 1, why: "Combustion needs an oxidiser, and space has none." },
          { q: "Which propellant combination has the highest specific impulse?", options: ["Solid fuel", "Kerosene/LOX", "Hydrogen/LOX", "Gunpowder"], answer: 2, why: "LH₂/LOX reaches ~450 s." },
        ],
      },
      {
        id: "rocket-equation",
        title: "The rocket equation & staging",
        minutes: 10,
        summary: "Why rockets are mostly fuel, and why we throw parts away.",
        lambda: "To go fast, a rocket has to be mostly fuel — and drop empty tanks along the way!",
        simple: [
          "Here's the rocket's big problem: to go faster you need more fuel, but fuel is heavy, so you need even more fuel to lift *that* fuel. That's why rockets are about **85–90% fuel** by weight at launch.",
          "Scientists measure a rocket's 'speed budget' with something called **delta-v** (change in velocity). Reaching low Earth orbit needs about **9.4 km/s** of delta-v once you include fighting gravity and air drag.",
          "The trick is **staging**. Once the first stage's tanks are empty, why carry them? The rocket drops them and lights a smaller engine. Each drop makes the rest of the rocket lighter and easier to speed up.",
          "Some modern rockets, like SpaceX's Falcon 9, even fly their first stages back to land so they can be reused!",
        ],
        deep: [
          "Konstantin Tsiolkovsky published the ideal rocket equation in 1903: Δv = vₑ ln(m₀/m_f) = I_sp · g₀ · ln(m₀/m_f), where m₀/m_f is the mass ratio. Because Δv grows only logarithmically, each extra km/s demands exponentially more propellant.",
          "Orbital velocity in LEO is ~7.8 km/s, but launch vehicles budget ~9.3–9.6 km/s to cover gravity losses (thrusting while climbing) and aerodynamic drag, minus a ~0.46 km/s boost from Earth's rotation when launching eastward from the equator.",
          "Staging lets each stage start with a fresh mass ratio: total Δv = Σ I_sp,i g₀ ln(m₀,i / m_f,i). Upper stages often use high-I_sp hydrogen engines (e.g. RL10, ~465 s) while lower stages favour high thrust and dense propellants.",
          "Structural fraction and payload fraction trade off sharply: payload to LEO is typically only ~2–4% of liftoff mass for expendable vehicles.",
        ],
        formula: { expr: "Δv = I_sp · g₀ · ln(m₀ / m_f)", note: "g₀ = 9.81 m/s²; m₀ = full mass, m_f = mass after burning propellant" },
        fact: "Tsiolkovsky worked out the rocket equation in 1903 — the same year the Wright brothers first flew.",
        sim: "rocket-eq",
        check: [
          { q: "About how much delta-v is needed to reach low Earth orbit (including losses)?", options: ["1 km/s", "3 km/s", "9.4 km/s", "30 km/s"], answer: 2, why: "~7.8 km/s orbital speed plus ~1.5 km/s of losses." },
          { q: "Why do rockets use stages?", options: ["To look cool", "To avoid carrying empty mass", "To slow down", "Regulations"], answer: 1, why: "Dropping empty tanks improves later mass ratios." },
          { q: "If the mass ratio goes from e to e² (with the same engine), Δv…", options: ["Doubles", "Squares", "Halves", "Stays the same"], answer: 0, why: "ln(e²) = 2 ln(e)." },
        ],
      },
      {
        id: "orbits",
        title: "Orbits: falling without landing",
        minutes: 9,
        summary: "Newton's cannonball, orbital speed and escape velocity.",
        lambda: "An orbit is just falling around the Earth so fast that you keep missing the ground!",
        simple: [
          "Throw a ball and it curves down to the ground. Throw it harder and it lands farther away. Isaac Newton imagined a giant cannon on a mountaintop: fire fast enough and the ball falls toward Earth — but the curved ground falls away beneath it just as fast. **It never lands.** That's an orbit!",
          "Near Earth that magic speed is about **7.8 km/s** — roughly 28,000 km/h. The International Space Station circles Earth about every 90 minutes.",
          "Astronauts on the ISS float not because there's no gravity (there's about 90% as much as on the ground!) but because they're **falling together** with their spacecraft.",
          "Go even faster — about **11.2 km/s** — and you escape Earth's gravity entirely. That's **escape velocity**, needed for trips to the Moon and planets.",
        ],
        deep: [
          "For a circular orbit, gravity supplies the centripetal force: GMm/r² = mv²/r, so v_circ = √(GM/r). Escape velocity, from energy conservation, is v_esc = √(2GM/r) = √2 · v_circ.",
          "The vis-viva equation, v² = GM(2/r − 1/a), gives speed anywhere on a Keplerian orbit with semi-major axis a and underpins all mission design. Specific orbital energy ε = −GM/2a is negative for bound orbits, zero for parabolic escape, positive for hyperbolic.",
          "Geostationary orbit (r ≈ 42,164 km, altitude ≈ 35,786 km) matches Earth's sidereal rotation so satellites hover over one longitude — ideal for communications and weather imaging.",
          "Real orbits are perturbed by Earth's oblateness (J₂, which precesses orbital planes — exploited by Sun-synchronous orbits), atmospheric drag in LEO, lunar and solar gravity, and solar radiation pressure.",
        ],
        formula: { expr: "v = √(G·M / r)", note: "Circular orbital speed; escape speed is √2 times larger" },
        fact: "ISS astronauts see about 16 sunrises and 16 sunsets every day.",
        sim: "orbit",
        check: [
          { q: "Astronauts float on the ISS because…", options: ["There's no gravity in space", "They're in continuous free fall", "Magnets", "The ISS is beyond Earth's pull"], answer: 1, why: "Gravity there is ~90% of surface gravity; they're falling around Earth." },
          { q: "Escape velocity is how many times circular orbital velocity at the same radius?", options: ["1.41×", "2×", "3×", "10×"], answer: 0, why: "v_esc = √2 · v_circ." },
          { q: "A geostationary satellite orbits once every…", options: ["90 minutes", "12 hours", "~1 sidereal day", "1 month"], answer: 2, why: "It matches Earth's rotation (23 h 56 m)." },
        ],
      },
      {
        id: "hohmann",
        title: "Hohmann transfers: getting to Mars",
        minutes: 10,
        summary: "The most fuel-efficient path between two orbits.",
        lambda: "To catch a planet, you aim where it's going to be — like throwing a ball to a running friend!",
        simple: [
          "You can't just point a rocket at Mars and fire. Everything is moving: Earth, Mars and your spacecraft all orbit the Sun.",
          "In 1925 Walter Hohmann worked out the most fuel-saving route: a half-ellipse that touches Earth's orbit on one side and Mars's orbit on the other. You fire your engine once to stretch your orbit outward, coast for months, then fire again to match Mars's speed.",
          "Timing is everything. You need Mars to arrive at the meeting point at the same time you do. Earth and Mars line up properly only about **every 26 months** — that's called a **launch window**.",
          "A Hohmann trip to Mars takes about **8 to 9 months**. Faster paths exist but burn much more fuel.",
        ],
        deep: [
          "For coplanar circular orbits r₁ → r₂, the transfer ellipse has a = (r₁ + r₂)/2. The burns are Δv₁ = √(μ/r₁)(√(2r₂/(r₁+r₂)) − 1) and Δv₂ = √(μ/r₂)(1 − √(2r₁/(r₁+r₂))). Transfer time is half the ellipse period: t = π√(a³/μ).",
          "Earth → Mars heliocentric transfer takes ~259 days with Δv₁ ≈ 2.9 km/s relative to Earth's orbital velocity. The synodic period 1/(1/P_E − 1/P_M) ≈ 780 days sets the launch-window spacing.",
          "For large ratios (r₂/r₁ > ~11.94), a bi-elliptic transfer can beat Hohmann on Δv at the cost of much longer flight time. Gravity assists (e.g. Voyager, Cassini) and low-thrust spirals with ion engines open further trade-offs.",
          "Real mission design uses patched conics and then full numerical trajectory optimisation, visualised as 'porkchop plots' of C3 energy versus departure and arrival dates.",
        ],
        formula: { expr: "t = π · √( ((r₁ + r₂)/2)³ / μ )", note: "μ = GM of the central body (Sun: 1.327 × 10¹¹ km³/s²)" },
        fact: "Perseverance launched on 30 July 2020 and landed on Mars on 18 February 2021 — about 7 months, using a slightly faster-than-Hohmann path.",
        sim: "hohmann",
        check: [
          { q: "A Hohmann transfer needs how many main engine burns?", options: ["One", "Two", "Five", "Continuous thrust"], answer: 1, why: "One to enter the transfer ellipse, one to circularise." },
          { q: "Earth–Mars launch windows open roughly every…", options: ["Month", "Year", "26 months", "11 years"], answer: 2, why: "The synodic period is ~780 days." },
          { q: "The transfer orbit is…", options: ["A straight line", "Half of an ellipse", "A full circle", "A spiral"], answer: 1, why: "It's half an ellipse tangent to both orbits." },
        ],
      },
      {
        id: "flight",
        title: "How wings fly",
        minutes: 8,
        summary: "Lift, drag, thrust and weight — the four forces of flight.",
        lambda: "A wing works by turning air downward — push air down, and the air pushes the wing up!",
        simple: [
          "Every aeroplane in the air is balancing **four forces**: **lift** pushes up, **weight** pulls down, **thrust** pushes forward, and **drag** holds it back.",
          "Wings are shaped and tilted so that as air flows past, it gets **deflected downward**. By Newton's third law, the air pushes the wing **up**. The air also speeds up over the top of the wing, lowering pressure there — two ways of describing the same physics.",
          "Lift grows really fast with speed: fly **twice as fast** and you get **four times** the lift. That's why planes need long runways to build up speed before takeoff.",
          "Tilt the wing up too far and the smooth airflow breaks away from the top. Lift suddenly drops — that's a **stall**, and pilots train carefully to avoid and recover from it.",
        ],
        deep: [
          "Lift L = ½ρv²SC_L, where ρ is air density, v airspeed, S wing area and C_L the lift coefficient, which rises roughly linearly with angle of attack (~0.1 per degree for thin aerofoils) until stall near 15°.",
          "The 'equal transit time' explanation is a myth: air over the upper surface actually arrives at the trailing edge before air below. Lift is properly explained by circulation (Kutta–Joukowski theorem, L′ = ρvΓ) and by the downward momentum imparted to the flow.",
          "Drag has parasitic components (∝ v²) and induced drag from wingtip vortices (∝ 1/v² at fixed lift), so total drag is minimised at a specific best-glide speed. Higher aspect-ratio wings reduce induced drag — think gliders and the U-2.",
          "At high altitude ρ drops, so aircraft must fly faster for the same lift; air density at 11 km is about 30% of sea level. Space-launch aerodynamics adds max-Q, the point of peak dynamic pressure q = ½ρv², which vehicles throttle through.",
        ],
        formula: { expr: "L = ½ · ρ · v² · S · C_L", note: "ρ ≈ 1.225 kg/m³ at sea level" },
        fact: "A Boeing 747's wings flex upward several metres in flight — they're designed to bend, not break.",
        sim: "lift",
        check: [
          { q: "If an aircraft doubles its airspeed, lift (other things equal) becomes…", options: ["Double", "Four times", "Half", "The same"], answer: 1, why: "L ∝ v²." },
          { q: "A stall happens when…", options: ["The engine stops", "The angle of attack is too high and airflow separates", "The plane flies too fast", "Fuel runs out"], answer: 1, why: "Separated flow collapses lift." },
          { q: "Which force opposes thrust?", options: ["Lift", "Weight", "Drag", "Gravity"], answer: 2, why: "Drag resists motion through the air." },
        ],
      },
      {
        id: "reentry",
        title: "Re-entry & heat shields",
        minutes: 8,
        summary: "Why coming home is as hard as leaving.",
        lambda: "Coming back from orbit, a spacecraft gets hot by squashing air in front of it — not mainly from friction!",
        simple: [
          "A spacecraft in orbit moves at nearly 8 km/s. To land, it has to lose almost all that speed — and that energy has to go somewhere. It turns into **heat**.",
          "Most of the heat comes from the spacecraft **squashing the air** in front of it so hard that the air glows hotter than the surface of the Sun. It's called a **shock layer**.",
          "Heat shields protect the crew. Apollo used an **ablative** shield that slowly burned and flaked away, carrying heat with it. The Space Shuttle used special tiles so good at insulating that you could hold one by its edges seconds after it came out of a 1,200 °C oven.",
          "Capsules come in **blunt end first**. A blunt shape pushes the hot shock wave away from the surface, so less heat reaches the spacecraft.",
        ],
        deep: [
          "Kinetic energy per kilogram at orbital speed is ½v² ≈ 30 MJ/kg — several times the chemical energy in a kilogram of TNT (~4.2 MJ/kg). Re-entry must dissipate nearly all of it into the atmosphere.",
          "H. Julian Allen and A. J. Eggers (NACA, 1950s) showed blunt bodies create a detached bow shock that keeps most heat in the flow rather than conducting into the vehicle — the foundation of capsule design.",
          "Convective heating scales roughly as q ∝ √(ρ/R_n) · v³ (Sutton–Graves), so a larger nose radius R_n reduces heat flux. At lunar return speeds (~11 km/s), radiative heating from the shock layer becomes significant.",
          "Thermal protection systems include ablators (AVCOAT on Apollo and Orion, PICA on Dragon and Stardust), reusable silica tiles and reinforced carbon–carbon (Shuttle). Ionised plasma around the vehicle causes the classic communications blackout.",
        ],
        formula: { expr: "KE = ½ · m · v²", note: "At 7.8 km/s: about 30 million joules per kilogram of spacecraft" },
        fact: "Apollo capsules returning from the Moon hit the atmosphere at about 11 km/s — roughly 40,000 km/h.",
        check: [
          { q: "Most re-entry heating comes from…", options: ["Sunlight", "Compressing air in a shock layer", "Engine exhaust", "Friction with clouds"], answer: 1, why: "Shock compression heats the air around the vehicle." },
          { q: "Why do capsules re-enter blunt end first?", options: ["To go faster", "To push the shock wave away and reduce heating", "To look forward", "It's random"], answer: 1, why: "Allen & Eggers' blunt-body principle." },
          { q: "An ablative heat shield works by…", options: ["Reflecting all heat", "Slowly charring and carrying heat away", "Cooling with water", "Spinning"], answer: 1, why: "Ablation removes heat with the material that leaves." },
        ],
      },
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    id: "astrophotography",
    num: "04",
    title: "Night-Sky Astrophotography",
    short: "Astrophotography",
    blurb: "ISO, aperture and shutter, the Rule of 500, star trackers and stacking deep-sky images.",
    icon: "📸",
    color: "var(--primary)",
    lessons: [
      {
        id: "exposure",
        title: "The exposure triangle at night",
        minutes: 8,
        summary: "ISO, aperture and shutter speed for stars.",
        lambda: "At night, you need every bit of light: open wide, stay open long, and turn up the ISO — carefully!",
        simple: [
          "A camera makes a picture by collecting light. Three settings control how much it gets — the **exposure triangle**.",
          "**Aperture** (f-number) is how wide the lens opens. A *smaller* number like f/2.8 means a *bigger* opening and more light. **Shutter speed** is how long the sensor collects light — for stars, often 10–25 seconds. **ISO** is how much the camera boosts the signal. Higher ISO is brighter but grainier.",
          "A great starting point for the Milky Way: **f/2.8, 20 seconds, ISO 3200** with a wide lens. Then adjust: too dark? Raise ISO. Stars look like little streaks? Shorten the shutter.",
          "Always use a **tripod**, turn off image stabilisation, use a 2-second timer or remote so you don't shake the camera, and shoot in **RAW** so you can fix colours later.",
        ],
        deep: [
          "Exposure scales as H ∝ t / N². Each 'stop' doubles or halves light: f/2.8 → f/2 is +1 stop; 10 s → 20 s is +1 stop. ISO doesn't add light — it applies analogue/digital gain to the signal the sensor already captured.",
          "Noise sources: photon (shot) noise ∝ √signal, read noise (per exposure), thermal (dark current, worse in warm sensors) and sky background. Many modern sensors are near 'ISO-invariant' above a point, so raising ISO beyond ~1600–3200 mainly reduces dynamic range without improving SNR.",
          "Aperture also affects image quality: fast lenses wide open often show coma (stars turned into 'seagulls' at the edges) and vignetting. Stopping down ⅓–1 stop can sharpen corners at a cost in light.",
          "Focus manually: use live view magnified 10× on a bright star or planet and adjust until it's the smallest point possible. A Bahtinov mask makes this precise on telescopes.",
        ],
        formula: { expr: "Exposure ∝ t × ISO / N²", note: "t = shutter seconds, N = f-number" },
        fact: "The Milky Way's bright core is best seen from the northern hemisphere between roughly March and October.",
        sim: "exposure",
        check: [
          { q: "Which aperture lets in the most light?", options: ["f/16", "f/8", "f/4", "f/1.8"], answer: 3, why: "Smaller f-number = wider opening." },
          { q: "Going from 10 s to 20 s exposure is…", options: ["+1 stop", "+2 stops", "−1 stop", "No change"], answer: 0, why: "Doubling time doubles light: one stop." },
          { q: "Why shoot astrophotos in RAW?", options: ["Smaller files", "More data for editing and noise control", "Faster shooting", "Required by law"], answer: 1, why: "RAW keeps full sensor data." },
        ],
      },
      {
        id: "rule-of-500",
        title: "The Rule of 500 (and NPF)",
        minutes: 7,
        summary: "How long can you expose before stars trail?",
        lambda: "Earth keeps spinning while your shutter is open — the rule of 500 tells you how long before stars smear!",
        simple: [
          "Because Earth rotates, stars slowly drift across the sky. Leave your shutter open too long and pinpoint stars become little **streaks**.",
          "The **Rule of 500** is a quick way to avoid that: divide 500 by your lens's focal length. With a 20 mm lens: 500 ÷ 20 = **25 seconds**.",
          "If your camera has a smaller 'crop' sensor (common in beginner cameras), multiply the focal length by the crop factor first — about 1.5 for Nikon/Sony APS-C or 1.6 for Canon APS-C.",
          "Today's cameras have tiny pixels that show trailing more easily, so many photographers use a stricter **Rule of 300** or the more accurate **NPF rule**. Our simulator calculates both!",
        ],
        deep: [
          "Stars near the celestial equator move ~15 arcseconds per second of time. Trailing becomes visible once motion exceeds roughly a pixel or the eye's resolution at print size.",
          "The Rule of 500 (t = 500 / (f × crop)) dates from film, assuming moderate enlargement. On 24–60 MP sensors it often allows 2–3× too much trailing for pixel-level sharpness.",
          "The simplified NPF rule (Frédéric Michaud, Société Astronomique de France) accounts for aperture N, pixel pitch p (µm) and focal length f (mm): t ≈ (35N + 30p) / f. The full version includes declination: stars near the celestial poles move much less, so you can expose longer when pointing toward Polaris.",
          "Pixel pitch ≈ sensor width (mm) / horizontal pixels × 1000. A 24 MP full-frame sensor (6000 px across 36 mm) has p ≈ 6 µm.",
        ],
        formula: { expr: "t_max = 500 / (focal length × crop factor)", note: "NPF (simplified): t ≈ (35 × N + 30 × pixel pitch µm) / focal length" },
        fact: "Point your camera at Polaris for a long exposure and stars trace perfect circles — star trails!",
        sim: "rule500",
        check: [
          { q: "With a 25 mm lens on full-frame, the Rule of 500 gives…", options: ["5 s", "20 s", "50 s", "500 s"], answer: 1, why: "500 / 25 = 20 s." },
          { q: "On an APS-C camera (crop 1.5) with a 20 mm lens, max exposure is about…", options: ["10 s", "16.7 s", "25 s", "33 s"], answer: 1, why: "500 / (20 × 1.5) ≈ 16.7 s." },
          { q: "Why can you expose longer when pointing at Polaris?", options: ["It's brighter", "Stars near the pole move less across the sensor", "The Moon is there", "You can't"], answer: 1, why: "Apparent motion is smallest near the celestial poles." },
        ],
      },
      {
        id: "first-night",
        title: "Planning your first night out",
        minutes: 8,
        summary: "Dark skies, moon phases, weather and a field checklist.",
        lambda: "The best camera upgrade is a darker sky — and checking the Moon before you go!",
        simple: [
          "**Find darkness.** City lights wash out stars. Use a light-pollution map and drive away from towns. Astronomers rate darkness on the **Bortle scale** from 1 (pristine) to 9 (inner city).",
          "**Check the Moon.** A bright full moon floods the sky with light. The best nights for the Milky Way are around the **new moon**. Our Sky Tonight page shows the phase.",
          "**Check the weather.** You want clear skies, low humidity and steady air. Arrive before it's fully dark so you can set up safely.",
          "**Pack the kit:** camera, wide lens, tripod, spare batteries (cold drains them fast!), a red-light headlamp (red keeps your night vision), warm clothes and a friend. Let your eyes adapt for about 20–30 minutes.",
        ],
        deep: [
          "Astronomical twilight ends when the Sun is 18° below the horizon; only then is the sky fully dark. Near the summer solstice at high latitudes (above ~48.5°), true darkness may never arrive.",
          "Sky quality meters report brightness in magnitudes per square arcsecond (mag/arcsec²); a pristine site reaches ~21.9–22.0, a suburb ~19–20. Each 1.0 mag/arcsec² is a factor of ~2.5 in sky brightness.",
          "Plan compositions with planetarium software (e.g. Stellarium, which is free) to see where the galactic core rises. Dew heaters prevent condensation on lenses when temperatures drop below the dew point.",
          "Practise Leave No Trace and dark-sky etiquette: red light only, no headlights pointed at other observers, respect private land and sensitive habitats.",
        ],
        formula: { expr: "Dark sky window = end of astronomical twilight → Moon rise", note: "Astronomical twilight ends at solar altitude −18°" },
        fact: "It takes your eyes about 30 minutes to fully dark-adapt — and a single glance at a white phone screen can reset it.",
        sim: "moon",
        check: [
          { q: "The best Moon phase for Milky Way photos is…", options: ["Full moon", "New moon", "First quarter", "It doesn't matter"], answer: 1, why: "No moonlight to wash out faint detail." },
          { q: "Why use a red headlamp?", options: ["It's brighter", "Red light preserves night vision", "It attracts fewer bugs", "Fashion"], answer: 1, why: "Rod cells are less sensitive to red light." },
          { q: "On the Bortle scale, the darkest skies are…", options: ["Class 1", "Class 5", "Class 9", "Class 10"], answer: 0, why: "Class 1 = excellent dark site." },
        ],
      },
      {
        id: "trackers",
        title: "Star trackers & mounts",
        minutes: 8,
        summary: "Cancel Earth's rotation for long, sharp exposures.",
        lambda: "A star tracker turns slowly backwards to cancel out Earth's spin — so stars stay perfectly still!",
        simple: [
          "To capture faint nebulae and galaxies you need **minutes** of exposure, not seconds. But stars trail after just a few seconds on a tripod. The fix: a **star tracker**.",
          "A tracker is a small motorised mount that rotates your camera at exactly the same speed as the sky, but in the opposite direction to Earth's spin. Stars stay as sharp points.",
          "To work, the tracker's axis must point at the **celestial pole** — near Polaris in the north (or the faint region near Sigma Octantis in the south). This step is called **polar alignment**.",
          "Bigger telescopes use an **equatorial mount** that does the same thing with more weight capacity, often with a computer 'GoTo' system that finds thousands of objects for you.",
        ],
        deep: [
          "Trackers rotate at the sidereal rate, 360° per 23 h 56 m 4 s ≈ 15.04 arcsec/s, around an axis parallel to Earth's. Polar alignment errors cause field rotation and declination drift proportional to the misalignment.",
          "Periodic error from worm-gear imperfections causes slow back-and-forth drift. Autoguiding uses a small guide camera and scope to measure star position and send corrections (e.g. PHD2, free) several times per minute.",
          "Payload limits matter: a compact tracker may handle 3–5 kg; precise balance in both axes reduces strain. As a rule of thumb, unguided trackers comfortably handle up to ~135–200 mm focal lengths with 1–2 minute subs.",
          "Altitude–azimuth GoTo mounts can track but introduce field rotation in long exposures; derotators or short subs mitigate it. Equatorial wedges convert alt-az mounts to equatorial geometry.",
        ],
        formula: { expr: "Sidereal rate ≈ 15.04″ per second", note: "360° every 23 h 56 m 4 s" },
        fact: "With a tracker and a 135 mm lens, many beginners capture the Orion Nebula's glowing pink gas on their first night.",
        check: [
          { q: "A star tracker rotates to compensate for…", options: ["Wind", "Earth's rotation", "The Moon's orbit", "Camera shake"], answer: 1, why: "It counter-rotates at the sidereal rate." },
          { q: "Polar alignment means pointing the tracker's axis at…", options: ["The Moon", "The celestial pole", "The horizon", "The Sun"], answer: 1, why: "Its axis must be parallel to Earth's." },
          { q: "Autoguiding helps by…", options: ["Adding colour", "Correcting small tracking errors in real time", "Making the camera lighter", "Focusing automatically"], answer: 1, why: "A guide camera feeds corrections to the mount." },
        ],
      },
      {
        id: "processing",
        title: "Stacking & processing",
        minutes: 10,
        summary: "Calibration frames, stacking and stretching your data.",
        lambda: "Take lots of photos and average them — the stars add up, but the noise cancels out!",
        simple: [
          "One astro photo usually looks grainy. The secret of beautiful deep-sky images is **stacking**: take many photos of the same target, then combine them with software.",
          "Why does it work? The real signal (stars, nebulae) is the same in every photo, so it adds up. The grainy noise is random, so it partly **cancels out**. 16 photos stacked are about **4× less noisy** than one.",
          "Astrophotographers also shoot **calibration frames**: **darks** (lens cap on, same settings) to remove sensor glow, **flats** (an evenly lit white target) to remove dust spots and dark corners, and **bias** frames (fastest shutter) for read noise.",
          "Finally you **stretch** the image — brightening faint parts without blowing out stars — and adjust colour. Free tools like **Siril** and **DeepSkyStacker** are great places to start.",
        ],
        deep: [
          "For N frames with independent noise, SNR improves as √N: quadrupling total integration time doubles SNR. This is why deep-sky imagers collect hours of 'integration'.",
          "Calibration: master bias (read-noise offset), master dark (thermal signal, matched in exposure and temperature), master flat (pixel-response and vignetting map). The calibrated light ≈ (light − dark) / normalised flat.",
          "Stacking algorithms register (align) frames by star patterns, then combine with outlier rejection (sigma clipping, winsorized sigma) to remove satellite trails, planes and hot pixels. Dithering between frames decorrelates fixed-pattern noise.",
          "Linear data then gets a non-linear stretch (histogram transformation, arcsinh, generalised hyperbolic stretch). Narrowband filters (Hα 656.3 nm, OIII 500.7 nm, SII 672.4 nm) isolate emission lines and are mapped to colours — the 'Hubble palette' maps SII→red, Hα→green, OIII→blue.",
        ],
        formula: { expr: "SNR_stack = SNR_single × √N", note: "N = number of frames stacked" },
        fact: "The famous Hubble 'Pillars of Creation' uses the SHO palette — those colours represent specific elements, not what your eye would see.",
        sim: "stacking",
        check: [
          { q: "Stacking 25 frames improves SNR by about…", options: ["2×", "5×", "12.5×", "25×"], answer: 1, why: "√25 = 5." },
          { q: "Flat frames help remove…", options: ["Stars", "Dust shadows and vignetting", "The Moon", "Clouds"], answer: 1, why: "They map uneven illumination across the sensor." },
          { q: "Dark frames are taken…", options: ["Pointing at the Moon", "With the lens capped at the same settings", "In daylight", "With flash"], answer: 1, why: "They capture thermal signal and hot pixels." },
        ],
      },
    ],
  },
];

export const lessonKey = (t: string, l: string) => `${t}/${l}`;
export const trackById = (id?: string) => TRACKS.find((t) => t.id === id);
export const TOTAL_LESSONS = TRACKS.reduce((n, t) => n + t.lessons.length, 0);
export const TRACK_KEYS: Record<string, string[]> = Object.fromEntries(
  TRACKS.map((t) => [t.id, t.lessons.map((l) => lessonKey(t.id, l.id))]),
);
