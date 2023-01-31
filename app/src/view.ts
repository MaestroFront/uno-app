/* Any representation of information */
class View {
  static appenDivToBody(): void {
    const div: HTMLElement = document.createElement('div');
    document.body.append(div);
  }
}

export default View;
