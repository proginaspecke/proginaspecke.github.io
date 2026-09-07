export function SponsorWelcome() {
  return (
    <>
      <div className="sponsor-backdrop" aria-hidden="true" />
      <header className="sponsor-header" aria-label="Reklama POZycja pierwsza">
        <a className="sponsor-logo" href="https://start.poz1.pl/" target="_blank" rel="sponsored noopener noreferrer" aria-label="POZycja pierwsza — strona reklamodawcy (nowa karta)">
          <img src="/assets/poz1/logo.png" alt="POZycja pierwsza" width="150" height="78" fetchPriority="high" />
        </a>
        <div className="sponsor-actions">
          <span className="sponsor-label">Reklama</span>

        </div>
      </header>
      <section className="sponsor-hero" aria-labelledby="sponsor-title">

        <h2 className="sponsor-title" id="sponsor-title">Pracuj szybciej i skuteczniej z aplikacją POZycja pierwsza<br />stworzoną dla lekarzy POZ oraz NiŚPL</h2>
        <p className="sponsor-proof">⭐ 13 000+ lekarzy | &gt;5 lat na rynku | tworzona przez lekarzy praktyków</p>
        <a className="sponsor-button" href="https://start.poz1.pl/" target="_blank" rel="sponsored noopener noreferrer">Poznaj aplikację <span aria-hidden="true">↗</span></a>
      </section>
    </>
  );
}
