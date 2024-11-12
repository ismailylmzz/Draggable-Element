class Draggable {
  constructor(elementSelector, targetSelector) {
    this.element = document.querySelector(elementSelector);
    this.target = document.querySelector(targetSelector);
    this.isPinned = false;
    
    this.init();
  }

  init() {
    this.setupInitialPosition();
    this.addEventListeners();
  }

  setupInitialPosition() {
    this.element.style.position = "fixed";
    this.element.style.top = "100px"; // Default initial position
    this.element.style.left = "100px";
  }

  addEventListeners() {
    const pinButton = this.element.querySelector("#pin");
    const header = this.element.querySelector("#dragheader");

    if (pinButton) {
      pinButton.addEventListener("click", () => this.togglePin());
    }

    if (header) {
      header.onmousedown = (e) => this.dragMouseDown(e);
    }
  }

  togglePin() {
    this.isPinned = !this.isPinned;
    if (this.isPinned) {
      // Pin the element at the target's position with padding
      this.element.style.top = `${this.target.offsetTop + 10}px`;
      this.element.style.left = `${this.target.offsetLeft + this.target.offsetWidth - this.element.offsetWidth - 10}px`;
      this.element.classList.add("pinned");
    } else {
      // Allow dragging again
      this.element.classList.remove("pinned");
    }
  }

  dragMouseDown(e) {
    if (this.isPinned) return;

    e = e || window.event;
    e.preventDefault();
    this.pos3 = e.clientX;
    this.pos4 = e.clientY;
    document.onmouseup = () => this.closeDragElement();
    document.onmousemove = (e) => this.elementDrag(e);
  }

  elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    const pos1 = this.pos3 - e.clientX;
    const pos2 = this.pos4 - e.clientY;
    this.pos3 = e.clientX;
    this.pos4 = e.clientY;

    // Calculate new position
    let newTop = this.element.offsetTop - pos2;
    let newLeft = this.element.offsetLeft - pos1;

    // Constrain to window boundaries
    const maxX = window.innerWidth - this.element.offsetWidth;
    const maxY = window.innerHeight - this.element.offsetHeight;

    if (newTop < 0) newTop = 0;
    if (newLeft < 0) newLeft = 0;
    if (newTop > maxY) newTop = maxY;
    if (newLeft > maxX) newLeft = maxX;

    // Update position
    this.element.style.top = `${newTop}px`;
    this.element.style.left = `${newLeft}px`;
  }

  closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Example usage
document.addEventListener("DOMContentLoaded", () => {
  new Draggable("#drag", "body"); // Pass the element and target selectors
});
