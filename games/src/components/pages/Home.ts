import Page from './Page';
import '../../scss/layout/_home.scss';

class Home implements Page {
  public async render(): Promise<string> {
    const view = `
  <section class="promo">
    <div class="wrapper promo__wrapper">
      <h2 class="promo__title">Андрей учит TypeScript</h2>
    </div>
  </section>
    `;
    return view;
  }

  public async after_render(): Promise<void> {
    return;
  }
}

export default Home;
