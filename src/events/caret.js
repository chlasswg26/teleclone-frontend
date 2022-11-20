export const caret = (setSelectionData) => {
  if (window.getSelection && document.createRange) {
    setSelectionData({
      saveSelection: (containerEl) => {
        let range = window.getSelection().getRangeAt(0);
        let preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerEl);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        let start = preSelectionRange.toString().length;

        return {
          start: start,
          end: start + range.toString().length,
        };
      },
      restoreSelection: (containerEl, savedSel) => {
        let charIndex = 0,
          range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        let nodeStack = [containerEl],
          node,
          foundStart = false,
          stop = false;

        while (!stop && (node = nodeStack.pop())) {
          if (node.nodeType === 3) {
            let nextCharIndex = charIndex + node.length;
            if (
              !foundStart &&
              savedSel.start >= charIndex &&
              savedSel.start <= nextCharIndex
            ) {
              range.setStart(node, savedSel.start - charIndex);
              foundStart = true;
            }
            if (
              foundStart &&
              savedSel.end >= charIndex &&
              savedSel.end <= nextCharIndex
            ) {
              range.setEnd(node, savedSel.end - charIndex);
              stop = true;
            }
            charIndex = nextCharIndex;
          } else {
            let i = node.childNodes.length;
            while (i--) {
              nodeStack.push(node.childNodes[i]);
            }
          }
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      },
    });
  } else if (document.selection && document.body.createTextRange) {
    setSelectionData({
      saveSelection: (containerEl) => {
        let selectedTextRange = document.selection.createRange();
        let preSelectionTextRange = document.body.createTextRange();
        preSelectionTextRange.moveToElementText(containerEl);
        preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
        let start = preSelectionTextRange.text.length;

        return {
          start: start,
          end: start + selectedTextRange.text.length,
        };
      },
      restoreSelection: (containerEl, savedSel) => {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(containerEl);
        textRange.collapse(true);
        textRange.moveEnd("character", savedSel.end);
        textRange.moveStart("character", savedSel.start);
        textRange.select();
      },
    });
  }
};
