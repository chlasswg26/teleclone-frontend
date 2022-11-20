export const listenChange = (value) => {
  let sel, range;
  sel = window.getSelection();
  if (sel.getRangeAt && sel.rangeCount) {
    range = sel.getRangeAt(0);
    range.deleteContents();
    // Range.createContextualFragment() would be useful here but is
    // only relatively recently standardized and is not supported in
    // some browsers (IE9, for one)
    let el = document.createElement("div");
    el.innerText = value;
    let frag = document.createDocumentFragment(),
      node,
      lastNode;
    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node);
    }
    range.insertNode(frag);

    // Preserve the selection
    if (lastNode) {
      range = range.cloneRange();
      range.setStartAfter(lastNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
};
