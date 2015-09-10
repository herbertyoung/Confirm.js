(function(exports, undefined){
	'use strict';
	var document = exports.document;
	function createDiv(class_name){
		var div = document.createElement('div');
		div.setAttribute('class', class_name);
		document.body.appendChild(div);
		if(class_name === 'confirm'){
			createConfirmDescendants(div);
		}
		return div;
	}
	function createConfirmDescendants(context){
		var confirm_header = createDiv('confirm-header'),
			confirm_main = createDiv('confirm-main'),
			confirm_footer = createDiv('confirm-footer'),
			btn_close = createDiv('close rounded'),
			paragraph = document.createElement('p'),
			btn_confirm = createDiv('button'),
			btn_cancel = createDiv('button');
		btn_close.dataset.action = 'close';
		confirm_header.appendChild(btn_close);
		confirm_main.appendChild(paragraph);
		btn_confirm.textContent = '确定';
		btn_confirm.dataset.action = 'confirm';
		btn_cancel.textContent = '取消';
		btn_cancel.dataset.action = 'close';
		confirm_footer.appendChild(btn_confirm);
		confirm_footer.appendChild(btn_cancel);
		context.appendChild(confirm_header);
		context.appendChild(confirm_main);
		context.appendChild(confirm_footer);
	}
	function Confirm(){
		if(!(this instanceof Confirm)) return;
		return this;
	}
	Confirm.prototype = {
		init: function(){
			this.mask = this.mask || createDiv('mask');
			this.confirm = this.confirm || createDiv('confirm');
			this.initEvents.call(this);
			return this;
		},
		show: function(message, confirm_handler){
			this.confirm.querySelector('.confirm-main p').innerHTML = message || '';
			if(this.confirmHandler === null){
				this.confirmHandler = (confirm_handler && typeof confirm_handler === 'function') ? confirm_handler : null;
			}
			this.confirm.style.display = this.mask.style.display = 'block';
		},
		hide: function(){
			var _this = this;
			this.confirm.style.display = this.mask.style.display = 'none';
			if(this.confirmHandler){
				setTimeout(function(){
					_this.confirmHandler = null;
				}, 5e2);
			}
			exports.event && (exports.event.stopPropagation(), exports.event.preventDefault());
		},
		initEvents: function(){
			this.hideHandler = this.hideHandler || this.hide.bind(this);
			this.confirmEventProxyHandler = this.confirmEventProxyHandler || this.confirmEventProxy.bind(this);
			this.confirmHandler = null;
			this.mask.addEventListener('touchend', this.hideHandler, false);
			this.confirm.addEventListener('touchend', this.confirmEventProxyHandler, false);
		},
		removeEvents: function(){
			this.mask.removeEventListener('touchend', this.hideHandler, false);
			this.confirm.removeEventListener('touchend', this.confirmEventProxyHandler, false);
			this.hideHandler = this.confirmHandler = null;
		},
		reset: function(){
			this.removeEvents.call(this);
			this.confirm.style.display = this.mask.style.display = 'none';
		},
		confirmEventProxy: function(){
			var target = exports.event.target;
			switch(target.dataset.action){
				case 'close':
					this.hide.call(this);
					break;
				case 'confirm':
					this.hide.call(this);
					if(this.confirmHandler){
						this.confirmHandler.call(target);
					}
					break;
			}
		}
	}
	var confirm = new Confirm().init();
	exports.showConfirm = confirm.show.bind(confirm);
})(window);