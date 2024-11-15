'use strict';

class MenuButtonActions {
  constructor(domNode, performMenuAction) {
    this.domNode = domNode;
    this.performMenuAction = performMenuAction;
    this.buttonNode = domNode.querySelector('button');
    this.menuNode = domNode.querySelector('[role="menu"]');
    this.menuitemNodes = [];
    this.firstMenuitem = null;
    this.lastMenuitem = null;

    const nodes = domNode.querySelectorAll('[role="menuitem"]');

    nodes.forEach((menuitem, index) => {
      this.menuitemNodes.push(menuitem);
      menuitem.tabIndex = -1;

      if (index === 0) this.firstMenuitem = menuitem;
      if (index === nodes.length - 1) this.lastMenuitem = menuitem;

      menuitem.addEventListener('keydown', this.onMenuitemKeydown.bind(this));
      menuitem.addEventListener('click', this.onMenuitemClick.bind(this));
    });

    this.buttonNode.addEventListener('keydown', this.onButtonKeydown.bind(this));
    this.buttonNode.addEventListener('click', this.onButtonClick.bind(this));
  }

  setFocusToMenuitem(newMenuitem) {
    this.menuitemNodes.forEach((item) => item.tabIndex = -1);
    newMenuitem.tabIndex = 0;
    newMenuitem.focus();
  }

  setFocusToFirstMenuitem() {
    this.setFocusToMenuitem(this.firstMenuitem);
  }

  setFocusToLastMenuitem() {
    this.setFocusToMenuitem(this.lastMenuitem);
  }

  setFocusToPreviousMenuitem(currentMenuitem) {
    const index = this.menuitemNodes.indexOf(currentMenuitem);
    const newMenuitem = index === 0 ? this.lastMenuitem : this.menuitemNodes[index - 1];
    this.setFocusToMenuitem(newMenuitem);
  }

  setFocusToNextMenuitem(currentMenuitem) {
    const index = this.menuitemNodes.indexOf(currentMenuitem);
    const newMenuitem = index === this.menuitemNodes.length - 1 ? this.firstMenuitem : this.menuitemNodes[index + 1];
    this.setFocusToMenuitem(newMenuitem);
  }

  onButtonKeydown(event) {
    let flag = false;

    switch (event.key) {
      case 'Enter':
      case 'ArrowDown':
        this.openPopup();
        this.setFocusToFirstMenuitem();
        flag = true;
        break;

      case 'Escape':
        this.closePopup();
        this.buttonNode.focus();
        flag = true;
        break;

      case 'ArrowUp':
        this.openPopup();
        this.setFocusToLastMenuitem();
        flag = true;
        break;
    }

    if (flag) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onButtonClick(event) {
    if (this.isOpen()) {
      this.closePopup();
    } else {
      this.openPopup();
      this.setFocusToFirstMenuitem();
    }
    event.preventDefault();
    event.stopPropagation();
  }

  openPopup() {
    this.menuNode.style.display = 'block';
    this.buttonNode.setAttribute('aria-expanded', 'true');
  }

  closePopup() {
    if (this.isOpen()) {
      this.buttonNode.removeAttribute('aria-expanded');
      this.menuNode.style.display = 'none';
    }
  }

  isOpen() {
    return this.buttonNode.getAttribute('aria-expanded') === 'true';
  }

  onMenuitemKeydown(event) {
    let flag = false;

    switch (event.key) {
      case 'ArrowDown':
        this.setFocusToNextMenuitem(event.currentTarget);
        flag = true;
        break;

      case 'ArrowUp':
        this.setFocusToPreviousMenuitem(event.currentTarget);
        flag = true;
        break;

      case 'Enter':
        this.performMenuAction(event.currentTarget);
        this.closePopup();
        this.buttonNode.focus();
        flag = true;
        break;

      case 'Escape':
        this.closePopup();
        this.buttonNode.focus();
        flag = true;
        break;
    }

    if (flag) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onMenuitemClick(event) {
    this.performMenuAction(event.currentTarget);
    this.closePopup();
    this.buttonNode.focus();
  }
}

window.addEventListener('load', () => {
  function performMenuAction(node) {
    document.getElementById('action_output').value = node.textContent.trim();
  }

  document.querySelectorAll('.menu-button-actions').forEach((menu) => {
    new MenuButtonActions(menu, performMenuAction);
  });
});

