/* Accepts input and converts it to commands for the model or view. */
import Model from './model';
import View from './view';

class Controller {
  static start(): void {
    console.log(Model.getHello());
    View.appenDivToBody();
  }
}

export default Controller;
