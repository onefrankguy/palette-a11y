function Fn(selector) {
  if (selector instanceof Fn) {
    return selector;
  }

  this.element = selector;

  if (typeof selector === 'string') {
    if (selector.indexOf('#') === 0) {
      this.element = document.getElementById(selector.slice(1));
    }
  }

  return this;
}

Fn.prototype.html = function html(value) {
  if (this.element) {
    if (value === undefined) {
      return this.element.innerHTML;
    }

    this.element.innerHTML = value;
  }

  return this;
};

Fn.prototype.change = function change(handler) {
  if (this.element && typeof handler === 'function') {
    this.element.addEventListener('change', handler);
  }
};

Fn.prototype.input = function input(handler) {
  if (this.element && typeof handler === 'function') {
    this.element.addEventListener('input', handler);
  }
};

Fn.prototype.click = function click(downHandler, upHandler) {
  if (this.element) {
    if (typeof downHandler === 'function') {
      this.element.addEventListener('mousedown', downHandler);
    }
    if (typeof upHandler === 'function') {
      this.element.addEventListener('mouseup', upHandler);
    }
  }
};

function root(selector) {
  return new Fn(selector);
}

module.exports = root;
