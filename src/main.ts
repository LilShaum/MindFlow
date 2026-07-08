import { CanvasPage } from './ui/CanvasPage.ts';

function bootstrap() {
  const appContainer = document.getElementById('app');
  if (appContainer) {
    const canvasPage = new CanvasPage(appContainer);
    canvasPage.mount();
  }
}

bootstrap();