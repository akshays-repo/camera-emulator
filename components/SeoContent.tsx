export default function SeoContent() {
  return (
    <section className="seo-section" aria-label="Photography guide">

      <h1>Learn Photography: ISO, Aperture &amp; Shutter Speed</h1>
      <p className="seo-lead">
        The camera above is a live simulator — every dial you turn produces a real optical result.
        Below is a plain-language guide to the three settings that control every photograph ever taken.
      </p>

      {/* ── ISO ───────────────────────────────────────────────────────── */}
      <h2 className="seo-h2">ISO — Sensor Sensitivity</h2>
      <p className="seo-p">
        ISO measures how sensitive your camera&apos;s sensor is to light. A <strong>low ISO (100–400)</strong> means
        the sensor is less sensitive — it needs more light to make a proper exposure, but the resulting image
        is clean and smooth. A <strong>high ISO (1600–6400+)</strong> makes the sensor more sensitive so you
        can shoot in dim environments, but it introduces visible grain (noise) — the colored speckles you
        can see in the simulator when you push ISO above 800.
      </p>
      <p className="seo-p">
        Think of ISO like the speed of old film. ISO 100 film was slow and silky; ISO 3200 film was fast
        and grainy. Digital cameras work the same way — the sensor amplifies its signal, and that
        amplification also amplifies electronic noise.
      </p>

      <div className="seo-example">
        <div><span className="seo-label">Sunny day landscape</span> <span className="seo-val">ISO 100</span> <span className="seo-note">— clean, maximum detail</span></div>
        <div><span className="seo-label">Indoor event</span>        <span className="seo-val">ISO 800</span> <span className="seo-note">— acceptable noise, usable</span></div>
        <div><span className="seo-label">Night street</span>        <span className="seo-val">ISO 3200</span><span className="seo-note">— visible grain, still workable</span></div>
        <div><span className="seo-label">Dark concert</span>        <span className="seo-val">ISO 6400</span><span className="seo-note">— heavy noise, extreme low-light</span></div>
      </div>

      <p className="seo-p">
        Try it in the simulator: set shutter to <strong>1/125s</strong> and aperture to <strong>f/5.6</strong>,
        then sweep ISO from 100 to 6400. You&apos;ll see the image brighten and graininess appear in the shadows.
      </p>

      {/* ── Aperture ──────────────────────────────────────────────────── */}
      <h2 className="seo-h2">Aperture — The Lens Opening</h2>
      <p className="seo-p">
        Aperture is the size of the hole inside your lens that lets light through. It is measured in
        <strong> f-stops</strong> (written f/1.8, f/5.6, f/16, etc.). Here is the counterintuitive part:
        <strong> a smaller f-number means a larger opening</strong>, which lets in more light.
        f/1.8 is a wide-open lens; f/16 is a very small opening.
      </p>
      <p className="seo-p">
        Each full f-stop either doubles or halves the amount of light reaching the sensor.
        Going from f/2.8 to f/5.6 is exactly two stops darker; going from f/8 to f/4 is
        two stops brighter. In the simulator, aperture only changes brightness — in a real
        camera it also controls depth of field (how much of the scene is in focus),
        but that effect is shown separately.
      </p>

      <div className="seo-example">
        <div><span className="seo-label">f / 1.8</span> <span className="seo-val">Wide open</span>  <span className="seo-note">— most light, shallow focus (portraits)</span></div>
        <div><span className="seo-label">f / 5.6</span> <span className="seo-val">Mid range</span>   <span className="seo-note">— balanced light, general use</span></div>
        <div><span className="seo-label">f / 11</span>  <span className="seo-val">Stopped down</span><span className="seo-note">— less light, deep focus (landscapes)</span></div>
        <div><span className="seo-label">f / 16</span>  <span className="seo-val">Very small</span>  <span className="seo-note">— darkest, maximum depth of field</span></div>
      </div>

      <p className="seo-p">
        Try it: hold shutter and ISO constant, then move the aperture dial from f/1.8 to f/16.
        You&apos;ll see the image darken by roughly six stops — that&apos;s a 64× reduction in light.
      </p>

      {/* ── Shutter Speed ─────────────────────────────────────────────── */}
      <h2 className="seo-h2">Shutter Speed — Exposure Time</h2>
      <p className="seo-p">
        Shutter speed is how long the camera&apos;s sensor is exposed to light. Written as a fraction of a second
        (1/1000s, 1/60s) or whole seconds (1&quot;, 30&quot;), it controls two things simultaneously:
        <strong> how much light reaches the sensor</strong> and <strong>how motion appears in the photo</strong>.
      </p>
      <p className="seo-p">
        A <strong>fast shutter</strong> (1/500s or faster) freezes motion completely — you can see
        individual water drops in a splash, or read the writing on a spinning tire. A
        <strong> slow shutter</strong> (1/30s or slower) lets moving subjects blur across the frame —
        waterfalls become silky white curtains, car headlights become streaks of light,
        and helicopter rotors become translucent discs.
      </p>

      <div className="seo-example">
        <div><span className="seo-label">1 / 1000 s</span><span className="seo-val">Frozen</span>     <span className="seo-note">— rotor blades sharp, water drops visible</span></div>
        <div><span className="seo-label">1 / 250 s</span> <span className="seo-val">Near-sharp</span> <span className="seo-note">— slight softening on fast subjects</span></div>
        <div><span className="seo-label">1 / 60 s</span>  <span className="seo-val">Blurring</span>   <span className="seo-note">— rotor arc visible, water streaks forming</span></div>
        <div><span className="seo-label">1 / 8 s</span>   <span className="seo-val">Heavy blur</span> <span className="seo-note">— rotor becomes disc, water is silky</span></div>
        <div><span className="seo-label">1 s</span>        <span className="seo-val">Long exposure</span><span className="seo-note">— full motion disc, light trails appear</span></div>
      </div>

      <p className="seo-p">
        Switch to the <strong>Waterfall</strong> or <strong>Helicopter</strong> scene and scrub the
        shutter dial from 1/1000s down to 1&quot; — this is the clearest way to see shutter speed
        in action. The <strong>City Night</strong> scene shows light trails from car headlights and
        taillights at slow shutter speeds, exactly like real long-exposure night photography.
      </p>

      {/* ── Exposure Triangle ─────────────────────────────────────────── */}
      <h2 className="seo-h2">The Exposure Triangle</h2>
      <p className="seo-p">
        ISO, aperture, and shutter speed always work together. Every time you change one,
        you need to compensate with another to keep the overall exposure correct.
        This relationship is called the <strong>exposure triangle</strong>.
      </p>

      <div className="seo-triangle">
        <div className="seo-tri-card">
          <span className="seo-tri-icon">◉</span>
          <div className="seo-tri-name">ISO</div>
          <div className="seo-tri-desc">Sensor amplification<br />Low = clean<br />High = grainy</div>
        </div>
        <div className="seo-tri-card">
          <span className="seo-tri-icon">⌀</span>
          <div className="seo-tri-name">Aperture</div>
          <div className="seo-tri-desc">Lens opening size<br />f/1.8 = wide<br />f/16 = narrow</div>
        </div>
        <div className="seo-tri-card">
          <span className="seo-tri-icon">⏱</span>
          <div className="seo-tri-name">Shutter</div>
          <div className="seo-tri-desc">Exposure duration<br />1/1000s = frozen<br />1s = blurred</div>
        </div>
      </div>

      <p className="seo-p">
        A classic trade-off: you&apos;re shooting a sports event indoors (low light, fast subject).
        You need a fast shutter to freeze the athlete — say 1/500s. But that shutter lets in very
        little light, so you open the aperture to f/2.8 and raise ISO to 1600 to compensate.
        The EV meter at the bottom of the simulator shows whether your three settings are balanced
        (center) or over/under-exposed (right/left of center).
      </p>
      <p className="seo-p">
        There is no single &quot;correct&quot; combination — only trade-offs. The simulator lets you explore
        all of them without risking a shot on an actual camera. Dial in a setting, press the
        shutter button, and the photo saves to your roll so you can compare results side by side.
      </p>

      <p className="seo-footer">
        Camera Simulator — Free interactive photography learning tool
      </p>
    </section>
  );
}
