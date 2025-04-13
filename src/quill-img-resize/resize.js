// Custom Image Resize Module

class ImageResize {
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = options;
    this.img = null;
    this.overlay = null;
    this.resizeHandles = [];

    this.quill.root.addEventListener("click", this.handleClick, false);
    this.quill.root.addEventListener("scroll", this.handleScroll, false);
  }

  // Handle image selection
  handleClick = (evt) => {
    if (evt.target?.tagName?.toUpperCase() === "IMG") {
      if (this.img === evt.target) return;
      this.hide();
      this.show(evt.target);
    } else {
      this.hide();
    }
  };

  handleScroll = () => {
    if (!this.img || !this.overlay) return;
    if (this.scrollAnimationFrame) cancelAnimationFrame(this.scrollAnimationFrame);

    this.scrollAnimationFrame = requestAnimationFrame(() => this.updateOverlayPosition());
  }

  // Show the resize overlays
  show(img) {
    this.img = img;
    this.createOverlay();
    this.createResizeHandles();
  }

  createOverlay() {
    this.removeOverlay();
    this.overlay = document.createElement("div");
    Object.assign(this.overlay.style, {
      position: "absolute",
      border: "1px dashed rgba(0, 0, 0, 0.5)",
      background: "rgba(255, 255, 255, 0.3)",
    });
    this.quill.root.parentNode.style.overflow = 'auto'
    this.quill.root.parentNode.appendChild(this.overlay);
    this.updateOverlayPosition();
  }

  updateOverlayPosition() {
    if (!this.img || !this.overlay) return;
    const parent = this.quill.root.parentNode;
    const imgRect = this.img.getBoundingClientRect();
    const containerRect = parent.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
      top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
      width: `${imgRect.width}px`,
      height: `${imgRect.height}px`,
    });
  }

  createResizeHandles() {
    const handleStyles = {
      position: "absolute",
      width: "10px",
      height: "10px",
      backgroundColor: "black",
      cursor: "pointer",
    };
    const positions = [
      { top: "0", left: "0", clipPath: "polygon(0% 0%, 100% 0%, 0% 100%)" },
      { top: "0", right: "0", clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)" },
      { bottom: "0", left: "0", clipPath: "polygon(0% 100%, 100% 100%, 0% 0%)" },
      { bottom: "0", right: "0", clipPath: "polygon(100% 100%, 0% 100%, 100% 0%)" },
    ];

    this.resizeHandles = positions.map((pos) => {
      const handle = document.createElement("div");
      Object.assign(handle.style, handleStyles, pos);
      handle.addEventListener("mousedown", this.startResize);
      this.overlay.appendChild(handle);
      return handle;
    });
  }

  startResize = (evt) => {
    this.startX = evt.clientX;
    this.startY = evt.clientY;
    this.startWidth = this.img.offsetWidth;
    this.startHeight = this.img.offsetHeight;

    document.body.style.userSelect = "none";

    document.addEventListener("mousemove", this.onResize);
    document.addEventListener("mouseup", this.stopResize, { once: true });
  };

  onResize = (evt) => {
    if (!this.img) return;

    const dx = evt.clientX - this.startX;
    const dy = evt.clientY - this.startY;

    if (evt.shiftKey) {
      // Shift for vertical
      this.img.style.height = `${this.startHeight + dy}px`;
    } else if (evt.altKey) {
      // Alt for horizontal
      this.img.style.width = `${this.startWidth + dx}px`;
    } else {
      // Default
      this.img.style.width = `${this.startWidth + dx}px`;
      this.img.style.height = `${this.startHeight + dy}px`;
    }

    this.updateOverlayPosition();
  };

  stopResize = () => {
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", this.onResize);
    document.removeEventListener("mouseup", this.stopResize);
  };

  hide() {
    this.removeOverlay();
    this.img = null;
  }

  removeOverlay() {
    this.overlay?.remove();
    this.overlay = null;
    this.quill.root.parentNode.style.overflow = '';
    this.resizeHandles.forEach((handle) => handle.remove());
    this.resizeHandles = [];
  }
}

export default ImageResize;
