// export default class ImageResize {
//   constructor(quill, options = {}) {
//     this.quill = quill;
//     this.options = options;
//     this.img = null;
//     this.overlay = null;
//     this.boxes = [];

//     this.handleClick = this.handleClick.bind(this);
//     this.handleSelectionChange = this.handleSelectionChange.bind(this);
//     this.handleTextChange = this.handleTextChange.bind(this);
//     this.handleMousedown = this.handleMousedown.bind(this);
//     this.handleMouseup = this.handleMouseup.bind(this);
//     this.handleDrag = this.handleDrag.bind(this);

//     this.dragBox = null;
//     this.dragStartX = 0;
//     this.dragStartY = 0;
//     this.preDragWidth = 0;
//     this.preDragHeight = 0;

//     this.options.handleStyles = {
//       position: "absolute",
//       width: "10px",
//       height: "10px",
//       backgroundColor: "white",
//       cursor: "pointer",
//     };

//     this.options.positions = [
//       { top: "0", left: "0", clipPath: "polygon(0% 0%, 100% 0%, 0% 100%)" },
//       { top: "0", right: "0", clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)" },
//       { bottom: "0", left: "0", clipPath: "polygon(0% 100%, 100% 100%, 0% 0%)" },
//       { bottom: "0", right: "0", clipPath: "polygon(100% 100%, 0% 100%, 100% 0%)" },
//     ];

//     this.options.minWidth = options.minWidth || 20;
//     this.options.minHeight = options.minHeight || 20;

//     this.options.overlayStyles = {
//       position: "absolute",
//       boxSizing: "border-box",
//       border: "1px dashed #777",
//       zIndex: 8,
//     };

//     this.quill.root.addEventListener("click", this.handleClick);
//     this.quill.on("selection-change", this.handleSelectionChange);
//     this.quill.on("text-change", this.handleTextChange);
//   }

//   handleClick(evt) {
//     if (evt.target.tagName === "IMG") {
//       const blot = this.quill.constructor.find(evt.target);
//       if (blot) this.quill.setSelection(blot.offset(this.quill.scroll), blot.length());
//     }
//   }

//   handleSelectionChange(range) {
//     if (!range) {
//       this.hide();
//       return;
//     }

//     const [blot] = this.quill.scroll.descendant(this.quill.constructor.import('formats/image'), range.index);

//     if (blot && blot.domNode instanceof HTMLImageElement) this.show(blot.domNode);
//     else this.hide();
//   }

//   handleTextChange() {
//     if (this.img && !this.quill.root.contains(this.img)) this.hide();
//   }

//   show(img) {
//     if (this.img === img) return;

//     this.hide();

//     this.img = img;
//     this.showOverlay();
//     this.addResizeHandles();
//     this.repositionElements();
//   }

//   hide() {
//     this.hideOverlay();
//     this.removeResizeHandles();
//     this.img = null;
//   }

//   showOverlay() {
//     this.overlay = document.createElement("div");
//     Object.assign(this.overlay.style, this.options.overlayStyles);
//     this.quill.root.parentNode.appendChild(this.overlay);
//   }

//   hideOverlay() {
//     if (this.overlay) {
//       this.overlay.remove();
//       this.overlay = null;
//     }
//   }

//   addResizeHandles() {
//     if (!this.overlay) return;

//     this.options.positions.forEach((pos) => {
//       const box = document.createElement("div");
//       Object.assign(box.style, this.options.handleStyles, pos);
//       box.style.clipPath = pos.clipPath;

//       box.addEventListener("mousedown", this.handleMousedown, false);
//       box.addEventListener("touchstart", this.handleMousedown, { passive: false });

//       this.overlay.appendChild(box);
//       this.boxes.push(box);
//     });
//   }

//   removeResizeHandles() {
//     this.boxes.forEach((box) => {
//       box.removeEventListener("mousedown", this.handleMousedown);
//       box.removeEventListener("touchstart", this.handleMousedown);
//       box.remove();
//     });
//     this.boxes = [];
//   }

//   repositionElements() {
//     if (!this.img || !this.overlay) return;

//     const parent = this.quill.root.parentNode;
//     const imgRect = this.img.getBoundingClientRect();
//     const containerRect = parent.getBoundingClientRect();

//     Object.assign(this.overlay.style, {
//       left: `${imgRect.left - containerRect.left - 1 + parent.scrollLeft}px`,
//       top: `${imgRect.top - containerRect.top + parent.scrollTop}px`,
//       width: `${imgRect.width}px`,
//       height: `${imgRect.height}px`,
//     });
//   }

//   handleMousedown(evt) {
//     evt.preventDefault();
//     if (!(evt.target instanceof HTMLElement)) return;

//     this.dragBox = evt.target;

//     if (evt.type === "touchstart") {
//       this.dragStartX = evt.changedTouches[0].clientX;
//       this.dragStartY = evt.changedTouches[0].clientY;
//     } else {
//       this.dragStartX = evt.clientX;
//       this.dragStartY = evt.clientY;
//     }

//     if (this.img) {
//       this.preDragWidth = this.img.width || this.img.naturalWidth;
//       this.preDragHeight = this.img.height || this.img.naturalHeight;
//     }

//     document.addEventListener("mousemove", this.handleDrag);
//     document.addEventListener("touchmove", this.handleDrag, { passive: false });
//     document.addEventListener("mouseup", this.handleMouseup, true);
//     document.addEventListener("touchend", this.handleMouseup, true);
//     document.addEventListener("touchcancel", this.handleMouseup, true);
//   }

//   handleMouseup(evt) {
//     evt.stopPropagation();
//     document.removeEventListener("mousemove", this.handleDrag);
//     document.removeEventListener("touchmove", this.handleDrag);
//     document.removeEventListener("mouseup", this.handleMouseup, true);
//     document.removeEventListener("touchend", this.handleMouseup, true);
//     document.removeEventListener("touchcancel", this.handleMouseup, true);
//   }

//   handleDrag(evt) {
//     if (!this.img) return;

//     let clientX, clientY;
//     if (evt.type === "touchmove") {
//       clientX = evt.changedTouches[0].clientX;
//       clientY = evt.changedTouches[0].clientY;
//     } else {
//       clientX = evt.clientX;
//       clientY = evt.clientY;
//     }

//     let deltaX = clientX - this.dragStartX;
//     let deltaY = clientY - this.dragStartY;

//     let startWidth = this.preDragWidth;
//     let startHeight = this.preDragHeight;
//     let aspectRatio = startWidth / startHeight;

//     if (evt.shiftKey) {
//       // SHIFT: Vertical only
//       let newHeight = startHeight + deltaY;
//       newHeight = Math.max(newHeight, this.options.minHeight);
//       this.img.style.height = newHeight + "px";
//     } else if (evt.altKey) {
//       // ALT: Horizontal only
//       let newWidth = startWidth + deltaX;
//       newWidth = Math.max(newWidth, this.options.minWidth);
//       this.img.style.width = newWidth + "px";
//     } else {
//       // Default
//       const delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

//       let newWidth = startWidth + delta;
//       let newHeight = newWidth / aspectRatio;

//       newWidth = Math.max(newWidth, this.options.minWidth);
//       newHeight = Math.max(newHeight, this.options.minHeight);

//       this.img.style.width = newWidth + "px";
//       this.img.style.height = newHeight + "px";
//     }

//     this.repositionElements();

//     this.dragStartX = clientX;
//     this.dragStartY = clientY;
//     this.preDragWidth = this.img.offsetWidth;
//     this.preDragHeight = this.img.offsetHeight;
//   }
// }
