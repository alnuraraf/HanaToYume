export function SupportPage() {
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <div class="support-page">
      <h1 class="support-title">Support NamiTube</h1>
      <p class="support-text">
        NamiTube is a free platform maintained by a small team. Your support helps us keep the servers running and the content flowing.
      </p>
      <div class="support-options">
        <div class="support-card">
          <h3>Patreon</h3>
          <p>Get exclusive badges and early access to new features.</p>
        </div>
        <div class="support-card">
          <h3>Ko-fi</h3>
          <p>Buy us a coffee to keep the late-night coding sessions going.</p>
        </div>
        <div class="support-card">
          <h3>Crypto</h3>
          <p>Support us anonymously with Bitcoin or Ethereum.</p>
        </div>
      </div>
    </div>
  `;
}