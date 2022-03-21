import Component from './common/Component';
import '../scss/layout/_footer.scss';

class Footer implements Component {
  private class: string;

  public constructor(options) {
    this.class = options.class;
  }

  public async render(): Promise<string> {
    const view = `
    <div class="wrapper footer__wrapper ${this.class ? this.class : ''}">
      <div class="footer__content">
        <a class="link contacts__link" href="https://github.com/Andrei-Anaheim">Andrei-Anaheim</a>  
        <div>2022</div>
      </div>
    </div>
    `;
    return view;
  }

  public async after_render(): Promise<void> {
    return;
  }
}

export default Footer;